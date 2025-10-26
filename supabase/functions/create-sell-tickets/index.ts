import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.76.1'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface CreateTicketsRequest {
  listingId: string;
  listingTitle: string;
  listingCode: string;
  listingQuantity: number;
  listingPrice: number;
  listingPriceType: string;
  listingUserId: string;
  buyerUserId: string;
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
    console.log('Creating sell tickets for listing:', body.listingId)

    // Create ticket for seller (without exposing buyer info)
    const sellerSubject = `vente - ${body.listingTitle} - ${body.listingCode}`
    const { data: sellerTicket, error: sellerError } = await supabaseAdmin
      .from('tickets')
      .insert({
        user_id: body.listingUserId,
        subject: sellerSubject,
        category: 'marketplace',
        subcategory: 'sell',
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
Un membre est intéressé par votre produit.
Voici les détails :
- Titre : ${body.listingTitle}
- Prix : ${body.listingPrice}€ ${body.listingPriceType}
- Quantité : ${body.listingQuantity}
- Code annonce : ${body.listingCode}

Est-il toujours disponible svp ?`

    await supabaseAdmin.from('messages').insert({
      ticket_id: sellerTicket.id,
      user_id: body.listingUserId,
      content: sellerMessage
    })

    // Create ticket for buyer
    const buyerSubject = `achat - ${body.listingTitle} - ${body.listingCode}`
    const { data: buyerTicket, error: buyerError } = await supabaseAdmin
      .from('tickets')
      .insert({
        user_id: body.buyerUserId,
        subject: buyerSubject,
        category: 'marketplace',
        subcategory: 'sell',
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
je suis intéressé(e) pour :
- ${body.listingTitle}
est-il toujours disponible svp ?`

    await supabaseAdmin.from('messages').insert({
      ticket_id: buyerTicket.id,
      user_id: body.buyerUserId,
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
    console.error('Error in create-sell-tickets:', error)
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
