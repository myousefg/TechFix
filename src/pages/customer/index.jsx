import React, { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Search, Filter, MapPin, Clock, Shield, Star, ArrowLeft, CheckCircle, Upload, CreditCard, Smartphone, Building, ChevronRight, Bell, History, Settings, LogOut, Package, RefreshCw } from 'lucide-react'
import { Card, Badge, StarRating, TechnicianCard, Button, Input, EscrowStatus, StatCard, SidebarLink } from '../../components/UI'
import { technicians, orders, services, maintenancePlans } from '../../data'
import { getSubscription, saveSubscription } from '../../store'

function CustomerLayout({ children, activeTab }) {
  const navigate = useNavigate()
  const tabs = [
    { id: 'home',     icon: Search,   label: 'Cari Teknisi', path: '/customer' },
    { id: 'orders',   icon: Package,  label: 'Pesanan',      path: '/customer/orders' },
    { id: 'sub',      icon: RefreshCw,label: 'Langganan',    path: '/customer/subscription' },
    { id: 'settings', icon: Settings, label: 'Akun',         path: '/customer/settings' },
  ]
  return (
    <div className="pt-16 min-h-screen bg-gray-50 dark:bg-gray-950">
      <div className="max-w-2xl mx-auto px-4 pb-24">{children}</div>
      {/* Bottom nav */}
      <nav className="fixed bottom-0 inset-x-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 z-40 safe-area-bottom">
        <div className="max-w-2xl mx-auto flex">
          {tabs.map(t => (
            <button key={t.id} onClick={() => navigate(t.path)}
              className={`flex-1 flex flex-col items-center py-3 gap-1 text-xs transition-colors ${activeTab === t.id ? 'text-brand-500' : 'text-gray-500 dark:text-gray-400'}`}>
              <t.icon size={20} />
              {t.label}
            </button>
          ))}
        </div>
      </nav>
    </div>
  )
}

// ── ONBOARDING / REGISTER ───────────────────────────────────────
export function CustomerRegister() {
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  return (
    <div className="pt-16 min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center px-4">
      <Card className="w-full max-w-md p-8">
        <div className="flex gap-2 mb-8">
          {[1,2,3].map(i => (
            <div key={i} className={`h-1.5 flex-1 rounded-full transition-colors ${i <= step ? 'bg-brand-500' : 'bg-gray-200 dark:bg-gray-700'}`} />
          ))}
        </div>
        {step === 1 && (
          <>
            <h2 className="font-display text-2xl font-700 text-gray-900 dark:text-white mb-2">Buat Akun</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">Daftar gratis, mulai cari teknisi terpercaya</p>
            <div className="space-y-4">
              <Input label="Nama Lengkap" placeholder="Masukkan nama lengkap" />
              <Input label="Email" type="email" placeholder="email@example.com" />
              <Input label="No. WhatsApp" placeholder="+62 812 xxxx xxxx" />
              <Input label="Password" type="password" placeholder="Minimal 8 karakter" />
            </div>
            <Button className="w-full mt-6" onClick={() => setStep(2)}>Lanjut</Button>
            <p className="text-center text-sm text-gray-500 mt-4">Sudah punya akun? <button onClick={() => navigate('/customer')} className="text-brand-500 font-medium">Masuk</button></p>
          </>
        )}
        {step === 2 && (
          <>
            <h2 className="font-display text-2xl font-700 text-gray-900 dark:text-white mb-2">Lokasi Kamu</h2>
            <p className="text-sm text-gray-500 mb-6">Kami gunakan untuk menampilkan teknisi terdekat</p>
            <div className="space-y-4">
              <Input label="Kota" placeholder="Bandung" />
              <Input label="Kecamatan" placeholder="Coblong" />
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Alamat Lengkap</label>
                <textarea className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 text-gray-900 dark:text-white" rows={3} placeholder="Jl. Ganesha No. 10..." />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <Button variant="outline" onClick={() => setStep(1)} className="flex-1">Kembali</Button>
              <Button onClick={() => setStep(3)} className="flex-1">Lanjut</Button>
            </div>
          </>
        )}
        {step === 3 && (
          <>
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mx-auto mb-4">
                <CheckCircle size={32} className="text-green-500" />
              </div>
              <h2 className="font-display text-2xl font-700 text-gray-900 dark:text-white mb-2">Akun Dibuat!</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-8">Selamat datang di TechFix. Mulai cari teknisi untuk perangkat kamu.</p>
              <Button className="w-full" onClick={() => navigate('/customer')}>Mulai Explore</Button>
            </div>
          </>
        )}
      </Card>
    </div>
  )
}

