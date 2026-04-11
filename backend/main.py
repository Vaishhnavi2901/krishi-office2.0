"""
KrishiAI FastAPI Backend
Agricultural optimization platform with crop recommendations, disease detection, and market insights.
"""

import random
import secrets
from contextlib import asynccontextmanager
from typing import List, Optional

from fastapi import FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import ValidationError

from config import get_settings
from models import (
    BuyerResponse,
    ChatResponse,
    CompareCropsRequest,
    CompareCropsResponse,
    ComparisonResult,
    CropRecommendation,
    DashboardStats,
    DetectDiseaseRequest,
    DiseaseInfo,
    MarketAdviceRequest,
    PredictCropRequest,
    PredictCropResponse,
    RiskAlertResponse,
    WeatherAlert,
    ChatRequest,
    Buyer,
    MarketAdvice,
)
from scoring import (
    calculate_crop_score,
    compare_crops,
    predict_crops,
    calculate_disease_risk,
    calculate_market_advice,
)
from databases import CROP_DATABASE, DISEASE_DATABASE, BUYER_DATABASE, WEATHER_ALERTS


settings = get_settings()


# Lifespan context manager for startup/shutdown
@asynccontextmanager
async def lifespan(app: FastAPI):
    """Manage app startup and shutdown."""
    # Startup
    print(f"Starting KrishiAI API ({settings.environment} mode)")
    yield
    # Shutdown
    print("Shutting down KrishiAI API")


# Initialize FastAPI app
app = FastAPI(
    title=settings.api_title,
    version=settings.api_version,
    description="Agricultural optimization platform for Indian farmers",
    lifespan=lifespan,
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Health check endpoint
@app.get("/health")
async def health_check():
    """Health check endpoint."""
    return {
        "status": "healthy",
        "service": "KrishiAI API",
        "version": settings.api_version,
    }


# 1. Crop Prediction Endpoint
@app.post("/api/predict-crop", response_model=PredictCropResponse)
async def predict_crop(request: PredictCropRequest):
    """
    Predict crop recommendations based on farm conditions.
    Returns top 3 crop recommendations with confidence scores.
    """
    try:
        recommendations = predict_crops(
            soil_type=request.soil_type.value,
            season=request.season.value,
            water_availability=request.water_availability.value,
            budget=request.budget,
        )

        response_recommendations: List[CropRecommendation] = []
        for crop_name, score, crop_data in recommendations:
            yield_tons = crop_data.get("yield_tons_per_hectare", 0)
            msp = crop_data.get("msp_rupees", 0)
            cost = crop_data.get("cost_per_hectare", 0)
            profit = (yield_tons * msp) - cost

            # Determine risk level
            risks = crop_data.get("risks", [])
            risk_level = "high" if len(risks) > 2 else ("medium" if len(risks) > 0 else "low")

            response_recommendations.append(
                CropRecommendation(
                    name=crop_data["name"],
                    confidence=score,
                    expected_yield=yield_tons,
                    expected_profit=profit,
                    water_requirement=crop_data.get("water_preference", {}).get(
                        request.water_availability.value, 500
                    ),
                    duration_days=crop_data.get("duration_days", 120),
                    risk_level=risk_level,
                )
            )

        return PredictCropResponse(
            recommendations=response_recommendations,
            location=request.location,
            soil_type=request.soil_type.value,
            season=request.season.value,
        )

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error predicting crops: {str(e)}",
        )


