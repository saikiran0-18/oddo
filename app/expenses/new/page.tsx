'use client'

import { useActionState } from 'react'
import { createExpense } from '../actions'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

const initialState = {
  error: ''
}

export default function NewExpensePage() {
  const [state, formAction, isPending] = useActionState(createExpense, initialState)

  return (
    <div className="animate-fade-in" style={{ maxWidth: '600px', margin: '0 auto' }}>
      <div className="flex items-center gap-4 mb-6">
        <Link href="/expenses" className="btn btn-secondary" style={{ padding: '0.5rem' }}>
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1>Add General Expense</h1>
          <p className="text-secondary">Record a new toll, tax, or other operational expense.</p>
        </div>
      </div>

      <div className="glass-card">
        <form action={formAction} className="flex-col gap-4">
          <div className="input-group">
            <label className="input-label" htmlFor="category">Expense Category</label>
            <select className="input-field" id="category" name="category" required>
              <option value="">Select Category</option>
              <option value="Tolls">Tolls</option>
              <option value="Taxes">Taxes</option>
              <option value="Permits">Permits</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div className="input-group">
            <label className="input-label" htmlFor="description">Description</label>
            <input className="input-field" type="text" id="description" name="description" placeholder="e.g. Highway 5 Toll" required />
          </div>

          <div className="input-group w-full">
            <label className="input-label" htmlFor="amount">Amount ($)</label>
            <input className="input-field" type="number" id="amount" name="amount" placeholder="25" required min="0" step="0.01" />
          </div>

          {state?.error && (
            <div className="badge badge-danger w-full justify-center p-2 mb-2" style={{ borderRadius: '8px' }}>
              {state.error}
            </div>
          )}

          <div className="flex justify-end gap-4 mt-4">
            <Link href="/expenses" className="btn btn-secondary">Cancel</Link>
            <button type="submit" className="btn btn-primary" disabled={isPending}>
              {isPending ? 'Saving...' : 'Save Expense'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
