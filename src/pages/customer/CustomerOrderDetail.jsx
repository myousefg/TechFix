import React, { useState } from 'react'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import toast from 'react-hot-toast'
import { ArrowLeft, CheckCircle, MapPin, Search, Shield, Upload, CreditCard, ChevronRight, Bell, History, Settings, LogOut, Package, RefreshCw, CheckCheck, X, Star, AlertTriangle } from 'lucide-react'
import { Card, Badge, StarRating, TechnicianCard, Button, Input, EscrowStatus, EmptyState } from '../../components/UI'
import { CustomerLayout } from './index'
import { technicians, services, maintenancePlans } from '../../data'
import { getSubscription, saveSubscription, getOrders, addOrder, updateOrder, getAccountSettings, getNotifications, markNotifsRead, saveSession, loadSession, removeSession, remove, calculateDistance, getUserLocation } from '../../store'
import { WriteReviewModal, DisputeFormModal } from '../../components/CustomerModals'

export function CustomerOrderDetail() {
  const navigate = useNavigate()
  const { id } = useParams()
  const [orders, setOrders] = useState(getOrders)
  const order = orders.find(o => o.id === id)
  const [showReviewModal, setShowReviewModal] = useState(false)
  const [showDisputeModal, setShowDisputeModal] = useState(false)

  if (!order) {
    return (
      <CustomerLayout activeTab="orders">
        <div className="py-6">
          <button onClick={() => navigate('/customer/orders')} className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 dark:hover:text-white mb-4">
            <ArrowLeft size={16} />Kembali
          </button>
          <EmptyState icon={Package} title="Pesanan tidak ditemukan" desc="Order ini mungkin sudah dihapus atau tidak tersedia" />
        </div>
      </CustomerLayout>
    )
  }

  function confirmDone() {
    if (window.confirm('Konfirmasi servis selesai? Dana akan diteruskan ke teknisi.')) {
      const updated = updateOrder(order.id, { escrow: 'done', status: 'done' })
      setOrders(updated)
      toast.success('Dana telah diteruskan ke teknisi. Terima kasih!')
      navigate('/customer/orders')
    }
  }

  function handleReviewSubmit(rating, text) {
    toast.success('Review berhasil dikirim!')
    setShowReviewModal(false)
  }

  function handleDisputeSubmit(reason, evidence) {
    toast.success('Dispute berhasil diajukan. Tim kami akan segera meninjau.')
    setShowDisputeModal(false)
  }

  return (
    <CustomerLayout activeTab="orders">
      <div className="py-6">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 dark:hover:text-white mb-4">
          <ArrowLeft size={16} />Kembali
        </button>
        <h1 className="font-display text-xl font-700 text-gray-900 dark:text-white mb-4">Detail Pesanan</h1>
        <Card className="p-5 mb-4">
          <div className="flex justify-between mb-2">
            <span className="font-mono text-sm text-brand-500">{order.id}</span>
            <EscrowStatus status={order.escrow} />
          </div>
          <p className="font-semibold text-gray-900 dark:text-white">{order.service}</p>
          <p className="text-sm text-gray-500 mt-1">Teknisi: {order.tech} · {order.date}</p>
          <p className="text-sm font-semibold text-gray-900 dark:text-white mt-2">Rp{order.amount.toLocaleString('id')}</p>
        </Card>
        {order.escrow === 'progress' && (
          <Card className="p-5 mb-4">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Konfirmasi Servis Selesai</h3>
            <p className="text-sm text-gray-500 mb-4">Teknisi menandai servis selesai. Konfirmasi jika perangkat sudah kamu terima dengan baik.</p>
            <Button className="w-full" onClick={confirmDone}>Konfirmasi Selesai & Lepas Dana</Button>
          </Card>
        )}
        {order.escrow === 'waiting' && (
          <Card className="p-5 mb-4 bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800">
            <p className="text-sm text-yellow-700 dark:text-yellow-300">Menunggu teknisi mengkonfirmasi dan memulai servis.</p>
          </Card>
        )}
        {order.escrow === 'done' && (
          <Card className="p-5 mb-4 bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800">
            <div className="flex items-center gap-2 mb-4">
              <CheckCircle size={20} className="text-green-500" />
              <p className="text-sm text-green-700 dark:text-green-300">Servis selesai. Dana telah diteruskan ke teknisi.</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" className="flex-1" onClick={() => setShowReviewModal(true)}>
                <Star size={16} className="mr-2" />
                Tulis Review
              </Button>
              <Button variant="outline" className="flex-1" onClick={() => setShowDisputeModal(true)}>
                <AlertTriangle size={16} className="mr-2" />
                Ajukan Dispute
              </Button>
            </div>
          </Card>
        )}
        {(order.escrow === 'progress' || order.status === 'progress') && (
          <div className="flex justify-center mt-1">
            <button onClick={() => setShowDisputeModal(true)} className="text-xs text-gray-400 hover:text-red-500 transition-colors">
              <AlertTriangle size={12} className="inline mr-1" />Ajukan Dispute
            </button>
          </div>
        )}
      </div>
      <WriteReviewModal 
        isOpen={showReviewModal} 
        onClose={() => setShowReviewModal(false)} 
        order={order}
        onSubmit={handleReviewSubmit}
      />
      <DisputeFormModal
        isOpen={showDisputeModal}
        onClose={() => setShowDisputeModal(false)}
        order={order}
        onSubmit={handleDisputeSubmit}
      />
    </CustomerLayout>
  )
}
