'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { 
  BookOpen, 
  Globe, 
  Star, 
  History, 
  Settings,
  User
} from 'lucide-react'

const navigation = [
  { name: 'Мои рецепты', href: '/dashboard', icon: BookOpen },
  { name: 'Публичные', href: '/dashboard/public', icon: Globe },
  { name: 'Избранное', href: '/dashboard/favorites', icon: Star },
  { name: 'История', href: '/dashboard/history', icon: History },
  { name: 'Настройки', href: '/dashboard/settings', icon: Settings },
]

interface DashboardSidebarProps {
  user?: {
    name?: string | null
    email?: string | null
    image?: string | null
  } | null
}

export function DashboardSidebar({ user }: DashboardSidebarProps) {
  const pathname = usePathname()

  return (
    <div className="flex h-full w-64 flex-col border-r bg-card">
      <div className="flex h-16 items-center border-b px-6">
        <h2 className="text-lg font-semibold">Recipes</h2>
      </div>
      <nav className="flex-1 space-y-1 px-3 py-4">
        {navigation.map((item) => {
          const isActive = pathname === item.href || 
            (item.href !== '/dashboard' && pathname.startsWith(item.href))
          const Icon = item.icon
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
              )}
            >
              <Icon className="h-5 w-5" />
              {item.name}
            </Link>
          )
        })}
      </nav>
      <div className="border-t p-4">
        <div className="flex items-center gap-3">
          {user?.image ? (
            <img 
              src={user.image} 
              alt={user.name || 'Пользователь'} 
              className="h-8 w-8 rounded-full"
            />
          ) : (
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
              <User className="h-4 w-4" />
            </div>
          )}
          <div className="flex-1 overflow-hidden">
            <p className="truncate text-sm font-medium">{user?.name || 'Пользователь'}</p>
            <p className="truncate text-xs text-muted-foreground">{user?.email || 'user@example.com'}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
