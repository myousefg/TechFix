import React, { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Shield, Zap, Star, ArrowRight, CheckCircle, Wrench } from 'lucide-react'
import { TechnicianCard, Button, Badge } from '../components/UI'
import { technicians, services } from '../data'

/* ── Animated counter hook ── */
function useCounter(target, duration = 1500, start = false) {
  const [count, setCount] = useState(0)
  useEffect(() => {
    if (!start) return
    let startTime = null
    const step = (timestamp) => {
      if (!startTime) startTime = timestamp
      const progress = Math.min((timestamp - startTime) / duration, 1)
      setCount(Math.floor(progress * target))
      if (progress < 1) requestAnimationFrame(step)
    }
    requestAnimationFrame(step)
  }, [target, duration, start])
  return count
}

/* ── Scroll reveal hook ── */
function useScrollReveal() {
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true) }, { threshold: 0.15 })
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [])
  return [ref, visible]
}

/* ── Floating orb ── */
function Orb({ style }) {
  return <div className="absolute rounded-full pointer-events-none" style={style} />
}

/* ── Stats section with counters ── */
function StatsSection() {
  const [ref, visible] = useScrollReveal()
  const txn  = useCounter(600,  1400, visible)
  const tech = useCounter(100,  1200, visible)
  const usr  = useCounter(1247, 1600, visible)
  const stats = [
    { value: txn+'+'  , label: 'Transaksi/bulan',      sub: 'dan terus bertumbuh' },
    { value: tech+'+' , label: 'Teknisi terverifikasi', sub: 'di seluruh Bandung' },
    { value: usr+''   , label: 'Pengguna terdaftar',    sub: 'bulan pertama' },
    { value: '4.9★'   , label: 'Rating rata-rata',      sub: 'dari 1.200+ ulasan' },
  ]
  return (
    <div ref={ref} className="grid grid-cols-2 md:grid-cols-4 gap-px bg-gray-200 dark:bg-gray-800 rounded-2xl overflow-hidden">
      {stats.map((s, i) => (
        <div key={s.label}
          className="bg-white dark:bg-gray-900 p-6 text-center"
          style={{ animation: visible ? `slide-up 0.5s ease-out ${i*100}ms both` : 'none' }}>
          <p className="font-display text-3xl font-700 text-gray-900 dark:text-white">{s.value}</p>
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mt-1">{s.label}</p>
          <p className="text-xs text-gray-400 mt-0.5">{s.sub}</p>
        </div>
      ))}
    </div>
  )
}

/* ── Reveal section wrapper ── */
function Reveal({ children, delay = 0, className = '' }) {
  const [ref, visible] = useScrollReveal()
  return (
    <div ref={ref} className={className}
      style={{ animation: visible ? `slide-up 0.55s ease-out ${delay}ms both` : 'none', opacity: visible ? undefined : 0 }}>
      {children}
    </div>
  )
}

