import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Calculate Jaccard Similarity Index between two sets of gene IDs
 * Jaccard Index = |A ∩ B| / |A ∪ B|
 * Returns a value between 0 (no overlap) and 1 (identical sets)
 */
export function calculateJaccardIndex(
  genesA: string[],
  genesB: string[]
): number {
  if (genesA.length === 0 && genesB.length === 0) return 1
  if (genesA.length === 0 || genesB.length === 0) return 0

  const setA = new Set(genesA)
  const setB = new Set(genesB)

  // Calculate intersection
  const intersection = new Set([...setA].filter(x => setB.has(x)))

  // Calculate union
  const union = new Set([...setA, ...setB])

  return intersection.size / union.size
}

/**
 * Calculate similarity score based on shared genes
 */
export function calculateSimilarityScore(
  sharedGenes: number,
  totalGenesA: number,
  totalGenesB: number
): number {
  if (totalGenesA === 0 || totalGenesB === 0) return 0
  return (sharedGenes / Math.max(totalGenesA, totalGenesB)) * 100
}

