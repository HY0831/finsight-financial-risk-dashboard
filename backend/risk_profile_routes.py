from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from auth import get_current_user
from database import get_db
from models import RiskProfile, User
from schemas import RiskProfileCreate, RiskProfileResponse

router = APIRouter(prefix="/user/risk-profile", tags=["User Risk Profile"])


@router.get("/", response_model=RiskProfileResponse)
def get_user_risk_profile(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    risk_profile = (
        db.query(RiskProfile)
        .filter(RiskProfile.user_id == current_user.id)
        .first()
    )

    if not risk_profile:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Risk profile not found.",
        )

    return risk_profile


@router.post("/", response_model=RiskProfileResponse)
def save_user_risk_profile(
    profile_data: RiskProfileCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    existing_profile = (
        db.query(RiskProfile)
        .filter(RiskProfile.user_id == current_user.id)
        .first()
    )

    if existing_profile:
        existing_profile.profile_type = profile_data.profile_type
        existing_profile.score = profile_data.score
        existing_profile.answers = profile_data.answers

        db.commit()
        db.refresh(existing_profile)

        return existing_profile

    new_profile = RiskProfile(
        user_id=current_user.id,
        profile_type=profile_data.profile_type,
        score=profile_data.score,
        answers=profile_data.answers,
    )

    db.add(new_profile)
    db.commit()
    db.refresh(new_profile)

    return new_profile


@router.delete("/")
def delete_user_risk_profile(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    risk_profile = (
        db.query(RiskProfile)
        .filter(RiskProfile.user_id == current_user.id)
        .first()
    )

    if not risk_profile:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Risk profile not found.",
        )

    db.delete(risk_profile)
    db.commit()

    return {"message": "Risk profile deleted successfully."}