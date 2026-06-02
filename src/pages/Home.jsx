import React, { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Shield, Zap, Star, ArrowRight, CheckCircle, Wrench } from 'lucide-react'
import { TechnicianCard, Badge } from '../components/UI'
import { technicians, services } from '../data'

function useCounter(target, duration = 1400, start = false) {
  const [count, setCount] = useState(0)
  useEffect(() => {
    if (!start) return
    let startTime = null
    const step = (ts) => {
      if (!startTime) startTime = ts
      const p = Math.min((ts - startTime) / duration, 1)
      setCount(Math.floor(p * target))
      if (p < 1) requestAnimationFrame(step)
    }
    requestAnimationFrame(step)
  }, [target, duration, start])
  return count
}

function useReveal(threshold = 0.12) {
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true) }, { threshold })
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [])
  return [ref, visible]
}

function Reveal({ children, delay = 0, className = '' }) {
  const [ref, visible] = useReveal()
  return (
    <div ref={ref} className={className}
      style={{ animation: visible ? `slide-up 0.5s ease-out ${delay}ms both` : 'none', opacity: visible ? undefined : 0 }}>
      {children}
    </div>
  )
}

function Orb({ style }) {
  return <div className="absolute rounded-full pointer-events-none select-none" style={style} />
}

function StatsRow() {
  const [ref, visible] = useReveal()
  const txn  = useCounter(600,  1400, visible)
  const tech = useCounter(100,  1200, visible)
  const usr  = useCounter(1247, 1600, visible)
  const stats = [
    { value: txn + '+',  label: 'Transaksi/bulan' },
    { value: tech + '+', label: 'Teknisi aktif' },
    { value: usr + '',   label: 'Pengguna' },
    { value: '4.9★',    label: 'Rating' },
  ]
  return (
    <div ref={ref} className="grid grid-cols-2 sm:grid-cols-4 gap-px bg-gray-200 dark:bg-gray-800 rounded-2xl overflow-hidden">
      {stats.map((s, i) => (
        <div key={s.label} className="bg-white dark:bg-gray-900 px-4 py-5 text-center"
          style={{ animation: visible ? `slide-up 0.45s ease-out ${i * 80}ms both` : 'none' }}>
          <p className="font-display text-2xl sm:text-3xl font-700 text-gray-900 dark:text-white tabular-nums">{s.value}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 font-medium">{s.label}</p>
        </div>
      ))}
    </div>
  )
}

