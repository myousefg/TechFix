import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { Home, Package, TrendingUp, Star, Settings, LogOut, CheckCircle, ChevronRight, ArrowLeft, Upload, Camera, DollarSign, Clock, Search } from 'lucide-react'
import { Card, Badge, Button, Input, EscrowStatus, StatCard, EmptyState } from '../../components/UI'
import { TechnicianOrderDetail } from '../../components/TechnicianOrderDetail'
import { getOrders, updateOrder, saveSession, loadSession, removeSession, getTechnicianProfile, saveTechnicianProfile, getCurrentTechnicianId, getCurrentTechnician, getOrdersByTechId, getTechnicianEarnings, getKYCRequests, submitKYC, getSubscription, saveSubscription, requestWithdrawal, load } from '../../store'
import { WithdrawModal, UpgradePremiumModal, KYCSubmissionModal } from '../../components/TechnicianModals'

function TechLayout({ children, activeTab }) {
  const navigate = useNavigate()
  const tabs = [
    { id: 'dashboard', icon: Home,       label: 'Dashboard', path: '/technician' },
    { id: 'orders',    icon: Package,    label: 'Order',     path: '/technician/orders' },
    { id: 'earnings',  icon: TrendingUp, label: 'Penghasilan',path: '/technician/earnings' },
    { id: 'settings',  icon: Settings,   label: 'Akun',      path: '/technician/settings' },
  ]
  return (
    <div className="pt-16 min-h-screen bg-gray-50 dark:bg-gray-950">
      <div className="max-w-2xl mx-auto px-4 pb-24">{children}</div>
      <nav className="fixed bottom-0 inset-x-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 z-40 pb-[env(safe-area-inset-bottom)]">
        <div className="max-w-2xl mx-auto flex">
          {tabs.map(t => (
            <button key={t.id} onClick={() => navigate(t.path)}
              className={`flex-1 flex flex-col items-center py-3 gap-1 text-xs transition-colors ${activeTab === t.id ? 'text-accent-500' : 'text-gray-500 dark:text-gray-400'}`}>
              <t.icon size={20} />
              {t.label}
            </button>
          ))}
        </div>
      </nav>
    </div>
  )
}

