import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, CreditCard, Smartphone, Plus, Trash2, CheckCircle, Star } from 'lucide-react'
import { Card, Button, Input, Badge } from '../../components/UI'
import { getPaymentMethods, savePaymentMethods } from '../../store'

export default function PaymentMethods() {
  const navigate = useNavigate()
  const [methods, setMethods] = useState(getPaymentMethods)
  const [adding, setAdding] = useState(false)
  const [newType, setNewType] = useState('bank')
  const [saved, setSaved] = useState(false)

  function setDefault(id) {
    const updated = methods.map(m => ({ ...m, default: m.id === id }))
    setMethods(updated)
    savePaymentMethods(updated)
    flash()
  }
  function remove(id) {
    const updated = methods.filter(m => m.id !== id)
    setMethods(updated)
    savePaymentMethods(updated)
  }
  function addMethod() {
    const newMethod = {
      id: Date.now(),
      type: newType,
      label: newType === 'bank' ? 'BNI Virtual Account' : newType === 'ewallet' ? 'OVO' : 'QRIS',
      masked: newType === 'bank' ? '•••• 5678' : '+62 812 •••• 9999',
      default: false,
    }
    const updated = [...methods, newMethod]
    setMethods(updated)
    savePaymentMethods(updated)
    setAdding(false)
    flash()
  }
  function flash() { setSaved(true); setTimeout(() => setSaved(false), 2000) }

  const icons = { bank: CreditCard, ewallet: Smartphone, qris: CheckCircle }

  return (
    <div className="pt-16 min-h-screen bg-gray-50 dark:bg-gray-950 pb-10">
      <div className="max-w-2xl mx-auto px-4 py-6">
        <button onClick={() => navigate('/customer/settings')} className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 dark:hover:text-white mb-6 transition-colors">
          <ArrowLeft size={16} /> Kembali
        </button>

        <div className="flex items-center justify-between mb-6">
          <h1 className="font-display text-2xl font-700 text-gray-900 dark:text-white">Metode Pembayaran</h1>
          {saved && (
            <span className="flex items-center gap-1.5 text-sm text-green-600 dark:text-green-400 animate-fade-in">
              <CheckCircle size={14} /> Tersimpan
            </span>
          )}
        </div>

        <div className="space-y-3 mb-4">
          {methods.map(m => {
            const Icon = icons[m.type] || CreditCard
            return (
              <Card key={m.id} className="p-4">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center flex-shrink-0">
                    <Icon size={18} className="text-gray-500 dark:text-gray-400" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">{m.label}</p>
                      {m.default && <Badge color="blue">Default</Badge>}
                    </div>
                    <p className="text-xs text-gray-400 mt-0.5 font-mono">{m.masked}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {!m.default && (
                      <button onClick={() => setDefault(m.id)} className="p-1.5 rounded-lg text-xs text-brand-500 hover:bg-brand-50 dark:hover:bg-brand-900/20 transition-colors font-medium">
                        Set Default
                      </button>
                    )}
                    {!m.default && (
                      <button onClick={() => remove(m.id)} className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
                        <Trash2 size={14} />
                      </button>
                    )}
                  </div>
                </div>
              </Card>
            )
          })}
        </div>

        {!adding ? (
          <button onClick={() => setAdding(true)}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl border-2 border-dashed border-gray-200 dark:border-gray-700 text-sm text-gray-500 dark:text-gray-400 hover:border-brand-400 dark:hover:border-brand-600 hover:text-brand-500 transition-all">
            <Plus size={16} /> Tambah Metode Baru
          </button>
        ) : (
          <Card className="p-5 animate-scale-in">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Tambah Metode Pembayaran</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Tipe</label>
                <div className="flex gap-2">
                  {[{v:'bank',l:'Transfer Bank'},{v:'ewallet',l:'E-Wallet'},{v:'qris',l:'QRIS'}].map(t => (
                    <button key={t.v} onClick={() => setNewType(t.v)}
                      className={`flex-1 py-2 rounded-xl text-xs font-medium border-2 transition-colors ${newType === t.v ? 'border-brand-500 bg-brand-50 dark:bg-brand-900/20 text-brand-600 dark:text-brand-400' : 'border-gray-200 dark:border-gray-700 text-gray-500'}`}>
                      {t.l}
                    </button>
                  ))}
                </div>
              </div>
              {newType === 'bank' && <Input label="Nama Bank" placeholder="BNI, BRI, Mandiri..." />}
              {newType === 'ewallet' && <Input label="No. HP terdaftar" placeholder="+62 812 xxxx xxxx" />}
              <div className="flex gap-3">
                <Button variant="outline" className="flex-1" onClick={() => setAdding(false)}>Batal</Button>
                <Button className="flex-1" onClick={addMethod}>Simpan</Button>
              </div>
            </div>
          </Card>
        )}

        <p className="text-xs text-gray-400 text-center mt-6">
          💳 Semua pembayaran diproses melalui Midtrans dengan enkripsi SSL 256-bit
        </p>
      </div>
    </div>
  )
}
