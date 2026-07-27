from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from auth import get_current_user
from database import get_db
from models import User, WatchlistItem
from schemas import WatchlistItemCreate, WatchlistItemResponse

router = APIRouter(prefix="/user/watchlist", tags=["User Watchlist"])


@router.get("/", response_model=list[WatchlistItemResponse])
def get_user_watchlist(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    watchlist_items = (
        db.query(WatchlistItem)
        .filter(WatchlistItem.user_id == current_user.id)
        .order_by(WatchlistItem.saved_at.desc())
        .all()
    )

    return watchlist_items


@router.post("/", response_model=WatchlistItemResponse)
def add_watchlist_item(
    item_data: WatchlistItemCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    ticker = item_data.ticker.upper().strip()

    existing_item = (
        db.query(WatchlistItem)
        .filter(
            WatchlistItem.user_id == current_user.id,
            WatchlistItem.ticker == ticker,
        )
        .first()
    )

    if existing_item:
        existing_item.company_name = item_data.company_name
        existing_item.latest_price = item_data.latest_price
        existing_item.risk_level = item_data.risk_level
        existing_item.annualized_volatility = item_data.annualized_volatility

        db.commit()
        db.refresh(existing_item)

        return existing_item

    new_item = WatchlistItem(
        user_id=current_user.id,
        ticker=ticker,
        company_name=item_data.company_name,
        latest_price=item_data.latest_price,
        risk_level=item_data.risk_level,
        annualized_volatility=item_data.annualized_volatility,
    )

    db.add(new_item)
    db.commit()
    db.refresh(new_item)

    return new_item


@router.delete("/{ticker}")
def remove_watchlist_item(
    ticker: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    watchlist_item = (
        db.query(WatchlistItem)
        .filter(
            WatchlistItem.user_id == current_user.id,
            WatchlistItem.ticker == ticker.upper().strip(),
        )
        .first()
    )

    if not watchlist_item:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Watchlist item not found.",
        )

    db.delete(watchlist_item)
    db.commit()

    return {"message": "Watchlist item removed successfully."}


@router.delete("/")
def clear_user_watchlist(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    db.query(WatchlistItem).filter(
        WatchlistItem.user_id == current_user.id
    ).delete()

    db.commit()

    return {"message": "Watchlist cleared successfully."}