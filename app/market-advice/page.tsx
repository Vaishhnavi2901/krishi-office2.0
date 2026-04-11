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
import { TrendingUp, TrendingDown, AlertCircle } from 'lucide-react'

interface MarketAdvice {
  recommendation: 'SELL' | 'WAIT'
  confidence: number
  reasoning: string
  msp: number
  forecast_price: number
}

const crops = [
  'Rice', 'Wheat', 'Corn', 'Cotton', 'Sugarcane', 'Soybean', 'Tomato', 'Onion', 'Potato', 'Mango'
]

export default function MarketAdvice() {
  const [crop, setCrop] = useState('')
  const [currentPrice, setCurrentPrice] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [advice, setAdvice] = useState<MarketAdvice | null>(null)
  const [hasSearched, setHasSearched] = useState(false)

  const handleGetAdvice = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!crop || !currentPrice) {
      alert('Please fill in all fields')
      return
    }

    setIsLoading(true)
    setHasSearched(true)

    try {
      // Phase 6: Replace with actual API call
      // const res = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/market-advice`, {
      //   crop,
      //   current_price: parseFloat(currentPrice),
      // })
      // setAdvice(res.data)

      // Mock data
      const price = parseFloat(currentPrice)
      let mockAdvice: MarketAdvice

      if (price > 2500) {
        mockAdvice = {
          recommendation: 'SELL',
          confidence: 85,
          reasoning: `Your ${crop} is priced well above MSP (₹${2100}). Market conditions are favorable. Recommend selling within the next 3-5 days to lock in profits.`,
          msp: 2100,
          forecast_price: price * 0.98,
        }
      } else if (price > 2100) {
        mockAdvice = {
          recommendation: 'SELL',
          confidence: 60,
          reasoning: `Price is slightly above MSP. Good opportunity to sell. Market may soften in the coming week.`,
          msp: 2100,
          forecast_price: price * 0.95,
        }
      } else {
        mockAdvice = {
          recommendation: 'WAIT',
          confidence: 75,
          reasoning: `Current price is below MSP. Hold your crop and wait for better market conditions. Expected price recovery in 2-3 weeks.`,
          msp: 2100,
          forecast_price: price * 1.15,
        }
      }

      setAdvice(mockAdvice)
    } catch (error) {
      console.error('Error getting market advice:', error)
      alert('Failed to get market advice')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <MainLayout
      pageTitle="Sell Now or Wait?"
      pageDescription="Get real-time market timing advice for your harvest"
    >
      <div className="max-w-4xl">
        {/* Input Form */}
        <Card className="p-6 mb-8">
          <form onSubmit={handleGetAdvice}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <Label htmlFor="market-crop" className="text-sm font-medium mb-2 block">
                  Select Crop
                </Label>
                <Select value={crop} onValueChange={setCrop}>
                  <SelectTrigger id="market-crop" className="bg-background">
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
                <Label htmlFor="current-price" className="text-sm font-medium mb-2 block">
                  Current Market Price (₹/unit)
                </Label>
                <Input
                  id="current-price"
                  type="number"
                  placeholder="e.g., 2500"
                  value={currentPrice}
                  onChange={(e) => setCurrentPrice(e.target.value)}
                  className="bg-background"
                />
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
                'Get Market Advice'
              )}
            </Button>
          </form>
        </Card>

        {/* Market Advice Results */}
        {hasSearched && advice && !isLoading && (
          <div className="space-y-6">
            {/* Recommendation Circle */}
            <Card className={`p-8 text-center border-4 ${
              advice.recommendation === 'SELL'
                ? 'border-green-500 bg-green-50'
                : 'border-yellow-500 bg-yellow-50'
            }`}>
              <div className={`w-32 h-32 rounded-full mx-auto mb-6 flex items-center justify-center ${
                advice.recommendation === 'SELL'
                  ? 'bg-green-500'
                  : 'bg-yellow-500'
              }`}>
                {advice.recommendation === 'SELL' ? (
                  <TrendingUp className="w-16 h-16 text-white" />
                ) : (
                  <AlertCircle className="w-16 h-16 text-white" />
                )}
              </div>
              <h2 className={`text-4xl font-bold mb-2 ${
                advice.recommendation === 'SELL'
                  ? 'text-green-700'
                  : 'text-yellow-700'
              }`}>
                {advice.recommendation === 'SELL' ? 'SELL NOW' : 'WAIT FOR NOW'}
              </h2>
              <p className={`text-lg font-semibold ${
                advice.recommendation === 'SELL'
                  ? 'text-green-600'
                  : 'text-yellow-600'
              }`}>
                Confidence: {advice.confidence}%
              </p>
            </Card>

            {/* Analysis Details */}
            <Card className="p-6">
              <h3 className="text-lg font-bold text-foreground mb-4">Analysis & Reasoning</h3>
              <div className="bg-card rounded-lg p-4 border border-border">
                <p className="text-foreground leading-relaxed">{advice.reasoning}</p>
              </div>
            </Card>

            {/* Price Comparison */}
            <Card className="p-6">
              <h3 className="text-lg font-bold text-foreground mb-6">Price Comparison</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gray-50 rounded-lg p-4 text-center border border-border">
                  <p className="text-xs text-muted-foreground mb-2">MSP (Minimum Support Price)</p>
                  <p className="text-2xl font-bold text-foreground">₹{advice.msp}</p>
                  <p className="text-xs text-muted-foreground mt-2">Government guaranteed price</p>
                </div>

                <div className="bg-blue-50 rounded-lg p-4 text-center border border-blue-200">
                  <p className="text-xs text-muted-foreground mb-2">Your Current Price</p>
                  <p className="text-2xl font-bold text-blue-600">₹{parseFloat(currentPrice).toLocaleString()}</p>
                  <p className="text-xs text-blue-600 mt-2">
                    {parseFloat(currentPrice) > advice.msp
                      ? `+₹${(parseFloat(currentPrice) - advice.msp).toFixed(0)}`
                      : `-₹${(advice.msp - parseFloat(currentPrice)).toFixed(0)}`}
                    {' '}from MSP
                  </p>
                </div>

                <div className="bg-green-50 rounded-lg p-4 text-center border border-green-200">
                  <p className="text-xs text-muted-foreground mb-2">1-Week Forecast</p>
                  <p className="text-2xl font-bold text-green-600">₹{advice.forecast_price.toFixed(0)}</p>
                  <p className="text-xs text-green-600 mt-2">
                    {advice.forecast_price > parseFloat(currentPrice)
                      ? '↑ Price may increase'
                      : '↓ Price may decrease'}
                  </p>
                </div>
              </div>
            </Card>

            {/* Progress Bar for Price Trend */}
            <Card className="p-6">
              <h3 className="text-lg font-bold text-foreground mb-4">Price Position Analysis</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-muted-foreground">Price Range (Last 30 days)</span>
                    <span className="text-sm font-semibold text-foreground">
                      ₹{(advice.msp * 0.85).toFixed(0)} - ₹{(advice.msp * 1.35).toFixed(0)}
                    </span>
                  </div>
                  <div className="w-full h-3 bg-border rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-red-500 via-yellow-500 to-green-500"
                      style={{
                        width: '100%',
                      }}
                    />
                    <div
                      className="relative -mt-3 h-3"
                      style={{
                        marginLeft: `${((parseFloat(currentPrice) - advice.msp * 0.85) / (advice.msp * 0.5)) * 100}%`,
                      }}
                    >
                      <div className="w-6 h-5 bg-white border-2 border-foreground rounded-full" />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-3 text-xs text-center">
                  <div>
                    <p className="text-muted-foreground">Low</p>
                    <p className="font-semibold text-red-600">₹{(advice.msp * 0.85).toFixed(0)}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Average</p>
                    <p className="font-semibold text-yellow-600">₹{advice.msp}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">High</p>
                    <p className="font-semibold text-green-600">₹{(advice.msp * 1.35).toFixed(0)}</p>
                  </div>
                </div>
              </div>
            </Card>

            {/* Recommendation Card */}
            <Card className={`p-6 border-2 ${
              advice.recommendation === 'SELL'
                ? 'border-green-500 bg-green-50'
                : 'border-yellow-500 bg-yellow-50'
            }`}>
              <h3 className={`text-lg font-bold mb-3 ${
                advice.recommendation === 'SELL'
                  ? 'text-green-700'
                  : 'text-yellow-700'
              }`}>
                Action Items
              </h3>
              <ul className={`space-y-2 ${
                advice.recommendation === 'SELL'
                  ? 'text-green-700'
                  : 'text-yellow-700'
              }`}>
                {advice.recommendation === 'SELL' ? (
                  <>
                    <li className="flex gap-2">
                      <span className="font-bold">✓</span>
                      <span>Contact local buyers and traders immediately</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="font-bold">✓</span>
                      <span>Prepare harvest and arrange transportation</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="font-bold">✓</span>
                      <span>Negotiate best deal within next 3-5 days</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="font-bold">✓</span>
                      <span>Lock in price to avoid market fluctuations</span>
                    </li>
                  </>
                ) : (
                  <>
                    <li className="flex gap-2">
                      <span className="font-bold">→</span>
                      <span>Store crop in good condition</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="font-bold">→</span>
                      <span>Monitor market prices regularly</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="font-bold">→</span>
                      <span>Check government price announcements</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="font-bold">→</span>
                      <span>Plan harvest logistics in advance</span>
                    </li>
                  </>
                )}
              </ul>
            </Card>
          </div>
        )}

        {hasSearched && !advice && !isLoading && (
          <Card className="p-8 text-center">
            <p className="text-muted-foreground mb-4">Could not generate market advice.</p>
            <p className="text-sm text-muted-foreground">Please try again with different inputs.</p>
          </Card>
        )}
      </div>
    </MainLayout>
  )
}
