'use client'

import { useEffect, useState } from 'react'
import { MainLayout } from '@/components/layout/MainLayout'
import { Card } from '@/components/ui/card'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { Leaf, Users, AlertCircle, TrendingUp } from 'lucide-react'
import Link from 'next/link'

interface DashboardStats {
  totalCrops: number
  totalBuyers: number
  activeAlerts: number
}

const mockMSPData = [
  { crop: 'Rice', msp: 2100 },
  { crop: 'Wheat', msp: 2150 },
  { crop: 'Corn', msp: 1850 },
  { crop: 'Cotton', msp: 6000 },
  { crop: 'Sugarcane', msp: 290 },
  { crop: 'Soybean', msp: 3950 },
]

const quickNav = [
  {
    title: 'Find Profitable Crop',
    description: 'Get recommendations based on your farm conditions',
    icon: Leaf,
    href: '/crop-advisor',
    color: 'bg-primary/10 text-primary',
  },
  {
    title: 'Compare Crops',
    description: 'Side-by-side analysis of different crops',
    icon: TrendingUp,
    href: '/simulator',
    color: 'bg-accent/10 text-accent',
  },
  {
    title: 'Sell Now or Wait?',
    description: 'Market timing advice for your harvest',
    icon: AlertCircle,
    href: '/market-advice',
    color: 'bg-orange-100 text-orange-600',
  },
  {
    title: 'Find Buyers',
    description: 'Connect with verified agricultural buyers',
    icon: Users,
    href: '/buyers',
    color: 'bg-green-100 text-green-600',
  },
]

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalCrops: 10,
    totalBuyers: 6,
    activeAlerts: 3,
  })
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    // In Phase 6, we'll replace this with actual API call
    // const fetchStats = async () => {
    //   try {
    //     const res = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/dashboard-stats`)
    //     setStats(res.data)
    //   } catch (err) {
    //     console.error('Failed to fetch dashboard stats:', err)
    //   }
    // }
    // fetchStats()
  }, [])

  return (
    <MainLayout pageTitle="Dashboard" pageDescription="Welcome to KrishiAI - Your Agricultural Optimization Platform">
      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-muted-foreground text-sm font-medium">Total Crops Available</p>
              <p className="text-3xl font-bold text-primary mt-2">{stats.totalCrops}</p>
            </div>
            <Leaf className="w-12 h-12 text-primary/20" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-muted-foreground text-sm font-medium">Verified Buyers</p>
              <p className="text-3xl font-bold text-accent mt-2">{stats.totalBuyers}</p>
            </div>
            <Users className="w-12 h-12 text-accent/20" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-muted-foreground text-sm font-medium">Active Weather Alerts</p>
              <p className="text-3xl font-bold text-destructive mt-2">{stats.activeAlerts}</p>
            </div>
            <AlertCircle className="w-12 h-12 text-destructive/20" />
          </div>
        </Card>
      </div>

      {/* MSP Chart */}
      <Card className="p-6 mb-8">
        <h2 className="text-lg font-bold text-foreground mb-4">Current MSP (Minimum Support Price)</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={mockMSPData}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
            <XAxis dataKey="crop" stroke="var(--muted-foreground)" />
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
            <Bar dataKey="msp" fill="var(--primary)" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </Card>

      {/* Quick Navigation */}
      <div className="mb-8">
        <h2 className="text-lg font-bold text-foreground mb-4">Quick Access</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickNav.map((item) => (
            <Link key={item.href} href={item.href}>
              <Card className="p-4 hover:shadow-lg hover:-translate-y-1 transition-all cursor-pointer h-full">
                <div className={`w-10 h-10 rounded-lg ${item.color} flex items-center justify-center mb-3`}>
                  <item.icon className="w-5 h-5" />
                </div>
                <h3 className="font-semibold text-foreground mb-1">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.description}</p>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </MainLayout>
  )
}
