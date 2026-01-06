import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase environment variables are not set. Please add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to your .env.local file')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types
export interface Disease {
  id: string
  name: string
  disgenet_id: string | null
  description: string | null
  category: string | null
  created_at: string
}

export interface Gene {
  id: string
  symbol: string
  name: string | null
  chromosome: string | null
  created_at: string
}

export interface DiseaseGene {
  id: string
  disease_id: string
  gene_id: string
  score: number
  created_at: string
}

export interface DiseaseComorbidity {
  id: string
  disease_a_id: string
  disease_b_id: string
  shared_genes_count: number
  score: number
  jaccard_index: number
  created_at: string
}

