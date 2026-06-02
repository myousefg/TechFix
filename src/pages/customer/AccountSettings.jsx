import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, CheckCircle, Eye, EyeOff, Camera } from 'lucide-react'
import { Card, Button, Input } from '../../components/UI'
import { getAccountSettings, saveAccountSettings } from '../../store'

export default function AccountSettings() {
  const navigate = useNavigate()
  const [form, setForm] = useState(getAccountSettings)
  const [passwords, setPasswords] = useState({ current: '', newPass: '', confirm: '' })
  const [showPass, setShowPass] = useState(false)
  const [saved, setSaved] = useState('')

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
      </div>
    </div>
  )
}