// ── REGISTER ────────────────────────────────────────────────────
export function TechnicianRegister() {
  const navigate = useNavigate()
  const [step, setStep] = useState(loadSession('tech_reg_step', 1))
  const [form, setForm] = useState(loadSession('tech_reg_form', { name: '', email: '', phone: '', password: '', specialties: [], otherSpecialty: '', ktp: '' }))

  function update(key, value) {
    const next = { ...form, [key]: value }
    setForm(next)
    saveSession('tech_reg_form', next)
  }
  function toggleSpecialty(s) {
    const next = form.specialties.includes(s) ? form.specialties.filter(x => x !== s) : [...form.specialties, s]
    update('specialties', next)
  }
  function goToStep(n) {
    setStep(n)
    saveSession('tech_reg_step', n)
  }
  function handleSubmitKYC() {
    saveTechnicianProfile({ name: form.name, kycStatus: 'pending' })
    if (form.name && form.ktp) {
      submitKYC({
        techId: Date.now(),
        techName: form.name,
        specialty: form.specialties?.[0] || 'General',
        ktpNumber: form.ktp,
        ktpPhotoUrl: 'https://placehold.co/400x250/3b82f6/white?text=KTP',
        selfiePhotoUrl: 'https://placehold.co/300x300/10b981/white?text=Selfie',
        docs: ['KTP'],
      })
    }
    goToStep(4)
  }
  function handleFinish() {
    removeSession('tech_reg_step')
    removeSession('tech_reg_form')
    navigate('/technician')
  }
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center px-4">
      <Card className="w-full max-w-md p-8">
        <div className="flex gap-2 mb-8">
          {[1,2,3,4].map(i => <div key={i} className={`h-1.5 flex-1 rounded-full ${i <= step ? 'bg-accent-500' : 'bg-gray-200 dark:bg-gray-700'}`} />)}
        </div>
        {step === 1 && (
          <>
            <button onClick={() => navigate('/')} className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 dark:hover:text-white mb-4">
              <ArrowLeft size={16} />Kembali
            </button>
            <h2 className="font-display text-2xl font-700 text-gray-900 dark:text-white mb-2">Daftar Teknisi</h2>
            <p className="text-sm text-gray-500 mb-6">Bergabung dengan ratusan teknisi mitra TechFix</p>
            <div className="space-y-4">
              <Input label="Nama Lengkap" placeholder="Nama lengkap sesuai KTP" value={form.name} onChange={e => update('name', e.target.value)} />
              <Input label="Email" type="email" placeholder="email@example.com" value={form.email} onChange={e => update('email', e.target.value)} />
              <Input label="No. WhatsApp Aktif" placeholder="+62 812 xxxx xxxx" value={form.phone} onChange={e => update('phone', e.target.value)} />
              <Input label="Password" type="password" placeholder="Minimal 8 karakter" value={form.password} onChange={e => update('password', e.target.value)} />
            </div>
            <Button variant="teal" className="w-full mt-6" onClick={() => goToStep(2)}>Lanjut</Button>
            <p className="text-center text-sm text-gray-500 mt-4">Sudah punya akun? <button onClick={() => navigate('/technician')} className="text-teal-500 font-medium">Masuk</button></p>
          </>
        )}
        {step === 2 && (
          <>
            <h2 className="font-display text-2xl font-700 text-gray-900 dark:text-white mb-2">Keahlian & Spesialisasi</h2>
            <p className="text-sm text-gray-500 mb-5">Pilih layanan yang kamu kuasai</p>
            <div className="space-y-3">
              {['Servis Laptop & PC','Rakit PC Custom','Thermal Repaste','Recovery Data','Jaringan & IT Support','Upgrade Hardware','Konsol Gaming'].map(s => (
                <label key={s} className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" checked={form.specialties.includes(s)} onChange={() => toggleSpecialty(s)} className="accent-teal-500 w-4 h-4" />
                  <span className="text-sm text-gray-700 dark:text-gray-300">{s}</span>
                </label>
              ))}
              <Input label="Spesialisasi lain (opsional)" placeholder="Tuliskan keahlian lain..." value={form.otherSpecialty} onChange={e => update('otherSpecialty', e.target.value)} />
            </div>
            <div className="flex gap-3 mt-6">
              <Button variant="outline" className="flex-1" onClick={() => goToStep(1)}>Kembali</Button>
              <Button variant="teal" className="flex-1" onClick={() => goToStep(3)}>Lanjut</Button>
            </div>
          </>
        )}
        {step === 3 && (
          <>
            <h2 className="font-display text-2xl font-700 text-gray-900 dark:text-white mb-2">Verifikasi Identitas (KYC)</h2>
            <p className="text-sm text-gray-500 mb-5">Diperlukan agar pelanggan percaya padamu</p>
            <div className="space-y-4">
              <Input label="Nomor KTP" placeholder="3273xxxxxxxxxxxxxx" value={form.ktp} onChange={e => update('ktp', e.target.value)} />
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Foto KTP</label>
                <div className="border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-xl p-5 text-center cursor-pointer hover:border-teal-400 transition-colors">
                  <Upload size={20} className="mx-auto text-gray-400 mb-1" />
                  <p className="text-xs text-gray-400">Upload foto KTP</p>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Selfie dengan KTP</label>
                <div className="border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-xl p-5 text-center cursor-pointer hover:border-teal-400 transition-colors">
                  <Camera size={20} className="mx-auto text-gray-400 mb-1" />
                  <p className="text-xs text-gray-400">Foto selfie sambil pegang KTP</p>
                </div>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <Button variant="outline" className="flex-1" onClick={() => goToStep(2)}>Kembali</Button>
              <Button variant="teal" className="flex-1" onClick={handleSubmitKYC}>Submit KYC</Button>
            </div>
          </>
        )}
        {step === 4 && (
          <div className="text-center py-4">
            <div className="w-16 h-16 rounded-full bg-teal-100 dark:bg-teal-900/30 flex items-center justify-center mx-auto mb-4">
              <CheckCircle size={32} className="text-teal-500" />
            </div>
            <h2 className="font-display text-xl font-700 text-gray-900 dark:text-white mb-2">Pendaftaran Diterima!</h2>
            <p className="text-sm text-gray-500 mb-2">KYC kamu sedang diverifikasi tim TechFix (1-2 hari kerja).</p>
            <p className="text-sm text-gray-500 mb-8">Kamu akan mendapat notifikasi WhatsApp setelah disetujui.</p>
            <Button variant="teal" className="w-full" onClick={handleFinish}>Masuk ke Dashboard</Button>
          </div>
        )}
      </Card>
    </div>
  )
}

