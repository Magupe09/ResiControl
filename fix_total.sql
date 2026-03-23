-- Crear tabla si no existe
CREATE TABLE IF NOT EXISTS apartamentos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  torre TEXT NOT NULL,
  apartamento TEXT NOT NULL,
  telefono TEXT,
  conjunto_id TEXT DEFAULT 'Conjunto Residencial Mirador',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insertar datos si la tabla esta vacia
INSERT INTO apartamentos (torre, apartamento, telefono)
SELECT 'Torre 1', '101', '3015347481' WHERE NOT EXISTS (SELECT 1 FROM apartamentos);
INSERT INTO apartamentos (torre, apartamento, telefono)
SELECT 'Torre 1', '102', '3015347481' WHERE NOT EXISTS (SELECT 1 FROM apartamentos WHERE torre = 'Torre 1' AND apartamento = '102');
INSERT INTO apartamentos (torre, apartamento, telefono)
SELECT 'Torre 1', '103', '3015347481' WHERE NOT EXISTS (SELECT 1 FROM apartamentos WHERE torre = 'Torre 1' AND apartamento = '103');
INSERT INTO apartamentos (torre, apartamento, telefono)
SELECT 'Torre 1', '104', '3015347481' WHERE NOT EXISTS (SELECT 1 FROM apartamentos WHERE torre = 'Torre 1' AND apartamento = '104');
INSERT INTO apartamentos (torre, apartamento, telefono)
SELECT 'Torre 1', '105', '3015347481' WHERE NOT EXISTS (SELECT 1 FROM apartamentos WHERE torre = 'Torre 1' AND apartamento = '105');
INSERT INTO apartamentos (torre, apartamento, telefono)
SELECT 'Torre 1', '106', '3015347481' WHERE NOT EXISTS (SELECT 1 FROM apartamentos WHERE torre = 'Torre 1' AND apartamento = '106');
INSERT INTO apartamentos (torre, apartamento, telefono)
SELECT 'Torre 1', '107', '3015347481' WHERE NOT EXISTS (SELECT 1 FROM apartamentos WHERE torre = 'Torre 1' AND apartamento = '107');
INSERT INTO apartamentos (torre, apartamento, telefono)
SELECT 'Torre 1', '108', '3015347481' WHERE NOT EXISTS (SELECT 1 FROM apartamentos WHERE torre = 'Torre 1' AND apartamento = '108');
INSERT INTO apartamentos (torre, apartamento, telefono)
SELECT 'Torre 1', '109', '3015347481' WHERE NOT EXISTS (SELECT 1 FROM apartamentos WHERE torre = 'Torre 1' AND apartamento = '109');
INSERT INTO apartamentos (torre, apartamento, telefono)
SELECT 'Torre 1', '110', '3015347481' WHERE NOT EXISTS (SELECT 1 FROM apartamentos WHERE torre = 'Torre 1' AND apartamento = '110');

INSERT INTO apartamentos (torre, apartamento, telefono)
SELECT 'Torre 2', '201', '3015347481' WHERE NOT EXISTS (SELECT 1 FROM apartamentos WHERE torre = 'Torre 2' AND apartamento = '201');
INSERT INTO apartamentos (torre, apartamento, telefono)
SELECT 'Torre 2', '202', '3015347481' WHERE NOT EXISTS (SELECT 1 FROM apartamentos WHERE torre = 'Torre 2' AND apartamento = '202');
INSERT INTO apartamentos (torre, apartamento, telefono)
SELECT 'Torre 2', '203', '3015347481' WHERE NOT EXISTS (SELECT 1 FROM apartamentos WHERE torre = 'Torre 2' AND apartamento = '203');
INSERT INTO apartamentos (torre, apartamento, telefono)
SELECT 'Torre 2', '204', '3015347481' WHERE NOT EXISTS (SELECT 1 FROM apartamentos WHERE torre = 'Torre 2' AND apartamento = '204');
INSERT INTO apartamentos (torre, apartamento, telefono)
SELECT 'Torre 2', '205', '3015347481' WHERE NOT EXISTS (SELECT 1 FROM apartamentos WHERE torre = 'Torre 2' AND apartamento = '205');
INSERT INTO apartamentos (torre, apartamento, telefono)
SELECT 'Torre 2', '206', '3015347481' WHERE NOT EXISTS (SELECT 1 FROM apartamentos WHERE torre = 'Torre 2' AND apartamento = '206');
INSERT INTO apartamentos (torre, apartamento, telefono)
SELECT 'Torre 2', '207', '3015347481' WHERE NOT EXISTS (SELECT 1 FROM apartamentos WHERE torre = 'Torre 2' AND apartamento = '207');
INSERT INTO apartamentos (torre, apartamento, telefono)
SELECT 'Torre 2', '208', '3015347481' WHERE NOT EXISTS (SELECT 1 FROM apartamentos WHERE torre = 'Torre 2' AND apartamento = '208');
INSERT INTO apartamentos (torre, apartamento, telefono)
SELECT 'Torre 2', '209', '3015347481' WHERE NOT EXISTS (SELECT 1 FROM apartamentos WHERE torre = 'Torre 2' AND apartamento = '209');
INSERT INTO apartamentos (torre, apartamento, telefono)
SELECT 'Torre 2', '210', '3015347481' WHERE NOT EXISTS (SELECT 1 FROM apartamentos WHERE torre = 'Torre 2' AND apartamento = '210');

