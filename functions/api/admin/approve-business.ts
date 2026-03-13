import { getBearerToken, getSupabaseAdmin, jsonResponse, StripeEnv } from '../stripe/_shared';

type ApproveAction = 'approve' | 'reject';

interface ApproveBusinessBody {
  businessId?: string;
  action?: ApproveAction;
  reason?: string;
}

export async function onRequestPost(context: { request: Request; env: StripeEnv }) {
  const { request, env } = context;
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

    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .maybeSingle();

    if (profileError || profile?.role !== 'admin') {
      return jsonResponse({ error: 'Forbidden' }, 403);
    }

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

    const { error: updateError } = await supabase
      .from('businesses')
      .update(updatePayload)
      .eq('id', businessId);

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
