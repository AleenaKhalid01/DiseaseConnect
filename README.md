# Disease Connect

An interactive web application for visualizing disease-gene associations and comorbidity networks. Built with Next.js, Supabase, and React Force Graph.

## 🎯 Project Overview

Disease Connect combines **Bioinformatics**, **Graph Theory**, and **Full-Stack Development** to create an academic-quality portfolio project. The application visualizes:

- Disease-gene associations from DisGeNET and OMIM databases
- Comorbidity networks based on shared genetic associations
- Jaccard similarity indices for disease relationships
- Interactive network graphs for exploration

## 🚀 Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Database**: Supabase (PostgreSQL)
- **Visualization**: React Force Graph 2D
- **Styling**: Tailwind CSS
- **Deployment**: Vercel (recommended)

## 📋 Prerequisites

- Node.js 18+ installed
- A Supabase account (free tier works)
- Git (for version control)

## 🛠️ Setup Instructions

### 1. Clone and Install

```bash
cd disease-connect
npm install
```

### 2. Set Up Supabase

1. Go to [supabase.com](https://supabase.com) and create a free account
2. Create a new project
3. Go to **Settings** → **API** to get your credentials
4. Copy `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

5. Add your Supabase credentials to `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### 3. Set Up Database

1. In Supabase, go to **SQL Editor**
2. Open `database/schema.sql` and copy its contents
3. Paste and run the SQL in the Supabase SQL Editor
4. This creates all necessary tables with proper indexes and RLS policies

### 4. Seed the Database

```bash
npm run seed
```

This will populate your database with 20 diseases, 40 genes, and their associations.

### 5. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📁 Project Structure

```
disease-connect/
├── app/                    # Next.js App Router pages
│   ├── disease/[id]/      # Dynamic disease detail pages
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Home page
│   └── globals.css        # Global styles
├── components/            # React components
│   ├── SearchBar.tsx     # Disease search functionality
│   ├── NetworkGraph.tsx  # Interactive force graph
│   ├── DiseaseGenesTable.tsx
│   └── ComorbiditiesList.tsx
├── lib/                   # Utilities and configurations
│   ├── supabase.ts       # Supabase client
│   └── utils.ts          # Helper functions (Jaccard Index, etc.)
├── scripts/              # Database seeding
│   ├── seed.ts          # Seeding script
│   └── mock-data.json   # Sample data
├── database/
│   └── schema.sql        # Database schema
└── package.json
```

## 🎨 Features

### 1. **Interactive Network Graph**
- Force-directed graph visualization of disease relationships
- Color-coded nodes by disease category
- Edge thickness based on similarity scores
- Click and drag to explore the network

### 2. **Disease Search**
- Real-time search with autocomplete
- Fuzzy matching for disease names
- Direct navigation to disease detail pages

### 3. **Disease Detail Pages**
- Comprehensive disease information
- Sortable table of associated genes
- Top comorbidities with similarity metrics
- Jaccard Index calculations

### 4. **Jaccard Similarity Index**
- Mathematical calculation of disease similarity
- Based on shared gene associations
- Formula: `J(A,B) = |A ∩ B| / |A ∪ B|`

## 📊 Database Schema

### Tables

- **diseases**: Disease information (name, category, description)
- **genes**: Gene information (symbol, name, chromosome)
- **disease_genes**: Many-to-many relationship with association scores
- **disease_comorbidities**: Pre-calculated comorbidity relationships

### Key Relationships

- Diseases ↔ Genes: Many-to-Many (via `disease_genes`)
- Diseases ↔ Diseases: Many-to-Many (via `disease_comorbidities`)

## 🚢 Deployment

### Deploy to Vercel (Recommended)

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Click **Import Project**
4. Select your GitHub repository
5. Add environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
6. Click **Deploy**

Your app will be live at `https://your-project.vercel.app`

## 🔬 Academic Features

This project demonstrates:

1. **Graph Theory**: Network analysis and visualization
2. **Bioinformatics**: Disease-gene association data integration
3. **Data Science**: Jaccard similarity calculations
4. **Full-Stack Development**: Modern web architecture
5. **Database Design**: Complex many-to-many relationships

## 📝 Customization

### Adding More Data

1. Edit `scripts/mock-data.json` to add more diseases/genes
2. Run `npm run seed` again (it will clear and reseed)

### Modifying Visualizations

- Edit `components/NetworkGraph.tsx` for graph customization
- Adjust colors in the `categoryColors` object
- Modify force simulation parameters in the `d3Force` config

### Styling

- All styles use Tailwind CSS
- Modify `tailwind.config.ts` for theme customization
- Global styles in `app/globals.css`

## 🐛 Troubleshooting

### Database Connection Issues

- Verify your `.env.local` file has correct Supabase credentials
- Check that RLS policies allow public read access
- Ensure tables are created (run schema.sql)

### Build Errors

- Run `npm install` to ensure all dependencies are installed
- Check Node.js version (requires 18+)
- Clear `.next` folder and rebuild: `rm -rf .next && npm run build`

### Graph Not Rendering

- Check browser console for errors
- Verify data is seeded in database
- Ensure `react-force-graph-2d` is installed

## 📚 Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [React Force Graph](https://github.com/vasturiano/react-force-graph)
- [DisGeNET](https://www.disgenet.org/)
- [OMIM](https://www.omim.org/)

## 📄 License

This project is created for academic/portfolio purposes.

## 🙏 Acknowledgments

- Disease-gene associations based on DisGeNET and OMIM databases
- Built with modern web technologies for academic demonstration

---

**Built with ❤️ for academic portfolio**

