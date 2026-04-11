'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Menu, X, Leaf, BarChart3, Zap, MessageCircle, Upload, TrendingUp, AlertCircle, Users } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function Sidebar() {
  const [isOpen, setIsOpen] = useState(false)

  const primaryNav = [
    { label: 'Dashboard', href: '/', icon: BarChart3 },
    { label: 'Find Profitable Crop', href: '/crop-advisor', icon: Leaf },
    { label: 'Compare Crops', href: '/simulator', icon: TrendingUp },
    { label: 'AI Farming Assistant', href: '/chatbot', icon: MessageCircle },
  ]

  const secondaryNav = [
    { label: 'Disease Detection', href: '/disease-detection', icon: Upload },
    { label: 'Market Advice', href: '/market-advice', icon: Zap },
    { label: 'Risk Alerts', href: '/risk-alerts', icon: AlertCircle },
    { label: 'Buyer Matching', href: '/buyers', icon: Users },
  ]

  return (
    <>
      {/* Mobile header */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-primary border-b border-sidebar-border flex items-center justify-between px-4 z-50">
        <div className="flex items-center gap-2">
          <Leaf className="w-6 h-6 text-primary-foreground" />
          <span className="font-bold text-primary-foreground text-lg">KrishiAI</span>
        </div>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="text-primary-foreground p-1"
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile drawer */}
      {isOpen && (
        <div className="md:hidden fixed inset-0 top-16 bg-black/50 z-40" onClick={() => setIsOpen(false)} />
      )}
      <nav
        className={`fixed md:static top-16 md:top-0 left-0 bottom-0 w-64 bg-primary border-r border-sidebar-border flex flex-col z-50 transform transition-transform duration-200 ${
          isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        {/* Logo - desktop only */}
        <div className="hidden md:flex items-center gap-3 p-6 border-b border-sidebar-border">
          <Leaf className="w-7 h-7 text-sidebar-primary" />
          <span className="font-bold text-sidebar-primary text-xl">KrishiAI</span>
        </div>

        {/* Primary navigation */}
        <div className="flex-1 overflow-y-auto p-4 md:pt-6">
          <div className="space-y-1 mb-6">
            {primaryNav.map((item) => (
              <Link key={item.href} href={item.href}>
                <button
                  onClick={() => setIsOpen(false)}
                  className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sidebar-foreground hover:bg-black/10 transition-colors text-left group"
                >
                  <item.icon className="w-5 h-5 flex-shrink-0 group-hover:text-sidebar-accent" />
                  <span className="text-sm font-medium">{item.label}</span>
                </button>
              </Link>
            ))}
          </div>

          <div className="border-t border-sidebar-border pt-4">
            <p className="text-xs uppercase tracking-wider text-sidebar-foreground/60 px-4 mb-2 font-semibold">
              More Tools
            </p>
            <div className="space-y-1">
              {secondaryNav.map((item) => (
                <Link key={item.href} href={item.href}>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sidebar-foreground hover:bg-black/10 transition-colors text-left group"
                  >
                    <item.icon className="w-5 h-5 flex-shrink-0 group-hover:text-sidebar-accent" />
                    <span className="text-sm font-medium">{item.label}</span>
                  </button>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile content offset */}
      <div className="md:hidden h-16" />
    </>
  )
}
