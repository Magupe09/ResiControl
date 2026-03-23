---
tarea: Pantalla Portero: Recibir y Entregar
orden: 03
objetivo: UI mobile con botones grandes "Recibir" y "Entregar", nombre del portero, navegación intuitiva.
alcance:
  - Botones grandes "Recibir" y "Entregar".
  - Visualización del nombre del portero.
  - Navegación intuitiva.
---

### Estado: ✅ COMPLETADO

### Implementación

#### 1. GuardDashboard (`src/components/GuardDashboard.jsx`)
Nuevo componente que muestra:
- Saludo con nombre del portero (ej: "Bienvenido, Juan Perez")
- Dos botones de acción grandes y táctiles:
  - **Recibir** 📥 - Registrar nuevo paquete
  - **Entregar** 📤 - Marcar paquete como entregado
- Diseño mobile-friendly optimizado para uso con dedos

#### 2. Navegación en App (`src/App.jsx`)
Se agregó sistema de vistas:
- `view` state para controlar pantalla actual
- `onNavigate` callback para cambiar vista
- Flujo automático:
  - Después de registrar → vuelve al dashboard
  - Después de entregar → vuelve al dashboard

#### 3. Estilos (`src/App.css`)
- `.guard-dashboard` - Contenedor principal
- `.guard-welcome` - Saludo con icono
- `.dashboard-actions` - Contenedor de botones
- `.action-btn` - Botones grandes con estados hover/active

### Flujo de uso
1. Portero hace login
2. Ve dashboard con su nombre y 2 botones grandes
3. Tap en "Recibir" → formulario de registro
4. Tap en "Entregar" → lista de paquetes pendientes

### Archivos creados
- `src/components/GuardDashboard.jsx` - Nuevo componente

### Archivos modificados
- `src/App.jsx` - Sistema de navegación
- `src/App.css` - Estilos del dashboard

### Checklist
- [x] Botones grandes "Recibir" y "Entregar"
- [x] Nombre del portero visible
- [x] Navegación intuitiva
- [x] Diseño mobile-friendly

### Observaciones
- Los botones tienen iconos grandes para fácil identificación
- Estado "active" indica vista actual
- Tras acción vuelve automáticamente al dashboard
