import React, { useState } from 'react'
import toast from 'react-hot-toast'
import { Star, X, Upload } from 'lucide-react'
import { Card, Button, Input } from './UI'

export function WriteReviewModal({ isOpen, order, onClose, onSubmit }) {
  if (!isOpen) return null
  const [rating, setRating] = useState(5)
  const [text, setText] = useState('')
  
  const handleSubmit = () => {
    if (rating === 0) {
      toast.error('Pilih rating terlebih dahulu')
      return
    }
    onSubmit({ rating, text })
    toast.success('Review berhasil dikirim')
    onClose()
  }
  
  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4" onClick={onClose}>
      <Card className="max-w-md w-full" onClick={e => e.stopPropagation()}>
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-display font-600 text-gray-900 dark:text-white">Tulis Review</h3>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <X size={20} />
            </button>
          </div>
          
          <p className="text-sm text-gray-500 mb-3">{order.service} oleh {order.tech}</p>
          
          <div className="flex items-center gap-1 mb-4">
            {[1,2,3,4,5].map(n => (
              <button key={n} onClick={() => setRating(n)}>
                <Star size={24} className={n <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'} />
              </button>
            ))}
          </div>
          
          <textarea
            value={text}
            onChange={e => setText(e.target.value)}
            placeholder="Bagikan pengalaman Anda..."
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-sm text-gray-900 dark:text-white"
          />
          
          <div className="flex gap-2 mt-4">
            <Button variant="outline" onClick={onClose} className="flex-1">Batal</Button>
            <Button onClick={handleSubmit} className="flex-1">Kirim Review</Button>
          </div>
        </div>
      </Card>
    </div>
  )
}

export function PaymentConfirmationModal({ isOpen, order, method, onClose, onConfirm }) {
  if (!isOpen) return null
  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4" onClick={onClose}>
      <Card className="max-w-md w-full" onClick={e => e.stopPropagation()}>
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-display font-600 text-gray-900 dark:text-white">Konfirmasi Pembayaran</h3>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <X size={20} />
            </button>
          </div>
          
          <div className="mb-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Order ID</span>
              <span className="font-medium text-gray-900 dark:text-white">{order.id}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Layanan</span>
              <span className="font-medium text-gray-900 dark:text-white">{order.service}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Teknisi</span>
              <span className="font-medium text-gray-900 dark:text-white">{order.tech}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Metode Pembayaran</span>
              <span className="font-medium text-gray-900 dark:text-white">{method}</span>
            </div>
            <div className="flex justify-between text-sm pt-2 border-t">
              <span className="font-semibold text-gray-900 dark:text-white">Total</span>
              <span className="font-semibold text-brand-500">Rp{order.amount.toLocaleString('id')}</span>
            </div>
          </div>
          
          <p className="text-xs text-gray-500 mb-4">
            Dana akan ditahan di escrow TechFix hingga pekerjaan selesai. Garansi uang kembali jika servis gagal.
          </p>
          
          <div className="flex gap-2">
            <Button variant="outline" onClick={onClose} className="flex-1">Batal</Button>
            <Button onClick={onConfirm} className="flex-1">Konfirmasi Pembayaran</Button>
          </div>
        </div>
      </Card>
    </div>
  )
}

export function DisputeFormModal({ isOpen, order, onClose, onSubmit }) {
  if (!isOpen) return null
  const [reason, setReason] = useState('')
  const [evidence, setEvidence] = useState('')
  
  const reasons = [
    'Servis tidak sesuai ekspektasi',
    'Teknisi tidak profesional',
    'Spare part tidak original',
    'Pekerjaan tidak selesai',
    'Lainnya'
  ]
  
  const handleSubmit = () => {
    if (!reason) {
      toast.error('Pilih alasan dispute')
      return
    }
    if (!evidence.trim()) {
      toast.error('Jelaskan detail masalahnya')
      return
    }
    onSubmit({ reason, evidence })
    toast.success('Dispute berhasil diajukan')
    onClose()
  }
  
  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4" onClick={onClose}>
      <Card className="max-w-md w-full" onClick={e => e.stopPropagation()}>
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-display font-600 text-gray-900 dark:text-white">Ajukan Dispute</h3>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <X size={20} />
            </button>
          </div>
          
          <p className="text-sm text-gray-500 mb-4">Order {order.id} - {order.service}</p>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Alasan</label>
            <select
              value={reason}
              onChange={e => setReason(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-sm text-gray-900 dark:text-white">
              <option value="">Pilih alasan</option>
              {reasons.map(r => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Detail Masalah</label>
            <textarea
              value={evidence}
              onChange={e => setEvidence(e.target.value)}
              placeholder="Jelaskan masalahnya secara detail..."
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-sm text-gray-900 dark:text-white"
            />
          </div>
          
          <div className="flex gap-2">
            <Button variant="outline" onClick={onClose} className="flex-1">Batal</Button>
            <Button onClick={handleSubmit} className="flex-1">Ajukan Dispute</Button>
          </div>
        </div>
      </Card>
    </div>
  )
}
