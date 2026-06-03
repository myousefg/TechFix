import React, { useState } from 'react'
import { ArrowLeft, Camera } from 'lucide-react'
import { Card, Button, EscrowStatus } from './UI'

export function TechnicianOrderDetail({ order, updateSent, onUpdateStatus, onBack }) {
  const [statusText, setStatusText] = useState('Diagnosa awal selesai')
  const [notes, setNotes] = useState('')
  
  function handleSubmit() {
    onUpdateStatus(order.id, statusText, notes)
  }
  
  return (
    <>
      <button onClick={onBack} className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 dark:hover:text-white mb-4">
        <ArrowLeft size={16} />Kembali
      </button>
      <h1 className="font-display text-xl font-700 text-gray-900 dark:text-white mb-4">Detail Order</h1>
      
      <Card className="p-5 mb-4">
        <div className="flex justify-between mb-2">
          <span className="font-mono text-sm text-brand-500">{order.id}</span>
          <EscrowStatus status={order.escrow} />
        </div>
        <p className="font-semibold text-gray-900 dark:text-white">{order.service}</p>
        <p className="text-sm text-gray-500 mt-1">Pelanggan: Hashfi H. · {order.date}</p>
          <p className="text-sm font-semibold text-gray-900 dark:text-white mt-2">Rp{order.amount.toLocaleString('id')}</p>
      </Card>

      {!updateSent ? (
        <Card className="p-5 mb-4">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Kirim Update Progres</h3>
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Status</label>
              <select 
                value={statusText} 
                onChange={(e) => setStatusText(e.target.value)}
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
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
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
          <Button variant="teal" className="w-full mt-4" onClick={handleSubmit}>
            Kirim Update
          </Button>
        </Card>
      ) : (
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
    </>
  )
}
