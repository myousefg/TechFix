import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { ThemeProvider } from './ThemeContext'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import About from './pages/About'

// Customer
import {
  CustomerRegister, CustomerHome, TechnicianProfile,
  Booking, CustomerOrders, CustomerSubscription, CustomerSettings
} from './pages/customer'

// Technician
import {
  TechnicianRegister, TechnicianDashboard, TechnicianOrders,
  TechnicianEarnings, TechnicianSettings
} from './pages/technician'

// Admin
import {
  AdminDashboard, AdminUsers, AdminDisputes, AdminAds
} from './pages/admin'

export default function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Navbar />
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
          <Route path="/customer/subscription"       element={<CustomerSubscription />} />
          <Route path="/customer/settings"           element={<CustomerSettings />} />

          {/* Technician */}
          <Route path="/technician/register"  element={<TechnicianRegister />} />
          <Route path="/technician"           element={<TechnicianDashboard />} />
          <Route path="/technician/orders"    element={<TechnicianOrders />} />
          <Route path="/technician/earnings"  element={<TechnicianEarnings />} />
          <Route path="/technician/settings"  element={<TechnicianSettings />} />

          {/* Admin */}
          <Route path="/admin"              element={<AdminDashboard />} />
          <Route path="/admin/users"        element={<AdminUsers />} />
          <Route path="/admin/transactions" element={<AdminDashboard />} />
          <Route path="/admin/disputes"     element={<AdminDisputes />} />
          <Route path="/admin/ads"          element={<AdminAds />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  )
}
