// ── Simple localStorage store ──────────────────────────────────
const PREFIX = 'techfix_'

export function save(key, value) {
  try { localStorage.setItem(PREFIX + key, JSON.stringify(value)) } catch {}
}
export function load(key, fallback = null) {
  try {
    const v = localStorage.getItem(PREFIX + key)
    return v !== null ? JSON.parse(v) : fallback
  } catch { return fallback }
}
export function remove(key) {
  try { localStorage.removeItem(PREFIX + key) } catch {}
}

// ── Default data ───────────────────────────────────────────────
import { orders as defaultOrders, maintenancePlans } from './data'

export function getOrders() {
  return load('orders', defaultOrders)
}
export function saveOrders(orders) {
  save('orders', orders)
}

export function getSubscription() {
  return load('subscription', null)
}
export function saveSubscription(plan) {
  save('subscription', plan)
}

export function getPaymentMethods() {
  return load('payment_methods', [
    { id: 1, type: 'bank', label: 'BCA Virtual Account', masked: '•••• 1234', default: true },
    { id: 2, type: 'ewallet', label: 'GoPay', masked: '+62 812 •••• 0079', default: false },
  ])
}
export function savePaymentMethods(methods) {
  save('payment_methods', methods)
}

export function getNotifSettings() {
  return load('notif_settings', {
    orderUpdate: true,
    escrowStatus: true,
    maintenance: true,
    promo: false,
    newsletter: false,
  })
}
export function saveNotifSettings(settings) {
  save('notif_settings', settings)
}

export function getAccountSettings() {
  return load('account_settings', {
    name: 'Muhammad Hashfi',
    email: 'hashfi@email.com',
    phone: '+62 812 3456 0079',
    city: 'Bandung',
    district: 'Coblong',
  })
}
export function saveAccountSettings(settings) {
  save('account_settings', settings)
}

export function getNotifications() {
  return load('notifications', [
    { id: 1, type: 'order',    title: 'Pesanan TF-002 diperbarui',         body: 'Rina Kusuma mengirim update progres servis.',         time: '2 menit lalu',  read: false },
    { id: 2, type: 'escrow',   title: 'Escrow TF-001 selesai',             body: 'Dana Rp175.000 telah diteruskan ke Budi Santoso.',    time: '1 jam lalu',    read: false },
    { id: 3, type: 'promo',    title: 'Diskon 20% untuk order pertama!',   body: 'Gunakan kode TECHFIX20 sebelum 30 Jun 2025.',        time: '3 jam lalu',    read: true  },
    { id: 4, type: 'system',   title: 'Selamat datang di TechFix!',        body: 'Akun kamu berhasil dibuat. Mulai cari teknisi.',     time: '1 hari lalu',   read: true  },
  ])
}
export function markNotifsRead(notifications) {
  save('notifications', notifications)
}

export function getAdminTransactions() {
  return load('admin_transactions', [
    { id: 'TF-001', customer: 'Hashfi H.',   tech: 'Budi S.',   service: 'Servis Laptop',       amount: 175000, status: 'done',     date: '28 Mei 2025' },
    { id: 'TF-002', customer: 'Maya S.',     tech: 'Rina K.',   service: 'Thermal Repaste',     amount: 120000, status: 'progress', date: '2 Jun 2025'  },
    { id: 'TF-003', customer: 'Rizky P.',    tech: 'Agus P.',   service: 'Rakit PC Gaming',     amount: 450000, status: 'waiting',  date: '5 Jun 2025'  },
    { id: 'TF-004', customer: 'Dewi L.',     tech: 'Hendra W.', service: 'Recovery Data',       amount: 300000, status: 'done',     date: '20 Mei 2025' },
    { id: 'TF-005', customer: 'Andi R.',     tech: 'Sari A.',   service: 'Upgrade RAM & SSD',   amount: 250000, status: 'done',     date: '18 Mei 2025' },
    { id: 'TF-006', customer: 'Siti M.',     tech: 'Budi S.',   service: 'Servis Laptop Layar', amount: 200000, status: 'done',     date: '15 Mei 2025' },
  ])
}

// ── Loyalty points ─────────────────────────────────────────────
export function getLoyaltyPoints() {
  return load('loyalty_points', { points: 350, history: [
    { id: 1, desc: 'Order TF-001 selesai',        pts: +100, date: '28 Mei 2025' },
    { id: 2, desc: 'Order TF-002 selesai',         pts: +80,  date: '2 Jun 2025'  },
    { id: 3, desc: 'Referral – Andi Rachman',      pts: +100, date: '1 Jun 2025'  },
    { id: 4, desc: 'Redeem voucher Rp20.000',      pts: -50,  date: '30 Mei 2025' },
    { id: 5, desc: 'Bonus pendaftaran',             pts: +120, date: '27 Mei 2025' },
  ]})
}
export function saveLoyaltyPoints(data) { save('loyalty_points', data) }

// ── Disputes (customer-side) ───────────────────────────────────
export function getCustomerDisputes() {
  return load('customer_disputes', [])
}
export function addCustomerDispute(dispute) {
  const existing = getCustomerDisputes()
  save('customer_disputes', [...existing, dispute])
}

// ── KYC queue (admin) ──────────────────────────────────────────
export function getKYCQueue() {
  return load('kyc_queue', [
    { id: 'K-001', name: 'Dani Prasetyo',    specialty: 'Servis Laptop',      submitted: '1 Jun 2025',  status: 'pending', nik: '3273xxxxxxxxxx01' },
    { id: 'K-002', name: 'Fitri Handayani',  specialty: 'Recovery Data',       submitted: '2 Jun 2025',  status: 'pending', nik: '3273xxxxxxxxxx02' },
    { id: 'K-003', name: 'Galih Nugroho',    specialty: 'Rakit PC & Upgrade',  submitted: '3 Jun 2025',  status: 'pending', nik: '3273xxxxxxxxxx03' },
    { id: 'K-004', name: 'Hani Pratiwi',     specialty: 'Jaringan & IT',       submitted: '4 Jun 2025',  status: 'pending', nik: '3273xxxxxxxxxx04' },
    { id: 'K-005', name: 'Irfan Maulana',    specialty: 'Thermal Repaste',     submitted: '5 Jun 2025',  status: 'pending', nik: '3273xxxxxxxxxx05' },
  ])
}
export function saveKYCQueue(queue) { save('kyc_queue', queue) }
