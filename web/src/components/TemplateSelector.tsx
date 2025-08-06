'use client'

import { Template } from '@/types'
import { CheckCircle, Sparkles, Tag, Star } from 'lucide-react'

interface TemplateSelectorProps {
  onTemplateSelect: (template: Template) => void
  selectedTemplate: Template | null
}

const templates: Template[] = [
  {
    id: 'simple_ad',
    name: 'Classic Minimal',
    description: 'Clean and professional advertisement with headline, subheadline, and call-to-action',
    preview: '/templates/simple-ad-preview.png',
    fields: ['headline', 'subheadline', 'cta']
  },
  {
    id: 'discount_ad',
    name: 'Promotional Pro',
    description: 'High-impact promotional advertisement with discount information and validity period',
    preview: '/templates/discount-ad-preview.png',
    fields: ['headline', 'discount', 'valid_until', 'cta']
  },
  {
    id: 'feature_highlight',
    name: 'Feature Showcase',
    description: 'Product feature showcase with bullet points and compelling benefits',
    preview: '/templates/feature-highlight-preview.png',
    fields: ['headline', 'feature1', 'feature2', 'cta']
  }
]

const getTemplateIcon = (templateId: string) => {
  switch (templateId) {
    case 'simple_ad':
      return <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
    case 'discount_ad':
      return <Tag className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
    case 'feature_highlight':
      return <Star className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
    default:
      return <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
  }
}

export default function TemplateSelector({ onTemplateSelect, selectedTemplate }: TemplateSelectorProps) {
  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="grid grid-cols-1 gap-3 sm:gap-4">
        {templates.map((template) => (
          <div
            key={template.id}
            onClick={() => onTemplateSelect(template)}
            className={`p-4 sm:p-6 border-2 rounded-xl sm:rounded-2xl cursor-pointer transition-all duration-300 hover:shadow-xl hover:scale-[1.02] ${
              selectedTemplate?.id === template.id
                ? 'border-slate-600 bg-gradient-to-r from-slate-50 to-slate-100 shadow-lg'
                : 'border-slate-200 hover:border-slate-400 hover:bg-slate-50/50'
            }`}
          >
            <div className="flex items-start space-x-3 sm:space-x-5">
              <div className={`w-12 h-12 sm:w-16 sm:h-16 rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg ${
                selectedTemplate?.id === template.id
                  ? 'bg-gradient-to-br from-slate-700 to-slate-800'
                  : 'bg-gradient-to-br from-slate-200 to-slate-300'
              }`}>
                <div className={`w-6 h-6 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center ${
                  selectedTemplate?.id === template.id
                    ? 'bg-white/20'
                    : 'bg-slate-600'
                }`}>
                  {getTemplateIcon(template.id)}
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-lg sm:text-xl font-bold text-slate-800 mb-1 sm:mb-2">{template.name}</h3>
                <p className="text-slate-600 mb-2 sm:mb-3 leading-relaxed text-sm sm:text-base">{template.description}</p>
                <div className="flex flex-wrap gap-1 sm:gap-2">
                  {template.fields.map((field) => (
                    <span
                      key={field}
                      className="px-2 sm:px-3 py-1 bg-slate-100 text-slate-700 text-xs font-medium rounded-full border border-slate-200"
                    >
                      {field}
                    </span>
                  ))}
                </div>
              </div>
              {selectedTemplate?.id === template.id && (
                <div className="w-5 h-5 sm:w-6 sm:h-6 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center shadow-lg">
                  <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {selectedTemplate && (
        <div className="p-4 sm:p-5 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl sm:rounded-2xl shadow-lg">
          <div className="flex items-center space-x-2 sm:space-x-3">
            <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center">
              <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </div>
            <div>
              <span className="text-sm font-bold text-green-800">
                Template Selected: {selectedTemplate.name}
              </span>
              <p className="text-xs text-green-600 mt-1">
                Ready to generate your professional advertisement
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
} 