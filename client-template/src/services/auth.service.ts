import { createClient } from '@/lib/supabase/server'
import type { AuthUser } from '@/lib/types'

export async function getAuthUser(): Promise<AuthUser | null> {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return null

  // Fetch roles via two separate queries to avoid RLS join issues
  const { data: userRolesData } = await supabase
    .from('user_roles')
    .select('role_id')
    .eq('user_id', user.id)

  let roleNames: string[] = []
  if (userRolesData && userRolesData.length > 0) {
    const roleIds = userRolesData.map((r) => r.role_id)
    const { data: rolesData } = await supabase
      .from('roles')
      .select('name')
      .in('id', roleIds)
    roleNames = rolesData?.map((r) => r.name) || []
  }

  // Fetch profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('name')
    .eq('id', user.id)
    .single()

  return {
    id: user.id,
    email: user.email,
    name: profile?.name,
    roles: roleNames,
  }
}
