import { NextRequest, NextResponse } from 'next/server'
import { GenerateAdRequest, GenerateAdResponse } from '@/types'

export async function POST(request: NextRequest) {
  try {
    const body: GenerateAdRequest = await request.json()
    const { image, template } = body

    if (!image || !template) {
      return NextResponse.json(
        { success: false, error: 'Image and template are required' },
        { status: 400 }
      )
    }

    // Call your Python backend
    const backendUrl = process.env.BACKEND_URL || 'http://localhost:5000'
    
    const response = await fetch(`${backendUrl}/generate_ad`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        image: image,
        template: template,
      }),
    })

    if (!response.ok) {
      throw new Error(`Backend responded with status: ${response.status}`)
    }

    const data = await response.json()
    
    return NextResponse.json({
      success: true,
      adUrl: data.ad_url || data.secure_url,
    } as GenerateAdResponse)

  } catch (error) {
    console.error('Error generating ad:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to generate advertisement. Please try again.' 
      } as GenerateAdResponse,
      { status: 500 }
    )
  }
} 