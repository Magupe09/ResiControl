---
tarea: Autenticación Portero (Guard Login)
orden: 02
objetivo: Implementar el sistema de login para portero usando email/contraseña.
alcance:
  - Login con email y contraseña.
  - Visualización del nombre en UI.
  - Persistencia de sesión.
ejecucion:
  - Usar Supabase Auth para gestión de usuarios.
  - Implementar interfaz de login.
  - Validar autenticación, mostrar nombre, y persistencia.
---

### Estado: ✅ COMPLETADO

### Implementación

#### 1. Funciones de autenticación (`src/supabase.js`)
Se agregaron funciones para manejar autenticación con Supabase Auth:

- `signIn(email, password)` - Login con email/contraseña
- `signOut()` - Cerrar sesión
- `getSession()` - Verificar sesión activa al cargar la app
- `getGuardByEmail(email)` - Obtener datos del portero desde tabla `guards`

#### 2. Componente Login (`src/components/Login.jsx`)
Nuevo componente que:
- Muestra formulario de login con email/contraseña
- Valida credenciales contra Supabase Auth
- Busca datos del guard en tabla `guards` por email
- Muestra nombre del portero cuando está logueado
- Incluye botón para cerrar sesión
- Verifica sesión existente al cargar (persistencia)

#### 3. Integración en App (`src/App.jsx`)
- Se agregó estado `currentGuard` para rastrear sesión
- Solo muestra formulario de paquetes cuando hay sesión activa
- Pasa `guardId` al formulario para asociar paquetes

#### 4. Fixes adicionales
Se corrigieron nombres de columnas para coincidir con la tabla:
- `status` → `estado` 
- `tower` → `torre`
- `apartment` → `apartamento`
- `pending` → `registrado`
- `delivered` → `entregado`

### Checklist
- [x] Activar Auth en Supabase (usuarios guardas).
- [x] Asociar guardias a usuarios.
- [x] Crear UI de login.
- [x] Mostrar nombre/bienvenida.
- [x] Validar persistencia de sesión.
- [x] Documentar implementación.

### Cómo usar
1. Crear usuario en Supabase Dashboard → Authentication → Users
2. Usar email existente en tabla `guards` (ej: `juan@ejemplo.com`)
3. Establecer contraseña en Supabase Auth
4. Login en la app con esas credenciales

### Archivos modificados
- `src/supabase.js` - Agregadas funciones de auth
- `src/components/Login.jsx` - Nuevo componente
- `src/App.jsx` - Integración de login
- `src/App.css` - Estilos para login
- `src/components/PackageList.jsx` - Fix columnas
- `src/components/PackageCard.jsx` - Fix columnas

### Observaciones
- Las contraseñas se gestionan en Supabase Auth (seguro), NO en tabla `guards`
- La tabla `guards` solo contiene datos públicos del portero
- Sesión persistida automáticamente por Supabase Auth
