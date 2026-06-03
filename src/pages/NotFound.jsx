import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Wrench, ArrowLeft, Home } from 'lucide-react'

export default function NotFound() {
  const navigate = useNavigate()
  return (
    <div className="pt-16 min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center px-4">
      <div className="text-center max-w-sm">
        <div className="w-20 h-20 rounded-2xl bg-brand-50 dark:bg-brand-900/20 flex items-center justify-center mx-auto mb-6">
          <Wrench size={36} className="text-brand-500" />
        </div>
        <h1 className="font-display text-6xl font-700 text-gray-900 dark:text-white mb-2">404</h1>
        <p className="font-semibold text-gray-700 dark:text-gray-300 mb-2">Halaman tidak ditemukan</p>
        <p className="text-sm text-gray-400 mb-8">URL yang kamu akses tidak ada atau sudah dipindahkan.</p>
        <div className="flex gap-3 justify-center">
          <button onClick={() => navigate(-1)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
            <ArrowLeft size={15} /> Kembali
          </button>
          <button onClick={() => navigate('/')}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand-500 hover:bg-brand-600 text-white text-sm font-medium transition-colors">
            <Home size={15} /> Beranda
          </button>
        </div>
      </div>
    </div>
  )
}
