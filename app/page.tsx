import { Suspense } from 'react'
import SearchBar from '@/components/SearchBar'
import NetworkGraph from '@/components/NetworkGraph'
import { supabase } from '@/lib/supabase'

export default async function Home() {
  // Fetch initial network data (top diseases with most connections)
  const { data: comorbidities } = await supabase
    .from('disease_comorbidities')
    .select(`
      id,
      disease_a_id,
      disease_b_id,
      score,
      jaccard_index,
      diseases_a:disease_a_id (id, name, category),
      diseases_b:disease_b_id (id, name, category)
    `)
    .order('score', { ascending: false })
    .limit(100)

  // Get unique diseases
  const diseaseIds = new Set<string>()
  const nodes: Array<{ id: string; name: string; category: string | null }> = []
  const links: Array<{ source: string; target: string; score: number }> = []

  if (comorbidities) {
    comorbidities.forEach((comorbidity: any) => {
      const diseaseA = comorbidity.diseases_a
      const diseaseB = comorbidity.diseases_b

      if (diseaseA && !diseaseIds.has(diseaseA.id)) {
        nodes.push({
          id: diseaseA.id,
          name: diseaseA.name,
          category: diseaseA.category
        })
        diseaseIds.add(diseaseA.id)
      }

      if (diseaseB && !diseaseIds.has(diseaseB.id)) {
        nodes.push({
          id: diseaseB.id,
          name: diseaseB.name,
          category: diseaseB.category
        })
        diseaseIds.add(diseaseB.id)
      }

      if (diseaseA && diseaseB) {
        links.push({
          source: diseaseA.id,
          target: diseaseB.id,
          score: comorbidity.score
        })
      }
    })
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-8">
        {/* Header */}
        <div className="text-center mb-6 sm:mb-12">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-2 sm:mb-4">
            Disease Connect
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-gray-600 mb-4 sm:mb-8 px-2">
            Interactive Network Analysis of Disease-Gene Associations & Comorbidities
          </p>
        </div>

        {/* Search Bar */}
        <div className="max-w-3xl mx-auto mb-6 sm:mb-12">
          <Suspense fallback={<div className="h-14 sm:h-16 bg-gray-200 animate-pulse rounded-lg" />}>
            <SearchBar />
          </Suspense>
        </div>

        {/* Network Graph */}
        <div className="bg-white rounded-lg shadow-xl p-3 sm:p-6 mb-6 sm:mb-8">
          <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-2 sm:mb-4">
            Disease Comorbidity Network
          </h2>
          <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6">
            Explore the interconnected relationships between diseases based on shared genetic associations.
            Nodes represent diseases, and edges indicate comorbidity relationships.
          </p>
          <Suspense fallback={
            <div className="w-full h-[400px] sm:h-[500px] md:h-[600px] bg-gray-100 rounded-lg flex items-center justify-center">
              <p className="text-gray-500 text-sm sm:text-base">Loading network visualization...</p>
            </div>
          }>
            <NetworkGraph nodes={nodes} links={links} />
          </Suspense>
        </div>

        {/* Info Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 mt-6 sm:mt-8">
          <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
            <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-2">Graph Theory</h3>
            <p className="text-gray-600 text-xs sm:text-sm">
              Network analysis using graph algorithms to identify disease clusters and pathways.
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
            <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-2">Bioinformatics</h3>
            <p className="text-gray-600 text-xs sm:text-sm">
              Integration of disease-gene associations from DisGeNET and OMIM databases.
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 sm:col-span-2 md:col-span-1">
            <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-2">Jaccard Index</h3>
            <p className="text-gray-600 text-xs sm:text-sm">
              Similarity scoring using Jaccard Index to quantify disease relationships.
            </p>
          </div>
        </div>
      </div>
    </main>
  )
}

