'use client'

import { Download, Share2, RefreshCw, Eye, CheckCircle, Sparkles } from 'lucide-react'
import { Template } from '../types'

interface AdPreviewProps {
  generatedAd: string | null
  selectedImage: string | null
  selectedTemplate: Template | null
}

export default function AdPreview({ generatedAd, selectedImage, selectedTemplate }: AdPreviewProps) {
  const handleDownload = () => {
    if (!generatedAd) return
    
    const link = document.createElement('a')
    link.href = generatedAd
    link.download = 'generated-ad.jpg'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handleShare = () => {
    if (!generatedAd) return
    
    if (navigator.share) {
      navigator.share({
        title: 'Generated Advertisement',
        url: generatedAd,
      })
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(generatedAd)
      alert('Ad URL copied to clipboard!')
    }
  }

  if (!selectedImage && !generatedAd) {
    return (
      <div className="flex flex-col items-center justify-center h-64 sm:h-80 text-center">
        <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-slate-100 to-slate-200 rounded-xl sm:rounded-2xl flex items-center justify-center mb-4 sm:mb-6 shadow-lg">
          <Eye className="w-8 h-8 sm:w-10 sm:h-10 text-slate-400" />
        </div>
        <h3 className="text-lg sm:text-xl font-bold text-slate-800 mb-2 sm:mb-3">No Preview Available</h3>
        <p className="text-slate-600 max-w-sm text-sm sm:text-base">
          Upload an image and select a template to generate your professional advertisement
        </p>
      </div>
    )
  }

  if (!generatedAd) {
    return (
      <div className="space-y-4 sm:space-y-6">
        <div className="relative group">
          <div className="relative overflow-hidden rounded-xl sm:rounded-2xl shadow-xl sm:shadow-2xl">
            <img
              src={selectedImage!}
              alt="Product preview"
              className="w-full h-64 sm:h-80 object-cover transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent rounded-xl sm:rounded-2xl flex items-center justify-center">
              <div className="text-center text-white">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-white/20 backdrop-blur-sm rounded-xl sm:rounded-2xl flex items-center justify-center mb-3 sm:mb-4">
                  <RefreshCw className="w-6 h-6 sm:w-8 sm:h-8 animate-spin" />
                </div>
                <p className="text-base sm:text-lg font-semibold mb-1 sm:mb-2">Ready to Generate</p>
                <p className="text-xs sm:text-sm opacity-90">Tap the generate button to create your ad</p>
              </div>
            </div>
          </div>
        </div>
        <div className="text-center p-3 sm:p-4 bg-gradient-to-r from-slate-50 to-slate-100 rounded-xl border border-slate-200">
          <p className="text-xs sm:text-sm font-medium text-slate-700">
            Template: <span className="font-bold">{selectedTemplate?.name || 'None selected'}</span>
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="relative group">
        <div className="relative overflow-hidden rounded-xl sm:rounded-2xl shadow-xl sm:shadow-2xl">
          <img
            src={generatedAd}
            alt="Generated advertisement"
            className="w-full h-64 sm:h-80 object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute top-2 right-2 sm:top-4 sm:right-4 flex space-x-2 sm:space-x-3">
            <button
              onClick={handleDownload}
              className="bg-white/90 backdrop-blur-sm hover:bg-white text-slate-700 p-2 sm:p-3 rounded-lg sm:rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-110"
              title="Download"
            >
              <Download className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
            <button
              onClick={handleShare}
              className="bg-white/90 backdrop-blur-sm hover:bg-white text-slate-700 p-2 sm:p-3 rounded-lg sm:rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-110"
              title="Share"
            >
              <Share2 className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>
        </div>
      </div>
      
      <div className="space-y-3 sm:space-y-4">
        <div className="flex items-center justify-between p-3 sm:p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200">
          <div className="flex items-center space-x-2 sm:space-x-3">
            <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center">
              <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </div>
            <div>
              <span className="text-xs sm:text-sm font-bold text-green-800">Generated Successfully</span>
              <p className="text-xs text-green-600">Your professional ad is ready</p>
            </div>
          </div>
          <span className="text-xs text-green-600 font-medium">Just now</span>
        </div>
        
        <div className="flex items-center justify-center space-x-2 p-2 sm:p-3 bg-gradient-to-r from-slate-50 to-slate-100 rounded-xl border border-slate-200">
          <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 text-slate-600" />
          <span className="text-xs sm:text-sm font-medium text-slate-700">Professional Quality</span>
        </div>
      </div>
    </div>
  )
} 