import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const formData = await req.formData()
    const file = formData.get('file')
    
    if (!file) {
      return new Response(
        JSON.stringify({ error: 'No se recibió archivo' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const arrayBuffer = await file.arrayBuffer()
    const buffer = new Uint8Array(arrayBuffer)

    const fileName = `packages/${Date.now()}-${file.name.replace(/\.[^/.]+$/, '')}.jpg`

    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { data: uploadData, error: uploadError } = await supabaseAdmin.storage
      .from('paquetes-fotos')
      .upload(fileName, buffer, {
        contentType: file.type || 'image/jpeg',
        upsert: false
      })

    if (uploadError) {
      console.error('Error al subir:', uploadError)
      return new Response(
        JSON.stringify({ error: 'Error al subir la imagen', details: uploadError.message }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const { data: urlData } = supabaseAdmin.storage
      .from('paquetes-fotos')
      .getPublicUrl(fileName)

    console.log(`Imagen subida: ${fileName}, tamaño: ${buffer.length} bytes`)

    return new Response(
      JSON.stringify({ 
        success: true, 
        url: urlData.publicUrl,
        fileName: fileName,
        size: buffer.length
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Error en Edge Function:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})