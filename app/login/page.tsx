'use client'

import { useActionState } from 'react'
import { login } from './actions'

const initialState = {
  error: ''
}

export default function LoginPage() {
  const [state, formAction, isPending] = useActionState(login, initialState)

  return (
    <div className="flex items-center justify-center min-h-screen" style={{ background: 'var(--bg-tertiary)' }}>
      <div className="glass-card w-full" style={{ maxWidth: '400px' }}>
        <div className="text-center mb-4">
          <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem', color: 'var(--accent-primary)' }}>TransitOps</h1>
          <p className="text-secondary">Sign in to your account</p>
        </div>

        <form action={formAction} className="flex-col gap-4">
          <div className="input-group">
            <label className="input-label" htmlFor="email">Email</label>
            <input 
              className="input-field" 
              type="email" 
              id="email" 
              name="email" 
              placeholder="manager@transitops.com"
              required 
            />
          </div>

          <div className="input-group">
            <label className="input-label" htmlFor="password">Password</label>
            <input 
              className="input-field" 
              type="password" 
              id="password" 
              name="password" 
              placeholder="••••••••"
              required 
            />
          </div>

          {state?.error && (
            <div className="badge badge-danger w-full justify-center mb-4 p-2" style={{ borderRadius: '8px' }}>
              {state.error}
            </div>
          )}

          <button 
            type="submit" 
            className="btn btn-primary w-full mt-4" 
            disabled={isPending}
          >
            {isPending ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div className="text-center mt-4" style={{ fontSize: '0.875rem' }}>
          <p className="text-secondary">
            <strong>Hackathon Tip:</strong> Use <br/>
            <code>manager@...</code>, <code>driver@...</code>, <br/>
            <code>safety@...</code>, <code>finance@...</code> <br/>
            to auto-create an account with that role.
          </p>
        </div>
      </div>
    </div>
  )
}
