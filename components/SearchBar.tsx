'use client'

import { useState, useTransition, useEffect, useRef } from 'react'
import { Search, Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function SearchBar() {
  const [query, setQuery] = useState('')
  const [allDiseases, setAllDiseases] = useState<Array<{ id: string; name: string; category: string | null }>>([])
  const [filteredResults, setFilteredResults] = useState<Array<{ id: string; name: string; category: string | null }>>([])
  const [isPending, startTransition] = useTransition()
  const [isLoadingAll, setIsLoadingAll] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const router = useRouter()
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Load all diseases when component mounts or when search bar is focused
  const loadAllDiseases = async () => {
    if (allDiseases.length > 0) return // Already loaded

    setIsLoadingAll(true)
    const { data, error } = await supabase
      .from('diseases')
      .select('id, name, category')
      .order('name', { ascending: true })

    if (error) {
      console.error('Error loading diseases:', error)
      setIsLoadingAll(false)
    } else {
      setAllDiseases(data || [])
      setFilteredResults(data || [])
      setIsLoadingAll(false)
    }
  }

  // Filter diseases based on query
  useEffect(() => {
    if (query.length === 0) {
      setFilteredResults(allDiseases)
    } else {
      const filtered = allDiseases.filter(disease =>
        disease.name.toLowerCase().includes(query.toLowerCase())
      )
      setFilteredResults(filtered)
    }
  }, [query, allDiseases])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setQuery(value)
  }

  const handleFocus = () => {
    loadAllDiseases()
    setShowResults(true)
  }

  const handleResultClick = (diseaseId: string) => {
    router.push(`/disease/${diseaseId}`)
    setShowResults(false)
    setQuery('')
  }

  // Close dropdown when clicking outside (works for both mouse and touch)
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowResults(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('touchstart', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('touchstart', handleClickOutside)
    }
  }, [])

  return (
    <div className="relative" ref={dropdownRef}>
      <div className="relative">
        <Search className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
        <input
          type="text"
          value={query}
          onChange={handleInputChange}
          onFocus={handleFocus}
          placeholder="Search diseases..."
          className="w-full pl-10 sm:pl-12 pr-10 sm:pr-12 py-3 sm:py-4 text-base sm:text-lg border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none shadow-lg touch-manipulation"
        />
        {(isPending || isLoadingAll) && (
          <Loader2 className="absolute right-3 sm:right-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
        )}
      </div>

      {showResults && (
        <div className="absolute z-50 w-full mt-2 bg-white border border-gray-200 rounded-lg shadow-xl max-h-[60vh] sm:max-h-96 overflow-y-auto overscroll-contain">
          {isLoadingAll ? (
            <div className="p-4 text-center">
              <Loader2 className="w-5 h-5 animate-spin mx-auto text-gray-400" />
              <p className="text-gray-500 mt-2 text-sm">Loading diseases...</p>
            </div>
          ) : filteredResults.length > 0 ? (
            <>
              <div className="px-3 sm:px-4 py-2 bg-gray-50 border-b border-gray-200 sticky top-0">
                <p className="text-xs sm:text-sm text-gray-600 font-medium">
                  {filteredResults.length} {filteredResults.length === 1 ? 'disease' : 'diseases'} found
                  {query && ` matching "${query}"`}
                </p>
              </div>
              {filteredResults.map((disease) => (
                <button
                  key={disease.id}
                  onClick={() => handleResultClick(disease.id)}
                  className="w-full text-left px-3 sm:px-4 py-3 sm:py-3 active:bg-blue-50 hover:bg-blue-50 transition-colors border-b border-gray-100 last:border-b-0 touch-manipulation min-h-[44px]"
                >
                  <div className="font-medium text-gray-900 text-sm sm:text-base">{disease.name}</div>
                  {disease.category && (
                    <div className="text-xs sm:text-sm text-gray-500 mt-1">{disease.category}</div>
                  )}
                </button>
              ))}
            </>
          ) : (
            <div className="p-4 text-center">
              <p className="text-gray-500 text-sm">No diseases found matching "{query}"</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

