'use client'

import { useState } from 'react'
import { ChevronUp, ChevronDown } from 'lucide-react'

interface Gene {
  id: string
  symbol: string
  name: string | null
  chromosome: string | null
}

interface DiseaseGene {
  id: string
  score: number
  genes: Gene
}

interface DiseaseGenesTableProps {
  diseaseGenes: DiseaseGene[]
}

type SortField = 'symbol' | 'name' | 'score' | 'chromosome'
type SortDirection = 'asc' | 'desc'

export default function DiseaseGenesTable({ diseaseGenes }: DiseaseGenesTableProps) {
  const [sortField, setSortField] = useState<SortField>('score')
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc')

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('asc')
    }
  }

  const sortedGenes = [...diseaseGenes].sort((a, b) => {
    let aValue: any
    let bValue: any

    switch (sortField) {
      case 'symbol':
        aValue = a.genes.symbol
        bValue = b.genes.symbol
        break
      case 'name':
        aValue = a.genes.name || ''
        bValue = b.genes.name || ''
        break
      case 'score':
        aValue = a.score
        bValue = b.score
        break
      case 'chromosome':
        aValue = a.genes.chromosome || ''
        bValue = b.genes.chromosome || ''
        break
    }

    if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1
    if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1
    return 0
  })

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return null
    return sortDirection === 'asc' 
      ? <ChevronUp className="w-4 h-4 inline ml-1" />
      : <ChevronDown className="w-4 h-4 inline ml-1" />
  }

  if (diseaseGenes.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No associated genes found for this disease.
      </div>
    )
  }

  return (
    <div className="overflow-x-auto -mx-4 sm:mx-0">
      <div className="inline-block min-w-full align-middle">
        <div className="overflow-hidden">
          <table className="w-full border-collapse min-w-[600px]">
            <thead>
              <tr className="border-b-2 border-gray-200">
                <th
                  className="text-left py-3 px-3 sm:px-4 font-semibold text-gray-700 cursor-pointer active:bg-gray-50 hover:bg-gray-50 text-xs sm:text-sm touch-manipulation min-h-[44px]"
                  onClick={() => handleSort('symbol')}
                >
                  Gene Symbol
                  <SortIcon field="symbol" />
                </th>
                <th
                  className="text-left py-3 px-3 sm:px-4 font-semibold text-gray-700 cursor-pointer active:bg-gray-50 hover:bg-gray-50 text-xs sm:text-sm touch-manipulation min-h-[44px]"
                  onClick={() => handleSort('name')}
                >
                  Gene Name
                  <SortIcon field="name" />
                </th>
                <th
                  className="text-left py-3 px-3 sm:px-4 font-semibold text-gray-700 cursor-pointer active:bg-gray-50 hover:bg-gray-50 text-xs sm:text-sm touch-manipulation min-h-[44px]"
                  onClick={() => handleSort('chromosome')}
                >
                  Chromosome
                  <SortIcon field="chromosome" />
                </th>
                <th
                  className="text-left py-3 px-3 sm:px-4 font-semibold text-gray-700 cursor-pointer active:bg-gray-50 hover:bg-gray-50 text-xs sm:text-sm touch-manipulation min-h-[44px]"
                  onClick={() => handleSort('score')}
                >
                  Association Score
                  <SortIcon field="score" />
                </th>
              </tr>
            </thead>
            <tbody>
              {sortedGenes.map((dg) => (
                <tr
                  key={dg.id}
                  className="border-b border-gray-100 active:bg-blue-50 hover:bg-blue-50 transition-colors"
                >
                  <td className="py-3 px-3 sm:px-4 font-medium text-gray-900 text-xs sm:text-sm">
                    {dg.genes.symbol}
                  </td>
                  <td className="py-3 px-3 sm:px-4 text-gray-700 text-xs sm:text-sm">
                    {dg.genes.name || 'N/A'}
                  </td>
                  <td className="py-3 px-3 sm:px-4 text-gray-700 text-xs sm:text-sm">
                    {dg.genes.chromosome || 'N/A'}
                  </td>
                  <td className="py-3 px-3 sm:px-4">
                    <span className="inline-block px-2 sm:px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs sm:text-sm font-medium">
                      {dg.score.toFixed(2)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

