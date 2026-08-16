from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from auth import get_current_user
from database import get_db
from models import User, WatchlistItem
from schemas import WatchlistCreate, WatchlistResponse

router = APIRouter(
    prefix="/watchlist",
    tags=["Watchlist"],
)


@router.get("/", response_model=list[WatchlistResponse])
def get_watchlist(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    watchlist_items = (
        db.query(WatchlistItem)
        .filter(WatchlistItem.user_id == current_user.id)
        .order_by(WatchlistItem.id.desc())
        .all()
    )

    return watchlist_items


@router.post("/", response_model=WatchlistResponse)
def add_watchlist_item(
    item: WatchlistCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    ticker = item.ticker.upper().strip()

    existing_item = (
        db.query(WatchlistItem)
        .filter(
            WatchlistItem.user_id == current_user.id,
            WatchlistItem.ticker == ticker,
        )
        .first()
    )

    if existing_item:
        existing_item.company_name = item.company_name
        existing_item.latest_price = item.latest_price
        existing_item.risk_level = item.risk_level
        existing_item.annualized_volatility = item.annualized_volatility

        db.commit()
        db.refresh(existing_item)

        return existing_item

    new_item = WatchlistItem(
        user_id=current_user.id,
        ticker=ticker,
        company_name=item.company_name,
        latest_price=item.latest_price,
        risk_level=item.risk_level,
        annualized_volatility=item.annualized_volatility,
    )

    db.add(new_item)
    db.commit()
    db.refresh(new_item)

    return new_item


@router.delete("/{ticker}")
def remove_watchlist_item(
    ticker: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    ticker = ticker.upper().strip()

    item = (
        db.query(WatchlistItem)
        .filter(
            WatchlistItem.user_id == current_user.id,
            WatchlistItem.ticker == ticker,
        )
        .first()
    )

    if not item:
        raise HTTPException(
            status_code=404,
            detail="Watchlist item not found.",
        )

    db.delete(item)
    db.commit()

    return {
        "message": f"{ticker} removed from watchlist."
    }