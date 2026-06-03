import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, Download, ChevronRight, ArrowLeft } from 'lucide-react'
import { AdminLayout } from './index'
import { Card, Badge, EscrowStatus } from '../../components/UI'
import { getAdminTransactions } from '../../store'

export default function AdminTransactions() {
  const navigate = useNavigate()
  const [txns] = useState(getAdminTransactions)
  const [query, setQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [selected, setSelected] = useState(null)

  const filtered = txns.filter(t => {
    const q = query.toLowerCase()
    const matchQ = q === '' || t.id.toLowerCase().includes(q) ||
      t.customer.toLowerCase().includes(q) || t.tech.toLowerCase().includes(q) ||
      t.service.toLowerCase().includes(q)
    const matchS = statusFilter === 'all' || t.status === statusFilter
    return matchQ && matchS
  })

  const totalRevenue = filtered.filter(t => t.status === 'done')
    .reduce((s, t) => s + t.amount * 0.1, 0)

  if (selected) {
    const t = txns.find(x => x.id === selected)
    return (
      <AdminLayout>
        <button onClick={() => setSelected(null)}
          className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 dark:hover:text-white mb-6 transition-colors">
          <ArrowLeft size={16} /> Kembali ke Transaksi
        </button>
        <h1 className="font-display text-xl font-700 text-gray-900 dark:text-white mb-6">
          Detail Transaksi {t.id}
        </h1>
        <div className="grid sm:grid-cols-2 gap-4 max-w-2xl">
          <Card className="p-5">
            <p className="text-xs text-gray-400 uppercase tracking-wide mb-3">Info Transaksi</p>
            <div className="space-y-2 text-sm">
              {[['ID', t.id], ['Tanggal', t.date], ['Layanan', t.service]].map(([k, v]) => (
                <div key={k} className="flex justify-between gap-2">
                  <span className="text-gray-500">{k}</span>
                  <span className="font-medium text-gray-900 dark:text-white text-right">{v}</span>
                </div>
              ))}
              <div className="flex justify-between gap-2">
                <span className="text-gray-500">Status</span>
                <EscrowStatus status={t.status} />
              </div>
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
                <p className="text-lg font-display font-700 text-gray-900 dark:text-white">
                  Rp{t.amount.toLocaleString('id')}
                </p>
                <p className="text-xs text-green-600 dark:text-green-400">
                  Komisi TechFix: Rp{(t.amount * 0.1).toLocaleString('id')}
                </p>
              </div>
            </div>
          </Card>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-6 gap-3 flex-wrap">
        <h1 className="font-display text-2xl font-700 text-gray-900 dark:text-white">Transaksi</h1>
        <button className="flex items-center gap-2 px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
          <Download size={14} /> Export CSV
        </button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        {[
          { label: 'Total Transaksi',  value: filtered.length },
          { label: 'Selesai',          value: filtered.filter(t => t.status === 'done').length },
          { label: 'Komisi TechFix',   value: 'Rp' + Math.round(totalRevenue).toLocaleString('id') },
        ].map(s => (
          <Card key={s.label} className="p-4 text-center">
            <p className="font-display text-xl font-700 text-gray-900 dark:text-white">{s.value}</p>
            <p className="text-xs text-gray-400 mt-0.5">{s.label}</p>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <div className="flex gap-3 mb-4 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
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

      {/* Table — scrollable on mobile */}
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[640px]">
            <thead className="border-b border-gray-100 dark:border-gray-800">
              <tr className="text-xs text-gray-500 dark:text-gray-400 text-left">
                {['ID', 'Tanggal', 'Layanan', 'Pelanggan', 'Teknisi', 'Jumlah', 'Status', ''].map(h => (
                  <th key={h} className="px-4 py-3 font-medium">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((t, i) => (
                <tr key={t.id}
                  className={`border-b border-gray-50 dark:border-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800/50 cursor-pointer transition-colors ${i === filtered.length - 1 ? 'border-0' : ''}`}
                  onClick={() => setSelected(t.id)}>
                  <td className="px-4 py-3 font-mono text-brand-500 font-medium">{t.id}</td>
                  <td className="px-4 py-3 text-gray-500 dark:text-gray-400 whitespace-nowrap">{t.date}</td>
                  <td className="px-4 py-3 text-gray-900 dark:text-white">{t.service}</td>
                  <td className="px-4 py-3 text-gray-600 dark:text-gray-400">{t.customer}</td>
                  <td className="px-4 py-3 text-gray-600 dark:text-gray-400">{t.tech}</td>
                  <td className="px-4 py-3 font-medium text-gray-900 dark:text-white whitespace-nowrap">
                    Rp{t.amount.toLocaleString('id')}
                  </td>
                  <td className="px-4 py-3"><EscrowStatus status={t.status} /></td>
                  <td className="px-4 py-3"><ChevronRight size={14} className="text-gray-300" /></td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={8} className="text-center py-12 text-gray-400 text-sm">
                    Tidak ada transaksi ditemukan
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </AdminLayout>
  )
}
