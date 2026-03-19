---
tarea: Autenticación Portero (Guard Login)
orden: 02
objetivo: Implementar el sistema de login para portero usando ID/código.
alcance:
  - Login con ID/código guard.
  - Visualización del nombre en UI.
  - Persistencia básica de sesión.
ejecucion:
  - Usar Supabase Auth para gestión de usuarios o tabla de guards.
  - Implementar interfaz de login.
  - Validar autenticación, mostrar nombre, y persistencia mínima.
  - Documentar casos de éxito/fallo.
---

### Estado actual
- Supabase Auth habilitado: usuarios guardas creados manualmente en Authentication → Users.
- Cada usuario porta email único y contraseña, vinculado a registro correspondiente en tabla guards por email.

### Plan
1. Crear UI de login (input: email/código y contraseña).
2. Al hacer login, obtener session y buscar datos en tabla guards (por email).
3. Mostrar nombre guardia en UI.
4. Mantener sesión con mecanismo nativo/localStorage.

### Checklist
- [x] Activar Auth en Supabase (usuarios guardas).
- [x] Asociar guardias a usuarios.
- [ ] Crear UI de login.
- [ ] Mostrar nombre/bienvenida.
- [ ] Validar persistencia de sesión.
- [ ] Documentar casos de prueba.

### Observaciones
- La creación de usuarios guardias en Auth es manual por ahora. Se puede automatizar vía UI o script para onboarding futuro.
- El email es el identificador recomendado, pero puedes usar código si lo prefieres.
