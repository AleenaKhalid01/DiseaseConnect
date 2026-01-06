import Link from 'next/link'
import { Home } from 'lucide-react'

export default function NotFound() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">
          Disease Not Found
        </h2>
        <p className="text-gray-600 mb-8">
          The disease you&apos;re looking for doesn&apos;t exist in our database.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Home className="w-5 h-5" />
          Return Home
        </Link>
      </div>
    </main>
  )
}
