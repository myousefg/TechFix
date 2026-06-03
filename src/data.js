export const technicians = [
  { id: 1, name: 'Budi Santoso',    specialty: 'Laptop & PC Repair',       rating: 4.9, reviews: 127, price: 75000,  location: 'Bandung Timur',  verified: true,  badges: ['Top Rated', 'Fast Response'], joined: '15 Mar 2024', coords: { lat: -6.914, lng: 107.640 } },
  { id: 2, name: 'Rina Kusuma',     specialty: 'Thermal Repaste & Gaming',  rating: 4.8, reviews: 89,  price: 80000,  location: 'Bandung Barat',  verified: true,  badges: ['Specialist'],           joined: '20 Apr 2024', coords: { lat: -6.900, lng: 107.580 } },
  { id: 3, name: 'Agus Pramono',    specialty: 'Rakit PC & Upgrade RAM',    rating: 4.7, reviews: 214, price: 100000, location: 'Dago, Bandung',  verified: true,  badges: ['Pro Builder'],          joined: '5 Jan 2024',  coords: { lat: -6.885, lng: 107.615 } },
  { id: 4, name: 'Dewi Lestari',    specialty: 'Data Recovery & Storage',   rating: 4.9, reviews: 56,  price: 150000, location: 'Cimahi',         verified: true,  badges: ['Specialist'],           joined: '12 Jun 2024', coords: { lat: -6.872, lng: 107.540 } },
  { id: 5, name: 'Hendra Wijaya',   specialty: 'Network & IT Support',      rating: 4.6, reviews: 103, price: 90000,  location: 'Bandung Selatan',verified: false, badges: [],                       joined: '28 Mei 2026', coords: { lat: -6.950, lng: 107.610 } },
  { id: 6, name: 'Sari Andayani',   specialty: 'Laptop Screen & Keyboard',  rating: 4.8, reviews: 72,  price: 85000,  location: 'Buah Batu',      verified: true,  badges: ['Fast Response'],        joined: '8 Feb 2024',  coords: { lat: -6.948, lng: 107.630 } },
  { id: 7, name: 'Reza Hidayat',    specialty: 'Printer & Scanner',         rating: 4.7, reviews: 45,  price: 70000,  location: 'Cibeunying',     verified: true,  badges: ['Specialist'],           joined: '15 Mar 2026', coords: { lat: -6.901, lng: 107.620 } },
  { id: 8, name: 'Linda Permata',   specialty: 'MacBook Specialist',        rating: 4.9, reviews: 92,  price: 120000, location: 'Setiabudi',      verified: true,  badges: ['Top Rated', 'Apple Cert'], joined: '10 Apr 2024', coords: { lat: -6.865, lng: 107.595 } },
]

