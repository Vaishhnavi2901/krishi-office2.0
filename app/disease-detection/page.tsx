'use client'

import { useState, useRef } from 'react'
import { MainLayout } from '@/components/layout/MainLayout'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Spinner } from '@/components/ui/spinner'
import { Upload, X, AlertCircle, CheckCircle2, Info } from 'lucide-react'

interface DiseaseResult {
  name: string
  crop: string
  severity: string
  confidence: number
  symptoms: string[]
  treatment: string[]
  prevention: string[]
  recommended_action: string
}

export default function DiseaseDetection() {
  const [image, setImage] = useState<string | null>(null)
  const [cropName, setCropName] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<DiseaseResult | null>(null)
  const [hasSubmitted, setHasSubmitted] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setImage(reader.result as string)
        setResult(null)
        setHasSubmitted(false)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    const file = e.dataTransfer.files?.[0]
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setImage(reader.result as string)
        setResult(null)
        setHasSubmitted(false)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleDetect = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!image) {
      alert('Please upload an image first')
      return
    }

    setIsLoading(true)
    setHasSubmitted(true)

    try {
      // Phase 6: Replace with actual API call
      // const res = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/detect-disease`, {
      //   image: image.split(',')[1], // Remove data:image/jpeg;base64, prefix
      //   crop_name: cropName || undefined,
      // })
      // setResult(res.data)

      // Mock result
      const mockResults: DiseaseResult[] = [
        {
          name: 'Powdery Mildew',
          crop: 'Rice / Wheat',
          severity: 'MODERATE',
          confidence: 87,
          symptoms: [
            'White powder-like coating on leaves',
            'Curled or distorted leaves',
            'Premature leaf drop',
            'Reduced photosynthesis',
          ],
          treatment: [
            'Spray sulfur-based fungicides (2-3 applications)',
            'Apply potassium bicarbonate solution',
            'Use neem oil spray every 7-10 days',
            'Remove and destroy infected plant parts',
            'Improve air circulation in the field',
          ],
          prevention: [
            'Ensure good air circulation between plants',
            'Avoid overhead watering',
            'Plant resistant varieties',
            'Maintain proper spacing (50-60cm)',
            'Monitor crops regularly (early detection)',
            'Use sulfur dust preventatively',
          ],
          recommended_action:
            'Start treatment immediately. Apply fungicides in the evening when temperatures are cooler.',
        },
        {
          name: 'Leaf Blight',
          crop: 'Corn / Potato',
          severity: 'HIGH',
          confidence: 76,
          symptoms: [
            'Brown/black lesions with yellow halo',
            'Rapid leaf death and tissue breakdown',
            'Plant wilting despite adequate moisture',
            'Stem discoloration extending upward',
          ],
          treatment: [
            'Apply copper-based fungicides immediately',
            'Use mancozeb spray every 10-14 days',
            'Remove infected leaves and stems',
            'Improve field drainage to reduce humidity',
            'Apply systemic fungicides',
          ],
          prevention: [
            'Use certified disease-free seeds',
            'Practice crop rotation (3-year minimum)',
            'Maintain field sanitation',
            'Plant disease-resistant varieties',
            'Avoid field work when foliage is wet',
            'Space plants adequately for air circulation',
          ],
          recommended_action:
            'This is a serious disease. Start treatment today and monitor spread. Consider replanting if >30% of field is affected.',
        },
        {
          name: 'Pest Damage (Borer)',
          crop: 'Corn / Cotton',
          severity: 'MEDIUM',
          confidence: 81,
          symptoms: [
            'Round holes in leaves and stems',
            'Wilting of affected plant parts',
            'Frass (insect droppings) visible',
            'Dead heart in seedlings',
            'Tunneling inside stems',
          ],
          treatment: [
            'Apply biological pesticides (Bt spray)',
            'Deploy pheromone traps',
            'Manual removal of affected parts',
            'Chemical insecticide spray if severe',
            'Remove crop residues',
          ],
          prevention: [
            'Plant resistant/tolerant varieties',
            'Monitor crops regularly',
            'Proper field sanitation',
            'Timely planting',
            'Intercropping with marigold',
            'Use pheromone traps proactively',
          ],
          recommended_action:
            'Install pheromone traps immediately. Start Bt spray if <20% damage. Use chemicals only if damage exceeds 30%.',
        },
      ]

      // Random selection for mock data
      const mockResult = mockResults[Math.floor(Math.random() * mockResults.length)]
      setResult(mockResult)
    } catch (error) {
      console.error('Error detecting disease:', error)
      alert('Failed to detect disease. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'MILD':
        return 'bg-green-100 text-green-700 border-green-300'
      case 'MODERATE':
        return 'bg-yellow-100 text-yellow-700 border-yellow-300'
      case 'HIGH':
        return 'bg-red-100 text-red-700 border-red-300'
      default:
        return 'bg-gray-100 text-gray-700 border-gray-300'
    }
  }

  return (
    <MainLayout
      pageTitle="Disease Detection"
      pageDescription="Upload a crop image to detect diseases and get treatment recommendations"
    >
      <div className="max-w-4xl">
        {/* Upload Section */}
        <Card className="p-8 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Upload Area */}
            <div>
              <Label className="text-sm font-medium mb-4 block">Crop Image</Label>
              <div
                onClick={() => fileInputRef.current?.click()}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                className="border-2 border-dashed border-primary rounded-lg p-8 text-center cursor-pointer hover:bg-primary/5 transition-colors"
              >
                {image ? (
                  <div className="relative">
                    <img
                      src={image}
                      alt="Uploaded crop"
                      className="max-h-64 mx-auto rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation()
                        setImage(null)
                        setResult(null)
                      }}
                      className="absolute top-2 right-2 bg-destructive text-destructive-foreground rounded-full p-1 hover:bg-destructive/90"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div>
                    <Upload className="w-12 h-12 text-primary mx-auto mb-3 opacity-50" />
                    <p className="text-foreground font-semibold mb-1">
                      Drag and drop your image here
                    </p>
                    <p className="text-sm text-muted-foreground">
                      or click to browse (JPG, PNG, WebP)
                    </p>
                  </div>
                )}
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </div>

            {/* Form Section */}
            <form onSubmit={handleDetect} className="flex flex-col justify-between">
              <div>
                <Label htmlFor="crop" className="text-sm font-medium mb-2 block">
                  Crop Name (Optional)
                </Label>
                <Input
                  id="crop"
                  placeholder="e.g., Rice, Wheat, Cotton"
                  value={cropName}
                  onChange={(e) => setCropName(e.target.value)}
                  className="bg-background mb-6"
                />

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                  <div className="flex gap-2">
                    <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-semibold text-blue-900 mb-1">
                        Tips for best results:
                      </p>
                      <ul className="text-xs text-blue-700 space-y-1">
                        <li>• Upload clear, close-up images of affected leaves</li>
                        <li>• Include both healthy and affected parts</li>
                        <li>• Take photos in good lighting</li>
                        <li>• Avoid shadows and reflections</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              <Button
                type="submit"
                disabled={isLoading || !image}
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                {isLoading ? (
                  <>
                    <Spinner className="mr-2" />
                    Analyzing...
                  </>
                ) : (
                  'Detect Disease'
                )}
              </Button>
            </form>
          </div>
        </Card>

        {/* Results Section */}
        {hasSubmitted && result && !isLoading && (
          <div className="space-y-6">
            {/* Disease Overview */}
            <Card className={`p-6 border-2 ${
              result.severity === 'HIGH'
                ? 'border-red-300 bg-red-50'
                : result.severity === 'MODERATE'
                ? 'border-yellow-300 bg-yellow-50'
                : 'border-green-300 bg-green-50'
            }`}>
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="text-2xl font-bold text-foreground mb-2">{result.name}</h2>
                  <p className="text-muted-foreground">
                    Detected in: <span className="font-semibold text-foreground">{result.crop}</span>
                  </p>
                </div>
                {result.severity === 'HIGH' ? (
                  <AlertCircle className="w-8 h-8 text-red-600" />
                ) : (
                  <CheckCircle2 className="w-8 h-8 text-blue-600" />
                )}
              </div>

              <div className="flex items-center gap-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Detection Confidence</p>
                  <div className="w-40 h-2 bg-border rounded-full">
                    <div
                      className="h-full bg-primary rounded-full"
                      style={{ width: `${result.confidence}%` }}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">{result.confidence}% confident</p>
                </div>
                <span
                  className={`inline-block px-4 py-2 rounded-full text-sm font-semibold border ${getSeverityColor(result.severity)}`}
                >
                  {result.severity}
                </span>
              </div>
            </Card>

            {/* Symptoms */}
            <Card className="p-6">
              <h3 className="text-lg font-bold text-foreground mb-4">Symptoms Observed</h3>
              <ul className="space-y-2">
                {result.symptoms.map((symptom, idx) => (
                  <li key={idx} className="flex gap-3 text-foreground">
                    <span className="text-primary font-bold">•</span>
                    <span>{symptom}</span>
                  </li>
                ))}
              </ul>
            </Card>

            {/* Treatment */}
            <Card className="p-6 border-2 border-accent bg-accent/5">
              <h3 className="text-lg font-bold text-foreground mb-4">Recommended Treatment</h3>
              <div className="bg-card rounded-lg p-4 mb-4 border border-border">
                <p className="text-sm text-foreground font-semibold">{result.recommended_action}</p>
              </div>
              <ul className="space-y-3">
                {result.treatment.map((treatment, idx) => (
                  <li key={idx} className="flex gap-3 text-foreground">
                    <span className="inline-block w-6 h-6 bg-primary text-primary-foreground rounded-full text-xs flex items-center justify-center flex-shrink-0 font-bold">
                      {idx + 1}
                    </span>
                    <span>{treatment}</span>
                  </li>
                ))}
              </ul>
            </Card>

            {/* Prevention */}
            <Card className="p-6 border-2 border-green-300 bg-green-50">
              <h3 className="text-lg font-bold text-foreground mb-4">Prevention Methods</h3>
              <ul className="space-y-2">
                {result.prevention.map((prevention, idx) => (
                  <li key={idx} className="flex gap-3 text-foreground">
                    <span className="text-green-600 font-bold">✓</span>
                    <span>{prevention}</span>
                  </li>
                ))}
              </ul>
            </Card>
          </div>
        )}

        {hasSubmitted && !result && !isLoading && (
          <Card className="p-8 text-center">
            <p className="text-muted-foreground mb-4">Could not detect a disease in this image.</p>
            <p className="text-sm text-muted-foreground mb-4">
              The plant may be healthy, or the image may not be clear enough. Try uploading another image.
            </p>
            <Button
              onClick={() => {
                setImage(null)
                setResult(null)
                setHasSubmitted(false)
                setCropName('')
              }}
              className="bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              Try Another Image
            </Button>
          </Card>
        )}
      </div>
    </MainLayout>
  )
}
