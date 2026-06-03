import { useState } from 'react'
import { X, Download, Send, Check, X as XIcon, Edit, Image as ImageIcon, Eye, Trash2, CheckCheck, MoreVertical, TrendingUp, Star, Award, Briefcase, DollarSign, Activity, Users, MessageCircle, Shield, Megaphone } from 'lucide-react'
import { Card, Badge, Button } from '../../components/UI'
import toast from 'react-hot-toast'

export function ImagePreviewModal({ image, title, onClose }) {
  if (!image) return null
  return (
    <div className="fixed inset-0 z-[60] bg-black/80 flex items-center justify-center p-4" onClick={onClose}>
      <div className="relative max-w-4xl w-full" onClick={e => e.stopPropagation()}>
        <button onClick={onClose} className="absolute -top-10 right-0 text-white/80 hover:text-white"><X size={24} /></button>
        {title && <p className="text-white text-sm mb-3 text-center">{title}</p>}
        <img src={image} alt={title || 'preview'} className="w-full h-auto rounded-lg shadow-2xl" />
        <div className="mt-3 flex justify-center gap-2">
          <Button size="sm" variant="outline" onClick={() => { const a = document.createElement('a'); a.href = image; a.download = 'image.jpg'; a.click(); toast.success('Download dimulai') }}><Download size={14} className="mr-1" />Download</Button>
        </div>
      </div>
    </div>
  )
}

export function BulkActionsBar({ selectedCount, onAction, onClear }) {
  if (selectedCount === 0) return null
  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-gray-900 dark:bg-gray-800 text-white rounded-full shadow-2xl px-5 py-3 flex items-center gap-3 animate-pulse-once">
      <span className="text-sm font-medium">{selectedCount} dipilih</span>
      <div className="h-5 w-px bg-white/20" />
      <button onClick={() => onAction('approve')} className="text-sm hover:text-green-400 flex items-center gap-1"><Check size={14} />Setujui</button>
      <button onClick={() => onAction('reject')}  className="text-sm hover:text-red-400 flex items-center gap-1"><XIcon size={14} />Tolak</button>
      <button onClick={() => onAction('export')}  className="text-sm hover:text-blue-400 flex items-center gap-1"><Download size={14} />Export</button>
      <button onClick={() => onAction('delete')}  className="text-sm hover:text-red-400 flex items-center gap-1"><Trash2 size={14} />Hapus</button>
      <div className="h-5 w-px bg-white/20" />
      <button onClick={onClear} className="text-sm text-white/60 hover:text-white">Batal</button>
    </div>
  )
}

export function QuickEditModal({ item, fields, onSave, onClose, title = 'Edit Cepat' }) {
  const [values, setValues] = useState(() => fields.reduce((acc, f) => ({ ...acc, [f.name]: item?.[f.name] ?? '' }), {}))
  const handleSave = () => {
    onSave(values)
    toast.success('Berhasil disimpan')
    onClose()
  }
  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4" onClick={onClose}>
      <Card className="p-6 max-w-md w-full" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-display font-600 text-gray-900 dark:text-white flex items-center gap-2"><Edit size={18} />{title}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
        </div>
        <div className="space-y-3">
          {fields.map(f => (
            <div key={f.name}>
              <label className="text-xs font-medium text-gray-700 dark:text-gray-300 block mb-1">{f.label}</label>
              {f.type === 'select' ? (
                <select value={values[f.name]} onChange={e => setValues(v => ({ ...v, [f.name]: e.target.value }))} className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800">
                  {f.options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
              ) : f.type === 'textarea' ? (
                <textarea value={values[f.name]} onChange={e => setValues(v => ({ ...v, [f.name]: e.target.value }))} rows={3} className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800" />
              ) : (
                <input type={f.type || 'text'} value={values[f.name]} onChange={e => setValues(v => ({ ...v, [f.name]: e.target.value }))} className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800" />
              )}
            </div>
          ))}
        </div>
        <div className="flex gap-2 mt-5">
          <Button variant="outline" onClick={onClose} className="flex-1">Batal</Button>
          <Button onClick={handleSave} className="flex-1">Simpan</Button>
        </div>
      </Card>
    </div>
  )
}

