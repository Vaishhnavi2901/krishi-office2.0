'use client'

import { useState, useRef, useEffect } from 'react'
import { MainLayout } from '@/components/layout/MainLayout'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Send, Mic, Copy, Check } from 'lucide-react'
import { useState as useStateWithInit } from 'react'

interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
}

export default function ChatBot() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'assistant',
      content:
        'नमस्ते! I\'m your AI Farming Assistant. I can help you with crop recommendations, farming techniques, pest management, and market insights. Ask me anything about farming!',
    },
  ])
  const [inputValue, setInputValue] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [language, setLanguage] = useState('english')
  const [sessionId, setSessionId] = useState('')
  const [isListening, setIsListening] = useState(false)
  const [copiedId, setCopiedId] = useState<number | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const recognitionRef = useRef<any>(null)

  // Initialize session ID and speech recognition
  useEffect(() => {
    const newSessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    setSessionId(newSessionId)

    // Initialize Web Speech API if available
    if (typeof window !== 'undefined') {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
      if (SpeechRecognition) {
        recognitionRef.current = new SpeechRecognition()
        recognitionRef.current.continuous = false
        recognitionRef.current.interimResults = true

        recognitionRef.current.onstart = () => setIsListening(true)
        recognitionRef.current.onend = () => setIsListening(false)
        recognitionRef.current.onresult = (event: any) => {
          let interimTranscript = ''
          for (let i = event.resultIndex; i < event.results.length; i++) {
            const transcript = event.results[i][0].transcript
            if (event.results[i].isFinal) {
              setInputValue((prev) => prev + transcript)
            } else {
              interimTranscript += transcript
            }
          }
        }
      }
    }
  }, [])

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!inputValue.trim()) return

    // Add user message
    const userMessage: ChatMessage = { role: 'user', content: inputValue }
    setMessages((prev) => [...prev, userMessage])
    setInputValue('')
    setIsLoading(true)

    try {
      // Phase 6: Replace with actual API call
      // const res = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/chat`, {
      //   message: inputValue,
      //   session_id: sessionId,
      //   language,
      // })
      // const assistantMessage = res.data.message

      // Mock response for now
      const mockResponses: Record<string, string> = {
        rice:
          'Rice is best grown in regions with high rainfall or irrigation. It requires warm temperatures and thrives in loamy or clayey soils. Plant during kharif season for best results. Expected yield: 5-6 tons per hectare.',
        wheat:
          'Wheat is a winter crop that grows well in temperate regions. It prefers well-drained loamy soil and requires moderate water. Sow during rabi season (October-November). Expected yield: 4-5 tons per hectare.',
        disease:
          'Common crop diseases include powdery mildew, leaf blight, and root rot. Prevention includes crop rotation, proper spacing, and using resistant varieties. Apply appropriate fungicides if needed.',
        pest:
          'Common pests include aphids, whiteflies, and armyworms. Use integrated pest management: monitor crops regularly, use traps, and apply organic pesticides when necessary.',
        irrigation:
          'Irrigation frequency depends on crop type and weather. Rice needs continuous flooding, while wheat needs 3-4 irrigations. Drip irrigation is efficient for vegetables.',
        price: 'Current market prices vary by crop and season. Rice MSP: ₹2100/quintal, Wheat: ₹2150/quintal. Check local mandi prices for the best selling rates.',
      }

      let assistantMessage =
        'Thank you for your question! I can help with crop cultivation, disease management, pest control, irrigation, market prices, and more. Please ask something specific.'

      const query = inputValue.toLowerCase()
      for (const [key, value] of Object.entries(mockResponses)) {
        if (query.includes(key)) {
          assistantMessage = value
          break
        }
      }

      setMessages((prev) => [...prev, { role: 'assistant', content: assistantMessage }])
    } catch (error) {
      console.error('Error sending message:', error)
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: 'Sorry, I encountered an error. Please try again.' },
      ])
    } finally {
      setIsLoading(false)
    }
  }

  const handleVoiceInput = () => {
    if (!recognitionRef.current) {
      alert('Voice input is not supported in your browser')
      return
    }

    if (isListening) {
      recognitionRef.current.stop()
    } else {
      recognitionRef.current.start()
    }
  }

  const copyToClipboard = (text: string, idx: number) => {
    navigator.clipboard.writeText(text)
    setCopiedId(idx)
    setTimeout(() => setCopiedId(null), 2000)
  }

  return (
    <MainLayout
      pageTitle="AI Farming Assistant"
      pageDescription="Ask questions about farming, crops, pests, diseases, and market insights"
    >
      <div className="max-w-4xl h-full flex flex-col gap-6">
        {/* Language Selector */}
        <Card className="p-4 flex items-center gap-4">
          <label className="text-sm font-medium text-foreground">Language:</label>
          <Select value={language} onValueChange={setLanguage}>
            <SelectTrigger className="w-48 bg-background">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="english">English</SelectItem>
              <SelectItem value="hindi">Hindi (हिंदी)</SelectItem>
              <SelectItem value="tamil">Tamil (தமிழ்)</SelectItem>
              <SelectItem value="telugu">Telugu (తెలుగు)</SelectItem>
              <SelectItem value="marathi">Marathi (मराठी)</SelectItem>
            </SelectContent>
          </Select>
        </Card>

        {/* Chat Container */}
        <Card className="flex-1 p-6 flex flex-col overflow-hidden">
          <div className="flex-1 overflow-y-auto mb-6 space-y-4">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs lg:max-w-md px-4 py-3 rounded-lg ${
                    msg.role === 'user'
                      ? 'bg-primary text-primary-foreground rounded-br-none'
                      : 'bg-muted text-foreground rounded-bl-none'
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap text-pretty">{msg.content}</p>
                  {msg.role === 'assistant' && (
                    <button
                      onClick={() => copyToClipboard(msg.content, idx)}
                      className="mt-2 inline-flex items-center gap-1 text-xs opacity-60 hover:opacity-100 transition-opacity"
                    >
                      {copiedId === idx ? (
                        <>
                          <Check className="w-3 h-3" />
                          Copied
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          Copy
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            ))}

            {/* Typing indicator */}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-muted text-foreground px-4 py-3 rounded-lg rounded-bl-none">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-foreground rounded-full animate-bounce" style={{ animationDelay: '0s' }} />
                    <div className="w-2 h-2 bg-foreground rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                    <div className="w-2 h-2 bg-foreground rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <form onSubmit={handleSendMessage} className="flex gap-3">
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Ask about crops, pests, diseases, prices..."
              disabled={isLoading}
              className="flex-1 bg-background"
            />
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={handleVoiceInput}
              className={`${isListening ? 'bg-destructive text-destructive-foreground' : ''}`}
              disabled={isLoading}
              title="Voice input (if supported)"
            >
              <Mic className="w-4 h-4" />
            </Button>
            <Button
              type="submit"
              disabled={isLoading || !inputValue.trim()}
              className="bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              <Send className="w-4 h-4" />
            </Button>
          </form>
        </Card>
      </div>
    </MainLayout>
  )
}
