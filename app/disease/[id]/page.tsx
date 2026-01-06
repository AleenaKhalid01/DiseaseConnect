import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import DiseaseGenesTable from '@/components/DiseaseGenesTable'
import ComorbiditiesList from '@/components/ComorbiditiesList'

interface PageProps {
  params: {
    id: string
  }
}

export default async function DiseasePage({ params }: PageProps) {
  const { id } = params

  // Fetch disease details
  const { data: disease, error: diseaseError } = await supabase
    .from('diseases')
    .select('*')
    .eq('id', id)
    .single()

  if (diseaseError || !disease) {
    notFound()
  }

  // Fetch associated genes
  const { data: diseaseGenes } = await supabase
    .from('disease_genes')
    .select(`
      id,
      score,
      genes: gene_id (
        id,
        symbol,
        name,
        chromosome
      )
    `)
    .eq('disease_id', id)
    .order('score', { ascending: false })

  // Fetch comorbidities
  const { data: comorbidities } = await supabase
    .from('disease_comorbidities')
    .select(`
      id,
      disease_a_id,
      disease_b_id,
      shared_genes_count,
      score,
      jaccard_index,
      diseases_a:disease_a_id (id, name, category),
      diseases_b:disease_b_id (id, name, category)
    `)
    .or(`disease_a_id.eq.${id},disease_b_id.eq.${id}`)
    .order('score', { ascending: false })
    .limit(20)

  // Transform comorbidities to show the other disease
  const transformedComorbidities = comorbidities?.map((comorbidity: any) => {
    const otherDisease = comorbidity.disease_a_id === id 
      ? comorbidity.diseases_b 
      : comorbidity.diseases_a
    return {
      ...comorbidity,
      otherDisease,
      jaccard_index: comorbidity.jaccard_index
    }
  }) || []

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-8">
        {/* Back Button */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-blue-600 active:text-blue-800 mb-4 sm:mb-6 transition-colors touch-manipulation min-h-[44px]"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm sm:text-base">Back to Home</span>
        </Link>

        {/* Disease Header */}
        <div className="bg-white rounded-lg shadow-xl p-4 sm:p-6 md:p-8 mb-6 sm:mb-8">
          <div className="mb-3 sm:mb-4">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-2">
              {disease.name}
            </h1>
            {disease.category && (
              <span className="inline-block px-2 sm:px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs sm:text-sm font-medium">
                {disease.category}
              </span>
            )}
          </div>

          {disease.description && (
            <p className="text-gray-700 text-sm sm:text-base md:text-lg leading-relaxed">
              {disease.description}
            </p>
          )}
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
            <div className="text-2xl sm:text-3xl font-bold text-blue-600 mb-2">
              {diseaseGenes?.length || 0}
            </div>
            <div className="text-gray-600 text-sm sm:text-base">Associated Genes</div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
            <div className="text-2xl sm:text-3xl font-bold text-purple-600 mb-2">
              {transformedComorbidities.length}
            </div>
            <div className="text-gray-600 text-sm sm:text-base">Comorbidities</div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
            <div className="text-2xl sm:text-3xl font-bold text-green-600 mb-2">
              {diseaseGenes?.reduce((sum, dg) => sum + (dg.score || 0), 0).toFixed(1) || '0.0'}
            </div>
            <div className="text-gray-600 text-sm sm:text-base">Total Association Score</div>
          </div>
        </div>

        {/* Associated Genes Table */}
        <div className="bg-white rounded-lg shadow-xl p-4 sm:p-6 md:p-8 mb-6 sm:mb-8">
          <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-4 sm:mb-6">
            Associated Genes
          </h2>
          <DiseaseGenesTable diseaseGenes={diseaseGenes || []} />
        </div>

        {/* Comorbidities */}
        <div className="bg-white rounded-lg shadow-xl p-4 sm:p-6 md:p-8">
          <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-4 sm:mb-6">
            Top Comorbidities
          </h2>
          <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6">
            Diseases that share genetic associations with {disease.name}, ranked by similarity score.
          </p>
          <ComorbiditiesList comorbidities={transformedComorbidities} currentDiseaseId={id} />
        </div>
      </div>
    </main>
  )
}

