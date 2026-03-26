'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { AuthUser } from '@/lib/types'

type AuthContextType = {
  user: AuthUser | null
  loading: boolean
}

const AuthContext = createContext<AuthContextType>({ user: null, loading: false })

export function AuthProvider({
  children,
  initialUser,
}: {
  children: React.ReactNode
  initialUser: AuthUser | null
}) {
  const [user, setUser] = useState<AuthUser | null>(initialUser)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const supabase = createClient()

    async function fetchUser(userId: string, email?: string) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('id, name, email')
        .eq('id', userId)
        .single()

      const { data: userRolesData } = await supabase
        .from('user_roles')
        .select('role_id')
        .eq('user_id', userId)

      let roleNames: string[] = []
      if (userRolesData && userRolesData.length > 0) {
        const roleIds = userRolesData.map((r) => r.role_id)
        const { data: rolesData } = await supabase
          .from('roles')
          .select('name')
          .in('id', roleIds)
        roleNames = rolesData?.map((r) => r.name) || []
      }

      setUser({ id: userId, email, name: profile?.name, roles: roleNames })
    }

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        // Only re-fetch on fresh login, not on page load (INITIAL_SESSION)
        setLoading(true)
        await fetchUser(session.user.id, session.user.email)
        setLoading(false)
      } else if (event === 'SIGNED_OUT') {
        setUser(null)
      }
      // INITIAL_SESSION → keep server-side initialUser as-is
    })

    return () => { subscription.unsubscribe() }
  }, [])

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
