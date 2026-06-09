import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, User, Lock, Bell, Shield, Save, Camera } from 'lucide-react'
import { Card, Button, Input, Badge } from '../../components/UI'
import { AdminLayout } from './index'
import { getAdminProfile, saveAdminProfile, addAuditLog } from '../../store'
import toast from 'react-hot-toast'

export function AdminSettings() {
  const navigate = useNavigate()
  const initial = getAdminProfile()
  const [profile, setProfile] = useState(initial)
  const [pwd, setPwd] = useState({ current: '', next: '', confirm: '' })
  const [notif, setNotif] = useState({
    newKYC: true,
    newDispute: true,
    revenueAlert: true,
    weeklyReport: false,
  })

  const handleSaveProfile = () => {
    if (!profile.name.trim() || !profile.email.trim()) {
      toast.error('Nama dan email wajib diisi')
      return
    }
    saveAdminProfile(profile)
    addAuditLog({ actor: profile.name, action: 'update_profile', target: 'admin_profile' })
    toast.success('Profil admin diperbarui')
  }

  const handleChangePassword = () => {
    if (!pwd.current || !pwd.next) {
      toast.error('Isi password lama dan baru')
      return
    }
    if (pwd.next !== pwd.confirm) {
      toast.error('Konfirmasi password tidak cocok')
      return
    }
    if (pwd.next.length < 8) {
      toast.error('Password baru minimal 8 karakter')
      return
    }
    setPwd({ current: '', next: '', confirm: '' })
    addAuditLog({ actor: profile.name, action: 'change_password', target: 'self' })
    toast.success('Password berhasil diubah')
  }

  return (
    <AdminLayout>
      <div className="flex items-center gap-2 text-sm mb-6">
        <button onClick={() => navigate('/admin')} className="flex items-center gap-1.5 text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors font-medium">
          <ArrowLeft size={15} />Dashboard
        </button>
        <span className="text-gray-300 dark:text-gray-600">/</span>
        <span className="text-gray-700 dark:text-gray-300 font-medium">Pengaturan</span>
      </div>
      <h1 className="font-display text-2xl font-700 text-gray-900 dark:text-white mb-6">Pengaturan Admin</h1>

      <div className="space-y-4 max-w-2xl">
        <Card className="p-5">
          <div className="flex items-center gap-2 mb-4">
            <User size={18} className="text-gray-500" />
            <h2 className="font-semibold text-gray-900 dark:text-white">Profil Admin</h2>
          </div>
          <div className="flex items-center gap-4 mb-5 pb-5 border-b border-gray-100 dark:border-gray-800">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center text-white font-display font-700 text-2xl">
              {profile.name.charAt(0)}
            </div>
            <div>
              <p className="font-semibold text-gray-900 dark:text-white">{profile.name}</p>
              <Badge color="blue">{profile.role}</Badge>
              <button className="text-xs text-brand-500 hover:underline mt-1 flex items-center gap-1">
                <Camera size={12} /> Ganti foto
              </button>
            </div>
          </div>
          <div className="space-y-3">
            <Input label="Nama Lengkap" value={profile.name} onChange={e => setProfile({ ...profile, name: e.target.value })} />
            <Input label="Email" type="email" value={profile.email} onChange={e => setProfile({ ...profile, email: e.target.value })} />
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Role</label>
              <select value={profile.role} onChange={e => setProfile({ ...profile, role: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500">
                <option>Super Admin</option>
                <option>Admin Operasional</option>
                <option>Admin Finance</option>
                <option>Admin Support</option>
              </select>
            </div>
          </div>
          <div className="mt-5 flex justify-end">
            <Button onClick={handleSaveProfile}><Save size={16} /> Simpan Profil</Button>
          </div>
        </Card>

        <Card className="p-5">
          <div className="flex items-center gap-2 mb-4">
            <Lock size={18} className="text-gray-500" />
            <h2 className="font-semibold text-gray-900 dark:text-white">Keamanan</h2>
          </div>
          <div className="space-y-3">
            <Input type="password" label="Password Saat Ini" value={pwd.current} onChange={e => setPwd({ ...pwd, current: e.target.value })} placeholder="••••••••" />
            <Input type="password" label="Password Baru" value={pwd.next} onChange={e => setPwd({ ...pwd, next: e.target.value })} placeholder="Minimal 8 karakter" />
            <Input type="password" label="Konfirmasi Password Baru" value={pwd.confirm} onChange={e => setPwd({ ...pwd, confirm: e.target.value })} placeholder="Ulangi password baru" />
          </div>
          <div className="mt-5 flex justify-end">
            <Button onClick={handleChangePassword}>Ubah Password</Button>
          </div>
        </Card>

        <Card className="p-5">
          <div className="flex items-center gap-2 mb-4">
            <Bell size={18} className="text-gray-500" />
            <h2 className="font-semibold text-gray-900 dark:text-white">Notifikasi</h2>
          </div>
          <div className="space-y-3">
            {[
              { key: 'newKYC',         label: 'Pengajuan KYC baru',         desc: 'Notifikasi saat ada teknisi submit KYC' },
              { key: 'newDispute',     label: 'Sengketa baru',              desc: 'Notifikasi saat ada dispute yang perlu arbitrase' },
              { key: 'revenueAlert',   label: 'Alert revenue',              desc: 'Peringatan saat revenue turun > 20%' },
              { key: 'weeklyReport',   label: 'Laporan mingguan',           desc: 'Email recap setiap Senin pagi' },
            ].map(item => (
              <div key={item.key} className="flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-gray-800/50">
                <div className="flex-1">
                  <p className="font-medium text-gray-900 dark:text-white text-sm">{item.label}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{item.desc}</p>
                </div>
                <button
                  onClick={() => setNotif({ ...notif, [item.key]: !notif[item.key] })}
                  className={`relative w-11 h-6 rounded-full transition-colors flex-shrink-0 outline-none ${notif[item.key] ? 'bg-brand-500' : 'bg-gray-300 dark:bg-gray-600'}`}
                >
                  <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-all duration-200 ${notif[item.key] ? 'translate-x-5' : 'translate-x-0'}`} />
                </button>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-5">
          <div className="flex items-center gap-2 mb-4">
            <Shield size={18} className="text-gray-500" />
            <h2 className="font-semibold text-gray-900 dark:text-white">Audit & Keamanan Lanjutan</h2>
          </div>
          <div className="space-y-3 text-sm">
            <div className="flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-gray-800/50">
              <div>
                <p className="font-medium text-gray-900 dark:text-white">2FA Authentication</p>
                <p className="text-xs text-gray-500 mt-0.5">Login via authenticator app</p>
              </div>
              <Badge color="green">Aktif</Badge>
            </div>
            <div className="flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-gray-800/50">
              <div>
                <p className="font-medium text-gray-900 dark:text-white">Session Timeout</p>
                <p className="text-xs text-gray-500 mt-0.5">Auto logout setelah tidak ada aktivitas</p>
              </div>
              <span className="text-gray-700 dark:text-gray-300">30 menit</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-gray-800/50">
              <div>
                <p className="font-medium text-gray-900 dark:text-white">IP Whitelist</p>
                <p className="text-xs text-gray-500 mt-0.5">Batasi akses hanya dari IP tertentu</p>
              </div>
              <Badge color="gray">Nonaktif</Badge>
            </div>
          </div>
        </Card>
      </div>
    </AdminLayout>
  )
}
