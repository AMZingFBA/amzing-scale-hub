import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.76.1'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface CreateTicketsRequest {
  buyRequestId: string;
  buyRequestTitle: string;
  buyRequestCode: string;
  buyRequestQuantity: number;
  buyRequestMaxPrice: number | null;
  buyRequestPriceType: string;
  buyRequestUserId: string;
  sellerUserId: string;
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Create Supabase client with service_role key to bypass RLS
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    )

    const body: CreateTicketsRequest = await req.json()
    console.log('Creating marketplace tickets for buy request:', body.buyRequestId)

    // Get user profiles for nicknames
    const { data: sellerProfile } = await supabaseAdmin
      .from('profiles')
      .select('nickname, email')
      .eq('id', body.sellerUserId)
      .single()

    const { data: buyerProfile } = await supabaseAdmin
      .from('profiles')
      .select('nickname, email')
      .eq('id', body.buyRequestUserId)
      .single()

    const sellerNickname = sellerProfile?.nickname || sellerProfile?.email?.split('@')[0] || 'Vendeur'
    const buyerNickname = buyerProfile?.nickname || buyerProfile?.email?.split('@')[0] || 'Acheteur'
    const buyerEmail = buyerProfile?.email || ''

    // Create ticket for seller
    const sellerSubject = `vente - ${body.buyRequestTitle} - ${body.buyRequestCode} et ${sellerNickname}`
    const { data: sellerTicket, error: sellerError } = await supabaseAdmin
      .from('tickets')
      .insert({
        user_id: body.sellerUserId,
        subject: sellerSubject,
        category: 'marketplace',
        status: 'open',
        priority: 'normal'
      })
      .select()
      .single()

    if (sellerError) {
      console.error('Error creating seller ticket:', sellerError)
      throw sellerError
    }

    console.log('Seller ticket created:', sellerTicket.id)

    // Create initial message for seller
    const sellerMessage = `Bonjour 👋,
Je possède cet article et je souhaite le vendre.
Voici les détails de l'annonce :
- Titre : ${body.buyRequestTitle}
- Budget max : ${body.buyRequestMaxPrice ? `${body.buyRequestMaxPrice}€ ${body.buyRequestPriceType}` : 'Non spécifié'}
- Quantité : ${body.buyRequestQuantity}
- Code annonce : ${body.buyRequestCode}

📧 Contact acheteur : ${buyerNickname} (${buyerEmail})`

    await supabaseAdmin.from('messages').insert({
      ticket_id: sellerTicket.id,
      user_id: body.sellerUserId,
      content: sellerMessage
    })

    // Create ticket for buyer
    const buyerSubject = `achat - ${body.buyRequestTitle} - ${body.buyRequestCode} et ${sellerNickname}`
    const { data: buyerTicket, error: buyerError } = await supabaseAdmin
      .from('tickets')
      .insert({
        user_id: body.buyRequestUserId,
        subject: buyerSubject,
        category: 'marketplace',
        status: 'open',
        priority: 'normal'
      })
      .select()
      .single()

    if (buyerError) {
      console.error('Error creating buyer ticket:', buyerError)
      throw buyerError
    }

    console.log('Buyer ticket created:', buyerTicket.id)

    // Create initial message for buyer
    const buyerMessage = `Bonjour 👋
je possède l'article que vous recherchez :
${body.buyRequestTitle}
Êtes-vous toujours intéressé ?`

    await supabaseAdmin.from('messages').insert({
      ticket_id: buyerTicket.id,
      user_id: body.sellerUserId,
      content: buyerMessage
    })

    console.log('Tickets and messages created successfully')

    return new Response(
      JSON.stringify({ 
        success: true, 
        sellerTicketId: sellerTicket.id,
        buyerTicketId: buyerTicket.id 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Error in create-marketplace-tickets:', error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { 
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})