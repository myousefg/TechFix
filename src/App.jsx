import React from 'react'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { ThemeProvider } from './ThemeContext'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import About from './pages/About'

// Customer
import {
  CustomerRegister, CustomerHome, TechnicianProfile,
  Booking, CustomerOrders, CustomerSubscription, CustomerSettings
} from './pages/customer'
import AccountSettings from './pages/customer/AccountSettings'
import { CustomerOrderDetail } from './pages/customer/CustomerOrderDetail'
import { CustomerNotifications, CustomerFavorites, CustomerReviews } from './pages/customer/CustomerPages'

// Technician
import {
  TechnicianRegister, TechnicianDashboard, TechnicianOrders,
  TechnicianEarnings, TechnicianSettings
} from './pages/technician'
import { TechnicianOrderDetailPage } from './pages/technician/TechnicianOrderDetailPage'
import { TechnicianReviews, TechnicianSubscriptionHistory } from './pages/technician/TechnicianPages'

// Admin
import {
  AdminDashboard, AdminUsers, AdminDisputes, AdminAds,
  AdminKYC, AdminKYCDetail, AdminAdsPage, AdminSettings, AdminAuditLog
} from './pages/admin'
import AdminTransactions from './pages/admin/Transactions'
import { CustomerDetail, TechnicianDetail, CampaignDetail, PartnerDetail, ReviewsModeration, SupportTickets } from './pages/admin/Details'

export default function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </ThemeProvider>
  )
}

function AppContent() {
  const { pathname } = useLocation()
  const hideNavbar = pathname === '/customer/register' || pathname === '/technician/register'
  return (
    <>
      {!hideNavbar && <Navbar />}
      <Routes>
        {/* Public */}
        <Route path="/"       element={<Home />} />
        <Route path="/about"  element={<About />} />

        {/* Customer */}
        <Route path="/customer/register"           element={<CustomerRegister />} />
        <Route path="/customer"                    element={<CustomerHome />} />
        <Route path="/customer/search"             element={<CustomerHome />} />
        <Route path="/customer/technician/:id"     element={<TechnicianProfile />} />
        <Route path="/customer/booking/:id"        element={<Booking />} />
        <Route path="/customer/orders"             element={<CustomerOrders />} />
        <Route path="/customer/orders/:id"         element={<CustomerOrderDetail />} />
        <Route path="/customer/subscription"       element={<CustomerSubscription />} />
        <Route path="/customer/settings"           element={<CustomerSettings />} />
        <Route path="/customer/account"            element={<AccountSettings />} />
        <Route path="/customer/notifications"      element={<CustomerNotifications />} />
        <Route path="/customer/favorites"          element={<CustomerFavorites />} />
        <Route path="/customer/reviews"            element={<CustomerReviews />} />

        {/* Technician */}
        <Route path="/technician/register"  element={<TechnicianRegister />} />
        <Route path="/technician"           element={<TechnicianDashboard />} />
        <Route path="/technician/orders"    element={<TechnicianOrders />} />
        <Route path="/technician/orders/:id" element={<TechnicianOrderDetailPage />} />
        <Route path="/technician/earnings"  element={<TechnicianEarnings />} />
        <Route path="/technician/reviews"   element={<TechnicianReviews />} />
        <Route path="/technician/subscription" element={<TechnicianSubscriptionHistory />} />
        <Route path="/technician/settings"  element={<TechnicianSettings />} />
        <Route path="/technician/settings"  element={<TechnicianSettings />} />

        {/* Admin */}
        <Route path="/admin"                 element={<AdminDashboard />} />
        <Route path="/admin/users"           element={<AdminUsers />} />
        <Route path="/admin/transactions"    element={<AdminTransactions />} />
        <Route path="/admin/transactions/:id" element={<AdminTransactions />} />
        <Route path="/admin/disputes"        element={<AdminDisputes />} />
        <Route path="/admin/disputes/:id"    element={<AdminDisputes />} />
        <Route path="/admin/kyc"             element={<AdminKYC />} />
        <Route path="/admin/kyc/:id"         element={<AdminKYCDetail />} />
        <Route path="/admin/ads"             element={<AdminAds />} />
        <Route path="/admin/ads/manage"      element={<AdminAdsPage />} />
        <Route path="/admin/ads/manage/:id"  element={<CampaignDetail />} />
        <Route path="/admin/ads/partners"    element={<AdminAds />} />
        <Route path="/admin/ads/partners/:id" element={<PartnerDetail />} />
        <Route path="/admin/users/customer/:id" element={<CustomerDetail />} />
        <Route path="/admin/users/tech/:id"     element={<TechnicianDetail />} />
        <Route path="/admin/support"         element={<SupportTickets />} />
        <Route path="/admin/reviews"         element={<ReviewsModeration />} />
        <Route path="/admin/audit"           element={<AdminAuditLog />} />
        <Route path="/admin/settings"        element={<AdminSettings />} />
      </Routes>
    </>
  )
}
