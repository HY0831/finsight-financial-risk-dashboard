from sqlalchemy import Boolean, Column, DateTime, Float, ForeignKey, Integer, JSON, String, UniqueConstraint
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    full_name = Column(String, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class WatchlistItem(Base):
    __tablename__ = "watchlist_items"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)

    ticker = Column(String, nullable=False)
    company_name = Column(String, nullable=True)
    latest_price = Column(Float, nullable=True)
    risk_level = Column(String, nullable=True)
    annualized_volatility = Column(Float, nullable=True)

    saved_at = Column(DateTime(timezone=True), server_default=func.now())

    user = relationship("User")

    __table_args__ = (
        UniqueConstraint("user_id", "ticker", name="unique_user_ticker"),
    )

class RiskProfile(Base):
    __tablename__ = "risk_profiles"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True, nullable=False)

    profile_type = Column(String, nullable=False)
    score = Column(Integer, nullable=False)
    answers = Column(JSON, nullable=True)

    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    user = relationship("User")

class SearchHistoryItem(Base):
    __tablename__ = "search_history_items"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)

    ticker = Column(String, nullable=False)
    company_name = Column(String, nullable=True)
    latest_price = Column(Float, nullable=True)
    risk_level = Column(String, nullable=True)
    annualized_volatility = Column(Float, nullable=True)
    average_daily_return = Column(Float, nullable=True)
    volatility = Column(Float, nullable=True)
    period = Column(String, nullable=True)

    searched_at = Column(DateTime(timezone=True), server_default=func.now())

    user = relationship("User")