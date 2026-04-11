'use client'

import { useState } from 'react'
import { MainLayout } from '@/components/layout/MainLayout'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Spinner } from '@/components/ui/spinner'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { TrendingUp, Award } from 'lucide-react'

interface CropComparison {
  name: string
  score: number
  yield_estimate: number
  profit_estimate: number
  water_requirement: number
}

const crops = [
  'Rice', 'Wheat', 'Corn', 'Cotton', 'Sugarcane', 'Soybean', 'Tomato', 'Onion', 'Potato', 'Mango'
]

export default function CompareCrops() {
  const [crop1, setCrop1] = useState('')
  const [crop2, setCrop2] = useState('')
  const [soilType, setSoilType] = useState('')
  const [season, setSeason] = useState('')
  const [waterAvailability, setWaterAvailability] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [comparisonResult, setComparisonResult] = useState<{
    crop1: CropComparison
    crop2: CropComparison
    winner: string
    reason: string
  } | null>(null)
  const [hasSearched, setHasSearched] = useState(false)

  const handleCompare = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!crop1 || !crop2 || !soilType || !season || !waterAvailability) {
      alert('Please fill in all fields')
      return
    }

    if (crop1 === crop2) {
      alert('Please select different crops to compare')
      return
    }

    setIsLoading(true)
    setHasSearched(true)

    try {
      // Phase 6: Replace with actual API call
      // const res = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/compare-crops`, {
      //   crop1,
      //   crop2,
      //   soil_type: soilType,
      //   season,
      //   water_availability: waterAvailability,
      // })
      // setComparisonResult(res.data)

      // Mock data
      const mockResult = {
        crop1: {
          name: crop1,
          score: 82,
          yield_estimate: 5.5,
          profit_estimate: 780000,
          water_requirement: 1200,
        },
        crop2: {
          name: crop2,
          score: 65,
          yield_estimate: 3.2,
          profit_estimate: 520000,
          water_requirement: 450,
        },
        winner: crop1,
        reason: `${crop1} is better suited for your conditions with a suitability score of 82 compared to ${crop2}'s 65.`,
      }

      setComparisonResult(mockResult)
    } catch (error) {
      console.error('Error comparing crops:', error)
      alert('Failed to compare crops')
    } finally {
      setIsLoading(false)
    }
  }

  const chartData = comparisonResult
    ? [
        {
          metric: 'Suitability',
          [comparisonResult.crop1.name]: comparisonResult.crop1.score,
          [comparisonResult.crop2.name]: comparisonResult.crop2.score,
        },
        {
          metric: 'Yield (t/ha)',
          [comparisonResult.crop1.name]: comparisonResult.crop1.yield_estimate * 100,
          [comparisonResult.crop2.name]: comparisonResult.crop2.yield_estimate * 100,
        },
        {
          metric: 'Profit (₹/100k)',
          [comparisonResult.crop1.name]: comparisonResult.crop1.profit_estimate / 100000,
          [comparisonResult.crop2.name]: comparisonResult.crop2.profit_estimate / 100000,
        },
        {
          metric: 'Water (mm/100)',
          [comparisonResult.crop1.name]: comparisonResult.crop1.water_requirement / 100,
          [comparisonResult.crop2.name]: comparisonResult.crop2.water_requirement / 100,
        },
      ]
    : []

  return (
    <MainLayout
      pageTitle="Compare Crop Options"
      pageDescription="Side-by-side analysis of different crops for your farm"
    >
      <div className="max-w-6xl">
        {/* Comparison Form */}
        <Card className="p-6 mb-8">
          <form onSubmit={handleCompare}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
              <div>
                <Label htmlFor="crop1" className="text-sm font-medium mb-2 block">
                  First Crop
                </Label>
                <Select value={crop1} onValueChange={setCrop1}>
                  <SelectTrigger id="crop1" className="bg-background">
                    <SelectValue placeholder="Select crop" />
                  </SelectTrigger>
                  <SelectContent>
                    {crops.map((c) => (
                      <SelectItem key={c} value={c}>
                        {c}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="crop2" className="text-sm font-medium mb-2 block">
                  Second Crop
                </Label>
                <Select value={crop2} onValueChange={setCrop2}>
                  <SelectTrigger id="crop2" className="bg-background">
                    <SelectValue placeholder="Select crop" />
                  </SelectTrigger>
                  <SelectContent>
                    {crops.map((c) => (
                      <SelectItem key={c} value={c}>
                        {c}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="soil2" className="text-sm font-medium mb-2 block">
                  Soil Type
                </Label>
                <Select value={soilType} onValueChange={setSoilType}>
                  <SelectTrigger id="soil2" className="bg-background">
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
                <Label htmlFor="season2" className="text-sm font-medium mb-2 block">
                  Farming Season
                </Label>
                <Select value={season} onValueChange={setSeason}>
                  <SelectTrigger id="season2" className="bg-background">
                    <SelectValue placeholder="Select season" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="kharif">Kharif (Monsoon)</SelectItem>
                    <SelectItem value="rabi">Rabi (Winter)</SelectItem>
                    <SelectItem value="summer">Summer</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="lg:col-span-2">
                <Label htmlFor="water2" className="text-sm font-medium mb-2 block">
                  Water Availability
                </Label>
                <Select value={waterAvailability} onValueChange={setWaterAvailability}>
                  <SelectTrigger id="water2" className="bg-background">
                    <SelectValue placeholder="Select water availability" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="high">High ({">"} 1000mm rainfall or irrigation)</SelectItem>
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
                  Comparing...
                </>
              ) : (
                'Compare Crops'
              )}
            </Button>
          </form>
        </Card>

        {/* Comparison Results */}
        {hasSearched && comparisonResult && !isLoading && (
          <div>
            {/* Winner Announcement */}
            <Card className="p-6 mb-8 border-2 border-primary bg-primary/5">
              <div className="flex items-center gap-4 mb-4">
                <Award className="w-8 h-8 text-primary" />
                <div>
                  <h2 className="text-2xl font-bold text-foreground">Recommended Crop</h2>
                  <p className="text-primary font-semibold">{comparisonResult.winner}</p>
                </div>
              </div>
              <p className="text-foreground">{comparisonResult.reason}</p>
            </Card>

            {/* Side-by-side Comparison */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {[comparisonResult.crop1, comparisonResult.crop2].map((crop, idx) => (
                <Card
                  key={idx}
                  className={`p-6 border-2 ${
                    crop.name === comparisonResult.winner
                      ? 'border-primary bg-primary/5'
                      : 'border-border'
                  }`}
                >
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold text-foreground">{crop.name}</h3>
                    {crop.name === comparisonResult.winner && (
                      <span className="bg-primary text-primary-foreground text-xs font-semibold px-3 py-1 rounded-full">
                        Better Choice
                      </span>
                    )}
                  </div>

                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm text-muted-foreground">Suitability Score</span>
                        <span className="font-semibold text-foreground">{crop.score}/100</span>
                      </div>
                      <div className="w-full h-2 bg-border rounded-full">
                        <div
                          className="h-full bg-primary rounded-full"
                          style={{ width: `${crop.score}%` }}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border">
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Expected Yield</p>
                        <p className="text-lg font-bold text-foreground">
                          {crop.yield_estimate.toFixed(1)} <span className="text-xs">t/ha</span>
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Profit/Hectare</p>
                        <p className="text-lg font-bold text-green-600">
                          ₹{(crop.profit_estimate / 1000).toFixed(0)}k
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Water Needed</p>
                        <p className="text-lg font-bold text-foreground">
                          {crop.water_requirement} <span className="text-xs">mm</span>
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Efficiency</p>
                        <p className="text-lg font-bold text-blue-600">
                          {((crop.profit_estimate / crop.water_requirement) * 100).toFixed(0)}
                        </p>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            {/* Comparison Chart */}
            <Card className="p-6">
              <h3 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Performance Comparison
              </h3>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis dataKey="metric" stroke="var(--muted-foreground)" />
                  <YAxis stroke="var(--muted-foreground)" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'var(--card)',
                      border: `1px solid var(--border)`,
                      borderRadius: '8px',
                      color: 'var(--foreground)',
                    }}
                  />
                  <Legend />
                  <Bar dataKey={comparisonResult.crop1.name} fill="var(--primary)" />
                  <Bar dataKey={comparisonResult.crop2.name} fill="var(--accent)" />
                </BarChart>
              </ResponsiveContainer>
            </Card>
          </div>
        )}

        {hasSearched && !comparisonResult && !isLoading && (
          <Card className="p-8 text-center">
            <p className="text-muted-foreground mb-4">Unable to complete the comparison.</p>
            <p className="text-sm text-muted-foreground">Please try again with different selections.</p>
          </Card>
        )}
      </div>
    </MainLayout>
  )
}
