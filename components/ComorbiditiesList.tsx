'use client'

import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

interface Disease {
  id: string
  name: string
  category: string | null
}

interface Comorbidity {
  id: string
  shared_genes_count: number
  score: number
  jaccard_index: number
  otherDisease: Disease
}

interface ComorbiditiesListProps {
  comorbidities: Comorbidity[]
  currentDiseaseId: string
}

export default function ComorbiditiesList({ comorbidities, currentDiseaseId }: ComorbiditiesListProps) {
  if (comorbidities.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No comorbidities found for this disease.
      </div>
    )
  }

  return (
    <div className="space-y-3 sm:space-y-4">
      {comorbidities.map((comorbidity) => (
        <Link
          key={comorbidity.id}
          href={`/disease/${comorbidity.otherDisease.id}`}
          className="block bg-gray-50 active:bg-blue-50 hover:bg-blue-50 rounded-lg p-4 sm:p-6 transition-all border border-gray-200 active:border-blue-300 hover:border-blue-300 active:shadow-md hover:shadow-md touch-manipulation min-h-[44px]"
        >
          <div className="flex items-center justify-between">
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-2">
                <h3 className="text-base sm:text-lg md:text-xl font-semibold text-gray-900 break-words">
                  {comorbidity.otherDisease.name}
                </h3>
                {comorbidity.otherDisease.category && (
                  <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded text-xs font-medium whitespace-nowrap">
                    {comorbidity.otherDisease.category}
                  </span>
                )}
              </div>
              <div className="flex flex-wrap gap-3 sm:gap-6 text-xs sm:text-sm text-gray-600">
                <div>
                  <span className="font-medium">Shared Genes:</span>{' '}
                  <span className="text-blue-600 font-semibold">
                    {comorbidity.shared_genes_count}
                  </span>
                </div>
                <div>
                  <span className="font-medium">Similarity:</span>{' '}
                  <span className="text-purple-600 font-semibold">
                    {comorbidity.score.toFixed(2)}
                  </span>
                </div>
                <div>
                  <span className="font-medium">Jaccard:</span>{' '}
                  <span className="text-green-600 font-semibold">
                    {comorbidity.jaccard_index.toFixed(3)}
                  </span>
                </div>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 flex-shrink-0 ml-2 sm:ml-4" />
          </div>
        </Link>
      ))}
    </div>
  )
}