INSERT INTO apartamentos (torre, apartamento, telefono)
SELECT 'Torre 3', '301', '3015347481' WHERE NOT EXISTS (SELECT 1 FROM apartamentos WHERE torre = 'Torre 3' AND apartamento = '301');
INSERT INTO apartamentos (torre, apartamento, telefono)
SELECT 'Torre 3', '302', '3015347481' WHERE NOT EXISTS (SELECT 1 FROM apartamentos WHERE torre = 'Torre 3' AND apartamento = '302');
INSERT INTO apartamentos (torre, apartamento, telefono)
SELECT 'Torre 3', '303', '3015347481' WHERE NOT EXISTS (SELECT 1 FROM apartamentos WHERE torre = 'Torre 3' AND apartamento = '303');
INSERT INTO apartamentos (torre, apartamento, telefono)
SELECT 'Torre 3', '304', '3015347481' WHERE NOT EXISTS (SELECT 1 FROM apartamentos WHERE torre = 'Torre 3' AND apartamento = '304');
INSERT INTO apartamentos (torre, apartamento, telefono)
SELECT 'Torre 3', '305', '3015347481' WHERE NOT EXISTS (SELECT 1 FROM apartamentos WHERE torre = 'Torre 3' AND apartamento = '305');
INSERT INTO apartamentos (torre, apartamento, telefono)
SELECT 'Torre 3', '306', '3015347481' WHERE NOT EXISTS (SELECT 1 FROM apartamentos WHERE torre = 'Torre 3' AND apartamento = '306');
INSERT INTO apartamentos (torre, apartamento, telefono)
SELECT 'Torre 3', '307', '3015347481' WHERE NOT EXISTS (SELECT 1 FROM apartamentos WHERE torre = 'Torre 3' AND apartamento = '307');
INSERT INTO apartamentos (torre, apartamento, telefono)
SELECT 'Torre 3', '308', '3015347481' WHERE NOT EXISTS (SELECT 1 FROM apartamentos WHERE torre = 'Torre 3' AND apartamento = '308');
INSERT INTO apartamentos (torre, apartamento, telefono)
SELECT 'Torre 3', '309', '3015347481' WHERE NOT EXISTS (SELECT 1 FROM apartamentos WHERE torre = 'Torre 3' AND apartamento = '309');
INSERT INTO apartamentos (torre, apartamento, telefono)
SELECT 'Torre 3', '310', '3015347481' WHERE NOT EXISTS (SELECT 1 FROM apartamentos WHERE torre = 'Torre 3' AND apartamento = '310');

