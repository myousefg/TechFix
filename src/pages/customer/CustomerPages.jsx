import React, { useState } from 'react'
import { Bell, Star, Heart } from 'lucide-react'
import { Card, Badge, Button, EmptyState, StarRating } from '../../components/UI'
import { getCurrentCustomer, getNotifications, markNotifsRead, getReviews } from '../../store'

// ── CUSTOMER NOTIFICATIONS ──────────────────────────────────────
export function CustomerNotifications() {
  const customer = getCurrentCustomer()
  const [notifications, setNotifications] = useState(getNotifications())

  function handleMarkRead() {
    const updated = notifications.map(n => ({ ...n, read: true }))
    setNotifications(updated)
    markNotifsRead(updated)
  }

  const unreadCount = notifications.filter(n => !n.read).length

  return (
    <div className="py-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-2xl font-700 text-gray-900 dark:text-white">Notifikasi</h1>
        {unreadCount > 0 && (
          <Button size="sm" variant="ghost" onClick={handleMarkRead}>
            Tandai Sudah Dibaca
          </Button>
        )}
      </div>

      <div className="space-y-3">
        {notifications.length === 0 && (
          <EmptyState icon={Bell} title="Belum ada notifikasi" desc="Notifikasi tentang pesanan dan promo akan muncul di sini" />
        )}
        {notifications.map(n => {
          const colorMap = {
            order: 'blue',
            escrow: 'green',
            promo: 'orange',
            system: 'gray'
          }
          return (
            <Card key={n.id} className="p-5">
              <div className="flex items-start gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-gray-900 dark:text-white text-sm">{n.title}</h3>
                    {!n.read && <Badge color="blue">Baru</Badge>}
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{n.body}</p>
                  <div className="flex items-center gap-2">
                    <Badge color={colorMap[n.type]}>{n.type}</Badge>
                    <span className="text-xs text-gray-400">{n.time}</span>
                  </div>
                </div>
              </div>
            </Card>
          )
        })}
      </div>
    </div>
  )
}

// ── CUSTOMER FAVORITES ──────────────────────────────────────────
export function CustomerFavorites() {
  return (
    <div className="py-6">
      <h1 className="font-display text-2xl font-700 text-gray-900 dark:text-white mb-6">Teknisi Favorit</h1>
      <EmptyState 
        icon={Heart} 
        title="Fitur favorites dalam pengembangan" 
        desc="Segera kamu bisa menyimpan teknisi favoritmu di sini" 
      />
    </div>
  )
}

// ── CUSTOMER REVIEWS ────────────────────────────────────────────
export function CustomerReviews() {
  const customer = getCurrentCustomer()
  const allReviews = getReviews()
  const myReviews = allReviews.filter(r => r.customerId === customer.id)

  return (
    <div className="py-6">
      <h1 className="font-display text-2xl font-700 text-gray-900 dark:text-white mb-6">Ulasan Saya</h1>
      
      <div className="space-y-3">
        {myReviews.length === 0 && (
          <EmptyState icon={Star} title="Belum ada ulasan" desc="Ulasan yang kamu berikan akan muncul di sini" />
        )}
        {myReviews.map(r => (
          <Card key={r.id} className="p-5">
            <div className="flex items-start justify-between mb-3">
              <div>
                <p className="font-semibold text-gray-900 dark:text-white text-sm">{r.techName}</p>
                <p className="text-xs text-gray-500 mt-0.5">Order {r.orderId}</p>
              </div>
              <Badge color={r.status === 'approved' ? 'green' : r.status === 'pending' ? 'orange' : 'gray'}>
                {r.status}
              </Badge>
            </div>
            
            <StarRating rating={r.rating} />
            
            {r.text && (
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">{r.text}</p>
            )}
            
            {r.flagged && r.flagReason && (
              <div className="mt-3 p-3 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg">
                <p className="text-xs text-orange-600 dark:text-orange-400">
                  ⚠️ Ditandai: {r.flagReason}
                </p>
              </div>
            )}
            
            <p className="text-xs text-gray-400 mt-3">{r.createdAt}</p>
          </Card>
        ))}
      </div>
    </div>
  )
}
