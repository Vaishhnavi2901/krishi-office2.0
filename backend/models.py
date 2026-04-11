"""Pydantic models for request/response validation."""
from pydantic import BaseModel, Field
from typing import Optional, List
from enum import Enum


class SoilType(str, Enum):
    """Soil type enumeration."""
    LOAMY = "loamy"
    CLAYEY = "clayey"
    SANDY = "sandy"


class Season(str, Enum):
    """Farming season enumeration."""
    KHARIF = "kharif"
    RABI = "rabi"
    SUMMER = "summer"


class WaterAvailability(str, Enum):
    """Water availability enumeration."""
    HIGH = "high"
    MEDIUM = "medium"
    LOW = "low"


class RiskLevel(str, Enum):
    """Risk level enumeration."""
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"


# Request Models
class PredictCropRequest(BaseModel):
    """Request model for crop prediction."""
    location: str = Field(..., description="Farmer's location")
    soil_type: SoilType = Field(..., description="Type of soil")
    season: Season = Field(..., description="Farming season")
    water_availability: WaterAvailability = Field(..., description="Water availability level")
    budget: Optional[float] = Field(None, description="Budget in rupees")


class CompareCropsRequest(BaseModel):
    """Request model for crop comparison."""
    crop1: str = Field(..., description="First crop name")
    crop2: str = Field(..., description="Second crop name")
    soil_type: SoilType = Field(..., description="Type of soil")
    season: Season = Field(..., description="Farming season")
    water_availability: WaterAvailability = Field(..., description="Water availability level")


class MarketAdviceRequest(BaseModel):
    """Request model for market advice."""
    crop: str = Field(..., description="Crop name")
    current_price: float = Field(..., description="Current market price")


class DetectDiseaseRequest(BaseModel):
    """Request model for disease detection."""
    image: str = Field(..., description="Base64 encoded image")
    crop_name: Optional[str] = Field(None, description="Crop name for context")


class ChatRequest(BaseModel):
    """Request model for chat."""
    message: str = Field(..., description="User message")
    session_id: Optional[str] = Field(None, description="Session ID for conversation continuity")
    language: Optional[str] = Field("english", description="Language preference")


# Response Models
class CropRecommendation(BaseModel):
    """Single crop recommendation."""
    name: str
    confidence: float = Field(..., description="Confidence score 0-100")
    expected_yield: float = Field(..., description="Expected yield in tons per hectare")
    expected_profit: float = Field(..., description="Expected profit in rupees")
    water_requirement: float = Field(..., description="Water requirement in mm")
    duration_days: int = Field(..., description="Crop duration in days")
    risk_level: RiskLevel = Field(..., description="Risk level assessment")


class PredictCropResponse(BaseModel):
    """Response model for crop prediction."""
    status: str = "success"
    recommendations: List[CropRecommendation] = Field(description="Top 3 crop recommendations")
    location: str
    soil_type: str
    season: str


class ComparisonResult(BaseModel):
    """Single crop comparison result."""
    name: str
    score: float = Field(..., description="Overall score 0-100")
    yield_estimate: float
    profit_estimate: float
    water_requirement: float
    risk_level: RiskLevel


class CompareCropsResponse(BaseModel):
    """Response model for crop comparison."""
    status: str = "success"
    crop1: ComparisonResult
    crop2: ComparisonResult
    winner: str = Field(..., description="Name of recommended crop")
    reason: str = Field(..., description="Reason for recommendation")


class MarketAdvice(BaseModel):
    """Market advice response."""
    recommendation: str = Field(..., description="SELL or WAIT")
    confidence: float = Field(..., description="Confidence level 0-100")
    reasoning: str = Field(..., description="Reason for recommendation")
    msp: float = Field(..., description="Minimum support price")
    forecast_price: float = Field(..., description="Forecasted price")


class DiseaseInfo(BaseModel):
    """Disease information."""
    name: str
    crop: str
    severity: str = Field(..., description="MILD, MODERATE, or SEVERE")
    confidence: float = Field(..., description="Detection confidence 0-100")
    symptoms: List[str]
    treatment: List[str]
    prevention: List[str]
    recommended_action: str


class ChatMessage(BaseModel):
    """Chat message."""
    role: str = Field(..., description="'user' or 'assistant'")
    content: str


class ChatResponse(BaseModel):
    """Response model for chat."""
    status: str = "success"
    message: str
    session_id: str
    language: str


class WeatherAlert(BaseModel):
    """Weather alert."""
    type: str = Field(..., description="Alert type: rain, pest, heat_wave, frost, wind")
    title: str
    description: str
    region: str
    severity: str = Field(..., description="LOW, MEDIUM, or HIGH")
    valid_until: str = Field(..., description="ISO format datetime")


class RiskAlertResponse(BaseModel):
    """Response model for risk alerts."""
    status: str = "success"
    alerts: List[WeatherAlert]


class Buyer(BaseModel):
    """Buyer information."""
    id: str
    name: str
    type: str = Field(..., description="COOPERATIVE, TRADER, or PROCESSOR")
    crop: str
    location: str
    distance_km: float
    price_per_unit: float
    transport_cost: float
    net_price: float
    rating: float = Field(..., ge=0, le=5)
    payment_days: int


class BuyerResponse(BaseModel):
    """Response model for buyer matching."""
    status: str = "success"
    crop: str
    best_buyer: Optional[Buyer] = None
    buyers: List[Buyer]


class DashboardStats(BaseModel):
    """Dashboard statistics."""
    total_crops: int
    total_buyers: int
    active_alerts: int
    recommendations_generated: int = 0
