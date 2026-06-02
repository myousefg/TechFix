export const technicians = [
  { id: 1, name: 'Budi Santoso',    specialty: 'Laptop & PC Repair',       rating: 4.9, reviews: 127, price: 75000,  location: 'Bandung Timur',  verified: true,  badges: ['Top Rated', 'Fast Response'] },
  { id: 2, name: 'Rina Kusuma',     specialty: 'Thermal Repaste & Gaming',  rating: 4.8, reviews: 89,  price: 80000,  location: 'Bandung Barat',  verified: true,  badges: ['Specialist'] },
  { id: 3, name: 'Agus Pramono',    specialty: 'Rakit PC & Upgrade RAM',    rating: 4.7, reviews: 214, price: 100000, location: 'Dago, Bandung',  verified: true,  badges: ['Pro Builder'] },
  { id: 4, name: 'Dewi Lestari',    specialty: 'Data Recovery & Storage',   rating: 4.9, reviews: 56,  price: 150000, location: 'Cimahi',         verified: true,  badges: ['Specialist'] },
  { id: 5, name: 'Hendra Wijaya',   specialty: 'Network & IT Support',      rating: 4.6, reviews: 103, price: 90000,  location: 'Bandung Selatan',verified: false, badges: [] },
  { id: 6, name: 'Sari Andayani',   specialty: 'Laptop Screen & Keyboard',  rating: 4.8, reviews: 72,  price: 85000,  location: 'Buah Batu',      verified: true,  badges: ['Fast Response'] },
]

export const orders = [
  { id: 'TF-001', technician: 'Budi Santoso',  service: 'Servis Laptop Lenovo ThinkPad', date: '28 Mei 2025', status: 'done',     price: 175000, escrow: 'done' },
  { id: 'TF-002', technician: 'Rina Kusuma',   service: 'Thermal Repaste ASUS ROG',      date: '2 Jun 2025',  status: 'progress', price: 120000, escrow: 'progress' },
  { id: 'TF-003', technician: 'Agus Pramono',  service: 'Rakit PC Gaming',               date: '10 Jun 2025', status: 'waiting',  price: 450000, escrow: 'waiting' },
]

export const adminStats = {
  totalRevenue: 'Rp11.000.000',
  transactions: 600,
  activeUsers: 1247,
  activeTechs: 89,
  pendingKYC: 12,
  disputes: 3,
}

export const services = [
  { id: 1, icon: '💻', label: 'Servis Laptop',    desc: 'Diagnosa & perbaikan semua merk' },
  { id: 2, icon: '🖥️', label: 'Rakit PC',         desc: 'Custom build sesuai budget' },
  { id: 3, icon: '🌡️', label: 'Thermal Repaste',  desc: 'Atasi laptop overheat' },
  { id: 4, icon: '💾', label: 'Recovery Data',    desc: 'Pulihkan data dari storage rusak' },
  { id: 5, icon: '🌐', label: 'Jaringan & IT',    desc: 'Setup LAN, WiFi, IT support' },
  { id: 6, icon: '⬆️', label: 'Upgrade Hardware', desc: 'RAM, SSD, GPU upgrade' },
]

export const maintenancePlans = [
  { id: 'basic',   name: 'Basic',   price: 20000,  devices: 1, features: ['Diagnostic bulanan', 'Cleaning & dust removal', 'Software update check'] },
  { id: 'premium', name: 'Premium', price: 35000,  devices: 2, features: ['Semua fitur Basic', 'Priority support', 'Thermal repaste 6 bulan sekali', 'Backup reminder'] },
  { id: 'family',  name: 'Family',  price: 50000,  devices: 99, features: ['Semua fitur Premium', 'Unlimited devices', 'Dedicated teknisi', 'Home visit 1x/bulan'] },
]
