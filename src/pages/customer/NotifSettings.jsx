import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, CheckCircle } from 'lucide-react'
import { Card } from '../../components/UI'
import { getNotifSettings, saveNotifSettings } from '../../store'

function Toggle({ checked, onChange }) {
  return (
    <button onClick={() => onChange(!checked)}
      className={`relative w-11 h-6 rounded-full transition-colors ${checked ? 'bg-brand-500' : 'bg-gray-200 dark:bg-gray-700'}`}>
      <div className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-transform ${checked ? 'translate-x-5' : ''}`} />
    </button>
  )
}

export default function NotifSettings() {
  const navigate = useNavigate()
  const [settings, setSettings] = useState(getNotifSettings)
  const [saved, setSaved] = useState(false)

  function update(key, val) {
    const updated = { ...settings, [key]: val }
    setSettings(updated)
    saveNotifSettings(updated)
    setSaved(true)
    setTimeout(() => setSaved(false), 1500)
  }

  const items = [
    { key: 'orderUpdate',  label: 'Update Pesanan',          desc: 'Status order, konfirmasi teknisi, jadwal servis' },
    { key: 'escrowStatus', label: 'Status Escrow',           desc: 'Pembayaran diterima, dana diteruskan, refund' },
    { key: 'maintenance',  label: 'Reminder Maintenance',    desc: 'Pengingat perawatan berkala perangkat kamu' },
    { key: 'promo',        label: 'Promo & Penawaran',       desc: 'Diskon, voucher, dan penawaran eksklusif' },
    { key: 'newsletter',   label: 'Tips & Newsletter',       desc: 'Tips perawatan perangkat dan artikel teknisi' },
  ]

  return (
    <div className="pt-16 min-h-screen bg-gray-50 dark:bg-gray-950 pb-10">
      <div className="max-w-2xl mx-auto px-4 py-6">
        <button onClick={() => navigate('/customer/settings')} className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 dark:hover:text-white mb-6 transition-colors">
          <ArrowLeft size={16} /> Kembali
        </button>
        <div className="flex items-center justify-between mb-6">
          <h1 className="font-display text-2xl font-700 text-gray-900 dark:text-white">Notifikasi</h1>
          {saved && (
            <span className="flex items-center gap-1 text-sm text-green-600 dark:text-green-400 animate-fade-in">
              <CheckCircle size={14} /> Tersimpan
            </span>
          )}
        </div>
        <Card className="overflow-hidden">
          {items.map((item, i) => (
            <div key={item.key}
              className={`flex items-center justify-between px-5 py-4 ${i < items.length - 1 ? 'border-b border-gray-100 dark:border-gray-800' : ''}`}>
              <div className="flex-1 pr-4">
                <p className="text-sm font-medium text-gray-900 dark:text-white">{item.label}</p>
                <p className="text-xs text-gray-400 mt-0.5">{item.desc}</p>
              </div>
              <Toggle checked={settings[item.key]} onChange={val => update(item.key, val)} />
            </div>
          ))}
        </Card>
        <p className="text-xs text-gray-400 text-center mt-6">Semua perubahan disimpan otomatis di perangkat ini</p>
      </div>
    </div>
  )
}
