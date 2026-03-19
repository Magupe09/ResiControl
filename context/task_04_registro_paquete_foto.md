---
tarea: Registro de Paquete con Foto
orden: 04
objetivo: Permitir al portero registrar un paquete, incluyendo una foto.
alcance:
  - Formulario con torre, apto y captura de foto.
  - Guardar foto en Supabase Storage (retención 1 mes).
  - Guardar datos en la tabla packages (retención 3 meses).
ejecucion:
  - Implementar input de cámara/foto.
  - Subir foto a Storage, asociar con paquete.
  - Validar retención y acceso del archivo y datos.
  - Documentar cómo acceder y visualizar foto desde historial.
---

Permite registrar un paquete junto a su foto y asegurar que la foto se guarda y es accesible correctamente.