# 📦 ResiControl

**Gestión de correspondencia para conjuntos residenciales en Colombia.**

> Simplifica el registro, seguimiento y entrega de paquetes en tu conjunto residencial. Diseñado para guardas de seguridad que necesitan rapidez y simplicidad.

---

## 🚀 ¿Qué problema resuelve?

En Colombia, especialmente en Bogotá, los conjuntos residenciales manejan decenas de paquetes al día. Los guardas de seguridad los registran en **cuadernos físicos**, lo que genera:

| Problema | Impacto |
|----------|---------|
| ❌ Registros manuales con errores | Paquetes perdidos o mal asignados |
| ❌ Difícil búsqueda de paquetes | Residentes molestos esperando |
| ❌ Sin notificaciones | El residente no sabe que su paquete llegó |
| ❌ Estrés operativo | El guarda pierde tiempo buscando en cuadernos |

**ResiControl** digitaliza este proceso con una app simple, rápida y sin curva de aprendizaje.

---

## ✨ Funcionalidades (MVP)

- 📋 **Registro rápido de paquetes** — Torre + Apartamento en menos de 5 segundos
- 📦 **Lista de paquetes pendientes** — Vista clara de qué falta por entregar
- ✅ **Marcar como entregado** — Un solo toque para actualizar el estado
- 📱 **Mobile-first** — Optimizado para el celular del guarda

---

## 🏗️ Stack Tecnológico

| Capa | Tecnología |
|------|-----------|
| **Frontend** | React + Vite (JavaScript) |
| **Backend** | Supabase (PostgreSQL + REST API) |
| **Estilos** | Vanilla CSS |
| **Hosting** | — *(por definir)* |

---

## 📐 Modelo de Datos

### Tabla: `packages`

| Columna | Tipo | Descripción |
|---------|------|-------------|
| `id` | `UUID` | Identificador único (auto-generado) |
| `tower` | `TEXT` | Torre del conjunto (ej: "Torre 1", "Torre A") |
| `apartment` | `TEXT` | Número de apartamento (ej: "101", "302B") |
| `status` | `TEXT` | `'pending'` o `'delivered'` |
| `created_at` | `TIMESTAMPTZ` | Fecha y hora de registro |

---

## 🧑‍💻 Instalación

### Prerrequisitos

- [Node.js](https://nodejs.org/) v18+
- Cuenta en [Supabase](https://supabase.com/) (free tier)

### 1. Clonar el repositorio

```bash
git clone https://github.com/Magupe09/ResiControl.git
cd ResiControl
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Configurar variables de entorno

Crea un archivo `.env` en la raíz del proyecto:

```env
VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
VITE_SUPABASE_ANON_KEY=tu-anon-key-aqui
```

> 💡 Obtén estos valores en **Supabase Dashboard → Settings → API**

### 4. Crear la tabla en Supabase

Ve al **SQL Editor** en Supabase y ejecuta:

```sql
CREATE TABLE packages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  tower TEXT NOT NULL,
  apartment TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE packages
  ADD CONSTRAINT packages_status_check
  CHECK (status IN ('pending', 'delivered'));

ALTER TABLE packages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all for MVP"
  ON packages FOR ALL
  USING (true) WITH CHECK (true);
```

### 5. Iniciar el servidor de desarrollo

```bash
npm run dev
```

Abre [http://localhost:5173](http://localhost:5173) en tu navegador.

---

## 📂 Estructura del Proyecto

```
ResiControl/
├── context/                   # Documentación de tareas y planificación
├── public/
├── src/
│   ├── components/
│   │   ├── PackageForm.jsx    # Formulario de registro
│   │   ├── PackageList.jsx    # Lista de paquetes
│   │   └── PackageCard.jsx    # Tarjeta individual
│   ├── supabase.js            # Cliente Supabase + funciones CRUD
│   ├── App.jsx                # Layout principal
│   ├── App.css                # Estilos de componentes
│   ├── index.css              # Reset y estilos globales
│   └── main.jsx               # Entry point
├── .env                       # Variables de entorno (no se sube al repo)
├── index.html
├── package.json
└── vite.config.js
```

---

## 🎯 Roadmap

### MVP (v1) — *En desarrollo*
- [x] Planificación y arquitectura
- [ ] Setup del proyecto (Vite + React)
- [ ] Integración con Supabase
- [ ] Registro de paquetes
- [ ] Lista de paquetes pendientes
- [ ] Marcar como entregado
- [ ] Estilos mobile-first

### v2 — *Futuro*
- [ ] Notificaciones al residente (WhatsApp / Email)
- [ ] Login para guardas y administradores
- [ ] Dashboard de analítica para el administrador
- [ ] Historial de paquetes con búsqueda
- [ ] Soporte multi-conjunto

---

## 👥 Usuarios

| Rol | Descripción | Disponible |
|-----|------------|------------|
| 🛡️ **Guarda** | Registra y entrega paquetes | ✅ MVP |
| 👤 **Residente** | Recibe notificaciones | 🔜 v2 |
| 🏢 **Administrador** | Gestiona el conjunto, paga el servicio | 🔜 v2 |

---

## 🤝 Contribuir

Este proyecto está en fase temprana. Si quieres contribuir:

1. Haz fork del repositorio
2. Crea una rama (`git checkout -b feature/mi-feature`)
3. Haz commit (`git commit -m 'Add: mi feature'`)
4. Push a la rama (`git push origin feature/mi-feature`)
5. Abre un Pull Request

---

## 📄 Licencia

MIT © 2026 — [Magupe09](https://github.com/Magupe09)

---

<p align="center">
  Hecho con ❤️ para los conjuntos residenciales de Colombia 🇨🇴
</p>
