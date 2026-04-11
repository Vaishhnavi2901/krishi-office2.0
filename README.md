# KrishiAI - Agricultural Optimization Platform

A comprehensive full-stack platform empowering Indian farmers with AI-driven crop recommendations, disease detection, and market insights.

## Overview

KrishiAI is designed to help farmers make data-driven decisions about crop selection, farming practices, pest management, and market timing. The platform combines modern web technology with agricultural expertise to provide actionable recommendations.

## Key Features

### 🌾 Crop Advisory
- **Find Profitable Crop**: Personalized crop recommendations based on soil type, season, water availability, and budget
- **Compare Crops**: Side-by-side comparison of crops with profit analysis
- **Expected Yields & Profits**: Detailed yield and profitability estimates

### 🔍 Disease Management
- **AI Disease Detection**: Upload crop leaf images for instant disease identification
- **Treatment Plans**: Get detailed treatment and prevention strategies
- **Early Warning**: Pest and disease alerts for your region

### 💰 Market Intelligence
- **Sell Now or Wait**: Real-time market advice with MSP comparison
- **Buyer Matching**: Find verified agricultural buyers near you
- **Price Predictions**: Short-term price forecasts based on market trends

### 🤖 AI Farming Assistant
- **Multilingual Chat**: Ask farming questions in English, Hindi, Tamil, Telugu, or Marathi
- **Voice Input**: Hands-free voice commands for field use
- **Instant Advice**: Real-time responses on crop management, pest control, and irrigation

### ⚠️ Risk Management
- **Weather Alerts**: Real-time weather and pest warnings
- **Emergency Preparedness**: Actionable safety tips for extreme weather
- **Risk Assessment**: Crop-specific risk evaluation

## Technology Stack

### Frontend
- **Framework**: Next.js 16 with React 19
- **Styling**: Tailwind CSS v4.2
- **UI Components**: shadcn/ui with Lucide React icons
- **Charts**: Recharts for data visualization
- **HTTP Client**: Axios for API integration
- **State**: React hooks + SWR for data fetching

### Backend
- **Framework**: FastAPI with async support
- **Database**: MongoDB with Motor (async driver)
- **Validation**: Pydantic v2
- **CORS**: Enabled for cross-origin requests
- **Server**: Uvicorn

### Data Structure
- **Hardcoded Datasets**: 10 crops, 6 diseases, 6 buyers, 5 weather alert types
- **No External APIs Required**: Self-contained for immediate deployment

## Project Structure

```
krishiai/
├── app/                          # Next.js app directory
│   ├── layout.tsx               # Root layout with metadata
│   ├── page.tsx                 # Dashboard homepage
│   ├── globals.css              # Global styles and theme
│   ├── crop-advisor/            # Crop recommendations page
│   ├── simulator/               # Compare crops page
│   ├── chatbot/                 # AI assistant chat page
│   ├── disease-detection/       # Disease detection page
│   ├── market-advice/           # Market timing advice page
│   ├── risk-alerts/             # Weather/pest alerts page
│   └── buyers/                  # Buyer matching page
├── components/
│   ├── layout/
│   │   ├── Sidebar.tsx         # Responsive sidebar navigation
│   │   ├── Header.tsx          # Page header component
│   │   └── MainLayout.tsx      # Main layout wrapper
│   └── ui/                     # shadcn/ui components (pre-installed)
├── backend/                     # FastAPI backend
│   ├── main.py                 # FastAPI application & all routes
│   ├── config.py               # Configuration & environment
│   ├── models.py               # Pydantic models for validation
│   ├── scoring.py              # Crop scoring & recommendation logic
│   ├── databases.py            # Hardcoded agricultural data
│   ├── pyproject.toml          # Python dependencies
│   ├── .env.example            # Environment template
│   └── README.md               # Backend documentation
├── public/                      # Static assets
├── .env.example                # Frontend env template
├── package.json                # Frontend dependencies
├── tailwind.config.ts          # Tailwind CSS configuration
├── tsconfig.json               # TypeScript configuration
└── README.md                   # This file
```

## Getting Started

### Prerequisites
- Node.js 18+ and pnpm
- Python 3.9+ with uv package manager
- MongoDB (local or Atlas connection string)

### Frontend Setup

1. **Install dependencies**:
```bash
pnpm install
```

2. **Configure environment**:
```bash
cp .env.example .env.local
# Update NEXT_PUBLIC_API_URL in .env.local
```

3. **Start development server**:
```bash
pnpm dev
```

Frontend will be available at `http://localhost:3000`

### Backend Setup

1. **Navigate to backend**:
```bash
cd backend
```

2. **Initialize Python project**:
```bash
uv init --bare .
uv add fastapi uvicorn motor pydantic pydantic-settings python-dotenv httpx aiohttp
```

3. **Configure environment**:
```bash
cp .env.example .env
# Update configuration as needed
```

4. **Start FastAPI server**:
```bash
uv run uvicorn main:app --reload
```

Backend API will be available at `http://localhost:8000`
- Interactive docs: `http://localhost:8000/docs`

## Usage Guide

