import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, CheckCircle, Eye, EyeOff, Camera, CreditCard, Smartphone, Plus, Trash2 } from 'lucide-react'
import { Card, Button, Input, Badge } from '../../components/UI'
import { getAccountSettings, saveAccountSettings, getNotifSettings, saveNotifSettings, getPaymentMethods, savePaymentMethods } from '../../store'

function Toggle({ checked, onChange }) {
  return (
    <button onClick={() => onChange(!checked)}
      className={`relative w-11 h-6 rounded-full transition-colors ${checked ? 'bg-brand-500' : 'bg-gray-200 dark:bg-gray-700'}`}>
      <div className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-transform ${checked ? 'translate-x-5' : ''}`} />
    </button>
  )
}

export default function AccountSettings() {
  const navigate = useNavigate()
  const [form, setForm] = useState(getAccountSettings)
  const [passwords, setPasswords] = useState({ current: '', newPass: '', confirm: '' })
  const [showPass, setShowPass] = useState(false)
  const [saved, setSaved] = useState('')
  
  const [notifSettings, setNotifSettings] = useState(getNotifSettings)
  const [notifSaved, setNotifSaved] = useState(false)
  
  const [paymentMethods, setPaymentMethods] = useState(getPaymentMethods)
  const [adding, setAdding] = useState(false)
  const [newType, setNewType] = useState('bank')
  const [paymentSaved, setPaymentSaved] = useState(false)

  function saveProfile() {
    saveAccountSettings(form)
    setSaved('profile')
    setTimeout(() => setSaved(''), 2500)
  }
  function savePassword() {
    if (passwords.newPass !== passwords.confirm) return
    setSaved('password')
    setPasswords({ current: '', newPass: '', confirm: '' })
    setTimeout(() => setSaved(''), 2500)
  }
  
  function updateNotif(key, val) {
    const updated = { ...notifSettings, [key]: val }
    setNotifSettings(updated)
    saveNotifSettings(updated)
    setNotifSaved(true)
    setTimeout(() => setNotifSaved(false), 1500)
  }
  
  const notifItems = [
    { key: 'orderUpdate',  label: 'Update Pesanan',          desc: 'Status order, konfirmasi teknisi, jadwal servis' },
    { key: 'escrowStatus', label: 'Status Escrow',           desc: 'Pembayaran diterima, dana diteruskan, refund' },
    { key: 'maintenance',  label: 'Reminder Maintenance',    desc: 'Pengingat perawatan berkala perangkat kamu' },
    { key: 'promo',        label: 'Promo & Penawaran',       desc: 'Diskon, voucher, dan penawaran eksklusif' },
    { key: 'newsletter',   label: 'Tips & Newsletter',       desc: 'Tips perawatan perangkat dan artikel teknisi' },
  ]
  
  function setDefaultPayment(id) {
    const updated = paymentMethods.map(m => ({ ...m, default: m.id === id }))
    setPaymentMethods(updated)
    savePaymentMethods(updated)
    flashPayment()
  }
  function removePayment(id) {
    const updated = paymentMethods.filter(m => m.id !== id)
    setPaymentMethods(updated)
    savePaymentMethods(updated)
  }
  function addPayment() {
    const newMethod = {
      id: Date.now(),
      type: newType,
      label: newType === 'bank' ? 'BNI Virtual Account' : newType === 'ewallet' ? 'OVO' : 'QRIS',
      masked: newType === 'bank' ? '•••• 5678' : '+62 812 •••• 9999',
      default: false,
    }
    const updated = [...paymentMethods, newMethod]
    setPaymentMethods(updated)
    savePaymentMethods(updated)
    setAdding(false)
    flashPayment()
  }
  function flashPayment() {
    setPaymentSaved(true)
    setTimeout(() => setPaymentSaved(false), 2000)
  }
  
  const paymentIcons = { bank: CreditCard, ewallet: Smartphone, qris: CheckCircle }

  return (
    <div className="pt-16 min-h-screen bg-gray-50 dark:bg-gray-950 pb-10">
      <div className="max-w-2xl mx-auto px-4 py-6">
        <button onClick={() => navigate('/customer/settings')} className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 dark:hover:text-white mb-6 transition-colors">
          <ArrowLeft size={16} /> Kembali
        </button>
        <h1 className="font-display text-2xl font-700 text-gray-900 dark:text-white mb-6">Pengaturan Akun</h1>

        {/* Avatar */}
        <Card className="p-5 mb-4">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center text-white font-display text-2xl font-700">
                {form.name.charAt(0)}
              </div>
              <button className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-brand-500 flex items-center justify-center">
                <Camera size={11} className="text-white" />
              </button>
            </div>
            <div>
              <p className="font-semibold text-gray-900 dark:text-white">{form.name}</p>
              <p className="text-sm text-gray-400">{form.email}</p>
            </div>
          </div>
        </Card>

        {/* Profile form */}
        <Card className="p-5 mb-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900 dark:text-white">Profil</h3>
            {saved === 'profile' && (
              <span className="flex items-center gap-1 text-sm text-green-600 dark:text-green-400 animate-fade-in">
                <CheckCircle size={14} /> Tersimpan
              </span>
            )}
          </div>
          <div className="space-y-4">
            <Input label="Nama Lengkap" value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
            <Input label="Email" type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} />
            <Input label="No. WhatsApp" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} />
            <div className="grid grid-cols-2 gap-3">
              <Input label="Kota" value={form.city} onChange={e => setForm({...form, city: e.target.value})} />
              <Input label="Kecamatan" value={form.district} onChange={e => setForm({...form, district: e.target.value})} />
            </div>
          </div>
          <Button className="w-full mt-5" onClick={saveProfile}>Simpan Profil</Button>
        </Card>

        {/* Password */}
        <Card className="p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900 dark:text-white">Ubah Password</h3>
            {saved === 'password' && (
              <span className="flex items-center gap-1 text-sm text-green-600 dark:text-green-400 animate-fade-in">
                <CheckCircle size={14} /> Diperbarui
              </span>
            )}
          </div>
          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Password Saat Ini</label>
              <div className="relative">
                <input type={showPass ? 'text' : 'password'} value={passwords.current}
                  onChange={e => setPasswords({...passwords, current: e.target.value})}
                  className="w-full pl-4 pr-10 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 text-gray-900 dark:text-white" placeholder="••••••••" />
                <button onClick={() => setShowPass(s => !s)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                  {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>
            <Input label="Password Baru" type="password" value={passwords.newPass} onChange={e => setPasswords({...passwords, newPass: e.target.value})} placeholder="Minimal 8 karakter" />
            <Input label="Konfirmasi Password Baru" type="password" value={passwords.confirm} onChange={e => setPasswords({...passwords, confirm: e.target.value})} placeholder="Ulangi password baru" />
            {passwords.confirm && passwords.newPass !== passwords.confirm && (
              <p className="text-xs text-red-500">Password tidak cocok</p>
            )}
          </div>
          <Button className="w-full mt-5" onClick={savePassword}
            disabled={!passwords.current || !passwords.newPass || passwords.newPass !== passwords.confirm}>
            Ubah Password
          </Button>
        </Card>

        <Card className="p-5 mb-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900 dark:text-white">Pengaturan Notifikasi</h3>
            {notifSaved && (
              <span className="flex items-center gap-1 text-sm text-green-600 dark:text-green-400 animate-fade-in">
                <CheckCircle size={14} /> Tersimpan
              </span>
            )}
          </div>
          <div className="divide-y divide-gray-100 dark:divide-gray-800">
            {notifItems.map((item) => (
              <div key={item.key} className="py-4 first:pt-0 last:pb-0">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{item.label}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{item.desc}</p>
                  </div>
                  <Toggle checked={notifSettings[item.key] || false} onChange={(val) => updateNotif(item.key, val)} />
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900 dark:text-white">Metode Pembayaran</h3>
            {paymentSaved && (
              <span className="flex items-center gap-1 text-sm text-green-600 dark:text-green-400 animate-fade-in">
                <CheckCircle size={14} /> Tersimpan
              </span>
            )}
          </div>
          
          <div className="space-y-3 mb-4">
            {paymentMethods.map(m => {
              const Icon = paymentIcons[m.type] || CreditCard
              return (
                <div key={m.id} className="p-4 rounded-xl border border-gray-100 dark:border-gray-800">
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
                        <button onClick={() => setDefaultPayment(m.id)} className="p-1.5 rounded-lg text-xs text-brand-500 hover:bg-brand-50 dark:hover:bg-brand-900/20 transition-colors font-medium">
                          Set Default
                        </button>
                      )}
                      {!m.default && (
                        <button onClick={() => removePayment(m.id)} className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
                          <Trash2 size={14} />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {!adding ? (
            <button onClick={() => setAdding(true)}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl border-2 border-dashed border-gray-200 dark:border-gray-700 text-sm text-gray-500 dark:text-gray-400 hover:border-brand-400 dark:hover:border-brand-600 hover:text-brand-500 transition-all">
              <Plus size={16} /> Tambah Metode Baru
            </button>
          ) : (
            <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-800 animate-scale-in">
              <p className="font-semibold text-sm text-gray-900 dark:text-white mb-3">Tambah Metode Pembayaran</p>
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">Tipe</label>
                  <div className="flex gap-2">
                    {[{v:'bank',l:'Transfer Bank'},{v:'ewallet',l:'E-Wallet'},{v:'qris',l:'QRIS'}].map(t => (
                      <button key={t.v} onClick={() => setNewType(t.v)}
                        className={`flex-1 px-3 py-2 rounded-lg text-xs font-medium transition-colors ${newType === t.v ? 'bg-brand-500 text-white' : 'bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700'}`}>
                        {t.l}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" onClick={addPayment} className="flex-1">Tambah</Button>
                  <Button size="sm" variant="outline" onClick={() => setAdding(false)} className="flex-1">Batal</Button>
                </div>
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  )
}
