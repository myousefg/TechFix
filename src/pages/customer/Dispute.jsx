import React, { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, AlertTriangle, CheckCircle, Upload, Clock } from 'lucide-react'
import { Card, Button, Input, Badge, EscrowStatus } from '../../components/UI'
import { addCustomerDispute, getCustomerDisputes } from '../../store'
import { orders } from '../../data'

export default function Dispute() {
  const navigate = useNavigate()
  const { orderId } = useParams()
  const order = orders.find(o => o.id === orderId) || orders[0]
  const existing = getCustomerDisputes().find(d => d.orderId === order.id)

  const [step, setStep] = useState(existing ? 3 : 1)
  const [reason, setReason] = useState('')
  const [detail, setDetail] = useState('')
  const [submitted, setSubmitted] = useState(!!existing)

  const reasons = [
    'Servis tidak selesai / perangkat masih rusak',
    'Teknisi tidak datang sesuai jadwal',
    'Harga final melebihi estimasi tanpa konfirmasi',
    'Perangkat rusak lebih parah setelah servis',
    'Teknisi tidak responsif / menghilang',
    'Alasan lain',
  ]

  function submit() {
    addCustomerDispute({
      id: 'D-' + Date.now(),
      orderId: order.id,
      reason,
      detail,
      status: 'open',
      submitted: new Date().toLocaleDateString('id'),
    })
    setSubmitted(true)
    setStep(3)
  }

  return (
    <div className="pt-16 min-h-screen bg-gray-50 dark:bg-gray-950 pb-10">
      <div className="max-w-2xl mx-auto px-4 py-6">
        <button onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 dark:hover:text-white mb-6 transition-colors">
          <ArrowLeft size={16} /> Kembali
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-red-50 dark:bg-red-900/20 flex items-center justify-center">
            <AlertTriangle size={18} className="text-red-500" />
          </div>
          <div>
            <h1 className="font-display text-xl font-700 text-gray-900 dark:text-white">Ajukan Sengketa</h1>
            <p className="text-sm text-gray-500">Order <span className="font-mono text-brand-500">{order.id}</span></p>
          </div>
        </div>

        {/* Progress */}
        {!submitted && (
          <div className="flex gap-2 mb-6">
            {[1, 2].map(i => (
              <div key={i} className={`h-1.5 flex-1 rounded-full transition-colors ${i <= step ? 'bg-red-500' : 'bg-gray-200 dark:bg-gray-700'}`} />
            ))}
          </div>
        )}

        {step === 1 && (
          <Card className="p-5 animate-scale-in">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Pilih Alasan Sengketa</h3>
            <div className="space-y-2 mb-6">
              {reasons.map(r => (
                <label key={r} className={`flex items-center gap-3 p-3 rounded-xl border-2 cursor-pointer transition-all ${reason === r ? 'border-red-400 bg-red-50 dark:bg-red-900/20' : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'}`}>
                  <input type="radio" name="reason" value={r} checked={reason === r}
                    onChange={() => setReason(r)} className="accent-red-500" />
                  <span className="text-sm text-gray-700 dark:text-gray-300">{r}</span>
                </label>
              ))}
            </div>
            <Button variant="danger" className="w-full" disabled={!reason} onClick={() => setStep(2)}>
              Lanjut
            </Button>
          </Card>
        )}

        {step === 2 && (
          <div className="space-y-4 animate-scale-in">
            {/* Order summary */}
            <Card className="p-4">
              <p className="text-xs text-gray-400 mb-2">Pesanan yang disengketakan</p>
              <p className="font-medium text-gray-900 dark:text-white text-sm">{order.service}</p>
              <p className="text-xs text-gray-500 mt-1">{order.technician} · {order.date}</p>
              <div className="flex items-center justify-between mt-2">
                <EscrowStatus status={order.escrow} />
                <span className="text-sm font-semibold text-gray-900 dark:text-white">Rp{order.price.toLocaleString('id')}</span>
              </div>
            </Card>

            <Card className="p-5">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Detail Sengketa</h3>
              <div className="space-y-4">
                <div className="p-3 rounded-xl bg-gray-50 dark:bg-gray-800 text-sm">
                  <p className="text-xs text-gray-400 mb-1">Alasan dipilih</p>
                  <p className="text-gray-700 dark:text-gray-300 font-medium">{reason}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                    Ceritakan masalahnya secara detail
                  </label>
                  <textarea
                    value={detail}
                    onChange={e => setDetail(e.target.value)}
                    rows={4}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 text-gray-900 dark:text-white placeholder-gray-400 transition-all resize-none"
                    placeholder="Jelaskan kronologi masalah, apa yang terjadi, dan apa yang kamu harapkan sebagai solusi..."
                  />
                  <p className="text-xs text-gray-400 mt-1 text-right">{detail.length}/500</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                    Bukti pendukung (foto/video) — opsional
                  </label>
                  <div className="border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-xl p-5 text-center cursor-pointer hover:border-red-300 dark:hover:border-red-700 transition-colors">
                    <Upload size={18} className="mx-auto text-gray-400 mb-1.5" />
                    <p className="text-xs text-gray-400">Tap untuk upload bukti</p>
                    <p className="text-xs text-gray-400 mt-0.5">JPG, PNG, MP4 maks. 10MB</p>
                  </div>
                </div>
              </div>
              <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-900/20 mt-4">
                <p className="text-xs text-amber-700 dark:text-amber-300">
                  ⚠️ Dana escrow sebesar <strong>Rp{order.price.toLocaleString('id')}</strong> akan tetap ditahan selama proses arbitrase berlangsung (maks. 3×24 jam).
                </p>
              </div>
              <div className="flex gap-3 mt-5">
                <Button variant="outline" className="flex-1" onClick={() => setStep(1)}>Kembali</Button>
                <Button variant="danger" className="flex-1" disabled={!detail.trim()} onClick={submit}>
                  Ajukan Sengketa
                </Button>
              </div>
            </Card>
          </div>
        )}

        {step === 3 && (
          <div className="text-center py-8 animate-scale-in">
            <div className="w-20 h-20 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mx-auto mb-5">
              <CheckCircle size={40} className="text-green-500" />
            </div>
            <h2 className="font-display text-2xl font-700 text-gray-900 dark:text-white mb-2">Sengketa Diajukan</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Tim admin TechFix akan meninjau dalam <strong>3×24 jam</strong>.</p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-8">Dana escrow tetap aman hingga keputusan ditetapkan.</p>
            <div className="space-y-2 text-left max-w-xs mx-auto mb-8">
              {[
                { label: 'Sengketa diterima', done: true },
                { label: 'Admin meninjau bukti', done: false },
                { label: 'Keputusan ditetapkan', done: false },
                { label: 'Dana diselesaikan', done: false },
              ].map((s, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${s.done ? 'bg-green-500' : 'bg-gray-200 dark:bg-gray-700'}`}>
                    {s.done ? <CheckCircle size={12} className="text-white" /> : <Clock size={10} className="text-gray-400" />}
                  </div>
                  <span className={`text-sm ${s.done ? 'text-gray-900 dark:text-white font-medium' : 'text-gray-400'}`}>{s.label}</span>
                </div>
              ))}
            </div>
            <Button className="w-full" onClick={() => navigate('/customer/orders')}>Kembali ke Pesanan</Button>
          </div>
        )}
      </div>
    </div>
  )
}
