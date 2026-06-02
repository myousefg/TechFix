import React, { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { BarChart2, Users, Shield, Megaphone, AlertTriangle, CheckCircle, X, ChevronRight, TrendingUp, Package, DollarSign, LogOut, Menu } from 'lucide-react'
import { Card, Badge, Button, StatCard, SidebarLink } from '../../components/UI'
import { adminStats, technicians } from '../../data'

function AdminLayout({ children }) {
  const navigate = useNavigate()
  const location = useLocation()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const links = [
    { icon: BarChart2, label: 'Dashboard',        path: '/admin' },
    { icon: Users,     label: 'Manajemen User',   path: '/admin/users' },
    { icon: Package,   label: 'Transaksi',         path: '/admin/transactions' },
    { icon: AlertTriangle, label: 'Arbitrase',     path: '/admin/disputes' },
    { icon: Megaphone, label: 'Iklan & Partnership',path: '/admin/ads' },
  ]

  return (
    <div className="pt-16 min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Sidebar desktop */}
      <aside className="hidden md:flex flex-col fixed left-0 top-16 bottom-0 w-56 border-r border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 px-3 py-4 z-30">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-3 mb-2">Admin Panel</p>
        <nav className="space-y-0.5 flex-1">
          {links.map(l => (
            <SidebarLink key={l.path} icon={l.icon} label={l.label} path={l.path} active={location.pathname === l.path} onClick={() => navigate(l.path)} />
          ))}
        </nav>
        <button onClick={() => navigate('/')} className="flex items-center gap-2 px-3 py-2 text-sm text-red-500 font-medium rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20">
          <LogOut size={16} /> Keluar
        </button>
      </aside>

      {/* Mobile sidebar toggle */}
      <button onClick={() => setSidebarOpen(o=>!o)} className="md:hidden fixed bottom-4 right-4 z-50 w-12 h-12 rounded-full bg-brand-500 text-white flex items-center justify-center shadow-lg">
        <Menu size={20} />
      </button>
      {sidebarOpen && (
        <div className="md:hidden fixed inset-0 z-40 bg-black/40" onClick={() => setSidebarOpen(false)}>
          <div className="bg-white dark:bg-gray-900 w-56 h-full px-3 py-4 pt-20" onClick={e => e.stopPropagation()}>
            <nav className="space-y-0.5">
              {links.map(l => (
                <SidebarLink key={l.path} icon={l.icon} label={l.label} active={location.pathname === l.path} onClick={() => { navigate(l.path); setSidebarOpen(false) }} />
              ))}
            </nav>
          </div>
        </div>
      )}

      <main className="md:ml-56 px-4 md:px-8 py-6 max-w-5xl">
        {children}
      </main>
    </div>
  )
}

// ── DASHBOARD ───────────────────────────────────────────────────
export function AdminDashboard() {
  return (
    <AdminLayout>
      <h1 className="font-display text-2xl font-700 text-gray-900 dark:text-white mb-6">Dashboard Admin</h1>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
        <StatCard label="Total Revenue" value="Rp11jt" sub="/bulan" icon={DollarSign} color="green" />
        <StatCard label="Transaksi" value={String(adminStats.transactions)} sub="/bulan" icon={Package} color="blue" />
        <StatCard label="Pengguna Aktif" value={String(adminStats.activeUsers)} sub="total terdaftar" icon={Users} color="teal" />
        <StatCard label="Teknisi Aktif" value={String(adminStats.activeTechs)} sub={`${adminStats.pendingKYC} pending KYC`} icon={Shield} color="orange" />
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-6">
        <Card className="p-5">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Revenue per Stream</h3>
          <div className="space-y-3">
            {[
              { label: 'Komisi transaksi', val: 6000000, pct: 55 },
              { label: 'Subscription maintenance', val: 2500000, pct: 23 },
              { label: 'Iklan & partnership', val: 1500000, pct: 14 },
              { label: 'Premium listing', val: 1000000, pct: 9 },
            ].map(r => (
              <div key={r.label}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600 dark:text-gray-400">{r.label}</span>
                  <span className="font-medium text-gray-900 dark:text-white">Rp{r.val.toLocaleString('id')}</span>
                </div>
                <div className="h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full">
                  <div className="h-1.5 bg-brand-500 rounded-full" style={{ width: `${r.pct}%` }} />
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-5">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Peringatan</h3>
          <div className="space-y-3">
            <div className="flex items-start gap-3 p-3 rounded-xl bg-orange-50 dark:bg-orange-900/20">
              <AlertTriangle size={16} className="text-orange-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-orange-800 dark:text-orange-300">{adminStats.pendingKYC} teknisi menunggu KYC</p>
                <p className="text-xs text-orange-600 dark:text-orange-400">Perlu ditinjau dalam 24 jam</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 rounded-xl bg-red-50 dark:bg-red-900/20">
              <AlertTriangle size={16} className="text-red-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-red-800 dark:text-red-300">{adminStats.disputes} sengketa aktif</p>
                <p className="text-xs text-red-600 dark:text-red-400">Memerlukan keputusan arbitrase</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 rounded-xl bg-green-50 dark:bg-green-900/20">
              <CheckCircle size={16} className="text-green-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-green-800 dark:text-green-300">Revenue positif bulan ini</p>
                <p className="text-xs text-green-600 dark:text-green-400">Rp11jt vs cost Rp10.5jt</p>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </AdminLayout>
  )
}

// ── USER MANAGEMENT ─────────────────────────────────────────────
export function AdminUsers() {
  const [tab, setTab] = useState('teknisi')
  return (
    <AdminLayout>
      <h1 className="font-display text-2xl font-700 text-gray-900 dark:text-white mb-6">Manajemen Pengguna</h1>
      <div className="flex gap-2 mb-6">
        {['teknisi','pelanggan'].map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-4 py-2 rounded-xl text-sm font-medium capitalize transition-colors ${tab === t ? 'bg-brand-500 text-white' : 'bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400'}`}>
            {t}
          </button>
        ))}
      </div>
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-gray-100 dark:border-gray-800">
              <tr className="text-xs text-gray-500 dark:text-gray-400 text-left">
                <th className="px-4 py-3 font-medium">Nama</th>
                <th className="px-4 py-3 font-medium">Spesialisasi</th>
                <th className="px-4 py-3 font-medium">Status KYC</th>
                <th className="px-4 py-3 font-medium">Rating</th>
                <th className="px-4 py-3 font-medium">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {technicians.map((t, i) => (
                <tr key={t.id} className={`border-b border-gray-50 dark:border-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800/50 ${i === technicians.length-1 ? 'border-0' : ''}`}>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-brand-100 dark:bg-brand-900/30 flex items-center justify-center text-brand-600 dark:text-brand-400 font-semibold text-xs">{t.name.charAt(0)}</div>
                      <span className="font-medium text-gray-900 dark:text-white">{t.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-500 dark:text-gray-400">{t.specialty}</td>
                  <td className="px-4 py-3"><Badge color={t.verified ? 'green' : 'orange'}>{t.verified ? 'Verified' : 'Pending'}</Badge></td>
                  <td className="px-4 py-3 text-gray-900 dark:text-white">{t.rating} ★</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      {!t.verified && <button className="px-2 py-1 rounded-lg bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 text-xs font-medium hover:bg-green-100">Setujui</button>}
                      <button className="px-2 py-1 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 text-xs font-medium hover:bg-gray-200">Detail</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </AdminLayout>
  )
}

// ── DISPUTES ────────────────────────────────────────────────────
export function AdminDisputes() {
  const [selected, setSelected] = useState(null)
  const disputes = [
    { id: 'D-001', order: 'TF-003', claimant: 'Rizky S.', tech: 'Agus P.', issue: 'Pelanggan mengklaim laptop masih bermasalah setelah servis', amount: 450000, status: 'open' },
    { id: 'D-002', order: 'TF-007', claimant: 'Siti M.',  tech: 'Rina K.', issue: 'Teknisi tidak merespons selama 48 jam setelah pembayaran', amount: 120000, status: 'open' },
    { id: 'D-003', order: 'TF-009', claimant: 'Andi R.',  tech: 'Budi S.', issue: 'Harga final melebihi estimasi awal tanpa konfirmasi', amount: 200000, status: 'resolved' },
  ]
  if (selected) {
    const d = disputes.find(x => x.id === selected)
    return (
      <AdminLayout>
        <button onClick={() => setSelected(null)} className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 dark:hover:text-white mb-4"><ChevronRight size={16} className="rotate-180" />Kembali</button>
        <h1 className="font-display text-xl font-700 text-gray-900 dark:text-white mb-4">Sengketa {d.id}</h1>
        <div className="grid md:grid-cols-2 gap-4 mb-4">
          <Card className="p-4">
            <p className="text-xs text-gray-400 mb-1">Pelapor (Pelanggan)</p>
            <p className="font-semibold text-gray-900 dark:text-white">{d.claimant}</p>
            <p className="text-sm text-gray-500 mt-2">Klaim: {d.issue}</p>
          </Card>
          <Card className="p-4">
            <p className="text-xs text-gray-400 mb-1">Teknisi Terdakwa</p>
            <p className="font-semibold text-gray-900 dark:text-white">{d.tech}</p>
            <p className="text-sm text-gray-500 mt-2">Jumlah escrow: Rp{d.amount.toLocaleString('id')}</p>
          </Card>
        </div>
        <Card className="p-5 mb-4">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Rekomendasi AI</h3>
          <div className="p-3 rounded-xl bg-brand-50 dark:bg-brand-900/20 text-sm text-brand-700 dark:text-brand-300">
            Berdasarkan analisis kronologi order, foto dokumentasi, dan riwayat komunikasi: kemungkinan 70% pelanggan memiliki klaim yang valid. Disarankan untuk refund 50% escrow kepada pelanggan.
          </div>
        </Card>
        <div className="flex gap-3">
          <Button variant="danger" className="flex-1">Refund ke Pelanggan</Button>
          <Button variant="teal" className="flex-1">Teruskan ke Teknisi</Button>
          <Button variant="outline" className="flex-1">Bagi Rata</Button>
        </div>
      </AdminLayout>
    )
  }
  return (
    <AdminLayout>
      <h1 className="font-display text-2xl font-700 text-gray-900 dark:text-white mb-6">Arbitrase Sengketa</h1>
      <div className="space-y-3">
        {disputes.map(d => (
          <Card key={d.id} hover className="p-5" onClick={() => setSelected(d.id)}>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-mono text-sm text-brand-500">{d.id}</span>
                  <Badge color={d.status === 'open' ? 'orange' : 'green'}>{d.status === 'open' ? 'Perlu Tindakan' : 'Selesai'}</Badge>
                </div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">{d.claimant} vs {d.tech}</p>
                <p className="text-xs text-gray-500 mt-1 line-clamp-1">{d.issue}</p>
              </div>
              <div className="text-right">
                <p className="font-semibold text-sm text-gray-900 dark:text-white">Rp{d.amount.toLocaleString('id')}</p>
                <ChevronRight size={16} className="text-gray-400 ml-auto mt-1" />
              </div>
            </div>
          </Card>
        ))}
      </div>
    </AdminLayout>
  )
}

// ── ADS & PARTNERSHIPS ──────────────────────────────────────────
export function AdminAds() {
  return (
    <AdminLayout>
      <h1 className="font-display text-2xl font-700 text-gray-900 dark:text-white mb-6">Iklan & Partnership</h1>
      <div className="grid md:grid-cols-3 gap-3 mb-6">
        <StatCard label="Revenue Iklan" value="Rp1,5jt" sub="/bulan" icon={DollarSign} color="green" />
        <StatCard label="Partner Aktif" value="4" sub="vendor & toko" icon={Users} color="blue" />
        <StatCard label="Slot Tersedia" value="3" sub="banner homepage" icon={Megaphone} color="orange" />
      </div>
      <Card className="p-5 mb-4">
        <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Partner Aktif</h3>
        <div className="space-y-3">
          {[
            { name: 'Toko PC Nusantara', type: 'Sparepart', revenue: 'Rp500K/bln', status: 'active' },
            { name: 'ASUS Indonesia',    type: 'Brand Laptop', revenue: 'Rp750K/bln', status: 'active' },
            { name: 'Logitech ID',       type: 'Periferal', revenue: 'Rp250K/bln', status: 'active' },
          ].map(p => (
            <div key={p.name} className="flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-gray-800">
              <div>
                <p className="font-medium text-gray-900 dark:text-white text-sm">{p.name}</p>
                <p className="text-xs text-gray-500">{p.type}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-green-600 dark:text-green-400">{p.revenue}</p>
                <Badge color="green">Aktif</Badge>
              </div>
            </div>
          ))}
        </div>
      </Card>
      <Card className="p-5">
        <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Manajemen Slot Iklan</h3>
        <div className="space-y-3">
          {[
            { slot: 'Banner Homepage (Top)', status: 'sold', buyer: 'ASUS Indonesia' },
            { slot: 'Banner Homepage (Mid)', status: 'sold', buyer: 'Toko PC Nusantara' },
            { slot: 'Sidebar App',           status: 'available', buyer: null },
            { slot: 'Push Notification Slot',status: 'available', buyer: null },
          ].map(s => (
            <div key={s.slot} className="flex items-center justify-between p-3 rounded-xl border border-gray-100 dark:border-gray-800">
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">{s.slot}</p>
                {s.buyer && <p className="text-xs text-gray-500">{s.buyer}</p>}
              </div>
              <div className="flex items-center gap-2">
                <Badge color={s.status === 'sold' ? 'blue' : 'teal'}>{s.status === 'sold' ? 'Terisi' : 'Tersedia'}</Badge>
                {s.status === 'available' && <Button size="sm" variant="outline">Assign</Button>}
              </div>
            </div>
          ))}
        </div>
      </Card>
    </AdminLayout>
  )
}
