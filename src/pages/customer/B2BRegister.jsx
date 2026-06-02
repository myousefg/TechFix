import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, CheckCircle, Building2, Users, Zap } from 'lucide-react'
import { Card, Button, Input, Badge } from '../../components/UI'

const plans = [
  {
    id: 'starter', name: 'Starter', price: 299000,
    desc: 'Untuk UMKM & startup kecil',
    features: ['IT support on-demand', 'Maks. 5 perangkat', 'Response time 4 jam', 'Dedicated teknisi', 'Monthly report'],
    color: 'from-brand-500 to-brand-600',
  },
  {
    id: 'business', name: 'Business', price: 599000, popular: true,
    desc: 'Untuk bisnis berkembang',
    features: ['Semua fitur Starter', 'Unlimited perangkat', 'Response time 2 jam', 'Priority support 24/7', 'Quarterly audit IT'],
    color: 'from-teal-500 to-teal-700',
  },
  {
    id: 'enterprise', name: 'Enterprise', price: null,
    desc: 'Untuk perusahaan skala besar',
    features: ['Custom SLA', 'Dedicated team teknisi', 'On-site support', 'API integration', 'Custom report'],
    color: 'from-purple-600 to-purple-800',
  },
]

export default function B2BRegister() {
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [selectedPlan, setSelectedPlan] = useState('business')

  return (
    <div className="pt-16 min-h-screen bg-gray-50 dark:bg-gray-950 pb-10">
      <div className="max-w-3xl mx-auto px-4 py-8">
        <button onClick={() => step > 1 ? setStep(s => s - 1) : navigate('/')}
          className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 dark:hover:text-white mb-6 transition-colors">
          <ArrowLeft size={16} /> {step > 1 ? 'Kembali' : 'Ke Beranda'}
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-brand-50 dark:bg-brand-900/20 flex items-center justify-center">
            <Building2 size={20} className="text-brand-500" />
          </div>
          <div>
            <h1 className="font-display text-2xl font-700 text-gray-900 dark:text-white">TechFix untuk Bisnis</h1>
            <p className="text-sm text-gray-500">IT support on-demand untuk UMKM & startup</p>
          </div>
        </div>

        {/* Value props */}
        {step === 1 && (
          <div className="grid grid-cols-3 gap-3 mt-6 mb-8">
            {[
              { icon: Zap,      text: 'No staf IT tetap diperlukan' },
              { icon: Users,    text: 'Teknisi spesialis on-demand' },
              { icon: Building2,text: 'SLA terjamin & terdokumentasi' },
            ].map(v => (
              <div key={v.text} className="p-3 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-center">
                <v.icon size={18} className="text-brand-500 mx-auto mb-2" />
                <p className="text-xs text-gray-600 dark:text-gray-400 leading-snug">{v.text}</p>
              </div>
            ))}
          </div>
        )}

        {/* Steps */}
        <div className="flex gap-2 mb-8">
          {[1, 2, 3].map(i => (
            <div key={i} className={`h-1.5 flex-1 rounded-full transition-colors ${i <= step ? 'bg-brand-500' : 'bg-gray-200 dark:bg-gray-700'}`} />
          ))}
        </div>

        {step === 1 && (
          <div className="space-y-4 animate-scale-in">
            <h2 className="font-display text-xl font-700 text-gray-900 dark:text-white mb-5">Pilih Paket Bisnis</h2>
            {plans.map(p => (
              <div key={p.id} onClick={() => setSelectedPlan(p.id)}
                className={`p-5 rounded-2xl border-2 cursor-pointer transition-all ${selectedPlan === p.id ? 'border-brand-500 bg-brand-50 dark:bg-brand-900/10' : 'border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 hover:border-gray-300 dark:hover:border-gray-600'}`}>
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${selectedPlan === p.id ? 'border-brand-500' : 'border-gray-300 dark:border-gray-600'}`}>
                      {selectedPlan === p.id && <div className="w-2.5 h-2.5 rounded-full bg-brand-500" />}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-display font-700 text-gray-900 dark:text-white">{p.name}</span>
                        {p.popular && <Badge color="blue">Populer</Badge>}
                      </div>
                      <p className="text-xs text-gray-500 mt-0.5">{p.desc}</p>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0 ml-3">
                    {p.price
                      ? <><span className="font-display font-700 text-gray-900 dark:text-white">Rp{p.price.toLocaleString('id')}</span><span className="text-xs text-gray-400">/bln</span></>
                      : <span className="text-sm font-medium text-brand-500">Hubungi kami</span>
                    }
                  </div>
                </div>
                <div className="grid grid-cols-1 gap-1 ml-8">
                  {p.features.map(f => (
                    <div key={f} className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                      <CheckCircle size={11} className="text-green-500 flex-shrink-0" /> {f}
                    </div>
                  ))}
                </div>
              </div>
            ))}
            <Button className="w-full mt-2" size="lg" onClick={() => setStep(2)}>
              Lanjut dengan Paket {plans.find(p => p.id === selectedPlan)?.name}
            </Button>
          </div>
        )}

        {step === 2 && (
          <Card className="p-6 animate-scale-in">
            <h2 className="font-display text-xl font-700 text-gray-900 dark:text-white mb-5">Data Perusahaan</h2>
            <div className="space-y-4">
              <Input label="Nama Perusahaan / Bisnis" placeholder="PT. Maju Bersama / Warung Kopi XYZ" />
              <Input label="Nama PIC (Person in Charge)" placeholder="Nama lengkap penanggung jawab" />
              <Input label="Email Bisnis" type="email" placeholder="it@company.com" />
              <Input label="No. WhatsApp PIC" placeholder="+62 812 xxxx xxxx" />
              <div className="grid grid-cols-2 gap-3">
                <Input label="Kota" placeholder="Bandung" />
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Skala Bisnis</label>
                  <select className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 text-gray-900 dark:text-white">
                    <option>1–5 karyawan</option>
                    <option>6–20 karyawan</option>
                    <option>21–50 karyawan</option>
                    <option>50+ karyawan</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Kebutuhan IT utama</label>
                <textarea rows={3}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 text-gray-900 dark:text-white resize-none"
                  placeholder="Contoh: maintenance rutin 10 laptop, setup jaringan kantor, backup data mingguan..." />
              </div>
            </div>
            <Button className="w-full mt-5" onClick={() => setStep(3)}>Daftar & Mulai Trial 7 Hari</Button>
          </Card>
        )}

        {step === 3 && (
          <div className="text-center py-8 animate-scale-in">
            <div className="w-20 h-20 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mx-auto mb-5">
              <CheckCircle size={40} className="text-green-500" />
            </div>
            <Badge color="green" className="mb-4">Trial 7 hari gratis aktif!</Badge>
            <h2 className="font-display text-2xl font-700 text-gray-900 dark:text-white mb-3">Selamat Datang di TechFix Business!</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 max-w-sm mx-auto mb-8">
              Tim kami akan menghubungi kamu dalam 1×24 jam untuk onboarding dan assign dedicated teknisi.
            </p>
            <div className="grid grid-cols-2 gap-3 max-w-xs mx-auto mb-8 text-left">
              {['Dedicated teknisi assigned','Dashboard bisnis aktif','SLA monitoring aktif','Billing bulanan otomatis'].map(s => (
                <div key={s} className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
                  <CheckCircle size={12} className="text-green-500 flex-shrink-0" /> {s}
                </div>
              ))}
            </div>
            <Button className="w-full" onClick={() => navigate('/customer')}>Masuk ke Dashboard</Button>
          </div>
        )}
      </div>
    </div>
  )
}
