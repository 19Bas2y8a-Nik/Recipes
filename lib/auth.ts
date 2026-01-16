import { auth } from '@/lib/auth-config'

export async function getCurrentUser() {
  const session = await auth()
  return session?.user
}

export async function getCurrentUserId() {
  const session = await auth()
  return session?.user?.id as string | undefined
}
