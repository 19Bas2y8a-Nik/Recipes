import { auth } from '@/app/api/auth/[...nextauth]/route'

export async function getCurrentUser() {
  const session = await auth()
  return session?.user
}

export async function getCurrentUserId() {
  const session = await auth()
  return session?.user?.id as string | undefined
}