// ── DASHBOARD ───────────────────────────────────────────────────
export function TechnicianDashboard() {
  const navigate = useNavigate()
  const tech = getCurrentTechnician()
  const myOrders = getOrdersByTechId(tech.id)
  const earnings = getTechnicianEarnings(tech.id)

  const kycApps = getKYCRequests()
  const kycData = kycApps.find(k => k.techId === tech?.id || k.techName === tech?.name) || null
  const kycStatus = kycData ? kycData.status : null

  const pending = myOrders.filter(o => o.status === 'waiting' || o.status === 'progress')
  const profile = getTechnicianProfile()

  if (kycStatus === 'pending') {
    return (
      <TechLayout activeTab="dashboard">
        <div className="py-12 text-center">
          <div className="w-20 h-20 rounded-full bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center mx-auto mb-4">
            <Clock size={40} className="text-yellow-500" />
          </div>
          <h2 className="font-display text-xl font-700 text-gray-900 dark:text-white mb-2">Verifikasi Sedang Diproses</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">KYC kamu sedang diverifikasi tim TechFix.</p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">Estimasi 1-2 hari kerja. Kamu akan mendapat notifikasi WhatsApp setelah disetujui.</p>
          <Badge color="yellow">Status: Pending</Badge>
        </div>
      </TechLayout>
    )
  }

  return (
    <TechLayout activeTab="dashboard">
      <div className="py-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Selamat datang 👋</p>
            <h1 className="font-display text-2xl font-700 text-gray-900 dark:text-white">{profile?.name || 'Budi Santoso'}</h1>
          </div>
          <div className="flex items-center gap-2">
            <Badge color="green">Aktif</Badge>
            {kycStatus === 'approved' && <Badge color="teal">KYC ✓</Badge>}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-6">
          <StatCard label="Penghasilan Bulan Ini" value={`Rp${(earnings.thisMonth / 1000).toFixed(0)}rb`} sub={`${earnings.completed} order selesai`} icon={DollarSign} color="teal" />
          <StatCard label="Order Selesai" value={String(earnings.completed)} sub="Semua waktu" icon={CheckCircle} color="green" />
          <StatCard label="Order Aktif" value={String(pending.length)} sub="Menunggu tindakan" icon={Package} color="orange" />
          <StatCard label="Total Order" value={String(myOrders.length)} sub="Termasuk selesai" icon={Star} color="blue" />
        </div>

        <h2 className="font-semibold text-gray-900 dark:text-white mb-3">Order Aktif</h2>
        <div className="space-y-3 mb-6">
          {pending.length === 0 && (
            <EmptyState icon={Package} title="Belum ada order aktif" desc="Order baru akan muncul di sini" />
          )}
          {pending.map(o => (
            <Card key={o.id} hover className="p-4" onClick={() => navigate(`/technician/orders/${o.id}`)}>
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-medium text-gray-900 dark:text-white text-sm">{o.service}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{o.date}</p>
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

        <h2 className="font-semibold text-gray-900 dark:text-white mb-3">Paket Premium Listing</h2>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900 dark:text-white text-sm">Paket Basic</p>
              <p className="text-xs text-gray-500">Aktif hingga 30 Jun 2026</p>
            </div>
            <Button variant="outline" size="sm" onClick={() => navigate('/technician/settings')}>Upgrade</Button>
          </div>
        </Card>
      </div>
    </TechLayout>
  )
}

// ── ORDERS ──────────────────────────────────────────────────────
export function TechnicianOrders() {
  const navigate = useNavigate()
  const tech = getCurrentTechnician()
  const [orders] = useState(getOrdersByTechId(tech.id))
  const [filterStatus, setFilterStatus] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const filteredOrders = orders.filter(o => (filterStatus === 'all' || o.status === filterStatus) && (searchQuery === '' || o.service.toLowerCase().includes(searchQuery.toLowerCase()) || o.id.includes(searchQuery)))

  return (
    <TechLayout activeTab="orders">
      <div className="py-6">
        <h1 className="font-display text-2xl font-700 text-gray-900 dark:text-white mb-6">Manajemen Order</h1>
        <Card className="p-4 mb-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full sm:w-48 rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-accent-500 focus:ring-4 focus:ring-accent-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
            >
              <option value="all">Semua status</option>
              <option value="waiting">Menunggu</option>
              <option value="progress">Diproses</option>
              <option value="done">Selesai</option>
              <option value="rejected">Ditolak</option>
            </select>
            <div className="relative flex-1">
              <Search size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 z-10" />
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari nama layanan atau ID order"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-600 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
              />
            </div>
          </div>
        </Card>
        <div className="space-y-3">
          {filteredOrders.length === 0 && (
            <EmptyState icon={Package} title="Belum ada order" desc="Order yang masuk akan muncul di sini" />
          )}
          {filteredOrders.map(o => (
            <Card key={o.id} hover className="p-4" onClick={() => navigate(`/technician/orders/${o.id}`)}>
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-medium text-gray-900 dark:text-white text-sm">{o.service}</p>
                  <p className="text-xs text-gray-500 mt-0.5 font-mono">{o.id} · {o.date}</p>
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
    </TechLayout>
  )
}

// ── EARNINGS ────────────────────────────────────────────────────
export function TechnicianEarnings() {
  const tech = getCurrentTechnician()
  const earnings = getTechnicianEarnings(tech.id)

  const now = new Date()
  const recentMonths = []
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
    recentMonths.push(d.toLocaleString('id-ID', { month: 'short' }))
  }
  const monthMap = Object.fromEntries((earnings.byMonth || []).map(d => [d.month, d.amount]))
  const chartData = recentMonths.map(m => ({ month: m, amount: monthMap[m] || 0 }))
  const vals = chartData.map(d => d.amount / 1000)
  const maxVal = Math.max(...vals, 1)
  const [showWithdrawModal, setShowWithdrawModal] = useState(false)

  // Saldo: 90% dari total (10% komisi platform), minus sudah dicairkan sebelumnya (simulasi 60%)
  const saldoNetto = Math.round(earnings.total * 0.9)
  const [withdrawnExtra, setWithdrawnExtra] = useState(0)
  const baseWithdrawn = Math.round(saldoNetto * 0.6)
  const alreadyWithdrawn = baseWithdrawn + withdrawnExtra
  const availableBalance = saldoNetto - alreadyWithdrawn

  function handleWithdraw({ amount, method, accountNumber }) {
    requestWithdrawal(tech.id, amount, method, accountNumber)
    setWithdrawnExtra(prev => prev + Number(amount))
    toast.success(`✅ Pencairan Rp${Number(amount).toLocaleString('id')} ke ${method} berhasil diajukan! Diproses 1–2 hari kerja.`)
    setShowWithdrawModal(false)
  }
  
  return (
    <TechLayout activeTab="earnings">
      <div className="py-6">
        <h1 className="font-display text-2xl font-700 text-gray-900 dark:text-white mb-6">Penghasilan</h1>
        <div className="grid grid-cols-2 gap-3 mb-6">
          <StatCard label="Bulan Ini" value={earnings.thisMonth > 0 ? `Rp${(earnings.thisMonth / 1000).toFixed(0)}rb` : 'Rp0'} sub={`${earnings.completed} order selesai`} icon={DollarSign} color="teal" />
          <StatCard label="Total 2026" value={earnings.total >= 1000000 ? `Rp${(earnings.total / 1000000).toFixed(1).replace('.0','')}jt` : `Rp${(earnings.total / 1000).toFixed(0)}rb`} sub={`${earnings.completed} order`} icon={TrendingUp} color="green" />
        </div>

        <Card className="p-5 mb-4">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Tren Penghasilan (6 Bulan)</h3>
          <p className="text-xs text-gray-400 mb-4">dalam ribuan Rp</p>
          {vals.every(v => v === 0) ? (
            <div className="flex items-center justify-center h-32 text-gray-400 text-sm">Belum ada data penghasilan</div>
          ) : (
            <div className="flex items-end gap-2 h-32">
              {chartData.map((d, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-1">
                  <div
                    className={`w-full rounded-t-lg transition-all ${vals[i] > 0 ? 'bg-teal-500 dark:bg-teal-400' : 'bg-gray-200 dark:bg-gray-700'}`}
                    style={{ height: `${Math.max(vals[i] > 0 ? (vals[i] / maxVal) * 100 : 4, 4)}%` }}
                    title={`Rp${d.amount.toLocaleString('id')}`}
                  />
                  <span className={`text-xs ${d.month === recentMonths[5] ? 'text-teal-500 font-semibold' : 'text-gray-400'}`}>{d.month}</span>
                </div>
              ))}
            </div>
          )}
          <div className="flex justify-between mt-3 pt-3 border-t border-gray-100 dark:border-gray-800 text-xs text-gray-500">
            <span>Rata-rata: Rp{earnings.completed > 0 ? Math.round(earnings.total / earnings.completed).toLocaleString('id') : 0}/order</span>
            <span>{earnings.completed} order selesai</span>
          </div>
        </Card>

        <Card className="p-5">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Pencairan Dana</h3>
          <p className="text-xs text-gray-400 mb-4">Setelah dipotong komisi platform 10%</p>
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="p-3 rounded-xl bg-teal-50 dark:bg-teal-900/20">
              <p className="text-xs text-teal-600 dark:text-teal-400">Saldo Tersedia</p>
              <p className="text-xl font-display font-700 text-teal-700 dark:text-teal-300">Rp{availableBalance.toLocaleString('id')}</p>
            </div>
            <div className="p-3 rounded-xl bg-gray-50 dark:bg-gray-800">
              <p className="text-xs text-gray-500">Sudah Dicairkan</p>
              <p className="text-xl font-display font-700 text-gray-700 dark:text-gray-300">Rp{alreadyWithdrawn.toLocaleString('id')}</p>
            </div>
          </div>
          <div className="space-y-2 mb-4">
            <p className="text-xs text-gray-500 font-medium">Metode Pencairan</p>
            {[
              { m: 'Transfer Bank (BCA - •••• 1234)', icon: '🏦' },
              { m: 'OVO (+62 812 •••• 0079)', icon: '💜' },
            ].map((x, idx) => (
              <label key={x.m} className="flex items-center gap-3 cursor-pointer p-3 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-teal-400 transition-colors">
                <input type="radio" name="withdraw" defaultChecked={idx === 0} className="accent-teal-500" />
                <span className="text-sm text-gray-700 dark:text-gray-300">{x.icon} {x.m}</span>
              </label>
            ))}
          </div>
          <Button 
            variant="teal" 
            className="w-full" 
            onClick={() => availableBalance > 0 ? setShowWithdrawModal(true) : toast.error('Saldo tidak mencukupi')}
          >
            Cairkan Dana
          </Button>
        </Card>
      </div>
      <WithdrawModal
        isOpen={showWithdrawModal}
        onClose={() => setShowWithdrawModal(false)}
        balance={Math.max(availableBalance, 0)}
        onSubmit={handleWithdraw}
      />
    </TechLayout>
  )
}

// ── SETTINGS ────────────────────────────────────────────────────
export function TechnicianSettings() {
  const navigate = useNavigate()
  const tech = getCurrentTechnician()
  const kycApps = getKYCRequests()
  const kycData = kycApps.find(k => k.techId === tech?.id || k.techName === tech?.name) || null
  const [showUpgradeModal, setShowUpgradeModal] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState(null)
  const [currentPlanId, setCurrentPlanId] = useState(() => {
    const sub = getSubscription()
    return sub?.id || 'basic'
  })
  const [showKYCModal, setShowKYCModal] = useState(false)
  const plans = [
    { id: 'basic', name: 'Basic', price: 50000, desc: 'Tampil di halaman pencarian' },
    { id: 'gold', name: 'Gold', price: 100000, desc: 'Prioritas di halaman depan', popular: true },
    { id: 'platinum', name: 'Platinum', price: 150000, desc: 'Top placement + badge premium' },
  ]
  
  const kycStatusConfig = {
    approved: { color: 'green', label: 'KYC Verified', action: null },
    pending: { color: 'yellow', label: 'KYC Pending Review', action: null },
    rejected: { color: 'red', label: 'KYC Rejected', action: 'Ajukan Ulang' },
    null: { color: 'gray', label: 'Belum Submit KYC', action: 'Submit KYC' }
  }
  const kycStatus = kycData ? kycData.status : null
  const kycConfig = kycStatusConfig[kycStatus]
  
  function handleUpgradeClick(plan) {
    setSelectedPlan(plan)
    setShowUpgradeModal(true)
  }
  
  function handleUpgradeConfirm() {
    if (selectedPlan) {
      setCurrentPlanId(selectedPlan.id)
      saveSubscription(selectedPlan)
      toast.success(`Upgrade ke ${selectedPlan.name} berhasil!`)
    }
    setShowUpgradeModal(false)
  }

  function handleKYCSubmit(data) {
    submitKYC({
      techId: tech.id,
      techName: tech.name,
      specialty: tech.specialty,
      ...data,
    })
    toast.success('KYC berhasil diajukan. Menunggu review admin.')
    setShowKYCModal(false)
  }
  
  return (
    <TechLayout activeTab="settings">
      <div className="py-6">
        <h1 className="font-display text-2xl font-700 text-gray-900 dark:text-white mb-6">Akun Teknisi</h1>
        <Card className="p-5 mb-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center text-white font-display text-2xl font-700">{tech.name.charAt(0)}</div>
            <div>
              <p className="font-semibold text-gray-900 dark:text-white">{tech.name}</p>
              <p className="text-sm text-gray-500">{tech.email || 'budi@email.com'}</p>
              <div className="flex gap-2 mt-1">
                <Badge color={kycConfig.color}>{kycConfig.label}</Badge>
                <Badge color="teal">Top Rated</Badge>
              </div>
              {kycConfig.action && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="mt-2" 
                  onClick={() => setShowKYCModal(true)}
                >
                  {kycConfig.action}
                </Button>
              )}
              {kycStatus === 'rejected' && kycData?.rejectionReason && (
                <p className="text-xs text-red-500 mt-1">Alasan ditolak: {kycData.rejectionReason}</p>
              )}
            </div>
          </div>
        </Card>

        <h2 className="font-semibold text-gray-900 dark:text-white mb-3">Premium Listing</h2>
        <div className="space-y-3 mb-6">
          {plans.map(p => {
            const isActive = p.id === currentPlanId
            return (
              <div key={p.id} className={`p-4 rounded-2xl border-2 ${isActive ? 'border-teal-500 bg-teal-50 dark:bg-teal-900/20' : 'border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900'}`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-gray-900 dark:text-white">{p.name}</p>
                    {p.popular && !isActive && <Badge color="orange">Populer</Badge>}
                    {isActive && <Badge color="teal">Aktif</Badge>}
                  </div>
                  <span className="font-display font-700 text-gray-900 dark:text-white">Rp{p.price.toLocaleString('id')}<span className="text-xs text-gray-400 font-normal">/bln</span></span>
                </div>
                <p className="text-xs text-gray-500 mt-1">{p.desc}</p>
                {!isActive && p.id !== 'basic' && <Button variant="outline" size="sm" className="mt-3 w-full" onClick={() => handleUpgradeClick(p)}>Upgrade ke {p.name}</Button>}
                {isActive && p.id !== 'basic' && (
                  <Button variant="outline" size="sm" className="mt-3 w-full text-red-500 border-red-200 hover:bg-red-50 dark:border-red-800 dark:hover:bg-red-900/20" onClick={() => {
                    setCurrentPlanId('basic')
                    saveSubscription({ id: 'basic', name: 'Basic', price: 50000 })
                    toast.success('Paket dikembalikan ke Basic')
                  }}>Batalkan & Kembali ke Basic</Button>
                )}
              </div>
            )
          })}
        </div>

        <button onClick={() => navigate('/')} className="w-full flex items-center justify-center gap-2 py-3 text-sm text-red-500 font-medium">
          <LogOut size={16} /> Keluar
        </button>
      </div>
      <UpgradePremiumModal
        isOpen={showUpgradeModal}
        onClose={() => setShowUpgradeModal(false)}
        currentPlan={plans.find(p => p.id === currentPlanId) || plans[0]}
        newPlan={selectedPlan}
        onConfirm={handleUpgradeConfirm}
      />
      <KYCSubmissionModal
        isOpen={showKYCModal}
        onClose={() => setShowKYCModal(false)}
        tech={tech}
        onSubmit={handleKYCSubmit}
        initialData={kycData}
      />
    </TechLayout>
  )
}
