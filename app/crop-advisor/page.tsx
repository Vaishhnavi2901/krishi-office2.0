'use client'

import { useState } from 'react'
import { MainLayout } from '@/components/layout/MainLayout'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Spinner } from '@/components/ui/spinner'
import { CheckCircle2, TrendingUp, Droplet, Clock, AlertCircle } from 'lucide-react'

interface Recommendation {
  name: string
  confidence: number
  expected_yield: number
  expected_profit: number
  water_requirement: number
  duration_days: number
  risk_level: string
}

export default function CropAdvisor() {
  const [location, setLocation] = useState('')
  const [soilType, setSoilType] = useState('')
  const [season, setSeason] = useState('')
  const [waterAvailability, setWaterAvailability] = useState('')
  const [budget, setBudget] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [recommendations, setRecommendations] = useState<Recommendation[]>([])
  const [hasSearched, setHasSearched] = useState(false)

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!location || !soilType || !season || !waterAvailability) {
      alert('Please fill in all required fields')
      return
    }

    setIsLoading(true)
    setHasSearched(true)

    try {
      // Phase 6: Replace with actual API call
      // const res = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/predict-crop`, {
      //   location,
      //   soil_type: soilType,
      //   season,
      //   water_availability: waterAvailability,
      //   budget: budget ? parseFloat(budget) : undefined,
      // })
      // setRecommendations(res.data.recommendations)

      // Mock data for now
      const mockRecommendations: Recommendation[] = [
        {
          name: 'Rice',
          confidence: 92,
          expected_yield: 5.5,
          expected_profit: 780000,
          water_requirement: 1200,
          duration_days: 120,
          risk_level: 'medium',
        },
        {
          name: 'Wheat',
          confidence: 78,
          expected_yield: 4.8,
          expected_profit: 625000,
          water_requirement: 450,
          duration_days: 150,
          risk_level: 'low',
        },
        {
          name: 'Cotton',
          confidence: 65,
          expected_yield: 1.8,
          expected_profit: 745000,
          water_requirement: 600,
          duration_days: 180,
          risk_level: 'high',
        },
      ]
      
      setRecommendations(mockRecommendations)
    } catch (error) {
      console.error('Error fetching recommendations:', error)
      alert('Failed to fetch recommendations')
    } finally {
      setIsLoading(false)
    }
  }

  const getRiskColor = (level: string) => {
    switch (level.toLowerCase()) {
      case 'low':
        return 'bg-green-100 text-green-700 border-green-300'
      case 'medium':
        return 'bg-yellow-100 text-yellow-700 border-yellow-300'
      case 'high':
        return 'bg-red-100 text-red-700 border-red-300'
      default:
        return 'bg-gray-100 text-gray-700 border-gray-300'
    }
  }

  return (
    <MainLayout
      pageTitle="Find Profitable Crop"
      pageDescription="Get personalized crop recommendations based on your farm conditions"
    >
      <div className="max-w-4xl">
        {/* Search Form */}
        <Card className="p-6 mb-8">
          <form onSubmit={handleSearch}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <Label htmlFor="location" className="text-sm font-medium mb-2 block">
                  Location
                </Label>
                <Input
                  id="location"
                  placeholder="Enter your location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="bg-background"
                />
              </div>

              <div>
                <Label htmlFor="budget" className="text-sm font-medium mb-2 block">
                  Budget (Optional, in ₹)
                </Label>
                <Input
                  id="budget"
                  type="number"
                  placeholder="50000"
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                  className="bg-background"
                />
              </div>

              <div>
                <Label htmlFor="soil" className="text-sm font-medium mb-2 block">
                  Soil Type
                </Label>
                <Select value={soilType} onValueChange={setSoilType}>
                  <SelectTrigger id="soil" className="bg-background">
                    <SelectValue placeholder="Select soil type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="loamy">Loamy Soil</SelectItem>
                    <SelectItem value="clayey">Clayey Soil</SelectItem>
                    <SelectItem value="sandy">Sandy Soil</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="season" className="text-sm font-medium mb-2 block">
                  Farming Season
                </Label>
                <Select value={season} onValueChange={setSeason}>
                  <SelectTrigger id="season" className="bg-background">
                    <SelectValue placeholder="Select season" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="kharif">Kharif (Monsoon)</SelectItem>
                    <SelectItem value="rabi">Rabi (Winter)</SelectItem>
                    <SelectItem value="summer">Summer</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="md:col-span-2">
                <Label htmlFor="water" className="text-sm font-medium mb-2 block">
                  Water Availability
                </Label>
                <Select value={waterAvailability} onValueChange={setWaterAvailability}>
                  <SelectTrigger id="water" className="bg-background">
                    <SelectValue placeholder="Select water availability" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="high">High ({">"} 1000mm rainfall or irrigation available)</SelectItem>
                    <SelectItem value="medium">Medium (500-1000mm rainfall)</SelectItem>
                    <SelectItem value="low">Low ({"<"}500mm rainfall, limited irrigation)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              {isLoading ? (
                <>
                  <Spinner className="mr-2" />
                  Analyzing...
                </>
              ) : (
                'Get Recommendations'
              )}
            </Button>
          </form>
        </Card>

        {/* Recommendations */}
        {hasSearched && (
          <div>
            <h2 className="text-2xl font-bold text-foreground mb-6">
              {isLoading ? 'Analyzing your farm conditions...' : 'Recommended Crops'}
            </h2>

            {recommendations.length > 0 ? (
              <div className="space-y-4">
                {recommendations.map((rec, idx) => (
                  <Card
                    key={idx}
                    className={`p-6 border-2 transition-all ${
                      idx === 0 ? 'border-primary bg-primary/5' : 'border-border'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="text-xl font-bold text-foreground">{rec.name}</h3>
                            {idx === 0 && (
                              <span className="bg-primary text-primary-foreground text-xs font-semibold px-2 py-1 rounded">
                                Best Match
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-4">
                            <span className="text-muted-foreground text-sm">
                              Confidence: <span className="font-semibold text-foreground">{rec.confidence}%</span>
                            </span>
                            <div className="w-24 h-2 bg-border rounded-full">
                              <div
                                className="h-full bg-primary rounded-full transition-all"
                                style={{ width: `${rec.confidence}%` }}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                      {idx === 0 && <CheckCircle2 className="w-8 h-8 text-primary flex-shrink-0" />}
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="bg-card rounded-lg p-3">
                        <div className="flex items-center gap-2 mb-1">
                          <TrendingUp className="w-4 h-4 text-primary" />
                          <span className="text-xs text-muted-foreground">Expected Yield</span>
                        </div>
                        <p className="text-lg font-bold text-foreground">
                          {rec.expected_yield.toFixed(1)} <span className="text-xs">t/ha</span>
                        </p>
                      </div>

                      <div className="bg-card rounded-lg p-3">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs text-muted-foreground">Profit/Hectare</span>
                        </div>
                        <p className="text-lg font-bold text-green-600">
                          ₹{(rec.expected_profit / 1000).toFixed(0)}k
                        </p>
                      </div>

                      <div className="bg-card rounded-lg p-3">
                        <div className="flex items-center gap-2 mb-1">
                          <Droplet className="w-4 h-4 text-blue-500" />
                          <span className="text-xs text-muted-foreground">Water Needed</span>
                        </div>
                        <p className="text-lg font-bold text-foreground">
                          {rec.water_requirement} <span className="text-xs">mm</span>
                        </p>
                      </div>

                      <div className="bg-card rounded-lg p-3">
                        <div className="flex items-center gap-2 mb-1">
                          <Clock className="w-4 h-4 text-orange-500" />
                          <span className="text-xs text-muted-foreground">Duration</span>
                        </div>
                        <p className="text-lg font-bold text-foreground">
                          {rec.duration_days} <span className="text-xs">days</span>
                        </p>
                      </div>
                    </div>

                    {/* Risk Level */}
                    <div className="mt-4 pt-4 border-t border-border">
                      <div className="flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 text-muted-foreground" />
                        <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold border ${getRiskColor(rec.risk_level)}`}>
                          {rec.risk_level.charAt(0).toUpperCase() + rec.risk_level.slice(1)} Risk
                        </span>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              !isLoading && (
                <Card className="p-8 text-center">
                  <p className="text-muted-foreground mb-4">No recommendations found for the selected conditions.</p>
                  <p className="text-sm text-muted-foreground">Try adjusting your inputs and try again.</p>
                </Card>
              )
            )}
          </div>
        )}
      </div>
    </MainLayout>
  )
}
