import { useAuth } from '@/components/providers/AuthProvider'

export function useUserRole() {
  const { user, loading } = useAuth()

  const hasRole = (role: string) => {
    if (!user) return false
    return user.roles.includes(role)
  }

  const isAdmin = hasRole('admin')
  const isClient = hasRole('client')

  return {
    roles: user?.roles || [],
    hasRole,
    isAdmin,
    isClient,
    loading,
  }
}
