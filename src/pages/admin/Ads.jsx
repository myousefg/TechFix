import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Plus, Edit, Trash2, Eye, Megaphone, DollarSign, Users, TrendingUp, Pause, Play } from 'lucide-react'
import { Card, Badge, Button, StatCard, Input, EmptyState } from '../../components/UI'
import { AdminLayout } from './index'
import { getAdCampaigns, addAdCampaign, updateAdCampaign, removeAdCampaign, addAuditLog, getPartners } from '../../store'
import toast from 'react-hot-toast'

export function AdminAdsPage() {
  const navigate = useNavigate()
  const [campaigns, setCampaigns] = useState(getAdCampaigns())
  const partners = getPartners()
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState(null)

  const refresh = () => setCampaigns(getAdCampaigns())
  const totalRevenue = campaigns.reduce((s, c) => s + c.spent, 0)
  const totalImpressions = campaigns.reduce((s, c) => s + c.impressions, 0)
  const totalClicks = campaigns.reduce((s, c) => s + c.clicks, 0)
  const ctr = totalImpressions > 0 ? ((totalClicks / totalImpressions) * 100).toFixed(2) : '0.00'

  const handleDelete = (id, name) => {
    if (!confirm(`Hapus campaign "${name}"?`)) return
    removeAdCampaign(id)
    addAuditLog({ actor: 'Admin', action: 'delete_ad_campaign', target: name })
    refresh()
    toast.success('Campaign dihapus')
  }

  const handleToggleStatus = (c) => {
    const next = c.status === 'active' ? 'paused' : 'active'
    updateAdCampaign(c.id, { status: next })
    addAuditLog({ actor: 'Admin', action: next === 'paused' ? 'pause_ad_campaign' : 'resume_ad_campaign', target: c.name })
    refresh()
    toast.success(`Campaign ${next === 'paused' ? 'dijeda' : 'dilanjutkan'}`)
  }

  const handleEdit = (c) => {
    setEditing(c)
    setShowForm(true)
  }

  const handleNew = () => {
    setEditing(null)
    setShowForm(true)
  }

  if (showForm) {
    return <AdCampaignForm initial={editing} partners={partners} onClose={() => { setShowForm(false); setEditing(null) }} onSaved={refresh} />
  }

  return (
    <AdminLayout>
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 dark:hover:text-white mb-6 transition-colors">
        <ArrowLeft size={16} /> Kembali
      </button>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-2xl font-700 text-gray-900 dark:text-white">Manajemen Campaign Iklan</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Kelola banner, partnership, dan slot iklan</p>
        </div>
        <Button onClick={handleNew}><Plus size={16} /> Campaign Baru</Button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <StatCard label="Total Spent"     value={`Rp${(totalRevenue / 1000000).toFixed(1)}jt`} sub={`${campaigns.length} campaign`} icon={DollarSign} color="green" />
        <StatCard label="Impressions"     value={totalImpressions.toLocaleString('id')} sub="total views" icon={Eye} color="blue" />
        <StatCard label="Clicks"          value={totalClicks.toLocaleString('id')} sub="total klik"  icon={TrendingUp} color="teal" />
        <StatCard label="CTR"             value={`${ctr}%`} sub="click-through rate"  icon={Users} color="orange" />
      </div>

      {campaigns.length === 0 ? (
        <Card className="p-5">
          <EmptyState icon={Megaphone} title="Belum ada campaign" desc="Buat campaign pertama untuk mulai tampilkan iklan" />
        </Card>
      ) : (
        <div className="space-y-3">
          {campaigns.map(c => (
            <Card key={c.id} className="p-5">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-gray-900 dark:text-white">{c.name}</h3>
                    <Badge color={c.status === 'active' ? 'green' : c.status === 'paused' ? 'orange' : 'gray'}>
                      {c.status === 'active' ? 'Aktif' : c.status === 'paused' ? 'Dijeda' : 'Selesai'}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-500">{c.partner} • {c.slot}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{c.start} → {c.end}</p>
                </div>
                <div className="text-right">
                  <p className="font-display font-700 text-gray-900 dark:text-white">Rp{c.spent.toLocaleString('id')}</p>
                  <p className="text-xs text-gray-400">dari Rp{c.budget.toLocaleString('id')}</p>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3 mb-3 text-sm">
                <div>
                  <p className="text-xs text-gray-400">Impressions</p>
                  <p className="font-medium text-gray-900 dark:text-white">{c.impressions.toLocaleString('id')}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400">Clicks</p>
                  <p className="font-medium text-gray-900 dark:text-white">{c.clicks.toLocaleString('id')}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400">CTR</p>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {c.impressions > 0 ? ((c.clicks / c.impressions) * 100).toFixed(2) : '0.00'}%
                  </p>
                </div>
              </div>
              <div className="h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden mb-3">
                <div className="h-1.5 bg-brand-500 rounded-full" style={{ width: `${Math.min((c.spent / c.budget) * 100, 100)}%` }} />
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={() => handleToggleStatus(c)}>
                  {c.status === 'active' ? <><Pause size={14} /> Jeda</> : <><Play size={14} /> Lanjut</>}
                </Button>
                <Button size="sm" variant="outline" onClick={() => handleEdit(c)}>
                  <Edit size={14} /> Edit
                </Button>
                <Button size="sm" variant="outline" onClick={() => handleDelete(c.id, c.name)}>
                  <Trash2 size={14} /> Hapus
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </AdminLayout>
  )
}

function AdCampaignForm({ initial, partners, onClose, onSaved }) {
  const isEdit = !!initial
  const [form, setForm] = useState({
    name: initial?.name || '',
    slot: initial?.slot || 'Banner Homepage (Top)',
    partner: initial?.partner || partners[0]?.name || '',
    budget: initial?.budget || 1000000,
    spent: initial?.spent || 0,
    impressions: initial?.impressions || 0,
    clicks: initial?.clicks || 0,
    status: initial?.status || 'active',
    start: initial?.start || new Date().toLocaleDateString('id', { day: 'numeric', month: 'short', year: 'numeric' }),
    end: initial?.end || '',
  })

  const handleSave = () => {
    if (!form.name.trim() || !form.partner || !form.end) {
      toast.error('Lengkapi nama campaign, partner, dan tanggal berakhir')
      return
    }
    if (isEdit) {
      updateAdCampaign(initial.id, form)
      addAuditLog({ actor: 'Admin', action: 'update_ad_campaign', target: form.name })
      toast.success('Campaign diperbarui')
    } else {
      addAdCampaign(form)
      addAuditLog({ actor: 'Admin', action: 'create_ad_campaign', target: form.name })
      toast.success('Campaign baru dibuat')
    }
    onSaved()
    onClose()
  }

  return (
    <AdminLayout>
      <button onClick={onClose} className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 dark:hover:text-white mb-6 transition-colors">
        <ArrowLeft size={16} /> Kembali
      </button>
      <h1 className="font-display text-2xl font-700 text-gray-900 dark:text-white mb-6">
        {isEdit ? 'Edit' : 'Buat'} Campaign Iklan
      </h1>
      <Card className="p-6 max-w-2xl">
        <div className="space-y-4">
          <Input label="Nama Campaign" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="cth: Banner ASUS ROG Juni" />
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Slot Iklan</label>
            <select value={form.slot} onChange={e => setForm({ ...form, slot: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500">
              <option>Banner Homepage (Top)</option>
              <option>Banner Homepage (Mid)</option>
              <option>Sidebar App</option>
              <option>Push Notification Slot</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Partner</label>
            <select value={form.partner} onChange={e => setForm({ ...form, partner: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500">
              {partners.map(p => <option key={p.id} value={p.name}>{p.name} – {p.type}</option>)}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Input type="number" label="Budget (Rp)" value={form.budget} onChange={e => setForm({ ...form, budget: Number(e.target.value) })} />
            <Input type="date" label="Tanggal Berakhir" value={form.end} onChange={e => setForm({ ...form, end: e.target.value })} />
          </div>
        </div>
        <div className="flex gap-3 mt-6">
          <Button onClick={handleSave} className="flex-1">{isEdit ? 'Simpan Perubahan' : 'Buat Campaign'}</Button>
          <Button variant="outline" onClick={onClose} className="flex-1">Batal</Button>
        </div>
      </Card>
    </AdminLayout>
  )
}
