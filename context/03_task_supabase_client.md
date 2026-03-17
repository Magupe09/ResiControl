# Task 03 — Supabase Client & CRUD Functions

## Context
Create the Supabase client singleton and all database functions needed by the app.
This file is the **only place** in the project that talks to Supabase.
All components import from this file — never from `@supabase/supabase-js` directly.

## Prerequisites
- Task 01 completed (Vite project initialized)
- Task 02 completed (Supabase table created + `.env` populated)

## What you must do

### Create `/Users/magupe/Documents/proyects/ResiControl/src/supabase.js`

Write this file exactly:

```js
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// ─── CRUD FUNCTIONS ───────────────────────────────────────────────────────────

/**
 * Register a new package.
 * @param {string} tower  - e.g. "Torre 1"
 * @param {string} apartment - e.g. "301"
 * @returns {Promise<{data, error}>}
 */
export async function insertPackage(tower, apartment) {
  const { data, error } = await supabase
    .from('packages')
    .insert([{ tower, apartment, status: 'pending' }])
    .select()
  return { data, error }
}

/**
 * Fetch all packages (newest first).
 * @returns {Promise<{data, error}>}
 */
export async function getPackages() {
  const { data, error } = await supabase
    .from('packages')
    .select('*')
    .order('created_at', { ascending: false })
  return { data, error }
}

/**
 * Mark a package as delivered.
 * @param {string} id - UUID of the package
 * @returns {Promise<{data, error}>}
 */
export async function markDelivered(id) {
  const { data, error } = await supabase
    .from('packages')
    .update({ status: 'delivered' })
    .eq('id', id)
    .select()
  return { data, error }
}
```

## Rules for this file
- DO NOT add any React code here
- DO NOT add authentication (MVP is open)
- DO NOT add any other tables or queries
- Keep functions small and single-purpose
- Always return `{ data, error }` so callers can handle errors

## Success Criteria
- [ ] File exists at `src/supabase.js`
- [ ] Supabase client uses `import.meta.env` (Vite env vars)
- [ ] Three exported functions: `insertPackage`, `getPackages`, `markDelivered`
- [ ] No React imports in this file

## Files created in this task
- `src/supabase.js` (new file)
