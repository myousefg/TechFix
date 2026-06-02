// ── Secure localStorage store ──────────────────────────────────
// All values sanitized on read to prevent XSS from stored data

const PREFIX = 'techfix_'

function sanitizeString(str) {
  if (typeof str !== 'string') return str
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .slice(0, 1000) // cap all strings at 1000 chars
}

function sanitizeDeep(value) {
  if (typeof value === 'string') return sanitizeString(value)
  if (Array.isArray(value)) return value.map(sanitizeDeep)
  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value).map(([k, v]) => [k, sanitizeDeep(v)])
    )
  }
  return value
}

export function save(key, value) {
  try {
    localStorage.setItem(PREFIX + key, JSON.stringify(value))
    return true
  } catch (e) {
    console.warn('TechFix store: save failed for key', key)
    return false
  }
}

export function load(key, fallback = null) {
  try {
    const raw = localStorage.getItem(PREFIX + key)
    if (raw === null) return fallback
    const parsed = JSON.parse(raw)
    return sanitizeDeep(parsed)
  } catch (e) {
    console.warn('TechFix store: load failed for key', key)
    return fallback
  }
}

export function remove(key) {
  try { localStorage.removeItem(PREFIX + key) } catch {}
}

export function clearAll() {
  try {
    Object.keys(localStorage)
      .filter(k => k.startsWith(PREFIX))
      .forEach(k => localStorage.removeItem(k))
  } catch {}
}

// ── Domain stores ──────────────────────────────────────────────

import { orders as defaultOrders, maintenancePlans } from './data'

export const getOrders            = () => load('orders', defaultOrders)
export const saveOrders           = (v) => save('orders', v)

export const getSubscription      = () => load('subscription', null)
export const saveSubscription     = (v) => save('subscription', v)

export const getPaymentMethods    = () => load('payment_methods', [
  { id: 1, type: 'bank',    label: 'BCA Virtual Account', masked: '•••• 1234', default: true  },
  { id: 2, type: 'ewallet', label: 'GoPay',               masked: '+62 812 •••• 0079', default: false },
])
export const savePaymentMethods   = (v) => save('payment_methods', v)

export const getNotifSettings     = () => load('notif_settings', {
  orderUpdate: true, escrowStatus: true, maintenance: true, promo: false, newsletter: false,
})
export const saveNotifSettings    = (v) => save('notif_settings', v)

export const getAccountSettings   = () => load('account_settings', {
  name: 'Muhammad Hashfi', email: 'hashfi@email.com',
  phone: '+62 812 3456 0079', city: 'Bandung', district: 'Coblong',
})
export const saveAccountSettings  = (v) => save('account_settings', v)

export const getNotifications     = () => load('notifications', [
  { id: 1, type: 'order',  title: 'Pesanan TF-002 diperbarui',       body: 'Rina Kusuma mengirim update progres servis.',      time: '2 menit lalu', read: false },
  { id: 2, type: 'escrow', title: 'Escrow TF-001 selesai',           body: 'Dana Rp175.000 telah diteruskan ke Budi Santoso.', time: '1 jam lalu',   read: false },
  { id: 3, type: 'promo',  title: 'Diskon 20% untuk order pertama!', body: 'Gunakan kode TECHFIX20 sebelum 30 Jun 2025.',      time: '3 jam lalu',   read: true  },
  { id: 4, type: 'system', title: 'Selamat datang di TechFix!',      body: 'Akun kamu berhasil dibuat. Mulai cari teknisi.',  time: '1 hari lalu',  read: true  },
])
export const markNotifsRead       = (v) => save('notifications', v)

export const getAdminTransactions = () => load('admin_transactions', [
  { id: 'TF-001', customer: 'Hashfi H.',  tech: 'Budi S.',   service: 'Servis Laptop',       amount: 175000, status: 'done',     date: '28 Mei 2025' },
  { id: 'TF-002', customer: 'Maya S.',    tech: 'Rina K.',   service: 'Thermal Repaste',     amount: 120000, status: 'progress', date: '2 Jun 2025'  },
  { id: 'TF-003', customer: 'Rizky P.',   tech: 'Agus P.',   service: 'Rakit PC Gaming',     amount: 450000, status: 'waiting',  date: '5 Jun 2025'  },
  { id: 'TF-004', customer: 'Dewi L.',    tech: 'Hendra W.', service: 'Recovery Data',       amount: 300000, status: 'done',     date: '20 Mei 2025' },
  { id: 'TF-005', customer: 'Andi R.',    tech: 'Sari A.',   service: 'Upgrade RAM & SSD',   amount: 250000, status: 'done',     date: '18 Mei 2025' },
  { id: 'TF-006', customer: 'Siti M.',    tech: 'Budi S.',   service: 'Servis Laptop Layar', amount: 200000, status: 'done',     date: '15 Mei 2025' },
])

export const getLoyaltyPoints     = () => load('loyalty_points', {
  points: 350, history: [
    { id: 1, desc: 'Order TF-001 selesai',   pts: +100, date: '28 Mei 2025' },
    { id: 2, desc: 'Order TF-002 selesai',   pts: +80,  date: '2 Jun 2025'  },
    { id: 3, desc: 'Referral – Andi R.',     pts: +100, date: '1 Jun 2025'  },
    { id: 4, desc: 'Redeem voucher Rp20K',   pts: -50,  date: '30 Mei 2025' },
    { id: 5, desc: 'Bonus pendaftaran',      pts: +120, date: '27 Mei 2025' },
  ]
})
export const saveLoyaltyPoints    = (v) => save('loyalty_points', v)

export const getCustomerDisputes  = () => load('customer_disputes', [])
export const addCustomerDispute   = (dispute) => {
  const existing = getCustomerDisputes()
  save('customer_disputes', [...existing, dispute])
}

export const getKYCQueue          = () => load('kyc_queue', [
  { id: 'K-001', name: 'Dani Prasetyo',   specialty: 'Servis Laptop',     submitted: '1 Jun 2025', status: 'pending', nik: '3273xxxxxxxxxxxx01' },
  { id: 'K-002', name: 'Fitri Handayani', specialty: 'Recovery Data',     submitted: '2 Jun 2025', status: 'pending', nik: '3273xxxxxxxxxxxx02' },
  { id: 'K-003', name: 'Galih Nugroho',   specialty: 'Rakit PC & Upgrade',submitted: '3 Jun 2025', status: 'pending', nik: '3273xxxxxxxxxxxx03' },
  { id: 'K-004', name: 'Hani Pratiwi',    specialty: 'Jaringan & IT',     submitted: '4 Jun 2025', status: 'pending', nik: '3273xxxxxxxxxxxx04' },
  { id: 'K-005', name: 'Irfan Maulana',   specialty: 'Thermal Repaste',   submitted: '5 Jun 2025', status: 'pending', nik: '3273xxxxxxxxxxxx05' },
])
export const saveKYCQueue         = (v) => save('kyc_queue', v)
