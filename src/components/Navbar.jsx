import React, { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Sun, Moon, Menu, X, Wrench, ChevronDown } from 'lucide-react'
import { useTheme } from '../ThemeContext'

const portals = [
  { label: 'Pelanggan', path: '/customer', color: 'text-brand-400' },
  { label: 'Teknisi',   path: '/technician', color: 'text-accent-400' },
  { label: 'Admin',     path: '/admin', color: 'text-orange-400' },
]

export default function Navbar() {
  const { dark, toggle } = useTheme()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [portalOpen, setPortalOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()

  const activePortal = portals.find(p => location.pathname.startsWith(p.path))

  return (
    <nav className="fixed top-0 inset-x-0 z-50 border-b border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-950/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-lg bg-brand-500 flex items-center justify-center">
            <Wrench size={16} className="text-white" />
          </div>
          <span className="font-display text-xl font-700 tracking-tight">
            Tech<span className="text-brand-500">Fix</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-6">
          <Link to="/" className={`text-sm font-medium transition-colors ${location.pathname === '/' ? 'text-brand-500' : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'}`}>
            Beranda
          </Link>

          {/* Portal dropdown */}
          <div className="relative">
            <button
              onClick={() => setPortalOpen(o => !o)}
              className="flex items-center gap-1 text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              {activePortal ? <span className={activePortal.color}>{activePortal.label}</span> : 'Portal'}
              <ChevronDown size={14} className={`transition-transform ${portalOpen ? 'rotate-180' : ''}`} />
            </button>
            {portalOpen && (
              <div className="absolute top-full mt-2 right-0 w-44 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-xl overflow-hidden">
                {portals.map(p => (
                  <button key={p.path} onClick={() => { navigate(p.path); setPortalOpen(false) }}
                    className={`w-full text-left px-4 py-3 text-sm font-medium transition-colors hover:bg-gray-50 dark:hover:bg-gray-800 ${p.color}`}>
                    {p.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          <Link to="/about" className={`text-sm font-medium transition-colors ${location.pathname === '/about' ? 'text-brand-500' : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'}`}>
            Tentang
          </Link>
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-3">
          <button onClick={toggle} className="p-2 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
            {dark ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          <Link to="/customer/register" className="hidden md:flex items-center gap-2 px-4 py-2 rounded-lg bg-brand-500 hover:bg-brand-600 text-white text-sm font-medium transition-colors">
            Mulai Sekarang
          </Link>
          <button onClick={() => setMobileOpen(o => !o)} className="md:hidden p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 px-4 py-4 space-y-1">
          <Link to="/" onClick={() => setMobileOpen(false)} className="block px-3 py-2 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800">Beranda</Link>
          {portals.map(p => (
            <Link key={p.path} to={p.path} onClick={() => setMobileOpen(false)} className={`block px-3 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-800 ${p.color}`}>
              Portal {p.label}
            </Link>
          ))}
          <Link to="/about" onClick={() => setMobileOpen(false)} className="block px-3 py-2 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800">Tentang</Link>
          <div className="pt-2">
            <Link to="/customer/register" onClick={() => setMobileOpen(false)} className="block w-full text-center px-4 py-2 rounded-lg bg-brand-500 text-white text-sm font-medium">Mulai Sekarang</Link>
          </div>
        </div>
      )}
    </nav>
  )
}
