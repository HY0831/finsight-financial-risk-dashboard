from datetime import datetime
from typing import Any, Dict, Optional
from pydantic import BaseModel, EmailStr


class UserCreate(BaseModel):
    full_name: str
    email: EmailStr
    password: str


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class UserResponse(BaseModel):
    id: int
    full_name: str
    email: EmailStr
    is_active: bool

    class Config:
        from_attributes = True


class TokenResponse(BaseModel):
    access_token: str
    token_type: str
    user: UserResponse

class WatchlistCreate(BaseModel):
    ticker: str
    company_name: Optional[str] = None
    latest_price: Optional[float] = None
    risk_level: Optional[str] = None
    annualized_volatility: Optional[float] = None


class WatchlistResponse(BaseModel):
    id: int
    ticker: str
    company_name: Optional[str] = None
    latest_price: Optional[float] = None
    risk_level: Optional[str] = None
    annualized_volatility: Optional[float] = None
    saved_at: Optional[datetime] = None

    class Config:
        from_attributes = True

class RiskProfileCreate(BaseModel):
    profile_type: str
    score: int
    answers: Optional[Dict[str, Any]] = None


class RiskProfileResponse(BaseModel):
    id: int
    profile_type: str
    score: int
    answers: Optional[Dict[str, Any]] = None

    class Config:
        from_attributes = True

class SearchHistoryCreate(BaseModel):
    ticker: str
    company_name: Optional[str] = None
    latest_price: Optional[float] = None
    risk_level: Optional[str] = None
    annualized_volatility: Optional[float] = None
    maximum_drawdown: Optional[float] = None
    average_daily_return: Optional[float] = None
    volatility: Optional[float] = None
    period: Optional[str] = None


class SearchHistoryResponse(BaseModel):
    id: int
    ticker: str
    company_name: Optional[str] = None
    latest_price: Optional[float] = None
    risk_level: Optional[str] = None
    annualized_volatility: Optional[float] = None
    maximum_drawdown: Optional[float] = None
    average_daily_return: Optional[float] = None
    volatility: Optional[float] = None
    period: Optional[str] = None
    searched_at: Optional[str] = None

    class Config:
        from_attributes = True