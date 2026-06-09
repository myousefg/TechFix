import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Activity, LogIn, Download, CheckCircle, XCircle, Edit, Trash2, Plus, Pause, Play, UserCheck, UserX, AlertTriangle } from 'lucide-react'
import { Card, Badge, EmptyState } from '../../components/UI'
import { AdminLayout } from './index'
import { getAuditLog } from '../../store'

const actionMeta = {
  login:              { icon: LogIn,        color: 'blue'   },
  export_csv:         { icon: Download,     color: 'gray'   },
  resolve_dispute:    { icon: CheckCircle,  color: 'green'  },
  approve_kyc:        { icon: UserCheck,    color: 'green'  },
  reject_kyc:         { icon: UserX,        color: 'red'    },
  update_profile:     { icon: Edit,         color: 'blue'   },
  change_password:    { icon: Edit,         color: 'blue'   },
  create_ad_campaign: { icon: Plus,         color: 'green'  },
  update_ad_campaign: { icon: Edit,         color: 'blue'   },
  delete_ad_campaign: { icon: Trash2,       color: 'red'    },
  pause_ad_campaign:  { icon: Pause,        color: 'orange' },
  resume_ad_campaign: { icon: Play,         color: 'green'  },
}

const actionLabel = {
  login:              'Login',
  export_csv:         'Export CSV',
  resolve_dispute:    'Resolve Dispute',
  approve_kyc:        'Approve KYC',
  reject_kyc:         'Reject KYC',
  update_profile:     'Update Profil',
  change_password:    'Ubah Password',
  create_ad_campaign: 'Buat Campaign',
  update_ad_campaign: 'Update Campaign',
  delete_ad_campaign: 'Hapus Campaign',
  pause_ad_campaign:  'Jeda Campaign',
  resume_ad_campaign: 'Lanjut Campaign',
}

export function AdminAuditLog() {
  const navigate = useNavigate()
  const logs = getAuditLog()
  const [filter, setFilter] = React.useState('all')

  const filtered = filter === 'all' ? logs : logs.filter(l => l.action === filter)

  const uniqueActions = [...new Set(logs.map(l => l.action))]

  return (
    <AdminLayout>
      <button onClick={() => navigate('/admin')} className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 dark:hover:text-white mb-6 transition-colors">
        <ArrowLeft size={16} /> Kembali
      </button>
      <h1 className="font-display text-2xl font-700 text-gray-900 dark:text-white mb-2">Audit Log</h1>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">Riwayat semua aktivitas admin di platform</p>

      <div className="flex gap-2 mb-4 overflow-x-auto">
        <button onClick={() => setFilter('all')}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${filter === 'all' ? 'bg-brand-500 text-white' : 'bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400'}`}>
          Semua ({logs.length})
        </button>
        {uniqueActions.map(a => (
          <button key={a} onClick={() => setFilter(a)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${filter === a ? 'bg-brand-500 text-white' : 'bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400'}`}>
            {actionLabel[a] || a} ({logs.filter(l => l.action === a).length})
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <Card className="p-5">
          <EmptyState icon={Activity} title="Belum ada aktivitas" desc="Aksi admin akan tercatat di sini" />
        </Card>
      ) : (
        <Card>
          <div className="divide-y divide-gray-100 dark:divide-gray-800">
            {filtered.map(log => {
              const meta = actionMeta[log.action] || { icon: Activity, color: 'gray' }
              const Icon = meta.icon
              return (
                <div key={log.id} className="flex items-start gap-3 p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                  <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${
                    meta.color === 'blue'   ? 'bg-brand-50 dark:bg-brand-900/30 text-brand-600 dark:text-brand-400' :
                    meta.color === 'green'  ? 'bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400' :
                    meta.color === 'red'    ? 'bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400' :
                    meta.color === 'orange' ? 'bg-orange-50 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400' :
                                              'bg-gray-100 dark:bg-gray-800 text-gray-500'
                  }`}>
                    <Icon size={16} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      <span className="font-semibold">{log.actor}</span>
                      {' '}
                      <span className="text-gray-500 font-normal">{actionLabel[log.action] || log.action}</span>
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 truncate">
                      Target: <span className="font-mono">{log.target}</span>
                    </p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-xs text-gray-500">{log.at}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </Card>
      )}
    </AdminLayout>
  )
}
