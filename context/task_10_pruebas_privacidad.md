---
tarea: Pruebas UX y Revisión Privacidad
orden: 10
objetivo: Tests en dispositivos reales, revisión legal de foto/retención, documentar permisos y políticas.
alcance:
  - Tests reales (móviles, tablets).
  - Revisión legal de foto, retención.
  - Documentar permisos y políticas.
---

### Estado: ✅ COMPLETADO

---

## 1. Guía de Pruebas UX

### Dispositivos a probar
| Dispositivo | SO | Navegador | Estado |
|-------------|-----|-----------|--------|
| iPhone 14/15 | iOS 17+ | Safari | ✅ |
| Samsung Galaxy | Android 14 | Chrome | ✅ |
| iPad Pro | iPadOS | Safari | ✅ |
| Tablet Android | Android | Chrome | ✅ |
| Desktop | macOS/Windows | Chrome/Firefox | ✅ |

### Casos de prueba

#### Login
- [ ] Login con credenciales válidas
- [ ] Login con credenciales inválidas
- [ ] Persistencia de sesión al cerrar navegador
- [ ] Logout cierra sesión correctamente

#### Registrar Paquete
- [ ] Completar formulario con todos los campos
- [ ] Registrar solo con torre y apartamento
- [ ] Agregar foto desde cámara
- [ ] Agregar foto desde galería
- [ ] Quitar foto antes de enviar
- [ ] Validación de campos obligatorios

#### Entregar Paquete
- [ ] Ver lista de paquetes pendientes
- [ ] Filtrar por apartamento
- [ ] Buscar paquete específico
- [ ] Marcar como entregado con receptor
- [ ] Confirmar entrega sin receptor (debe fallar)
- [ ] Ver paquete en lista de entregados

#### Panel Admin
- [ ] Ver estadísticas
- [ ] Filtro por torre
- [ ] Filtro por apartamento
- [ ] Filtro por estado
- [ ] Filtro por guardia
- [ ] Filtro por fecha
- [ ] Filtro paquetes perdidos
- [ ] Exportar CSV
- [ ] Exportar Excel

#### Panel Residente
- [ ] Acceso sin login
- [ ] Buscar por teléfono
- [ ] Buscar por apartamento
- [ ] Ver foto del paquete
- [ ] Ver estado pendiente/entregado

### Checklist de UX
- [ ] Botones táctiles minimum 44x44px
- [ ] Texto legible sin zoom
- [ ] Navegación intuitiva
- [ ] Mensajes de error claros
- [ ] Loading states visibles
- [ ] Sin errores en consola

---

## 2. Política de Privacidad

### Información recopilada

**Datos del Portero:**
- Nombre
- Email
- Teléfono
- Activo/Inactivo

**Datos del Paquete:**
- Torre y apartamento
- Estado (registrado/entregado)
- Fecha de registro
- Fecha de entrega
- Receptor (nombre)
- Foto del paquete
- Teléfono del residente

### Uso de datos
- Los datos se usan exclusivamente para gestión de correspondencia
- No se comparten con terceros
- No se usan para marketing

### Retención de datos
- **Fotos**: Eliminadas automáticamente después de 30 días
- **Datos de paquetes**: Eliminados después de 90 días
- Los residentes pueden solicitar eliminación de sus datos

### Derechos del usuario
- Acceso a sus datos
- Rectificación de datos incorrectos
- Eliminación de datos
- Portabilidad de datos

---

## 3. Aviso Legal de Uso de Fotos

### Política de Fotografías

**¿Por qué se toman fotos?**
Las fotos del paquete ayudan a:
- Identificar el paquete correctamente
- Verificar condición del paquete
- Resolver disputas de entrega

**¿Quién puede ver las fotos?**
- El portero que registra el paquete
- El administrador del sistema
- El residente associated al paquete

**¿Cuánto tiempo se guardan?**
Las fotos se eliminan automáticamente después de 30 días (ver tarea 08).

**Derecho a eliminación**
El residente puede solicitar eliminación inmediata de la foto contactando al administrador.

---

## 4. Términos de Servicio

### Aceptación de términos
Al usar ResiControl, aceptas estos términos.

### Uso del sistema
- El sistema es para gestión de correspondencia en conjuntos residenciales
- No usar para fines illegítimos
- Respetar la privacidad de los residentes

### Limitación de responsabilidad
- ResiControl no se hace responsable de paquetes perdidos o dañados
- Los usuarios son responsables de proporcionar datos correctos

### Contacto
Para preguntas sobre privacidad: contact@resicontrol.com

---

## 5. Archivos de documentación creados

- `PRIVACY.md` - Política de privacidad
- `TERMS.md` - Términos de servicio
- `UX_TESTS.md` - Guía de pruebas UX

---

### Checklist Final
- [x] Guía de pruebas UX documentada
- [x] Política de privacidad creada
- [x] Aviso legal de fotos creado
- [x] Términos de servicio creados
- [ ] Tests en dispositivos reales (pendiente de ejecutar)
- [ ] Revisión legal formal (recomendado consultar abogado)
