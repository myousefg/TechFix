import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Gift, Star, ArrowUpRight, ArrowDownLeft, Zap } from 'lucide-react'
import { Card, Button, Badge } from '../../components/UI'
import { getLoyaltyPoints, saveLoyaltyPoints } from '../../store'

const vouchers = [
  { id: 1, name: 'Diskon Rp20.000',   pts: 50,  color: 'from-brand-500 to-brand-600' },
  { id: 2, name: 'Diskon Rp50.000',   pts: 120, color: 'from-teal-500 to-teal-600' },
  { id: 3, name: 'Gratis Ongkir',     pts: 80,  color: 'from-purple-500 to-purple-600' },
  { id: 4, name: 'Priority Support',  pts: 100, color: 'from-amber-500 to-orange-500' },
]

export default function LoyaltyPoints() {
  const navigate = useNavigate()
  const [data, setData] = useState(getLoyaltyPoints)
  const [redeemed, setRedeemed] = useState(null)

  function redeem(v) {
    if (data.points < v.pts) return
    const updated = {
      points: data.points - v.pts,
      history: [
        { id: Date.now(), desc: `Redeem ${v.name}`, pts: -v.pts, date: new Date().toLocaleDateString('id') },
        ...data.history,
      ]
    }
    setData(updated)
    saveLoyaltyPoints(updated)
    setRedeemed(v.name)
    setTimeout(() => setRedeemed(null), 3000)
  }

  const tierInfo = data.points >= 500
    ? { label: 'Gold', color: 'text-amber-500', bg: 'bg-amber-50 dark:bg-amber-900/20', next: null }
    : { label: 'Silver', color: 'text-gray-400', bg: 'bg-gray-100 dark:bg-gray-800', next: 500 - data.points }

  return (
    <div className="pt-16 min-h-screen bg-gray-50 dark:bg-gray-950 pb-10">
      <div className="max-w-2xl mx-auto px-4 py-6">
        <button onClick={() => navigate('/customer/settings')}
          className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 dark:hover:text-white mb-6 transition-colors">
          <ArrowLeft size={16} /> Kembali
        </button>

        {redeemed && (
          <div className="mb-4 p-3 rounded-xl bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-sm text-green-700 dark:text-green-400 flex items-center gap-2 animate-slide-up">
            <Gift size={14} /> Voucher <strong>{redeemed}</strong> berhasil diredeem!
          </div>
        )}

        {/* Points card */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-brand-600 to-brand-800 p-6 mb-6 text-white">
          <div className="absolute top-0 right-0 w-40 h-40 rounded-full bg-white/5 -translate-y-10 translate-x-10" />
          <div className="absolute bottom-0 left-0 w-32 h-32 rounded-full bg-white/5 translate-y-8 -translate-x-8" />
          <div className="relative">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-brand-200 text-xs font-medium uppercase tracking-wider mb-1">Total Poin</p>
                <p className="font-display text-5xl font-700">{data.points.toLocaleString('id')}</p>
                <p className="text-brand-200 text-sm mt-1">≈ Rp{(data.points * 400).toLocaleString('id')} nilai voucher</p>
              </div>
              <div className={`px-3 py-1.5 rounded-full ${tierInfo.bg} text-xs font-semibold ${tierInfo.color} flex items-center gap-1.5`}>
                <Star size={11} className="fill-current" />
                {tierInfo.label}
              </div>
            </div>
            {tierInfo.next && (
              <div>
                <div className="flex justify-between text-xs text-brand-200 mb-1">
                  <span>Menuju Gold</span>
                  <span>{tierInfo.next} poin lagi</span>
                </div>
                <div className="h-1.5 bg-white/20 rounded-full">
                  <div className="h-full bg-white rounded-full transition-all" style={{ width: `${(data.points / 500) * 100}%` }} />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Redeem vouchers */}
        <h2 className="font-semibold text-gray-900 dark:text-white mb-3">Tukar Poin</h2>
        <div className="grid grid-cols-2 gap-3 mb-6">
          {vouchers.map(v => {
            const canRedeem = data.points >= v.pts
            return (
              <div key={v.id} className={`rounded-2xl overflow-hidden border-2 transition-all ${canRedeem ? 'border-transparent hover:border-brand-400 card-glow' : 'border-gray-100 dark:border-gray-800 opacity-60'}`}>
                <div className={`bg-gradient-to-br ${v.color} p-4`}>
                  <p className="text-white font-display font-700 text-sm">{v.name}</p>
                </div>
                <div className="bg-white dark:bg-gray-900 p-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <Zap size={12} className="text-brand-500" />
                      <span className="text-xs font-medium text-gray-700 dark:text-gray-300">{v.pts} poin</span>
                    </div>
                    <button
                      onClick={() => redeem(v)}
                      disabled={!canRedeem}
                      className={`text-xs px-2.5 py-1 rounded-lg font-medium transition-colors ${canRedeem ? 'bg-brand-500 text-white hover:bg-brand-600 press' : 'bg-gray-100 dark:bg-gray-800 text-gray-400 cursor-not-allowed'}`}>
                      Redeem
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* History */}
        <h2 className="font-semibold text-gray-900 dark:text-white mb-3">Riwayat Poin</h2>
        <Card className="overflow-hidden">
          {data.history.map((h, i) => (
            <div key={h.id}
              className={`flex items-center gap-3 px-5 py-3.5 ${i < data.history.length - 1 ? 'border-b border-gray-100 dark:border-gray-800' : ''}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${h.pts > 0 ? 'bg-green-50 dark:bg-green-900/20' : 'bg-red-50 dark:bg-red-900/20'}`}>
                {h.pts > 0
                  ? <ArrowDownLeft size={14} className="text-green-500" />
                  : <ArrowUpRight size={14} className="text-red-500" />
                }
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-700 dark:text-gray-300 truncate">{h.desc}</p>
                <p className="text-xs text-gray-400">{h.date}</p>
              </div>
              <span className={`text-sm font-semibold flex-shrink-0 ${h.pts > 0 ? 'text-green-600 dark:text-green-400' : 'text-red-500'}`}>
                {h.pts > 0 ? '+' : ''}{h.pts}
              </span>
            </div>
          ))}
        </Card>
      </div>
    </div>
  )
}
