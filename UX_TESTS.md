# Guía de Pruebas UX - ResiControl

## Dispositivos de Prueba

| Dispositivo | Sistema | Navegador | Prioridad |
|--------------|---------|-----------|-----------|
| iPhone 14/15 | iOS 17+ | Safari | Alta |
| Samsung Galaxy S23/S24 | Android 14 | Chrome | Alta |
| iPad Pro 11" | iPadOS 17 | Safari | Media |
| Tablet Samsung | Android 14 | Chrome | Media |
| MacBook Pro | macOS | Chrome/Safari | Alta |
| Windows PC | Windows 11 | Chrome/Edge | Alta |

---

## Casos de Prueba por Módulo

### 🔐 Módulo: Autenticación

| ID | Caso | Pasos | Esperado |
|----|------|-------|----------|
| AUTH-01 | Login válido | 1. Ingresar email y contraseña válidos 2. Tocar "Ingresar" | Redirecciona al dashboard |
| AUTH-02 | Login inválido | 1. Ingresar credenciales incorrectas 2. Tocar "Ingresar" | Muestra mensaje de error |
| AUTH-03 | Persistencia | 1. Login 2. Cerrar navegador 3. Abrir снова | Sesión activa |
| AUTH-04 | Logout | 1. Tocar "Cerrar sesión" | Sale al login |

### 📦 Módulo: Registro de Paquete

| ID | Caso | Pasos | Esperado |
|----|------|-------|----------|
| REG-01 | Registro completo | 1. Torre, Apto, Tel, foto 2. Registrar | Paquete en lista |
| REG-02 | Registro mínimo | 1. Solo Torre y Apto 2. Registrar | Paquete registrado |
| REG-03 | Sin campos | 1. Tocar registrar | Error de validación |
| REG-04 | Foto cámara | 1. Agregar foto 2. Tomar foto | Preview visible |
| REG-05 | Quitar foto | 1. Agregar foto 2. Tocar X | Foto eliminada |
| REG-06 | Notificación | 1. Registrar con teléfono | Mensaje "Notificación enviada" |

### 📤 Módulo: Entrega de Paquete

| ID | Caso | Pasos | Esperado |
|----|------|-------|----------|
| ENT-01 | Ver pendientes | 1. Ir a Entregar | Lista de paquetes |
| ENT-02 | Filtrar | 1. Buscar "101" | Solo apartamentos 101 |
| ENT-03 | Entregar completo | 1. Tocar "Entregar" 2. Ingresa receptor 3. Confirmar | Paquete marcado |
| ENT-04 | Sin receptor | 1. Tocar "Entregar" 2. Sin nombre 3. Confirmar | Error de validación |
| ENT-05 | Cancelar | 1. Tocar "Entregar" 2. Cancelar | Vuelve a lista |

### ⚙️ Módulo: Panel Admin

| ID | Caso | Pasos | Esperado |
|----|------|-------|----------|
| ADMIN-01 | Stats | 1. Abrir panel | Estadísticas visibles |
| ADMIN-02 | Filtro torre | 1. Filtrar por torre A | Solo torre A |
| ADMIN-03 | Filtro estado | 1. Filtrar "registrado" | Solo pendientes |
| ADMIN-04 | Paquetes viejos | 1. Activar filtro perdidos | Paquetes >7 días |
| ADMIN-05 | Export CSV | 1. Tocar "CSV" | Descarga archivo |
| ADMIN-06 | Export Excel | 1. Tocar "Excel" | Descarga .xls |

### 🏠 Módulo: Panel Residente

| ID | Caso | Pasos | Esperado |
|----|------|-------|----------|
| RES-01 | Sin login | 1. Abrir sin login | Panel accesible |
| RES-02 | Buscar teléfono | 1. Ingresar teléfono 2. Buscar | Muestra paquetes |
| RES-03 | Buscar apartamento | 1. Ingresar apartamento 2. Buscar | Muestra paquetes |
| RES-04 | Ver foto | 1. Paquete con foto | Foto visible |
| RES-05 | Ver estado | 1. Paquete交付 | Muestra "Entregado" |

---

## Checklist de Usabilidad

### Diseño Visual
- [ ] Botones mínimo 44x44px (táctil)
- [ ] Texto legible sin zoom (16px mínimo)
- [ ] Contraste adecuado (WCAG AA)
- [ ] Iconos claros y entendibles

### Navegación
- [ ] Flujo lógico de izquierda a derecha
- [ ] Botón atrás disponible
- [ ] No más de 3 taps para cualquier acción
- [ ] Títulos claros en cada pantalla

### Interacción
- [ ] Loading states visibles (>200ms)
- [ ] Feedback en acciones (toast, vibrate)
- [ ] Sin errores en consola
- [ ] Formularios con labels claros

### Rendimiento
- [ ] Carga inicial <3 segundos
- [ ] Transiciones suaves (60fps)
- [ ] Sin freeze en listas grandes

---

## Errores Comunes a Verificar

1. **Error de red**: Mostrar mensaje claro
2. **Timeout**: Opportunity de reintentar
3. **Formulario inválido**: Resaltar campo incorrecto
4. **Sesión expirada**: Redireccionar a login
5. **Foto grande**: Comprimir antes de subir

---

## Firma de Pruebas

| Prueba | Probador | Fecha | Firma |
|--------|----------|-------|-------|
| Móvil iOS | | | |
| Móvil Android | | | |
| Tablet | | | |
| Desktop | | | |

---

*Versión 1.0 - ResiControl*
