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

export function saveSession(key, value) {
  try { sessionStorage.setItem(PREFIX + key, JSON.stringify(value)) } catch {}
}
export function loadSession(key, fallback = null) {
  try {
    const v = sessionStorage.getItem(PREFIX + key)
    return v !== null ? JSON.parse(v) : fallback
  } catch { return fallback }
}
export function removeSession(key) {
  try { sessionStorage.removeItem(PREFIX + key) } catch {}
}

// ── Default data ───────────────────────────────────────────────
import { orders as defaultOrders, customers as defaultCustomers, technicians as defaultTechnicians } from './data'

export function getOrders() {
  return load('orders', defaultOrders)
}
export function saveOrders(orders) {
  save('orders', orders)
}
export function addOrder(order) {
  const orders = getOrders()
  orders.push(order)
  saveOrders(orders)
  return order
}
export function updateOrder(id, updates) {
  const orders = getOrders()
  const idx = orders.findIndex(o => o.id === id)
  if (idx !== -1) {
    orders[idx] = { ...orders[idx], ...updates }
    saveOrders(orders)
  }
  return orders
}
export function getOrderById(id) {
  return getOrders().find(o => o.id === id) || null
}
export function getCustomerByFullName(name) {
  return getOrders().find(o => o.customer === name)?.customer
}
export function getTechnicianById(id) {
  const t = defaultTechnicians.find(t => t.id === Number(id))
  if (!t) return null
  return {
    ...t,
    joined: '15 Mar 2024',
    verified: true,
    status: 'online',
  }
}
export function getTechnicianByName(name) {
  return defaultTechnicians.find(t => t.name === name) || null
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
  return getOrders()
}

export function getTechnicianProfile() {
  return load('tech_profile', null)
}
export function saveTechnicianProfile(profile) {
  save('tech_profile', profile)
}
export function getCurrentTechnicianId() {
  return load('tech_id', 1)
}
export function getUserLocation() {
  return load('user_location', { lat: -6.917, lng: 107.619 })
}
export function calculateDistance(loc1, loc2) {
  if (!loc1 || !loc2) return Infinity
  const R = 6371
  const dLat = (loc2.lat - loc1.lat) * Math.PI / 180
  const dLng = (loc2.lng - loc1.lng) * Math.PI / 180
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(loc1.lat * Math.PI / 180) * Math.cos(loc2.lat * Math.PI / 180) *
    Math.sin(dLng/2) * Math.sin(dLng/2)
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
}
export function getAdminProfile() {
  return load('admin_profile', { name: 'Admin', email: 'admin@techfix.id', role: 'Super Admin' })
}
export function saveAdminProfile(profile) {
  save('admin_profile', profile)
}

export function getCustomers() {
  return load('customers', defaultCustomers)
}
export function saveCustomers(customers) {
  save('customers', customers)
}
export function updateCustomer(id, updates) {
  const list = getCustomers()
  const idx = list.findIndex(c => c.id === Number(id))
  if (idx !== -1) {
    list[idx] = { ...list[idx], ...updates }
    saveCustomers(list)
  }
  return list
}
export function getCustomerById(id) {
  return getCustomers().find(c => c.id === Number(id)) || null
}
export function getPartnerById(id) {
  const partner = getPartners().find(p => p.id === Number(id))
  if (!partner) return null
  const campaigns = getAdCampaigns().filter(c => c.partnerId === Number(id))
  return { ...partner, campaigns }
}
export function getCustomerOrders(customerName) {
  return getAdminTransactions().filter(t => t.customer === customerName)
}

export function getPartners() {
  return load('partners', [
    { id: 1, name: 'Toko PC Nusantara', type: 'Sparepart',    contact: 'pc.nusantara@email.com',  contactPerson: 'Pak Hartono',  phone: '+62 22 7208 100', revenue: 1500000, status: 'active', contractStart: '1 Jan 2025', contractEnd: '31 Des 2026', payoutSchedule: 'monthly' },
    { id: 2, name: 'ASUS Indonesia',    type: 'Brand Laptop', contact: 'b2b@asus.co.id',          contactPerson: 'Ibu Sari',     phone: '+62 21 2552 9000',revenue: 2400000, status: 'active', contractStart: '1 Mar 2025', contractEnd: '28 Feb 2027', payoutSchedule: 'monthly' },
    { id: 3, name: 'Logitech ID',       type: 'Periferal',    contact: 'partnership@logitech.id', contactPerson: 'Pak Yanto',    phone: '+62 21 5799 1100',revenue: 750000,  status: 'active', contractStart: '1 Apr 2026', contractEnd: '31 Mar 2027', payoutSchedule: 'per_campaign' },
    { id: 4, name: 'Samsung Indonesia', type: 'Storage',      contact: 'b2b.samsung@email.com',   contactPerson: 'Ibu Diana',    phone: '+62 21 5299 7700',revenue: 800000,  status: 'active', contractStart: '20 Mei 2026',contractEnd: '20 Mei 2027', payoutSchedule: 'monthly' },
    { id: 5, name: 'Corsair Official',  type: 'RAM/PSU',      contact: 'corsair.id@email.com',    contactPerson: 'Pak Adi',      phone: '+62 21 5799 8800',revenue: 600000,  status: 'active', contractStart: '25 Mei 2026',contractEnd: '25 Mei 2027', payoutSchedule: 'monthly' },
    { id: 6, name: 'TP-Link Indonesia', type: 'Networking',   contact: 'sales@tplink.id',         contactPerson: 'Ibu Mega',     phone: '+62 21 2552 6600',revenue: 320000,  status: 'inactive', contractStart: '1 Jan 2025', contractEnd: '31 Des 2025', payoutSchedule: 'monthly' },
  ])
}
export function savePartners(partners) {
  save('partners', partners)
}
export function addPartner(partner) {
  const list = getPartners()
  const newPartner = { ...partner, id: Date.now() }
  list.push(newPartner)
  savePartners(list)
  return newPartner
}
export function updatePartner(id, updates) {
  const list = getPartners()
  const idx = list.findIndex(p => p.id === id)
  if (idx !== -1) {
    list[idx] = { ...list[idx], ...updates }
    savePartners(list)
  }
  return list
}
export function removePartner(id) {
  const list = getPartners().filter(p => p.id !== id)
  savePartners(list)
  return list
}

