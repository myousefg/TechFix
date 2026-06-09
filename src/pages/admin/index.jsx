import { useState, useMemo } from 'react'
import { useNavigate, useLocation, useParams, Link } from 'react-router-dom'
import { BarChart2, Users, Shield, Megaphone, AlertTriangle, CheckCircle, ArrowLeft, Package, DollarSign, LogOut, Menu, X, Search, ShieldCheck, History, Settings as SettingsIcon, Eye, FileBarChart, MessageCircle, Star } from 'lucide-react'
import { Card, Badge, Button, StatCard, SidebarLink, EmptyState } from '../../components/UI'
import { TopTechsLeaderboard, ActivityFeed } from './Modals'
import { technicians } from '../../data'
import { getAdminTransactions, getAdminProfile, getCustomers, getCustomerOrders, getKYCRequests, getPartners, getDisputes, getDisputeById, resolveDispute, updateKYCStatus, addAuditLog, getRevenueHistory } from '../../store'
import toast from 'react-hot-toast'

export { AdminAdsPage } from './Ads'
export { AdminKYC, AdminKYCDetail } from './KYC'
export { AdminSettings } from './Settings'
export { AdminAuditLog } from './AuditLog'

export function AdminLayout({ children }) {
  const navigate = useNavigate()
  const location = useLocation()
  const [sidebarOpen, setSidebarOpen] = useState(true)

  const links = [
    { icon: BarChart2,    label: 'Dashboard',            path: '/admin' },
    { icon: Users,        label: 'Manajemen User',       path: '/admin/users' },
    { icon: Package,      label: 'Transaksi',            path: '/admin/transactions' },
    { icon: AlertTriangle,label: 'Arbitrase',            path: '/admin/disputes' },
    { icon: ShieldCheck,  label: 'Review KYC',           path: '/admin/kyc' },
    { icon: Megaphone,    label: 'Iklan & Partnership',  path: '/admin/ads' },
    { icon: MessageCircle,label: 'Support Tickets',      path: '/admin/support' },
    { icon: Star,         label: 'Moderasi Review',      path: '/admin/reviews' },
    { icon: History,      label: 'Audit Log',            path: '/admin/audit' },
    { icon: SettingsIcon, label: 'Settings',             path: '/admin/settings' },
  ]

  const isActive = (l) => {
    if (l.path === '/admin') return location.pathname === '/admin'
    return location.pathname.startsWith(l.path)
  }

  return (
    <div className="pt-16 min-h-screen bg-gray-50 dark:bg-gray-950">

      {/* Desktop sidebar */}
      <aside className="hidden md:flex flex-col fixed left-0 top-16 bottom-0 w-56 border-r border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 px-3 py-4 z-30">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-3 mb-2">Admin Panel</p>
        <nav className="space-y-0.5 flex-1 overflow-y-auto">
          {links.map(l => (
            <SidebarLink key={l.path} icon={l.icon} label={l.label} path={l.path} active={isActive(l)} onClick={() => navigate(l.path)} />
          ))}
        </nav>
        <button onClick={() => navigate('/')} className="flex items-center gap-2 px-3 py-2 text-sm text-red-500 font-medium rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20">
          <LogOut size={16} /> Keluar
        </button>
      </aside>

      {/* Mobile: hamburger button positioned in header row */}
      <button
        onClick={() => setSidebarOpen(o => !o)}
        className="md:hidden fixed top-0 left-0 z-[60] w-16 h-16 flex items-center justify-center"
        aria-label="Menu"
      >
        {sidebarOpen ? <X size={20} className="text-gray-700 dark:text-gray-300" /> : <Menu size={20} className="text-gray-700 dark:text-gray-300" />}
      </button>

      {/* Mobile sidebar drawer */}
      {sidebarOpen && (
        <div className="md:hidden fixed inset-0 z-40 bg-black/40" onClick={() => setSidebarOpen(false)}>
          <div className="bg-white dark:bg-gray-900 w-56 h-full px-3 py-4 pt-20 overflow-y-auto" onClick={e => e.stopPropagation()}>
            <nav className="space-y-0.5">
              {links.map(l => (
                <SidebarLink key={l.path} icon={l.icon} label={l.label} path={l.path} active={isActive(l)} onClick={() => { navigate(l.path); setSidebarOpen(false) }} />
              ))}
            </nav>
            <button onClick={() => navigate('/')} className="flex items-center gap-2 px-3 py-2 mt-4 text-sm text-red-500 font-medium rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 w-full">
              <LogOut size={16} /> Keluar
            </button>
          </div>
        </div>
      )}

      <main className="md:pl-56">
        <div className="max-w-5xl mx-auto px-4 md:px-8 py-6">
        {children}
      </div>
      </main>
    </div>
  )
}

