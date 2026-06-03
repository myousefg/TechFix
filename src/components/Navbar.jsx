import React, { useState, useEffect, useRef } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Sun, Moon, Menu, X, Wrench, ChevronDown, ArrowRight, Bell, Package, Shield, Tag, Info } from 'lucide-react'
import { useTheme } from '../ThemeContext'
import { getNotifications, markNotifsRead } from '../store'

const portals = [
  { label: 'Pelanggan', path: '/customer',    color: 'text-brand-500',  bg: 'bg-brand-50 dark:bg-brand-900/30',  desc: 'Cari & pesan teknisi' },
  { label: 'Teknisi',   path: '/technician',  color: 'text-teal-500',   bg: 'bg-teal-50 dark:bg-teal-900/30',   desc: 'Kelola order & penghasilan' },
  { label: 'Admin',     path: '/admin',        color: 'text-orange-500', bg: 'bg-orange-50 dark:bg-orange-900/30',desc: 'Dashboard platform' },
]

function NotificationDropdown({ scrolled }) {
  const [open, setOpen] = useState(false)
  const [notifs, setNotifs] = useState(getNotifications())
  const dropdownRef = useRef(null)
  
  const typeConfig = {
    order:  { icon: Package, color: 'bg-brand-50 dark:bg-brand-900/30',  text: 'text-brand-500'  },
    escrow: { icon: Shield,  color: 'bg-green-50 dark:bg-green-900/30',  text: 'text-green-500'  },
    promo:  { icon: Tag,     color: 'bg-orange-50 dark:bg-orange-900/30',text: 'text-orange-500' },
    system: { icon: Info,    color: 'bg-gray-100 dark:bg-gray-800',       text: 'text-gray-500'   },
  }
  
  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])
  
  function markOne(id) {
    const updated = notifs.map(n => n.id === id ? { ...n, read: true } : n)
    setNotifs(updated)
    markNotifsRead(updated)
  }
  
  const unread = notifs.filter(n => !n.read).length
  
  return (
    <div className="relative" ref={dropdownRef}>
      <button onClick={() => setOpen(!open)} className="relative p-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
        <Bell size={20} />
        {unread > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-brand-500 text-white text-xs font-bold rounded-full flex items-center justify-center ring-2 ring-white dark:ring-gray-900">
            {unread}
          </span>
        )}
      </button>
      
      {open && (
        <div className="absolute top-full mt-2 right-0 w-80 max-h-96 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-xl overflow-hidden animate-scale-in z-50">
          <div className="p-3 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
            <p className="font-semibold text-sm text-gray-900 dark:text-white">Notifikasi</p>
            {unread > 0 && <span className="text-xs text-brand-500 font-medium">{unread} baru</span>}
          </div>
          <div className="overflow-y-auto max-h-80">
            {notifs.map(n => {
              const cfg = typeConfig[n.type] || typeConfig.system
              const Icon = cfg.icon
              return (
                <button
                  key={n.id}
                  onClick={() => markOne(n.id)}
                  className={`w-full text-left p-3 transition-colors hover:bg-gray-50 dark:hover:bg-gray-800 border-b border-gray-100 dark:border-gray-800 last:border-b-0 ${!n.read ? 'bg-brand-50/30 dark:bg-brand-900/10' : ''}`}>
                  <div className="flex items-start gap-2">
                    <div className={`w-8 h-8 rounded-lg ${cfg.color} flex items-center justify-center flex-shrink-0 mt-0.5`}>
                      <Icon size={14} className={cfg.text} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-1">
                        <p className={`text-xs font-medium ${!n.read ? 'text-gray-900 dark:text-white' : 'text-gray-700 dark:text-gray-300'}`}>{n.title}</p>
                        {!n.read && <div className="w-1.5 h-1.5 rounded-full bg-brand-500 flex-shrink-0 mt-1" />}
                      </div>
                      <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5 line-clamp-2">{n.body}</p>
                      <p className="text-[10px] text-gray-400 mt-1">{n.time}</p>
                    </div>
                  </div>
                </button>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

export default function Navbar() {
  const { dark, toggle } = useTheme()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [portalOpen, setPortalOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', fn)
    return () => window.removeEventListener('scroll', fn)
  }, [])

  useEffect(() => { setPortalOpen(false); setMobileOpen(false) }, [location.pathname])

  const activePortal = portals.find(p => location.pathname.startsWith(p.path))

  return (
    <nav className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${scrolled ? 'border-b border-gray-200 dark:border-gray-800 bg-white/90 dark:bg-gray-950/90 backdrop-blur-lg shadow-sm' : 'bg-transparent'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-lg bg-brand-500 flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm group-hover:shadow-brand-500/40 group-hover:shadow-md">
            <Wrench size={15} className="text-white" />
          </div>
          <span className={`font-display text-xl font-700 tracking-tight transition-colors ${scrolled || location.pathname !== '/' ? 'text-gray-900 dark:text-white' : 'text-white'}`}>
            Tech<span className="text-brand-500">Fix</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-1">
          <Link to="/"
            className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${location.pathname === '/' ? 'text-brand-500' : scrolled || location.pathname !== '/' ? 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800' : 'text-white/70 hover:text-white hover:bg-white/10'}`}>
            Beranda
          </Link>

          {/* Portal dropdown */}
          <div className="relative">
            <button onClick={() => setPortalOpen(o => !o)}
              className={`flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${scrolled || location.pathname !== '/' ? 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800' : 'text-white/70 hover:text-white hover:bg-white/10'}`}>
              {activePortal ? <span className={activePortal.color}>{activePortal.label}</span> : 'Portal'}
              <ChevronDown size={14} className={`transition-transform duration-200 ${portalOpen ? 'rotate-180' : ''}`} />
            </button>
            {portalOpen && (
              <div className="absolute top-full mt-2 right-0 w-56 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-xl overflow-hidden animate-scale-in">
                {portals.map(p => (
                  <button key={p.path} onClick={() => navigate(p.path)}
                    className="w-full text-left px-4 py-3 transition-colors hover:bg-gray-50 dark:hover:bg-gray-800 group flex items-center gap-3">
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

          <Link to="/about"
            className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${location.pathname === '/about' ? 'text-brand-500' : scrolled || location.pathname !== '/' ? 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800' : 'text-white/70 hover:text-white hover:bg-white/10'}`}>
            Tentang
          </Link>
        </div>

        {/* Right */}
        <div className="flex items-center gap-2">
          {location.pathname.startsWith('/customer') && <NotificationDropdown scrolled={scrolled} />}
          <button onClick={toggle}
            className={`p-2 rounded-lg transition-colors ${scrolled || location.pathname !== '/' ? 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800' : 'text-white/70 hover:text-white hover:bg-white/10'}`}>
            {dark ? <Sun size={17} /> : <Moon size={17} />}
          </button>
          <Link to="/customer/register"
            className="hidden md:flex press items-center gap-1.5 px-4 py-2 rounded-xl bg-brand-500 hover:bg-brand-400 text-white text-sm font-medium transition-all shadow-sm hover:shadow-brand-500/30 hover:shadow-md">
            Mulai Sekarang
            <ArrowRight size={13} />
          </Link>
          <button onClick={() => setMobileOpen(o => !o)}
            className={`md:hidden p-2 rounded-lg transition-colors ${scrolled || location.pathname !== '/' ? 'text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800' : 'text-white hover:bg-white/10'}`}>
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 px-4 py-4 space-y-1 animate-slide-up">
          <Link to="/" className="block px-3 py-2.5 rounded-xl text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800">Beranda</Link>
          {portals.map(p => (
            <Link key={p.path} to={p.path} className={`block px-3 py-2.5 rounded-xl text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-800 ${p.color}`}>
              Portal {p.label}
            </Link>
          ))}
          <Link to="/about" className="block px-3 py-2.5 rounded-xl text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800">Tentang</Link>
          <div className="pt-2">
            <Link to="/customer/register" className="press block w-full text-center px-4 py-2.5 rounded-xl bg-brand-500 text-white text-sm font-medium">
              Mulai Sekarang
            </Link>
          </div>
        </div>
      )}
    </nav>
  )
}