INSERT INTO apartamentos (torre, apartamento, telefono)
SELECT 'Torre 4', '401', '3015347481' WHERE NOT EXISTS (SELECT 1 FROM apartamentos WHERE torre = 'Torre 4' AND apartamento = '401');
INSERT INTO apartamentos (torre, apartamento, telefono)
SELECT 'Torre 4', '402', '3015347481' WHERE NOT EXISTS (SELECT 1 FROM apartamentos WHERE torre = 'Torre 4' AND apartamento = '402');
INSERT INTO apartamentos (torre, apartamento, telefono)
SELECT 'Torre 4', '403', '3015347481' WHERE NOT EXISTS (SELECT 1 FROM apartamentos WHERE torre = 'Torre 4' AND apartamento = '403');
INSERT INTO apartamentos (torre, apartamento, telefono)
SELECT 'Torre 4', '404', '3015347481' WHERE NOT EXISTS (SELECT 1 FROM apartamentos WHERE torre = 'Torre 4' AND apartamento = '404');
INSERT INTO apartamentos (torre, apartamento, telefono)
SELECT 'Torre 4', '405', '3015347481' WHERE NOT EXISTS (SELECT 1 FROM apartamentos WHERE torre = 'Torre 4' AND apartamento = '405');
INSERT INTO apartamentos (torre, apartamento, telefono)
SELECT 'Torre 4', '406', '3015347481' WHERE NOT EXISTS (SELECT 1 FROM apartamentos WHERE torre = 'Torre 4' AND apartamento = '406');
INSERT INTO apartamentos (torre, apartamento, telefono)
SELECT 'Torre 4', '407', '3015347481' WHERE NOT EXISTS (SELECT 1 FROM apartamentos WHERE torre = 'Torre 4' AND apartamento = '407');
INSERT INTO apartamentos (torre, apartamento, telefono)
SELECT 'Torre 4', '408', '3015347481' WHERE NOT EXISTS (SELECT 1 FROM apartamentos WHERE torre = 'Torre 4' AND apartamento = '408');
INSERT INTO apartamentos (torre, apartamento, telefono)
SELECT 'Torre 4', '409', '3015347481' WHERE NOT EXISTS (SELECT 1 FROM apartamentos WHERE torre = 'Torre 4' AND apartamento = '409');
INSERT INTO apartamentos (torre, apartamento, telefono)
SELECT 'Torre 4', '410', '3015347481' WHERE NOT EXISTS (SELECT 1 FROM apartamentos WHERE torre = 'Torre 4' AND apartamento = '410');

INSERT INTO apartamentos (torre, apartamento, telefono)
SELECT 'Torre 5', '501', '3015347481' WHERE NOT EXISTS (SELECT 1 FROM apartamentos WHERE torre = 'Torre 5' AND apartamento = '501');
INSERT INTO apartamentos (torre, apartamento, telefono)
SELECT 'Torre 5', '502', '3015347481' WHERE NOT EXISTS (SELECT 1 FROM apartamentos WHERE torre = 'Torre 5' AND apartamento = '502');
INSERT INTO apartamentos (torre, apartamento, telefono)
SELECT 'Torre 5', '503', '3015347481' WHERE NOT EXISTS (SELECT 1 FROM apartamentos WHERE torre = 'Torre 5' AND apartamento = '503');
INSERT INTO apartamentos (torre, apartamento, telefono)
SELECT 'Torre 5', '504', '3015347481' WHERE NOT EXISTS (SELECT 1 FROM apartamentos WHERE torre = 'Torre 5' AND apartamento = '504');
INSERT INTO apartamentos (torre, apartamento, telefono)
SELECT 'Torre 5', '505', '3015347481' WHERE NOT EXISTS (SELECT 1 FROM apartamentos WHERE torre = 'Torre 5' AND apartamento = '505');
INSERT INTO apartamentos (torre, apartamento, telefono)
SELECT 'Torre 5', '506', '3015347481' WHERE NOT EXISTS (SELECT 1 FROM apartamentos WHERE torre = 'Torre 5' AND apartamento = '506');
INSERT INTO apartamentos (torre, apartamento, telefono)
SELECT 'Torre 5', '507', '3015347481' WHERE NOT EXISTS (SELECT 1 FROM apartamentos WHERE torre = 'Torre 5' AND apartamento = '507');
INSERT INTO apartamentos (torre, apartamento, telefono)
SELECT 'Torre 5', '508', '3015347481' WHERE NOT EXISTS (SELECT 1 FROM apartamentos WHERE torre = 'Torre 5' AND apartamento = '508');
INSERT INTO apartamentos (torre, apartamento, telefono)
SELECT 'Torre 5', '509', '3015347481' WHERE NOT EXISTS (SELECT 1 FROM apartamentos WHERE torre = 'Torre 5' AND apartamento = '509');
INSERT INTO apartamentos (torre, apartamento, telefono)
SELECT 'Torre 5', '510', '3015347481' WHERE NOT EXISTS (SELECT 1 FROM apartamentos WHERE torre = 'Torre 5' AND apartamento = '510');

-- Deshabilitar RLS para permitir acceso total (solucion temporal)
ALTER TABLE apartamentos DISABLE ROW LEVEL SECURITY;