export function getKYCRequests() {
  return load('kyc_requests', [
    { id: 1, techId: 5, techName: 'Hendra Wijaya',   specialty: 'Network & IT Support',     submitted: '28 Mei 2026', status: 'pending',  ktpNumber: '3273•••••••0001', ktpPhotoUrl: 'https://placehold.co/400x250/3b82f6/white?text=KTP+Hendra', selfiePhotoUrl: 'https://placehold.co/300x300/10b981/white?text=Selfie+Hendra', docs: ['KTP', 'Sertifikasi Jaringan'], reviewedAt: null, reviewedBy: null, rejectionReason: null },
    { id: 2, techId: 7, techName: 'Reza Hidayat',    specialty: 'Printer & Scanner',         submitted: '20 Mei 2026', status: 'pending',  ktpNumber: '3273•••••••0007', ktpPhotoUrl: 'https://placehold.co/400x250/3b82f6/white?text=KTP+Reza',   selfiePhotoUrl: 'https://placehold.co/300x300/10b981/white?text=Selfie+Reza',   docs: ['KTP', 'Sertifikasi Epson'],   reviewedAt: null, reviewedBy: null, rejectionReason: null },
    { id: 3, techId: 3, techName: 'Agus Pramono',    specialty: 'Rakit PC & Upgrade RAM',    submitted: '5 Jan 2024',  status: 'approved', ktpNumber: '3273•••••••0003', ktpPhotoUrl: 'https://placehold.co/400x250/3b82f6/white?text=KTP+Agus',   selfiePhotoUrl: 'https://placehold.co/300x300/10b981/white?text=Selfie+Agus',   docs: ['KTP', 'Sertifikasi Build'], reviewedAt: '5 Jan 2024',  reviewedBy: 'Admin',  rejectionReason: null },
    { id: 4, techId: 4, techName: 'Dewi Lestari',    specialty: 'Data Recovery & Storage',   submitted: '12 Jun 2024', status: 'approved', ktpNumber: '3273•••••••0004', ktpPhotoUrl: 'https://placehold.co/400x250/3b82f6/white?text=KTP+Dewi',   selfiePhotoUrl: 'https://placehold.co/300x300/10b981/white?text=Selfie+Dewi',   docs: ['KTP', 'Sertifikasi Data'], reviewedAt: '12 Jun 2024', reviewedBy: 'Admin',  rejectionReason: null },
    { id: 5, techId: 8, techName: 'Linda Permata',   specialty: 'MacBook Specialist',        submitted: '10 Apr 2024', status: 'approved', ktpNumber: '3273•••••••0008', ktpPhotoUrl: 'https://placehold.co/400x250/3b82f6/white?text=KTP+Linda',  selfiePhotoUrl: 'https://placehold.co/300x300/10b981/white?text=Selfie+Linda',  docs: ['KTP', 'Apple Cert'],        reviewedAt: '10 Apr 2024', reviewedBy: 'Admin',  rejectionReason: null },
    { id: 6, techId: 6, techName: 'Sari Andayani',   specialty: 'Laptop Screen & Keyboard',  submitted: '1 Feb 2024',  status: 'rejected', ktpNumber: '3273•••••••0006', ktpPhotoUrl: 'https://placehold.co/400x250/3b82f6/white?text=KTP+Sari',   selfiePhotoUrl: 'https://placehold.co/300x300/10b981/white?text=Selfie+Sari',   docs: ['KTP'],                       reviewedAt: '1 Feb 2024',  reviewedBy: 'Admin',  rejectionReason: 'Foto selfie tidak sesuai dengan KTP' },
  ])
}
export function getKYCById(id) {
  return getKYCRequests().find(k => k.id === Number(id)) || null
}
export function updateKYCStatus(id, status) {
  const list = getKYCRequests()
  const idx = list.findIndex(k => k.id === Number(id))
  if (idx !== -1) {
    list[idx] = { ...list[idx], status, reviewedAt: new Date().toLocaleDateString('id', { day: 'numeric', month: 'short', year: 'numeric' }) }
    save('kyc_requests', list)
  }
  return list
}

