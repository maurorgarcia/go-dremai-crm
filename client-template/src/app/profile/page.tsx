'use client'

import { useAuth } from '@/components/providers/AuthProvider'

export default function ProfilePage() {
  const { user } = useAuth()

  const initials = user?.name
    ? user.name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
    : user?.email?.[0]?.toUpperCase() || '?'

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">Mi Perfil</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Tu información personal y roles asignados.
        </p>
      </div>

      <div className="overflow-hidden rounded-xl border border-border bg-card shadow-xs">
        {/* Gradient header */}
        <div className="h-24 bg-gradient-to-r from-primary/80 to-primary" />

        {/* Avatar + nombre */}
        <div className="px-6 pb-6">
          <div className="-mt-10 flex items-end gap-4">
            <div className="flex h-20 w-20 flex-shrink-0 items-center justify-center rounded-xl border-4 border-card bg-primary text-2xl font-bold text-primary-foreground shadow-sm">
              {initials}
            </div>
            <div className="mb-1 min-w-0">
              <p className="truncate text-xl font-semibold text-foreground">
                {user?.name || 'Sin nombre'}
              </p>
              <p className="truncate text-sm text-muted-foreground">{user?.email}</p>
            </div>
          </div>
        </div>

        {/* Data rows */}
        <div className="border-t border-border">
          {[
            { label: 'ID de usuario', value: user?.id, mono: true },
            { label: 'Nombre', value: user?.name },
            { label: 'Correo', value: user?.email },
          ].map((row) => (
            <div
              key={row.label}
              className="grid grid-cols-3 gap-4 border-b border-border px-6 py-4 last:border-0"
            >
              <dt className="text-sm font-medium text-muted-foreground">{row.label}</dt>
              <dd className={`col-span-2 text-sm break-all text-foreground ${row.mono ? 'font-mono text-xs' : ''}`}>
                {row.value || <span className="italic text-muted-foreground">Sin especificar</span>}
              </dd>
            </div>
          ))}

          {/* Roles row */}
          <div className="grid grid-cols-3 gap-4 border-t border-border px-6 py-4">
            <dt className="text-sm font-medium text-muted-foreground">Roles</dt>
            <dd className="col-span-2">
              {user?.roles && user.roles.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {user.roles.map((role) => (
                    <span
                      key={role}
                      className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-xs font-medium capitalize text-primary"
                    >
                      {role}
                    </span>
                  ))}
                </div>
              ) : (
                <span className="text-sm italic text-muted-foreground">Sin roles asignados</span>
              )}
            </dd>
          </div>
        </div>
      </div>
    </div>
  )
}

