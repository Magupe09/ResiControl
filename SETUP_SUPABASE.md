# Configuración de Apartamentos en Supabase

Este archivo contiene los pasos para crear la tabla `apartamentos` y configurar las políticas de seguridad (RLS).

## Paso 1: Crear la tabla (si no existe)

En el **SQL Editor** de Supabase, ejecutar:

```sql
CREATE TABLE IF NOT EXISTS apartamentos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  torre TEXT NOT NULL,
  apartamento TEXT NOT NULL,
  telefono TEXT,
  conjunto_id TEXT DEFAULT 'Conjunto Residencial Mirador',
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

## Paso 2: Insertar datos de prueba (50 apartamentos)

```sql
INSERT INTO apartamentos (torre, apartamento, telefono) VALUES
('Torre 1', '101', '3015347481'),('Torre 1', '102', '3015347481'),
('Torre 1', '103', '3015347481'),('Torre 1', '104', '3015347481'),
('Torre 1', '105', '3015347481'),('Torre 1', '106', '3015347481'),
('Torre 1', '107', '3015347481'),('Torre 1', '108', '3015347481'),
('Torre 1', '109', '3015347481'),('Torre 1', '110', '3015347481'),
('Torre 2', '201', '3015347481'),('Torre 2', '202', '3015347481'),
('Torre 2', '203', '3015347481'),('Torre 2', '204', '3015347481'),
('Torre 2', '205', '3015347481'),('Torre 2', '206', '3015347481'),
('Torre 2', '207', '3015347481'),('Torre 2', '208', '3015347481'),
('Torre 2', '209', '3015347481'),('Torre 2', '210', '3015347481'),
('Torre 3', '301', '3015347481'),('Torre 3', '302', '3015347481'),
('Torre 3', '303', '3015347481'),('Torre 3', '304', '3015347481'),
('Torre 3', '305', '3015347481'),('Torre 3', '306', '3015347481'),
('Torre 3', '307', '3015347481'),('Torre 3', '308', '3015347481'),
('Torre 3', '309', '3015347481'),('Torre 3', '310', '3015347481'),
('Torre 4', '401', '3015347481'),('Torre 4', '402', '3015347481'),
('Torre 4', '403', '3015347481'),('Torre 4', '404', '3015347481'),
('Torre 4', '405', '3015347481'),('Torre 4', '406', '3015347481'),
('Torre 4', '407', '3015347481'),('Torre 4', '408', '3015347481'),
('Torre 4', '409', '3015347481'),('Torre 4', '410', '3015347481'),
('Torre 5', '501', '3015347481'),('Torre 5', '502', '3015347481'),
('Torre 5', '503', '3015347481'),('Torre 5', '504', '3015347481'),
('Torre 5', '505', '3015347481'),('Torre 5', '506', '3015347481'),
('Torre 5', '507', '3015347481'),('Torre 5', '508', '3015347481'),
('Torre 5', '509', '3015347481'),('Torre 5', '510', '3015347481');
```

## Paso 3: Configurar políticas de seguridad (RLS)

Ejecutar esto para eliminar políticas existentes y crear nuevas:

```sql
-- Eliminar políticas existentes
DROP POLICY IF EXISTS "allow_read" ON apartamentos;
DROP POLICY IF EXISTS "allow_insert" ON apartamentos;
DROP POLICY IF EXISTS "allow_update" ON apartamentos;
DROP POLICY IF EXISTS "allow_delete" ON apartamentos;

-- Crear política de lectura para todos
CREATE POLICY "allow_read" ON apartamentos
  FOR SELECT USING (true);

-- Crear políticas de escritura solo para autenticados
CREATE POLICY "allow_insert" ON apartamentos
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "allow_update" ON apartamentos
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "allow_delete" ON apartamentos
  FOR ALL USING (auth.role() = 'authenticated');
```

## Paso 4: Verificar

1. Ir a **Table Editor** en Supabase
2. Verificar que existe la tabla `apartamentos` con 50 registros
3. Refrescar la app en Vercel

---

## Notas

- Los datos de prueba usan el teléfono: 3015347481
- El conjunto se llama: "Conjunto Residencial Mirador"
- Si quieres agregar más apartamentos, usa el Table Editor o insert adicional