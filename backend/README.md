# KrishiAI Backend API

Complete FastAPI backend for the KrishiAI agricultural optimization platform.

## Setup Instructions

### 1. Install Python Dependencies

```bash
cd backend
uv init --bare .
uv add fastapi uvicorn motor pydantic pydantic-settings python-dotenv httpx aiohttp
```

### 2. Environment Configuration

Copy `.env.example` to `.env` and update with your configuration:

```bash
cp .env.example .env
```

Key environment variables:
- `MONGO_URL`: MongoDB connection string (default: `mongodb://localhost:27017`)
- `DB_NAME`: Database name (default: `krishiai`)
- `CORS_ORIGINS`: Allowed origins for frontend (default: localhost:3000, localhost:5173)
- `EMERGENT_LLM_KEY`: API key for LLM integration (optional for production)

### 3. Run the Development Server

```bash
uv run uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

The API will be available at `http://localhost:8000`
- API Documentation: `http://localhost:8000/docs` (interactive Swagger UI)
- OpenAPI Schema: `http://localhost:8000/openapi.json`

## API Endpoints

### Core Endpoints

#### 1. **Crop Prediction** (`POST /api/predict-crop`)
Get crop recommendations based on farm conditions.

Request:
```json
{
  "location": "Punjab",
  "soil_type": "loamy",
  "season": "kharif",
  "water_availability": "high",
  "budget": 50000
}
```

Response: Top 3 crop recommendations with confidence scores, yields, and profits.

#### 2. **Compare Crops** (`POST /api/compare-crops`)
Compare two crops for the same farm conditions.

Request:
```json
{
  "crop1": "rice",
  "crop2": "wheat",
  "soil_type": "loamy",
  "season": "rabi",
  "water_availability": "medium"
}
```

#### 3. **Market Advice** (`POST /api/market-advice`)
Get SELL/WAIT recommendation based on current market price.

Request:
```json
{
  "crop": "Rice",
  "current_price": 2500
}
```

#### 4. **Detect Disease** (`POST /api/detect-disease`)
Identify crop disease from image and get treatment advice.

Request:
```json
{
  "image": "base64_encoded_image",
  "crop_name": "Rice"
}
```

#### 5. **Chat (AI Assistant)** (`POST /api/chat`)
Chat with AI farming assistant for agricultural advice.

Request:
```json
{
  "message": "How to prevent powdery mildew?",
  "session_id": "session_xxx",
  "language": "english"
}
```

#### 6. **Risk Alerts** (`GET /api/risk-alert`)
Get current weather and pest alerts for the region.

#### 7. **Buyer Matching** (`GET /api/buyers?crop=rice`)
Find verified buyers for your crop with pricing and contact info.

#### 8. **Dashboard Stats** (`GET /api/dashboard-stats`)
Get platform statistics for the dashboard.

#### 9. **Crops List** (`GET /api/crops-list`)
Get list of all supported crops.

## Project Structure

```
backend/
├── main.py                 # FastAPI application & routes
├── config.py              # Configuration & settings
├── models.py              # Pydantic request/response models
├── scoring.py             # Crop scoring logic
├── databases.py           # Hardcoded data (crops, diseases, buyers, alerts)
├── pyproject.toml         # Python project configuration
├── .env.example           # Environment variables template
└── README.md              # This file
```

## Data Structures

### Crops Database
10 crops with soil/season/water preferences, yield, price, cost, and risks.
- Rice, Wheat, Corn, Cotton, Sugarcane, Soybean, Tomato, Onion, Potato, Mango

### Diseases Database
6 diseases with symptoms, treatments, and prevention methods.
- Powdery Mildew, Leaf Blight, Borer Attack, Fruit Rot, Root Rot, Pest Infestation

### Buyers Database
6 verified buyers (cooperatives, traders, processors) with location, pricing, and ratings.

### Weather Alerts
5 alert types: rain, pest, heat_wave, frost, wind

## Scoring Logic

### Crop Suitability Score (0-100)
- Soil preference: 40 points
- Season preference: 30 points
- Water availability: 30 points
- Budget bonus: 10 points (if sufficient)

### Market Advice
- SELL: If current price > MSP + 10%
- WAIT: If price below threshold (typically MSP)

### Risk Assessment
- LOW: 0-1 risks
- MEDIUM: 1-2 risks
- HIGH: 3+ risks

## Error Handling

All endpoints return structured error responses:

```json
{
  "detail": "Error message describing what went wrong"
}
```

HTTP Status Codes:
- 200: Success
- 400: Bad request (validation error)
- 500: Server error

## Integration with Frontend

### Base URL Configuration
Frontend should configure the API base URL:

```typescript
const API_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8000'
```

### Error Handling Pattern
```typescript
try {
  const response = await axios.post(`${API_URL}/api/predict-crop`, data)
  setRecommendations(response.data.recommendations)
} catch (error) {
  const errorMessage = error?.response?.data?.detail || error?.message
  console.error('API Error:', errorMessage)
}
```

## CORS Configuration

Update `CORS_ORIGINS` in `.env` to match your frontend domains:
- Development: `http://localhost:3000`, `http://localhost:5173`
- Production: Add your deployed frontend URL

## Future Enhancements

1. **Database Integration**
   - Connect to MongoDB for persistent storage
   - Track user queries and recommendations
   - Store historical market data

2. **LLM Integration**
   - Connect to emergentintegrations for advanced NLP
   - Enhance chat responses with real AI

3. **Real Market Data**
   - Integrate with government MSP APIs
   - Real-time mandi price feeds
   - Weather data from meteorological services

4. **Authentication**
   - User registration and login
   - JWT token-based auth
   - Role-based access control

5. **Advanced Analytics**
   - User analytics and recommendations tracking
   - Crop success rate analysis
   - Market trend prediction

## Testing

Run tests with:
```bash
uv run pytest
```

## Deployment

For production deployment:

1. Set `ENVIRONMENT=production` and `DEBUG=false` in `.env`
2. Use production database (MongoDB Atlas)
3. Configure CORS for production domain
4. Deploy with gunicorn/uvicorn on cloud platform (Heroku, AWS, Google Cloud, etc.)

Example with Gunicorn:
```bash
uv run gunicorn main:app --workers 4 --worker-class uvicorn.workers.UvicornWorker
```

## License

Internal use for KrishiAI platform
