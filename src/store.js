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