export default function Home() {
  const navigate = useNavigate()
  const [heroIn, setHeroIn] = useState(false)
  useEffect(() => { const t = setTimeout(() => setHeroIn(true), 50); return () => clearTimeout(t) }, [])

  const anim = (delay) => ({
    style: { animation: heroIn ? `slide-up 0.5s ease-out ${delay}ms both` : 'none', opacity: heroIn ? undefined : 0 }
  })

  return (
    <div className="pt-16 overflow-x-hidden">

      {/* ─── HERO ─────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-gray-950 text-white min-h-[92dvh] sm:min-h-[88vh] flex items-center">
        {/* Background layers */}
        <Orb style={{ width: 500, height: 500, top: '-120px', right: '-100px', background: 'radial-gradient(circle, rgba(0,102,230,0.28) 0%, transparent 70%)', animation: 'float 9s ease-in-out infinite' }} />
        <Orb style={{ width: 350, height: 350, bottom: '-60px', left: '-80px', background: 'radial-gradient(circle, rgba(0,229,196,0.18) 0%, transparent 70%)', animation: 'float2 11s ease-in-out infinite' }} />
        <div className="absolute inset-0 opacity-[0.04]"
          style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
        <div className="absolute bottom-0 inset-x-0 h-28 bg-gradient-to-t from-gray-950 to-transparent" />

        <div className="relative w-full max-w-7xl mx-auto px-5 sm:px-8 py-20 sm:py-28">
          <div className="max-w-2xl">

            {/* Live badge */}
            <div {...anim(0)}>
              <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium glass border border-white/10 text-brand-300 mb-5 sm:mb-6">
                <span className="relative flex h-2 w-2 flex-shrink-0">
                  <span className="animate-ping-slow absolute inline-flex h-full w-full rounded-full bg-accent-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-accent-400" />
                </span>
                Platform Servis Elektronik #1 Indonesia
              </span>
            </div>

            {/* Headline — fluid type scale */}
            <div {...anim(100)}>
              <h1 className="font-display font-700 leading-[1.05] mb-5 sm:mb-6"
                style={{ fontSize: 'clamp(2.4rem, 8vw, 4.5rem)' }}>
                Servis Elektronik<br />
                <span className="text-shimmer">Transparan &</span><br />
                Terpercaya
              </h1>
            </div>

            {/* Subtext */}
            <div {...anim(200)}>
              <p className="text-base sm:text-lg text-gray-300 mb-8 sm:mb-10 leading-relaxed max-w-lg">
                Hubungkan perangkat rusak Anda dengan teknisi independen terverifikasi.
                Sistem escrow kami menjamin{' '}
                <span className="text-accent-400 font-medium">uang kembali</span>{' '}
                jika servis gagal.
              </p>
            </div>

            {/* CTAs — full-width on small phones */}
            <div {...anim(300)}>
              <div className="flex flex-col xs:flex-row gap-3 sm:gap-3 mb-10 sm:mb-12">
                <button
                  onClick={() => navigate('/customer')}
                  className="press group flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-brand-500 hover:bg-brand-400 text-white font-medium text-sm transition-all animate-pulse-glow w-full xs:w-auto">
                  Cari Teknisi
                  <ArrowRight size={15} className="group-hover:translate-x-0.5 transition-transform" />
                </button>
                <button
                  onClick={() => navigate('/technician')}
                  className="press flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl border border-white/15 text-white hover:bg-white/8 font-medium text-sm transition-all w-full xs:w-auto">
                  Daftar Sebagai Teknisi
                </button>
              </div>
            </div>

            {/* Trust badges */}
            <div {...anim(400)}>
              <div className="flex flex-wrap gap-x-5 gap-y-2">
                {[
                  { icon: Shield,      text: 'Escrow Terlindungi' },
                  { icon: CheckCircle, text: 'KYC Terverifikasi' },
                  { icon: Star,        text: 'Rating Transparan' },
                ].map(b => (
                  <div key={b.text} className="flex items-center gap-1.5 text-sm text-gray-400">
                    <b.icon size={13} className="text-accent-400 flex-shrink-0" />
                    {b.text}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Floating cards — only on large screens */}
          <div className="hidden lg:block absolute right-8 top-1/2 -translate-y-1/2 w-68 space-y-3"
            style={{ animation: heroIn ? 'float2 8s ease-in-out infinite' : 'none', animationDelay: '1s' }}>
            <div className="glass rounded-2xl p-5 border border-white/10">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center text-white font-display font-700">B</div>
                <div>
                  <p className="text-sm font-semibold text-white">Budi Santoso</p>
                  <p className="text-xs text-gray-400">Laptop & PC Repair</p>
                </div>
                <Shield size={13} className="text-brand-400 ml-auto" />
              </div>
              <div className="flex gap-0.5 mb-2">
                {[1,2,3,4,5].map(i => <Star key={i} size={11} className="fill-amber-400 text-amber-400" />)}
                <span className="text-xs text-gray-400 ml-1">4.9 (127)</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-400">Mulai dari</span>
                <span className="text-sm font-semibold text-white">Rp75.000</span>
              </div>
            </div>
            <div className="glass rounded-xl p-4 border border-white/10" style={{ animation: 'float 7s ease-in-out infinite', animationDelay: '0.5s' }}>
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                <span className="text-xs text-gray-300 font-medium">Escrow Aktif · TF-002</span>
              </div>
              <p className="text-xs text-gray-400 mb-2">Dana Rp120.000 aman tertahan</p>
              <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-brand-500 to-accent-400 rounded-full transition-all" style={{ width: '65%' }} />
              </div>
              <p className="text-xs text-gray-500 mt-1.5">65% — Servis berlangsung</p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── STATS ─────────────────────────────────────────────── */}
      <section className="py-12 sm:py-16 bg-white dark:bg-gray-950">
        <div className="max-w-5xl mx-auto px-5 sm:px-8">
          <StatsRow />
        </div>
      </section>

      {/* ─── SERVICES ──────────────────────────────────────────── */}
      <section className="py-16 sm:py-20 bg-gray-50 dark:bg-gray-900/50">
        <div className="max-w-5xl mx-auto px-5 sm:px-8">
          <Reveal className="mb-10 sm:mb-12">
            <h2 className="font-display text-2xl sm:text-4xl font-700 text-gray-900 dark:text-white">Semua Layanan</h2>
            <p className="text-gray-500 dark:text-gray-400 mt-2 text-sm sm:text-base">Dari servis umum hingga spesialisasi niche</p>
          </Reveal>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
            {services.map((s, i) => (
              <Reveal key={s.id} delay={i * 50}>
                <button onClick={() => navigate(`/customer/search?service=${s.label}`)}
                  className="w-full p-4 sm:p-5 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 hover:border-brand-400 dark:hover:border-brand-600 card-glow hover-lift group text-left transition-all">
                  <div className="text-2xl sm:text-3xl mb-2 sm:mb-3 group-hover:scale-110 transition-transform inline-block">{s.icon}</div>
                  <p className="font-semibold text-gray-900 dark:text-white text-xs sm:text-sm group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors leading-snug">{s.label}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 leading-snug hidden sm:block">{s.desc}</p>
                  <div className="flex items-center gap-1 mt-2 text-brand-500 opacity-0 group-hover:opacity-100 transition-opacity text-xs font-medium">
                    Cari <ArrowRight size={10} />
                  </div>
                </button>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ─── TECHNICIANS ───────────────────────────────────────── */}
      <section className="py-16 sm:py-20">
        <div className="max-w-5xl mx-auto px-5 sm:px-8">
          <Reveal className="flex items-end justify-between mb-6 sm:mb-8">
            <div>
              <h2 className="font-display text-2xl sm:text-3xl font-700 text-gray-900 dark:text-white">Teknisi Terpilih</h2>
              <p className="text-gray-500 dark:text-gray-400 mt-1 text-sm">Diverifikasi & dirating ribuan pengguna</p>
            </div>
            <button onClick={() => navigate('/customer/search')}
              className="press flex-shrink-0 flex items-center gap-1 text-sm text-brand-500 font-medium hover:text-brand-400 transition-colors group">
              Semua <ArrowRight size={13} className="group-hover:translate-x-0.5 transition-transform" />
            </button>
          </Reveal>

          {/* Mobile: horizontal scroll; Desktop: grid */}
          <div className="sm:hidden flex gap-3 overflow-x-auto pb-2 scrollbar-none -mx-5 px-5">
            {technicians.map(t => (
              <div key={t.id} className="flex-shrink-0 w-72">
                <TechnicianCard {...t} onClick={() => navigate(`/customer/technician/${t.id}`)} />
              </div>
            ))}
          </div>
          <div className="hidden sm:grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {technicians.slice(0, 6).map((t, i) => (
              <Reveal key={t.id} delay={i * 70}>
                <div className="hover-lift card-glow rounded-2xl">
                  <TechnicianCard {...t} onClick={() => navigate(`/customer/technician/${t.id}`)} />
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ─── HOW IT WORKS ──────────────────────────────────────── */}
      <section className="py-16 sm:py-20 bg-gray-50 dark:bg-gray-900/50">
        <div className="max-w-5xl mx-auto px-5 sm:px-8">
          <Reveal className="mb-10 sm:mb-14">
            <h2 className="font-display text-2xl sm:text-4xl font-700 text-gray-900 dark:text-white">Cara Kerja TechFix</h2>
            <p className="text-gray-500 dark:text-gray-400 mt-2 text-sm sm:text-base max-w-lg">4 langkah mudah, keamanan penuh</p>
          </Reveal>

          {/* Vertical on mobile, horizontal on desktop */}
          <div className="flex flex-col sm:grid sm:grid-cols-4 gap-6 sm:gap-4 relative">
            <div className="hidden sm:block absolute top-8 left-[12.5%] right-[12.5%] h-px bg-gradient-to-r from-brand-500/0 via-brand-500/30 to-brand-500/0" />
            {[
              { step: '01', icon: '🔍', title: 'Cari Teknisi',     desc: 'Filter lokasi, spesialisasi & rating' },
              { step: '02', icon: '📋', title: 'Buat Pesanan',     desc: 'Deskripsikan masalah & jadwalkan' },
              { step: '03', icon: '🔒', title: 'Bayar via Escrow', desc: 'Dana aman sampai servis selesai' },
              { step: '04', icon: '✅', title: 'Konfirmasi',        desc: 'Setujui & dana diteruskan otomatis' },
            ].map((s, i) => (
              <Reveal key={s.step} delay={i * 80}>
                {/* Mobile: horizontal row; Desktop: vertical card */}
                <div className="flex items-center gap-4 sm:block sm:text-center group">
                  <div className="relative flex-shrink-0 sm:flex sm:justify-center sm:mb-4">
                    <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 flex items-center justify-center text-2xl sm:text-3xl group-hover:border-brand-400 dark:group-hover:border-brand-600 group-hover:scale-105 transition-all shadow-sm">
                      {s.icon}
                    </div>
                    <span className="absolute -top-1.5 -right-1.5 sm:top-auto sm:-right-2 w-5 h-5 rounded-full bg-brand-500 text-white text-xs font-mono font-700 flex items-center justify-center">
                      {i + 1}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white text-sm sm:mb-1">{s.title}</h3>
                    <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{s.desc}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ─── VALUE PROPS ───────────────────────────────────────── */}
      <section className="py-16 sm:py-20">
        <div className="max-w-5xl mx-auto px-5 sm:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { icon: Shield, title: 'Sistem Escrow',          desc: 'Garansi uang kembali jika servis gagal. Dana hanya diteruskan setelah kamu konfirmasi puas.',    color: 'text-brand-500', bg: 'bg-brand-50 dark:bg-brand-900/20', border: 'hover:border-brand-300 dark:hover:border-brand-700' },
              { icon: Star,   title: 'Teknisi Terverifikasi',  desc: 'Setiap teknisi melewati proses KYC ketat dan dirating secara transparan oleh pengguna.',         color: 'text-amber-500', bg: 'bg-amber-50 dark:bg-amber-900/20', border: 'hover:border-amber-300 dark:hover:border-amber-700' },
              { icon: Zap,    title: 'Tracking Real-Time',     desc: 'Pantau progres perbaikan via foto & video dari teknisi. Tidak ada yang disembunyikan.',           color: 'text-accent-500',bg: 'bg-teal-50 dark:bg-teal-900/20',  border: 'hover:border-teal-300 dark:hover:border-teal-700' },
            ].map((v, i) => (
              <Reveal key={v.title} delay={i * 80}>
                <div className={`p-5 sm:p-6 rounded-2xl border border-gray-200 dark:border-gray-800 ${v.border} card-glow hover-lift transition-all group`}>
                  <div className={`w-10 h-10 rounded-xl ${v.bg} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                    <v.icon size={18} className={v.color} />
                  </div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-1.5 text-sm sm:text-base">{v.title}</h3>
                  <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{v.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ─── TESTIMONIALS ──────────────────────────────────────── */}
      <section className="py-16 sm:py-20 bg-gray-50 dark:bg-gray-900/50">
        <div className="max-w-5xl mx-auto px-5 sm:px-8">
          <Reveal className="mb-8 sm:mb-10">
            <h2 className="font-display text-2xl sm:text-3xl font-700 text-gray-900 dark:text-white">Kata Mereka</h2>
          </Reveal>

          {/* Mobile: horizontal scroll; Desktop: grid */}
          <div className="sm:hidden flex gap-3 overflow-x-auto pb-2 scrollbar-none -mx-5 px-5">
            {[
              { name: 'Andi Rachman',  role: 'Mahasiswa ITB',         avatar: 'A', rating: 5, text: 'Laptop saya sembuh dalam 2 jam! Transparansi harga dan update progres via foto bikin tenang.' },
              { name: 'Maya Sari',    role: 'Desainer Freelance',     avatar: 'M', rating: 5, text: 'Akhirnya ada platform servis yang bisa dipercaya. Sistem escrow-nya beneran aman.' },
              { name: 'Rizky Pratama',role: 'Gamer & Content Creator',avatar: 'R', rating: 5, text: 'Thermal repaste-nya ahli banget. Suhu laptop turun 20°C. Worth every rupiah!' },
            ].map(t => (
              <div key={t.name} className="flex-shrink-0 w-72 p-5 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800">
                <div className="flex gap-0.5 mb-3">{[1,2,3,4,5].map(i=><Star key={i} size={12} className="fill-amber-400 text-amber-400"/>)}</div>
                <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed mb-4">"{t.text}"</p>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center text-white text-xs font-bold">{t.avatar}</div>
                  <div><p className="text-xs font-semibold text-gray-900 dark:text-white">{t.name}</p><p className="text-xs text-gray-400">{t.role}</p></div>
                </div>
              </div>
            ))}
          </div>
          <div className="hidden sm:grid sm:grid-cols-3 gap-4">
            {[
              { name: 'Andi Rachman',  role: 'Mahasiswa ITB',         avatar: 'A', rating: 5, text: 'Laptop saya sembuh dalam 2 jam! Transparansi harga dan update progres via foto bikin tenang banget.' },
              { name: 'Maya Sari',    role: 'Desainer Freelance',     avatar: 'M', rating: 5, text: 'Akhirnya ada platform servis yang bisa dipercaya. Sistem escrow-nya beneran aman, bukan cuma janji.' },
              { name: 'Rizky Pratama',role: 'Gamer & Content Creator',avatar: 'R', rating: 5, text: 'Teknisi thermal repaste-nya ahli banget. Suhu laptop turun 20°C. Worth every rupiah!' },
            ].map((t, i) => (
              <Reveal key={t.name} delay={i * 80}>
                <div className="p-6 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 card-glow hover-lift">
                  <div className="flex gap-0.5 mb-4">{[1,2,3,4,5].map(i=><Star key={i} size={13} className="fill-amber-400 text-amber-400"/>)}</div>
                  <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed mb-4">"{t.text}"</p>
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center text-white text-sm font-bold">{t.avatar}</div>
                    <div><p className="text-sm font-semibold text-gray-900 dark:text-white">{t.name}</p><p className="text-xs text-gray-400">{t.role}</p></div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA ───────────────────────────────────────────────── */}
      <section className="py-20 sm:py-24 relative overflow-hidden bg-gray-950 text-white">
        <Orb style={{ width: 500, height: 500, top: '-150px', left: '-80px', background: 'radial-gradient(circle, rgba(0,102,230,0.22) 0%, transparent 70%)', pointerEvents: 'none' }} />
        <Orb style={{ width: 300, height: 300, bottom: '-80px', right: '-40px', background: 'radial-gradient(circle, rgba(0,229,196,0.18) 0%, transparent 70%)', pointerEvents: 'none' }} />
        <Reveal className="relative max-w-2xl mx-auto px-5 sm:px-8 text-center">
          <h2 className="font-display font-700 mb-4" style={{ fontSize: 'clamp(1.8rem, 6vw, 3rem)' }}>
            Siap Mulai?
          </h2>
          <p className="text-gray-400 mb-8 sm:mb-10 text-sm sm:text-lg leading-relaxed">
            Bergabung dengan ribuan pengguna yang sudah mempercayai TechFix untuk perangkat elektronik mereka.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button onClick={() => navigate('/customer/register')}
              className="press group flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-brand-500 hover:bg-brand-400 text-white font-medium text-sm transition-all animate-pulse-glow">
              Daftar sebagai Pelanggan <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
            </button>
            <button onClick={() => navigate('/technician/register')}
              className="press flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl border border-white/15 text-white hover:bg-white/8 font-medium text-sm transition-all teal-glow">
              Daftar sebagai Teknisi
            </button>
          </div>
        </Reveal>
      </section>

      {/* ─── FOOTER ────────────────────────────────────────────── */}
      <footer className="py-8 sm:py-10 border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950">
        <div className="max-w-5xl mx-auto px-5 sm:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-brand-500 flex items-center justify-center">
              <Wrench size={13} className="text-white" />
            </div>
            <span className="font-display font-700">Tech<span className="text-brand-500">Fix</span></span>
          </div>
          <div className="flex gap-5 text-sm text-gray-400">
            {[['Pelanggan','/customer'],['Teknisi','/technician'],['Admin','/admin'],['Tentang','/about']].map(([l,p]) => (
              <button key={l} onClick={() => navigate(p)} className="hover:text-gray-900 dark:hover:text-white transition-colors">{l}</button>
            ))}
          </div>
          <p className="text-xs text-gray-400 text-center">© 2025 TechFix · Telkom University</p>
        </div>
      </footer>
    </div>
  )
}
