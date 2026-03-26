'use client'

import { useAuth } from '@/components/providers/AuthProvider'
import { useUserRole } from '@/hooks/useUserRole'
import { LayoutDashboard, ShieldCheck } from 'lucide-react'

export default function DashboardPage() {
  const { user } = useAuth()
  const { isAdmin, roles } = useUserRole()

  const firstName = user?.name?.split(' ')[0] || 'Usuario'
  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Buenos días' : hour < 19 ? 'Buenas tardes' : 'Buenas noches'

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">
            {greeting}, {firstName} 👋
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Aquí va el contenido principal del CRM para este cliente.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {roles.map((role) => (
            <span
              key={role}
              className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-medium capitalize text-primary"
            >
              <ShieldCheck className="h-3 w-3" />
              {role}
            </span>
          ))}
        </div>
      </div>

      {/* Admin notice */}
      {isAdmin && (
        <div className="flex items-start gap-4 rounded-xl border border-primary/20 bg-primary/5 p-4">
          <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-primary">
            <ShieldCheck className="h-4 w-4 text-primary-foreground" />
          </div>
          <div>
            <p className="text-sm font-semibold text-primary">
              Panel de Administrador activo
            </p>
            <p className="mt-0.5 text-sm text-muted-foreground">
              Tenés el rol <strong className="text-primary">admin</strong>. Este espacio estará disponible para métricas y configuraciones exclusivas.
            </p>
          </div>
        </div>
      )}

      {/* Stat cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {[
          { label: 'Total de usuarios', value: '—', desc: 'Usuarios registrados' },
          { label: 'Sesiones activas', value: '—', desc: 'En las últimas 24hs' },
          { label: 'Módulos activos', value: '—', desc: 'Disponibles en este plan' },
        ].map((card) => (
          <div
            key={card.label}
            className="rounded-xl border border-border bg-card p-5 shadow-xs"
          >
            <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              {card.label}
            </p>
            <p className="mt-3 text-3xl font-semibold text-foreground">{card.value}</p>
            <p className="mt-1 text-xs text-muted-foreground">{card.desc}</p>
          </div>
        ))}
      </div>

      {/* Placeholder */}
      <div className="flex min-h-48 flex-col items-center justify-center rounded-xl border border-dashed border-border bg-card/50 p-8 text-center">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
          <LayoutDashboard className="h-5 w-5 text-muted-foreground" />
        </div>
        <p className="mt-3 text-sm font-medium text-foreground">
          Área de contenido del cliente
        </p>
        <p className="mt-1 text-xs text-muted-foreground">
          Acá se van a agregar los módulos específicos de cada sprint.
        </p>
      </div>
    </div>
  )
}
