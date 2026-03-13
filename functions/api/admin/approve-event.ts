import { getBearerToken, getSupabaseAdmin, jsonResponse, StripeEnv } from '../stripe/_shared';

type ApproveAction = 'approve' | 'reject';

interface ApproveEventBody {
  eventId?: string;
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

    const body = (await request.json().catch(() => ({}))) as ApproveEventBody;
    const eventId = typeof body.eventId === 'string' ? body.eventId : null;
    const action = body.action === 'approve' || body.action === 'reject' ? body.action : null;
    const reason = typeof body.reason === 'string' ? body.reason.trim() : '';

    if (!eventId || !action) {
      return jsonResponse({ error: 'Missing eventId or action' }, 400);
    }

    if (action === 'reject' && !reason) {
      return jsonResponse({ error: 'Rejection reason is required' }, 400);
    }

    const updatePayload: Record<string, string | null> = {
      status: action === 'approve' ? 'approved' : 'rejected',
      rejection_reason: action === 'reject' ? reason : null,
    };

    const { error: updateError } = await supabase
      .from('events')
      .update(updatePayload)
      .eq('id', eventId);

    if (updateError) {
      console.error('Failed to update event:', updateError);
      return jsonResponse({ error: 'Failed to update event' }, 500);
    }

    return jsonResponse({ success: true });
  } catch (error) {
    console.error('Error approving event:', error);
    return jsonResponse({ error: 'Failed to update event' }, 500);
  }
}
