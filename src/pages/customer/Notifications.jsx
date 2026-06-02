import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Package, Shield, Tag, Info, CheckCheck } from 'lucide-react'
import { Card, Badge } from '../../components/UI'
import { getNotifications, markNotifsRead } from '../../store'

const typeConfig = {
  order:  { icon: Package, color: 'bg-brand-50 dark:bg-brand-900/30',  text: 'text-brand-500'  },
  escrow: { icon: Shield,  color: 'bg-green-50 dark:bg-green-900/30',  text: 'text-green-500'  },
  promo:  { icon: Tag,     color: 'bg-orange-50 dark:bg-orange-900/30',text: 'text-orange-500' },
  system: { icon: Info,    color: 'bg-gray-100 dark:bg-gray-800',       text: 'text-gray-500'   },
}

export default function Notifications() {
  const navigate = useNavigate()
  const [notifs, setNotifs] = useState(getNotifications)

  function markAllRead() {
    const updated = notifs.map(n => ({ ...n, read: true }))
    setNotifs(updated)
    markNotifsRead(updated)
  }
  function markOne(id) {
    const updated = notifs.map(n => n.id === id ? { ...n, read: true } : n)
    setNotifs(updated)
    markNotifsRead(updated)
  }

  const unread = notifs.filter(n => !n.read).length

  return (
    <div className="pt-16 min-h-screen bg-gray-50 dark:bg-gray-950 pb-10">
      <div className="max-w-2xl mx-auto px-4 py-6">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 dark:hover:text-white mb-6 transition-colors">
          <ArrowLeft size={16} /> Kembali
        </button>

        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <h1 className="font-display text-2xl font-700 text-gray-900 dark:text-white">Notifikasi</h1>
            {unread > 0 && <Badge color="blue">{unread} baru</Badge>}
          </div>
          {unread > 0 && (
            <button onClick={markAllRead} className="flex items-center gap-1.5 text-sm text-brand-500 hover:text-brand-600 font-medium transition-colors">
              <CheckCheck size={14} /> Tandai semua
            </button>
          )}
        </div>

        <div className="space-y-2">
          {notifs.map(n => {
            const cfg = typeConfig[n.type] || typeConfig.system
            const Icon = cfg.icon
            return (
              <Card key={n.id}
                className={`p-4 cursor-pointer transition-all ${!n.read ? 'border-brand-200 dark:border-brand-800 bg-brand-50/50 dark:bg-brand-900/10' : ''}`}
                onClick={() => markOne(n.id)}>
                <div className="flex items-start gap-3">
                  <div className={`w-9 h-9 rounded-xl ${cfg.color} flex items-center justify-center flex-shrink-0 mt-0.5`}>
                    <Icon size={16} className={cfg.text} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <p className={`text-sm font-medium ${!n.read ? 'text-gray-900 dark:text-white' : 'text-gray-700 dark:text-gray-300'}`}>{n.title}</p>
                      {!n.read && <div className="w-2 h-2 rounded-full bg-brand-500 flex-shrink-0 mt-1.5" />}
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{n.body}</p>
                    <p className="text-xs text-gray-400 mt-1">{n.time}</p>
                  </div>
                </div>
              </Card>
            )
          })}
        </div>

        {notifs.every(n => n.read) && (
          <div className="text-center py-12 animate-fade-in">
            <div className="w-14 h-14 rounded-2xl bg-green-50 dark:bg-green-900/20 flex items-center justify-center mx-auto mb-3">
              <CheckCheck size={24} className="text-green-500" />
            </div>
            <p className="font-medium text-gray-900 dark:text-white mb-1">Semua sudah dibaca</p>
            <p className="text-sm text-gray-400">Tidak ada notifikasi baru</p>
          </div>
        )}
      </div>
    </div>
  )
}
