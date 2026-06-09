import React, { useState } from 'react'
import toast from 'react-hot-toast'
import { X } from 'lucide-react'
import { Card, Button, Input } from './UI'

export function AcceptOrderModal({ order, onClose, onAccept }) {
  const [estimatedStart, setEstimatedStart] = useState('')
  
  const handleAccept = () => {
    onAccept(estimatedStart)
    toast.success('Order berhasil diterima')
    onClose()
  }
  
  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4" onClick={onClose}>
      <Card className="max-w-md w-full" onClick={e => e.stopPropagation()}>
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-display font-600 text-gray-900 dark:text-white">Terima Order</h3>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <X size={20} />
            </button>
          </div>
          
          <div className="mb-4 space-y-1 text-sm">
            <p><span className="text-gray-500">Order:</span> <span className="font-medium text-gray-900 dark:text-white">{order.id}</span></p>
            <p><span className="text-gray-500">Customer:</span> <span className="font-medium text-gray-900 dark:text-white">{order.customer}</span></p>
            <p><span className="text-gray-500">Service:</span> <span className="font-medium text-gray-900 dark:text-white">{order.service}</span></p>
            <p><span className="text-gray-500">Pembayaran:</span> <span className="font-medium text-gray-900 dark:text-white">Rp{order.amount.toLocaleString('id')}</span></p>
          </div>
          
          <Input
            label="Estimasi Mulai Kerja (opsional)"
            type="datetime-local"
            value={estimatedStart}
            onChange={e => setEstimatedStart(e.target.value)}
          />
          
          <div className="flex gap-2 mt-4">
            <Button variant="outline" onClick={onClose} className="flex-1">Batal</Button>
            <Button onClick={handleAccept} className="flex-1">Terima Order</Button>
          </div>
        </div>
      </Card>
    </div>
  )
}

export function RejectOrderModal({ order, onClose, onReject }) {
  const [reason, setReason] = useState('')
  const [notes, setNotes] = useState('')
  
  const reasons = [
    'Jadwal penuh',
    'Diluar area layanan',
    'Tidak bisa handle jenis servis ini',
    'Lainnya'
  ]
  
  const handleReject = () => {
    if (!reason) {
      toast.error('Pilih alasan penolakan')
      return
    }
    onReject({ reason, notes })
    toast.success('Order ditolak')
    onClose()
  }
  
  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4" onClick={onClose}>
      <Card className="max-w-md w-full" onClick={e => e.stopPropagation()}>
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-display font-600 text-gray-900 dark:text-white">Tolak Order</h3>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <X size={20} />
            </button>
          </div>
          
          <p className="text-sm text-gray-500 mb-4">Order {order.id} - {order.customer}</p>
          
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
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Catatan (opsional)</label>
            <textarea
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="Tambahkan catatan jika perlu..."
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-sm text-gray-900 dark:text-white"
            />
          </div>
          
          <div className="flex gap-2">
            <Button variant="outline" onClick={onClose} className="flex-1">Batal</Button>
            <Button onClick={handleReject} className="flex-1 bg-red-500 hover:bg-red-600">Tolak Order</Button>
          </div>
        </div>
      </Card>
    </div>
  )
}

export function JobStatusModal({ order, action, onClose, onUpdate }) {
  const [notes, setNotes] = useState('')
  
  const handleUpdate = () => {
    onUpdate({ action, notes })
    toast.success(action === 'start' ? 'Pekerjaan dimulai' : 'Pekerjaan selesai')
    onClose()
  }
  
  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4" onClick={onClose}>
      <Card className="max-w-md w-full" onClick={e => e.stopPropagation()}>
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-display font-600 text-gray-900 dark:text-white">
              {action === 'start' ? 'Mulai Pekerjaan' : 'Tandai Selesai'}
            </h3>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <X size={20} />
            </button>
          </div>
          
          <p className="text-sm text-gray-500 mb-4">Order {order.id} - {order.service}</p>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Catatan</label>
            <textarea
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder={action === 'start' ? 'Catatan sebelum mulai kerja...' : 'Catatan hasil pekerjaan...'}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-sm text-gray-900 dark:text-white"
            />
          </div>
          
          {action === 'complete' && (
            <p className="text-xs text-gray-500 mb-4">
              Setelah ditandai selesai, dana escrow akan dilepas ke saldo Anda.
            </p>
          )}
          
          <div className="flex gap-2">
            <Button variant="outline" onClick={onClose} className="flex-1">Batal</Button>
            <Button onClick={handleUpdate} className="flex-1">
              {action === 'start' ? 'Mulai Kerja' : 'Selesai'}
            </Button>
          </div>
        </div>
      </Card>
    </div>
  )
}