export const customers = [
  { id: 1, name: 'Muhammad Hashfi',  email: 'hashfi@email.com',  phone: '+62 812 3456 0079', city: 'Bandung',    address: 'Jl. Dipatiukur No. 35, Coblong',     joined: '15 Jan 2026', lastActive: '2 jam lalu',  totalReviews: 8,  riskScore: 12, orders: 5, totalSpent: 745000,  status: 'active' },
  { id: 2, name: 'Rizky Saputra',    email: 'rizky@email.com',   phone: '+62 813 1111 2233', city: 'Jakarta',    address: 'Jl. Sudirman Kav. 45, Tanah Abang',  joined: '20 Feb 2026', lastActive: '5 menit lalu', totalReviews: 4,  riskScore: 8,  orders: 3, totalSpent: 520000,  status: 'active' },
  { id: 3, name: 'Maya Sari',        email: 'maya@email.com',    phone: '+62 821 9988 7766', city: 'Surabaya',   address: 'Jl. Mayjend Sungkono 88',            joined: '5 Mar 2026',  lastActive: '1 hari lalu', totalReviews: 3,  riskScore: 15, orders: 2, totalSpent: 275000,  status: 'active' },
  { id: 4, name: 'Andi Rachman',     email: 'andi@email.com',    phone: '+62 822 4455 0011', city: 'Yogyakarta', address: 'Jl. Magelang KM 5, Sleman',          joined: '12 Apr 2026', lastActive: '3 hari lalu', totalReviews: 1,  riskScore: 22, orders: 1, totalSpent: 175000,  status: 'active' },
  { id: 5, name: 'Siti Mardiana',    email: 'siti@email.com',    phone: '+62 856 7777 8888', city: 'Semarang',   address: 'Jl. Pandanaran No. 12',              joined: '8 Mei 2026',  lastActive: '2 minggu lalu',totalReviews: 6, riskScore: 35, orders: 4, totalSpent: 610000,  status: 'suspended' },
  { id: 6, name: 'Budi Raharjo',     email: 'budi.r@email.com',  phone: '+62 813 2222 3344', city: 'Bekasi',     address: 'Jl. Ahmad Yani No. 99',              joined: '18 Mei 2026', lastActive: '4 jam lalu',  totalReviews: 2,  riskScore: 5,  orders: 2, totalSpent: 340000,  status: 'active' },
  { id: 7, name: 'Dewi Anggraini',   email: 'dewi.a@email.com',  phone: '+62 821 3333 4455', city: 'Medan',      address: 'Jl. Gatot Subroto No. 77',           joined: '25 Mei 2026', lastActive: '30 menit lalu',totalReviews: 5, riskScore: 10, orders: 3, totalSpent: 580000,  status: 'active' },
  { id: 8, name: 'Ferdi Saputro',    email: 'ferdi@email.com',   phone: '+62 852 4444 5566', city: 'Makassar',   address: 'Jl. Pengayoman Ruko Mirah Blok C/4',  joined: '1 Jun 2026',  lastActive: '6 jam lalu',  totalReviews: 1,  riskScore: 18, orders: 1, totalSpent: 125000,  status: 'active' },
  { id: 9, name: 'Gita Pertiwi',     email: 'gita@email.com',    phone: '+62 813 5555 6677', city: 'Denpasar',   address: 'Jl. Bypass Ngurah Rai No. 200',      joined: '28 Mei 2026', lastActive: '1 hari lalu', totalReviews: 3,  riskScore: 9,  orders: 2, totalSpent: 410000,  status: 'active' },
  { id: 10,name: 'Hadi Wibowo',      email: 'hadi@email.com',    phone: '+62 822 6666 7788', city: 'Malang',     address: 'Jl. Ijen Boulevard No. 15',          joined: '30 Mei 2026', lastActive: '20 menit lalu',totalReviews: 0, riskScore: 7,  orders: 1, totalSpent: 195000,  status: 'active' },
]

