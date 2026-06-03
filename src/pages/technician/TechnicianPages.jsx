import React, { useState } from 'react'
import { Star, CreditCard } from 'lucide-react'
import { Card, Badge, Button, EmptyState, StarRating } from '../../components/UI'
import { getCurrentTechnician, getTechnicianReviews } from '../../store'

// ── TECHNICIAN REVIEWS ──────────────────────────────────────────
export function TechnicianReviews() {
  const tech = getCurrentTechnician()
  const reviews = getTechnicianReviews(tech.id)

  const ratingBreakdown = [5, 4, 3, 2, 1].map(star => ({
    star,
    count: reviews.filter(r => r.rating === star).length
  }))

  const avgRating = reviews.length > 0
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : 0

  return (
    <div className="py-6">
      <h1 className="font-display text-2xl font-700 text-gray-900 dark:text-white mb-6">Ulasan dari Pelanggan</h1>

      {reviews.length > 0 && (
        <Card className="p-5 mb-6">
          <div className="flex items-center gap-6">
            <div className="text-center">
              <div className="text-4xl font-display font-700 text-gray-900 dark:text-white">{avgRating}</div>
              <StarRating rating={parseFloat(avgRating)} count={reviews.length} />
            </div>
            <div className="flex-1 space-y-2">
              {ratingBreakdown.map(({ star, count }) => (
                <div key={star} className="flex items-center gap-3">
                  <div className="flex items-center gap-1 w-12">
                    <span className="text-sm text-gray-600 dark:text-gray-400">{star}</span>
                    <Star size={12} className="fill-amber-400 text-amber-400" />
                  </div>
                  <div className="flex-1 h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-amber-400"
                      style={{ width: `${reviews.length > 0 ? (count / reviews.length) * 100 : 0}%` }}
                    />
                  </div>
                  <span className="text-sm text-gray-500 w-8 text-right">{count}</span>
                </div>
              ))}
            </div>
          </div>
        </Card>
      )}

      <div className="space-y-3">
        {reviews.length === 0 && (
          <EmptyState icon={Star} title="Belum ada ulasan" desc="Ulasan dari pelanggan akan muncul di sini" />
        )}
        {reviews.map(r => (
          <Card key={r.id} className="p-5">
            <div className="flex items-start justify-between mb-2">
              <div>
                <p className="font-semibold text-gray-900 dark:text-white text-sm">{r.customerName}</p>
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

// ── TECHNICIAN SUBSCRIPTION HISTORY ─────────────────────────────
export function TechnicianSubscriptionHistory() {
  return (
    <div className="py-6">
      <h1 className="font-display text-2xl font-700 text-gray-900 dark:text-white mb-6">Riwayat Langganan</h1>
      <EmptyState 
        icon={CreditCard} 
        title="Riwayat langganan premium" 
        desc="Riwayat upgrade dan perpanjangan paket premium akan muncul di sini" 
      />
    </div>
  )
}
