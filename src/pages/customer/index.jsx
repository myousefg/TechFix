import React, { useState, useMemo, useRef, useEffect } from 'react'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import toast from 'react-hot-toast'
import { Search, MapPin, Shield, ArrowLeft, CheckCircle, Upload, CreditCard, ChevronRight, Bell, History, Settings, LogOut, Package, RefreshCw, CheckCheck, X } from 'lucide-react'
import { Card, Badge, StarRating, TechnicianCard, Button, Input, EscrowStatus, EmptyState } from '../../components/UI'
import { technicians, services, maintenancePlans } from '../../data'
import { getSubscription, saveSubscription, getOrders, addOrder, updateOrder, getAccountSettings, getNotifications, markNotifsRead, saveSession, loadSession, removeSession, remove, calculateDistance, getUserLocation, getCurrentCustomer, getOrdersByCustomerId } from '../../store'
import { PaymentConfirmationModal } from '../../components/CustomerModals'

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
      <nav className="fixed bottom-0 inset-x-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 z-40 pb-[env(safe-area-inset-bottom)]">
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
  const [step, setStep] = useState(loadSession('cust_reg_step', 1))
  const [form, setForm] = useState(loadSession('cust_reg_form', { name: '', email: '', phone: '', password: '', city: '', district: '', address: '' }))

  function update(key, value) {
    const next = { ...form, [key]: value }
    setForm(next)
    saveSession('cust_reg_form', next)
  }
  function goToStep(n) {
    setStep(n)
    saveSession('cust_reg_step', n)
  }
  function handleSuccess() {
    removeSession('cust_reg_step')
    removeSession('cust_reg_form')
    navigate('/customer')
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center px-4">
      <Card className="w-full max-w-md p-8">
        <div className="flex gap-2 mb-8">
          {[1,2,3].map(i => (
            <div key={i} className={`h-1.5 flex-1 rounded-full transition-colors ${i <= step ? 'bg-brand-500' : 'bg-gray-200 dark:bg-gray-700'}`} />
          ))}
        </div>
        {step === 1 && (
          <>
            <button onClick={() => navigate('/')} className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 dark:hover:text-white mb-4">
              <ArrowLeft size={16} />Kembali
            </button>
            <h2 className="font-display text-2xl font-700 text-gray-900 dark:text-white mb-2">Buat Akun</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">Daftar gratis, mulai cari teknisi terpercaya</p>
            <div className="space-y-4">
              <Input label="Nama Lengkap" placeholder="Masukkan nama lengkap" value={form.name} onChange={e => update('name', e.target.value)} />
              <Input label="Email" type="email" placeholder="email@example.com" value={form.email} onChange={e => update('email', e.target.value)} />
              <Input label="No. WhatsApp" placeholder="+62 812 xxxx xxxx" value={form.phone} onChange={e => update('phone', e.target.value)} />
              <Input label="Password" type="password" placeholder="Minimal 8 karakter" value={form.password} onChange={e => update('password', e.target.value)} />
            </div>
            <Button className="w-full mt-6" onClick={() => goToStep(2)}>Lanjut</Button>
            <p className="text-center text-sm text-gray-500 mt-4">Sudah punya akun? <button onClick={() => navigate('/customer')} className="text-brand-500 font-medium">Masuk</button></p>
          </>
        )}
        {step === 2 && (
          <>
            <h2 className="font-display text-2xl font-700 text-gray-900 dark:text-white mb-2">Lokasi Kamu</h2>
            <p className="text-sm text-gray-500 mb-6">Kami gunakan untuk menampilkan teknisi terdekat</p>
            <div className="space-y-4">
              <Input label="Kota" placeholder="Bandung" value={form.city} onChange={e => update('city', e.target.value)} />
              <Input label="Kecamatan" placeholder="Coblong" value={form.district} onChange={e => update('district', e.target.value)} />
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Alamat Lengkap</label>
                <textarea value={form.address} onChange={e => update('address', e.target.value)} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 text-gray-900 dark:text-white" rows={3} placeholder="Jl. Ganesha No. 10..." />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <Button variant="outline" onClick={() => goToStep(1)} className="flex-1">Kembali</Button>
              <Button onClick={() => goToStep(3)} className="flex-1">Lanjut</Button>
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
              <Button className="w-full" onClick={handleSuccess}>Mulai Explore</Button>
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
  const [searchParams] = useSearchParams()
  const account = getAccountSettings()
  const [query, setQuery] = useState(searchParams.get('service') || '')
  const [filter, setFilter] = useState('Semua')
  const [notifOpen, setNotifOpen] = useState(false)
  const [notifs, setNotifs] = useState(getNotifications)
  const notifRef = useRef(null)
  const filters = ['Semua', 'Terdekat', 'Rating Tertinggi', 'Harga Terendah', 'Terverifikasi']

  useEffect(() => {
    function handleClick(e) {
      if (notifRef.current && !notifRef.current.contains(e.target)) setNotifOpen(false)
    }
    if (notifOpen) document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [notifOpen])

  const notifIcons = { order: Package, escrow: Shield, promo: Bell, system: Bell }
  const notifColors = { order: 'text-brand-500', escrow: 'text-green-500', promo: 'text-orange-500', system: 'text-gray-500' }
  const unread = notifs.filter(n => !n.read).length

  function markAllRead() {
    const updated = notifs.map(n => ({ ...n, read: true }))
    setNotifs(updated)
    markNotifsRead(updated)
  }

  const filtered = useMemo(() => {
    let list = technicians.filter(t =>
      query === '' || t.name.toLowerCase().includes(query.toLowerCase()) || t.specialty.toLowerCase().includes(query.toLowerCase())
    )
    switch (filter) {
      case 'Rating Tertinggi':  list = [...list].sort((a, b) => b.rating - a.rating); break
      case 'Harga Terendah':    list = [...list].sort((a, b) => a.price - b.price); break
      case 'Terverifikasi':     list = list.filter(t => t.verified); break
      case 'Terdekat': {
        const userLoc = getUserLocation()
        list = [...list].sort((a, b) => {
          const da = a.coords ? calculateDistance(userLoc, a.coords) : Infinity
          const db = b.coords ? calculateDistance(userLoc, b.coords) : Infinity
          return da - db
        })
        break
      }
      default: break
    }
    return list
  }, [query, filter])
  return (
    <CustomerLayout activeTab="home">
      <div className="py-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Halo, {account.name.split(' ')[0]} 👋</p>
            <h1 className="font-display text-2xl font-700 text-gray-900 dark:text-white">Butuh servis apa?</h1>
          </div>
          <div className="relative" ref={notifRef}>
            <button onClick={() => setNotifOpen(o => !o)} className="relative p-2 rounded-xl text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-800">
              <Bell size={20} />
              {unread > 0 && <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />}
            </button>
            {notifOpen && (
              <div className="absolute right-0 top-12 w-80 z-50 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-xl overflow-hidden">
                <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 dark:border-gray-800">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-sm text-gray-900 dark:text-white">Notifikasi</span>
                    {unread > 0 && <Badge color="blue">{unread} baru</Badge>}
                  </div>
                  <div className="flex items-center gap-1">
                    {unread > 0 && <button onClick={markAllRead} className="text-xs text-brand-500 hover:text-brand-600 font-medium px-2 py-1"><CheckCheck size={13} /></button>}
                    <button onClick={() => setNotifOpen(false)} className="text-gray-400 hover:text-gray-600 p-1"><X size={14} /></button>
                  </div>
                </div>
                <div className="max-h-72 overflow-y-auto">
                  {notifs.map(n => {
                    const Icon = notifIcons[n.type] || Bell
                    return (
                      <div key={n.id} className={`px-4 py-3 flex items-start gap-3 border-b border-gray-50 dark:border-gray-800/50 last:border-0 ${!n.read ? 'bg-brand-50/50 dark:bg-brand-900/10' : ''}`}>
                        <Icon size={14} className={`${notifColors[n.type] || 'text-gray-500'} mt-0.5 flex-shrink-0`} />
                        <div className="flex-1 min-w-0">
                          <p className={`text-xs font-medium ${!n.read ? 'text-gray-900 dark:text-white' : 'text-gray-600 dark:text-gray-400'}`}>{n.title}</p>
                          <p className="text-xs text-gray-400 mt-0.5 truncate">{n.body}</p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Search */}
        <div className="relative mb-4">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input value={query} onChange={e => setQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 text-gray-900 dark:text-white placeholder-gray-400"
            placeholder="Cari teknisi atau layanan..." />
        </div>

        {/* Service categories */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          {services.slice(0,6).map(s => (
            <button key={s.id} onClick={() => setQuery(s.label)}
              className="p-3 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 hover:border-brand-300 dark:hover:border-brand-700 text-center transition-all">
              <div className="text-xl mb-1">{s.icon}</div>
              <p className="text-xs font-medium text-gray-700 dark:text-gray-300 leading-tight">{s.label}</p>
            </button>
          ))}
        </div>

        {/* Filter chips */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-4 scrollbar-none">
          {filters.map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${filter === f ? 'bg-brand-500 text-white' : 'bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400'}`}>
              {f}
            </button>
          ))}
        </div>

        {/* Results */}
        <div className="space-y-3">
          <p className="text-xs text-gray-400 dark:text-gray-500 font-medium">{filtered.length} teknisi ditemukan</p>
          {filtered.map(t => (
            <TechnicianCard key={t.id} {...t} onClick={() => navigate(`/customer/technician/${t.id}`)} />
          ))}
        </div>
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
  const persisted = loadSession('booking_form', { selectedService: services[0].label, device: '', description: '', schedule: '', selectedPayment: '' })
  const [step, setStep] = useState(1)
  const [selectedService, setSelectedService] = useState(persisted.selectedService)
  const [device, setDevice] = useState(persisted.device)
  const [description, setDescription] = useState(persisted.description)
  const [schedule, setSchedule] = useState(persisted.schedule)
  const [selectedPayment, setSelectedPayment] = useState(persisted.selectedPayment)
  const [orderId, setOrderId] = useState(null)
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [paymentConfirmed, setPaymentConfirmed] = useState(false)

  useEffect(() => {
    saveSession('booking_form', { selectedService, device, description, schedule, selectedPayment })
  }, [selectedService, device, description, schedule, selectedPayment])

  function goToStep(n) {
    if (n === 2 && (!device || !description || !schedule)) {
      toast.error('Lengkapi perangkat, deskripsi, dan jadwal terlebih dahulu')
      return
    }
    if (n === 3 && !selectedPayment) {
      toast.error('Pilih metode pembayaran terlebih dahulu')
      return
    }
    setStep(n)
  }

  function handlePaymentConfirm() {
    const existing = getOrders()
    const newId = 'TF-' + String(existing.length + 1).padStart(3, '0')
    const me = getCurrentCustomer()
    addOrder({
      id: newId,
      customerId: me?.id || 1,
      customer: me?.name || 'Muhammad Hashfi',
      techId: tech.id,
      tech: tech.name,
      service: selectedService,
      date: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }),
      status: 'waiting',
      amount: tech.price,
      escrow: 'waiting',
    })
    setOrderId(newId)
    setPaymentConfirmed(true)
    setShowPaymentModal(false)
    removeSession('booking_form')
    setStep(3)
  }

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
                <select value={selectedService} onChange={e => setSelectedService(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 text-gray-900 dark:text-white">
                  {services.map(s => <option key={s.id}>{s.label}</option>)}
                </select>
              </div>
              <Input label="Merek & Model Perangkat" placeholder="Contoh: ASUS ROG Zephyrus G14" value={device} onChange={e => setDevice(e.target.value)} />
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Deskripsi Masalah</label>
                <textarea value={description} onChange={e => setDescription(e.target.value)} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 text-gray-900 dark:text-white" rows={4} placeholder="Ceritakan detail masalah perangkat kamu..." />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Foto Perangkat (opsional)</label>
                <div className="border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-xl p-6 text-center cursor-pointer hover:border-brand-300 dark:hover:border-brand-600 transition-colors">
                  <Upload size={20} className="mx-auto text-gray-400 mb-2" />
                  <p className="text-sm text-gray-400">Tap untuk upload foto</p>
                </div>
              </div>
              <Input label="Jadwal Servis" type="date" value={schedule} onChange={e => setSchedule(e.target.value)} />
              <div className="bg-brand-50 dark:bg-brand-900/20 rounded-xl p-4 border border-brand-100 dark:border-brand-800">
                <p className="text-xs text-brand-600 dark:text-brand-400 mb-1">Estimasi Biaya</p>
                <p className="font-display text-2xl font-700 text-gray-900 dark:text-white">Rp{tech.price.toLocaleString('id')}</p>
                <p className="text-xs text-gray-500 mt-1">Harga bisa berubah sesuai kompleksitas masalah</p>
              </div>
            </div>
            <Button className="w-full mt-6" onClick={() => goToStep(2)}>Lanjut ke Pembayaran</Button>
          </Card>
        )}

        {step === 2 && (
          <Card className="p-6">
            <h2 className="font-display text-xl font-700 text-gray-900 dark:text-white mb-5">Ringkasan & Pembayaran</h2>
            <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 mb-5 space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-gray-500">Teknisi</span><span className="font-medium text-gray-900 dark:text-white">{tech.name}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Layanan</span><span className="font-medium text-gray-900 dark:text-white">{selectedService}</span></div>
              {device && <div className="flex justify-between"><span className="text-gray-500">Perangkat</span><span className="font-medium text-gray-900 dark:text-white">{device}</span></div>}
              {schedule && <div className="flex justify-between"><span className="text-gray-500">Jadwal</span><span className="font-medium text-gray-900 dark:text-white">{schedule}</span></div>}
              <div className="flex justify-between"><span className="text-gray-500">Estimasi biaya</span><span className="font-medium text-gray-900 dark:text-white">Rp{tech.price.toLocaleString('id')}</span></div>
              <div className="border-t border-gray-200 dark:border-gray-700 pt-2 flex justify-between font-semibold"><span>Total Escrow</span><span className="text-brand-500">Rp{tech.price.toLocaleString('id')}</span></div>
            </div>
            <p className="text-xs text-gray-400 bg-brand-50 dark:bg-brand-900/20 text-brand-700 dark:text-brand-300 rounded-xl p-3 mb-5">
              Dana akan ditahan di escrow TechFix hingga kamu konfirmasi puas. Garansi uang kembali jika servis gagal.
            </p>
            <h3 className="font-semibold text-sm text-gray-700 dark:text-gray-300 mb-3">Pilih Metode Pembayaran</h3>
            <div className="space-y-2 mb-5">
              {[{icon:'💳', label:'Transfer Bank (Virtual Account)', sub:'BCA, Mandiri, BNI, BRI'},
                {icon:'📱', label:'E-Wallet', sub:'GoPay, OVO, DANA, ShopeePay'},
                {icon:'📲', label:'QRIS', sub:'Scan & bayar dari aplikasi apapun'},
                {icon:'💸', label:'PayLater / Cicilan', sub:'GoPay Later, Kredivo'}].map(m => (
                <label key={m.label} onClick={() => setSelectedPayment(m.label)}
                  className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${selectedPayment === m.label ? 'border-brand-500 bg-brand-50 dark:bg-brand-900/20' : 'border-gray-200 dark:border-gray-700 hover:border-brand-300 dark:hover:border-brand-700'}`}>
                  <input type="radio" name="payment" checked={selectedPayment === m.label} onChange={() => setSelectedPayment(m.label)} className="accent-brand-500" />
                  <span className="text-xl">{m.icon}</span>
                  <div><p className="text-sm font-medium text-gray-900 dark:text-white">{m.label}</p><p className="text-xs text-gray-400">{m.sub}</p></div>
                </label>
              ))}
            </div>
            <Button className="w-full" onClick={() => setShowPaymentModal(true)} disabled={!selectedPayment}>Bayar & Konfirmasi Pesanan</Button>
            <PaymentConfirmationModal
              isOpen={showPaymentModal}
              onClose={() => setShowPaymentModal(false)}
              order={{
                id: 'PREVIEW',
                service: selectedService,
                tech: tech.name,
                amount: tech.price,
              }}
              method={selectedPayment}
              onConfirm={handlePaymentConfirm}
            />
          </Card>
        )}

        {step === 3 && (
          <div className="text-center py-8">
            <div className="w-20 h-20 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mx-auto mb-4">
              <CheckCircle size={40} className="text-green-500" />
            </div>
            <h2 className="font-display text-2xl font-700 text-gray-900 dark:text-white mb-2">Pesanan Dibuat!</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">ID Pesanan: <span className="font-mono font-medium text-brand-500">{orderId}</span></p>
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
  const customer = getCurrentCustomer()
  const [orders, setOrders] = useState(getOrdersByCustomerId(customer.id))
  const [filterStatus, setFilterStatus] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const filteredOrders = orders.filter(o => (filterStatus === 'all' || o.status === filterStatus) && (searchQuery === '' || o.service.toLowerCase().includes(searchQuery.toLowerCase()) || o.id.includes(searchQuery)))

  return (
    <CustomerLayout activeTab="orders">
      <div className="py-6">
        <h1 className="font-display text-2xl font-700 text-gray-900 dark:text-white mb-6">Pesanan Saya</h1>
        <Card className="p-4 mb-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full sm:w-48 rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
            >
              <option value="all">Semua status</option>
              <option value="waiting">Menunggu</option>
              <option value="progress">Diproses</option>
              <option value="done">Selesai</option>
            </select>
            <div className="relative flex-1">
              <Search size={16} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari nama layanan atau ID order"
                className="pl-10"
              />
            </div>
          </div>
        </Card>
        <div className="space-y-3">
          {filteredOrders.length === 0 && (
            <EmptyState icon={Package} title="Belum ada pesanan" desc="Mulai cari teknisi dan buat pesanan pertamamu" />
          )}
          {filteredOrders.map(o => (
            <Card key={o.id} hover className="p-5" onClick={() => navigate(`/customer/orders/${o.id}`)}>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="font-semibold text-gray-900 dark:text-white text-sm">{o.service}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{o.tech} · {o.date}</p>
                  <div className="mt-2"><EscrowStatus status={o.escrow} /></div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-sm text-gray-900 dark:text-white">Rp{o.amount.toLocaleString('id')}</p>
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
  const [changingPlan, setChangingPlan] = useState(false)

  function handleSubscribe() {
    const plan = maintenancePlans.find(p => p.id === selected)
    saveSubscription(plan)
    setSubscribed(true)
    setChangingPlan(false)
    toast.success(`Paket ${plan.name} berhasil diaktifkan`)
  }
  function handleCancel() {
    if (window.confirm('Yakin ingin membatalkan langganan? Anda bisa berlangganan lagi kapan saja.')) {
      remove('subscription')
      setSubscribed(false)
      toast.success('Langganan berhasil dibatalkan')
    }
  }
  function startChange() {
    setChangingPlan(true)
  }
  return (
    <CustomerLayout activeTab="sub">
      <div className="py-6">
        <h1 className="font-display text-2xl font-700 text-gray-900 dark:text-white mb-2">Langganan Maintenance</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">Perawatan rutin perangkat kamu, mulai Rp20.000/bulan</p>
        {subscribed && !changingPlan && existing && (
          <Card className="p-5 mb-4 bg-teal-50 dark:bg-teal-900/20 border-2 border-teal-200 dark:border-teal-800">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-500">Paket Aktif</p>
              <Badge color="green">Aktif</Badge>
            </div>
            <p className="font-display text-xl font-700 text-gray-900 dark:text-white mb-1">{existing.name}</p>
            <p className="text-sm text-gray-500 mb-4">Rp{existing.price.toLocaleString('id')}/bulan</p>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="flex-1" onClick={startChange}>Ubah Paket</Button>
              <Button variant="outline" size="sm" className="flex-1 text-red-600 border-red-200 hover:bg-red-50" onClick={handleCancel}>Batalkan</Button>
            </div>
          </Card>
        )}
        {(!subscribed || changingPlan) && (
          <>
            <div className="space-y-4">
              {maintenancePlans.map(plan => (
                <div key={plan.id} onClick={() => setSelected(plan.id)}
                  className={`p-5 rounded-2xl border-2 cursor-pointer transition-all ${selected === plan.id ? 'border-brand-500 bg-brand-50 dark:bg-brand-900/20' : 'border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900'}`}>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${selected === plan.id ? 'border-brand-500' : 'border-gray-300'}`}>
                        {selected === plan.id && <div className="w-2.5 h-2.5 rounded-full bg-brand-500" />}
                      </div>
                      <p className="font-display font-700 text-gray-900 dark:text-white">{plan.name}</p>
                    </div>
                    <div>
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
            <div className="flex gap-2 mt-6">
              {changingPlan && (
                <Button variant="outline" className="flex-1" onClick={() => setChangingPlan(false)}>Batal</Button>
              )}
              <Button className="flex-1" size="lg" onClick={handleSubscribe}>
                {subscribed ? 'Simpan Perubahan' : `Mulai Langganan ${maintenancePlans.find(p=>p.id===selected)?.name}`}
              </Button>
            </div>
          </>
        )}
      </div>
    </CustomerLayout>
  )
}

// ── SETTINGS ────────────────────────────────────────────────────
export function CustomerSettings() {
  const navigate = useNavigate()
  const customer = getCurrentCustomer()
  return (
    <CustomerLayout activeTab="settings">
      <div className="py-6">
        <h1 className="font-display text-2xl font-700 text-gray-900 dark:text-white mb-6">Akun Saya</h1>
        <Card className="p-5 mb-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center text-white font-display text-2xl font-700">{customer.name.charAt(0)}</div>
            <div>
              <p className="font-semibold text-gray-900 dark:text-white">{customer.name}</p>
              <p className="text-sm text-gray-500">{customer.email}</p>
              <Badge color="green" className="mt-1">Akun Aktif</Badge>
            </div>
          </div>
        </Card>
        <Card className="overflow-hidden mb-4">
          <button onClick={() => navigate('/customer/account')}
            className="w-full flex items-center gap-3 px-5 py-3.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
            <Settings size={16} className="text-gray-400" />
            <span className="flex-1 text-left">Pengaturan Akun</span>
            <ChevronRight size={14} className="text-gray-300" />
          </button>
        </Card>
        <button onClick={() => navigate('/')} className="w-full flex items-center justify-center gap-2 py-3 text-sm text-red-500 font-medium">
          <LogOut size={16} /> Keluar
        </button>
      </div>
    </CustomerLayout>
  )
}
