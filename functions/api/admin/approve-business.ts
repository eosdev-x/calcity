import { jsonResponse, StripeEnv, verifyAdmin } from './_shared';

type ApproveAction = 'approve' | 'reject';

interface ApproveBusinessBody {
  businessId?: string;
  action?: ApproveAction;
  reason?: string;
}

export async function onRequestPost(context: { request: Request; env: StripeEnv }) {
  const { request, env } = context;

  try {
    const { error: authError, supabase } = await verifyAdmin(request, env);
    if (authError) return authError;

    const body = (await request.json().catch(() => ({}))) as ApproveBusinessBody;
    const businessId = typeof body.businessId === 'string' ? body.businessId : null;
    const action = body.action === 'approve' || body.action === 'reject' ? body.action : null;
    const reason = typeof body.reason === 'string' ? body.reason.trim() : '';

    if (!businessId || !action) {
      return jsonResponse({ error: 'Missing businessId or action' }, 400);
    }

    if (action === 'reject' && !reason) {
      return jsonResponse({ error: 'Rejection reason is required' }, 400);
    }

    const updatePayload: Record<string, string | null> = {
      status: action === 'approve' ? 'active' : 'rejected',
      approved_at: action === 'approve' ? new Date().toISOString() : null,
      rejection_reason: action === 'reject' ? reason : null,
    };

    const { data: updated, error: updateError } = await supabase
      .from('businesses')
      .update(updatePayload)
      .eq('id', businessId)
      .eq('status', 'pending')
      .select('id');

    if (!updateError && (!updated || updated.length === 0)) {
      return jsonResponse({ error: 'Business is not in pending status' }, 409);
    }

    if (updateError) {
      console.error('Failed to update business:', updateError);
      return jsonResponse({ error: 'Failed to update business' }, 500);
    }

    return jsonResponse({ success: true });
  } catch (error) {
    console.error('Error approving business:', error);
    return jsonResponse({ error: 'Failed to update business' }, 500);
  }
}
