"""Scoring logic for crop recommendations and analysis."""
from databases import CROP_DATABASE
from typing import Dict, List, Tuple
import random


def calculate_crop_score(
    crop_name: str,
    soil_type: str,
    season: str,
    water_availability: str,
    budget: float = None,
) -> float:
    """
    Calculate suitability score for a crop based on farm conditions.
    
    Score components:
    - Soil preference: 40 points
    - Season preference: 30 points
    - Water preference: 30 points
    - Budget bonus: 10 points if budget sufficient
    
    Returns: Score from 0-100
    """
    if crop_name not in CROP_DATABASE:
        return 0.0
    
    crop = CROP_DATABASE[crop_name]
    score = 0.0
    
    # Soil scoring (max 40)
    soil_prefs = crop["soil_preference"]
    soil_score = soil_prefs.get(soil_type, 0) * 0.4
    score += soil_score
    
    # Season scoring (max 30)
    season_prefs = crop["season_preference"]
    season_score = season_prefs.get(season, 0) * 0.3
    score += season_score
    
    # Water scoring (max 30)
    water_prefs = crop["water_preference"]
    water_score = water_prefs.get(water_availability, 0) * 0.3
    score += water_score
    
    # Budget bonus (max 10)
    if budget:
        cost_per_hectare = crop["cost_per_hectare"]
        expected_yield = crop["yield_tons_per_hectare"]
        msp = crop["msp_rupees"]
        expected_revenue = expected_yield * msp
        
        if budget >= cost_per_hectare:
            score += 10
        elif budget >= cost_per_hectare * 0.7:
            score += 5
    
    return min(100.0, score)


def predict_crops(
    soil_type: str,
    season: str,
    water_availability: str,
    budget: float = None,
) -> List[Tuple[str, float, Dict]]:
    """
    Predict top 3 crops based on farm conditions.
    
    Returns: List of (crop_name, score, crop_data) tuples, sorted by score descending
    """
    crops_with_scores: List[Tuple[str, float, Dict]] = []
    
    for crop_name, crop_data in CROP_DATABASE.items():
        score = calculate_crop_score(crop_name, soil_type, season, water_availability, budget)
        crops_with_scores.append((crop_name, score, crop_data))
    
    # Sort by score descending and return top 3
    crops_with_scores.sort(key=lambda x: x[1], reverse=True)
    return crops_with_scores[:3]


def compare_crops(
    crop1: str,
    crop2: str,
    soil_type: str,
    season: str,
    water_availability: str,
) -> Dict:
    """
    Compare two crops and determine which is better for given conditions.
    
    Returns: Dictionary with comparison results and recommendation
    """
    score1 = calculate_crop_score(crop1, soil_type, season, water_availability)
    score2 = calculate_crop_score(crop2, soil_type, season, water_availability)
    
    crop1_data = CROP_DATABASE.get(crop1, {})
    crop2_data = CROP_DATABASE.get(crop2, {})
    
    # Calculate expected profit
    def calc_profit(crop_data):
        yield_tons = crop_data.get("yield_tons_per_hectare", 0)
        msp = crop_data.get("msp_rupees", 0)
        cost = crop_data.get("cost_per_hectare", 0)
        return (yield_tons * msp) - cost
    
    profit1 = calc_profit(crop1_data)
    profit2 = calc_profit(crop2_data)
    
    # Determine winner
    if score1 > score2:
        winner = crop1
        reason = f"{crop1_data.get('name')} is more suitable with a score of {score1:.1f} vs {score2:.1f}"
    elif score2 > score1:
        winner = crop2
        reason = f"{crop2_data.get('name')} is more suitable with a score of {score2:.1f} vs {score1:.1f}"
    else:
        # If scores equal, use profit as tiebreaker
        winner = crop1 if profit1 >= profit2 else crop2
        reason = f"Both crops have similar suitability. {winner} has higher profit potential."
    
    return {
        "crop1_name": crop1_data.get("name"),
        "crop1_score": score1,
        "crop1_profit": profit1,
        "crop2_name": crop2_data.get("name"),
        "crop2_score": score2,
        "crop2_profit": profit2,
        "winner": winner,
        "reason": reason,
    }


def calculate_disease_risk(crop_name: str) -> List[Dict]:
    """
    Get diseases that can affect a specific crop.
    
    Returns: List of relevant diseases for the crop
    """
    from databases import DISEASE_DATABASE
    
    relevant_diseases = []
    for disease_key, disease_data in DISEASE_DATABASE.items():
        if crop_name in disease_data["crops"] or "all" in disease_data["crops"]:
            relevant_diseases.append({
                "name": disease_data["name"],
                "crops": disease_data["crops"],
                "symptoms": disease_data["symptoms"],
                "treatment": disease_data["treatment"],
                "prevention": disease_data["prevention"],
            })
    
    return relevant_diseases


def calculate_market_advice(crop: str, current_price: float) -> Dict:
    """
    Provide market timing advice based on MSP and trends.
    
    Returns: Dictionary with recommendation (SELL/WAIT) and reasoning
    """
    crop_data = CROP_DATABASE.get(crop.lower(), {})
    msp = crop_data.get("msp_rupees", 0)
    
    if not msp:
        return {
            "recommendation": "WAIT",
            "confidence": 30,
            "reasoning": "Insufficient market data available",
            "msp": 0,
            "forecast_price": 0,
        }
    
    # Simple logic: if current price > MSP + 10%, sell; otherwise wait
    threshold = msp * 1.1
    price_above_msp = current_price - msp
    
    if current_price > threshold:
        recommendation = "SELL"
        confidence = min(95, 70 + (price_above_msp / msp) * 20)
        reasoning = f"Price is {((current_price/msp - 1) * 100):.1f}% above MSP. Good time to sell."
    else:
        recommendation = "WAIT"
        confidence = min(80, 50 + ((threshold - current_price) / msp) * 30)
        reasoning = f"Price is below optimal threshold. Hold and monitor market trends."
    
    # Forecast: random variation around current price
    forecast_price = current_price * (0.95 + random.random() * 0.1)
    
    return {
        "recommendation": recommendation,
        "confidence": confidence,
        "reasoning": reasoning,
        "msp": msp,
        "forecast_price": forecast_price,
    }