// ── HOMEPAGE / SEARCH ───────────────────────────────────────────
export function CustomerHome() {
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState('Semua')
  const [viewMode, setViewMode] = useState('list') // 'list' | 'map'
  const [aiMatching, setAiMatching] = useState(false)
  const [aiLoading, setAiLoading] = useState(false)

  const filters = ['Semua', 'Terdekat', 'Rating Tertinggi', 'Harga Terendah', 'Terverifikasi']

  // AI match scores (mock)
  const aiScores = { 1: 98, 2: 94, 3: 87, 4: 82, 5: 76, 6: 71 }

  const filtered = technicians
    .filter(t => query === '' || t.name.toLowerCase().includes(query.toLowerCase()) || t.specialty.toLowerCase().includes(query.toLowerCase()))
    .sort((a, b) => aiMatching ? (aiScores[b.id] || 0) - (aiScores[a.id] || 0) : 0)

  function toggleAI() {
    if (aiMatching) { setAiMatching(false); return }
    setAiLoading(true)
    setTimeout(() => { setAiLoading(false); setAiMatching(true) }, 1200)
  }

  // Mock map pins
  const pins = [
    { id: 1, name: 'Budi S.',  x: 55, y: 38, rating: 4.9 },
    { id: 2, name: 'Rina K.',  x: 30, y: 55, rating: 4.8 },
    { id: 3, name: 'Agus P.',  x: 70, y: 62, rating: 4.7 },
    { id: 4, name: 'Dewi L.',  x: 45, y: 72, rating: 4.9 },
    { id: 5, name: 'Hendra W.',x: 22, y: 35, rating: 4.6 },
    { id: 6, name: 'Sari A.',  x: 78, y: 45, rating: 4.8 },
  ]

  return (
    <CustomerLayout activeTab="home">
      <div className="py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Halo, Hashfi 👋</p>
            <h1 className="font-display text-2xl font-700 text-gray-900 dark:text-white">Butuh servis apa?</h1>
          </div>
          <button onClick={() => navigate('/customer/notifications')} className="relative p-2 rounded-xl text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-800">
            <Bell size={20} />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
          </button>
        </div>

        {/* Search */}
        <div className="relative mb-3">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input value={query} onChange={e => setQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 text-gray-900 dark:text-white placeholder-gray-400"
            placeholder="Cari teknisi atau layanan..." />
        </div>

        {/* AI matching banner */}
        <button onClick={toggleAI}
          className={`w-full flex items-center gap-3 p-3 rounded-xl border mb-4 transition-all text-left ${aiMatching ? 'bg-brand-50 dark:bg-brand-900/20 border-brand-300 dark:border-brand-700' : 'bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 hover:border-brand-300'}`}>
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${aiMatching ? 'bg-brand-500' : 'bg-gray-100 dark:bg-gray-800'}`}>
            {aiLoading
              ? <div className="w-4 h-4 rounded-full border-2 border-brand-300 border-t-brand-600 animate-spin" />
              : <span className="text-sm">{aiMatching ? '✨' : '🤖'}</span>
            }
          </div>
          <div className="flex-1">
            <p className={`text-sm font-medium ${aiMatching ? 'text-brand-600 dark:text-brand-400' : 'text-gray-700 dark:text-gray-300'}`}>
              {aiLoading ? 'AI sedang menganalisis kebutuhanmu...' : aiMatching ? 'AI Smart Matching aktif' : 'Aktifkan AI Smart Matching'}
            </p>
            <p className="text-xs text-gray-400 mt-0.5">
              {aiMatching ? 'Teknisi diurutkan berdasarkan kecocokan terbaik untukmu' : 'AI akan pilihkan teknisi paling cocok secara otomatis'}
            </p>
          </div>
          <div className={`w-10 h-5 rounded-full transition-colors flex-shrink-0 ${aiMatching ? 'bg-brand-500' : 'bg-gray-200 dark:bg-gray-700'}`}>
            <div className={`w-4 h-4 bg-white rounded-full shadow transition-transform mt-0.5 ${aiMatching ? 'translate-x-5' : 'translate-x-0.5'}`} />
          </div>
        </button>

        {/* Service categories */}
        <div className="grid grid-cols-3 gap-2 mb-5">
          {services.slice(0,6).map(s => (
            <button key={s.id} onClick={() => setQuery(s.label)}
              className={`p-3 rounded-xl border text-center transition-all ${query === s.label ? 'bg-brand-50 dark:bg-brand-900/20 border-brand-400' : 'bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 hover:border-brand-300 dark:hover:border-brand-700'}`}>
              <div className="text-xl mb-1">{s.icon}</div>
              <p className="text-xs font-medium text-gray-700 dark:text-gray-300 leading-tight">{s.label}</p>
            </button>
          ))}
        </div>

        {/* Filter + view toggle row */}
        <div className="flex items-center gap-2 mb-4">
          <div className="flex gap-2 overflow-x-auto scrollbar-none flex-1">
            {filters.map(f => (
              <button key={f} onClick={() => setFilter(f)}
                className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${filter === f ? 'bg-brand-500 text-white' : 'bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400'}`}>
                {f}
              </button>
            ))}
          </div>
          {/* Map/list toggle */}
          <div className="flex bg-gray-100 dark:bg-gray-800 rounded-lg p-0.5 flex-shrink-0">
            <button onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-md text-xs transition-colors ${viewMode === 'list' ? 'bg-white dark:bg-gray-700 shadow-sm text-gray-900 dark:text-white' : 'text-gray-500'}`}>
              ☰
            </button>
            <button onClick={() => setViewMode('map')}
              className={`p-1.5 rounded-md text-xs transition-colors ${viewMode === 'map' ? 'bg-white dark:bg-gray-700 shadow-sm text-gray-900 dark:text-white' : 'text-gray-500'}`}>
              🗺
            </button>
          </div>
        </div>

        {/* MAP VIEW */}
        {viewMode === 'map' && (
          <div className="mb-4 animate-scale-in">
            <div className="relative w-full h-56 rounded-2xl overflow-hidden bg-gray-200 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
              {/* Fake map background */}
              <div className="absolute inset-0" style={{
                background: 'linear-gradient(135deg, #1a2035 0%, #1e2d40 50%, #1a2035 100%)',
                backgroundImage: `
                  repeating-linear-gradient(0deg, rgba(255,255,255,0.03) 0px, rgba(255,255,255,0.03) 1px, transparent 1px, transparent 40px),
                  repeating-linear-gradient(90deg, rgba(255,255,255,0.03) 0px, rgba(255,255,255,0.03) 1px, transparent 1px, transparent 40px)
                `
              }} />
              {/* Roads */}
              <svg className="absolute inset-0 w-full h-full opacity-20" viewBox="0 0 100 100" preserveAspectRatio="none">
                <path d="M0,50 Q25,45 50,50 T100,48" stroke="#60a5fa" strokeWidth="0.8" fill="none"/>
                <path d="M30,0 Q35,30 32,50 T30,100" stroke="#60a5fa" strokeWidth="0.6" fill="none"/>
                <path d="M0,25 L100,30" stroke="#60a5fa" strokeWidth="0.4" fill="none"/>
                <path d="M0,75 L100,72" stroke="#60a5fa" strokeWidth="0.4" fill="none"/>
                <path d="M70,0 L68,100" stroke="#60a5fa" strokeWidth="0.5" fill="none"/>
              </svg>
              {/* "You are here" pin */}
              <div className="absolute" style={{ left: '50%', top: '50%', transform: 'translate(-50%,-50%)' }}>
                <div className="w-4 h-4 rounded-full bg-blue-500 border-2 border-white shadow-lg">
                  <div className="w-4 h-4 rounded-full bg-blue-400 animate-ping-slow absolute inset-0" />
                </div>
              </div>
              {/* Technician pins */}
              {pins.map(pin => (
                <button key={pin.id} onClick={() => navigate(`/customer/technician/${pin.id}`)}
                  className="absolute group"
                  style={{ left: `${pin.x}%`, top: `${pin.y}%`, transform: 'translate(-50%,-100%)' }}>
                  <div className="relative">
                    <div className="bg-brand-500 text-white text-xs rounded-full px-2 py-0.5 font-medium shadow-lg whitespace-nowrap group-hover:bg-brand-400 transition-colors">
                      ⭐ {pin.rating}
                    </div>
                    <div className="w-2 h-2 bg-brand-500 rotate-45 mx-auto -mt-0.5 group-hover:bg-brand-400 transition-colors" />
                  </div>
                </button>
              ))}
              {/* Legend */}
              <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-sm rounded-lg px-3 py-2">
                <div className="flex items-center gap-2 text-xs text-white">
                  <div className="w-3 h-3 rounded-full bg-blue-500" /> Lokasi kamu
                </div>
                <div className="flex items-center gap-2 text-xs text-white mt-1">
                  <div className="w-3 h-2 rounded-sm bg-brand-500" /> Teknisi terdekat
                </div>
              </div>
              <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-sm rounded-lg px-2 py-1 text-xs text-white">
                Coblong, Bandung
              </div>
            </div>
            <p className="text-xs text-gray-400 text-center mt-2">Tap pin untuk lihat profil teknisi · {pins.length} teknisi dalam radius 5km</p>
          </div>
        )}

        {/* LIST VIEW */}
        {viewMode === 'list' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-xs text-gray-400 dark:text-gray-500 font-medium">{filtered.length} teknisi ditemukan</p>
              {aiMatching && <p className="text-xs text-brand-500 font-medium">✨ Diurutkan AI</p>}
            </div>
            {filtered.map(t => (
              <div key={t.id} className="relative">
                {aiMatching && (
                  <div className="absolute -top-1 -right-1 z-10 bg-brand-500 text-white text-xs px-1.5 py-0.5 rounded-full font-medium">
                    {aiScores[t.id]}% match
                  </div>
                )}
                <TechnicianCard {...t} onClick={() => navigate(`/customer/technician/${t.id}`)} />
              </div>
            ))}
          </div>
        )}
      </div>
    </CustomerLayout>
  )
}

// ── TECHNICIAN PROFILE ──────────────────────────────────────────
export function TechnicianProfile() {
  const navigate = useNavigate()
  const { id } = useParams()
  const tech = technicians.find(t => t.id === Number(id)) || technicians[0]
  const reviews = [
    { user: 'Andi R.',   rating: 5, text: 'Sangat profesional, laptop saya langsung normal. Harga sesuai estimasi.', date: '2 hari lalu' },
    { user: 'Maya S.',   rating: 5, text: 'Cepat dan transparan. Foto progress dikirim terus. Highly recommended!', date: '5 hari lalu' },
    { user: 'Rizky A.',  rating: 4, text: 'Bagus, hasil memuaskan. Hanya sedikit molor dari jadwal.', date: '1 minggu lalu' },
  ]
  return (
    <div className="pt-16 min-h-screen bg-gray-50 dark:bg-gray-950 pb-24">
      <div className="max-w-2xl mx-auto px-4">
        <div className="py-4">
          <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 dark:hover:text-white mb-4">
            <ArrowLeft size={16} /> Kembali
          </button>
          <Card className="p-6 mb-4">
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center text-white font-display text-2xl font-700">
                {tech.name.charAt(0)}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h1 className="font-display text-xl font-700 text-gray-900 dark:text-white">{tech.name}</h1>
                  {tech.verified && <Shield size={16} className="text-brand-500" />}
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400">{tech.specialty}</p>
                <div className="flex items-center gap-3 mt-2">
                  <StarRating rating={tech.rating} count={tech.reviews} />
                  <span className="text-xs text-gray-400 flex items-center gap-1"><MapPin size={11} />{tech.location}</span>
                </div>
                <div className="flex flex-wrap gap-2 mt-3">
                  {tech.badges.map(b => <Badge key={b} color="blue">{b}</Badge>)}
                  {tech.verified && <Badge color="green">KYC Verified</Badge>}
                </div>
              </div>
            </div>
          </Card>

          <div className="grid grid-cols-3 gap-3 mb-4">
            {[['Rp'+tech.price.toLocaleString('id'), 'Mulai dari'], [tech.rating+'/5', 'Rating'], [tech.reviews+'', 'Ulasan']].map(([v,l]) => (
              <Card key={l} className="p-4 text-center">
                <p className="font-display text-lg font-700 text-gray-900 dark:text-white">{v}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{l}</p>
              </Card>
            ))}
          </div>

          <Card className="p-5 mb-4">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Layanan yang Tersedia</h3>
            <div className="space-y-2">
              {['Diagnosa & estimasi biaya', 'Perbaikan hardware & software', 'Upgrade komponen', 'Cleaning & maintenance', 'Antar jemput perangkat (+biaya)'].map(s => (
                <div key={s} className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <CheckCircle size={14} className="text-green-500 flex-shrink-0" />
                  {s}
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-5 mb-6">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Ulasan Pelanggan</h3>
            <div className="space-y-4">
              {reviews.map((r, i) => (
                <div key={i} className={i < reviews.length - 1 ? 'pb-4 border-b border-gray-100 dark:border-gray-800' : ''}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-gray-900 dark:text-white">{r.user}</span>
                    <span className="text-xs text-gray-400">{r.date}</span>
                  </div>
                  <StarRating rating={r.rating} />
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{r.text}</p>
                </div>
              ))}
            </div>
          </Card>

          <Button className="w-full" size="lg" onClick={() => navigate(`/customer/booking/${tech.id}`)}>
            Pesan Servis – Rp{tech.price.toLocaleString('id')}+
          </Button>
        </div>
      </div>
    </div>
  )
}

// ── BOOKING ─────────────────────────────────────────────────────
export function Booking() {
  const navigate = useNavigate()
  const { id } = useParams()
  const tech = technicians.find(t => t.id === Number(id)) || technicians[0]
  const [step, setStep] = useState(1)
  return (
    <div className="pt-16 min-h-screen bg-gray-50 dark:bg-gray-950 pb-8">
      <div className="max-w-2xl mx-auto px-4 py-6">
        <button onClick={() => step > 1 ? setStep(s => s-1) : navigate(-1)} className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 dark:hover:text-white mb-4">
          <ArrowLeft size={16} /> {step > 1 ? 'Kembali' : 'Batalkan'}
        </button>
        <div className="flex gap-2 mb-6">
          {[1,2,3].map(i => <div key={i} className={`h-1.5 flex-1 rounded-full ${i <= step ? 'bg-brand-500' : 'bg-gray-200 dark:bg-gray-700'}`} />)}
        </div>

        {step === 1 && (
          <Card className="p-6">
            <h2 className="font-display text-xl font-700 text-gray-900 dark:text-white mb-1">Detail Servis</h2>
            <p className="text-sm text-gray-500 mb-5">Teknisi: <span className="font-medium text-gray-900 dark:text-white">{tech.name}</span></p>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Jenis Layanan</label>
                <select className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 text-gray-900 dark:text-white">
                  {services.map(s => <option key={s.id}>{s.label}</option>)}
                </select>
              </div>
              <Input label="Merek & Model Perangkat" placeholder="Contoh: ASUS ROG Zephyrus G14" />
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Deskripsi Masalah</label>
                <textarea className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 text-gray-900 dark:text-white resize-none" rows={3} placeholder="Ceritakan detail masalah perangkat kamu..." />
              </div>
              {/* Pickup/Delivery option */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Tipe Servis</label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: 'dropoff', icon: '🏪', label: 'Antar Sendiri', sub: 'Antar ke lokasi teknisi', extra: 'Gratis' },
                    { id: 'pickup',  icon: '🚗', label: 'Pickup & Delivery', sub: 'Teknisi jemput & antar', extra: '+Rp30.000' },
                  ].map(opt => (
                    <label key={opt.id}
                      className="flex flex-col p-3 rounded-xl border-2 border-gray-200 dark:border-gray-700 cursor-pointer hover:border-brand-400 dark:hover:border-brand-600 transition-colors has-[:checked]:border-brand-500 has-[:checked]:bg-brand-50 dark:has-[:checked]:bg-brand-900/20">
                      <input type="radio" name="servicetype" value={opt.id} defaultChecked={opt.id === 'dropoff'} className="sr-only" />
                      <span className="text-xl mb-1">{opt.icon}</span>
                      <span className="text-xs font-semibold text-gray-900 dark:text-white">{opt.label}</span>
                      <span className="text-xs text-gray-400 mt-0.5">{opt.sub}</span>
                      <span className={`text-xs font-medium mt-1 ${opt.id === 'dropoff' ? 'text-green-600' : 'text-brand-500'}`}>{opt.extra}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Foto Perangkat (opsional)</label>
                <div className="border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-xl p-5 text-center cursor-pointer hover:border-brand-300 dark:hover:border-brand-600 transition-colors">
                  <Upload size={18} className="mx-auto text-gray-400 mb-1.5" />
                  <p className="text-sm text-gray-400">Tap untuk upload foto</p>
                </div>
              </div>
              <Input label="Jadwal Servis" type="date" />
            </div>
            <Button className="w-full mt-6" onClick={() => setStep(2)}>Lanjut ke Pembayaran</Button>
          </Card>
        )}

        {step === 2 && (
          <Card className="p-6">
            <h2 className="font-display text-xl font-700 text-gray-900 dark:text-white mb-5">Ringkasan & Pembayaran</h2>
            <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 mb-5 space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-gray-500">Teknisi</span><span className="font-medium text-gray-900 dark:text-white">{tech.name}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Layanan</span><span className="font-medium text-gray-900 dark:text-white">Servis Laptop</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Estimasi biaya</span><span className="font-medium text-gray-900 dark:text-white">Rp{tech.price.toLocaleString('id')}</span></div>
              <div className="border-t border-gray-200 dark:border-gray-700 pt-2 flex justify-between font-semibold"><span>Total Escrow</span><span className="text-brand-500">Rp{tech.price.toLocaleString('id')}</span></div>
            </div>
            <p className="text-xs text-gray-400 bg-brand-50 dark:bg-brand-900/20 text-brand-700 dark:text-brand-300 rounded-xl p-3 mb-5">
              🔒 Dana akan ditahan di escrow TechFix hingga kamu konfirmasi puas. Garansi uang kembali jika servis gagal.
            </p>
            <h3 className="font-semibold text-sm text-gray-700 dark:text-gray-300 mb-3">Pilih Metode Pembayaran</h3>
            <div className="space-y-2 mb-5">
              {[{icon:'💳', label:'Transfer Bank (Virtual Account)', sub:'BCA, Mandiri, BNI, BRI'},
                {icon:'📱', label:'E-Wallet', sub:'GoPay, OVO, DANA, ShopeePay'},
                {icon:'📲', label:'QRIS', sub:'Scan & bayar dari aplikasi apapun'},
                {icon:'💸', label:'PayLater / Cicilan', sub:'GoPay Later, Kredivo'}].map(m => (
                <label key={m.label} className="flex items-center gap-3 p-3 rounded-xl border border-gray-200 dark:border-gray-700 cursor-pointer hover:border-brand-300 dark:hover:border-brand-700">
                  <input type="radio" name="payment" className="accent-brand-500" />
                  <span className="text-xl">{m.icon}</span>
                  <div><p className="text-sm font-medium text-gray-900 dark:text-white">{m.label}</p><p className="text-xs text-gray-400">{m.sub}</p></div>
                </label>
              ))}
            </div>
            <Button className="w-full" onClick={() => setStep(3)}>Bayar & Konfirmasi Pesanan</Button>
          </Card>
        )}

        {step === 3 && (
          <div className="text-center py-8">
            <div className="w-20 h-20 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mx-auto mb-4">
              <CheckCircle size={40} className="text-green-500" />
            </div>
            <h2 className="font-display text-2xl font-700 text-gray-900 dark:text-white mb-2">Pesanan Dibuat!</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">ID Pesanan: <span className="font-mono font-medium text-brand-500">TF-004</span></p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-8">Dana telah masuk ke escrow. Teknisi akan segera mengonfirmasi jadwal.</p>
            <div className="space-y-3">
              <Button className="w-full" onClick={() => navigate('/customer/orders')}>Lihat Pesanan</Button>
              <Button variant="outline" className="w-full" onClick={() => navigate('/customer')}>Kembali ke Beranda</Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// ── ORDERS / HISTORY ────────────────────────────────────────────
export function CustomerOrders() {
  const navigate = useNavigate()
  const [selected, setSelected] = useState(null)
  if (selected) {
    const o = orders.find(x => x.id === selected)
    return (
      <CustomerLayout activeTab="orders">
        <div className="py-6">
          <button onClick={() => setSelected(null)} className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 dark:hover:text-white mb-4"><ArrowLeft size={16} />Kembali</button>
          <h1 className="font-display text-xl font-700 text-gray-900 dark:text-white mb-4">Detail Pesanan</h1>
          <Card className="p-5 mb-4">
            <div className="flex items-center justify-between mb-3">
              <span className="font-mono text-sm text-brand-500">{o.id}</span>
              <EscrowStatus status={o.escrow} />
            </div>
            <p className="font-semibold text-gray-900 dark:text-white">{o.service}</p>
            <p className="text-sm text-gray-500 mt-1">Teknisi: {o.technician}</p>
            <p className="text-sm text-gray-500">Tanggal: {o.date}</p>
            <div className="border-t border-gray-100 dark:border-gray-800 mt-3 pt-3">
              <div className="flex justify-between text-sm"><span className="text-gray-500">Total</span><span className="font-semibold text-gray-900 dark:text-white">Rp{o.price.toLocaleString('id')}</span></div>
            </div>
          </Card>
          {/* Escrow timeline */}
          <Card className="p-5 mb-4">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Status Escrow</h3>
            <div className="space-y-3">
              {[
                { label: 'Pembayaran diterima', done: true },
                { label: 'Teknisi mengonfirmasi', done: true },
                { label: 'Servis berlangsung', done: o.escrow !== 'waiting' },
                { label: 'Menunggu konfirmasimu', done: o.escrow === 'done' },
                { label: 'Dana diteruskan ke teknisi', done: o.escrow === 'done' },
              ].map((s, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${s.done ? 'bg-green-500' : 'bg-gray-200 dark:bg-gray-700'}`}>
                    {s.done && <CheckCircle size={12} className="text-white" />}
                  </div>
                  <span className={`text-sm ${s.done ? 'text-gray-900 dark:text-white' : 'text-gray-400 dark:text-gray-600'}`}>{s.label}</span>
                </div>
              ))}
            </div>
          </Card>
          {o.escrow === 'progress' && (
            <div className="space-y-2">
              <Button className="w-full" variant="teal" onClick={() => setSelected(null)}>✅ Konfirmasi Servis Selesai</Button>
              <button onClick={() => navigate(`/customer/dispute/${o.id}`)}
                className="w-full py-2.5 rounded-xl text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 font-medium transition-colors border border-red-200 dark:border-red-900">
                ⚠️ Ada masalah? Ajukan sengketa
              </button>
            </div>
          )}
          {o.escrow === 'waiting' && (
            <button onClick={() => navigate(`/customer/dispute/${o.id}`)}
              className="w-full py-2.5 rounded-xl text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 font-medium transition-colors border border-red-200 dark:border-red-900">
              ⚠️ Laporkan masalah
            </button>
          )}
        </div>
      </CustomerLayout>
    )
  }
  return (
    <CustomerLayout activeTab="orders">
      <div className="py-6">
        <h1 className="font-display text-2xl font-700 text-gray-900 dark:text-white mb-6">Pesanan Saya</h1>
        <div className="space-y-3">
          {orders.map(o => (
            <Card key={o.id} hover className="p-5" onClick={() => setSelected(o.id)}>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="font-semibold text-gray-900 dark:text-white text-sm">{o.service}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{o.technician} · {o.date}</p>
                  <div className="mt-2"><EscrowStatus status={o.escrow} /></div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900 dark:text-white text-sm">Rp{o.price.toLocaleString('id')}</p>
                  <ChevronRight size={16} className="text-gray-400 ml-auto mt-1" />
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </CustomerLayout>
  )
}

// ── SUBSCRIPTION ────────────────────────────────────────────────
export function CustomerSubscription() {
  const navigate = useNavigate()
  const existing = getSubscription()
  const [selected, setSelected] = useState(existing?.id || 'premium')
  const [subscribed, setSubscribed] = useState(!!existing)

  function handleSubscribe() {
    const plan = maintenancePlans.find(p => p.id === selected)
    saveSubscription(plan)
    setSubscribed(true)
  }
  return (
    <CustomerLayout activeTab="sub">
      <div className="py-6">
        <h1 className="font-display text-2xl font-700 text-gray-900 dark:text-white mb-2">Langganan Maintenance</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">Perawatan rutin perangkat kamu, mulai Rp20.000/bulan</p>
        <div className="space-y-4">
          {maintenancePlans.map(plan => (
            <div key={plan.id} onClick={() => setSelected(plan.id)}
              className={`p-5 rounded-2xl border-2 cursor-pointer transition-all ${selected === plan.id ? 'border-brand-500 bg-brand-50 dark:bg-brand-900/20' : 'border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900'}`}>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${selected === plan.id ? 'border-brand-500' : 'border-gray-300 dark:border-gray-600'}`}>
                    {selected === plan.id && <div className="w-2.5 h-2.5 rounded-full bg-brand-500" />}
                  </div>
                  <span className="font-display font-700 text-gray-900 dark:text-white">{plan.name}</span>
                  {plan.id === 'premium' && <Badge color="blue">Populer</Badge>}
                </div>
                <div className="text-right">
                  <span className="font-display font-700 text-gray-900 dark:text-white">Rp{plan.price.toLocaleString('id')}</span>
                  <span className="text-xs text-gray-400">/bln</span>
                </div>
              </div>
              <p className="text-xs text-gray-500 mb-2">{plan.devices === 99 ? 'Unlimited devices' : `${plan.devices} perangkat`}</p>
              <div className="space-y-1">
                {plan.features.map(f => (
                  <div key={f} className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
                    <CheckCircle size={12} className="text-green-500 flex-shrink-0" />
                    {f}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
        <Button className="w-full mt-6" size="lg" onClick={handleSubscribe}>
          {subscribed ? `✅ Aktif – Paket ${maintenancePlans.find(p=>p.id===selected)?.name}` : `Mulai Langganan ${maintenancePlans.find(p=>p.id===selected)?.name}`}
        </Button>
        {subscribed && <p className="text-center text-xs text-green-600 dark:text-green-400 mt-2">Langganan tersimpan di perangkat ini</p>}
      </div>
    </CustomerLayout>
  )
}

// ── SETTINGS ────────────────────────────────────────────────────
export function CustomerSettings() {
  const navigate = useNavigate()
  return (
    <CustomerLayout activeTab="settings">
      <div className="py-6">
        <h1 className="font-display text-2xl font-700 text-gray-900 dark:text-white mb-6">Akun Saya</h1>
        <Card className="p-5 mb-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center text-white font-display text-2xl font-700">H</div>
            <div>
              <p className="font-semibold text-gray-900 dark:text-white">Muhammad Hashfi</p>
              <p className="text-sm text-gray-500">hashfi@email.com</p>
              <Badge color="green" className="mt-1">Akun Aktif</Badge>
            </div>
          </div>
        </Card>
        <Card className="overflow-hidden mb-4">
          {[
            { icon: History,    label: 'Riwayat Servis',    path: '/customer/orders' },
            { icon: RefreshCw,  label: 'Kelola Langganan',  path: '/customer/subscription' },
            { icon: Star,       label: 'Poin & Reward',     path: '/customer/loyalty' },
            { icon: CreditCard, label: 'Metode Pembayaran', path: '/customer/payment-methods' },
            { icon: Bell,       label: 'Notifikasi',        path: '/customer/notif-settings' },
            { icon: Settings,   label: 'Pengaturan Akun',   path: '/customer/account' },
          ].map((item, i, arr) => (
            <button key={item.label} onClick={() => item.path !== '#' && navigate(item.path)}
              className={`w-full flex items-center gap-3 px-5 py-3.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors ${i < arr.length-1 ? 'border-b border-gray-100 dark:border-gray-800' : ''}`}
            onClick={() => navigate(item.path)}>
              <item.icon size={16} className="text-gray-400" />
              <span className="flex-1 text-left">{item.label}</span>
              <ChevronRight size={14} className="text-gray-300" />
            </button>
          ))}
        </Card>
        <button onClick={() => navigate('/')} className="w-full flex items-center justify-center gap-2 py-3 text-sm text-red-500 font-medium">
          <LogOut size={16} /> Keluar
        </button>
      </div>
    </CustomerLayout>
  )
}
