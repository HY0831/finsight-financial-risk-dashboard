from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from auth import get_current_user
from database import get_db
from models import RiskProfile, User
from schemas import RiskProfileCreate

router = APIRouter(
    prefix="/risk-profile",
    tags=["Risk Profile"],
)


def generate_profile_description(profile_type):
    if profile_type == "Conservative":
        return (
            "You prefer stability and capital protection. Lower-risk assets may "
            "be more suitable for your comfort level."
        )

    if profile_type == "Moderate":
        return (
            "You can accept some investment risk for potential growth, but you "
            "still prefer a balanced approach."
        )

    if profile_type == "Aggressive":
        return (
            "You are willing to accept higher risk and larger price movement for "
            "potential long-term growth."
        )

    return "Risk profile description is not available."


def risk_profile_to_dict(profile):
    if not profile:
        return None

    profile_type = getattr(profile, "profile_type", None)

    return {
        "id": profile.id,
        "profile": profile_type,
        "profile_type": profile_type,
        "score": profile.score,
        "answers": getattr(profile, "answers", None),
        "description": generate_profile_description(profile_type),
        "updated_at": str(getattr(profile, "updated_at", "")),
    }


@router.get("")
@router.get("/")
def get_risk_profile(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    try:
        profile = (
            db.query(RiskProfile)
            .filter(RiskProfile.user_id == current_user.id)
            .order_by(RiskProfile.id.desc())
            .first()
        )

        return risk_profile_to_dict(profile)

    except Exception as error:
        print("Cloud risk profile load backend error:", error)
        raise HTTPException(
            status_code=500,
            detail=str(error),
        )


@router.post("")
@router.post("/")
def save_risk_profile(
    profile_data: RiskProfileCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    try:
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

            return risk_profile_to_dict(existing_profile)

        new_profile = RiskProfile(
            user_id=current_user.id,
            profile_type=profile_data.profile_type,
            score=profile_data.score,
            answers=profile_data.answers,
        )

        db.add(new_profile)
        db.commit()
        db.refresh(new_profile)

        return risk_profile_to_dict(new_profile)

    except Exception as error:
        print("Cloud risk profile save backend error:", error)
        raise HTTPException(
            status_code=500,
            detail=str(error),
        )


@router.delete("")
@router.delete("/")
def clear_risk_profile(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    try:
        db.query(RiskProfile).filter(
            RiskProfile.user_id == current_user.id
        ).delete()

        db.commit()

        return {
            "message": "Risk profile cleared."
        }

    except Exception as error:
        print("Cloud risk profile clear backend error:", error)
        raise HTTPException(
            status_code=500,
            detail=str(error),
        )