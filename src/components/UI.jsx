import React from 'react'
import { Star, Shield, Clock, CheckCircle } from 'lucide-react'

export function Badge({ children, color = 'blue' }) {
  const colors = {
    blue:   'bg-brand-50 dark:bg-brand-900/30 text-brand-600 dark:text-brand-300 border-brand-200 dark:border-brand-800',
    green:  'bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400 border-green-200 dark:border-green-900',
    orange: 'bg-orange-50 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 border-orange-200 dark:border-orange-900',
    gray:   'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-700',
    teal:   'bg-teal-50 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400 border-teal-200 dark:border-teal-900',
  }
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${colors[color]}`}>
      {children}
    </span>
  )
}

export function Card({ children, className = '', hover = false }) {
  return (
    <div className={`bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 transition-all duration-200 ${hover ? 'hover:shadow-lg hover:shadow-brand-500/5 hover:border-brand-200 dark:hover:border-brand-800 cursor-pointer hover:-translate-y-0.5' : ''} ${className}`}>
      {children}
    </div>
  )
}

export function StarRating({ rating = 4.8, count }) {
  return (
    <div className="flex items-center gap-1">
      {[1,2,3,4,5].map(i => (
        <Star key={i} size={12} className={i <= Math.round(rating) ? 'fill-amber-400 text-amber-400' : 'text-gray-200 dark:text-gray-700'} />
      ))}
      <span className="text-xs text-gray-500 dark:text-gray-400 ml-1">{rating.toFixed(1)}{count ? ` (${count})` : ''}</span>
    </div>
  )
}

export function TechnicianCard({ name, specialty, rating, reviews, price, location, verified = true, onClick }) {
  return (
    <Card hover className="p-5 group" onClick={onClick}>
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center text-white font-display font-700 text-lg flex-shrink-0 group-hover:scale-105 transition-transform shadow-sm">
          {name.charAt(0)}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 flex-wrap">
            <h3 className="font-semibold text-gray-900 dark:text-white text-sm group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">{name}</h3>
            {verified && <Shield size={12} className="text-brand-500 flex-shrink-0" />}
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{specialty}</p>
          <div className="flex items-center gap-3 mt-2 flex-wrap">
            <StarRating rating={rating} count={reviews} />
            <span className="text-xs text-gray-400 dark:text-gray-500 flex items-center gap-1"><Clock size={10} />{location}</span>
          </div>
        </div>
        <div className="text-right flex-shrink-0">
          <p className="text-sm font-semibold text-gray-900 dark:text-white">Rp{price.toLocaleString('id')}</p>
          <p className="text-xs text-gray-400">mulai dari</p>
        </div>
      </div>
    </Card>
  )
}

export function StatCard({ label, value, sub, icon: Icon, color = 'blue' }) {
  const colors = {
    blue:   'bg-brand-50 dark:bg-brand-900/20 text-brand-600 dark:text-brand-400',
    green:  'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400',
    orange: 'bg-orange-50 dark:bg-orange-900/20 text-orange-500 dark:text-orange-400',
    teal:   'bg-teal-50 dark:bg-teal-900/20 text-teal-600 dark:text-teal-400',
  }
  return (
    <Card className="p-5 hover-lift card-glow">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs text-gray-500 dark:text-gray-400 font-medium uppercase tracking-wide">{label}</p>
          <p className="text-2xl font-display font-700 text-gray-900 dark:text-white mt-1">{value}</p>
          {sub && <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">{sub}</p>}
        </div>
        {Icon && <div className={`p-2.5 rounded-xl ${colors[color]}`}><Icon size={18} /></div>}
      </div>
    </Card>
  )
}

export function Button({ children, variant = 'primary', size = 'md', className = '', ...props }) {
  const base = 'press inline-flex items-center justify-center gap-2 font-medium rounded-xl transition-all duration-150'
  const sizes = { sm: 'px-3 py-1.5 text-sm', md: 'px-5 py-2.5 text-sm', lg: 'px-6 py-3 text-base' }
  const variants = {
    primary:   'bg-brand-500 hover:bg-brand-600 text-white shadow-sm hover:shadow-brand-500/30 hover:shadow-md',
    secondary: 'bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300',
    outline:   'border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300',
    danger:    'bg-red-500 hover:bg-red-600 text-white',
    teal:      'bg-accent-500 hover:bg-accent-400 text-gray-900 shadow-sm hover:shadow-teal-500/30 hover:shadow-md teal-glow',
  }
  return <button className={`${base} ${sizes[size]} ${variants[variant]} ${className}`} {...props}>{children}</button>
}

export function Input({ label, ...props }) {
  return (
    <div className="space-y-1.5">
      {label && <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{label}</label>}
      <input className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-600 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all hover:border-gray-300 dark:hover:border-gray-600" {...props} />
    </div>
  )
}

export function EscrowStatus({ status }) {
  const states = {
    waiting:   { label: 'Menunggu Konfirmasi',   color: 'orange' },
    progress:  { label: 'Servis Berlangsung',     color: 'blue'   },
    done:      { label: 'Selesai – Dana Dikirim', color: 'green'  },
    refunded:  { label: 'Dana Dikembalikan',      color: 'gray'   },
  }
  const s = states[status] || states.waiting
  return <Badge color={s.color}>{s.label}</Badge>
}

export function SidebarLink({ icon: Icon, label, active, onClick }) {
  return (
    <button onClick={onClick}
      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${active
        ? 'bg-brand-50 dark:bg-brand-900/30 text-brand-600 dark:text-brand-400 shadow-sm'
        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white'}`}>
      <Icon size={16} />
      {label}
    </button>
  )
}

export function Spinner() {
  return (
    <div className="flex items-center justify-center py-12">
      <div className="w-8 h-8 rounded-full border-2 border-brand-200 dark:border-brand-900 border-t-brand-500 animate-spin" />
    </div>
  )
}

export function EmptyState({ icon: Icon, title, desc }) {
  return (
    <div className="text-center py-16">
      <div className="w-14 h-14 rounded-2xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center mx-auto mb-4">
        <Icon size={24} className="text-gray-400" />
      </div>
      <p className="font-semibold text-gray-900 dark:text-white mb-1">{title}</p>
      <p className="text-sm text-gray-400">{desc}</p>
    </div>
  )
}
