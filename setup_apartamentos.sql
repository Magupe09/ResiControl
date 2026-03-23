-- ============================================
-- CREAR TABLA APARTAMENTOS
-- Ejecutar en Supabase SQL Editor
-- ============================================

-- Crear tabla apartamentos
CREATE TABLE IF NOT EXISTS apartamentos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  torre TEXT NOT NULL,
  apartamento TEXT NOT NULL,
  telefono TEXT,
  conjunto_id TEXT DEFAULT 'Conjunto Residencial Mirador',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Agregar约束 única para evitar duplicados
ALTER TABLE apartamentos ADD CONSTRAINT unique_apartment UNIQUE (torre, apartamento);

-- ============================================
-- INSERTAR 50 APARTAMENTOS (1-50)
-- ============================================

-- Torre 1: Apartamentos 1-10
INSERT INTO apartamentos (torre, apartamento, telefono) VALUES
('Torre 1', '101', '3015347481'),
('Torre 1', '102', '3015347481'),
('Torre 1', '103', '3015347481'),
('Torre 1', '104', '3015347481'),
('Torre 1', '105', '3015347481'),
('Torre 1', '106', '3015347481'),
('Torre 1', '107', '3015347481'),
('Torre 1', '108', '3015347481'),
('Torre 1', '109', '3015347481'),
('Torre 1', '110', '3015347481');

-- Torre 2: Apartamentos 11-20
INSERT INTO apartamentos (torre, apartamento, telefono) VALUES
('Torre 2', '201', '3015347481'),
('Torre 2', '202', '3015347481'),
('Torre 2', '203', '3015347481'),
('Torre 2', '204', '3015347481'),
('Torre 2', '205', '3015347481'),
('Torre 2', '206', '3015347481'),
('Torre 2', '207', '3015347481'),
('Torre 2', '208', '3015347481'),
('Torre 2', '209', '3015347481'),
('Torre 2', '210', '3015347481');

-- Torre 3: Apartamentos 21-30
INSERT INTO apartamentos (torre, apartamento, telefono) VALUES
('Torre 3', '301', '3015347481'),
('Torre 3', '302', '3015347481'),
('Torre 3', '303', '3015347481'),
('Torre 3', '304', '3015347481'),
('Torre 3', '305', '3015347481'),
('Torre 3', '306', '3015347481'),
('Torre 3', '307', '3015347481'),
('Torre 3', '308', '3015347481'),
('Torre 3', '309', '3015347481'),
('Torre 3', '310', '3015347481');

-- Torre 4: Apartamentos 31-40
INSERT INTO apartamentos (torre, apartamento, telefono) VALUES
('Torre 4', '401', '3015347481'),
('Torre 4', '402', '3015347481'),
('Torre 4', '403', '3015347481'),
('Torre 4', '404', '3015347481'),
('Torre 4', '405', '3015347481'),
('Torre 4', '406', '3015347481'),
('Torre 4', '407', '3015347481'),
('Torre 4', '408', '3015347481'),
('Torre 4', '409', '3015347481'),
('Torre 4', '410', '3015347481');

-- Torre 5: Apartamentos 41-50
INSERT INTO apartamentos (torre, apartamento, telefono) VALUES
('Torre 5', '501', '3015347481'),
('Torre 5', '502', '3015347481'),
('Torre 5', '503', '3015347481'),
('Torre 5', '504', '3015347481'),
('Torre 5', '505', '3015347481'),
('Torre 5', '506', '3015347481'),
('Torre 5', '507', '3015347481'),
('Torre 5', '508', '3015347481'),
('Torre 5', '509', '3015347481'),
('Torre 5', '510', '3015347481');

-- Verificar que se insertaron
SELECT torre, COUNT(*) as total FROM apartamentos GROUP BY torre ORDER BY torre;

-- ============================================
-- POLÍTICAS DE SEGURIDAD (RLS)
-- ============================================

-- Habilitar RLS
ALTER TABLE apartamentos ENABLE ROW LEVEL SECURITY;

-- Permitir lectura a todos (usuarios autenticados y anonimos)
CREATE POLICY "Permitir lectura apartamentos" ON apartamentos
  FOR SELECT USING (true);

-- Permitir insert/update solo a usuarios autenticados
CREATE POLICY "Permitir insert/update apartamentos" ON apartamentos
  FOR ALL USING (auth.role() = 'authenticated');