# 2. Crop Comparison Endpoint
@app.post("/api/compare-crops", response_model=CompareCropsResponse)
async def compare_crops_endpoint(request: CompareCropsRequest):
    """Compare two crops and recommend the better option."""
    try:
        comparison = compare_crops(
            crop1=request.crop1.lower(),
            crop2=request.crop2.lower(),
            soil_type=request.soil_type.value,
            season=request.season.value,
            water_availability=request.water_availability.value,
        )

        crop1_data = CROP_DATABASE.get(request.crop1.lower(), {})
        crop2_data = CROP_DATABASE.get(request.crop2.lower(), {})

        return CompareCropsResponse(
            crop1=ComparisonResult(
                name=comparison["crop1_name"],
                score=comparison["crop1_score"],
                yield_estimate=crop1_data.get("yield_tons_per_hectare", 0),
                profit_estimate=comparison["crop1_profit"],
                water_requirement=crop1_data.get("water_preference", {}).get(
                    request.water_availability.value, 500
                ),
                risk_level="medium",
            ),
            crop2=ComparisonResult(
                name=comparison["crop2_name"],
                score=comparison["crop2_score"],
                yield_estimate=crop2_data.get("yield_tons_per_hectare", 0),
                profit_estimate=comparison["crop2_profit"],
                water_requirement=crop2_data.get("water_preference", {}).get(
                    request.water_availability.value, 500
                ),
                risk_level="medium",
            ),
            winner=comparison["winner"],
            reason=comparison["reason"],
        )

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error comparing crops: {str(e)}",
        )


# 3. Market Advice Endpoint
@app.post("/api/market-advice")
async def market_advice(request: MarketAdviceRequest):
    """Get market timing advice for selling a crop."""
    try:
        advice = calculate_market_advice(request.crop, request.current_price)
        return MarketAdvice(
            recommendation=advice["recommendation"],
            confidence=advice["confidence"],
            reasoning=advice["reasoning"],
            msp=advice["msp"],
            forecast_price=advice["forecast_price"],
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error getting market advice: {str(e)}",
        )


# 4. Disease Detection Endpoint
@app.post("/api/detect-disease")
async def detect_disease(request: DetectDiseaseRequest):
    """Detect crop disease from image and provide treatment recommendations."""
    try:
        # Get diseases for the crop if provided
        if request.crop_name:
            diseases = calculate_disease_risk(request.crop_name.lower())
        else:
            diseases = list(DISEASE_DATABASE.values())

        if not diseases:
            # Default response if no diseases found
            diseases = [list(DISEASE_DATABASE.values())[0]]

        # Random disease selection for mock implementation
        disease_info = random.choice(diseases)

        return DiseaseInfo(
            name=disease_info["name"],
            crop=request.crop_name or "Unknown",
            severity=random.choice(["MILD", "MODERATE", "SEVERE"]),
            confidence=random.randint(70, 95),
            symptoms=disease_info["symptoms"],
            treatment=disease_info["treatment"],
            prevention=disease_info["prevention"],
            recommended_action=f"Start treatment immediately. {disease_info['treatment'][0]}",
        )

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error detecting disease: {str(e)}",
        )


