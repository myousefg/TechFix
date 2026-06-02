import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Shield, Zap, Star, ArrowRight, CheckCircle, Wrench, Users, TrendingUp } from 'lucide-react'
import { TechnicianCard, Button, Badge } from '../components/UI'
import { technicians, services } from '../data'

export default function Home() {
  const navigate = useNavigate()
  return (
    <div className="pt-16">

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-gray-950 via-brand-900 to-gray-950 dark:from-gray-950 dark:via-brand-900/50 dark:to-gray-950 text-white">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-brand-500/20 via-transparent to-transparent pointer-events-none" />
        <div className="absolute inset-0" style={{backgroundImage:'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.05) 1px, transparent 0)', backgroundSize:'32px 32px'}} />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-24 md:py-36">
          <div className="max-w-3xl">
            <Badge color="blue">🚀 Platform Servis #1 di Indonesia</Badge>
            <h1 className="font-display text-5xl md:text-7xl font-700 leading-none mt-6 mb-6">
              Servis Elektronik<br />
              <span className="text-brand-400">Transparan &</span><br />
              Terpercaya
            </h1>
            <p className="text-lg text-gray-300 mb-10 max-w-xl leading-relaxed">
              Hubungkan perangkat rusak Anda dengan teknisi independen terverifikasi. Sistem escrow kami menjamin uang kembali jika servis gagal.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button size="lg" onClick={() => navigate('/customer')} className="bg-brand-500 hover:bg-brand-400 text-white">
                Cari Teknisi <ArrowRight size={16} />
              </Button>
              <Button size="lg" variant="outline" onClick={() => navigate('/technician')} className="border-white/20 text-white hover:bg-white/10">
                Daftar Sebagai Teknisi
              </Button>
            </div>
            <div className="flex flex-wrap gap-6 mt-12 text-sm text-gray-400">
              {[['600+','Transaksi/bulan'],['100+','Teknisi terverifikasi'],['4.8★','Rating rata-rata']].map(([v,l]) => (
                <div key={l}><span className="text-white font-semibold">{v}</span> {l}</div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="py-20 bg-gray-50 dark:bg-gray-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl md:text-4xl font-700 text-gray-900 dark:text-white">Semua Layanan Servis</h2>
            <p className="text-gray-500 dark:text-gray-400 mt-3">Dari servis umum hingga spesialisasi niche</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {services.map(s => (
              <button key={s.id} onClick={() => navigate(`/customer/search?service=${s.label}`)}
                className="p-5 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 hover:border-brand-300 dark:hover:border-brand-700 hover:shadow-md transition-all text-left group">
                <div className="text-3xl mb-3">{s.icon}</div>
                <p className="font-semibold text-gray-900 dark:text-white text-sm group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">{s.label}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{s.desc}</p>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Technicians */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="font-display text-3xl font-700 text-gray-900 dark:text-white">Teknisi Terpilih</h2>
              <p className="text-gray-500 dark:text-gray-400 mt-1 text-sm">Diverifikasi & dirating oleh ribuan pengguna</p>
            </div>
            <Button variant="outline" onClick={() => navigate('/customer/search')}>Lihat Semua <ArrowRight size={14} /></Button>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {technicians.slice(0,6).map(t => (
              <TechnicianCard key={t.id} {...t} onClick={() => navigate(`/customer/technician/${t.id}`)} />
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 bg-gray-50 dark:bg-gray-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl md:text-4xl font-700 text-gray-900 dark:text-white">Cara Kerja TechFix</h2>
          </div>
          <div className="grid md:grid-cols-4 gap-6">
            {[
              { step: '01', icon: '🔍', title: 'Cari Teknisi',    desc: 'Filter berdasarkan lokasi, spesialisasi & rating' },
              { step: '02', icon: '📋', title: 'Buat Pesanan',    desc: 'Deskripsikan masalah & jadwalkan servis' },
              { step: '03', icon: '🔒', title: 'Bayar via Escrow', desc: 'Dana aman tertahan sampai servis selesai' },
              { step: '04', icon: '✅', title: 'Konfirmasi',       desc: 'Setujui hasil servis, dana diteruskan ke teknisi' },
            ].map(s => (
              <div key={s.step} className="text-center">
                <div className="w-12 h-12 rounded-2xl bg-brand-50 dark:bg-brand-900/30 flex items-center justify-center text-2xl mx-auto mb-4">{s.icon}</div>
                <div className="font-mono text-xs text-brand-500 mb-1">{s.step}</div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">{s.title}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Value props */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: Shield, title: 'Sistem Escrow',      desc: 'Garansi uang kembali jika servis gagal. Dana hanya diteruskan setelah kamu konfirmasi puas.', color: 'text-brand-500' },
              { icon: Star,   title: 'Teknisi Terverifikasi', desc: 'Setiap teknisi melewati proses KYC ketat dan dirating secara transparan oleh pengguna sebelumnya.', color: 'text-amber-500' },
              { icon: Zap,    title: 'Tracking Real-Time', desc: 'Pantau progres perbaikan via foto & video dari teknisi. Tidak ada yang disembunyikan.', color: 'text-accent-500' },
            ].map(v => (
              <div key={v.title} className="p-6 rounded-2xl border border-gray-200 dark:border-gray-800">
                <v.icon size={24} className={`${v.color} mb-4`} />
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">{v.title}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-brand-500">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center text-white">
          <h2 className="font-display text-4xl font-700 mb-4">Siap Mulai?</h2>
          <p className="text-brand-100 mb-8">Bergabung dengan ribuan pengguna yang sudah mempercayai TechFix untuk perangkat elektronik mereka.</p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Button size="lg" onClick={() => navigate('/customer/register')} className="bg-white text-brand-600 hover:bg-gray-50">
              Daftar sebagai Pelanggan
            </Button>
            <Button size="lg" onClick={() => navigate('/technician/register')} className="bg-brand-600 hover:bg-brand-700 text-white border border-brand-400">
              Daftar sebagai Teknisi
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 border-t border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-brand-500 flex items-center justify-center"><Wrench size={13} className="text-white" /></div>
            <span className="font-display font-700">Tech<span className="text-brand-500">Fix</span></span>
          </div>
          <p className="text-sm text-gray-400">© 2025 TechFix. Tugas Besar Model Bisnis Digital – Telkom University.</p>
        </div>
      </footer>
    </div>
  )
}
