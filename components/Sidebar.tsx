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
      width: '280px', 
      margin: '1.5rem 0 1.5rem 1.5rem',
      borderRadius: '20px',
      background: 'var(--glass-bg)', 
      backdropFilter: 'var(--glass-blur)',
      WebkitBackdropFilter: 'var(--glass-blur)',
      border: '1px solid var(--glass-border)',
      boxShadow: 'var(--shadow-lg)',
      height: 'calc(100vh - 3rem)',
      display: 'flex',
      flexDirection: 'column',
      position: 'relative',
      overflow: 'hidden'
    }}>
      <div style={{ padding: '2rem 1.5rem 1rem' }}>
        <h2 style={{ 
          color: 'transparent', 
          background: 'linear-gradient(to right, var(--accent-primary), var(--accent-secondary))',
          WebkitBackgroundClip: 'text',
          display: 'flex', 
          alignItems: 'center', 
          gap: '0.5rem',
          fontSize: '1.75rem'
        }}>
          <Truck style={{ color: 'var(--accent-primary)' }} /> TransitOps
        </h2>
        <div style={{ marginTop: '0.75rem', fontSize: '0.75rem' }} className="badge badge-neutral">
          {userRole}
        </div>
      </div>

      <nav style={{ flex: 1, padding: '1rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', overflowY: 'auto' }}>
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
                gap: '0.875rem',
                padding: '0.875rem 1.25rem',
                borderRadius: '12px',
                background: isActive ? 'linear-gradient(90deg, rgba(79, 70, 229, 0.1) 0%, transparent 100%)' : 'transparent',
                color: isActive ? 'var(--accent-primary)' : 'var(--text-secondary)',
                fontWeight: isActive ? 600 : 500,
                transition: 'var(--transition)',
                borderLeft: isActive ? '3px solid var(--accent-primary)' : '3px solid transparent',
                transform: isActive ? 'translateX(4px)' : 'translateX(0)'
              }}
              onMouseEnter={(e) => {
                if (!isActive) {
                  e.currentTarget.style.color = 'var(--text-primary)'
                  e.currentTarget.style.transform = 'translateX(4px)'
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  e.currentTarget.style.color = 'var(--text-secondary)'
                  e.currentTarget.style.transform = 'translateX(0)'
                }
              }}
            >
              <Icon size={20} style={{ filter: isActive ? 'drop-shadow(0 0 8px rgba(79,70,229,0.5))' : 'none' }} />
              {item.name}
            </Link>
          )
        })}
      </nav>

      <div style={{ padding: '1.5rem', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
        <button 
          onClick={() => logoutAction()}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            width: '100%',
            padding: '0.875rem 1.25rem',
            background: 'rgba(239, 68, 68, 0.05)',
            border: '1px solid rgba(239, 68, 68, 0.1)',
            color: 'var(--danger)',
            fontWeight: 600,
            cursor: 'pointer',
            textAlign: 'left',
            borderRadius: '12px',
            transition: 'var(--transition)'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(239, 68, 68, 0.15)'
            e.currentTarget.style.boxShadow = '0 4px 12px rgba(239, 68, 68, 0.2)'
            e.currentTarget.style.transform = 'translateY(-2px)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(239, 68, 68, 0.05)'
            e.currentTarget.style.boxShadow = 'none'
            e.currentTarget.style.transform = 'translateY(0)'
          }}
        >
          <LogOut size={20} />
          Logout
        </button>
      </div>
    </aside>
  )
}
