import { useState, useMemo } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { ArrowLeft, Mail, Phone, MapPin, Calendar, Star, CheckCircle, XCircle, AlertTriangle, Edit, Ban, MessageCircle, DollarSign, TrendingUp, TrendingDown, Image as ImageIcon, BarChart2, Eye, EyeOff, Trash2, CheckCheck, Send, Briefcase, FileText, ExternalLink, UserX, UserCheck } from 'lucide-react'
import { Card, Badge, Button } from '../../components/UI'
import { getCustomerById, getTechnicianById, getOrders, getKYCRequests, getReviews, getAdCampaignById, getPartnerById, getSupportTickets, updateReviewStatus, updateTicketStatus, addTicketReply } from '../../store'
import toast from 'react-hot-toast'

function Stat({ label, value, sub, accent = 'text-gray-900 dark:text-white' }) {
  return (
    <Card className="p-4">
      <p className="text-xs text-gray-500 dark:text-gray-400">{label}</p>
      <p className={`text-xl font-display font-700 mt-1 ${accent}`}>{value}</p>
      {sub && <p className="text-xs text-gray-500 mt-1">{sub}</p>}
    </Card>
  )
}

function StarRating({ value, size = 14 }) {
  return (
    <div className="inline-flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map(n => (
        <Star key={n} size={size} className={n <= Math.round(value) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'} />
      ))}
    </div>
  )
}

function CustomerDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const customer = getCustomerById(id)
  const [tab, setTab] = useState('profile')
  if (!customer) {
    return (
      <div className="p-6 max-w-5xl mx-auto">
        <Button variant="ghost" onClick={() => navigate(-1)}><ArrowLeft size={16} className="mr-1" />Kembali</Button>
        <Card className="p-8 mt-4 text-center"><p className="text-gray-500">Pelanggan tidak ditemukan</p></Card>
      </div>
    )
  }
  const orders = getOrders().filter(o => o.customerId === customer.id || o.customer === customer.name)
  const reviews = getReviews().filter(r => r.customerId === customer.id)
  const tickets = getSupportTickets().filter(t => t.customerId === customer.id)
  const totalSpent = orders.reduce((s, o) => s + (o.amount || 0), 0)
  const completed = orders.filter(o => o.status === 'done').length
  const tabs = [
    { id: 'profile',  label: 'Profil'    },
    { id: 'orders',   label: `Order (${orders.length})` },
    { id: 'reviews',  label: `Review (${reviews.length})` },
    { id: 'activity', label: `Aktivitas (${tickets.length})` },
  ]
  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <Button variant="ghost" onClick={() => navigate(-1)}><ArrowLeft size={16} className="mr-1" />Kembali</Button>
        <span className="text-gray-300">/</span>
        <Link to="/admin/users" className="text-sm text-gray-500 hover:text-brand-500">Pengguna</Link>
        <span className="text-gray-300">/</span>
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{customer.name}</span>
      </div>
      <Card className="p-6 mb-6">
        <div className="flex items-start gap-5">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-brand-500 to-accent-500 text-white flex items-center justify-center text-2xl font-bold flex-shrink-0">
            {customer.name?.split(' ').slice(0, 2).map(w => w[0]).join('')}
          </div>
          <div className="flex-1">
            <div className="flex items-start justify-between flex-wrap gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl font-display font-700 text-gray-900 dark:text-white">{customer.name}</h1>
                  {customer.verified && <CheckCircle size={18} className="text-blue-500 fill-blue-500/20" />}
                </div>
                <p className="text-sm text-gray-500 mt-1">ID: #{String(customer.id).padStart(4, '0')}</p>
                <div className="flex items-center gap-2 mt-2">
                  <Badge color={customer.status === 'active' ? 'green' : 'red'}>{customer.status === 'active' ? 'Aktif' : 'Suspended'}</Badge>
                  <Badge color={customer.tier === 'gold' ? 'yellow' : customer.tier === 'silver' ? 'gray' : 'blue'}>{customer.tier?.toUpperCase()}</Badge>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm"><Mail size={14} className="mr-1" />Email</Button>
                <Button variant="outline" size="sm"><MessageCircle size={14} className="mr-1" />Chat</Button>
                {customer.status === 'active' ? (
                  <Button variant="outline" size="sm" className="text-red-600 border-red-200 hover:bg-red-50"><Ban size={14} className="mr-1" />Suspend</Button>
                ) : (
                  <Button variant="outline" size="sm" className="text-green-600 border-green-200 hover:bg-green-50"><UserCheck size={14} className="mr-1" />Aktifkan</Button>
                )}
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-5">
              <Stat label="Total Belanja" value={`Rp ${totalSpent.toLocaleString('id')}`} />
              <Stat label="Order Selesai"  value={completed} sub={`dari ${orders.length} total`} />
              <Stat label="Risk Score"     value={customer.riskScore ?? 0} accent={customer.riskScore > 50 ? 'text-red-600' : 'text-green-600'} />
              <Stat label="Bergabung"      value={customer.joined} />
            </div>
          </div>
        </div>
      </Card>
      <div className="flex items-center gap-1 border-b border-gray-200 dark:border-gray-700 mb-5 overflow-x-auto">
        {tabs.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${tab === t.id ? 'border-brand-500 text-brand-500' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>
            {t.label}
          </button>
        ))}
      </div>
      {tab === 'profile' && (
        <Card className="p-6">
          <h3 className="text-lg font-display font-600 text-gray-900 dark:text-white mb-4">Informasi Pribadi</h3>
          <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div><dt className="text-xs text-gray-500">Email</dt><dd className="text-sm font-medium text-gray-900 dark:text-white flex items-center gap-2"><Mail size={14} className="text-gray-400" />{customer.email}</dd></div>
            <div><dt className="text-xs text-gray-500">Telepon</dt><dd className="text-sm font-medium text-gray-900 dark:text-white flex items-center gap-2"><Phone size={14} className="text-gray-400" />{customer.phone}</dd></div>
            <div className="md:col-span-2"><dt className="text-xs text-gray-500">Alamat</dt><dd className="text-sm font-medium text-gray-900 dark:text-white flex items-center gap-2"><MapPin size={14} className="text-gray-400" />{customer.address}</dd></div>
            <div><dt className="text-xs text-gray-500">Bergabung Sejak</dt><dd className="text-sm font-medium text-gray-900 dark:text-white flex items-center gap-2"><Calendar size={14} className="text-gray-400" />{customer.joined}</dd></div>
            <div><dt className="text-xs text-gray-500">Aktif Terakhir</dt><dd className="text-sm font-medium text-gray-900 dark:text-white">{customer.lastActive || customer.joined}</dd></div>
          </dl>
        </Card>
      )}
      {tab === 'orders' && (
        <Card>
          {orders.length === 0 ? <p className="p-6 text-center text-gray-500">Belum ada order</p> : (
            <div className="divide-y divide-gray-100 dark:divide-gray-700">
              {orders.map(o => (
                <Link to={`/admin/transactions/${o.id}`} key={o.id} className="flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                  <div>
                    <p className="font-semibold text-sm text-gray-900 dark:text-white">{o.id}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{o.service} · Teknisi: {o.tech}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{o.date}</p>
                  </div>
                  <div className="text-right">
                    <Badge color={o.status === 'done' ? 'green' : o.status === 'in_progress' ? 'blue' : 'yellow'}>{o.status === 'done' ? 'Selesai' : o.status === 'in_progress' ? 'Berjalan' : 'Menunggu'}</Badge>
                    <p className="font-semibold text-sm text-gray-900 dark:text-white mt-1">Rp {(o.amount || 0).toLocaleString('id')}</p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </Card>
      )}
      {tab === 'reviews' && (
        <Card>
          {reviews.length === 0 ? <p className="p-6 text-center text-gray-500">Belum ada review</p> : (
            <div className="divide-y divide-gray-100 dark:divide-gray-700">
              {reviews.map(r => (
                <div key={r.id} className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-sm text-gray-900 dark:text-white">Order {r.orderId}</span>
                      <StarRating value={r.rating} />
                    </div>
                    <Badge color={r.status === 'approved' ? 'green' : r.status === 'flagged' ? 'red' : 'gray'}>{r.status}</Badge>
                  </div>
                  <p className="text-sm text-gray-700 dark:text-gray-300">{r.text || <em className="text-gray-400">Tanpa komentar</em>}</p>
                </div>
              ))}
            </div>
          )}
        </Card>
      )}
      {tab === 'activity' && (
        <div className="space-y-3">
          {tickets.length === 0 ? <Card className="p-6 text-center text-gray-500">Belum ada aktivitas support</Card> : tickets.map(t => (
            <Card key={t.id} className="p-4">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <p className="font-semibold text-sm text-gray-900 dark:text-white">{t.subject}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{t.id} · {t.category} · {t.createdAt}</p>
                </div>
                <Badge color={t.status === 'resolved' ? 'green' : t.status === 'in_progress' ? 'blue' : 'yellow'}>{t.status}</Badge>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

function TechnicianDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const tech = getTechnicianById(id)
  const [tab, setTab] = useState('profile')
  if (!tech) {
    return (
      <div className="p-6 max-w-5xl mx-auto">
        <Button variant="ghost" onClick={() => navigate(-1)}><ArrowLeft size={16} className="mr-1" />Kembali</Button>
        <Card className="p-8 mt-4 text-center"><p className="text-gray-500">Teknisi tidak ditemukan</p></Card>
      </div>
    )
  }
  const orders = getOrders().filter(o => o.techId === tech.id || o.tech === tech.name)
  const reviews = getReviews().filter(r => r.techId === tech.id)
  const kyc = getKYCRequests().find(k => k.name === tech.name)
  const completed = orders.filter(o => o.status === 'done').length
  const revenue = orders.filter(o => o.status === 'done').reduce((s, o) => s + (o.amount || 0), 0)
  const tabs = [
    { id: 'profile',  label: 'Profil'  },
    { id: 'jobs',     label: `Job (${orders.length})` },
    { id: 'ratings',  label: `Rating (${reviews.length})` },
    { id: 'revenue',  label: 'Pendapatan' },
    { id: 'kyc',      label: 'KYC' },
  ]
  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <Button variant="ghost" onClick={() => navigate(-1)}><ArrowLeft size={16} className="mr-1" />Kembali</Button>
        <span className="text-gray-300">/</span>
        <Link to="/admin/users" className="text-sm text-gray-500 hover:text-brand-500">Pengguna</Link>
        <span className="text-gray-300">/</span>
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{tech.name}</span>
      </div>
      <Card className="p-6 mb-6">
        <div className="flex items-start gap-5">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-teal-500 to-blue-500 text-white flex items-center justify-center text-2xl font-bold flex-shrink-0">
            {tech.name?.split(' ').slice(0, 2).map(w => w[0]).join('')}
          </div>
          <div className="flex-1">
            <div className="flex items-start justify-between flex-wrap gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl font-display font-700 text-gray-900 dark:text-white">{tech.name}</h1>
                  {tech.verified && <CheckCircle size={18} className="text-blue-500 fill-blue-500/20" />}
                </div>
                <p className="text-sm text-gray-500 mt-1">{tech.specialty} · {tech.location}</p>
                <div className="flex items-center gap-2 mt-2">
                  <StarRating value={tech.rating} />
                  <span className="text-sm font-medium text-gray-900 dark:text-white">{tech.rating}</span>
                  <span className="text-xs text-gray-500">({tech.reviews} review)</span>
                  <Badge color={tech.status === 'online' ? 'green' : 'gray'}>{tech.status === 'online' ? 'Online' : 'Offline'}</Badge>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm"><Mail size={14} className="mr-1" />Email</Button>
                <Button variant="outline" size="sm"><MessageCircle size={14} className="mr-1" />Chat</Button>
                <Button variant="outline" size="sm"><Edit size={14} className="mr-1" />Edit</Button>
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-5">
              <Stat label="Pendapatan" value={`Rp ${revenue.toLocaleString('id')}`} sub="dari job selesai" />
              <Stat label="Job Selesai" value={completed} sub={`dari ${orders.length} total`} />
              <Stat label="Rating"      value={`${tech.rating} / 5`} sub={`${tech.reviews} ulasan`} />
              <Stat label="Bergabung"   value={tech.joined} />
            </div>
          </div>
        </div>
      </Card>
      <div className="flex items-center gap-1 border-b border-gray-200 dark:border-gray-700 mb-5 overflow-x-auto">
        {tabs.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${tab === t.id ? 'border-brand-500 text-brand-500' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>
            {t.label}
          </button>
        ))}
      </div>
      {tab === 'profile' && (
        <Card className="p-6">
          <h3 className="text-lg font-display font-600 text-gray-900 dark:text-white mb-4">Informasi Teknisi</h3>
          <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div><dt className="text-xs text-gray-500">Spesialisasi</dt><dd className="text-sm font-medium text-gray-900 dark:text-white">{tech.specialty}</dd></div>
            <div><dt className="text-xs text-gray-500">Tarif Mulai</dt><dd className="text-sm font-medium text-gray-900 dark:text-white">Rp {tech.price?.toLocaleString('id')}</dd></div>
            <div className="md:col-span-2"><dt className="text-xs text-gray-500">Lokasi</dt><dd className="text-sm font-medium text-gray-900 dark:text-white flex items-center gap-2"><MapPin size={14} className="text-gray-400" />{tech.location}</dd></div>
            <div><dt className="text-xs text-gray-500">Bergabung Sejak</dt><dd className="text-sm font-medium text-gray-900 dark:text-white">{tech.joined}</dd></div>
            <div><dt className="text-xs text-gray-500">KYC Status</dt><dd className="text-sm font-medium text-gray-900 dark:text-white">{kyc ? kyc.status : 'Belum disubmit'}</dd></div>
          </dl>
        </Card>
      )}
      {tab === 'jobs' && (
        <Card>
          {orders.length === 0 ? <p className="p-6 text-center text-gray-500">Belum ada job</p> : (
            <div className="divide-y divide-gray-100 dark:divide-gray-700">
              {orders.map(o => (
                <Link to={`/admin/transactions/${o.id}`} key={o.id} className="flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                  <div>
                    <p className="font-semibold text-sm text-gray-900 dark:text-white">{o.id}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{o.service}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{o.customer} · {o.date}</p>
                  </div>
                  <div className="text-right">
                    <Badge color={o.status === 'done' ? 'green' : o.status === 'in_progress' ? 'blue' : 'yellow'}>{o.status === 'done' ? 'Selesai' : o.status === 'in_progress' ? 'Berjalan' : 'Menunggu'}</Badge>
                    <p className="font-semibold text-sm text-gray-900 dark:text-white mt-1">Rp {(o.amount || 0).toLocaleString('id')}</p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </Card>
      )}
      {tab === 'ratings' && (
        <Card>
          {reviews.length === 0 ? <p className="p-6 text-center text-gray-500">Belum ada rating</p> : (
            <div className="divide-y divide-gray-100 dark:divide-gray-700">
              {reviews.map(r => (
                <div key={r.id} className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <p className="font-semibold text-sm text-gray-900 dark:text-white">{r.customerName}</p>
                      <StarRating value={r.rating} />
                    </div>
                    <span className="text-xs text-gray-400">{r.createdAt}</span>
                  </div>
                  <p className="text-sm text-gray-700 dark:text-gray-300">{r.text || <em className="text-gray-400">Tanpa komentar</em>}</p>
                </div>
              ))}
            </div>
          )}
        </Card>
      )}
      {tab === 'revenue' && (
        <div className="space-y-4">
          <Stat label="Pendapatan Total" value={`Rp ${revenue.toLocaleString('id')}`} accent="text-green-600" sub="dari job selesai" />
          <Stat label="Rata-rata / Job"  value={completed > 0 ? `Rp ${Math.round(revenue / completed).toLocaleString('id')}` : 'Rp 0'} sub={`dari ${completed} job selesai`} />
          <Stat label="Pendapatan 20% Admin Fee" value={`Rp ${Math.round(revenue * 0.2).toLocaleString('id')}`} sub="share ke platform" accent="text-brand-500" />
        </div>
      )}
      {tab === 'kyc' && (
        <Card className="p-6">
          {kyc ? (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <p className="font-semibold text-gray-900 dark:text-white">Dokumen KYC</p>
                <Badge color={kyc.status === 'approved' ? 'green' : kyc.status === 'rejected' ? 'red' : 'yellow'}>{kyc.status}</Badge>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Tanggal submit: {kyc.submittedAt}</p>
              {kyc.status === 'rejected' && kyc.rejectionReason && <p className="text-sm text-red-600">Alasan: {kyc.rejectionReason}</p>}
              <div className="grid grid-cols-2 gap-3 mt-3">
                {kyc.ktpPhotoUrl && <div><p className="text-xs text-gray-500 mb-1">Foto KTP</p><img src={kyc.ktpPhotoUrl} alt="KTP" className="rounded-lg border border-gray-200 dark:border-gray-700" /></div>}
                {kyc.selfiePhotoUrl && <div><p className="text-xs text-gray-500 mb-1">Selfie</p><img src={kyc.selfiePhotoUrl} alt="Selfie" className="rounded-lg border border-gray-200 dark:border-gray-700" /></div>}
              </div>
            </div>
          ) : <p className="text-center text-gray-500">Belum ada data KYC untuk teknisi ini</p>}
        </Card>
      )}
    </div>
  )
}

function CampaignDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const campaign = getAdCampaignById(id)
  if (!campaign) {
    return (
      <div className="p-6 max-w-5xl mx-auto">
        <Button variant="ghost" onClick={() => navigate(-1)}><ArrowLeft size={16} className="mr-1" />Kembali</Button>
        <Card className="p-8 mt-4 text-center"><p className="text-gray-500">Kampanye tidak ditemukan</p></Card>
      </div>
    )
  }
  const partner = getPartnerById(campaign.partnerId)
  const ctr = campaign.impressions > 0 ? ((campaign.clicks / campaign.impressions) * 100).toFixed(2) : 0
  const convRate = campaign.clicks > 0 ? ((campaign.conversions / campaign.clicks) * 100).toFixed(2) : 0
  const maxDaily = Math.max(...(campaign.dailyStats || []).map(d => d.impressions), 1)
  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <Button variant="ghost" onClick={() => navigate(-1)}><ArrowLeft size={16} className="mr-1" />Kembali</Button>
        <span className="text-gray-300">/</span>
        <Link to="/admin/ads/manage" className="text-sm text-gray-500 hover:text-brand-500">Kampanye</Link>
        <span className="text-gray-300">/</span>
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{campaign.name}</span>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Stat label="Tayangan"   value={campaign.impressions?.toLocaleString('id') || 0} />
        <Stat label="Klik"        value={campaign.clicks?.toLocaleString('id') || 0} />
        <Stat label="Konversi"    value={campaign.conversions?.toLocaleString('id') || 0} />
        <Stat label="Spend"       value={`Rp ${(campaign.spend || 0).toLocaleString('id')}`} accent="text-brand-500" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Stat label="CTR"         value={`${ctr}%`} sub="click-through rate" />
        <Stat label="Conv Rate"   value={`${convRate}%`} sub="click ke konversi" />
        <Stat label="CPC"         value={`Rp ${campaign.clicks > 0 ? Math.round(campaign.spend / campaign.clicks).toLocaleString('id') : 0}`} sub="cost per click" />
      </div>
      <Card className="p-6 mb-6">
        <h3 className="text-lg font-display font-600 text-gray-900 dark:text-white mb-4">Detail Kampanye</h3>
        <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div><dt className="text-xs text-gray-500">Status</dt><dd className="mt-1"><Badge color={campaign.status === 'active' ? 'green' : campaign.status === 'paused' ? 'yellow' : 'gray'}>{campaign.status === 'active' ? 'Aktif' : campaign.status === 'paused' ? 'Dijeda' : 'Berakhir'}</Badge></dd></div>
          <div><dt className="text-xs text-gray-500">Partner</dt><dd className="text-sm font-medium text-gray-900 dark:text-white">{partner?.name || 'Internal'}</dd></div>
          <div><dt className="text-xs text-gray-500">Periode</dt><dd className="text-sm font-medium text-gray-900 dark:text-white">{campaign.startDate} → {campaign.endDate}</dd></div>
          <div><dt className="text-xs text-gray-500">Budget</dt><dd className="text-sm font-medium text-gray-900 dark:text-white">Rp {(campaign.budget || 0).toLocaleString('id')}</dd></div>
          <div className="md:col-span-2"><dt className="text-xs text-gray-500">Target Audience</dt><dd className="text-sm font-medium text-gray-900 dark:text-white">{campaign.targetAudience}</dd></div>
          {campaign.creativeUrl && <div className="md:col-span-2"><dt className="text-xs text-gray-500">Kreatif</dt><dd><img src={campaign.creativeUrl} alt="creative" className="mt-1 rounded-lg max-h-32" /></dd></div>}
        </dl>
      </Card>
      {campaign.dailyStats && campaign.dailyStats.length > 0 && (
        <Card className="p-6">
          <h3 className="text-lg font-display font-600 text-gray-900 dark:text-white mb-4">Performa Harian</h3>
          <div className="flex items-end gap-1 h-40">
            {campaign.dailyStats.map((d, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                <div className="w-full bg-brand-500/80 rounded-t" style={{ height: `${(d.impressions / maxDaily) * 100}%` }} title={`${d.impressions} impressions`} />
                <span className="text-[10px] text-gray-500 rotate-45 origin-top-left whitespace-nowrap">{d.date}</span>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-3 gap-4 mt-4 text-sm">
            <div><p className="text-xs text-gray-500">Total Tayangan</p><p className="font-semibold text-gray-900 dark:text-white">{campaign.dailyStats.reduce((s, d) => s + d.impressions, 0).toLocaleString('id')}</p></div>
            <div><p className="text-xs text-gray-500">Total Klik</p><p className="font-semibold text-gray-900 dark:text-white">{campaign.dailyStats.reduce((s, d) => s + d.clicks, 0).toLocaleString('id')}</p></div>
            <div><p className="text-xs text-gray-500">Total Konversi</p><p className="font-semibold text-gray-900 dark:text-white">{campaign.dailyStats.reduce((s, d) => s + d.conversions, 0).toLocaleString('id')}</p></div>
          </div>
        </Card>
      )}
    </div>
  )
}

function PartnerDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const partner = getPartnerById(id)
  if (!partner) {
    return (
      <div className="p-6 max-w-5xl mx-auto">
        <Button variant="ghost" onClick={() => navigate(-1)}><ArrowLeft size={16} className="mr-1" />Kembali</Button>
        <Card className="p-8 mt-4 text-center"><p className="text-gray-500">Partner tidak ditemukan</p></Card>
      </div>
    )
  }
  const campaigns = partner.campaigns || []
  const totalRevenue = campaigns.reduce((s, c) => s + (c.spend || 0), 0)
  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <Button variant="ghost" onClick={() => navigate(-1)}><ArrowLeft size={16} className="mr-1" />Kembali</Button>
        <span className="text-gray-300">/</span>
        <Link to="/admin/ads/partners" className="text-sm text-gray-500 hover:text-brand-500">Partner</Link>
        <span className="text-gray-300">/</span>
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{partner.name}</span>
      </div>
      <Card className="p-6 mb-6">
        <div className="flex items-start gap-5">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-accent-500 to-pink-500 text-white flex items-center justify-center text-2xl font-bold flex-shrink-0">
            {partner.name?.split(' ').slice(0, 2).map(w => w[0]).join('')}
          </div>
          <div className="flex-1">
            <h1 className="text-2xl font-display font-700 text-gray-900 dark:text-white">{partner.name}</h1>
            <p className="text-sm text-gray-500 mt-1">Tipe: {partner.type} · {partner.category}</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-5">
              <Stat label="Kampanye"     value={campaigns.length} />
              <Stat label="Total Spend"  value={`Rp ${totalRevenue.toLocaleString('id')}`} accent="text-brand-500" />
              <Stat label="Contract"     value={`${partner.contractStart} → ${partner.contractEnd}`} />
              <Stat label="Payout"       value={partner.payoutSchedule || '-'} />
            </div>
          </div>
        </div>
      </Card>
      <Card className="p-6 mb-6">
        <h3 className="text-lg font-display font-600 text-gray-900 dark:text-white mb-4">Kontak</h3>
        <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div><dt className="text-xs text-gray-500">Contact Person</dt><dd className="text-sm font-medium text-gray-900 dark:text-white">{partner.contactPerson || '-'}</dd></div>
          <div><dt className="text-xs text-gray-500">Telepon</dt><dd className="text-sm font-medium text-gray-900 dark:text-white flex items-center gap-2"><Phone size={14} className="text-gray-400" />{partner.phone || '-'}</dd></div>
          <div className="md:col-span-2"><dt className="text-xs text-gray-500">Email</dt><dd className="text-sm font-medium text-gray-900 dark:text-white flex items-center gap-2"><Mail size={14} className="text-gray-400" />{partner.email}</dd></div>
        </dl>
      </Card>
      <Card>
        <div className="p-4 border-b border-gray-100 dark:border-gray-700">
          <h3 className="text-lg font-display font-600 text-gray-900 dark:text-white">Kampanye ({campaigns.length})</h3>
        </div>
        {campaigns.length === 0 ? <p className="p-6 text-center text-gray-500">Belum ada kampanye</p> : (
          <div className="divide-y divide-gray-100 dark:divide-gray-700">
            {campaigns.map(c => (
              <Link to={`/admin/ads/manage/${c.id}`} key={c.id} className="flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                <div>
                  <p className="font-semibold text-sm text-gray-900 dark:text-white">{c.name}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{c.startDate} → {c.endDate}</p>
                </div>
                <div className="text-right">
                  <Badge color={c.status === 'active' ? 'green' : c.status === 'paused' ? 'yellow' : 'gray'}>{c.status}</Badge>
                  <p className="font-semibold text-sm text-gray-900 dark:text-white mt-1">Rp {(c.spend || 0).toLocaleString('id')}</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </Card>
    </div>
  )
}

function ReviewsModeration() {
  const navigate = useNavigate()
  const [filter, setFilter] = useState('pending')
  const [selected, setSelected] = useState(null)
  const reviews = getReviews()
  const filtered = filter === 'all' ? reviews : reviews.filter(r => r.status === filter)
  const counts = {
    pending: reviews.filter(r => r.status === 'pending').length,
    approved: reviews.filter(r => r.status === 'approved').length,
    hidden: reviews.filter(r => r.status === 'hidden').length,
    flagged: reviews.filter(r => r.flagged).length,
  }
  const handleApprove = (id) => {
    updateReviewStatus(id, 'approved')
    toast.success('Review disetujui')
    setSelected(null)
  }
  const handleHide = (id) => {
    updateReviewStatus(id, 'hidden')
    toast.success('Review disembunyikan')
    setSelected(null)
  }
  const handleFlag = (id) => {
    updateReviewStatus(id, 'pending', 'Inappropriate content')
    toast.success('Review ditandai untuk review')
    setSelected(null)
  }
  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <Button variant="ghost" onClick={() => navigate(-1)}><ArrowLeft size={16} className="mr-1" />Kembali</Button>
        <span className="text-gray-300">/</span>
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Moderasi Review</span>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <Card className="p-4 cursor-pointer hover:border-brand-500" onClick={() => setFilter('pending')}><p className="text-xs text-gray-500">Pending</p><p className="text-xl font-display font-700 text-yellow-600 mt-1">{counts.pending}</p></Card>
        <Card className="p-4 cursor-pointer hover:border-brand-500" onClick={() => setFilter('approved')}><p className="text-xs text-gray-500">Disetujui</p><p className="text-xl font-display font-700 text-green-600 mt-1">{counts.approved}</p></Card>
        <Card className="p-4 cursor-pointer hover:border-brand-500" onClick={() => setFilter('hidden')}><p className="text-xs text-gray-500">Disembunyikan</p><p className="text-xl font-display font-700 text-gray-600 mt-1">{counts.hidden}</p></Card>
        <Card className="p-4 cursor-pointer hover:border-brand-500" onClick={() => setFilter('flagged')}><p className="text-xs text-gray-500">Di-flag</p><p className="text-xl font-display font-700 text-red-600 mt-1">{counts.flagged}</p></Card>
      </div>
      <div className="flex items-center gap-1 border-b border-gray-200 dark:border-gray-700 mb-5">
        {['pending', 'approved', 'hidden', 'flagged', 'all'].map(f => (
          <button key={f} onClick={() => setFilter(f)} className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${filter === f ? 'border-brand-500 text-brand-500' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>
            {f === 'all' ? 'Semua' : f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>
      <Card>
        {filtered.length === 0 ? <p className="p-6 text-center text-gray-500">Tidak ada review</p> : (
          <div className="divide-y divide-gray-100 dark:divide-gray-700">
            {filtered.map(r => (
              <div key={r.id} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-semibold text-sm text-gray-900 dark:text-white">{r.customerName}</p>
                      <span className="text-xs text-gray-400">→</span>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{r.techName}</p>
                      <StarRating value={r.rating} />
                    </div>
                    <p className="text-sm text-gray-700 dark:text-gray-300 mb-1">{r.text || <em className="text-gray-400">Tanpa komentar</em>}</p>
                    <p className="text-xs text-gray-400">Order {r.orderId} · {r.createdAt}</p>
                    {r.flagged && <Badge color="red" className="mt-2">Flag: {r.flagReason || 'Konten tidak pantas'}</Badge>}
                  </div>
                  <div className="flex flex-col gap-2">
                    {r.status !== 'approved' && <Button size="sm" variant="outline" onClick={() => handleApprove(r.id)}><CheckCircle size={14} className="mr-1 text-green-600" />Setujui</Button>}
                    {r.status !== 'hidden' && <Button size="sm" variant="outline" onClick={() => handleHide(r.id)}><EyeOff size={14} className="mr-1" />Sembunyikan</Button>}
                    {!r.flagged && <Button size="sm" variant="outline" onClick={() => handleFlag(r.id)}><AlertTriangle size={14} className="mr-1 text-red-600" />Flag</Button>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  )
}

function SupportTickets() {
  const navigate = useNavigate()
  const [filter, setFilter] = useState('all')
  const [selected, setSelected] = useState(null)
  const [reply, setReply] = useState('')
  const tickets = getSupportTickets()
  const filtered = filter === 'all' ? tickets : tickets.filter(t => t.status === filter)
  const counts = {
    open: tickets.filter(t => t.status === 'open').length,
    in_progress: tickets.filter(t => t.status === 'in_progress').length,
    resolved: tickets.filter(t => t.status === 'resolved').length,
    closed: tickets.filter(t => t.status === 'closed').length,
  }
  const handleResolve = (id) => {
    updateTicketStatus(id, 'resolved')
    toast.success('Ticket ditandai resolved')
    setSelected(null)
  }
  const handleClose = (id) => {
    updateTicketStatus(id, 'closed')
    toast.success('Ticket ditutup')
    setSelected(null)
  }
  const handleReply = () => {
    if (!reply.trim() || !selected) return
    addTicketReply(selected.id, reply)
    toast.success('Balasan terkirim')
    setReply('')
    setSelected(tickets.find(t => t.id === selected.id))
  }
  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <Button variant="ghost" onClick={() => navigate(-1)}><ArrowLeft size={16} className="mr-1" />Kembali</Button>
        <span className="text-gray-300">/</span>
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Support Tickets</span>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <Card className="p-4"><p className="text-xs text-gray-500">Open</p><p className="text-xl font-display font-700 text-yellow-600 mt-1">{counts.open}</p></Card>
        <Card className="p-4"><p className="text-xs text-gray-500">In Progress</p><p className="text-xl font-display font-700 text-blue-600 mt-1">{counts.in_progress}</p></Card>
        <Card className="p-4"><p className="text-xs text-gray-500">Resolved</p><p className="text-xl font-display font-700 text-green-600 mt-1">{counts.resolved}</p></Card>
        <Card className="p-4"><p className="text-xs text-gray-500">Closed</p><p className="text-xl font-display font-700 text-gray-600 mt-1">{counts.closed}</p></Card>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <div className="flex items-center gap-1 border-b border-gray-200 dark:border-gray-700 mb-3">
            {['all', 'open', 'in_progress', 'resolved', 'closed'].map(f => (
              <button key={f} onClick={() => setFilter(f)} className={`px-3 py-1.5 text-sm font-medium border-b-2 transition-colors ${filter === f ? 'border-brand-500 text-brand-500' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>
                {f === 'all' ? 'Semua' : f.replace('_', ' ')}
              </button>
            ))}
          </div>
          <Card>
            {filtered.length === 0 ? <p className="p-6 text-center text-gray-500">Tidak ada ticket</p> : (
              <div className="divide-y divide-gray-100 dark:divide-gray-700">
                {filtered.map(t => (
                  <div key={t.id} onClick={() => setSelected(t)} className={`p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50 ${selected?.id === t.id ? 'bg-brand-50 dark:bg-brand-900/20' : ''}`}>
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <p className="font-semibold text-sm text-gray-900 dark:text-white">{t.id}</p>
                        <Badge color={t.priority === 'high' ? 'red' : t.priority === 'medium' ? 'yellow' : 'gray'}>{t.priority}</Badge>
                      </div>
                      <Badge color={t.status === 'open' ? 'yellow' : t.status === 'in_progress' ? 'blue' : t.status === 'resolved' ? 'green' : 'gray'}>{t.status.replace('_', ' ')}</Badge>
                    </div>
                    <p className="text-sm text-gray-700 dark:text-gray-300">{t.subject}</p>
                    <p className="text-xs text-gray-400 mt-1">{t.customerName} · {t.createdAt}</p>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>
        <div>
          {selected ? (
            <Card className="p-4 sticky top-4">
              <div className="mb-3">
                <p className="font-semibold text-gray-900 dark:text-white">{selected.id}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{selected.subject}</p>
                <div className="flex items-center gap-2 mt-2">
                  <Badge color="gray">{selected.category}</Badge>
                  <Badge color={selected.priority === 'high' ? 'red' : 'yellow'}>{selected.priority}</Badge>
                </div>
              </div>
              <div className="border-t border-gray-200 dark:border-gray-700 pt-3 mb-3 max-h-64 overflow-y-auto space-y-2">
                {selected.messages.map((m, i) => (
                  <div key={i} className={`p-2 rounded-lg text-sm ${m.from === 'admin' ? 'bg-brand-50 dark:bg-brand-900/20 ml-4' : 'bg-gray-50 dark:bg-gray-700/50 mr-4'}`}>
                    <p className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-0.5">{m.from === 'admin' ? 'Admin' : selected.customerName}</p>
                    <p className="text-gray-700 dark:text-gray-300">{m.text}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{m.at}</p>
                  </div>
                ))}
              </div>
              <textarea value={reply} onChange={(e) => setReply(e.target.value)} placeholder="Tulis balasan..." className="w-full p-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 mb-2" rows={3} />
              <div className="flex flex-wrap gap-2">
                <Button size="sm" onClick={handleReply} disabled={!reply.trim()}><Send size={14} className="mr-1" />Kirim</Button>
                {selected.status !== 'resolved' && <Button size="sm" variant="outline" onClick={() => handleResolve(selected.id)}><CheckCheck size={14} className="mr-1 text-green-600" />Resolve</Button>}
                {selected.status !== 'closed' && <Button size="sm" variant="outline" onClick={() => handleClose(selected.id)}><XCircle size={14} className="mr-1" />Close</Button>}
              </div>
            </Card>
          ) : (
            <Card className="p-6 text-center text-gray-500">
              <MessageCircle size={32} className="mx-auto mb-2 text-gray-300" />
              <p className="text-sm">Pilih ticket untuk melihat detail</p>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}

export { CustomerDetail, TechnicianDetail, CampaignDetail, PartnerDetail, ReviewsModeration, SupportTickets }
