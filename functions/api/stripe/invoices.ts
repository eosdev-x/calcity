import { getBearerToken, getStripeClient, getSupabaseAdmin, jsonResponse, StripeEnv } from './_shared';

export async function onRequestGet(context: { request: Request; env: StripeEnv }) {
  const { request, env } = context;
  const stripe = getStripeClient(env);
  const supabase = getSupabaseAdmin(env);

  try {
    const token = getBearerToken(request);
    if (!token) {
      return jsonResponse({ error: 'Unauthorized' }, 401);
    }

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser(token);

    if (userError || !user) {
      return jsonResponse({ error: 'Unauthorized' }, 401);
    }

    // Get the user's Stripe customer ID
    const { data: customerRecord, error: customerError } = await supabase
      .from('customers')
      .select('stripe_customer_id')
      .eq('user_id', user.id)
      .maybeSingle();

    if (customerError || !customerRecord?.stripe_customer_id) {
      return jsonResponse({ invoices: [] });
    }

    // Fetch invoices from Stripe
    const invoices = await stripe.invoices.list({
      customer: customerRecord.stripe_customer_id,
      limit: 50,
    });

    const formattedInvoices = invoices.data.map((invoice) => ({
      id: invoice.id,
      amount: (invoice.amount_paid ?? 0) / 100,
      status: invoice.status === 'paid' ? 'succeeded' : invoice.status ?? 'unknown',
      date: (invoice.created ?? 0) * 1000,
      description: invoice.lines?.data?.[0]?.description ?? 'Subscription payment',
      invoiceUrl: invoice.hosted_invoice_url ?? null,
      invoicePdf: invoice.invoice_pdf ?? null,
    }));

    return jsonResponse({ invoices: formattedInvoices });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error('Error fetching invoices:', message);
    return jsonResponse({ error: 'Failed to fetch payment history' }, 500);
  }
}