export function submitKYC(data) {
  const list = getKYCRequests()
  const existingIdx = list.findIndex(k => 
    k.techId === data.techId && (k.status === 'pending' || k.status === 'rejected')
  )

  const today = new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })

  const newEntry = {
    id: existingIdx !== -1 ? list[existingIdx].id : (Math.max(0, ...list.map(k => k.id)) + 1),
    techId: data.techId,
    techName: data.techName,
    specialty: data.specialty || '',
    submitted: today,
    status: 'pending',
    ktpNumber: data.ktpNumber || '',
    ktpPhotoUrl: data.ktpPhotoUrl || 'https://placehold.co/400x250/3b82f6/white?text=KTP',
    selfiePhotoUrl: data.selfiePhotoUrl || 'https://placehold.co/300x300/10b981/white?text=Selfie',
    docs: data.docs || ['KTP'],
    reviewedAt: null,
    reviewedBy: null,
    rejectionReason: null,
  }

  if (existingIdx !== -1) {
    list[existingIdx] = newEntry
  } else {
    list.push(newEntry)
  }

  save('kyc_requests', list)
  return newEntry
}

export function getDisputes() {
  return load('disputes', [
    { id: 'D-001', order: 'TF-003', orderId: 'TF-003', claimant: 'Maya Sari',       tech: 'Agus Pramono',  issue: 'Pelanggan mengklaim laptop masih bermasalah setelah servis', amount: 450000, status: 'open',     openedAt: '2 Jun 2026',  resolvedAt: null,             resolution: null,           aiConfidence: 70, aiRecommendation: 'Refund 50% escrow ke pelanggan', evidence: [{ type: 'image', label: 'Foto kondisi laptop setelah servis', url: 'https://placehold.co/400x300/ef4444/white?text=Evidence+1' }], timeline: [{ at: '1 Jun 2026',  event: 'Order dibuat' }, { at: '2 Jun 2026',  event: 'Sengketa dibuka oleh customer' }], respondedBy: null },
    { id: 'D-002', order: 'TF-002', orderId: 'TF-002', claimant: 'Rizky Saputra',   tech: 'Rina Kusuma',   issue: 'Teknisi tidak merespons selama 48 jam setelah pembayaran',  amount: 120000, status: 'open',     openedAt: '30 Mei 2026', resolvedAt: null,             resolution: null,           aiConfidence: 85, aiRecommendation: 'Refund penuh ke pelanggan',      evidence: [{ type: 'chat',  label: 'Screenshot chat kosong 48 jam',  url: 'https://placehold.co/400x300/6b7280/white?text=Chat+Log' }], timeline: [{ at: '28 Mei 2026', event: 'Order dibuat' }, { at: '30 Mei 2026', event: 'Sengketa dibuka karena tidak ada respon' }], respondedBy: null },
    { id: 'D-003', order: 'TF-005', orderId: 'TF-005', claimant: 'Budi Raharjo',    tech: 'Budi Santoso',  issue: 'Spare part yang digunakan bukan original sesuai request',      amount: 250000, status: 'open',     openedAt: '25 Mei 2026', resolvedAt: null,             resolution: null,           aiConfidence: 60, aiRecommendation: 'Refund selisih harga spare part', evidence: [{ type: 'image', label: 'Foto spare part non-original',    url: 'https://placehold.co/400x300/f59e0b/white?text=Spare+Part' }], timeline: [{ at: '10 Mei 2026', event: 'Order dibuat' }, { at: '20 Mei 2026', event: 'Order selesai' }, { at: '25 Mei 2026', event: 'Sengketa dibuka' }], respondedBy: null },
    { id: 'D-004', order: 'TF-006', orderId: 'TF-006', claimant: 'Dewi Anggraini',  tech: 'Sari Andayani', issue: 'Layar pengganti menyebabkan flicker dalam 2 minggu',          amount: 200000, status: 'resolved', openedAt: '22 Mei 2026', resolvedAt: '24 Mei 2026', resolution: 'forward_tech', aiConfidence: 40, aiRecommendation: 'Teknisi bertanggung jawab ganti ulang',  evidence: [{ type: 'image', label: 'Video flicker layar',           url: 'https://placehold.co/400x300/3b82f6/white?text=Video' }], timeline: [{ at: '8 Mei 2026',  event: 'Order dibuat' }, { at: '22 Mei 2026', event: 'Sengketa dibuka' }, { at: '24 Mei 2026', event: 'Resolved: forward_tech' }], respondedBy: 'Admin' },
    { id: 'D-005', order: 'TF-007', orderId: 'TF-007', claimant: 'Gita Pertiwi',    tech: 'Rina Kusuma',   issue: 'Customer merasa durasi servis terlalu lama (5 hari)',         amount: 150000, status: 'resolved', openedAt: '10 Mei 2026', resolvedAt: '12 Mei 2026', resolution: 'bagi_rata',     aiConfidence: 50, aiRecommendation: 'Bagi rata 50/50',                 evidence: [], timeline: [{ at: '5 Mei 2026',  event: 'Order dibuat' }, { at: '10 Mei 2026', event: 'Sengketa dibuka' }, { at: '12 Mei 2026', event: 'Resolved: bagi_rata' }], respondedBy: 'Admin' },
    { id: 'D-006', order: 'TF-004', orderId: 'TF-004', claimant: 'Andi Rachman',    tech: 'Dewi Lestari',  issue: 'Customer merasa harga lebih mahal dari teknisi lain',         amount: 300000, status: 'resolved', openedAt: '20 Apr 2026', resolvedAt: '22 Apr 2026', resolution: 'refund_customer', aiConfidence: 30, aiRecommendation: 'Tidak ada bukti kuat, refund sebagian', evidence: [], timeline: [{ at: '15 Apr 2026', event: 'Order dibuat' }, { at: '20 Apr 2026', event: 'Sengketa dibuka' }, { at: '22 Apr 2026', event: 'Resolved: refund_customer' }], respondedBy: 'Admin' },
  ])
}
export function getDisputeById(id) {
  return getDisputes().find(d => d.id === id) || null
}
export function resolveDispute(id, resolution) {
  const list = getDisputes()
  const idx = list.findIndex(d => d.id === id)
  if (idx !== -1) {
    list[idx] = {
      ...list[idx],
      status: 'resolved',
      resolution,
      resolvedAt: new Date().toLocaleDateString('id', { day: 'numeric', month: 'short', year: 'numeric' }),
    }
    save('disputes', list)
  }
  return list
}

