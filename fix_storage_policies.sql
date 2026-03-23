-- Storage policies for paquetes-fotos bucket
-- Enable public read access
CREATE POLICY "Public Read" ON storage.objects
FOR SELECT USING (bucket_id = 'paquetes-fotos');

-- Enable authenticated users to upload
CREATE POLICY "Allow uploads" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'paquetes-fotos' AND auth.role() = 'authenticated');

-- Enable authenticated users to delete
CREATE POLICY "Allow deletes" ON storage.objects
FOR DELETE USING (bucket_id = 'paquetes-fotos' AND auth.role() = 'authenticated');

-- Also allow anon uploads (for guards who may not be fully authenticated)
CREATE POLICY "Allow anon uploads" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'paquetes-fotos');