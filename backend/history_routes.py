from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from auth import get_current_user
from database import get_db
from models import SearchHistoryItem, User
from schemas import SearchHistoryCreate, SearchHistoryResponse

router = APIRouter(prefix="/user/history", tags=["User Search History"])


@router.get("/", response_model=list[SearchHistoryResponse])
def get_user_history(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    history_items = (
        db.query(SearchHistoryItem)
        .filter(SearchHistoryItem.user_id == current_user.id)
        .order_by(SearchHistoryItem.searched_at.desc())
        .limit(30)
        .all()
    )

    return history_items


@router.post("/", response_model=SearchHistoryResponse)
def save_history_item(
    history_data: SearchHistoryCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    new_history_item = SearchHistoryItem(
        user_id=current_user.id,
        ticker=history_data.ticker.upper().strip(),
        company_name=history_data.company_name,
        latest_price=history_data.latest_price,
        risk_level=history_data.risk_level,
        annualized_volatility=history_data.annualized_volatility,
        average_daily_return=history_data.average_daily_return,
        volatility=history_data.volatility,
        period=history_data.period,
    )

    db.add(new_history_item)
    db.commit()
    db.refresh(new_history_item)

    return new_history_item


@router.delete("/")
def clear_user_history(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    db.query(SearchHistoryItem).filter(
        SearchHistoryItem.user_id == current_user.id
    ).delete()

    db.commit()

    return {"message": "Search history cleared successfully."}