export function TopTechsLeaderboard({ limit = 5 }) {
  const data = [
    { rank: 1, name: 'Budi Santoso',  avatar: 'BS', jobs: 47, rating: 4.9, revenue: 14250000, badge: 'gold'   },
    { rank: 2, name: 'Rina Kusuma',   avatar: 'RK', jobs: 42, rating: 4.8, revenue: 12500000, badge: 'silver' },
    { rank: 3, name: 'Agus Pramono',  avatar: 'AP', jobs: 38, rating: 4.7, revenue: 11200000, badge: 'bronze' },
    { rank: 4, name: 'Dewi Lestari',  avatar: 'DL', jobs: 31, rating: 4.6, revenue:  9800000, badge: null     },
    { rank: 5, name: 'Reza Hidayat',  avatar: 'RH', jobs: 28, rating: 4.5, revenue:  8500000, badge: null     },
  ].slice(0, limit)
  const medals = { 1: '🥇', 2: '🥈', 3: '🥉' }
  return (
    <Card className="p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2"><Award size={16} className="text-yellow-500" />Top Teknisi</h3>
        <span className="text-xs text-gray-500">Bulan ini</span>
      </div>
      <div className="space-y-3">
        {data.map(t => (
          <div key={t.rank} className="flex items-center gap-3">
            <div className="w-8 h-8 flex items-center justify-center text-lg flex-shrink-0">{medals[t.rank] || <span className="text-sm font-semibold text-gray-500">#{t.rank}</span>}</div>
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-teal-500 to-blue-500 text-white flex items-center justify-center text-xs font-bold flex-shrink-0">{t.avatar}</div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{t.name}</p>
              <p className="text-xs text-gray-500">{t.jobs} job · <StarRatingSmall value={t.rating} /></p>
            </div>
            <div className="text-right">
              <p className="text-sm font-semibold text-gray-900 dark:text-white">Rp{(t.revenue / 1000000).toFixed(1)}jt</p>
              <p className="text-xs text-gray-500">{t.rating}★</p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  )
}

export function ActivityFeed({ limit = 8 }) {
  const events = [
    { type: 'order',     icon: Briefcase,  color: 'text-blue-500 bg-blue-50 dark:bg-blue-900/30',  text: 'Order TF-011 dibuat',                 sub: 'Muhammad Hashfi · 1 menit lalu',  path: '/admin/transactions/TF-011' },
    { type: 'kyc',       icon: Shield,     color: 'text-green-500 bg-green-50 dark:bg-green-900/30', text: 'KYC disetujui: Linda Permata',       sub: '5 menit lalu',                     path: '/admin/kyc/5' },
    { type: 'dispute',   icon: MessageCircle, color: 'text-red-500 bg-red-50 dark:bg-red-900/30', text: 'Dispute baru TF-004',                sub: 'Andi Rachman · 15 menit lalu',     path: '/admin/disputes' },
    { type: 'review',    icon: Star,       color: 'text-yellow-500 bg-yellow-50 dark:bg-yellow-900/30', text: 'Review 1 bintang masuk (flagged)', sub: 'Siti Mardiana · 30 menit lalu',    path: '/admin/reviews' },
    { type: 'ad',        icon: Megaphone,  color: 'text-purple-500 bg-purple-50 dark:bg-purple-900/30', text: 'Campaign dimulai: Corsair RAM',   sub: '1 jam lalu',                       path: '/admin/ads/manage/5' },
    { type: 'user',      icon: Users,      color: 'text-teal-500 bg-teal-50 dark:bg-teal-900/30', text: 'Customer baru: Hadi Wibowo',         sub: '2 jam lalu',                       path: '/admin/users/customer/10' },
    { type: 'payment',   icon: DollarSign, color: 'text-emerald-500 bg-emerald-50 dark:bg-emerald-900/30', text: 'Payout Rp 2.4jt ke ASUS',        sub: '3 jam lalu',                       path: '/admin/ads/partners/2' },
    { type: 'support',   icon: MessageCircle, color: 'text-orange-500 bg-orange-50 dark:bg-orange-900/30', text: 'Ticket baru: Maya Sari',         sub: '5 jam lalu',                       path: '/admin/support' },
  ].slice(0, limit)
  return (
    <Card className="p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2"><Activity size={16} className="text-brand-500" />Aktivitas Terbaru</h3>
        <a href="/admin/audit" className="text-xs text-brand-500 hover:underline">Lihat semua</a>
      </div>
      <div className="space-y-2">
        {events.map((e, i) => {
          const Icon = e.icon
          return (
            <a key={i} href={e.path} className="flex items-start gap-3 p-2 -mx-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${e.color}`}>
                <Icon size={14} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{e.text}</p>
                <p className="text-xs text-gray-500">{e.sub}</p>
              </div>
            </a>
          )
        })}
      </div>
    </Card>
  )
}

function StarRatingSmall({ value }) {
  return (
    <span className="inline-flex items-center gap-0.5">
      <Star size={10} className="fill-yellow-400 text-yellow-400" />
      <span>{value}</span>
    </span>
  )
}