export function AdminDashboard() {
  const navigate = useNavigate()
  const transactions = getAdminTransactions()
  const admin = getAdminProfile()
  const kycRequests = getKYCRequests()
  const disputes = getDisputes()
  const revenueHistory = getRevenueHistory()

  const totalRevenue = transactions.reduce((s, t) => s + t.amount, 0)
  const commissionRevenue = transactions.filter(t => t.status === 'done').reduce((s, t) => s + t.amount * 0.1, 0)
  const subscriptionRevenue = revenueHistory[revenueHistory.length - 1]?.subscription || 2500000
  const adsRevenue = revenueHistory[revenueHistory.length - 1]?.ads || 1500000
  const premiumListingRevenue = 1000000
  const formattedRevenue = totalRevenue >= 1000000
    ? `Rp${(totalRevenue / 1000000).toFixed(1).replace('.0','')}jt`
    : `Rp${totalRevenue.toLocaleString('id')}`

  const monthlyRevenue = commissionRevenue + subscriptionRevenue + adsRevenue + premiumListingRevenue
  const monthlyCost = Math.round(monthlyRevenue * 0.95)

  const revenueStreams = useMemo(() => {
    const streams = [
      { label: 'Komisi transaksi',     val: commissionRevenue,        color: 'bg-brand-500' },
      { label: 'Subscription maintenance', val: subscriptionRevenue,  color: 'bg-blue-500' },
      { label: 'Iklan & partnership',  val: adsRevenue,                color: 'bg-accent-500' },
      { label: 'Premium listing',      val: premiumListingRevenue,     color: 'bg-amber-500' },
    ]
    const total = streams.reduce((s, x) => s + x.val, 0) || 1
    return streams.map(s => ({ ...s, pct: Math.round((s.val / total) * 100) }))
  }, [commissionRevenue, subscriptionRevenue, adsRevenue])

  const pendingKYC = kycRequests.filter(k => k.status === 'pending').length
  const activeDisputes = disputes.filter(d => d.status === 'open').length

  return (
    <AdminLayout>
      <h1 className="font-display text-2xl font-700 text-gray-900 dark:text-white mb-1">Dashboard Admin</h1>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">Selamat datang, {admin.name} • {admin.role}</p>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <StatCard label="Total Revenue" value={formattedRevenue} sub="dari transaksi" icon={DollarSign} color="green" />
        <StatCard label="Transaksi" value={String(transactions.length)} sub="total bulan ini" icon={Package} color="blue" />
        <StatCard label="Teknisi Aktif" value={String(technicians.filter(t => t.verified).length)} sub={`${pendingKYC} menunggu KYC`} icon={Shield} color="teal" />
        <StatCard label="Sengketa" value={String(activeDisputes)} sub="perlu arbitrase" icon={AlertTriangle} color="orange" />
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-6">
        <Card className="p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900 dark:text-white">Revenue Trend (5 Bulan)</h3>
            <Link to="/admin/transactions" className="text-xs text-brand-500 hover:underline flex items-center gap-1">
              Detail <FileBarChart size={12} />
            </Link>
          </div>
          <RevenueLineChart data={revenueHistory} />
        </Card>

        <Card className="p-5">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Distribusi Status Order</h3>
          <StatusDonutChart transactions={transactions} />
        </Card>
      </div>

      <div className="grid md:grid-cols-3 gap-6 mb-6">
        <Card className="p-5 md:col-span-1">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Revenue per Stream</h3>
          <div className="space-y-3">
            {revenueStreams.map(r => (
              <div key={r.label}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600 dark:text-gray-400">{r.label}</span>
                  <span className="font-medium text-gray-900 dark:text-white">Rp{r.val.toLocaleString('id')}</span>
                </div>
                <div className="h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                  <div className={`h-1.5 ${r.color} rounded-full transition-all`} style={{ width: `${r.pct}%` }} />
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-5 md:col-span-1">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Kategori Layanan</h3>
          <ServiceCategoryPieChart transactions={transactions} />
        </Card>

        <Card className="p-5 md:col-span-1">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Peringatan & Aksi Cepat</h3>
          <div className="space-y-2">
            <button onClick={() => navigate('/admin/kyc')} className="w-full flex items-start gap-3 p-3 rounded-xl bg-orange-50 dark:bg-orange-900/20 hover:bg-orange-100 dark:hover:bg-orange-900/30 transition-colors text-left">
              <AlertTriangle size={16} className="text-orange-500 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium text-orange-800 dark:text-orange-300">{pendingKYC} KYC menunggu</p>
                <p className="text-xs text-orange-600 dark:text-orange-400">Klik untuk review</p>
              </div>
            </button>
            <button onClick={() => navigate('/admin/disputes')} className="w-full flex items-start gap-3 p-3 rounded-xl bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors text-left">
              <AlertTriangle size={16} className="text-red-500 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium text-red-800 dark:text-red-300">{activeDisputes} sengketa aktif</p>
                <p className="text-xs text-red-600 dark:text-red-400">Klik untuk arbitrase</p>
              </div>
            </button>
            <div className="flex items-start gap-3 p-3 rounded-xl bg-green-50 dark:bg-green-900/20">
              <CheckCircle size={16} className="text-green-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-green-800 dark:text-green-300">Revenue positif bulan ini</p>
                <p className="text-xs text-green-600 dark:text-green-400">Rp{Math.round(monthlyRevenue / 1000000).toFixed(1).replace('.0','')}jt revenue vs Rp{Math.round(monthlyCost / 1000000).toFixed(1).replace('.0','')}jt cost</p>
              </div>
            </div>
            <button onClick={() => navigate('/admin/audit')} className="w-full flex items-start gap-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-left">
              <History size={16} className="text-gray-500 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Lihat audit log</p>
                <p className="text-xs text-gray-500">Riwayat aktivitas admin</p>
              </div>
            </button>
          </div>
        </Card>
      </div>

      <div className="grid md:grid-cols-2 gap-4 mt-4">
        <TopTechsLeaderboard limit={5} />
        <ActivityFeed limit={8} />
      </div>
    </AdminLayout>
  )
}

function RevenueLineChart({ data }) {
  const width = 400
  const height = 160
  const padding = 20
  const maxVal = Math.max(...data.flatMap(d => [d.commission, d.subscription, d.ads])) * 1.1
  const xStep = (width - padding * 2) / (data.length - 1)
  const yScale = (val) => height - padding - ((val / maxVal) * (height - padding * 2))

  const buildPath = (key) => {
    return data.map((d, i) => `${i === 0 ? 'M' : 'L'} ${padding + i * xStep} ${yScale(d[key])}`).join(' ')
  }

  const buildArea = (key) => {
    const linePath = data.map((d, i) => `${i === 0 ? 'M' : 'L'} ${padding + i * xStep} ${yScale(d[key])}`).join(' ')
    return `${linePath} L ${padding + (data.length - 1) * xStep} ${height - padding} L ${padding} ${height - padding} Z`
  }

  const series = [
    { key: 'commission',   color: '#3b82f6', label: 'Komisi' },
    { key: 'subscription', color: '#8b5cf6', label: 'Subscription' },
    { key: 'ads',          color: '#10b981', label: 'Iklan' },
  ]

  return (
    <div>
      <div className="flex gap-3 mb-3 text-xs">
        {series.map(s => (
          <div key={s.key} className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: s.color }} />
            <span className="text-gray-600 dark:text-gray-400">{s.label}</span>
          </div>
        ))}
      </div>
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-40">
        {[0, 0.25, 0.5, 0.75, 1].map((p, i) => (
          <line key={i} x1={padding} y1={padding + (height - padding * 2) * p} x2={width - padding} y2={padding + (height - padding * 2) * p}
            stroke="currentColor" className="text-gray-200 dark:text-gray-800" strokeWidth="0.5" strokeDasharray="2,2" />
        ))}
        {series.map(s => (
          <g key={s.key}>
            <path d={buildArea(s.key)} fill={s.color} opacity="0.1" />
            <path d={buildPath(s.key)} stroke={s.color} fill="none" strokeWidth="2" />
          </g>
        ))}
        {data.map((d, i) => (
          <g key={d.month}>
            {series.map(s => (
              <circle key={s.key} cx={padding + i * xStep} cy={yScale(d[s.key])} r="3" fill={s.color} />
            ))}
            <text x={padding + i * xStep} y={height - 5} textAnchor="middle" className="fill-gray-500 dark:fill-gray-400" style={{ fontSize: '10px' }}>
              {d.month}
            </text>
          </g>
        ))}
      </svg>
    </div>
  )
}

function StatusDonutChart({ transactions }) {
  const counts = {
    done:     transactions.filter(t => t.status === 'done').length,
    progress: transactions.filter(t => t.status === 'progress').length,
    waiting:  transactions.filter(t => t.status === 'waiting').length,
  }
  const total = transactions.length || 1
  const colors = { done: '#10b981', progress: '#3b82f6', waiting: '#f59e0b' }
  const labels = { done: 'Selesai', progress: 'Berlangsung', waiting: 'Menunggu' }

  const radius = 60
  const innerRadius = 40
  let cumulative = 0

  const arcs = Object.entries(counts).map(([key, count]) => {
    const startAngle = (cumulative / total) * 360
    cumulative += count
    const endAngle = (cumulative / total) * 360
    const start = polarToCartesian(100, 100, radius, endAngle)
    const end = polarToCartesian(100, 100, radius, startAngle)
    const innerStart = polarToCartesian(100, 100, innerRadius, endAngle)
    const innerEnd = polarToCartesian(100, 100, innerRadius, startAngle)
    const largeArc = endAngle - startAngle > 180 ? 1 : 0
    return {
      key,
      d: `M ${start.x} ${start.y} A ${radius} ${radius} 0 ${largeArc} 0 ${end.x} ${end.y} L ${innerEnd.x} ${innerEnd.y} A ${innerRadius} ${innerRadius} 0 ${largeArc} 1 ${innerStart.x} ${innerStart.y} Z`,
      color: colors[key],
      count,
      pct: Math.round((count / total) * 100),
    }
  })

  return (
    <div className="flex items-center gap-4">
      <svg viewBox="0 0 200 200" className="w-32 h-32 flex-shrink-0">
        {arcs.map(a => <path key={a.key} d={a.d} fill={a.color} />)}
        <text x="100" y="98" textAnchor="middle" className="fill-gray-900 dark:fill-white" style={{ fontSize: '24px', fontWeight: 700 }}>{total}</text>
        <text x="100" y="115" textAnchor="middle" className="fill-gray-500" style={{ fontSize: '10px' }}>Total Order</text>
      </svg>
      <div className="space-y-2 flex-1">
        {arcs.map(a => (
          <div key={a.key} className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: a.color }} />
              <span className="text-gray-600 dark:text-gray-400">{labels[a.key]}</span>
            </div>
            <span className="font-medium text-gray-900 dark:text-white">{a.count} ({a.pct}%)</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function ServiceCategoryPieChart({ transactions }) {
  const categories = transactions.reduce((acc, t) => {
    const cat = t.service.toLowerCase().includes('laptop') ? 'Laptop' :
                t.service.toLowerCase().includes('pc')     ? 'PC'      :
                t.service.toLowerCase().includes('thermal')? 'Thermal':
                t.service.toLowerCase().includes('data')   ? 'Data'   :
                t.service.toLowerCase().includes('upgrade')? 'Upgrade':
                t.service.toLowerCase().includes('recovery')?'Recovery': 'Lainnya'
    acc[cat] = (acc[cat] || 0) + 1
    return acc
  }, {})

  const colors = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#6b7280']
  const total = transactions.length || 1
  let cumulative = 0

  const slices = Object.entries(categories).map(([name, count], i) => {
    const startAngle = (cumulative / total) * 360
    cumulative += count
    const endAngle = (cumulative / total) * 360
    const start = polarToCartesian(100, 100, 70, endAngle)
    const end = polarToCartesian(100, 100, 70, startAngle)
    const largeArc = endAngle - startAngle > 180 ? 1 : 0
    return {
      name,
      count,
      pct: Math.round((count / total) * 100),
      d: `M 100 100 L ${start.x} ${start.y} A 70 70 0 ${largeArc} 0 ${end.x} ${end.y} Z`,
      color: colors[i % colors.length],
    }
  })

  return (
    <div className="flex items-center gap-4">
      <svg viewBox="0 0 200 200" className="w-32 h-32 flex-shrink-0">
        {slices.map(s => <path key={s.name} d={s.d} fill={s.color} stroke="white" strokeWidth="1" />)}
      </svg>
      <div className="space-y-1.5 flex-1">
        {slices.map(s => (
          <div key={s.name} className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: s.color }} />
              <span className="text-gray-600 dark:text-gray-400">{s.name}</span>
            </div>
            <span className="font-medium text-gray-900 dark:text-white">{s.count} ({s.pct}%)</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function polarToCartesian(cx, cy, r, angle) {
  const rad = (angle - 90) * Math.PI / 180
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) }
}

export function AdminUsers() {
  const navigate = useNavigate()
  const [tab, setTab] = useState('teknisi')
  const [query, setQuery] = useState('')
  const customers = getCustomers()
  const kycRequests = getKYCRequests()

  const filteredTechs = technicians.filter(t =>
    t.name.toLowerCase().includes(query.toLowerCase()) ||
    t.specialty.toLowerCase().includes(query.toLowerCase())
  )
  const filteredCustomers = customers.filter(c =>
    c.name.toLowerCase().includes(query.toLowerCase()) ||
    c.email.toLowerCase().includes(query.toLowerCase()) ||
    c.city.toLowerCase().includes(query.toLowerCase())
  )

  const handleApproveKYC = (tech) => {
    if (!confirm(`Setujui KYC untuk ${tech.name}?`)) return
    const kyc = kycRequests.find(k => k.techId === tech.id)
    if (kyc) {
      updateKYCStatus(kyc.id, 'approved')
    }
    addAuditLog({ actor: 'Admin', action: 'approve_kyc', target: tech.name })
    toast.success(`${tech.name} disetujui sebagai teknisi terverifikasi`)
  }

  return (
    <AdminLayout>
      <div className="flex items-center gap-2 text-sm mb-6">
        <button onClick={() => navigate('/admin')} className="flex items-center gap-1.5 text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors font-medium">
          <ArrowLeft size={15} />Dashboard
        </button>
        <span className="text-gray-300 dark:text-gray-600">/</span>
        <span className="text-gray-700 dark:text-gray-300 font-medium">Manajemen Pengguna</span>
      </div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-2xl font-700 text-gray-900 dark:text-white">Manajemen Pengguna</h1>
        <Link to="/admin/kyc" className="text-sm text-brand-500 hover:underline flex items-center gap-1">
          <ShieldCheck size={14} /> Review KYC ({kycRequests.filter(k => k.status === 'pending').length})
        </Link>
      </div>

      <div className="flex gap-2 mb-4">
        {['teknisi', 'pelanggan'].map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-4 py-2 rounded-xl text-sm font-medium capitalize transition-colors ${tab === t ? 'bg-brand-500 text-white' : 'bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400'}`}>
            {t} ({t === 'teknisi' ? technicians.length : customers.length})
          </button>
        ))}
      </div>

      <div className="relative mb-4">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          value={query}
          onChange={e => setQuery(e.target.value)}
          className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 text-gray-900 dark:text-white placeholder-gray-400"
          placeholder={tab === 'teknisi' ? 'Cari teknisi atau spesialisasi...' : 'Cari nama, email, atau kota...'}
        />
      </div>

      {tab === 'teknisi' ? (
        <Card>
          {filteredTechs.length === 0 ? (
            <EmptyState icon={Users} title="Teknisi tidak ditemukan" desc="Coba kata kunci lain" />
          ) : (
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
                  {filteredTechs.map((t, i) => (
                    <tr key={t.id} className={`border-b border-gray-50 dark:border-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800/50 ${i === filteredTechs.length - 1 ? 'border-0' : ''}`}>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-lg bg-brand-100 dark:bg-brand-900/30 flex items-center justify-center text-brand-600 dark:text-brand-400 font-semibold text-xs">{t.name.charAt(0)}</div>
                          <div>
                            <span className="font-medium text-gray-900 dark:text-white block">{t.name}</span>
                            <span className="text-xs text-gray-400">{t.location}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-gray-500 dark:text-gray-400">{t.specialty}</td>
                      <td className="px-4 py-3"><Badge color={t.verified ? 'green' : 'orange'}>{t.verified ? 'Verified' : 'Pending'}</Badge></td>
                      <td className="px-4 py-3 text-gray-900 dark:text-white">{t.rating} ★ <span className="text-xs text-gray-400">({t.reviews})</span></td>
                      <td className="px-4 py-3">
                        <div className="flex gap-2">
                          {!t.verified && (
                            <button onClick={() => handleApproveKYC(t)} className="px-2 py-1 rounded-lg bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 text-xs font-medium hover:bg-green-100 dark:hover:bg-green-900/30">
                              Setujui
                            </button>
                          )}
                          <button onClick={() => navigate(`/admin/users/tech/${t.id}`)} className="px-2 py-1 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 text-xs font-medium hover:bg-gray-200 dark:hover:bg-gray-700">
                            <Eye size={12} className="inline mr-1" />Detail
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      ) : (
        <Card>
          {filteredCustomers.length === 0 ? (
            <EmptyState icon={Users} title="Pelanggan tidak ditemukan" desc="Coba kata kunci lain" />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="border-b border-gray-100 dark:border-gray-800">
                  <tr className="text-xs text-gray-500 dark:text-gray-400 text-left">
                    <th className="px-4 py-3 font-medium">Nama</th>
                    <th className="px-4 py-3 font-medium">Email</th>
                    <th className="px-4 py-3 font-medium">Kota</th>
                    <th className="px-4 py-3 font-medium">Total Order</th>
                    <th className="px-4 py-3 font-medium">Total Belanja</th>
                    <th className="px-4 py-3 font-medium">Status</th>
                    <th className="px-4 py-3 font-medium">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCustomers.map((c, i) => (
                    <tr key={c.id} className={`border-b border-gray-50 dark:border-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800/50 ${i === filteredCustomers.length - 1 ? 'border-0' : ''}`}>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-lg bg-accent-100 dark:bg-accent-900/30 flex items-center justify-center text-accent-600 dark:text-accent-400 font-semibold text-xs">{c.name.charAt(0)}</div>
                          <span className="font-medium text-gray-900 dark:text-white">{c.name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-gray-500 dark:text-gray-400">{c.email}</td>
                      <td className="px-4 py-3 text-gray-500 dark:text-gray-400">{c.city}</td>
                      <td className="px-4 py-3 text-gray-900 dark:text-white">{c.orders}</td>
                      <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">Rp{c.totalSpent.toLocaleString('id')}</td>
                      <td className="px-4 py-3">
                        <Badge color={c.status === 'active' ? 'green' : 'red'}>
                          {c.status === 'active' ? 'Aktif' : 'Suspended'}
                        </Badge>
                      </td>
                      <td className="px-4 py-3">
                        <button onClick={() => navigate(`/admin/users/customer/${c.id}`)} className="px-2 py-1 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 text-xs font-medium hover:bg-gray-200 dark:hover:bg-gray-700">
                          <Eye size={12} className="inline mr-1" />Detail
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      )}

    </AdminLayout>
  )
}

export function AdminDisputes() {
  const { id } = useParams()
  const navigate = useNavigate()
  const disputes = getDisputes()

  if (id) {
    return <DisputeDetail id={id} onBack={() => navigate('/admin/disputes')} />
  }

  return (
    <AdminLayout>
      <div className="flex items-center gap-2 text-sm mb-6">
        <button onClick={() => navigate('/admin')} className="flex items-center gap-1.5 text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors font-medium">
          <ArrowLeft size={15} />Dashboard
        </button>
        <span className="text-gray-300 dark:text-gray-600">/</span>
        <span className="text-gray-700 dark:text-gray-300 font-medium">Arbitrase Sengketa</span>
      </div>
      <h1 className="font-display text-2xl font-700 text-gray-900 dark:text-white mb-2">Arbitrase Sengketa</h1>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">Sengketa yang menunggu keputusan arbitrase admin</p>
      <div className="space-y-3">
        {disputes.map(d => (
          <Card key={d.id} hover className="p-5" onClick={() => navigate(`/admin/disputes/${d.id}`)}>
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
                <p className="text-xs text-gray-400 mt-1">Order {d.order}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </AdminLayout>
  )
}

function DisputeDetail({ id, onBack }) {
  const navigate = useNavigate()
  const d = getDisputeById(id)

  if (!d) {
    return (
      <AdminLayout>
      <div className="flex items-center gap-2 text-sm mb-6">
        <button onClick={() => navigate('/admin/disputes')} className="flex items-center gap-1.5 text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors font-medium">
          <ArrowLeft size={15} />Arbitrase Sengketa
        </button>
        <span className="text-gray-300 dark:text-gray-600">/</span>
        <span className="text-gray-700 dark:text-gray-300 font-medium">Detail Sengketa</span>
      </div>
        <EmptyState icon={AlertTriangle} title="Sengketa tidak ditemukan" desc="ID sengketa tidak valid" />
      </AdminLayout>
    )
  }

  const handleResolve = (resolution, label) => {
    if (!confirm(`Konfirmasi: ${label}?`)) return
    resolveDispute(id, resolution)
    addAuditLog({ actor: 'Admin', action: 'resolve_dispute', target: `${id} (${resolution})` })
    toast.success(`Sengketa ${id} diputuskan: ${label}`)
    navigate('/admin/disputes')
  }

  return (
    <AdminLayout>
      <div className="flex items-center gap-2 text-sm mb-6">
        <button onClick={() => navigate('/admin/disputes')} className="flex items-center gap-1.5 text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors font-medium">
          <ArrowLeft size={15} />Arbitrase Sengketa
        </button>
        <span className="text-gray-300 dark:text-gray-600">/</span>
        <span className="text-gray-700 dark:text-gray-300 font-medium">Detail Sengketa</span>
      </div>
      <h1 className="font-display text-2xl font-700 text-gray-900 dark:text-white mb-2">Sengketa {d.id}</h1>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">Order {d.order} • Dibuka {d.openedAt}</p>

      <div className="grid md:grid-cols-2 gap-4 mb-4">
        <Card className="p-5">
          <p className="text-xs text-gray-400 uppercase tracking-wide mb-2">Pelapor (Pelanggan)</p>
          <p className="font-semibold text-gray-900 dark:text-white text-lg mb-2">{d.claimant}</p>
          <p className="text-sm text-gray-600 dark:text-gray-400 italic">"{d.issue}"</p>
        </Card>
        <Card className="p-5">
          <p className="text-xs text-gray-400 uppercase tracking-wide mb-2">Teknisi Terdakwa</p>
          <p className="font-semibold text-gray-900 dark:text-white text-lg mb-2">{d.tech}</p>
          <p className="text-sm text-gray-500">Jumlah escrow: <span className="font-semibold text-gray-900 dark:text-white">Rp{d.amount.toLocaleString('id')}</span></p>
        </Card>
      </div>

      <Card className="p-5 mb-4">
        <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Rekomendasi AI</h3>
        <div className="p-4 rounded-xl bg-brand-50 dark:bg-brand-900/20 text-sm text-brand-700 dark:text-brand-300">
          <p>Berdasarkan analisis kronologi order, foto dokumentasi, dan riwayat komunikasi: kemungkinan <span className="font-bold">{d.aiConfidence}%</span> pelanggan memiliki klaim yang valid.</p>
          <p className="mt-2 font-medium">Disarankan: {d.aiRecommendation}</p>
        </div>
      </Card>

      {d.status === 'resolved' ? (
        <Card className="p-5">
          <div className="flex items-center gap-3 mb-2">
            <CheckCircle size={20} className="text-green-500" />
            <h3 className="font-semibold text-gray-900 dark:text-white">Sengketa Selesai</h3>
          </div>
          <p className="text-sm text-gray-500">
            Diputus: <span className="font-medium text-gray-900 dark:text-white">{d.resolution === 'refund_customer' ? 'Refund ke Pelanggan' : d.resolution === 'forward_tech' ? 'Teruskan ke Teknisi' : 'Bagi Rata'}</span>
            {' • '}{d.resolvedAt}
          </p>
        </Card>
      ) : (
        <div className="flex flex-col sm:flex-row gap-3">
          <Button variant="danger" onClick={() => handleResolve('refund_customer', 'Refund ke Pelanggan')} className="flex-1">
            Refund ke Pelanggan
          </Button>
          <Button variant="teal" onClick={() => handleResolve('forward_tech', 'Teruskan ke Teknisi')} className="flex-1">
            Teruskan ke Teknisi
          </Button>
          <Button variant="outline" onClick={() => handleResolve('bagi_rata', 'Bagi Rata')} className="flex-1">
            Bagi Rata 50/50
          </Button>
        </div>
      )}
    </AdminLayout>
  )
}

export function AdminAds() {
  const navigate = useNavigate()
  const partners = getPartners()

  return (
    <AdminLayout>
      <div className="flex items-center gap-2 text-sm mb-6">
        <button onClick={() => navigate('/admin')} className="flex items-center gap-1.5 text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors font-medium">
          <ArrowLeft size={15} />Dashboard
        </button>
        <span className="text-gray-300 dark:text-gray-600">/</span>
        <span className="text-gray-700 dark:text-gray-300 font-medium">Iklan & Partnership</span>
      </div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-2xl font-700 text-gray-900 dark:text-white">Iklan & Partnership</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Overview partner aktif dan slot iklan tersedia</p>
        </div>
        <Button onClick={() => navigate('/admin/ads/manage')}>
          <Megaphone size={14} /> Kelola Campaign
        </Button>
      </div>

      <div className="grid md:grid-cols-3 gap-3 mb-6">
        <StatCard label="Revenue Iklan" value={`Rp${(partners.reduce((s, p) => s + p.revenue, 0) / 1000).toFixed(0)}rb`} sub="/bulan" icon={DollarSign} color="green" />
        <StatCard label="Partner Aktif" value={String(partners.length)} sub="vendor & toko" icon={Users} color="blue" />
        <StatCard label="Slot Tersedia" value="3" sub="banner homepage" icon={Megaphone} color="orange" />
      </div>

      <Card className="p-5 mb-4">
        <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Partner Aktif</h3>
        {partners.length === 0 ? (
          <EmptyState icon={Users} title="Belum ada partner" desc="Tambah partner pertama" />
        ) : (
          <div className="space-y-3">
            {partners.map(p => (
              <div key={p.id} onClick={() => navigate(`/admin/ads/partners/${p.id}`)} className="flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-gray-800 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700">
                <div>
                  <p className="font-medium text-gray-900 dark:text-white text-sm">{p.name}</p>
                  <p className="text-xs text-gray-500">{p.type} • {p.contact}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-green-600 dark:text-green-400">Rp{p.revenue.toLocaleString('id')}/bln</p>
                  <Badge color="green">Aktif</Badge>
                </div>
              </div>
            ))}
          </div>
        )}
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
                {s.status === 'available' && (
                  <Button size="sm" variant="outline" onClick={() => toast.info('Fitur assign partner segera hadir!')}>
                    Assign
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      </Card>
    </AdminLayout>
  )
}
