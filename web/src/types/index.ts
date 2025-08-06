export interface Template {
  id: string
  name: string
  description: string
  preview: string
  fields: string[]
}

export interface GeneratedAd {
  id: string
  url: string
  template: string
  createdAt: string
}

export interface UploadResponse {
  success: boolean
  url?: string
  error?: string
}

export interface GenerateAdRequest {
  image: string
  template: string
}

export interface GenerateAdResponse {
  success: boolean
  adUrl?: string
  error?: string
} 