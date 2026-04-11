'use client'

import { useState, useEffect } from 'react'
import { MainLayout } from '@/components/layout/MainLayout'
import { Card } from '@/components/ui/card'
import { AlertCircle, Cloud, Bug, Thermometer, Snowflake, Wind, RotateCw } from 'lucide-react'

interface WeatherAlert {
  type: string
  title: string
  description: string
  region: string
  severity: 'LOW' | 'MEDIUM' | 'HIGH'
  valid_until: string
}

export default function RiskAlerts() {
  const [alerts, setAlerts] = useState<WeatherAlert[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date())

  // Fetch alerts on mount and set up auto-refresh
  useEffect(() => {
    const fetchAlerts = async () => {
      setIsLoading(true)
      try {
        // Phase 6: Replace with actual API call
        // const res = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/risk-alert`)
        // setAlerts(res.data.alerts)

        // Mock alerts
        const mockAlerts: WeatherAlert[] = [
          {
            type: 'rain',
            title: 'Heavy Rainfall Expected',
            description: 'Heavy rainfall expected in next 48 hours. Ensure proper drainage in fields. Consider harvesting if crop is ready.',
            region: 'North India',
            severity: 'HIGH',
            valid_until: '2024-04-13T18:00:00Z',
          },
          {
            type: 'pest',
            title: 'Armyworm Alert',
            description: 'Armyworm infestation reported in neighboring districts. Monitor crops daily. Consider preventive spray with neem or Bt.',
            region: 'Central India',
            severity: 'MEDIUM',
            valid_until: '2024-04-20T18:00:00Z',
          },
          {
            type: 'heat_wave',
            title: 'Heat Wave Warning',
            description: 'Extreme heat expected in coming days. Increase irrigation frequency. Use mulching to conserve soil moisture.',
            region: 'Western India',
            severity: 'HIGH',
            valid_until: '2024-04-15T18:00:00Z',
          },
          {
            type: 'frost',
            title: 'Frost Risk in Early Morning',
            description: 'Frost expected in early morning hours. Protect young plants and saplings. Use frost covers if necessary.',
            region: 'Northern Plains',
            severity: 'MEDIUM',
            valid_until: '2024-04-12T06:00:00Z',
          },
          {
            type: 'wind',
            title: 'Strong Wind Warning',
            description: 'Strong winds predicted. Support tall crops. Secure loose structures and equipment in the field.',
            region: 'Coastal Areas',
            severity: 'MEDIUM',
            valid_until: '2024-04-14T12:00:00Z',
          },
        ]

        setAlerts(mockAlerts)
        setLastUpdated(new Date())
      } catch (error) {
        console.error('Error fetching alerts:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchAlerts()

    // Auto-refresh every 60 seconds
    const interval = setInterval(fetchAlerts, 60000)
    return () => clearInterval(interval)
  }, [])

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'rain':
        return <Cloud className="w-6 h-6" />
      case 'pest':
        return <Bug className="w-6 h-6" />
      case 'heat_wave':
        return <Thermometer className="w-6 h-6" />
      case 'frost':
        return <Snowflake className="w-6 h-6" />
      case 'wind':
        return <Wind className="w-6 h-6" />
      default:
        return <AlertCircle className="w-6 h-6" />
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'LOW':
        return { bg: 'bg-green-50', border: 'border-green-300', text: 'text-green-700', dot: 'bg-green-500' }
      case 'MEDIUM':
        return { bg: 'bg-yellow-50', border: 'border-yellow-300', text: 'text-yellow-700', dot: 'bg-yellow-500' }
      case 'HIGH':
        return { bg: 'bg-red-50', border: 'border-red-300', text: 'text-red-700', dot: 'bg-red-500' }
      default:
        return { bg: 'bg-gray-50', border: 'border-gray-300', text: 'text-gray-700', dot: 'bg-gray-500' }
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const today = new Date()
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)

    if (date.toDateString() === today.toDateString()) {
      return `Today at ${date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}`
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return `Tomorrow at ${date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}`
    } else {
      return date.toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
    }
  }

  return (
    <MainLayout
      pageTitle="Risk Alerts"
      pageDescription="Real-time weather and pest alerts for your region"
    >
      <div className="max-w-4xl">
        {/* Header with Last Updated */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-sm text-muted-foreground">
              Last updated: {lastUpdated.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
            </p>
            <p className="text-xs text-muted-foreground">
              Auto-refreshes every 60 seconds
            </p>
          </div>
          <button
            onClick={() => {
              setIsLoading(true)
              setTimeout(() => setIsLoading(false), 1000)
              setLastUpdated(new Date())
            }}
            disabled={isLoading}
            className="p-2 rounded-lg hover:bg-muted transition-colors disabled:opacity-50"
            title="Refresh alerts"
          >
            <RotateCw className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
        </div>

        {/* Alerts List */}
        <div className="space-y-4">
          {alerts.length > 0 ? (
            alerts.map((alert, idx) => {
              const colors = getSeverityColor(alert.severity)
              return (
                <Card
                  key={idx}
                  className={`p-6 border-2 ${colors.bg} ${colors.border} transition-all hover:shadow-lg`}
                >
                  <div className="flex items-start gap-4">
                    {/* Icon */}
                    <div className={`p-3 rounded-lg flex-shrink-0 ${colors.dot} bg-opacity-10`}>
                      <div className={colors.text}>{getAlertIcon(alert.type)}</div>
                    </div>

                    {/* Content */}
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="text-lg font-bold text-foreground">{alert.title}</h3>
                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${colors.text} ${colors.bg} border ${colors.border}`}>
                          {alert.severity}
                        </span>
                      </div>

                      <p className="text-foreground mb-3 leading-relaxed">{alert.description}</p>

                      <div className="flex flex-wrap gap-4 text-sm">
                        <div>
                          <span className="text-muted-foreground">Region: </span>
                          <span className="font-semibold text-foreground">{alert.region}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Valid Until: </span>
                          <span className="font-semibold text-foreground">{formatDate(alert.valid_until)}</span>
                        </div>
                      </div>

                      {/* Alert Indicator Dot */}
                      <div className="mt-4 pt-4 border-t border-current border-opacity-20">
                        <div className="flex items-center gap-2">
                          <div className={`w-3 h-3 rounded-full ${colors.dot} animate-pulse`} />
                          <span className="text-xs text-muted-foreground">Active alert</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              )
            })
          ) : (
            <Card className="p-8 text-center bg-green-50 border-2 border-green-300">
              <AlertCircle className="w-12 h-12 text-green-600 mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-bold text-green-700 mb-2">No Active Alerts</h3>
              <p className="text-green-600">Your region is currently clear of major weather and pest risks.</p>
            </Card>
          )}
        </div>

        {/* Alert Types Legend */}
        <Card className="p-6 mt-8 bg-muted/50">
          <h3 className="text-lg font-bold text-foreground mb-4">Alert Types Guide</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="flex items-center gap-2">
              <Cloud className="w-5 h-5 text-blue-600" />
              <span className="text-sm text-foreground">Rain</span>
            </div>
            <div className="flex items-center gap-2">
              <Bug className="w-5 h-5 text-orange-600" />
              <span className="text-sm text-foreground">Pest</span>
            </div>
            <div className="flex items-center gap-2">
              <Thermometer className="w-5 h-5 text-red-600" />
              <span className="text-sm text-foreground">Heat</span>
            </div>
            <div className="flex items-center gap-2">
              <Snowflake className="w-5 h-5 text-cyan-600" />
              <span className="text-sm text-foreground">Frost</span>
            </div>
            <div className="flex items-center gap-2">
              <Wind className="w-5 h-5 text-gray-600" />
              <span className="text-sm text-foreground">Wind</span>
            </div>
          </div>
        </Card>

        {/* Safety Tips */}
        <Card className="p-6 mt-6 border-l-4 border-l-primary">
          <h3 className="text-lg font-bold text-foreground mb-4">Emergency Preparedness Tips</h3>
          <ul className="space-y-3 text-sm text-foreground">
            <li className="flex gap-3">
              <span className="font-bold text-primary">1.</span>
              <span>Check alerts daily, especially during monsoon and extreme weather seasons</span>
            </li>
            <li className="flex gap-3">
              <span className="font-bold text-primary">2.</span>
              <span>Store emergency supplies (fungicides, pesticides, tools) during alert periods</span>
            </li>
            <li className="flex gap-3">
              <span className="font-bold text-primary">3.</span>
              <span>Maintain field drainage systems for heavy rainfall warnings</span>
            </li>
            <li className="flex gap-3">
              <span className="font-bold text-primary">4.</span>
              <span>Contact local agricultural extension office for detailed guidance</span>
            </li>
            <li className="flex gap-3">
              <span className="font-bold text-primary">5.</span>
              <span>Document crop damage with photos for insurance claims if needed</span>
            </li>
          </ul>
        </Card>
      </div>
    </MainLayout>
  )
}
