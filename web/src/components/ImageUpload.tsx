'use client'

import { useState, useCallback } from 'react'
import { Upload, X, Image as ImageIcon, CheckCircle } from 'lucide-react'
import { useDropzone } from 'react-dropzone'

interface ImageUploadProps {
  onImageSelect: (imageUrl: string) => void
  selectedImage: string | null
}

export default function ImageUpload({ onImageSelect, selectedImage }: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false)

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return

    const file = acceptedFiles[0]
    setIsUploading(true)

    try {
      // Convert file to base64 for preview
      const reader = new FileReader()
      reader.onload = (e) => {
        const result = e.target?.result as string
        onImageSelect(result)
        setIsUploading(false)
      }
      reader.readAsDataURL(file)
    } catch (error) {
      console.error('Error uploading image:', error)
      setIsUploading(false)
    }
  }, [onImageSelect])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp']
    },
    multiple: false
  })

  const removeImage = () => {
    onImageSelect('')
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {selectedImage ? (
        <div className="relative group">
          <div className="relative overflow-hidden rounded-xl sm:rounded-2xl shadow-xl sm:shadow-2xl">
            <img
              src={selectedImage}
              alt="Selected product"
              className="w-full h-64 sm:h-80 object-cover transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>
          <button
            onClick={removeImage}
            className="absolute top-2 right-2 sm:top-4 sm:right-4 bg-red-500 hover:bg-red-600 text-white rounded-full p-1.5 sm:p-2 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-110"
          >
            <X className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>
      ) : (
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-xl sm:rounded-2xl p-6 sm:p-12 text-center cursor-pointer transition-all duration-300 ${
            isDragActive
              ? 'border-slate-600 bg-slate-50 shadow-lg'
              : 'border-slate-300 hover:border-slate-500 hover:bg-slate-50/50 hover:shadow-lg'
          }`}
        >
          <input {...getInputProps()} />
          <div className="space-y-4 sm:space-y-6">
            <div className="mx-auto w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-slate-100 to-slate-200 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg">
              {isUploading ? (
                <div className="animate-spin rounded-full h-8 w-8 sm:h-10 sm:w-10 border-b-2 border-slate-600"></div>
              ) : (
                <Upload className="w-8 h-8 sm:w-10 sm:h-10 text-slate-600" />
              )}
            </div>
            <div>
              <p className="text-lg sm:text-xl font-bold text-slate-800">
                {isUploading ? 'Processing Image...' : 'Upload Product Image'}
              </p>
              <p className="text-slate-600 mt-2 text-sm sm:text-base">
                {isDragActive
                  ? 'Drop your image here'
                  : 'Drag & drop an image, or tap to browse'}
              </p>
              <p className="text-xs text-slate-500 mt-2">
                Supports: JPG, PNG, GIF, WebP (Max 10MB)
              </p>
            </div>
          </div>
        </div>
      )}

      {selectedImage && (
        <div className="flex items-center space-x-3 text-sm text-slate-600 bg-green-50 border border-green-200 rounded-xl px-3 sm:px-4 py-2 sm:py-3">
          <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
          <span className="font-medium text-xs sm:text-sm">Image uploaded successfully</span>
        </div>
      )}
    </div>
  )
} 