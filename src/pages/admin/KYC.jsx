import { useState } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { ArrowLeft, CheckCircle, XCircle, FileText, Camera, Shield } from 'lucide-react'
import { Card, Badge, Button } from '../../components/UI'
import { AdminLayout } from './index'
import { getKYCRequests, getKYCById, updateKYCStatus, addAuditLog } from '../../store'
import toast from 'react-hot-toast'

export function AdminKYC() {
  const requests = getKYCRequests()
  const pending = requests.filter(r => r.status === 'pending')
  const reviewed = requests.filter(r => r.status !== 'pending')
  const navigate = useNavigate()

  return (
    <AdminLayout>
      <div className="flex items-center gap-2 text-sm mb-6">
        <button onClick={() => navigate('/admin')} className="flex items-center gap-1.5 text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors font-medium">
          <ArrowLeft size={15} />Dashboard
        </button>
        <span className="text-gray-300 dark:text-gray-600">/</span>
        <span className="text-gray-700 dark:text-gray-300 font-medium">Review KYC</span>
      </div>
      <h1 className="font-display text-2xl font-700 text-gray-900 dark:text-white mb-2">Review KYC Teknisi</h1>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">Verifikasi identitas teknisi sebelum mereka bisa menerima order</p>

      <div className="grid grid-cols-3 gap-3 mb-6">
        <Card className="p-4 text-center">
          <p className="font-display text-2xl font-700 text-orange-500">{pending.length}</p>
          <p className="text-xs text-gray-500 mt-0.5">Menunggu Review</p>
        </Card>
        <Card className="p-4 text-center">
          <p className="font-display text-2xl font-700 text-green-500">{reviewed.filter(r => r.status === 'approved').length}</p>
          <p className="text-xs text-gray-500 mt-0.5">Disetujui</p>
        </Card>
        <Card className="p-4 text-center">
          <p className="font-display text-2xl font-700 text-red-500">{reviewed.filter(r => r.status === 'rejected').length}</p>
          <p className="text-xs text-gray-500 mt-0.5">Ditolak</p>
        </Card>
      </div>

      <h2 className="font-semibold text-gray-900 dark:text-white mb-3">Pengajuan Pending</h2>
      {pending.length === 0 ? (
        <Card className="p-8 text-center text-gray-400">
          <CheckCircle size={32} className="mx-auto mb-2 text-green-500" />
          <p className="font-medium text-gray-700 dark:text-gray-300">Tidak ada pengajuan pending</p>
          <p className="text-sm mt-1">Semua teknisi sudah diverifikasi</p>
        </Card>
      ) : (
        <div className="space-y-3 mb-6">
          {pending.map(r => (
            <Card key={r.id} hover className="p-4" onClick={() => navigate(`/admin/kyc/${r.id}`)}>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-brand-100 dark:bg-brand-900/30 flex items-center justify-center text-brand-600 dark:text-brand-400 font-semibold">
                  {r.techName.charAt(0)}
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900 dark:text-white">{r.techName}</p>
                  <p className="text-sm text-gray-500">{r.specialty}</p>
                </div>
                <div className="text-right">
                  <Badge color="orange">Pending</Badge>
                  <p className="text-xs text-gray-400 mt-1">{r.submitted}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {reviewed.length > 0 && (
        <>
          <h2 className="font-semibold text-gray-900 dark:text-white mb-3">Riwayat Review</h2>
          <Card>
            <div className="divide-y divide-gray-100 dark:divide-gray-800">
              {reviewed.map(r => (
                <Link key={r.id} to={`/admin/kyc/${r.id}`} className="flex items-center gap-4 p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                  <div className="w-10 h-10 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-600 dark:text-gray-400 font-semibold text-sm">
                    {r.techName.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900 dark:text-white text-sm">{r.techName}</p>
                    <p className="text-xs text-gray-500">Direview {r.reviewedAt}</p>
                  </div>
                  <Badge color={r.status === 'approved' ? 'green' : 'red'}>
                    {r.status === 'approved' ? 'Disetujui' : 'Ditolak'}
                  </Badge>
                </Link>
              ))}
            </div>
          </Card>
        </>
      )}
    </AdminLayout>
  )
}

export function AdminKYCDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const kyc = getKYCById(id)
  const [reason, setReason] = useState('')
  const [showRejectForm, setShowRejectForm] = useState(false)

  if (!kyc) {
    return (
      <AdminLayout>
        <div className="text-center py-12 text-gray-400">Pengajuan KYC tidak ditemukan</div>
      </AdminLayout>
    )
  }

  const handleApprove = () => {
    updateKYCStatus(id, 'approved')
    addAuditLog({ actor: 'Admin', action: 'approve_kyc', target: `${kyc.techName} (KYC #${id})` })
    toast.success(`${kyc.techName} disetujui sebagai teknisi terverifikasi`)
    navigate('/admin/kyc')
  }

  const handleReject = () => {
    if (!reason.trim()) {
      toast.error('Wajib isi alasan penolakan')
      return
    }
    updateKYCStatus(id, 'rejected')
    addAuditLog({ actor: 'Admin', action: 'reject_kyc', target: `${kyc.techName} – ${reason}` })
    toast.success(`Pengajuan ${kyc.techName} ditolak`)
    navigate('/admin/kyc')
  }

  return (
    <AdminLayout>
      <div className="flex items-center gap-2 text-sm mb-6">
        <button onClick={() => navigate('/admin/kyc')} className="flex items-center gap-1.5 text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors font-medium">
          <ArrowLeft size={15} />Review KYC
        </button>
        <span className="text-gray-300 dark:text-gray-600">/</span>
        <span className="text-gray-700 dark:text-gray-300 font-medium">Detail KYC</span>
      </div>
      <h1 className="font-display text-2xl font-700 text-gray-900 dark:text-white mb-2">Review KYC #{kyc.id}</h1>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">Diajukan {kyc.submitted}</p>

      <div className="grid md:grid-cols-2 gap-4 mb-6">
        <Card className="p-5">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-14 h-14 rounded-xl bg-brand-100 dark:bg-brand-900/30 flex items-center justify-center text-brand-600 dark:text-brand-400 font-display font-700 text-xl">
              {kyc.techName.charAt(0)}
            </div>
            <div>
              <p className="font-semibold text-gray-900 dark:text-white text-lg">{kyc.techName}</p>
              <p className="text-sm text-gray-500">{kyc.specialty}</p>
            </div>
          </div>
          <div className="space-y-2 text-sm border-t border-gray-100 dark:border-gray-800 pt-4">
            <div className="flex justify-between">
              <span className="text-gray-500">No. KTP</span>
              <span className="font-mono text-gray-900 dark:text-white">{kyc.ktpNumber}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Status</span>
              <Badge color={kyc.status === 'pending' ? 'orange' : kyc.status === 'approved' ? 'green' : 'red'}>
                {kyc.status === 'pending' ? 'Menunggu' : kyc.status === 'approved' ? 'Disetujui' : 'Ditolak'}
              </Badge>
            </div>
            {kyc.reviewedAt && (
              <div className="flex justify-between">
                <span className="text-gray-500">Direview</span>
                <span className="text-gray-900 dark:text-white">{kyc.reviewedAt}</span>
              </div>
            )}
          </div>
        </Card>

        <Card className="p-5">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Dokumen</h3>
          <div className="space-y-2">
            {kyc.docs.map(doc => (
              <div key={doc} className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-800">
                <div className="w-10 h-10 rounded-lg bg-white dark:bg-gray-900 flex items-center justify-center">
                  <FileText size={18} className="text-gray-500" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{doc}</p>
                  <p className="text-xs text-gray-400">Klik untuk preview</p>
                </div>
                <Button size="sm" variant="outline">Lihat</Button>
              </div>
            ))}
            <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-800">
              <div className="w-10 h-10 rounded-lg bg-white dark:bg-gray-900 flex items-center justify-center">
                <Camera size={18} className="text-gray-500" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900 dark:text-white">Selfie + KTP</p>
                <p className="text-xs text-gray-400">Verifikasi wajah</p>
              </div>
              <Button size="sm" variant="outline">Lihat</Button>
            </div>
          </div>
        </Card>
      </div>

      <Card className="p-5 mb-6">
        <div className="flex items-start gap-3">
          <Shield size={20} className="text-brand-500 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-gray-900 dark:text-white mb-1">Rekomendasi Sistem</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Dokumen lengkap dan konsisten dengan data profil. Tidak ada flag dari database blacklist. Disarankan untuk disetujui.
            </p>
          </div>
        </div>
      </Card>

      {kyc.status === 'pending' ? (
        showRejectForm ? (
          <Card className="p-5">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Alasan Penolakan</h3>
            <textarea
              value={reason}
              onChange={e => setReason(e.target.value)}
              rows={3}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 text-gray-900 dark:text-white placeholder-gray-400"
              placeholder="Jelaskan alasan penolakan (wajib diisi)..."
            />
            <div className="flex gap-3 mt-3">
              <Button variant="danger" onClick={handleReject} className="flex-1">
                <XCircle size={16} /> Konfirmasi Tolak
              </Button>
              <Button variant="outline" onClick={() => setShowRejectForm(false)} className="flex-1">
                Batal
              </Button>
            </div>
          </Card>
        ) : (
          <div className="flex gap-3">
            <Button onClick={handleApprove} className="flex-1">
              <CheckCircle size={16} /> Setujui KYC
            </Button>
            <Button variant="danger" onClick={() => setShowRejectForm(true)} className="flex-1">
              <XCircle size={16} /> Tolak
            </Button>
          </div>
        )
      ) : (
        <Card className="p-5 text-center">
          <Badge color={kyc.status === 'approved' ? 'green' : 'red'}>
            {kyc.status === 'approved' ? 'KYC Disetujui' : 'KYC Ditolak'}
          </Badge>
          <p className="text-sm text-gray-500 mt-2">Direview pada {kyc.reviewedAt}</p>
        </Card>
      )}
    </AdminLayout>
  )
}
