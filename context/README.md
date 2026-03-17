# ResiControl — Context Index

Este folder contiene toda la planificación del proyecto en tareas pequeñas,
diseñadas para ser ejecutadas por un sub-agente o modelo pequeño, una tarea a la vez.

## Cómo usar estos archivos

1. Lee `00_project_overview.md` primero para entender el proyecto
2. Ejecuta las tareas **en orden numérico** (cada una depende de la anterior)
3. Verifica los "Success Criteria" al final de cada tarea antes de avanzar

---

## Índice de Tareas

| Archivo | Sección | Tipo | Duración estimada |
|---------|---------|------|-------------------|
| [00_project_overview.md](./00_project_overview.md) | Contexto global | 📄 Referencia | — |
| [01_task_project_setup.md](./01_task_project_setup.md) | Bootstrap | 🛠️ Comandos | ~5 min |
| [02_task_supabase_schema.md](./02_task_supabase_schema.md) | Base de datos | 👤 Manual | ~10 min |
| [03_task_supabase_client.md](./03_task_supabase_client.md) | Backend | 💻 Código | ~5 min |
| [04_task_component_package_form.md](./04_task_component_package_form.md) | Componente UI | 💻 Código | ~5 min |
| [05_task_component_package_list.md](./05_task_component_package_list.md) | Componente UI | 💻 Código | ~5 min |
| [06_task_component_package_card.md](./06_task_component_package_card.md) | Componente UI | 💻 Código | ~5 min |
| [07_task_app_assembly.md](./07_task_app_assembly.md) | Ensamblaje | 💻 Código | ~5 min |
| [08_task_styling.md](./08_task_styling.md) | Estilos | 💻 CSS | ~10 min |

---

## Dependency Graph

```
01_setup
   └── 02_supabase_schema (manual, user action)
         └── 03_supabase_client
               ├── 04_package_form
               ├── 05_package_list ← needs 06_package_card
               └── 06_package_card
                     └── 07_app_assembly
                           └── 08_styling
```

---

## Instrucciones para el sub-agente

Cuando recibas una tarea de este folder:

1. **Lee el archivo completo** antes de escribir código
2. **Verifica los Prerequisites** – si no están cumplidos, notifica al usuario
3. **Escribe exactamente el código provisto** – no agregar librerías ni cambiar estructura
4. **Verifica los Success Criteria** al final
5. **No hagas más de lo que la tarea pide** – cada tarea es intencional y acotada

### Reglas estrictas
- No usar TypeScript
- No instalar librerías fuera de lo especificado
- No crear archivos que no estén en la tarea
- Si hay duda, preguntar antes de asumir

---

## Stack y dependencias

```json
{
  "dependencies": {
    "@supabase/supabase-js": "^2.x"
  }
}
```

Solo estas dos dependencias en el proyecto (además de las de Vite/React por defecto).

---

## Variables de entorno requeridas

Archivo `.env` en la raíz del proyecto:

```env
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJxxxxxx...
```

> El usuario debe crear el proyecto en Supabase y obtener estos valores (ver Task 02).
