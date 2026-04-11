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
import { Users, MapPin, Award, Truck, CreditCard, Star, Phone } from 'lucide-react'

interface Buyer {
  id: string
  name: string
  type: string
  location: string
  distance_km: number
  price_per_unit: number
  transport_cost: number
  net_price: number
  rating: number
  payment_days: number
}

const crops = [
  'Rice', 'Wheat', 'Corn', 'Cotton', 'Sugarcane', 'Soybean', 'Tomato', 'Onion', 'Potato', 'Mango'
]

export default function BuyerMatching() {
  const [selectedCrop, setSelectedCrop] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [bestBuyer, setBestBuyer] = useState<Buyer | null>(null)
  const [allBuyers, setAllBuyers] = useState<Buyer[]>([])
  const [hasSearched, setHasSearched] = useState(false)

  const handleFindBuyers = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!selectedCrop) {
      alert('Please select a crop')
      return
    }

    setIsLoading(true)
    setHasSearched(true)

    try {
      // Phase 6: Replace with actual API call
      // const res = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/buyers?crop=${selectedCrop}`)
      // setBestBuyer(res.data.best_buyer)
      // setAllBuyers(res.data.buyers)

      // Mock buyers data
      const mockBuyers: Buyer[] = [
        {
          id: 'buyer_1',
          name: 'Haryana Agricultural Cooperative',
          type: 'COOPERATIVE',
          location: 'Karnal, Haryana',
          distance_km: 45,
          price_per_unit: 2450,
          transport_cost: 150,
          net_price: 2300,
          rating: 4.7,
          payment_days: 7,
        },
        {
          id: 'buyer_2',
          name: 'Punjab Grain Traders',
          type: 'TRADER',
          location: 'Jalandhar, Punjab',
          distance_km: 120,
          price_per_unit: 2380,
          transport_cost: 280,
          net_price: 2100,
          rating: 4.2,
          payment_days: 3,
        },
        {
          id: 'buyer_3',
          name: 'Northern Mills Ltd',
          type: 'PROCESSOR',
          location: 'Delhi',
          distance_km: 200,
          price_per_unit: 2520,
          transport_cost: 200,
          net_price: 2320,
          rating: 4.5,
          payment_days: 15,
        },
        {
          id: 'buyer_4',
          name: 'Direct Farm Export',
          type: 'TRADER',
          location: 'Chandigarh',
          distance_km: 80,
          price_per_unit: 2400,
          transport_cost: 120,
          net_price: 2280,
          rating: 3.9,
          payment_days: 5,
        },
        {
          id: 'buyer_5',
          name: 'National Food Corporation',
          type: 'PROCESSOR',
          location: 'Gurgaon',
          distance_km: 150,
          price_per_unit: 2350,
          transport_cost: 180,
          net_price: 2170,
          rating: 4.4,
          payment_days: 30,
        },
        {
          id: 'buyer_6',
          name: 'State Storage Depot',
          type: 'COOPERATIVE',
          location: 'Faridabad',
          distance_km: 90,
          price_per_unit: 2410,
          transport_cost: 130,
          net_price: 2280,
          rating: 4.1,
          payment_days: 10,
        },
      ]

      // Sort by net price (descending) and set best buyer
      const sorted = [...mockBuyers].sort((a, b) => b.net_price - a.net_price)
      setBestBuyer(sorted[0])
      setAllBuyers(sorted)
    } catch (error) {
      console.error('Error finding buyers:', error)
      alert('Failed to find buyers')
    } finally {
      setIsLoading(false)
    }
  }

  const getBuyerTypeColor = (type: string) => {
    switch (type) {
      case 'COOPERATIVE':
        return 'bg-blue-100 text-blue-700'
      case 'TRADER':
        return 'bg-orange-100 text-orange-700'
      case 'PROCESSOR':
        return 'bg-purple-100 text-purple-700'
      default:
        return 'bg-gray-100 text-gray-700'
    }
  }

  return (
    <MainLayout
      pageTitle="Find Buyers"
      pageDescription="Connect with verified agricultural buyers for your harvest"
    >
      <div className="max-w-6xl">
        {/* Search Form */}
        <Card className="p-6 mb-8">
          <form onSubmit={handleFindBuyers}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div className="md:col-span-2">
                <Label htmlFor="buyer-crop" className="text-sm font-medium mb-2 block">
                  Select Crop to Sell
                </Label>
                <Select value={selectedCrop} onValueChange={setSelectedCrop}>
                  <SelectTrigger id="buyer-crop" className="bg-background">
                    <SelectValue placeholder="Select crop" />
                  </SelectTrigger>
                  <SelectContent>
                    {crops.map((crop) => (
                      <SelectItem key={crop} value={crop}>
                        {crop}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="bg-primary hover:bg-primary/90 text-primary-foreground self-end"
              >
                {isLoading ? (
                  <>
                    <Spinner className="mr-2" />
                    Finding...
                  </>
                ) : (
                  <>
                    <Users className="w-4 h-4 mr-2" />
                    Find Buyers
                  </>
                )}
              </Button>
            </div>
          </form>
        </Card>

        {/* Best Buyer Highlight */}
        {hasSearched && bestBuyer && !isLoading && (
          <Card className="p-6 mb-8 border-2 border-primary bg-primary/5">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <Award className="w-8 h-8 text-primary" />
                <div>
                  <p className="text-sm font-semibold text-primary">Best Buyer Match</p>
                  <h2 className="text-2xl font-bold text-foreground">{bestBuyer.name}</h2>
                </div>
              </div>
              <div className="text-right">
                <p className="text-3xl font-bold text-green-600">₹{bestBuyer.net_price}</p>
                <p className="text-xs text-muted-foreground">Net price per unit</p>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4 pt-4 border-t border-border">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <MapPin className="w-4 h-4 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">Location</span>
                </div>
                <p className="font-semibold text-foreground">{bestBuyer.location}</p>
                <p className="text-xs text-muted-foreground">{bestBuyer.distance_km}km away</p>
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Star className="w-4 h-4 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">Rating</span>
                </div>
                <p className="font-semibold text-foreground">{bestBuyer.rating.toFixed(1)}/5</p>
                <p className="text-xs text-yellow-600">★★★★★</p>
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <CreditCard className="w-4 h-4 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">Payment</span>
                </div>
                <p className="font-semibold text-foreground">In {bestBuyer.payment_days} days</p>
              </div>
              <div>
                <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground h-8 text-sm">
                  <Phone className="w-3 h-3 mr-1" />
                  Contact Now
                </Button>
              </div>
            </div>
          </Card>
        )}

        {/* All Buyers Table */}
        {hasSearched && allBuyers.length > 0 && !isLoading && (
          <Card className="overflow-hidden">
            <div className="p-6 border-b border-border">
              <h3 className="text-lg font-bold text-foreground">
                Available Buyers for {selectedCrop}
              </h3>
              <p className="text-sm text-muted-foreground mt-1">
                {allBuyers.length} buyers interested in your crop
              </p>
            </div>

            {/* Table - Desktop */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-muted border-b border-border">
                  <tr>
                    <th className="px-6 py-3 text-left font-semibold text-foreground">Buyer Name</th>
                    <th className="px-6 py-3 text-left font-semibold text-foreground">Type</th>
                    <th className="px-6 py-3 text-left font-semibold text-foreground">Location</th>
                    <th className="px-6 py-3 text-center font-semibold text-foreground">Distance</th>
                    <th className="px-6 py-3 text-right font-semibold text-foreground">Price</th>
                    <th className="px-6 py-3 text-right font-semibold text-foreground">Transport</th>
                    <th className="px-6 py-3 text-right font-semibold text-foreground">Net Price</th>
                    <th className="px-6 py-3 text-center font-semibold text-foreground">Rating</th>
                    <th className="px-6 py-3 text-center font-semibold text-foreground">Payment</th>
                  </tr>
                </thead>
                <tbody>
                  {allBuyers.map((buyer, idx) => (
                    <tr
                      key={buyer.id}
                      className={`border-b border-border transition-colors hover:bg-muted/50 ${
                        bestBuyer?.id === buyer.id ? 'bg-primary/5 font-semibold' : ''
                      }`}
                    >
                      <td className="px-6 py-4 font-medium text-foreground">
                        <div className="flex items-center gap-2">
                          {bestBuyer?.id === buyer.id && <Award className="w-4 h-4 text-primary" />}
                          {buyer.name}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-block px-2 py-1 rounded text-xs font-semibold ${getBuyerTypeColor(buyer.type)}`}>
                          {buyer.type}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-foreground">{buyer.location}</td>
                      <td className="px-6 py-4 text-center text-foreground">{buyer.distance_km} km</td>
                      <td className="px-6 py-4 text-right font-semibold text-foreground">₹{buyer.price_per_unit}</td>
                      <td className="px-6 py-4 text-right text-muted-foreground">-₹{buyer.transport_cost}</td>
                      <td className="px-6 py-4 text-right font-bold text-green-600">₹{buyer.net_price}</td>
                      <td className="px-6 py-4 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                          <span className="text-foreground">{buyer.rating}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center text-foreground">{buyer.payment_days}d</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Card View - Mobile */}
            <div className="md:hidden space-y-4 p-6">
              {allBuyers.map((buyer) => (
                <Card
                  key={buyer.id}
                  className={`p-4 border-2 ${
                    bestBuyer?.id === buyer.id ? 'border-primary bg-primary/5' : 'border-border'
                  }`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      {bestBuyer?.id === buyer.id && <Award className="w-4 h-4 text-primary" />}
                      <div>
                        <h4 className="font-bold text-foreground">{buyer.name}</h4>
                        <span className={`inline-block px-2 py-0.5 rounded text-xs font-semibold mt-1 ${getBuyerTypeColor(buyer.type)}`}>
                          {buyer.type}
                        </span>
                      </div>
                    </div>
                    <p className="text-lg font-bold text-green-600">₹{buyer.net_price}</p>
                  </div>

                  <div className="space-y-2 text-sm mb-4 pb-4 border-b border-border">
                    <p className="text-foreground">
                      <span className="text-muted-foreground">Location:</span> {buyer.location} ({buyer.distance_km}km)
                    </p>
                    <p className="text-foreground">
                      <span className="text-muted-foreground">Rating:</span> {buyer.rating}/5
                    </p>
                    <p className="text-foreground">
                      <span className="text-muted-foreground">Payment:</span> In {buyer.payment_days} days
                    </p>
                  </div>

                  <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground h-8 text-sm">
                    <Phone className="w-3 h-3 mr-1" />
                    Contact Buyer
                  </Button>
                </Card>
              ))}
            </div>
          </Card>
        )}

        {hasSearched && allBuyers.length === 0 && !isLoading && (
          <Card className="p-8 text-center">
            <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
            <p className="text-muted-foreground mb-4">No buyers found for this crop in your region.</p>
            <p className="text-sm text-muted-foreground">Try selecting a different crop or check back later.</p>
          </Card>
        )}
      </div>
    </MainLayout>
  )
}
