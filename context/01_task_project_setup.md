# Task 01 — Project Setup (Vite + React)

## Context
This is the first task. The project directory `/Users/magupe/Documents/proyects/ResiControl` exists but is empty.
You must initialize a Vite + React project (JavaScript, NOT TypeScript) and install the required dependencies.

## What you must do

### Step 1: Initialize Vite project
Run in the project root (`/Users/magupe/Documents/proyects/ResiControl`):

```bash
npm create vite@latest . -- --template react
```

When prompted, select **React** and **JavaScript** (not TypeScript).
If the CLI asks about overwriting files, confirm with `y`.

### Step 2: Install base dependencies
```bash
npm install
```

### Step 3: Install project-specific dependencies
```bash
npm install @supabase/supabase-js
```

> Do NOT install react-router-dom. The MVP is a single page, no routing needed.

### Step 4: Create the `.env` file
Create `/Users/magupe/Documents/proyects/ResiControl/.env` with this content:

```env
VITE_SUPABASE_URL=YOUR_SUPABASE_URL_HERE
VITE_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY_HERE
```

> These values will be filled by the user later. Leave as placeholders.

### Step 5: Create components folder
```bash
mkdir -p src/components
```

### Step 6: Clean up Vite boilerplate
- Delete `src/assets/react.svg`
- Delete `public/vite.svg`
- Empty `src/App.css` (keep the file, just clear its contents)
- Replace `src/index.css` with an empty file (styles will be added in Task 08)
- Replace `src/App.jsx` with this minimal placeholder:

```jsx
function App() {
  return (
    <div>
      <h1>ResiControl</h1>
      <p>App en construcción...</p>
    </div>
  )
}

export default App
```

## Success Criteria
- [ ] Running `npm run dev` starts the server without errors
- [ ] Browser shows "ResiControl - App en construcción..."
- [ ] `src/components/` folder exists
- [ ] `.env` file exists with placeholder values
- [ ] No TypeScript files exist

## Files created/modified in this task
- `package.json` (created by Vite)
- `vite.config.js` (created by Vite)
- `index.html` (created by Vite)
- `src/App.jsx` (replaced with placeholder)
- `src/main.jsx` (created by Vite, keep as-is)
- `src/index.css` (emptied)
- `src/App.css` (emptied)
- `.env` (created)
- `src/components/` (folder created)