export function getAdCampaigns() {
  return load('ad_campaigns', [
    { id: 1, name: 'Banner ASUS ROG',       slot: 'Banner Homepage (Top)',     partner: 'ASUS Indonesia',    partnerId: 2, budget: 3000000, spent: 2400000, impressions: 45000, clicks: 1200, conversions: 28, status: 'active',  start: '1 Mei 2026',  end: '30 Jun 2026',  targetAudience: 'Gamers, 18-35, urban', creativeUrl: 'https://placehold.co/1200x630/8b5cf6/white?text=ASUS+ROG+Banner', dailyStats: [{ day: '1', impressions: 1800, clicks: 45 }, { day: '2', impressions: 2100, clicks: 52 }, { day: '3', impressions: 1950, clicks: 48 }, { day: '4', impressions: 2300, clicks: 61 }, { day: '5', impressions: 2050, clicks: 55 }] },
    { id: 2, name: 'Banner Sparepart PC',   slot: 'Banner Homepage (Mid)',     partner: 'Toko PC Nusantara', partnerId: 1, budget: 2000000, spent: 1500000, impressions: 28000, clicks: 850,  conversions: 19, status: 'active',  start: '15 Mei 2026', end: '15 Jul 2026',  targetAudience: 'PC builders, DIY enthusiasts', creativeUrl: 'https://placehold.co/1200x630/10b981/white?text=Sparepart+PC+Banner', dailyStats: [{ day: '1', impressions: 1100, clicks: 32 }, { day: '2', impressions: 1350, clicks: 41 }, { day: '3', impressions: 1280, clicks: 38 }, { day: '4', impressions: 1500, clicks: 47 }, { day: '5', impressions: 1420, clicks: 44 }] },
    { id: 3, name: 'Logitech Peripheral',   slot: 'Sidebar App',               partner: 'Logitech ID',       partnerId: 3, budget: 1500000, spent: 1500000, impressions: 22000, clicks: 670,  conversions: 14, status: 'ended',   start: '1 Apr 2026',  end: '30 Apr 2026',  targetAudience: 'Office workers, gamers', creativeUrl: 'https://placehold.co/800x800/3b82f6/white?text=Logitech+Square', dailyStats: [{ day: '1', impressions: 900, clicks: 28 }, { day: '2', impressions: 1050, clicks: 33 }, { day: '3', impressions: 980, clicks: 30 }] },
    { id: 4, name: 'Samsung SSD Promo',     slot: 'Push Notification Slot',    partner: 'Samsung Indonesia', partnerId: 4, budget: 2500000, spent: 800000,  impressions: 18000, clicks: 540,  conversions: 12, status: 'paused',  start: '20 Mei 2026', end: '20 Jul 2026',  targetAudience: 'Upgraders, content creators', creativeUrl: 'https://placehold.co/800x800/f59e0b/white?text=Samsung+SSD', dailyStats: [{ day: '1', impressions: 1200, clicks: 36 }, { day: '2', impressions: 1400, clicks: 42 }, { day: '3', impressions: 1350, clicks: 40 }, { day: '4', impressions: 1500, clicks: 47 }, { day: '5', impressions: 1450, clicks: 45 }] },
    { id: 5, name: 'Corsair RAM Bundle',    slot: 'Banner Homepage (Mid)',     partner: 'Corsair Official',  partnerId: 5, budget: 1800000, spent: 600000,  impressions: 14000, clicks: 420,  conversions: 9,  status: 'active',  start: '25 Mei 2026', end: '25 Jul 2026',  targetAudience: 'Gamers, PC enthusiasts', creativeUrl: 'https://placehold.co/1200x630/ef4444/white?text=Corsair+RAM', dailyStats: [{ day: '1', impressions: 950, clicks: 28 }, { day: '2', impressions: 1100, clicks: 33 }, { day: '3', impressions: 1050, clicks: 31 }] },
  ])
}
export function getAdCampaignById(id) {
  return getAdCampaigns().find(c => c.id === Number(id)) || null
}
export function saveAdCampaigns(campaigns) {
  save('ad_campaigns', campaigns)
}
export function addAdCampaign(campaign) {
  const list = getAdCampaigns()
  const newCampaign = { ...campaign, id: Date.now() }
  list.push(newCampaign)
  saveAdCampaigns(list)
  return newCampaign
}
export function updateAdCampaign(id, updates) {
  const list = getAdCampaigns()
  const idx = list.findIndex(c => c.id === Number(id))
  if (idx !== -1) {
    list[idx] = { ...list[idx], ...updates }
    saveAdCampaigns(list)
  }
  return list
}
export function removeAdCampaign(id) {
  const list = getAdCampaigns().filter(c => c.id !== Number(id))
  saveAdCampaigns(list)
  return list
}

