'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  LayoutDashboard, 
  Truck, 
  Users, 
  Route, 
  Wrench, 
  Receipt, 
  BarChart3, 
  LogOut 
} from 'lucide-react'
import { logoutAction } from '@/app/actions'

interface SidebarProps {
  userRole: string
}

export default function Sidebar({ userRole }: SidebarProps) {
  const pathname = usePathname()

  const allNavItems = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard, roles: ['Fleet Manager', 'Driver', 'Safety Officer', 'Financial Analyst'] },
    { name: 'Vehicles', href: '/vehicles', icon: Truck, roles: ['Fleet Manager', 'Driver'] },
    { name: 'Drivers', href: '/drivers', icon: Users, roles: ['Fleet Manager', 'Driver', 'Safety Officer'] },
    { name: 'Trips', href: '/trips', icon: Route, roles: ['Fleet Manager', 'Driver'] },
    { name: 'Maintenance', href: '/maintenance', icon: Wrench, roles: ['Fleet Manager', 'Financial Analyst'] },
    { name: 'Expenses', href: '/expenses', icon: Receipt, roles: ['Fleet Manager', 'Financial Analyst'] },
    { name: 'Reports', href: '/reports', icon: BarChart3, roles: ['Fleet Manager', 'Financial Analyst'] },
  ]

  const navItems = allNavItems.filter(item => item.roles.includes(userRole))

  return (
    <aside style={{ 
      width: '260px', 
      background: 'var(--bg-secondary)', 
      borderRight: '1px solid var(--border-color)',
      height: '100vh',
      display: 'flex',
      flexDirection: 'column'
    }}>
      <div style={{ padding: '1.5rem' }}>
        <h2 style={{ color: 'var(--accent-primary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Truck /> TransitOps
        </h2>
        <div style={{ marginTop: '0.5rem', fontSize: '0.8rem' }} className="badge badge-neutral">
          {userRole}
        </div>
      </div>

      <nav style={{ flex: 1, padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname.startsWith(item.href)
          
          return (
            <Link 
              key={item.name} 
              href={item.href}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '0.75rem 1rem',
                borderRadius: '8px',
                background: isActive ? 'var(--bg-tertiary)' : 'transparent',
                color: isActive ? 'var(--accent-primary)' : 'var(--text-secondary)',
                fontWeight: isActive ? 600 : 500,
                transition: 'var(--transition)'
              }}
              onMouseEnter={(e) => {
                if (!isActive) {
                  e.currentTarget.style.background = 'var(--bg-tertiary)'
                  e.currentTarget.style.color = 'var(--text-primary)'
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  e.currentTarget.style.background = 'transparent'
                  e.currentTarget.style.color = 'var(--text-secondary)'
                }
              }}
            >
              <Icon size={20} />
              {item.name}
            </Link>
          )
        })}
      </nav>

      <div style={{ padding: '1.5rem', borderTop: '1px solid var(--border-color)' }}>
        <button 
          onClick={() => logoutAction()}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            width: '100%',
            padding: '0.75rem 1rem',
            background: 'transparent',
            border: 'none',
            color: 'var(--text-secondary)',
            fontWeight: 500,
            cursor: 'pointer',
            textAlign: 'left',
            borderRadius: '8px',
            transition: 'var(--transition)'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)'
            e.currentTarget.style.color = 'var(--danger)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'transparent'
            e.currentTarget.style.color = 'var(--text-secondary)'
          }}
        >
          <LogOut size={20} />
          Logout
        </button>
      </div>
    </aside>
  )
}