export function WithdrawModal({ isOpen, balance, onClose, onSubmit }) {
  if (!isOpen) return null
  const [amount, setAmount] = useState('')
  const [method, setMethod] = useState('')
  const [accountNumber, setAccountNumber] = useState('')
  
  const methods = ['BCA', 'Mandiri', 'BNI', 'BRI', 'OVO', 'GoPay', 'DANA']
  
  const handleSubmit = () => {
    const amt = Number(amount)
    if (!amt || amt <= 0) {
      toast.error('Masukkan nominal yang valid')
      return
    }
    if (amt > (balance || 0)) {
      toast.error('Saldo tidak cukup')
      return
    }
    if (!method) {
      toast.error('Pilih metode penarikan')
      return
    }
    if (!accountNumber.trim()) {
      toast.error('Masukkan nomor rekening/akun')
      return
    }
    onSubmit({ amount: amt, method, accountNumber })
    toast.success('Permintaan penarikan diajukan')
    onClose()
  }
  
  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4" onClick={onClose}>
      <Card className="max-w-md w-full" onClick={e => e.stopPropagation()}>
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-display font-600 text-gray-900 dark:text-white">Cairkan Dana</h3>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <X size={20} />
            </button>
          </div>
          
          <p className="text-sm text-gray-500 mb-4">
            Saldo tersedia: <span className="font-semibold text-gray-900 dark:text-white">Rp{balance.toLocaleString('id')}</span>
          </p>
          
          <div className="space-y-3">
            <Input
              label="Nominal"
              type="number"
              value={amount}
              onChange={e => setAmount(e.target.value)}
              placeholder="Masukkan nominal"
            />
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Metode</label>
              <select
                value={method}
                onChange={e => setMethod(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-sm text-gray-900 dark:text-white">
                <option value="">Pilih metode</option>
                {methods.map(m => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
            </div>
            
            <Input
              label="Nomor Rekening/Akun"
              value={accountNumber}
              onChange={e => setAccountNumber(e.target.value)}
              placeholder="1234567890"
            />
          </div>
          
          <p className="text-xs text-gray-500 mt-4 mb-4">
            Dana akan diproses dalam 1-2 hari kerja. Anda akan mendapat notifikasi setelah disetujui.
          </p>
          
          <div className="flex gap-2">
            <Button variant="outline" onClick={onClose} className="flex-1">Batal</Button>
            <Button onClick={handleSubmit} className="flex-1">Ajukan Penarikan</Button>
          </div>
        </div>
      </Card>
    </div>
  )
}

export function UpgradePremiumModal({ isOpen, currentPlan, newPlan, onClose, onConfirm }) {
  if (!isOpen) return null
  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4" onClick={onClose}>
      <Card className="max-w-md w-full" onClick={e => e.stopPropagation()}>
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-display font-600 text-gray-900 dark:text-white">Upgrade ke {newPlan.name}</h3>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <X size={20} />
            </button>
          </div>
          
          <div className="mb-4 space-y-3">
            <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <p className="text-xs text-gray-500 mb-1">Paket Saat Ini</p>
              <p className="font-medium text-gray-900 dark:text-white">{currentPlan.name}</p>
            </div>
            
            <div className="p-3 bg-teal-50 dark:bg-teal-900/20 rounded-lg">
              <p className="text-xs text-teal-600 dark:text-teal-400 mb-1">Paket Baru</p>
              <p className="font-semibold text-gray-900 dark:text-white">{newPlan.name}</p>
              <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">{newPlan.desc}</p>
              <p className="text-lg font-display font-700 text-teal-600 dark:text-teal-400 mt-2">
                Rp{newPlan.price.toLocaleString('id')}<span className="text-sm font-normal">/bulan</span>
              </p>
            </div>
          </div>
          
          <p className="text-xs text-gray-500 mb-4">
            Paket akan aktif segera setelah pembayaran dikonfirmasi. Masa aktif 30 hari sejak upgrade.
          </p>
          
          <div className="flex gap-2">
            <Button variant="outline" onClick={onClose} className="flex-1">Batal</Button>
            <Button onClick={onConfirm} className="flex-1">Konfirmasi Upgrade</Button>
          </div>
        </div>
      </Card>
    </div>
  )
}
