'use client'

import { useActionState, useState } from 'react'
import { login, register } from './actions'

const initialState = {
  error: ''
}

export default function LoginPage() {
  const [isRegistering, setIsRegistering] = useState(false)
  const [state, formAction, isPending] = useActionState(isRegistering ? register : login, initialState)

  return (
    <div className="flex items-center justify-center min-h-screen" style={{ background: 'var(--bg-tertiary)' }}>
      <div className="glass-card w-full" style={{ maxWidth: '400px' }}>
        <div className="text-center mb-6">
          <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem', color: 'var(--accent-primary)' }}>TransitOps</h1>
          <p className="text-secondary">{isRegistering ? 'Create a new account' : 'Sign in to your account'}</p>
        </div>

        <form action={formAction} className="flex-col gap-4">
          <div className="input-group">
            <label className="input-label" htmlFor="email">Email</label>
            <input 
              className="input-field" 
              type="email" 
              id="email" 
              name="email" 
              placeholder="user@transitops.com"
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

          {isRegistering && (
            <div className="input-group">
              <label className="input-label" htmlFor="role">Role</label>
              <select className="input-field" id="role" name="role" required>
                <option value="">Select Role</option>
                <option value="Fleet Manager">Fleet Manager</option>
                <option value="Driver">Driver</option>
                <option value="Safety Officer">Safety Officer</option>
                <option value="Financial Analyst">Financial Analyst</option>
              </select>
            </div>
          )}

          {state?.error && (
            <div className="badge badge-danger w-full justify-center mb-2 p-2" style={{ borderRadius: '8px' }}>
              {state.error}
            </div>
          )}

          <button 
            type="submit" 
            className="btn btn-primary w-full mt-2" 
            disabled={isPending}
          >
            {isPending ? (isRegistering ? 'Creating Account...' : 'Signing in...') : (isRegistering ? 'Create Account' : 'Sign In')}
          </button>
        </form>

        <div className="text-center mt-6" style={{ fontSize: '0.875rem' }}>
          <p className="text-secondary">
            {isRegistering ? 'Already have an account?' : "Don't have an account?"}
            <button 
              type="button"
              onClick={() => setIsRegistering(!isRegistering)}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--accent-primary)',
                fontWeight: 600,
                cursor: 'pointer',
                marginLeft: '0.5rem',
                textDecoration: 'underline'
              }}
            >
              {isRegistering ? 'Sign In' : 'Create an account'}
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}
