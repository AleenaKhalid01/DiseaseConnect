'use client'

import { useEffect, useRef, useState } from 'react'
import ForceGraph2D from 'react-force-graph-2d'
import type { NodeObject, LinkObject } from 'react-force-graph-2d'

interface Node extends NodeObject {
  id: string
  name: string
  category: string | null
  val?: number
}

interface Link extends LinkObject {
  source: string | Node
  target: string | Node
  score: number
}

interface NetworkGraphProps {
  nodes: Array<{ id: string; name: string; category: string | null }>
  links: Array<{ source: string; target: string; score: number }>
}

// Color mapping for disease categories
const categoryColors: Record<string, string> = {
  'Metabolic': '#3B82F6',      // Blue
  'Cardiovascular': '#EF4444',  // Red
  'Neurological': '#8B5CF6',    // Purple
  'Oncological': '#F59E0B',     // Amber
  'Autoimmune': '#10B981',      // Green
  'Respiratory': '#06B6D4',     // Cyan
  'Genetic': '#EC4899',         // Pink
  'Infectious': '#F97316',      // Orange
  'Other': '#6B7280'            // Gray
}

export default function NetworkGraph({ nodes, links }: NetworkGraphProps) {
  const graphRef = useRef<any>()
  const [dimensions, setDimensions] = useState({ width: 1200, height: 600 })

  useEffect(() => {
    const updateDimensions = () => {
      const container = graphRef.current?.parentElement
      if (container) {
        const isMobile = window.innerWidth < 640
        setDimensions({
          width: Math.min(container.clientWidth - 24, 1200),
          height: isMobile ? 400 : window.innerWidth < 1024 ? 500 : 600
        })
      }
    }

    updateDimensions()
    window.addEventListener('resize', updateDimensions)
    return () => window.removeEventListener('resize', updateDimensions)
  }, [])

  // Transform nodes and links for the graph
  const graphNodes: Node[] = nodes.map(node => ({
    ...node,
    val: 5 + (links.filter(l => 
      (typeof l.source === 'string' ? l.source : l.source.id) === node.id ||
      (typeof l.target === 'string' ? l.target : l.target.id) === node.id
    ).length * 2)
  }))

  const graphLinks: Link[] = links.map(link => ({
    ...link,
    source: typeof link.source === 'string' 
      ? graphNodes.find(n => n.id === link.source) || link.source
      : link.source,
    target: typeof link.target === 'string'
      ? graphNodes.find(n => n.id === link.target) || link.target
      : link.target
  }))

  const getNodeColor = (node: Node) => {
    return categoryColors[node.category || 'Other'] || categoryColors['Other']
  }

  return (
    <div className="w-full bg-gray-50 rounded-lg p-2 sm:p-4 border border-gray-200 touch-none">
      <ForceGraph2D
        ref={graphRef}
        graphData={{ nodes: graphNodes, links: graphLinks }}
        width={dimensions.width}
        height={dimensions.height}
        nodeLabel={(node: Node) => `${node.name}\n${node.category || 'Uncategorized'}`}
        nodeColor={getNodeColor}
        nodeVal={(node: Node) => node.val || 5}
        linkColor={() => 'rgba(0, 0, 0, 0.2)'}
        linkWidth={(link: Link) => Math.sqrt(link.score) * 2}
        linkDirectionalArrowLength={4}
        linkDirectionalArrowRelPos={1}
        cooldownTicks={100}
        onEngineStop={() => graphRef.current?.zoomToFit(400)}
        d3Force={{
          charge: {
            strength: -300
          },
          link: {
            distance: 100
          }
        }}
        enablePanInteraction={true}
        enableZoomInteraction={true}
        enableNodeDrag={true}
      />
      <div className="mt-3 sm:mt-4 flex flex-wrap gap-2 sm:gap-4 text-xs sm:text-sm">
        <div className="font-semibold text-gray-700">Legend:</div>
        {Object.entries(categoryColors).map(([category, color]) => (
          <div key={category} className="flex items-center gap-1 sm:gap-2">
            <div className="w-3 h-3 sm:w-4 sm:h-4 rounded-full" style={{ backgroundColor: color }} />
            <span className="text-gray-600">{category}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

