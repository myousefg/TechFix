import React, { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Sun, Moon, Menu, X, Wrench, ChevronDown, ArrowRight } from 'lucide-react'
import { useTheme } from '../ThemeContext'

const portals = [
  { label: 'Pelanggan', path: '/customer',   color: 'text-brand-500', bg: 'bg-brand-50 dark:bg-brand-900/30',   desc: 'Cari & pesan teknisi' },
  { label: 'Teknisi',   path: '/technician', color: 'text-teal-500',  bg: 'bg-teal-50 dark:bg-teal-900/30',    desc: 'Kelola order & penghasilan' },
  { label: 'Bisnis',    path: '/business',   color: 'text-purple-500',bg: 'bg-purple-50 dark:bg-purple-900/30', desc: 'IT support untuk UMKM' },
  { label: 'Admin',     path: '/admin',      color: 'text-orange-500',bg: 'bg-orange-50 dark:bg-orange-900/30', desc: 'Dashboard platform' },
]

export default function Navbar() {
  const { dark, toggle } = useTheme()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [portalOpen, setPortalOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', fn, { passive: true })
    return () => window.removeEventListener('scroll', fn)
  }, [])

  useEffect(() => {
    setPortalOpen(false)
    setMobileOpen(false)
  }, [location.pathname])

  const isHero = location.pathname === '/'
  const light = !scrolled && isHero
  const activePortal = portals.find(p => location.pathname.startsWith(p.path))

  return (
    <nav className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
      scrolled
        ? 'border-b border-gray-200 dark:border-gray-800 bg-white/95 dark:bg-gray-950/95 backdrop-blur-lg shadow-sm'
        : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">

        {/* Logo — always full width, never truncated */}
        <Link to="/" className="flex items-center gap-2 flex-shrink-0 group">
          <div className="w-8 h-8 rounded-lg bg-brand-500 flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm">
            <Wrench size={15} className="text-white" />
          </div>
          <span className={`font-display text-lg font-700 tracking-tight whitespace-nowrap transition-colors ${
            light ? 'text-white' : 'text-gray-900 dark:text-white'
          }`}>
            Tech<span className="text-brand-500">Fix</span>
          </span>
        </Link>

        {/* Desktop nav — centered */}
        <div className="hidden md:flex items-center gap-1 flex-1 justify-center">
          <NavLink to="/" light={light} active={location.pathname === '/'}>Beranda</NavLink>

          <div className="relative">
            <button
              onClick={() => setPortalOpen(o => !o)}
              className={`flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                light
                  ? 'text-white/80 hover:text-white hover:bg-white/10'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
            >
              {activePortal
                ? <span className={activePortal.color}>{activePortal.label}</span>
                : 'Portal'
              }
              <ChevronDown size={13} className={`transition-transform duration-200 ${portalOpen ? 'rotate-180' : ''}`} />
            </button>

            {portalOpen && (
              <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 w-56 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-2xl overflow-hidden animate-scale-in">
                {portals.map(p => (
                  <button key={p.path} onClick={() => navigate(p.path)}
                    className="w-full text-left px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-800 group flex items-center gap-3 transition-colors">
                    <div className={`w-8 h-8 rounded-lg ${p.bg} flex items-center justify-center flex-shrink-0`}>
                      <span className={`text-xs font-bold ${p.color}`}>{p.label.charAt(0)}</span>
                    </div>
                    <div>
                      <p className={`text-sm font-medium ${p.color}`}>{p.label}</p>
                      <p className="text-xs text-gray-400">{p.desc}</p>
                    </div>
                    <ArrowRight size={12} className="text-gray-300 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                  </button>
                ))}
              </div>
            )}
          </div>

          <NavLink to="/about" light={light} active={location.pathname === '/about'}>Tentang</NavLink>
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-1 flex-shrink-0">
          <button
            onClick={toggle}
            className={`p-2 rounded-lg transition-colors ${
              light
                ? 'text-white/70 hover:text-white hover:bg-white/10'
                : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
            }`}
            aria-label="Toggle theme"
          >
            {dark ? <Sun size={17} /> : <Moon size={17} />}
          </button>

          <Link to="/customer/register"
            className="hidden md:flex press items-center gap-1.5 px-4 py-2 rounded-xl bg-brand-500 hover:bg-brand-400 text-white text-sm font-medium transition-all shadow-sm hover:shadow-brand-500/30 hover:shadow-md ml-1">
            Mulai <ArrowRight size={13} />
          </Link>

          <button
            onClick={() => setMobileOpen(o => !o)}
            className={`md:hidden p-2 rounded-lg transition-colors ${
              light
                ? 'text-white hover:bg-white/10'
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
            }`}
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 animate-slide-up">
          <div className="px-4 py-3 space-y-1">
            <MobileLink to="/" label="Beranda" />
            <div className="pt-1 pb-1">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-3 mb-1">Portal</p>
              {portals.map(p => (
                <Link key={p.path} to={p.path}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors ${p.color}`}>
                  <div className={`w-7 h-7 rounded-lg ${p.bg} flex items-center justify-center`}>
                    <span className={`text-xs font-bold ${p.color}`}>{p.label.charAt(0)}</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium">{p.label}</p>
                    <p className="text-xs text-gray-400">{p.desc}</p>
                  </div>
                </Link>
              ))}
            </div>
            <MobileLink to="/about" label="Tentang" />
          </div>
          <div className="px-4 pb-4 pt-1 border-t border-gray-100 dark:border-gray-800">
            <Link to="/customer/register"
              className="press flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-brand-500 text-white text-sm font-medium">
              Mulai Sekarang <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      )}
    </nav>
  )
}

function NavLink({ to, children, light, active }) {
  return (
    <Link to={to}
      className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
        active
          ? 'text-brand-500'
          : light
            ? 'text-white/75 hover:text-white hover:bg-white/10'
            : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800'
      }`}>
      {children}
    </Link>
  )
}

function MobileLink({ to, label }) {
  return (
    <Link to={to}
      className="block px-3 py-2.5 rounded-xl text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
      {label}
    </Link>
  )
}
