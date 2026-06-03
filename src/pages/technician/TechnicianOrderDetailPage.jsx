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
  const [showAcceptModal, setShowAcceptModal] = useState(false)
  const [showRejectModal, setShowRejectModal] = useState(false)
  const [showJobStatusModal, setShowJobStatusModal] = useState(false)
  const [jobStatusAction, setJobStatusAction] = useState('start')
  const order = orders.find(o => o.id === id)

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

  function handleUpdateStatus(orderId, statusText) {
    if (statusText === 'Servis selesai, siap diambil') {
      const updated = updateOrder(orderId, { escrow: 'progress', status: 'progress' })
      setOrders(updated)
    }
    setUpdateSent(true)
    toast.success('Update progres berhasil dikirim')
  }

  function handleAccept(estimatedStart) {
    toast.success(estimatedStart ? 'Pesanan diterima. Estimasi mulai kerja telah dicatat.' : 'Pesanan berhasil diterima')
    setShowAcceptModal(false)
  }

  function handleReject(reason, notes) {
    const rejectReason = typeof reason === 'object' ? reason.reason : reason
    const rejectNotes = typeof reason === 'object' ? reason.notes : notes

    toast.success(rejectNotes ? `Pesanan ditolak: ${rejectReason}` : `Pesanan ditolak: ${rejectReason || 'alasan dicatat'}`)
    setShowRejectModal(false)
  }

  function handleJobStatus(action, notes) {
    const nextAction = typeof action === 'object' ? action.action : action
    const nextNotes = typeof action === 'object' ? action.notes : notes

    toast.success(nextAction === 'complete' ? 'Pekerjaan ditandai selesai' : 'Pekerjaan berhasil dimulai')
    setShowJobStatusModal(false)
  }

  return (
    <div className="pt-16 min-h-screen bg-gray-50 dark:bg-gray-950">
      <div className="max-w-2xl mx-auto px-4">
        <div className="py-6">
          <TechnicianOrderDetail
            order={order}
            updateSent={updateSent}
            onUpdateStatus={handleUpdateStatus}
            onBack={() => { setUpdateSent(false); navigate(-1) }}
          />

          {(order.status === 'waiting' || order.status === 'progress') && (
            <Card className="p-5 mb-4">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Aksi Order</h3>

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
                <div className="flex flex-col sm:flex-row gap-2">
                  <Button className="flex-1" onClick={() => { setJobStatusAction('start'); setShowJobStatusModal(true) }}>
                    Mulai Servis
                  </Button>
                  {order.escrow === 'progress' && (
                    <Button variant="outline" className="flex-1" onClick={() => { setJobStatusAction('complete'); setShowJobStatusModal(true) }}>
                      Tandai Selesai
                    </Button>
                  )}
                </div>
              )}
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
