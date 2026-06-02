import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Home, Package, TrendingUp, Star, Settings, LogOut, CheckCircle, Clock, ChevronRight, ArrowLeft, Upload, Camera, DollarSign, Users, Award } from 'lucide-react'
import { Card, Badge, Button, Input, EscrowStatus, StatCard } from '../../components/UI'
import { orders } from '../../data'

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
      <nav className="fixed bottom-0 inset-x-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 z-40">
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
  const [step, setStep] = useState(1)
  return (
    <div className="pt-16 min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center px-4">
      <Card className="w-full max-w-md p-8">
        <div className="flex gap-2 mb-8">
          {[1,2,3,4].map(i => <div key={i} className={`h-1.5 flex-1 rounded-full ${i <= step ? 'bg-accent-500' : 'bg-gray-200 dark:bg-gray-700'}`} />)}
        </div>
        {step === 1 && (
          <>
            <h2 className="font-display text-2xl font-700 text-gray-900 dark:text-white mb-2">Daftar Teknisi</h2>
            <p className="text-sm text-gray-500 mb-6">Bergabung dengan ratusan teknisi mitra TechFix</p>
            <div className="space-y-4">
              <Input label="Nama Lengkap" placeholder="Nama lengkap sesuai KTP" />
              <Input label="Email" type="email" placeholder="email@example.com" />
              <Input label="No. WhatsApp Aktif" placeholder="+62 812 xxxx xxxx" />
              <Input label="Password" type="password" placeholder="Minimal 8 karakter" />
            </div>
            <Button variant="teal" className="w-full mt-6" onClick={() => setStep(2)}>Lanjut</Button>
          </>
        )}
        {step === 2 && (
          <>
            <h2 className="font-display text-2xl font-700 text-gray-900 dark:text-white mb-2">Keahlian & Spesialisasi</h2>
            <p className="text-sm text-gray-500 mb-5">Pilih layanan yang kamu kuasai</p>
            <div className="space-y-3">
              {['Servis Laptop & PC','Rakit PC Custom','Thermal Repaste','Recovery Data','Jaringan & IT Support','Upgrade Hardware','Konsol Gaming'].map(s => (
                <label key={s} className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" className="accent-teal-500 w-4 h-4" />
                  <span className="text-sm text-gray-700 dark:text-gray-300">{s}</span>
                </label>
              ))}
              <Input label="Spesialisasi lain (opsional)" placeholder="Tuliskan keahlian lain..." />
            </div>
            <div className="flex gap-3 mt-6">
              <Button variant="outline" className="flex-1" onClick={() => setStep(1)}>Kembali</Button>
              <Button variant="teal" className="flex-1" onClick={() => setStep(3)}>Lanjut</Button>
            </div>
          </>
        )}
        {step === 3 && (
          <>
            <h2 className="font-display text-2xl font-700 text-gray-900 dark:text-white mb-2">Verifikasi Identitas (KYC)</h2>
            <p className="text-sm text-gray-500 mb-5">Diperlukan agar pelanggan percaya padamu</p>
            <div className="space-y-4">
              <Input label="Nomor KTP" placeholder="3273xxxxxxxxxxxxxx" />
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
              <Button variant="outline" className="flex-1" onClick={() => setStep(2)}>Kembali</Button>
              <Button variant="teal" className="flex-1" onClick={() => setStep(4)}>Submit KYC</Button>
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
            <Button variant="teal" className="w-full" onClick={() => navigate('/technician')}>Masuk ke Dashboard</Button>
          </div>
        )}
      </Card>
    </div>
  )
}

