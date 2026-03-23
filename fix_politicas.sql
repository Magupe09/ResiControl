DROP POLICY IF EXISTS "allow_read" ON apartamentos;
DROP POLICY IF EXISTS "allow_insert" ON apartamentos;
DROP POLICY IF EXISTS "allow_update" ON apartamentos;
DROP POLICY IF EXISTS "allow_delete" ON apartamentos;

CREATE POLICY "allow_read" ON apartamentos
  FOR SELECT USING (true);

CREATE POLICY "allow_insert" ON apartamentos
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "allow_update" ON apartamentos
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "allow_delete" ON apartamentos
  FOR ALL USING (auth.role() = 'authenticated');