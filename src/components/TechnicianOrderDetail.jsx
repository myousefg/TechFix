import { ArrowLeft } from 'lucide-react'
import { Card, EscrowStatus } from './UI'

export function TechnicianOrderDetail({ order, onBack }) {
  const latestUpdate = order.progressUpdates?.length ? order.progressUpdates[order.progressUpdates.length - 1] : null
  const chipStatus = order.status === 'waiting' ? 'waiting' : 
    (order.completed || latestUpdate?.status === 'Servis selesai, siap diambil') ? 'ready' : order.escrow

  return (
    <>
      <button onClick={onBack} className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 dark:hover:text-white mb-4">
        <ArrowLeft size={16} />Kembali
      </button>
      <h1 className="font-display text-xl font-700 text-gray-900 dark:text-white mb-4">Detail Order</h1>
      
      <Card className="p-5 mb-4">
        <div className="flex justify-between mb-2">
          <span className="font-mono text-sm text-brand-500">{order.id}</span>
          <EscrowStatus status={chipStatus} />
        </div>
        <p className="font-semibold text-gray-900 dark:text-white">{order.service}</p>
        <p className="text-sm text-gray-500 mt-1">Pelanggan: {order.customer} · {order.date}</p>
        {order.estimatedStart && (
          <p className="text-sm text-teal-600 dark:text-teal-400 mt-1">Estimasi mulai: {new Date(order.estimatedStart).toLocaleString('id-ID')}</p>
        )}
        <p className="text-sm font-semibold text-gray-900 dark:text-white mt-2">Rp{order.amount.toLocaleString('id')}</p>
        {order.techNotes && (
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">Catatan teknisi: {order.techNotes}</p>
        )}
      </Card>
    </>
  )
}
