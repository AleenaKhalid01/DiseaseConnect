import 'dotenv/config'
import { createClient } from '@supabase/supabase-js'
import * as fs from 'fs'
import * as path from 'path'

/* ===============================
   ENV & CLIENT SETUP
================================ */

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase credentials')
  console.error(
    'Please set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local'
  )
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

/* ===============================
   TYPES
================================ */

interface MockDisease {
  name: string
  disgenet_id: string
  description: string
  category: string
}

interface MockGene {
  symbol: string
  name: string
  chromosome: string
}

interface SeedData {
  diseases: MockDisease[]
  genes: MockGene[]
  diseaseGenes: Array<{
    diseaseName: string
    geneSymbol: string
    score: number
  }>
}

/* ===============================
   HELPERS
================================ */

function dedupeByKey<T, K extends keyof T>(rows: T[], key: K): T[] {
  const map = new Map<T[K], T>()
  for (const row of rows) {
    map.set(row[key], row) // last wins
  }
  return Array.from(map.values())
}

/* ===============================
   SEED FUNCTION
================================ */

async function seedDatabase() {
  console.log('🌱 Starting database seeding...')

  /* ---------- Load data ---------- */
  const dataPath = path.join(process.cwd(), 'scripts', 'mock-data.json')
  const rawData = fs.readFileSync(dataPath, 'utf-8')
  const seedData: SeedData = JSON.parse(rawData)

  /* ---------- Deduplicate ---------- */
  const uniqueDiseases = dedupeByKey(seedData.diseases, 'disgenet_id')
  const uniqueGenes = dedupeByKey(seedData.genes, 'symbol')

  console.log(
    `📝 Upserting ${uniqueDiseases.length} diseases (deduplicated from ${seedData.diseases.length})...`
  )

  /* ---------- Upsert diseases ---------- */
  const { data: diseases, error: diseasesError } = await supabase
    .from('diseases')
    .upsert(uniqueDiseases, {
      onConflict: 'disgenet_id'
    })
    .select()

  if (diseasesError) {
    console.error('❌ Error upserting diseases:', diseasesError)
    return
  }

  console.log(`✅ Diseases processed: ${diseases?.length || 0}`)

  /* ---------- Upsert genes ---------- */
  console.log(
    `🧬 Upserting ${uniqueGenes.length} genes (deduplicated from ${seedData.genes.length})...`
  )

  const { data: genes, error: genesError } = await supabase
    .from('genes')
    .upsert(uniqueGenes, {
      onConflict: 'symbol'
    })
    .select()

  if (genesError) {
    console.error('❌ Error upserting genes:', genesError)
    return
  }

  console.log(`✅ Genes processed: ${genes?.length || 0}`)

  /* ---------- Build lookup maps ---------- */
  const diseaseMap = new Map(diseases?.map(d => [d.name, d.id]) || [])
  const geneMap = new Map(genes?.map(g => [g.symbol, g.id]) || [])

  /* ---------- Disease–gene associations ---------- */
  console.log(
    `🔗 Upserting ${seedData.diseaseGenes.length} disease–gene associations...`
  )

  const diseaseGeneRows = seedData.diseaseGenes
    .filter(
      dg => diseaseMap.has(dg.diseaseName) && geneMap.has(dg.geneSymbol)
    )
    .map(dg => ({
      disease_id: diseaseMap.get(dg.diseaseName)!,
      gene_id: geneMap.get(dg.geneSymbol)!,
      score: dg.score
    }))

  const { error: dgError } = await supabase
    .from('disease_genes')
    .upsert(diseaseGeneRows, {
      onConflict: 'disease_id,gene_id'
    })

  if (dgError) {
    console.error('❌ Error upserting disease–gene links:', dgError)
    return
  }

  console.log(`✅ Disease–gene links processed: ${diseaseGeneRows.length}`)

  /* ---------- Comorbidity calculation ---------- */
  console.log('🔍 Calculating comorbidities...')

  const diseaseGeneMap = new Map<string, Set<string>>()

  for (const row of diseaseGeneRows) {
    if (!diseaseGeneMap.has(row.disease_id)) {
      diseaseGeneMap.set(row.disease_id, new Set())
    }
    diseaseGeneMap.get(row.disease_id)!.add(row.gene_id)
  }

  const diseaseIds = Array.from(diseaseGeneMap.keys())
  const comorbidities: any[] = []

  for (let i = 0; i < diseaseIds.length; i++) {
    for (let j = i + 1; j < diseaseIds.length; j++) {
      const a = diseaseIds[i]
      const b = diseaseIds[j]

      const genesA = diseaseGeneMap.get(a)!
      const genesB = diseaseGeneMap.get(b)!

      const intersection = [...genesA].filter(g => genesB.has(g))
      if (intersection.length === 0) continue

      const union = new Set([...genesA, ...genesB])

      comorbidities.push({
        disease_a_id: a,
        disease_b_id: b,
        shared_genes_count: intersection.length,
        jaccard_index: intersection.length / union.size,
        score:
          (intersection.length /
            Math.max(genesA.size, genesB.size)) *
          100
      })
    }
  }

  console.log(`📊 Found ${comorbidities.length} comorbidity relationships`)

  /* ---------- Insert comorbidities ---------- */
  const batchSize = 100
  for (let i = 0; i < comorbidities.length; i += batchSize) {
    const batch = comorbidities.slice(i, i + batchSize)
    const { error } = await supabase
      .from('disease_comorbidities')
      .upsert(batch, {
        onConflict: 'disease_a_id,disease_b_id'
      })

    if (error) {
      console.error('❌ Error inserting comorbidities:', error)
      return
    }
  }

  console.log(`✅ Comorbidities processed: ${comorbidities.length}`)
  console.log('🎉 Database seeding completed successfully!')
}

/* ===============================
   RUN
================================ */

seedDatabase().catch(err => {
  console.error('🔥 Fatal error during seeding:', err)
})
