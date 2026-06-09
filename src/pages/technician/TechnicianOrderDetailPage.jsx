import React, { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import toast from 'react-hot-toast'
import { ArrowLeft, Package, Home, TrendingUp, Star, Settings, LogOut, CheckCircle, ChevronRight, Upload, Camera, DollarSign, Clock } from 'lucide-react'
import { Card, Badge, Button, Input, EscrowStatus, StatCard, EmptyState } from '../../components/UI'
import { TechnicianOrderDetail } from '../../components/TechnicianOrderDetail'
import { AcceptOrderModal, RejectOrderModal, JobStatusModal } from '../../components/TechnicianModals'
import { getOrders, updateOrder, saveSession, loadSession, removeSession, getTechnicianProfile, saveTechnicianProfile } from '../../store'

export function TechnicianOrderDetailPage() {
  const navigate = useNavigate()
  const { id } = useParams()
  const [orders, setOrders] = useState(getOrders)
  const [updateSent, setUpdateSent] = useState(false)
  const [progressStatus, setProgressStatus] = useState('Diagnosa awal selesai')
  const [progressNotes, setProgressNotes] = useState('')
  const [showAcceptModal, setShowAcceptModal] = useState(false)
  const [showRejectModal, setShowRejectModal] = useState(false)
  const [showJobStatusModal, setShowJobStatusModal] = useState(false)
  const [jobStatusAction, setJobStatusAction] = useState('start')
  const order = orders.find(o => o.id === id)

  const latestUpdate = order?.progressUpdates?.length 
    ? order.progressUpdates[order.progressUpdates.length - 1] 
    : null
  const isServiceCompleted = !!order?.completed || (latestUpdate?.status === 'Servis selesai, siap diambil')

  if (!order) {
    return (
      <div className="pt-16 min-h-screen bg-gray-50 dark:bg-gray-950">
        <div className="max-w-2xl mx-auto px-4">
          <div className="py-6">
            <button onClick={() => navigate('/technician/orders')} className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 dark:hover:text-white mb-4">
              <ArrowLeft size={16} />Kembali
            </button>
            <EmptyState icon={Package} title="Order tidak ditemukan" desc="Order ini mungkin sudah dihapus atau tidak tersedia" />
          </div>
        </div>
      </div>
    )
  }

  function appendProgressUpdate(status, notes) {
    const prev = order.progressUpdates || []
    const entry = {
      id: Date.now(),
      time: new Date().toISOString(),
      status,
      notes: notes || ''
    }
    return [...prev, entry]
  }

  function handleUpdateStatus(orderId, statusText, notes) {
    const progressUpdates = appendProgressUpdate(statusText, notes)
    const updates = { techNotes: notes || '', progressUpdates }
    if (statusText === 'Servis selesai, siap diambil') {
      updates.escrow = 'progress'
      updates.completed = true
    }
    const updated = updateOrder(orderId, updates)
    setOrders(updated)
    setUpdateSent(true)
    toast.success('Update progres berhasil dikirim')
  }

  function handleProgressSubmit() {
    handleUpdateStatus(order.id, progressStatus, progressNotes)
  }

  function handleAccept(estimatedStart) {
    const updates = { status: 'progress', escrow: 'progress' }
    if (estimatedStart) {
      updates.estimatedStart = estimatedStart
    }
    const updated = updateOrder(order.id, updates)
    setOrders(updated)
    toast.success('Pesanan berhasil diterima')
    setShowAcceptModal(false)
  }

  function handleReject(reason, notes) {
    const rejectReason = typeof reason === 'object' ? reason.reason : reason
    const rejectNotes = typeof reason === 'object' ? reason.notes : notes
    const updated = updateOrder(order.id, { status: 'rejected', rejectionReason: rejectReason, rejectionNotes: rejectNotes || '' })
    setOrders(updated)
    toast.success(`Pesanan ditolak: ${rejectReason || 'alasan dicatat'}`)
    setShowRejectModal(false)
  }

  function handleJobStatus(action, notes) {
    const act = typeof action === 'object' ? action.action : action
    const nts = typeof action === 'object' ? action.notes : notes
    const statusLabel = act === 'complete' ? 'Servis selesai, siap diambil' : 'Update progres'
    const progressUpdates = appendProgressUpdate(statusLabel, nts)
    const updates = { techNotes: nts, progressUpdates }
    if (act === 'complete') {
      updates.escrow = 'progress'
      updates.completed = true
    }
    const updated = updateOrder(order.id, updates)
    setOrders(updated)
    toast.success(act === 'complete' ? 'Servis ditandai selesai' : 'Update progres dikirim')
    setShowJobStatusModal(false)
  }

  return (
    <div className="pt-16 min-h-screen bg-gray-50 dark:bg-gray-950">
      <div className="max-w-2xl mx-auto px-4">
        <div className="py-6">
          <TechnicianOrderDetail
            order={order}
            onBack={() => { 
              setUpdateSent(false); 
              setProgressStatus('Diagnosa awal selesai'); 
              setProgressNotes(''); 
              navigate('/technician/orders');
            }}
          />

          {(order.status === 'waiting' || order.status === 'progress') && (
            <Card className="p-5 mb-4">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Tindakan</h3>

              {order.status === 'waiting' && (
                <div className="flex flex-col sm:flex-row gap-2">
                  <Button className="flex-1" onClick={() => setShowAcceptModal(true)}>
                    Terima Pesanan
                  </Button>
                  <Button variant="outline" className="flex-1" onClick={() => setShowRejectModal(true)}>
                    Tolak Pesanan
                  </Button>
                </div>
              )}

              {order.status === 'progress' && (
                isServiceCompleted ? (
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    ✅ Servis selesai, siap diambil. Menunggu konfirmasi pelanggan.
                  </p>
                ) : (
                  <Button variant="outline" className="w-full" onClick={() => { setJobStatusAction('complete'); setShowJobStatusModal(true) }}>
                    Tandai Selesai Servis
                  </Button>
                )
              )}
            </Card>
          )}

          {order.status === 'progress' && !isServiceCompleted && !updateSent && (
            <Card className="p-5 mb-4">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Update Progres ke Pelanggan</h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Status</label>
                  <select 
                    value={progressStatus} 
                    onChange={(e) => setProgressStatus(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 text-gray-900 dark:text-white">
                    <option>Diagnosa awal selesai</option>
                    <option>Menunggu sparepart</option>
                    <option>Perbaikan berlangsung</option>
                    <option>Servis selesai, siap diambil</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Catatan untuk pelanggan</label>
                  <textarea
                    value={progressNotes}
                    onChange={(e) => setProgressNotes(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 text-gray-900 dark:text-white"
                    rows={3}
                    placeholder="Ceritakan kondisi perangkat..." />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Foto progres</label>
                  <div className="border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-xl p-4 text-center cursor-pointer hover:border-teal-400 transition-colors">
                    <Camera size={18} className="mx-auto text-gray-400 mb-1" />
                    <p className="text-xs text-gray-400">Upload foto</p>
                  </div>
                </div>
              </div>
              <Button variant="teal" className="w-full mt-4" onClick={handleProgressSubmit}>
                Kirim Update
              </Button>
            </Card>
          )}
          {order.status === 'progress' && !isServiceCompleted && updateSent && (
            <Card className="p-5 mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-teal-500/10 flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-teal-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="text-sm text-gray-700 dark:text-gray-300">Update progres berhasil dikirim ke pelanggan.</p>
              </div>
            </Card>
          )}

          {order.progressUpdates && order.progressUpdates.length > 0 && (
            <Card className="p-5 mb-4">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Riwayat Update Progres</h3>
              <div className="space-y-4">
                {[...order.progressUpdates].reverse().map((u) => (
                  <div key={u.id} className="border-l-2 border-teal-500 pl-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-900 dark:text-white">{u.status}</span>
                      <span className="text-xs text-gray-500">
                        {new Date(u.time).toLocaleString('id-ID', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    {u.notes && (
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{u.notes}</p>
                    )}
                  </div>
                ))}
              </div>
            </Card>
          )}

          {showAcceptModal && (
            <AcceptOrderModal
              order={order}
              onClose={() => setShowAcceptModal(false)}
              onAccept={handleAccept}
            />
          )}

          {showRejectModal && (
            <RejectOrderModal
              order={order}
              onClose={() => setShowRejectModal(false)}
              onReject={handleReject}
            />
          )}

          {showJobStatusModal && (
            <JobStatusModal
              order={order}
              action={jobStatusAction}
              onClose={() => setShowJobStatusModal(false)}
              onUpdate={handleJobStatus}
            />
          )}
        </div>
      </div>
    </div>
  )
}