export const orders = [
  { id: 'TF-001', customerId: 1, customer: 'Muhammad Hashfi', techId: 1, tech: 'Budi Santoso',  service: 'Servis Laptop Lenovo ThinkPad', amount: 175000, status: 'done',     escrow: 'done',     date: '20 Mei 2026', createdAt: '2026-05-18', paymentMethod: 'BCA VA',     customerNotes: 'Laptop tidak bisa nyala setelah di-charge semalam', techNotes: 'Kerusakan pada IC power, sudah diganti dengan yang baru',          rating: 5, reviewText: 'Cepat dan profesional, laptop langsung nyala!' },
  { id: 'TF-002', customerId: 2, customer: 'Rizky Saputra',   techId: 2, tech: 'Rina Kusuma',   service: 'Thermal Repaste ASUS ROG',      amount: 120000, status: 'progress', escrow: 'progress', date: '28 Mei 2026', createdAt: '2026-05-28', paymentMethod: 'GoPay',      customerNotes: 'Laptop overheat parah saat main game',                       techNotes: 'Sedang proses repaste dengan Thermal Grizzly Kryonaut',          rating: 0, reviewText: '' },
  { id: 'TF-003', customerId: 3, customer: 'Maya Sari',       techId: 3, tech: 'Agus Pramono',  service: 'Rakit PC Gaming',               amount: 450000, status: 'waiting',  escrow: 'waiting',  date: '1 Jun 2026',  createdAt: '2026-06-01', paymentMethod: 'BCA VA',     customerNotes: 'Budget 5-7jt,主要用于 gaming dan streaming',                  techNotes: '', rating: 0, reviewText: '' },
  { id: 'TF-004', customerId: 4, customer: 'Andi Rachman',    techId: 4, tech: 'Dewi Lestari',  service: 'Recovery Data SSD Corsair',     amount: 300000, status: 'done',     escrow: 'done',     date: '15 Mei 2026', createdAt: '2026-05-10', paymentMethod: 'OVO',        customerNotes: 'SSD tidak terdeteksi, data penting untuk kerja',           techNotes: 'Recovery berhasil 98% dengan tools profesional',                 rating: 5, reviewText: 'Selamat! Data pekerjaan saya kembali semua. Terima kasih banyak.' },
  { id: 'TF-005', customerId: 6, customer: 'Budi Raharjo',    techId: 1, tech: 'Budi Santoso',  service: 'Upgrade RAM & SSD',             amount: 250000, status: 'done',     escrow: 'done',     date: '10 Mei 2026', createdAt: '2026-05-08', paymentMethod: 'DANA',       customerNotes: 'Upgrade dari 8GB ke 16GB, tambah SSD 512GB',                techNotes: 'RAM Corsair Vengeance 16GB + SSD Samsung 970 EVO 500GB',        rating: 4, reviewText: 'Hasil bagus, tapi agak lama karena spare part delay.' },
  { id: 'TF-006', customerId: 7, customer: 'Dewi Anggraini',  techId: 6, tech: 'Sari Andayani', service: 'Servis Laptop Layar Pecah',     amount: 200000, status: 'done',     escrow: 'done',     date: '8 Mei 2026',  createdAt: '2026-05-05', paymentMethod: 'BCA VA',     customerNotes: 'Layar LCD pecah kena jatuh',                                techNotes: 'Penggantian LCD baru merk AU Optronics original',                rating: 5, reviewText: 'Layar baru seperti asli, sangat memuaskan!' },
  { id: 'TF-007', customerId: 9, customer: 'Gita Pertiwi',    techId: 2, tech: 'Rina Kusuma',   service: 'Thermal Repaste + Cleaning',    amount: 150000, status: 'done',     escrow: 'done',     date: '5 Mei 2026',  createdAt: '2026-05-03', paymentMethod: 'GoPay',      customerNotes: 'Laptop sudah 2 tahun, perlu maintenance',                   techNotes: 'Repaste + ganti fan + cleaning dalam, hasil suhu turun 20°C',   rating: 5, reviewText: 'Sekarang adem banget, gak ngelag lagi!' },
  { id: 'TF-008', customerId: 10,customer: 'Hadi Wibowo',     techId: 3, tech: 'Agus Pramono',  service: 'Konsultasi Rakit PC',           amount: 195000, status: 'done',     escrow: 'done',     date: '30 Mei 2026', createdAt: '2026-05-28', paymentMethod: 'BCA VA',     customerNotes: 'Mau rakit PC untuk desain grafis',                           techNotes: 'Konsultasi selesai, customer akan order minggu depan',          rating: 0, reviewText: '' },
  { id: 'TF-009', customerId: 2, customer: 'Rizky Saputra',   techId: 8, tech: 'Linda Permata', service: 'Servis MacBook Pro M1',         amount: 350000, status: 'progress', escrow: 'progress', date: '2 Jun 2026',  createdAt: '2026-06-02', paymentMethod: 'BCA VA',     customerNotes: 'Baterai drop drastis, hanya tahan 2 jam',                   techNotes: 'Penggantian battery unit, ESD-safe procedure',                  rating: 0, reviewText: '' },
  { id: 'TF-010', customerId: 7, customer: 'Dewi Anggraini',  techId: 7, tech: 'Reza Hidayat',   service: 'Servis Printer Epson L3110',    amount: 180000, status: 'done',     escrow: 'done',     date: '22 Mei 2026', createdAt: '2026-05-20', paymentMethod: 'DANA',       customerNotes: 'Printer tidak bisa print, tinta tidak keluar',                techNotes: 'Cleaning head + reset ink counter, hasil normal kembali',       rating: 4, reviewText: 'Sekarang lancar, tapi tintanya cepat habis.' },
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
