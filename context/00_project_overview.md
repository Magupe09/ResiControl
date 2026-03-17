# ResiControl — Project Overview (Master Context)

## What is this project?
A SaaS MVP for tracking package delivery in residential complexes (conjuntos) in Colombia (Bogotá).
Security guards register packages, associate them to a tower + apartment, and mark them as delivered.

## Problem
Guards currently use physical notebooks:
- Errors in records
- Hard to find packages
- No resident notifications
- Operational stress

## Goal (MVP scope only)
- Register packages quickly (tower + apartment)
- View list of pending packages
- Mark packages as delivered

## Users
- 🛡️ Security guard (main user — low tech experience)
- 👤 Resident (future: receives notifications)
- 🏢 Admin (future: paying customer)

## Stack
- **Frontend**: React + Vite (JavaScript, NO TypeScript)
- **Backend**: Supabase (Postgres + Auth + REST)
- **Styling**: Vanilla CSS (no Tailwind, no component libraries)

## Rules (strictly follow)
- No TypeScript
- No extra libraries (only `@supabase/supabase-js` and `react-router-dom`)
- Components must be small and focused
- UX: large inputs, max 2 steps per action

## Data Model

### Table: `packages`
| Column | Type | Notes |
|--------|------|-------|
| `id` | uuid | Primary key, auto-generated |
| `tower` | text | Required (e.g. "Torre 1", "Torre A") |
| `apartment` | text | Required (e.g. "101", "302B") |
| `status` | text | `'pending'` or `'delivered'` |
| `created_at` | timestamptz | Auto set to now() |

## Project File Structure (target)
```
ResiControl/
├── context/                    ← You are here (planning docs)
│   ├── 00_project_overview.md
│   ├── 01_task_project_setup.md
│   ├── 02_task_supabase_schema.md
│   ├── 03_task_supabase_client.md
│   ├── 04_task_component_package_form.md
│   ├── 05_task_component_package_list.md
│   ├── 06_task_component_package_card.md
│   ├── 07_task_app_assembly.md
│   └── 08_task_styling.md
├── public/
├── src/
│   ├── components/
│   │   ├── PackageForm.jsx
│   │   ├── PackageList.jsx
│   │   └── PackageCard.jsx
│   ├── supabase.js
│   ├── App.jsx
│   ├── App.css
│   └── main.jsx
├── .env
├── index.html
└── package.json
```

## Execution Order
Tasks must be executed in this order (each depends on the previous):

1. `01_task_project_setup.md` → Initialize Vite project
2. `02_task_supabase_schema.md` → Create DB table (manual step in Supabase)
3. `03_task_supabase_client.md` → Create `src/supabase.js`
4. `04_task_component_package_form.md` → Create `PackageForm.jsx`
5. `05_task_component_package_list.md` → Create `PackageList.jsx`
6. `06_task_component_package_card.md` → Create `PackageCard.jsx`
7. `07_task_app_assembly.md` → Wire everything in `App.jsx`
8. `08_task_styling.md` → Apply CSS styles

## Success Criteria for the full MVP
- [ ] Guard can fill tower + apartment and register a package
- [ ] Package list shows all pending packages
- [ ] Guard can mark a package as delivered (card updates visually)
- [ ] App works on mobile (touch-friendly)
- [ ] Dev server runs with `npm run dev` without errors