export default function Home() {
  const navigate = useNavigate()
  const [heroVisible, setHeroVisible] = useState(false)
  useEffect(() => { setTimeout(() => setHeroVisible(true), 50) }, [])

  return (
    <div className="pt-16 overflow-x-hidden">

      {/* ── HERO ── */}
      <section className="relative overflow-hidden bg-gray-950 text-white min-h-[90vh] flex items-center noise">
        {/* Animated orbs */}
        <Orb style={{ width:600, height:600, top:'-200px', right:'-150px', background:'radial-gradient(circle, rgba(0,102,230,0.25) 0%, transparent 70%)', animation:'float 8s ease-in-out infinite' }} />
        <Orb style={{ width:400, height:400, bottom:'-100px', left:'-100px', background:'radial-gradient(circle, rgba(0,229,196,0.15) 0%, transparent 70%)', animation:'float2 10s ease-in-out infinite' }} />
        <Orb style={{ width:300, height:300, top:'30%', left:'40%', background:'radial-gradient(circle, rgba(0,102,230,0.1) 0%, transparent 70%)', animation:'float 12s ease-in-out infinite reverse' }} />
        {/* Grid */}
        <div className="absolute inset-0" style={{backgroundImage:'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)', backgroundSize:'48px 48px'}} />
        {/* Gradient bottom fade */}
        <div className="absolute bottom-0 inset-x-0 h-32 bg-gradient-to-t from-gray-950 to-transparent" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-24 md:py-32 w-full">
          <div className="max-w-3xl">
            {/* Badge */}
            <div style={{ animation: heroVisible ? 'slide-up 0.5s ease-out 0ms both' : 'none', opacity: heroVisible ? undefined : 0 }}>
              <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium glass text-brand-300 border-brand-500/30 mb-6">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping-slow absolute inline-flex h-full w-full rounded-full bg-accent-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-accent-400" />
                </span>
                Platform Servis Elektronik #1 Indonesia
              </span>
            </div>

            {/* Headline */}
            <div style={{ animation: heroVisible ? 'slide-up 0.5s ease-out 100ms both' : 'none', opacity: heroVisible ? undefined : 0 }}>
              <h1 className="font-display text-5xl md:text-7xl font-700 leading-[1.05] mb-6">
                Servis Elektronik<br />
                <span className="text-shimmer">Transparan &</span><br />
                Terpercaya
              </h1>
            </div>

            {/* Sub */}
            <div style={{ animation: heroVisible ? 'slide-up 0.5s ease-out 200ms both' : 'none', opacity: heroVisible ? undefined : 0 }}>
              <p className="text-lg text-gray-300 mb-10 max-w-xl leading-relaxed">
                Hubungkan perangkat rusak Anda dengan teknisi independen terverifikasi. Sistem escrow kami menjamin <span className="text-accent-400 font-medium">uang kembali</span> jika servis gagal.
              </p>
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap gap-3 mb-14" style={{ animation: heroVisible ? 'slide-up 0.5s ease-out 300ms both' : 'none', opacity: heroVisible ? undefined : 0 }}>
              <button onClick={() => navigate('/customer')}
                className="press group flex items-center gap-2 px-6 py-3 rounded-xl bg-brand-500 hover:bg-brand-400 text-white font-medium text-sm transition-all animate-pulse-glow hover:shadow-[0_0_30px_rgba(0,102,230,0.5)]">
                Cari Teknisi
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </button>
              <button onClick={() => navigate('/technician')}
                className="press flex items-center gap-2 px-6 py-3 rounded-xl glass text-white hover:bg-white/10 font-medium text-sm transition-all border border-white/10">
                Daftar Sebagai Teknisi
              </button>
            </div>

            {/* Trust badges */}
            <div className="flex flex-wrap gap-4" style={{ animation: heroVisible ? 'slide-up 0.5s ease-out 400ms both' : 'none', opacity: heroVisible ? undefined : 0 }}>
              {[
                { icon: Shield,       text: 'Escrow Terlindungi' },
                { icon: CheckCircle,  text: 'KYC Terverifikasi' },
                { icon: Star,         text: 'Rating Transparan' },
              ].map(b => (
                <div key={b.text} className="flex items-center gap-2 text-sm text-gray-400">
                  <b.icon size={14} className="text-accent-400" />
                  {b.text}
                </div>
              ))}
            </div>
          </div>

          {/* Floating card decoration */}
          <div className="hidden lg:block absolute right-8 top-1/2 -translate-y-1/2 w-72 animate-float2" style={{animationDelay:'1s'}}>
            <div className="glass rounded-2xl p-5 mb-3">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center text-white font-display font-700">B</div>
                <div>
                  <p className="text-sm font-semibold text-white">Budi Santoso</p>
                  <p className="text-xs text-gray-400">Laptop & PC Repair</p>
                </div>
                <Shield size={14} className="text-brand-400 ml-auto" />
              </div>
              <div className="flex gap-0.5 mb-2">
                {[1,2,3,4,5].map(i => <Star key={i} size={11} className="fill-amber-400 text-amber-400" />)}
                <span className="text-xs text-gray-400 ml-1">4.9 (127)</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-400">Mulai dari</span>
                <span className="text-sm font-semibold text-white">Rp75.000</span>
              </div>
            </div>

            <div className="glass rounded-2xl p-4 animate-float" style={{animationDelay:'0.5s'}}>
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                <span className="text-xs text-gray-300 font-medium">Escrow Aktif</span>
              </div>
              <p className="text-xs text-gray-400">Dana Rp175.000 aman tertahan</p>
              <div className="mt-2 h-1.5 bg-white/10 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-brand-500 to-accent-400 rounded-full w-3/4 transition-all" />
              </div>
              <p className="text-xs text-gray-500 mt-1">75% — Servis berlangsung</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── STATS ── */}
      <section className="py-16 bg-white dark:bg-gray-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <StatsSection />
        </div>
      </section>

      {/* ── SERVICES ── */}
      <section className="py-20 bg-gray-50 dark:bg-gray-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <Reveal className="text-center mb-12">
            <h2 className="font-display text-3xl md:text-4xl font-700 text-gray-900 dark:text-white">Semua Layanan Servis</h2>
            <p className="text-gray-500 dark:text-gray-400 mt-3">Dari servis umum hingga spesialisasi niche</p>
          </Reveal>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {services.map((s, i) => (
              <Reveal key={s.id} delay={i * 60}>
                <button onClick={() => navigate(`/customer/search?service=${s.label}`)}
                  className="w-full p-5 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 hover:border-brand-400 dark:hover:border-brand-600 card-glow hover-lift group text-left transition-all">
                  <div className="text-3xl mb-3 group-hover:scale-110 transition-transform inline-block">{s.icon}</div>
                  <p className="font-semibold text-gray-900 dark:text-white text-sm group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">{s.label}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{s.desc}</p>
                  <div className="flex items-center gap-1 mt-3 text-brand-500 opacity-0 group-hover:opacity-100 transition-opacity text-xs font-medium">
                    Cari teknisi <ArrowRight size={11} />
                  </div>
                </button>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── TECHNICIANS ── */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <Reveal className="flex items-center justify-between mb-8">
            <div>
              <h2 className="font-display text-3xl font-700 text-gray-900 dark:text-white">Teknisi Terpilih</h2>
              <p className="text-gray-500 dark:text-gray-400 mt-1 text-sm">Diverifikasi & dirating oleh ribuan pengguna</p>
            </div>
            <Button variant="outline" onClick={() => navigate('/customer/search')} className="group">
              Lihat Semua <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </Button>
          </Reveal>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {technicians.slice(0,6).map((t, i) => (
              <Reveal key={t.id} delay={i * 80}>
                <div className="hover-lift card-glow rounded-2xl">
                  <TechnicianCard {...t} onClick={() => navigate(`/customer/technician/${t.id}`)} />
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="py-20 bg-gray-50 dark:bg-gray-900/50 relative overflow-hidden">
        <Orb style={{ width:500, height:500, top:'-100px', right:'-150px', background:'radial-gradient(circle, rgba(0,229,196,0.06) 0%, transparent 70%)', pointerEvents:'none' }} />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative">
          <Reveal className="text-center mb-14">
            <h2 className="font-display text-3xl md:text-4xl font-700 text-gray-900 dark:text-white">Cara Kerja TechFix</h2>
            <p className="text-gray-500 dark:text-gray-400 mt-3 max-w-lg mx-auto">4 langkah mudah dari masalah ke solusi, dengan keamanan penuh</p>
          </Reveal>
          <div className="grid md:grid-cols-4 gap-6 relative">
            {/* Connector line */}
            <div className="hidden md:block absolute top-8 left-[12.5%] right-[12.5%] h-px bg-gradient-to-r from-brand-500/0 via-brand-500/40 to-brand-500/0" />
            {[
              { step:'01', icon:'🔍', title:'Cari Teknisi',    desc:'Filter berdasarkan lokasi, spesialisasi & rating pengguna' },
              { step:'02', icon:'📋', title:'Buat Pesanan',    desc:'Deskripsikan masalah & jadwalkan servis sesuai waktu kamu' },
              { step:'03', icon:'🔒', title:'Bayar via Escrow', desc:'Dana aman tertahan sampai kamu konfirmasi servis selesai' },
              { step:'04', icon:'✅', title:'Konfirmasi',       desc:'Setujui hasil servis, dana diteruskan ke teknisi secara otomatis' },
            ].map((s, i) => (
              <Reveal key={s.step} delay={i * 100}>
                <div className="text-center group">
                  <div className="relative inline-flex mb-4">
                    <div className="w-16 h-16 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 flex items-center justify-center text-3xl group-hover:border-brand-400 dark:group-hover:border-brand-600 group-hover:scale-110 transition-all duration-300 shadow-sm">
                      {s.icon}
                    </div>
                    <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-brand-500 text-white text-xs font-mono font-bold flex items-center justify-center">
                      {i+1}
                    </span>
                  </div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">{s.title}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{s.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── VALUE PROPS ── */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: Shield, title:'Sistem Escrow',         desc:'Garansi uang kembali jika servis gagal. Dana hanya diteruskan setelah kamu konfirmasi puas.', color:'text-brand-500', bg:'bg-brand-50 dark:bg-brand-900/20', border:'hover:border-brand-300 dark:hover:border-brand-700' },
              { icon: Star,   title:'Teknisi Terverifikasi', desc:'Setiap teknisi melewati proses KYC ketat dan dirating secara transparan oleh pengguna sebelumnya.', color:'text-amber-500', bg:'bg-amber-50 dark:bg-amber-900/20', border:'hover:border-amber-300 dark:hover:border-amber-700' },
              { icon: Zap,    title:'Tracking Real-Time',   desc:'Pantau progres perbaikan via foto & video dari teknisi. Tidak ada yang disembunyikan.', color:'text-accent-500', bg:'bg-teal-50 dark:bg-teal-900/20', border:'hover:border-teal-300 dark:hover:border-teal-700' },
            ].map((v, i) => (
              <Reveal key={v.title} delay={i * 100}>
                <div className={`p-6 rounded-2xl border border-gray-200 dark:border-gray-800 ${v.border} card-glow hover-lift transition-all group`}>
                  <div className={`w-11 h-11 rounded-xl ${v.bg} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                    <v.icon size={20} className={v.color} />
                  </div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">{v.title}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{v.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section className="py-20 bg-gray-50 dark:bg-gray-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <Reveal className="text-center mb-10">
            <h2 className="font-display text-3xl font-700 text-gray-900 dark:text-white">Kata Mereka</h2>
          </Reveal>
          <div className="grid md:grid-cols-3 gap-4">
            {[
              { name:'Andi Rachman',  role:'Mahasiswa ITB',        avatar:'A', rating:5, text:'Laptop saya sembuh dalam 2 jam! Transparansi harga dan update progres via foto bikin tenang banget.' },
              { name:'Maya Sari',     role:'Desainer Freelance',    avatar:'M', rating:5, text:'Akhirnya ada platform servis yang bisa dipercaya. Sistem escrow-nya beneran aman, bukan cuma janji.' },
              { name:'Rizky Pratama', role:'Gamer & Content Creator',avatar:'R', rating:5, text:'Teknisi thermal repaste-nya ahli banget. Suhu laptop turun 20°C. Worth every rupiah!' },
            ].map((t, i) => (
              <Reveal key={t.name} delay={i * 100}>
                <div className="p-6 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 card-glow hover-lift">
                  <div className="flex gap-0.5 mb-4">
                    {[1,2,3,4,5].map(i => <Star key={i} size={14} className="fill-amber-400 text-amber-400" />)}
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed mb-4">"{t.text}"</p>
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center text-white text-sm font-bold">{t.avatar}</div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900 dark:text-white">{t.name}</p>
                      <p className="text-xs text-gray-400">{t.role}</p>
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-24 relative overflow-hidden bg-gray-950 text-white noise">
        <Orb style={{ width:600, height:600, top:'-200px', left:'-100px', background:'radial-gradient(circle, rgba(0,102,230,0.2) 0%, transparent 70%)', pointerEvents:'none' }} />
        <Orb style={{ width:400, height:400, bottom:'-100px', right:'-50px', background:'radial-gradient(circle, rgba(0,229,196,0.15) 0%, transparent 70%)', pointerEvents:'none' }} />
        <Reveal className="relative max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="font-display text-4xl md:text-5xl font-700 mb-4">
            Siap Mulai?
          </h2>
          <p className="text-gray-400 mb-10 text-lg">Bergabung dengan ribuan pengguna yang sudah mempercayai TechFix untuk perangkat elektronik mereka.</p>
          <div className="flex flex-wrap gap-4 justify-center">
            <button onClick={() => navigate('/customer/register')}
              className="press group flex items-center gap-2 px-8 py-4 rounded-xl bg-brand-500 hover:bg-brand-400 text-white font-medium transition-all animate-pulse-glow text-sm">
              Daftar sebagai Pelanggan
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </button>
            <button onClick={() => navigate('/technician/register')}
              className="press flex items-center gap-2 px-8 py-4 rounded-xl glass text-white hover:bg-white/10 font-medium transition-all text-sm border border-white/10 teal-glow">
              Daftar sebagai Teknisi
            </button>
          </div>
        </Reveal>
      </section>

      {/* ── FOOTER ── */}
      <footer className="py-10 border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-brand-500 flex items-center justify-center animate-pulse-glow">
              <Wrench size={14} className="text-white" />
            </div>
            <span className="font-display font-700 text-lg">Tech<span className="text-brand-500">Fix</span></span>
          </div>
          <div className="flex gap-6 text-sm text-gray-400">
            <button onClick={() => navigate('/customer')} className="hover:text-gray-900 dark:hover:text-white transition-colors">Pelanggan</button>
            <button onClick={() => navigate('/technician')} className="hover:text-gray-900 dark:hover:text-white transition-colors">Teknisi</button>
            <button onClick={() => navigate('/admin')} className="hover:text-gray-900 dark:hover:text-white transition-colors">Admin</button>
            <button onClick={() => navigate('/about')} className="hover:text-gray-900 dark:hover:text-white transition-colors">Tentang</button>
          </div>
          <p className="text-xs text-gray-400">© 2025 TechFix · Telkom University</p>
        </div>
      </footer>
    </div>
  )
}
