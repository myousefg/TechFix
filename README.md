# TechFix — Platform E-Marketplace Jasa Servis Elektronik

> Tugas Besar Model Bisnis Digital [EKD]  
> Tim: Muhammad Hashfi Hadyan · Mohammed Yousef Gumilar · Muhammad Fauzan Majid · Mochammad Rizky Septian

---

## 🚀 Demo

**Live:** [tech-fix-zeta.vercel.app](https://tech-fix-zeta.vercel.app)

---

## 📋 Tentang Proyek

TechFix adalah platform **e-marketplace jasa servis elektronik** yang menghubungkan pelanggan dengan teknisi independen terverifikasi. Dirancang untuk mengisi celah antara *service center resmi* (aman tapi mahal) dan *servis pinggir jalan* (murah tapi rawan).

**Fitur utama:**
- Sistem Escrow — dana ditahan hingga servis selesai dan pelanggan konfirmasi
- KYC Verification — semua teknisi diverifikasi identitasnya
- AI Smart Matching — rekomendasi teknisi berbasis kebutuhan
- Real-time Tracking — pantau progres servis langsung di aplikasi
- Rating & Review — ulasan transparan dari pelanggan terverifikasi

---

## 🏗️ Struktur Sistem

```
TechFix
├── Portal Pelanggan    → /customer
├── Portal Teknisi      → /technician
└── Admin Panel         → /admin
```

---

## 🛠️ Tech Stack

| Layer | Teknologi |
|-------|-----------|
| Frontend | React 18 + Vite |
| Styling | Tailwind CSS |
| Routing | React Router v6 |
| State | localStorage (simulasi) |
| Payment Gateway | Midtrans (konsep) |
| Deploy | Vercel |

---

## ⚙️ Cara Menjalankan

### Prasyarat
- Node.js ≥ 18
- npm ≥ 9

### Langkah

```bash
# 1. Clone atau ekstrak project
cd TechFix-fixed

# 2. Install dependencies
npm install

# 3. Jalankan development server
npm run dev
```

Buka browser di [http://localhost:5173](http://localhost:5173)

### Build Production

```bash
npm run build
npm run preview
```

---

## 🔐 Akses Portal

| Portal | URL | Keterangan |
|--------|-----|------------|
| Landing Page | `/` | Halaman utama |
| Portal Pelanggan | `/customer` | Login sebagai Muhammad Hashfi |
| Portal Teknisi | `/technician` | Login sebagai Budi Santoso |
| Admin Panel | `/admin` | Dashboard admin platform |
| Daftar Teknisi | `/technician/register` | Registrasi teknisi baru |
| Daftar Pelanggan | `/customer/register` | Registrasi pelanggan baru |

> **Catatan:** Ini adalah prototipe — tidak ada autentikasi nyata. Semua data disimpan di `localStorage` browser.

---

## 📁 Struktur Folder

```
src/
├── components/
│   ├── Navbar.jsx              # Header navigasi global
│   ├── UI.jsx                  # Komponen UI reusable (Card, Button, Badge, dll)
│   ├── CustomerModals.jsx      # Modal-modal portal pelanggan
│   ├── TechnicianModals.jsx    # Modal-modal portal teknisi
│   └── TechnicianOrderDetail.jsx
│
├── pages/
│   ├── Home.jsx                # Landing page
│   ├── About.jsx               # Halaman tentang
│   ├── customer/               # Semua halaman portal pelanggan
│   │   ├── index.jsx           # Dashboard, search, booking, orders
│   │   ├── CustomerOrderDetail.jsx
│   │   ├── CustomerPages.jsx   # Notifikasi, favorit, review
│   │   ├── AccountSettings.jsx
│   │   ├── Dispute.jsx
│   │   └── LoyaltyPoints.jsx
│   │
│   ├── technician/             # Semua halaman portal teknisi
│   │   ├── index.jsx           # Dashboard, orders, earnings, settings
│   │   ├── TechnicianOrderDetailPage.jsx
│   │   └── TechnicianPages.jsx # Review, riwayat langganan
│   │
│   └── admin/                  # Semua halaman admin panel
│       ├── index.jsx           # Dashboard, users, disputes
│       ├── Details.jsx         # Detail customer, teknisi, campaign, partner
│       ├── KYC.jsx             # Review KYC teknisi
│       ├── Transactions.jsx    # Manajemen transaksi
│       ├── Ads.jsx             # Manajemen iklan & kampanye
│       ├── AuditLog.jsx        # Log aktivitas admin
│       ├── Settings.jsx        # Pengaturan admin
│       └── Modals.jsx          # Komponen ActivityFeed, Leaderboard
│
├── data.js                     # Data demo statis (teknisi, pelanggan, order)
├── store.js                    # State management via localStorage
├── App.jsx                     # Routing utama
├── main.jsx                    # Entry point
└── index.css                   # Global styles + Tailwind
```

---

## 💡 Fitur per Portal

### Portal Pelanggan
- Cari teknisi dengan AI Smart Search + peta lokasi
- Booking dengan sistem escrow otomatis
- Tracking real-time progres servis
- Dispute & garansi uang kembali
- Subscription maintenance bulanan
- Loyalty points & reward

### Portal Teknisi
- Dashboard penghasilan dengan grafik 6 bulan
- Manajemen order (terima/tolak/update progres)
- Verifikasi KYC (submit/re-submit)
- Premium Listing (Basic/Gold/Platinum)
- Pencairan dana ke bank/e-wallet

### Admin Panel
- Dashboard revenue dengan chart multi-stream
- Manajemen pengguna (pelanggan + teknisi)
- Arbitrase sengketa dengan rekomendasi AI
- Review KYC dengan approval/rejection
- Moderasi ulasan
- Manajemen iklan & campaign
- Support tickets
- Audit log aktivitas
- Pengaturan platform

---

## 🗺️ Roadmap

| Fase | Periode | Target |
|------|---------|--------|
| MVP Launch | Bulan 1–3 | 600 transaksi/bln, 100 teknisi, 1.000 user |
| Growth | Bulan 4–6 | BEP 1.050 transaksi, 200 subscriber maintenance |
| Scale | Bulan 7–12 | 1.300+ transaksi, profit Rp2–3jt/bln |
| Expansion | Tahun 2 | Kota baru, marketplace sparepart, asuransi gadget |
| Platform | Tahun 3 | TechFix API untuk ekosistem 3rd party |

---

## 📊 Model Bisnis

**Revenue Streams:**
- Komisi transaksi 10% → Rp6jt/bln
- Subscription maintenance → Rp2.5jt/bln
- Iklan & partnership → Rp1.5jt/bln
- Premium listing teknisi → Rp1jt/bln
- **Total: Rp11jt/bln | Cost: Rp10.5jt/bln | Profit: Rp500K/bln**

---

## 🔧 Konfigurasi

### Variabel lingkungan (opsional)
Project ini tidak membutuhkan `.env` untuk berjalan — semua data menggunakan localStorage.

### Reset Data Demo
Buka DevTools browser → Application → Local Storage → hapus semua key yang diawali `techfix_`

---

## 📝 Catatan Pengembangan

- Proyek ini adalah **prototipe UI** untuk keperluan akademis
- Semua pembayaran, KYC, dan notifikasi bersifat simulasi
- Data persisten di `localStorage` — clear browser storage untuk reset
- Dibangun di atas teknologi production-ready: React + Vite + Tailwind

---

## 👥 Tim

| Nama | NIM | Kontribusi |
|------|-----|------------|
| Muhammad Hashfi Hadyan | 1302220079 | Lead Dev, Frontend, Architecture |
| Mohammed Yousef Gumilar | 1302220085 | Frontend, UI/UX, Deployment |
| Muhammad Fauzan Majid | 1302220144 | Business Model, Content |
| Mochammad Rizky Septian | 1302220121 | Business Analysis, Documentation |

---

*Mata Kuliah: Model Bisnis Digital [EKD] — 2026*