export function getAuditLog() {
  return load('audit_log', [
    { id: 1,  actor: 'Admin', action: 'login',                 target: '-',                       at: '3 Jun 2026 09:15', ipAddress: '103.21.45.66',   userAgent: 'Chrome 125 / Mac',  severity: 'info'    },
    { id: 2,  actor: 'Admin', action: 'export_csv',            target: 'transactions',            at: '3 Jun 2026 10:22', ipAddress: '103.21.45.66',   userAgent: 'Chrome 125 / Mac',  severity: 'info'    },
    { id: 3,  actor: 'Admin', action: 'resolve_dispute',       target: 'D-004 (forward_tech)',   at: '2 Jun 2026 16:40', ipAddress: '103.21.45.66',   userAgent: 'Chrome 125 / Mac',  severity: 'warning' },
    { id: 4,  actor: 'Admin', action: 'resolve_dispute',       target: 'D-005 (bagi_rata)',      at: '12 Mei 2026 14:20', ipAddress: '103.21.45.66',  userAgent: 'Chrome 125 / Mac', severity: 'info'    },
    { id: 5,  actor: 'Admin', action: 'resolve_dispute',       target: 'D-006 (refund_customer)', at: '22 Apr 2026 11:05', ipAddress: '103.21.45.66',  userAgent: 'Chrome 124 / Mac', severity: 'info'    },
    { id: 6,  actor: 'Admin', action: 'approve_kyc',          target: 'Dewi Lestari',            at: '12 Jun 2024 10:00', ipAddress: '103.21.45.66',  userAgent: 'Chrome 120 / Mac', severity: 'info'    },
    { id: 7,  actor: 'Admin', action: 'approve_kyc',          target: 'Linda Permata',           at: '10 Apr 2024 09:30', ipAddress: '103.21.45.66',  userAgent: 'Chrome 119 / Mac', severity: 'info'    },
    { id: 8,  actor: 'Admin', action: 'reject_kyc',           target: 'Sari Andayani',           at: '1 Feb 2024 15:45',  ipAddress: '103.21.45.66',  userAgent: 'Chrome 118 / Mac', severity: 'warning' },
    { id: 9,  actor: 'System', action: 'suspend_customer',     target: 'Siti Mardiana',           at: '15 Mei 2026 08:00', ipAddress: 'system',          userAgent: 'auto',             severity: 'warning' },
    { id: 10, actor: 'Admin', action: 'pause_ad_campaign',    target: 'Samsung SSD Promo',       at: '28 Mei 2026 17:20', ipAddress: '103.21.45.66',  userAgent: 'Chrome 125 / Mac', severity: 'info'    },
    { id: 11, actor: 'Admin', action: 'create_ad_campaign',   target: 'Corsair RAM Bundle',      at: '25 Mei 2026 11:30', ipAddress: '103.21.45.66',  userAgent: 'Chrome 125 / Mac', severity: 'info'    },
    { id: 12, actor: 'Admin', action: 'login',                 target: '-',                       at: '2 Jun 2026 09:00',  ipAddress: '103.21.45.66',  userAgent: 'Chrome 125 / Mac', severity: 'info'    },
  ])
}
export function addAuditLog(entry) {
  const list = getAuditLog()
  const newEntry = { id: Date.now(), at: new Date().toLocaleString('id', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }), ...entry }
  list.unshift(newEntry)
  save('audit_log', list.slice(0, 100))
  return newEntry
}