// ── DASHBOARD ───────────────────────────────────────────────────
export function TechnicianDashboard() {
  const navigate = useNavigate()
  const pending = orders.filter(o => o.escrow === 'waiting' || o.escrow === 'progress')
  return (
    <TechLayout activeTab="dashboard">
      <div className="py-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Selamat datang 👋</p>
            <h1 className="font-display text-2xl font-700 text-gray-900 dark:text-white">Budi Santoso</h1>
          </div>
          <div className="flex items-center gap-2">
            <Badge color="green">Aktif</Badge>
            <Badge color="teal">KYC ✓</Badge>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-6">
          <StatCard label="Penghasilan Bulan Ini" value="Rp2,4jt" sub="↑ 12% vs bulan lalu" icon={DollarSign} color="teal" />
          <StatCard label="Order Selesai" value="48" sub="Bulan ini" icon={CheckCircle} color="green" />
          <StatCard label="Rating" value="4.9★" sub="127 ulasan" icon={Star} color="orange" />
          <StatCard label="Order Aktif" value={String(pending.length)} sub="Menunggu tindakan" icon={Package} color="blue" />
        </div>

        <h2 className="font-semibold text-gray-900 dark:text-white mb-3">Order Aktif</h2>
        <div className="space-y-3 mb-6">
          {pending.map(o => (
            <Card key={o.id} hover className="p-4" onClick={() => navigate('/technician/orders')}>
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-medium text-gray-900 dark:text-white text-sm">{o.service}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{o.date}</p>
                  <div className="mt-2"><EscrowStatus status={o.escrow} /></div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-sm text-gray-900 dark:text-white">Rp{o.price.toLocaleString('id')}</p>
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
              <p className="text-xs text-gray-500">Aktif hingga 30 Jun 2025</p>
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
  const [selected, setSelected] = useState(null)
  const [photoPreview, setPhotoPreview] = useState(null)

  const mockPhotos = [
    { label: 'Diagnosa awal', src: '🔧', desc: 'Membuka casing laptop' },
    { label: 'Proses perbaikan', src: '⚙️', desc: 'Penggantian thermal paste' },
    { label: 'Hasil akhir', src: '✅', desc: 'Laptop bersih & siap' },
  ]

  if (selected) {
    const o = orders.find(x => x.id === selected)
    return (
      <TechLayout activeTab="orders">
        <div className="py-6">
          <button onClick={() => setSelected(null)} className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 dark:hover:text-white mb-4"><ArrowLeft size={16} />Kembali</button>
          <h1 className="font-display text-xl font-700 text-gray-900 dark:text-white mb-4">Detail Order</h1>
          <Card className="p-5 mb-4">
            <div className="flex justify-between mb-2">
              <span className="font-mono text-sm text-brand-500">{o.id}</span>
              <EscrowStatus status={o.escrow} />
            </div>
            <p className="font-semibold text-gray-900 dark:text-white">{o.service}</p>
            <p className="text-sm text-gray-500 mt-1">Pelanggan: Hashfi H. · {o.date}</p>
            <p className="text-sm font-semibold text-gray-900 dark:text-white mt-2">Rp{o.price.toLocaleString('id')}</p>
          </Card>

          {!updateSent ? (
            <Card className="p-5 mb-4">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Kirim Update Progres</h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Status</label>
                  <select className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 text-gray-900 dark:text-white">
                    <option>Diagnosa awal selesai</option>
                    <option>Menunggu sparepart</option>
                    <option>Perbaikan berlangsung</option>
                    <option>Servis selesai, siap diambil</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Catatan untuk pelanggan</label>
                  <textarea className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 text-gray-900 dark:text-white" rows={3} placeholder="Ceritakan kondisi perangkat..." />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Foto progres</label>
                  {!photoPreview ? (
                    <div className="grid grid-cols-3 gap-2">
                      {mockPhotos.map((p, i) => (
                        <button key={i} onClick={() => setPhotoPreview(p)}
                          className="aspect-square rounded-xl bg-gray-100 dark:bg-gray-800 border-2 border-dashed border-gray-300 dark:border-gray-600 hover:border-brand-400 dark:hover:border-brand-600 flex flex-col items-center justify-center transition-colors group">
                          <span className="text-2xl mb-1">{p.src}</span>
                          <span className="text-xs text-gray-400 group-hover:text-brand-500 text-center px-1 leading-tight">{p.label}</span>
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 animate-scale-in">
                      <div className="bg-gray-900 p-6 text-center">
                        <span className="text-5xl">{photoPreview.src}</span>
                        <p className="text-white text-sm mt-2 font-medium">{photoPreview.label}</p>
                        <p className="text-gray-400 text-xs mt-1">{photoPreview.desc}</p>
                      </div>
                      <div className="flex items-center justify-between px-4 py-2 bg-gray-50 dark:bg-gray-800">
                        <span className="text-xs text-green-600 dark:text-green-400 flex items-center gap-1"><CheckCircle size={11} />Foto dipilih</span>
                        <button onClick={() => setPhotoPreview(null)} className="text-xs text-gray-400 hover:text-gray-600">Ganti</button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <Button variant="teal" className="w-full mt-4" onClick={() => setUpdateSent(true)}>Kirim Update</Button>
            </Card>
          ) : (
            <Card className="p-5 mb-4">
              <div className="flex items-center gap-3">
                <CheckCircle size={20} className="text-teal-500" />
                <p className="text-sm text-gray-700 dark:text-gray-300">Update progres berhasil dikirim ke pelanggan.</p>
              </div>
            </Card>
          )}
        </div>
      </TechLayout>
    )
  }

  return (
    <TechLayout activeTab="orders">
      <div className="py-6">
        <h1 className="font-display text-2xl font-700 text-gray-900 dark:text-white mb-6">Manajemen Order</h1>
        <div className="space-y-3">
          {orders.map(o => (
            <Card key={o.id} hover className="p-4" onClick={() => setSelected(o.id)}>
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-medium text-gray-900 dark:text-white text-sm">{o.service}</p>
                  <p className="text-xs text-gray-500 mt-0.5 font-mono">{o.id} · {o.date}</p>
                  <div className="mt-2"><EscrowStatus status={o.escrow} /></div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-sm text-gray-900 dark:text-white">Rp{o.price.toLocaleString('id')}</p>
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
  const months = ['Jan','Feb','Mar','Apr','Mei','Jun']
  const vals =   [800, 1200, 1500, 1800, 2100, 2400]
  const maxVal = Math.max(...vals)
  return (
    <TechLayout activeTab="earnings">
      <div className="py-6">
        <h1 className="font-display text-2xl font-700 text-gray-900 dark:text-white mb-6">Penghasilan</h1>
        <div className="grid grid-cols-2 gap-3 mb-6">
          <StatCard label="Bulan Ini" value="Rp2,4jt" sub="48 order selesai" icon={DollarSign} color="teal" />
          <StatCard label="Total 2025" value="Rp9,8jt" sub="↑ 28% vs 2024" icon={TrendingUp} color="green" />
        </div>

        <Card className="p-5 mb-4">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Tren Penghasilan (ribu Rp)</h3>
          <div className="flex items-end gap-2 h-32">
            {vals.map((v, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                <div className="w-full rounded-t-lg bg-teal-500/80 dark:bg-teal-500/60 transition-all"
                  style={{ height: `${(v / maxVal) * 100}%` }} />
                <span className="text-xs text-gray-400">{months[i]}</span>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-5">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Pencairan Dana</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Saldo tersedia: <span className="font-semibold text-gray-900 dark:text-white">Rp2.400.000</span></p>
          <div className="space-y-2 mb-4">
            {[{m:'Transfer Bank (BCA)', a:'Rp2.400.000'},{m:'OVO',a:'Rp0'}].map(x=>(
              <label key={x.m} className="flex items-center gap-3 cursor-pointer">
                <input type="radio" name="withdraw" className="accent-teal-500" />
                <span className="text-sm text-gray-700 dark:text-gray-300 flex-1">{x.m}</span>
                <span className="text-sm font-medium text-gray-900 dark:text-white">{x.a}</span>
              </label>
            ))}
          </div>
          <Button variant="teal" className="w-full">Cairkan Dana</Button>
        </Card>
      </div>
    </TechLayout>
  )
}

// ── SETTINGS ────────────────────────────────────────────────────
export function TechnicianSettings() {
  const navigate = useNavigate()
  const plans = [
    { id: 'basic', name: 'Basic', price: 50000, desc: 'Tampil di halaman pencarian' },
    { id: 'gold', name: 'Gold', price: 100000, desc: 'Prioritas di halaman depan', popular: true },
    { id: 'platinum', name: 'Platinum', price: 150000, desc: 'Top placement + badge premium' },
  ]
  return (
    <TechLayout activeTab="settings">
      <div className="py-6">
        <h1 className="font-display text-2xl font-700 text-gray-900 dark:text-white mb-6">Akun Teknisi</h1>
        <Card className="p-5 mb-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center text-white font-display text-2xl font-700">B</div>
            <div>
              <p className="font-semibold text-gray-900 dark:text-white">Budi Santoso</p>
              <p className="text-sm text-gray-500">budi@email.com</p>
              <div className="flex gap-2 mt-1">
                <Badge color="green">KYC Verified</Badge>
                <Badge color="teal">Top Rated</Badge>
              </div>
            </div>
          </div>
        </Card>

        <h2 className="font-semibold text-gray-900 dark:text-white mb-3">Premium Listing</h2>
        <div className="space-y-3 mb-6">
          {plans.map(p => (
            <div key={p.id} className={`p-4 rounded-2xl border-2 ${p.id === 'basic' ? 'border-teal-500 bg-teal-50 dark:bg-teal-900/20' : 'border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900'}`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <p className="font-semibold text-gray-900 dark:text-white">{p.name}</p>
                  {p.popular && <Badge color="orange">Populer</Badge>}
                  {p.id === 'basic' && <Badge color="teal">Aktif</Badge>}
                </div>
                <span className="font-display font-700 text-gray-900 dark:text-white">Rp{p.price.toLocaleString('id')}<span className="text-xs text-gray-400 font-normal">/bln</span></span>
              </div>
              <p className="text-xs text-gray-500 mt-1">{p.desc}</p>
              {p.id !== 'basic' && <Button variant="outline" size="sm" className="mt-3 w-full">Upgrade ke {p.name}</Button>}
            </div>
          ))}
        </div>

        <button onClick={() => navigate('/')} className="w-full flex items-center justify-center gap-2 py-3 text-sm text-red-500 font-medium">
          <LogOut size={16} /> Keluar
        </button>
      </div>
    </TechLayout>
  )
}
