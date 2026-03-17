# Task 08 — Styling (CSS)

## Context
Apply all CSS styles to make the app look clean, mobile-friendly, and easy to use.
Guards use this app on phones and tablets — everything must be large and touch-friendly.
Write styles in `src/App.css` and `src/index.css`.

## Prerequisites
- Task 07 completed (App.jsx assembled with all components)
- All CSS class names used in components must match what's defined here

## CSS Class Reference (from components)

| Class | Used in |
|-------|---------|
| `.app-container` | App.jsx |
| `.app-header` | App.jsx |
| `.app-main` | App.jsx |
| `.package-form` | PackageForm.jsx |
| `.form-group` | PackageForm.jsx |
| `.form-error` | PackageForm.jsx |
| `.btn-primary` | PackageForm.jsx |
| `.package-list` | PackageList.jsx |
| `.list-status` | PackageList.jsx |
| `.list-error` | PackageList.jsx |
| `.package-card` | PackageCard.jsx |
| `.card-pending` | PackageCard.jsx |
| `.card-delivered` | PackageCard.jsx |
| `.card-header` | PackageCard.jsx |
| `.card-badge` | PackageCard.jsx |
| `.card-date` | PackageCard.jsx |
| `.card-body` | PackageCard.jsx |
| `.card-tower` | PackageCard.jsx |
| `.card-apartment` | PackageCard.jsx |
| `.btn-deliver` | PackageCard.jsx |

## What you must do

### Replace `src/index.css` with:

```css
*, *::before, *::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

html {
  font-size: 16px;
}

body {
  font-family: 'Segoe UI', system-ui, sans-serif;
  background: #f0f2f5;
  color: #1a1a2e;
  min-height: 100vh;
}
```

### Replace `src/App.css` with:

```css
/* ── Layout ──────────────────────────────────────── */
.app-container {
  max-width: 640px;
  margin: 0 auto;
  padding: 0 1rem 4rem;
}

.app-header {
  background: #1a1a2e;
  color: #ffffff;
  padding: 1.5rem 1rem;
  text-align: center;
  margin-bottom: 1.5rem;
  border-radius: 0 0 1rem 1rem;
}

.app-header h1 {
  font-size: 1.75rem;
  font-weight: 700;
  letter-spacing: -0.5px;
}

.app-header p {
  font-size: 0.9rem;
  opacity: 0.7;
  margin-top: 0.25rem;
}

.app-main {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

/* ── Form ────────────────────────────────────────── */
.package-form {
  background: #ffffff;
  border-radius: 1rem;
  padding: 1.5rem;
  box-shadow: 0 2px 12px rgba(0,0,0,0.08);
}

.package-form h2 {
  font-size: 1.2rem;
  margin-bottom: 1.25rem;
  color: #1a1a2e;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  margin-bottom: 1rem;
}

.form-group label {
  font-weight: 600;
  font-size: 0.95rem;
  color: #444;
}

.form-group input {
  padding: 0.85rem 1rem;
  border: 2px solid #e0e0e0;
  border-radius: 0.6rem;
  font-size: 1.1rem;
  transition: border-color 0.2s;
  outline: none;
}

.form-group input:focus {
  border-color: #4f46e5;
}

.form-group input:disabled {
  background: #f5f5f5;
  cursor: not-allowed;
}

.form-error {
  color: #d32f2f;
  font-size: 0.9rem;
  margin-bottom: 0.75rem;
  padding: 0.5rem 0.75rem;
  background: #fdecea;
  border-radius: 0.4rem;
}

.btn-primary {
  width: 100%;
  padding: 1rem;
  background: #4f46e5;
  color: #ffffff;
  border: none;
  border-radius: 0.6rem;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s, transform 0.1s;
}

.btn-primary:hover:not(:disabled) {
  background: #4338ca;
}

.btn-primary:active:not(:disabled) {
  transform: scale(0.98);
}

.btn-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* ── List ────────────────────────────────────────── */
.package-list h2 {
  font-size: 1.1rem;
  color: #555;
  margin-bottom: 0.75rem;
}

.list-status {
  text-align: center;
  color: #888;
  padding: 1.5rem;
  font-size: 1rem;
}

.list-error {
  color: #d32f2f;
}

/* ── Card ────────────────────────────────────────── */
.package-card {
  background: #ffffff;
  border-radius: 0.75rem;
  padding: 1rem 1.25rem;
  margin-bottom: 0.75rem;
  box-shadow: 0 1px 6px rgba(0,0,0,0.07);
  border-left: 5px solid transparent;
  transition: box-shadow 0.2s;
}

.package-card:hover {
  box-shadow: 0 3px 14px rgba(0,0,0,0.1);
}

.card-pending {
  border-left-color: #f59e0b;
}

.card-delivered {
  border-left-color: #10b981;
  opacity: 0.75;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.6rem;
}

.card-badge {
  font-size: 0.8rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.card-date {
  font-size: 0.78rem;
  color: #999;
}

.card-tower {
  font-size: 1rem;
  font-weight: 600;
  color: #333;
}

.card-apartment {
  font-size: 1.4rem;
  font-weight: 700;
  color: #1a1a2e;
  margin-top: 0.1rem;
}

.btn-deliver {
  width: 100%;
  margin-top: 0.9rem;
  padding: 0.8rem;
  background: #10b981;
  color: #ffffff;
  border: none;
  border-radius: 0.5rem;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s, transform 0.1s;
}

.btn-deliver:hover:not(:disabled) {
  background: #059669;
}

.btn-deliver:active:not(:disabled) {
  transform: scale(0.98);
}

.btn-deliver:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
```

## UX Requirements (verify after applying)
- [ ] Inputs are at least 48px tall (touch-friendly)
- [ ] "Registrar Paquete" button fills full width
- [ ] Pending cards have amber left border
- [ ] Delivered cards have green left border and reduced opacity
- [ ] App is readable on a 375px wide screen (iPhone SE)
- [ ] Font is clean (system font fallback)

## Success Criteria
- [ ] `src/index.css` contains reset + body styles
- [ ] `src/App.css` contains all classes listed in the reference table
- [ ] No inline styles added to component files
- [ ] Visual result matches UX requirements above

## Files modified in this task
- `src/index.css` (rewritten)
- `src/App.css` (rewritten)
