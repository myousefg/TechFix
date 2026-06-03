import { useState, useMemo } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Search, Download, ArrowLeft, Calendar, X } from 'lucide-react'
import { Card, EscrowStatus } from '../../components/UI'
import { getAdminTransactions, addAuditLog } from '../../store'
import { AdminLayout } from './index'
import toast from 'react-hot-toast'

const monthMap = {
  'Jan': 0, 'Feb': 1, 'Mar': 2, 'Apr': 3, 'Mei': 4, 'Jun': 5,
  'Jul': 6, 'Agu': 7, 'Sep': 8, 'Okt': 9, 'Nov': 10, 'Des': 11,
}

const parseDate = (dateStr) => {
  const parts = dateStr.split(' ')
  if (parts.length !== 3) return null
  const day = parseInt(parts[0])
  const month = monthMap[parts[1].replace('.', '')] ?? 0
  const year = parseInt(parts[2])
  return new Date(year, month, day)
}

export default function AdminTransactions() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [txns] = useState(getAdminTransactions)
  const [query, setQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')

  const filtered = useMemo(() => {
    return txns.filter(t => {
      const matchQuery = query === '' || t.id.toLowerCase().includes(query.toLowerCase()) ||
        t.customer.toLowerCase().includes(query.toLowerCase()) ||
        t.tech.toLowerCase().includes(query.toLowerCase()) ||
        t.service.toLowerCase().includes(query.toLowerCase())
      const matchStatus = statusFilter === 'all' || t.status === statusFilter
      const txDate = parseDate(t.date)
      const matchFrom = !dateFrom || (txDate && txDate >= new Date(dateFrom))
      const matchTo = !dateTo || (txDate && txDate <= new Date(dateTo))
      return matchQuery && matchStatus && matchFrom && matchTo
    })
  }, [txns, query, statusFilter, dateFrom, dateTo])

  const totalRevenue = filtered.filter(t => t.status === 'done').reduce((s, t) => s + t.amount * 0.1, 0)

  const handleExportCSV = () => {
    const headers = ['ID', 'Tanggal', 'Pelanggan', 'Teknisi', 'Layanan', 'Jumlah', 'Status']
    const rows = filtered.map(t => [
      t.id,
      t.date,
      t.customer,
      t.tech,
      t.service,
      t.amount,
      t.status
    ])
    const csvContent = [
      headers.join(','),
      ...rows.map(r => r.join(','))
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', `transactions-${new Date().toISOString().split('T')[0]}.csv`)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    addAuditLog({ actor: 'Admin', action: 'export_csv', target: 'transactions' })
    toast.success('CSV berhasil didownload')
  }

  const clearDateFilter = () => {
    setDateFrom('')
    setDateTo('')
  }

  if (id) {
    const t = txns.find(x => x.id === id)
    if (!t) {
      return (
        <AdminLayout>
          <button onClick={() => navigate('/admin/transactions')} className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 dark:hover:text-white mb-6 transition-colors">
            <ArrowLeft size={16} /> Kembali ke Transaksi
          </button>
          <div className="text-center py-12 text-gray-400">Transaksi tidak ditemukan</div>
        </AdminLayout>
      )
    }
    return (
      <AdminLayout>
        <button onClick={() => navigate('/admin/transactions')} className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 dark:hover:text-white mb-6 transition-colors">
          <ArrowLeft size={16} /> Kembali ke Transaksi
        </button>
        <h1 className="font-display text-xl font-700 text-gray-900 dark:text-white mb-6">Detail Transaksi {t.id}</h1>
        <div className="grid md:grid-cols-2 gap-4 max-w-2xl">
          <Card className="p-5">
            <p className="text-xs text-gray-400 uppercase tracking-wide mb-3">Info Transaksi</p>
            <div className="space-y-2 text-sm">
              {[['ID', t.id], ['Tanggal', t.date], ['Layanan', t.service], ['Status', null]].map(([k, v]) => (
                <div key={k} className="flex justify-between">
                  <span className="text-gray-500">{k}</span>
                  {k === 'Status' ? <EscrowStatus status={t.status} /> : <span className="font-medium text-gray-900 dark:text-white">{v}</span>}
                </div>
              ))}
            </div>
          </Card>
          <Card className="p-5">
            <p className="text-xs text-gray-400 uppercase tracking-wide mb-3">Pihak Terlibat</p>
            <div className="space-y-3">
              <div>
                <p className="text-xs text-gray-400">Pelanggan</p>
                <p className="text-sm font-medium text-gray-900 dark:text-white">{t.customer}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400">Teknisi</p>
                <p className="text-sm font-medium text-gray-900 dark:text-white">{t.tech}</p>
              </div>
              <div className="border-t border-gray-100 dark:border-gray-800 pt-2">
                <p className="text-xs text-gray-400">Nilai Transaksi</p>
                <p className="text-lg font-display font-700 text-gray-900 dark:text-white">Rp{t.amount.toLocaleString('id')}</p>
                <p className="text-xs text-green-600 dark:text-green-400">Komisi TechFix: Rp{(t.amount * 0.1).toLocaleString('id')}</p>
              </div>
            </div>
          </Card>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-2xl font-700 text-gray-900 dark:text-white">Transaksi</h1>
        <button onClick={handleExportCSV} className="flex items-center gap-2 px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
          <Download size={14} /> Export CSV
        </button>
      </div>

      <div className="grid grid-cols-3 gap-3 mb-6">
        {[
          { label: 'Total Transaksi',    value: filtered.length },
          { label: 'Selesai',            value: filtered.filter(t=>t.status==='done').length },
          { label: 'Komisi TechFix',     value: 'Rp'+Math.round(totalRevenue).toLocaleString('id') },
        ].map(s => (
          <Card key={s.label} className="p-4 text-center">
            <p className="font-display text-xl font-700 text-gray-900 dark:text-white">{s.value}</p>
            <p className="text-xs text-gray-400 mt-0.5">{s.label}</p>
          </Card>
        ))}
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <div className="relative flex-1">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input value={query} onChange={e => setQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 text-gray-900 dark:text-white placeholder-gray-400"
            placeholder="Cari ID, nama, atau layanan..." />
        </div>
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
          className="px-3 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-brand-500">
          <option value="all">Semua Status</option>
          <option value="done">Selesai</option>
          <option value="progress">Berlangsung</option>
          <option value="waiting">Menunggu</option>
        </select>
      </div>

      <Card className="p-4 mb-4">
        <div className="flex items-center gap-2 mb-2">
          <Calendar size={14} className="text-gray-500" />
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Filter Tanggal</p>
          {(dateFrom || dateTo) && (
            <button onClick={clearDateFilter} className="text-xs text-brand-500 hover:underline flex items-center gap-1">
              <X size={12} /> Reset
            </button>
          )}
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <input type="date" value={dateFrom} onChange={e => setDateFrom(e.target.value)}
            className="flex-1 px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500" />
          <span className="self-center text-gray-400 text-sm">→</span>
          <input type="date" value={dateTo} onChange={e => setDateTo(e.target.value)}
            className="flex-1 px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500" />
        </div>
      </Card>

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-gray-100 dark:border-gray-800">
              <tr className="text-xs text-gray-500 dark:text-gray-400 text-left">
                {['ID','Tanggal','Layanan','Pelanggan','Teknisi','Jumlah','Status',''].map(h => (
                  <th key={h} className="px-4 py-3 font-medium">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((t, i) => (
                <tr key={t.id}
                  className={`border-b border-gray-50 dark:border-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800/50 cursor-pointer transition-colors ${i === filtered.length-1 ? 'border-0' : ''}`}
                  onClick={() => navigate(`/admin/transactions/${t.id}`)}>
                  <td className="px-4 py-3 font-mono text-brand-500 font-medium">{t.id}</td>
                  <td className="px-4 py-3 text-gray-500 dark:text-gray-400">{t.date}</td>
                  <td className="px-4 py-3 text-gray-900 dark:text-white">{t.service}</td>
                  <td className="px-4 py-3 text-gray-600 dark:text-gray-400">{t.customer}</td>
                  <td className="px-4 py-3 text-gray-600 dark:text-gray-400">{t.tech}</td>
                  <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">Rp{t.amount.toLocaleString('id')}</td>
                  <td className="px-4 py-3"><EscrowStatus status={t.status} /></td>
                  <td className="px-4 py-3 text-brand-500 text-xs font-medium">Detail →</td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="text-center py-12 text-gray-400 text-sm">Tidak ada transaksi ditemukan</div>
          )}
        </div>
      </Card>
    </AdminLayout>
  )
}
