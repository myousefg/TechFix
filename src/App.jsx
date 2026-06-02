import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { ThemeProvider } from './ThemeContext'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import About from './pages/About'
import NotFound from './pages/NotFound'

// Customer pages
import {
  CustomerRegister,
  CustomerHome,
  TechnicianProfile,
  Booking,
  CustomerOrders,
  CustomerSubscription,
  CustomerSettings,
} from './pages/customer'
import PaymentMethods  from './pages/customer/PaymentMethods'
import Notifications   from './pages/customer/Notifications'
import NotifSettings   from './pages/customer/NotifSettings'
import AccountSettings from './pages/customer/AccountSettings'
import LoyaltyPoints   from './pages/customer/LoyaltyPoints'
import Dispute         from './pages/customer/Dispute'
import B2BRegister     from './pages/customer/B2BRegister'

// Technician pages
import {
  TechnicianRegister,
  TechnicianDashboard,
  TechnicianOrders,
  TechnicianEarnings,
  TechnicianSettings,
} from './pages/technician'

// Admin pages
import {
  AdminDashboard,
  AdminUsers,
  AdminDisputes,
  AdminAds,
} from './pages/admin'
import AdminTransactions      from './pages/admin/Transactions'
import { KYCList, KYCReview } from './pages/admin/KYCReview'

export default function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Navbar />
        <Routes>
          {/* ── Public ── */}
          <Route path="/"         element={<Home />} />
          <Route path="/about"    element={<About />} />
          <Route path="/business" element={<B2BRegister />} />

          {/* ── Customer ── */}
          <Route path="/customer/register"         element={<CustomerRegister />} />
          <Route path="/customer"                  element={<CustomerHome />} />
          <Route path="/customer/search"           element={<CustomerHome />} />
          <Route path="/customer/technician/:id"   element={<TechnicianProfile />} />
          <Route path="/customer/booking/:id"      element={<Booking />} />
          <Route path="/customer/orders"           element={<CustomerOrders />} />
          <Route path="/customer/subscription"     element={<CustomerSubscription />} />
          <Route path="/customer/settings"         element={<CustomerSettings />} />
          <Route path="/customer/payment-methods"  element={<PaymentMethods />} />
          <Route path="/customer/notifications"    element={<Notifications />} />
          <Route path="/customer/notif-settings"   element={<NotifSettings />} />
          <Route path="/customer/account"          element={<AccountSettings />} />
          <Route path="/customer/loyalty"          element={<LoyaltyPoints />} />
          <Route path="/customer/dispute/:orderId" element={<Dispute />} />

          {/* ── Technician ── */}
          <Route path="/technician/register" element={<TechnicianRegister />} />
          <Route path="/technician"          element={<TechnicianDashboard />} />
          <Route path="/technician/orders"   element={<TechnicianOrders />} />
          <Route path="/technician/earnings" element={<TechnicianEarnings />} />
          <Route path="/technician/settings" element={<TechnicianSettings />} />

          {/* ── Admin ── */}
          <Route path="/admin"              element={<AdminDashboard />} />
          <Route path="/admin/users"        element={<AdminUsers />} />
          <Route path="/admin/transactions" element={<AdminTransactions />} />
          <Route path="/admin/disputes"     element={<AdminDisputes />} />
          <Route path="/admin/ads"          element={<AdminAds />} />
          <Route path="/admin/kyc"          element={<KYCList />} />
          <Route path="/admin/kyc/:id"      element={<KYCReview />} />

          {/* ── 404 ── */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  )
}
