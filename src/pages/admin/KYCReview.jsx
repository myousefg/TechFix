import React, { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, CheckCircle, X, Shield, User, FileText, Camera, AlertTriangle } from 'lucide-react'
import { AdminLayout } from './index'
import { Card, Button, Badge } from '../../components/UI'
import { getKYCQueue, saveKYCQueue } from '../../store'

// ── KYC Queue List ───────────────────────────────────────────────
export function KYCList() {
  const navigate = useNavigate()
  const [queue, setQueue] = useState(getKYCQueue)

  const pending  = queue.filter(k => k.status === 'pending')
  const reviewed = queue.filter(k => k.status !== 'pending')

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div>
          <h1 className="font-display text-2xl font-700 text-gray-900 dark:text-white">Verifikasi KYC</h1>
          <p className="text-sm text-gray-500 mt-1">{pending.length} teknisi menunggu persetujuan</p>
        </div>
        {pending.length > 0 && (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400 text-xs font-medium">
            <AlertTriangle size={12} /> {pending.length} pending
          </div>
        )}
      </div>

      {pending.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Menunggu Review</h2>
          <div className="space-y-3">
            {pending.map(k => (
              <Card key={k.id} hover className="p-5" onClick={() => navigate(`/admin/kyc/${k.id}`)}>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center text-white font-display font-700 flex-shrink-0">
                    {k.name.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900 dark:text-white text-sm">{k.name}</p>
                    <p className="text-xs text-gray-500">{k.specialty} · Diajukan {k.submitted}</p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <Badge color="orange">Pending</Badge>
                    <button
                      onClick={e => { e.stopPropagation(); navigate(`/admin/kyc/${k.id}`) }}
                      className="text-xs px-3 py-1.5 rounded-lg bg-brand-500 text-white hover:bg-brand-600 font-medium press transition-colors">
                      Review
                    </button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {reviewed.length > 0 && (
        <div>
          <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Sudah Diproses</h2>
          <div className="space-y-2">
            {reviewed.map(k => (
              <Card key={k.id} className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-500 dark:text-gray-400 font-display font-700 text-sm flex-shrink-0">
                    {k.name.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300">{k.name}</p>
                    <p className="text-xs text-gray-400">{k.specialty}</p>
                  </div>
                  <Badge color={k.status === 'approved' ? 'green' : 'gray'}>
                    {k.status === 'approved' ? 'Disetujui' : 'Ditolak'}
                  </Badge>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {pending.length === 0 && reviewed.length === 0 && (
        <div className="text-center py-16 text-gray-400 text-sm">Tidak ada antrian KYC</div>
      )}
    </AdminLayout>
  )
}

// ── KYC Detail Review ────────────────────────────────────────────
export function KYCReview() {
  const navigate = useNavigate()
  const { id } = useParams()
  const [queue, setQueue] = useState(getKYCQueue)
  const applicant = queue.find(k => k.id === id) || queue[0]
  const [rejectReason, setRejectReason] = useState('')
  const [showReject, setShowReject] = useState(false)
  const [decision, setDecision] = useState(
    applicant?.status !== 'pending' ? applicant?.status : null
  )

  function approve() {
    const updated = queue.map(k => k.id === applicant.id ? { ...k, status: 'approved' } : k)
    setQueue(updated)
    saveKYCQueue(updated)
    setDecision('approved')
  }

  function reject() {
    const updated = queue.map(k =>
      k.id === applicant.id ? { ...k, status: 'rejected', reason: rejectReason } : k
    )
    setQueue(updated)
    saveKYCQueue(updated)
    setDecision('rejected')
    setShowReject(false)
  }

  if (!applicant) return null

  return (
    <AdminLayout>
      <button onClick={() => navigate('/admin/kyc')}
        className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 dark:hover:text-white mb-6 transition-colors">
        <ArrowLeft size={16} /> Kembali ke Antrian KYC
      </button>

      <div className="flex items-center gap-3 mb-6 flex-wrap">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center text-white font-display text-xl font-700 flex-shrink-0">
          {applicant.name.charAt(0)}
        </div>
        <div className="flex-1">
          <h1 className="font-display text-xl font-700 text-gray-900 dark:text-white">{applicant.name}</h1>
          <p className="text-sm text-gray-500">{applicant.specialty} · {applicant.id}</p>
        </div>
        {decision && (
          <Badge color={decision === 'approved' ? 'green' : 'gray'}>
            {decision === 'approved' ? 'Disetujui' : 'Ditolak'}
          </Badge>
        )}
      </div>

      <div className="grid sm:grid-cols-2 gap-4 mb-5">
        <Card className="p-5">
          <div className="flex items-center gap-2 mb-4">
            <User size={15} className="text-brand-500" />
            <h3 className="font-semibold text-gray-900 dark:text-white text-sm">Data Identitas</h3>
          </div>
          <div className="space-y-2 text-sm">
            {[['Nama', applicant.name], ['NIK', applicant.nik], ['Spesialisasi', applicant.specialty], ['Tanggal Submit', applicant.submitted]].map(([k, v]) => (
              <div key={k} className="flex justify-between gap-2">
                <span className="text-gray-500 flex-shrink-0">{k}</span>
                <span className="font-medium text-gray-900 dark:text-white text-right font-mono text-xs break-all">{v}</span>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-5">
          <div className="flex items-center gap-2 mb-4">
            <FileText size={15} className="text-brand-500" />
            <h3 className="font-semibold text-gray-900 dark:text-white text-sm">Dokumen KYC</h3>
          </div>
          <div className="space-y-3">
            {[
              { label: 'Foto KTP',       icon: FileText },
              { label: 'Selfie + KTP',   icon: Camera   },
            ].map(doc => (
              <div key={doc.label} className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-800">
                <doc.icon size={14} className="text-gray-400" />
                <span className="text-sm text-gray-700 dark:text-gray-300 flex-1">{doc.label}</span>
                <span className="text-xs text-green-600 dark:text-green-400 font-medium flex items-center gap-1">
                  <CheckCircle size={11} /> Uploaded
                </span>
              </div>
            ))}
            <div className="rounded-xl overflow-hidden bg-gradient-to-br from-blue-900 to-blue-800 p-4">
              <p className="text-xs text-blue-200 mb-1 font-mono">KARTU TANDA PENDUDUK</p>
              <p className="text-white font-semibold text-sm">{applicant.name}</p>
              <p className="text-blue-200 text-xs font-mono mt-1">{applicant.nik}</p>
              <p className="text-blue-300 text-xs mt-1">Bandung, Jawa Barat</p>
            </div>
          </div>
        </Card>
      </div>

      <Card className="p-5 mb-5">
        <div className="flex items-center gap-2 mb-4 flex-wrap">
          <Shield size={15} className="text-brand-500" />
          <h3 className="font-semibold text-gray-900 dark:text-white text-sm">AI Verification Score</h3>
          <Badge color="blue">Auto-analyzed</Badge>
        </div>
        <div className="space-y-3">
          {[
            { label: 'Keaslian KTP',            score: 94 },
            { label: 'Liveness check selfie',   score: 88 },
            { label: 'Face match KTP vs selfie', score: 91 },
            { label: 'NIK validity check',       score: 100 },
          ].map(item => (
            <div key={item.label}>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-gray-600 dark:text-gray-400">{item.label}</span>
                <span className="font-medium text-gray-900 dark:text-white">{item.score}%</span>
              </div>
              <div className="h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full">
                <div className="h-full bg-green-500 rounded-full" style={{ width: `${item.score}%` }} />
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4 p-3 rounded-xl bg-green-50 dark:bg-green-900/20 text-sm text-green-700 dark:text-green-400">
          ✅ AI Score: <strong>93/100</strong> — Dokumen valid. Rekomendasi: Setujui.
        </div>
      </Card>

      {!decision ? (
        <>
          {showReject ? (
            <Card className="p-5 animate-scale-in">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Alasan Penolakan</h3>
              <div className="space-y-2 mb-4">
                {['Foto KTP buram/tidak jelas', 'Selfie tidak sesuai KTP', 'NIK tidak valid', 'Dokumen diduga dipalsukan', 'Alasan lain'].map(r => (
                  <label key={r}
                    className={`flex items-center gap-3 p-2.5 rounded-xl border cursor-pointer transition-colors ${rejectReason === r ? 'border-red-400 bg-red-50 dark:bg-red-900/20' : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'}`}>
                    <input type="radio" name="reject" value={r} checked={rejectReason === r}
                      onChange={() => setRejectReason(r)} className="accent-red-500" />
                    <span className="text-sm text-gray-700 dark:text-gray-300">{r}</span>
                  </label>
                ))}
              </div>
              <div className="flex gap-3">
                <Button variant="outline" className="flex-1" onClick={() => setShowReject(false)}>Batal</Button>
                <Button variant="danger"  className="flex-1" disabled={!rejectReason} onClick={reject}>
                  Tolak Aplikasi
                </Button>
              </div>
            </Card>
          ) : (
            <div className="flex flex-col sm:flex-row gap-3">
              <Button variant="danger" className="flex-1" onClick={() => setShowReject(true)}>
                <X size={15} /> Tolak
              </Button>
              <Button className="flex-1" onClick={approve}>
                <CheckCircle size={15} /> Setujui & Verifikasi
              </Button>
            </div>
          )}
        </>
      ) : (
        <Card className={`p-5 text-center ${decision === 'approved' ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800' : 'bg-gray-50 dark:bg-gray-800'}`}>
          {decision === 'approved' ? (
            <>
              <CheckCircle size={24} className="text-green-500 mx-auto mb-2" />
              <p className="font-semibold text-green-700 dark:text-green-400">Aplikasi Disetujui</p>
              <p className="text-xs text-green-600 dark:text-green-500 mt-1">Teknisi sudah bisa menerima order di TechFix</p>
            </>
          ) : (
            <>
              <X size={24} className="text-gray-400 mx-auto mb-2" />
              <p className="font-semibold text-gray-600 dark:text-gray-300">Aplikasi Ditolak</p>
              <p className="text-xs text-gray-400 mt-1">Teknisi sudah dikirim notifikasi penolakan</p>
            </>
          )}
        </Card>
      )}
    </AdminLayout>
  )
}