export function getRevenueHistory() {
  return load('revenue_history', null) || [
    { month: 'Jan', commission: 1800000, subscription: 2200000, ads: 1200000 },
    { month: 'Feb', commission: 2100000, subscription: 2400000, ads: 1300000 },
    { month: 'Mar', commission: 1950000, subscription: 2500000, ads: 1400000 },
    { month: 'Apr', commission: 2400000, subscription: 2500000, ads: 1350000 },
    { month: 'Mei', commission: 2750000, subscription: 2500000, ads: 1500000 },
  ]
}

export function getSupportTickets() {
  return load('support_tickets', [
    { id: 'TKT-001', customerId: 1,  customerName: 'Muhammad Hashfi', subject: 'Refund partial untuk TF-004', category: 'refund',    priority: 'high',   status: 'open',         createdAt: '3 Jun 2026 09:30', updatedAt: '3 Jun 2026 09:30', messages: [{ from: 'customer', text: 'Saya ingin refund partial karena data tidak 100% recovery', at: '3 Jun 2026 09:30' }] },
    { id: 'TKT-002', customerId: 2,  customerName: 'Rizky Saputra',   subject: 'Teknisi tidak datang sesuai jadwal',  category: 'tech_issue', priority: 'high',   status: 'in_progress', createdAt: '2 Jun 2026 14:15', updatedAt: '3 Jun 2026 10:00', messages: [{ from: 'customer', text: 'Saya booking untuk jam 10 pagi, sampai jam 12 belum datang', at: '2 Jun 2026 14:15' }, { from: 'admin', text: 'Mohon maaf, saya cek dulu dengan teknisinya ya', at: '3 Jun 2026 10:00' }] },
    { id: 'TKT-003', customerId: 3,  customerName: 'Maya Sari',       subject: 'Bisa ganti jadwal servis?',             category: 'general',   priority: 'medium', status: 'resolved',     createdAt: '30 Mei 2026 16:00', updatedAt: '1 Jun 2026 11:00',  messages: [{ from: 'customer', text: 'Saya butuh reschedule servis ke weekend', at: '30 Mei 2026 16:00' }, { from: 'admin', text: 'Sudah di-reschedule ke Sabtu 1 Jun jam 10', at: '1 Jun 2026 11:00' }] },
    { id: 'TKT-004', customerId: 4,  customerName: 'Andi Rachman',    subject: 'Metode pembayaran DANA error',          category: 'billing',   priority: 'medium', status: 'open',         createdAt: '2 Jun 2026 08:45',  updatedAt: '2 Jun 2026 08:45',  messages: [{ from: 'customer', text: 'Saya coba bayar pakai DANA tapi selalu gagal di step 3', at: '2 Jun 2026 08:45' }] },
    { id: 'TKT-005', customerId: 5,  customerName: 'Siti Mardiana',   subject: 'Akun suspended tanpa notifikasi',       category: 'account',   priority: 'high',   status: 'in_progress', createdAt: '1 Jun 2026 13:20',  updatedAt: '2 Jun 2026 09:00',  messages: [{ from: 'customer', text: 'Akun saya tiba-tiba tidak bisa login, tolong dicek', at: '1 Jun 2026 13:20' }, { from: 'admin', text: 'Akun Anda di-suspend karena ada beberapa laporan, sedang kami review', at: '2 Jun 2026 09:00' }] },
    { id: 'TKT-006', customerId: 6,  customerName: 'Budi Raharjo',    subject: 'Pertanyaan garansi servis',             category: 'general',   priority: 'low',    status: 'closed',       createdAt: '15 Mei 2026 11:00', updatedAt: '17 Mei 2026 14:00', messages: [{ from: 'customer', text: 'Servis TF-005 ada garansi berapa lama?', at: '15 Mei 2026 11:00' }, { from: 'admin', text: 'Garansi 30 hari untuk spare part, 7 hari untuk jasa', at: '17 Mei 2026 14:00' }] },
    { id: 'TKT-007', customerId: 7,  customerName: 'Dewi Anggraini',  subject: 'Request invoice resmi',                 category: 'billing',   priority: 'low',    status: 'resolved',     createdAt: '12 Mei 2026 10:30', updatedAt: '13 Mei 2026 09:00', messages: [{ from: 'customer', text: 'Saya butuh invoice untuk reimburse kantor', at: '12 Mei 2026 10:30' }, { from: 'admin', text: 'Sudah dikirim ke email Anda', at: '13 Mei 2026 09:00' }] },
    { id: 'TKT-008', customerId: 9,  customerName: 'Gita Pertiwi',    subject: 'Pertanyaan tentang paket maintenance',  category: 'general',   priority: 'low',    status: 'open',         createdAt: '3 Jun 2026 08:00',  updatedAt: '3 Jun 2026 08:00',  messages: [{ from: 'customer', text: 'Bedanya paket Family dan Premium apa ya?', at: '3 Jun 2026 08:00' }] },
  ])
}
export function getTicketById(id) {
  return getSupportTickets().find(t => t.id === id) || null
}
export function saveSupportTickets(tickets) {
  save('support_tickets', tickets)
}
export function updateTicketStatus(id, status) {
  const list = getSupportTickets()
  const idx = list.findIndex(t => t.id === id)
  if (idx !== -1) {
    list[idx] = { ...list[idx], status, updatedAt: new Date().toLocaleString('id', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) }
    saveSupportTickets(list)
  }
  return list
}
export function addTicketReply(id, reply) {
  const list = getSupportTickets()
  const idx = list.findIndex(t => t.id === id)
  if (idx !== -1) {
    list[idx].messages.push({ from: 'admin', text: reply, at: new Date().toLocaleString('id', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) })
    if (list[idx].status === 'open') {
      list[idx].status = 'in_progress'
    }
    list[idx].updatedAt = new Date().toLocaleString('id', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
    saveSupportTickets(list)
  }
  return list[idx]
}

export function getReviews() {
  return load('reviews', [
    { id: 1,  orderId: 'TF-001', customerId: 1,  customerName: 'Muhammad Hashfi', techId: 1, techName: 'Budi Santoso',    rating: 5, text: 'Cepat dan profesional, laptop langsung nyala!',                                status: 'approved', createdAt: '20 Mei 2026', flagged: false, flagReason: null },
    { id: 2,  orderId: 'TF-004', customerId: 4,  customerName: 'Andi Rachman',    techId: 4, techName: 'Dewi Lestari',    rating: 5, text: 'Selamat! Data pekerjaan saya kembali semua. Terima kasih banyak.',              status: 'approved', createdAt: '15 Mei 2026', flagged: false, flagReason: null },
    { id: 3,  orderId: 'TF-005', customerId: 6,  customerName: 'Budi Raharjo',    techId: 1, techName: 'Budi Santoso',    rating: 4, text: 'Hasil bagus, tapi agak lama karena spare part delay.',                          status: 'approved', createdAt: '10 Mei 2026', flagged: false, flagReason: null },
    { id: 4,  orderId: 'TF-006', customerId: 7,  customerName: 'Dewi Anggraini',  techId: 6, techName: 'Sari Andayani',   rating: 5, text: 'Layar baru seperti asli, sangat memuaskan!',                                    status: 'approved', createdAt: '8 Mei 2026',  flagged: false, flagReason: null },
    { id: 5,  orderId: 'TF-007', customerId: 9,  customerName: 'Gita Pertiwi',    techId: 2, techName: 'Rina Kusuma',     rating: 5, text: 'Sekarang adem banget, gak ngelag lagi!',                                        status: 'approved', createdAt: '5 Mei 2026',  flagged: false, flagReason: null },
    { id: 6,  orderId: 'TF-010', customerId: 7,  customerName: 'Dewi Anggraini',  techId: 7, techName: 'Reza Hidayat',    rating: 4, text: 'Sekarang lancar, tapi tintanya cepat habis.',                                    status: 'approved', createdAt: '22 Mei 2026', flagged: false, flagReason: null },
    { id: 7,  orderId: 'TF-001', customerId: 5,  customerName: 'Siti Mardiana',   techId: 1, techName: 'Budi Santoso',    rating: 1, text: 'Teknisi tidak profesional, bicara kasar dan hasil asal-asalan!!! JANGAN DIPAKAI', status: 'pending',  createdAt: '3 Jun 2026',  flagged: true,  flagReason: 'Kata-kata kasar' },
    { id: 8,  orderId: 'TF-002', customerId: 8,  customerName: 'Ferdi Saputro',   techId: 2, techName: 'Rina Kusuma',     rating: 2, text: 'Promo discount 50% di iklan ternyata tidak berlaku saat checkout. Mengecewakan.', status: 'pending',  createdAt: '2 Jun 2026',  flagged: true,  flagReason: 'Keluhan tentang promo' },
    { id: 9,  orderId: 'TF-009', customerId: 2,  customerName: 'Rizky Saputra',   techId: 8, techName: 'Linda Permata',   rating: 0, text: '',                                                                            status: 'pending',  createdAt: '2 Jun 2026',  flagged: false, flagReason: null },
    { id: 10, orderId: 'TF-008', customerId: 10, customerName: 'Hadi Wibowo',     techId: 3, techName: 'Agus Pramono',    rating: 0, text: '',                                                                            status: 'pending',  createdAt: '30 Mei 2026', flagged: false, flagReason: null },
    { id: 11, orderId: 'TF-003', customerId: 3,  customerName: 'Maya Sari',       techId: 3, techName: 'Agus Pramono',    rating: 3, text: 'Biasa saja, sesuai harga.',                                                    status: 'hidden',   createdAt: '1 Jun 2026',  flagged: false, flagReason: null },
  ])
}
export function updateReviewStatus(id, status, flagReason = null) {
  const list = getReviews()
  const idx = list.findIndex(r => r.id === Number(id))
  if (idx !== -1) {
    list[idx] = { ...list[idx], status, flagReason }
    save('reviews', list)
  }
  return list
}

// ── CUSTOMER & TECHNICIAN HELPERS (Phase 1) ────────────────────

export function getCurrentCustomer() {
  const sessionId = loadSession('current_customer_id')
  if (sessionId) {
    return getCustomerById(sessionId)
  }
  // Default to first customer for demo
  return getCustomers()[0]
}

export function getCurrentTechnician() {
  const sessionId = loadSession('current_technician_id')
  if (sessionId) {
    return getTechnicianById(sessionId)
  }
  // Default to Budi Santoso (techId 1) for demo
  return getTechnicianById(1)
}

export function getOrdersByCustomerId(customerId) {
  return getOrders().filter(o => o.customerId === Number(customerId))
}

export function getOrdersByTechId(techId) {
  return getOrders().filter(o => o.techId === Number(techId))
}

export function getTechnicianEarnings(techId) {
  const orders = getOrdersByTechId(techId).filter(o => o.status === 'done')
  const total = orders.reduce((sum, o) => sum + (o.amount || 0), 0)
  
  // Group by month using consistent date parsing
  const byMonth = {}
  orders.forEach(o => {
    const dateStr = o.createdAt || o.date
    let month
    try {
      // Handle both '2026-05-18' and '20 Mei 2026' formats
      if (dateStr && dateStr.includes('-')) {
        const d = new Date(dateStr)
        month = d.toLocaleString('id-ID', { month: 'short' })
      } else {
        // Parse Indonesian date like '20 Mei 2026'
        const monthMap = { Jan:'Jan', Feb:'Feb', Mar:'Mar', Apr:'Apr', Mei:'Mei', Jun:'Jun', Jul:'Jul', Agu:'Agu', Sep:'Sep', Okt:'Okt', Nov:'Nov', Des:'Des' }
        const parts = (dateStr || '').split(' ')
        month = monthMap[parts[1]] || parts[1]
      }
    } catch {
      month = '?'
    }
    byMonth[month] = (byMonth[month] || 0) + (o.amount || 0)
  })
  
  // Current month
  const currentMonth = new Date().toLocaleString('id-ID', { month: 'short' })
  const thisMonth = byMonth[currentMonth] || 0
  
  return {
    total,
    thisMonth,
    byMonth: Object.entries(byMonth).map(([month, amount]) => ({ month, amount })),
    completed: orders.length
  }
}

export function getTechnicianReviews(techId) {
  return getReviews().filter(r => r.techId === Number(techId))
}

// Phase 2.5: Order CRUD functions
export function acceptOrder(orderId, estimatedStart) {
  const orders = getOrders()
  const idx = orders.findIndex(o => o.id === orderId)
  if (idx !== -1) {
    orders[idx] = { 
      ...orders[idx], 
      status: 'progress', 
      escrow: 'progress',
      estimatedStart,
      acceptedAt: new Date().toLocaleString('id', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
    }
    save('orders', orders)
  }
  return orders
}

export function rejectOrder(orderId, reason, notes) {
  const orders = getOrders()
  const idx = orders.findIndex(o => o.id === orderId)
  if (idx !== -1) {
    orders[idx] = { 
      ...orders[idx], 
      status: 'rejected', 
      rejectionReason: reason,
      rejectionNotes: notes,
      rejectedAt: new Date().toLocaleString('id', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
    }
    save('orders', orders)
  }
  return orders
}

export function updateOrderStatus(orderId, status, notes = '') {
  const orders = getOrders()
  const idx = orders.findIndex(o => o.id === orderId)
  if (idx !== -1) {
    const updates = { status }
    if (status === 'progress' && !orders[idx].startedAt) {
      updates.startedAt = new Date().toLocaleString('id', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
    }
    if (status === 'done') {
      updates.completedAt = new Date().toLocaleString('id', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
      updates.escrow = 'progress' // Waiting customer confirmation
    }
    if (notes) {
      updates.techNotes = notes
    }
    orders[idx] = { ...orders[idx], ...updates }
    save('orders', orders)
  }
  return orders
}

export function addOrderReview(orderId, rating, text) {
  const order = getOrders().find(o => o.id === orderId)
  if (!order) return getReviews()
  
  const reviews = getReviews()
  const newReview = {
    id: reviews.length + 1,
    orderId,
    customerId: order.customerId,
    customerName: order.customer,
    techId: order.techId,
    techName: order.tech,
    rating,
    text,
    status: 'pending',
    createdAt: new Date().toLocaleString('id', { day: 'numeric', month: 'short', year: 'numeric' }),
    flagged: false,
    flagReason: null
  }
  reviews.push(newReview)
  save('reviews', reviews)
  
  const orders = getOrders()
  const idx = orders.findIndex(o => o.id === orderId)
  if (idx !== -1) {
    orders[idx] = { ...orders[idx], rating, reviewText: text }
    save('orders', orders)
  }
  
  return reviews
}

export function requestWithdrawal(techId, amount, method, accountNumber) {
  const withdrawals = load('withdrawals', [])
  const newWithdrawal = {
    id: 'WD-' + String(withdrawals.length + 1).padStart(3, '0'),
    techId,
    amount,
    method,
    accountNumber,
    status: 'pending',
    requestedAt: new Date().toLocaleString('id', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
    processedAt: null
  }
  withdrawals.push(newWithdrawal)
  save('withdrawals', withdrawals)
  return newWithdrawal
}
