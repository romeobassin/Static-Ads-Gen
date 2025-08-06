'use client'

import { useState } from 'react'
import { Upload, Image as ImageIcon, Sparkles, Download, Settings, Zap, Palette } from 'lucide-react'
import ImageUpload from '../components/ImageUpload'
import TemplateSelector from '../components/TemplateSelector'
import AdPreview from '../components/AdPreview'
import { Template } from '../types'

export default function Home() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null)
  const [generatedAd, setGeneratedAd] = useState<string | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)

  const handleGenerateAd = async () => {
    if (!selectedImage || !selectedTemplate) return

    setIsGenerating(true)
    try {
      // TODO: Connect to your backend API
      const response = await fetch('/api/generate-ad', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          image: selectedImage,
          template: selectedTemplate.id,
        }),
      })

      if (response.ok) {
        const data = await response.json()
        setGeneratedAd(data.adUrl)
      }
    } catch (error) {
      console.error('Error generating ad:', error)
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div className="min-h-screen gradient-bg">
      {/* Header */}
      <header className="header-gradient shadow-2xl border-b border-slate-200/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-center py-4 sm:py-8 space-y-4 sm:space-y-0">
            <div className="flex items-center space-x-3 sm:space-x-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-slate-800 to-slate-700 rounded-xl flex items-center justify-center shadow-lg">
                <Zap className="w-5 h-5 sm:w-7 sm:h-7 text-white" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-white">AdForge Pro</h1>
                <p className="text-slate-300 text-xs sm:text-sm">Professional Static Ad Generator</p>
              </div>
            </div>
            <button className="glass-effect px-4 sm:px-6 py-2 sm:py-3 rounded-xl text-white font-medium hover:bg-white/20 transition-all duration-200 flex items-center space-x-2 text-sm sm:text-base">
              <Settings className="w-4 h-4" />
              <span className="hidden sm:inline">Settings</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-10">
          {/* Left Column - Upload & Templates */}
          <div className="space-y-6 sm:space-y-8">
            {/* Image Upload */}
            <div className="card group hover:scale-[1.02]">
              <div className="flex items-center space-x-3 mb-4 sm:mb-6">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-slate-800 to-slate-700 rounded-lg flex items-center justify-center">
                  <Upload className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-lg sm:text-xl font-bold text-gradient">Upload Product Image</h2>
                  <p className="text-slate-600 text-xs sm:text-sm">Select a high-quality image for your ad</p>
                </div>
              </div>
              <ImageUpload onImageSelect={setSelectedImage} selectedImage={selectedImage} />
            </div>

            {/* Template Selection */}
            <div className="card group hover:scale-[1.02]">
              <div className="flex items-center space-x-3 mb-4 sm:mb-6">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-slate-800 to-slate-700 rounded-lg flex items-center justify-center">
                  <Palette className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-lg sm:text-xl font-bold text-gradient">Choose Template</h2>
                  <p className="text-slate-600 text-xs sm:text-sm">Select the perfect layout for your ad</p>
                </div>
              </div>
              <TemplateSelector onTemplateSelect={setSelectedTemplate} selectedTemplate={selectedTemplate} />
            </div>

            {/* Generate Button */}
            <button
              onClick={handleGenerateAd}
              disabled={!selectedImage || !selectedTemplate || isGenerating}
              className="w-full btn-primary flex items-center justify-center space-x-2 sm:space-x-3 py-4 sm:py-5 text-base sm:text-lg font-bold disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {isGenerating ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 sm:h-6 sm:w-6 border-b-2 border-white"></div>
                  <span className="text-sm sm:text-base">Creating Your Ad...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5 sm:w-6 sm:h-6" />
                  <span className="text-sm sm:text-base">Generate Professional Ad</span>
                </>
              )}
            </button>
          </div>

          {/* Right Column - Preview */}
          <div className="card group hover:scale-[1.02]">
            <div className="flex items-center space-x-3 mb-4 sm:mb-6">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-slate-800 to-slate-700 rounded-lg flex items-center justify-center">
                <Download className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </div>
              <div>
                <h2 className="text-lg sm:text-xl font-bold text-gradient">Ad Preview</h2>
                <p className="text-slate-600 text-xs sm:text-sm">See your generated advertisement</p>
              </div>
            </div>
            <AdPreview 
              generatedAd={generatedAd} 
              selectedImage={selectedImage}
              selectedTemplate={selectedTemplate}
            />
          </div>
        </div>
      </main>
    </div>
  )
} 