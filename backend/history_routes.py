from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from auth import get_current_user
from database import get_db
from models import SearchHistoryItem, User
from schemas import SearchHistoryCreate

router = APIRouter(
    prefix="/history",
    tags=["History"],
)


def history_item_to_dict(item):
    return {
        "id": item.id,
        "ticker": item.ticker,
        "company_name": getattr(item, "company_name", None),
        "latest_price": getattr(item, "latest_price", None),
        "risk_level": getattr(item, "risk_level", None),
        "annualized_volatility": getattr(item, "annualized_volatility", None),
        "maximum_drawdown": getattr(item, "maximum_drawdown", None),
        "average_daily_return": getattr(item, "average_daily_return", None),
        "volatility": getattr(item, "volatility", None),
        "period": getattr(item, "period", None),
        "searched_at": str(getattr(item, "searched_at", "")),
    }


@router.get("")
@router.get("/")
def get_history(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    try:
        history_items = (
            db.query(SearchHistoryItem)
            .filter(SearchHistoryItem.user_id == current_user.id)
            .order_by(SearchHistoryItem.id.desc())
            .limit(30)
            .all()
        )

        return [history_item_to_dict(item) for item in history_items]

    except Exception as error:
        print("Cloud history load backend error:", error)
        raise HTTPException(
            status_code=500,
            detail=str(error)
        )

@router.post("")
@router.post("/")
def add_history_item(
    history_item: SearchHistoryCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    try:
        ticker = history_item.ticker.upper().strip()

        existing_item = (
            db.query(SearchHistoryItem)
            .filter(
                SearchHistoryItem.user_id == current_user.id,
                SearchHistoryItem.ticker == ticker,
            )
            .first()
        )

        if existing_item:
            existing_item.company_name = history_item.company_name
            existing_item.latest_price = history_item.latest_price
            existing_item.risk_level = history_item.risk_level
            existing_item.annualized_volatility = history_item.annualized_volatility

            if hasattr(existing_item, "maximum_drawdown"):
                existing_item.maximum_drawdown = history_item.maximum_drawdown

            if hasattr(existing_item, "average_daily_return"):
                existing_item.average_daily_return = history_item.average_daily_return

            if hasattr(existing_item, "volatility"):
                existing_item.volatility = history_item.volatility

            if hasattr(existing_item, "period"):
                existing_item.period = history_item.period

            db.commit()
            db.refresh(existing_item)

            return history_item_to_dict(existing_item)

        new_history_item = SearchHistoryItem(
            user_id=current_user.id,
            ticker=ticker,
            company_name=history_item.company_name,
            latest_price=history_item.latest_price,
            risk_level=history_item.risk_level,
            annualized_volatility=history_item.annualized_volatility,
        )

        if hasattr(new_history_item, "maximum_drawdown"):
            new_history_item.maximum_drawdown = history_item.maximum_drawdown

        if hasattr(new_history_item, "average_daily_return"):
            new_history_item.average_daily_return = history_item.average_daily_return

        if hasattr(new_history_item, "volatility"):
            new_history_item.volatility = history_item.volatility

        if hasattr(new_history_item, "period"):
            new_history_item.period = history_item.period

        db.add(new_history_item)
        db.commit()
        db.refresh(new_history_item)

        return history_item_to_dict(new_history_item)

    except Exception as error:
        print("Cloud history save backend error:", error)
        raise HTTPException(
            status_code=500,
            detail=str(error)
        )

@router.delete("")
@router.delete("/")
def clear_history(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    db.query(SearchHistoryItem).filter(
        SearchHistoryItem.user_id == current_user.id
    ).delete()

    db.commit()

    return {
        "message": "History cleared."
    }