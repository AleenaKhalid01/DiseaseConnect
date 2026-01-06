-- Disease Connect Database Schema
-- Run this in Supabase SQL Editor

-- Diseases Table
CREATE TABLE IF NOT EXISTS diseases (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  disgenet_id TEXT UNIQUE,
  description TEXT,
  category TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Genes Table
CREATE TABLE IF NOT EXISTS genes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  symbol TEXT NOT NULL UNIQUE,
  name TEXT,
  chromosome TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Association Table (Which genes cause which disease)
CREATE TABLE IF NOT EXISTS disease_genes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  disease_id UUID REFERENCES diseases(id) ON DELETE CASCADE,
  gene_id UUID REFERENCES genes(id) ON DELETE CASCADE,
  score FLOAT DEFAULT 0.0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(disease_id, gene_id)
);

-- Comorbidity Table (Pre-calculated network connections)
CREATE TABLE IF NOT EXISTS disease_comorbidities (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  disease_a_id UUID REFERENCES diseases(id) ON DELETE CASCADE,
  disease_b_id UUID REFERENCES diseases(id) ON DELETE CASCADE,
  shared_genes_count INT DEFAULT 0,
  score FLOAT DEFAULT 0.0,
  jaccard_index FLOAT DEFAULT 0.0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(disease_a_id, disease_b_id),
  CHECK (disease_a_id != disease_b_id)
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_disease_genes_disease_id ON disease_genes(disease_id);
CREATE INDEX IF NOT EXISTS idx_disease_genes_gene_id ON disease_genes(gene_id);
CREATE INDEX IF NOT EXISTS idx_disease_comorbidities_disease_a ON disease_comorbidities(disease_a_id);
CREATE INDEX IF NOT EXISTS idx_disease_comorbidities_disease_b ON disease_comorbidities(disease_b_id);
CREATE INDEX IF NOT EXISTS idx_diseases_name ON diseases(name);
CREATE INDEX IF NOT EXISTS idx_genes_symbol ON genes(symbol);

-- Enable Row Level Security (RLS) - Allow public read access for demo
ALTER TABLE diseases ENABLE ROW LEVEL SECURITY;
ALTER TABLE genes ENABLE ROW LEVEL SECURITY;
ALTER TABLE disease_genes ENABLE ROW LEVEL SECURITY;
ALTER TABLE disease_comorbidities ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "Allow public read access on diseases" ON diseases FOR SELECT USING (true);
CREATE POLICY "Allow public read access on genes" ON genes FOR SELECT USING (true);
CREATE POLICY "Allow public read access on disease_genes" ON disease_genes FOR SELECT USING (true);
CREATE POLICY "Allow public read access on disease_comorbidities" ON disease_comorbidities FOR SELECT USING (true);

