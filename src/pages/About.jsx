import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Shield, Zap, Users, Award } from 'lucide-react'
import { Button, Card } from '../components/UI'

export default function About() {
  const navigate = useNavigate()
  const members = [
    { name: 'Muhammad Hashfi Hadyan',    nim: '1302220079' },
    { name: 'Mohammed Yousef Gumilar',  nim: '1302220085' },
    { name: 'Muhammad Fauzan Majid',    nim: '1302220144' },
    { name: 'Mochammad Rizky Septian',  nim: '1302220121' },
  ]
  return (
    <div className="pt-16 min-h-screen bg-gray-50 dark:bg-gray-950">
      <div className="max-w-3xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="font-display text-4xl font-700 text-gray-900 dark:text-white mb-4">Tentang TechFix</h1>
          <p className="text-gray-500 dark:text-gray-400 leading-relaxed max-w-xl mx-auto">
            TechFix adalah platform e-marketplace jasa servis elektronik yang menghubungkan pelanggan dengan teknisi independen terverifikasi. Dibangun sebagai Tugas Besar Mata Kuliah Model Bisnis Digital 2025, Telkom University.
          </p>
        </div>
        <div className="grid md:grid-cols-2 gap-4 mb-12">
          {[
            { icon: Shield, title: 'Escrow Terpercaya', desc: 'Dana aman hingga servis selesai & pelanggan puas' },
            { icon: Zap,    title: 'Real-Time Tracking', desc: 'Pantau progres perbaikan via foto & video' },
            { icon: Users,  title: 'Teknisi Terverifikasi', desc: 'Setiap teknisi melalui proses KYC yang ketat' },
            { icon: Award,  title: 'Rating Transparan', desc: 'Sistem ulasan yang jujur dan dapat dipercaya' },
          ].map(v => (
            <Card key={v.title} className="p-5">
              <v.icon size={20} className="text-brand-500 mb-3" />
              <h3 className="font-semibold text-gray-900 dark:text-white mb-1">{v.title}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">{v.desc}</p>
            </Card>
          ))}
        </div>
        <Card className="p-6 mb-8">
          <h2 className="font-display text-xl font-700 text-gray-900 dark:text-white mb-4 text-center">Tim Pengembang</h2>
          <p className="text-sm text-center text-gray-500 mb-1">Kelas SE-46-GAB · Dosen: Eko Darwiyanto</p>
          <p className="text-sm text-center text-gray-500 mb-5">Program Studi Rekayasa Perangkat Lunak · Telkom University 2025</p>
          <div className="grid grid-cols-2 gap-3">
            {members.map(m => (
              <div key={m.nim} className="p-3 rounded-xl bg-gray-50 dark:bg-gray-800 text-center">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center text-white font-display font-700 mx-auto mb-2">{m.name.charAt(0)}</div>
                <p className="text-xs font-medium text-gray-900 dark:text-white leading-tight">{m.name}</p>
                <p className="text-xs text-gray-400 font-mono mt-0.5">{m.nim}</p>
              </div>
            ))}
          </div>
        </Card>
        <div className="flex flex-wrap gap-3 justify-center">
          <Button onClick={() => navigate('/customer')}>Portal Pelanggan</Button>
          <Button variant="outline" onClick={() => navigate('/technician')}>Portal Teknisi</Button>
          <Button variant="secondary" onClick={() => navigate('/admin')}>Admin Panel</Button>
        </div>
      </div>
    </div>
  )
}