### For Farmers

1. **Find the Right Crop**
   - Visit "Find Profitable Crop"
   - Enter your location, soil type, season, water availability, and budget
   - Get personalized crop recommendations with profit estimates

2. **Identify Crop Diseases**
   - Go to "Disease Detection"
   - Take/upload a photo of affected crop leaves
   - Receive instant diagnosis with treatment plan

3. **Get Market Advice**
   - Navigate to "Sell Now or Wait?"
   - Enter current crop price
   - Get timing recommendation with price forecast

4. **Find Buyers**
   - Select "Find Buyers"
   - Choose your crop
   - View verified buyers ranked by price and distance

5. **Monitor Alerts**
   - Check "Risk Alerts" regularly
   - Stay informed of weather warnings and pest threats
   - Plan farm activities accordingly

### API Integration

All frontend pages support API integration with the backend. Replace mock data calls with actual API endpoints:

```typescript
// Example: Crop Prediction
const response = await axios.post(
  `${process.env.NEXT_PUBLIC_API_URL}/api/predict-crop`,
  {
    location: "Punjab",
    soil_type: "loamy",
    season: "kharif",
    water_availability: "high",
    budget: 50000
  }
)
setRecommendations(response.data.recommendations)
```

## Available API Endpoints

### Crop Management
- `POST /api/predict-crop` - Get crop recommendations
- `POST /api/compare-crops` - Compare two crops
- `GET /api/crops-list` - Get all crops

### Disease & Pest
- `POST /api/detect-disease` - Identify crop disease
- `GET /api/risk-alert` - Get weather/pest alerts

### Market Intelligence
- `POST /api/market-advice` - Get sell/hold recommendation
- `GET /api/buyers?crop=rice` - Find buyers for crop

### AI Assistance
- `POST /api/chat` - Chat with AI farming assistant

### Dashboard
- `GET /api/dashboard-stats` - Get platform statistics
- `GET /health` - Health check endpoint

## Customization

### Theme Colors

Edit color values in `app/globals.css`:
- Primary: `#2E5B3D` (deep green)
- Accent: `#E56B42` (orange)
- Background: `#f8f9f6` (off-white)

### Adding New Crops

1. Add crop to `CROP_DATABASE` in `backend/databases.py`
2. Include soil/season/water preferences and MSP

### Extending AI Assistant

Replace mock responses in `backend/main.py` chat endpoint with actual LLM integration:

```python
from emergentintegrations import AsyncClient

client = AsyncClient(api_key=settings.emergent_llm_key)
response = await client.completions.create(
    model="gpt-4o",
    messages=[{"role": "user", "content": request.message}]
)
```

## Deployment

### Frontend (Vercel)
1. Connect GitHub repository
2. Set environment variables in Vercel dashboard
3. Deploy with `vercel deploy`

### Backend (Any Cloud Platform)

**Heroku Example**:
```bash
heroku create krishiai-api
heroku config:set MONGO_URL=your_mongodb_url
git push heroku main
```

**AWS/Google Cloud Example**:
1. Create MongoDB Atlas cluster
2. Deploy FastAPI with Docker
3. Configure environment variables
4. Set up CORS for frontend domain

## Important Notes

### Authentication
Currently, the platform has no authentication. For production, implement:
- User registration and login
- JWT token-based authentication
- Role-based access control (admin, farmer, buyer)

### Data Persistence
Currently uses hardcoded data. For production:
- Configure MongoDB connection
- Create data persistence models
- Implement user-specific data storage

### LLM Integration
The AI assistant uses keyword matching. For production:
- Add `EMERGENT_LLM_KEY` to `.env`
- Integrate with emergentintegrations API
- Replace mock responses with real LLM calls

## Future Roadmap

- [ ] User authentication and profiles
- [ ] MongoDB integration for data persistence
- [ ] Real-time market price feeds
- [ ] Advanced analytics and recommendations
- [ ] Mobile app (React Native)
- [ ] Multi-language support (currently English/Hindi/Tamil/Telugu/Marathi)
- [ ] Government MSP API integration
- [ ] Weather API integration
- [ ] Image upload optimization
- [ ] Performance monitoring and analytics

## Contributing

Contributions are welcome! To contribute:
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## Troubleshooting

### API Connection Issues
- Ensure backend is running on correct port
- Check CORS configuration in `.env`
- Verify `NEXT_PUBLIC_API_URL` in frontend `.env.local`

### Disease Detection Not Working
- Verify image is in supported format (JPG, PNG, WebP)
- Ensure crop name field helps with accuracy
- Check browser console for detailed error messages

### Market Advice Shows Generic Response
- This is mock data. Implement real LLM integration for specific advice
- Check backend logs for any errors

## Support

For issues, questions, or suggestions:
1. Check existing documentation
2. Review error logs in browser console and backend
3. Refer to API documentation at `http://localhost:8000/docs`

## License

Internal use only - KrishiAI Platform

## Acknowledgments

- Built for Indian farmers to improve agricultural productivity
- Leverages agricultural expertise with modern technology
- Designed with accessibility and ease of use in mind