# 5. Chat Endpoint (AI Farming Assistant)
@app.post("/api/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    """Chat with AI farming assistant for agricultural advice."""
    try:
        session_id = request.session_id or f"session_{secrets.token_hex(16)}"

        # Simple keyword-based response (replace with LLM integration in production)
        message_lower = request.message.lower()
        response_text = "Thank you for your question. Please consult with a local agricultural expert for detailed guidance."

        # Simple keyword matching for mock responses
        keywords = {
            "rice": "Rice requires warm temperatures, high water availability, and loamy/clayey soils. Best grown in kharif season with MSP of ₹2100/quintal.",
            "wheat": "Wheat is a winter crop (rabi) that prefers temperate regions and well-drained loamy soil. Expected yield: 4-5 t/ha with MSP ₹2150.",
            "water": "Proper irrigation is crucial. Rice needs continuous flooding, wheat needs 3-4 irrigations, and drip irrigation is efficient for vegetables.",
            "disease": "Common crop diseases include powdery mildew, leaf blight, and root rot. Prevention includes crop rotation, resistant varieties, and proper spacing.",
            "pest": "Integrated pest management includes monitoring, traps, resistant varieties, and organic pesticides. Avoid chemical sprays unless damage exceeds threshold.",
            "price": "MSP provides government support prices. Check local mandi rates for current prices. Market conditions vary by season and region.",
            "profit": "Profit depends on yield, crop price, and input costs. High-value crops like cotton, mango profit more but require more investment.",
        }

        for keyword, answer in keywords.items():
            if keyword in message_lower:
                response_text = answer
                break

        return ChatResponse(
            message=response_text,
            session_id=session_id,
            language=request.language or "english",
        )

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error processing chat: {str(e)}",
        )


# 6. Risk Alert Endpoint
@app.get("/api/risk-alert", response_model=RiskAlertResponse)
async def get_risk_alerts():
    """Get current weather and pest alerts for the region."""
    try:
        # Random selection of alerts for demonstration
        selected_alerts = random.sample(WEATHER_ALERTS, min(3, len(WEATHER_ALERTS)))

        return RiskAlertResponse(
            alerts=[
                WeatherAlert(
                    type=alert["type"],
                    title=alert["title"],
                    description=alert["description"],
                    region=alert["region"],
                    severity=alert["severity"],
                    valid_until=alert["valid_until"],
                )
                for alert in selected_alerts
            ]
        )

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error fetching risk alerts: {str(e)}",
        )


# 7. Buyer Matching Endpoint
@app.get("/api/buyers")
async def get_buyers(crop: str):
    """Get list of buyers for a specific crop."""
    try:
        crop_lower = crop.lower()

        # Filter buyers for the selected crop
        relevant_buyers = []
        for buyer_id, buyer_data in BUYER_DATABASE.items():
            if crop_lower in [c.lower() for c in buyer_data.get("crops", [])]:
                # Randomize prices slightly for demo
                price_variation = random.uniform(0.95, 1.05)
                base_price = buyer_data.get("base_price_multiplier", 1.0) * 2100 * price_variation

                relevant_buyers.append(
                    Buyer(
                        id=buyer_id,
                        name=buyer_data["name"],
                        type=buyer_data["type"],
                        crop=crop,
                        location=buyer_data["location"],
                        distance_km=buyer_data["distance_km"],
                        price_per_unit=base_price,
                        transport_cost=buyer_data["distance_km"] * 2,  # ₹2 per km
                        net_price=base_price - (buyer_data["distance_km"] * 2),
                        rating=buyer_data["rating"],
                        payment_days=buyer_data["payment_days"],
                    )
                )

        # Sort by net price (descending)
        relevant_buyers.sort(key=lambda x: x.net_price, reverse=True)

        best_buyer = relevant_buyers[0] if relevant_buyers else None

        return BuyerResponse(
            crop=crop,
            best_buyer=best_buyer,
            buyers=relevant_buyers,
        )

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error fetching buyers: {str(e)}",
        )


# 8. Dashboard Stats Endpoint
@app.get("/api/dashboard-stats", response_model=DashboardStats)
async def get_dashboard_stats():
    """Get dashboard statistics."""
    try:
        return DashboardStats(
            total_crops=len(CROP_DATABASE),
            total_buyers=len(BUYER_DATABASE),
            active_alerts=random.randint(2, 5),
            recommendations_generated=random.randint(100, 500),
        )

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error fetching dashboard stats: {str(e)}",
        )


# 9. Crops List Endpoint
@app.get("/api/crops-list")
async def get_crops_list():
    """Get list of all available crops."""
    try:
        crops = [
            {"name": crop_data["name"], "key": crop_key}
            for crop_key, crop_data in CROP_DATABASE.items()
        ]
        return {"crops": crops}
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error fetching crops list: {str(e)}",
        )


# Root endpoint
@app.get("/")
async def root():
    """Root endpoint with API information."""
    return {
        "name": "KrishiAI Agricultural Optimization API",
        "version": settings.api_version,
        "description": "Complete agricultural optimization platform for Indian farmers",
        "docs": "/docs",
        "openapi_schema": "/openapi.json",
    }


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(
        app,
        host="0.0.0.0",
        port=8000,
        reload=settings.environment == "development",
    )
