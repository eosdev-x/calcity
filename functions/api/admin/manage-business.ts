import { jsonResponse, StripeEnv, verifyAdmin } from './_shared';

type ManageAction = 'suspend' | 'unsuspend' | 'delete';

interface ManageBusinessBody {
  businessId?: string;
  action?: ManageAction;
}

export async function onRequestPost(context: { request: Request; env: StripeEnv }) {
  const { request, env } = context;

  try {
    const { error: authError, supabase } = await verifyAdmin(request, env);
    if (authError) return authError;

    const body = (await request.json().catch(() => ({}))) as ManageBusinessBody;
    const businessId = typeof body.businessId === 'string' ? body.businessId : null;
    const action = body.action === 'suspend' || body.action === 'unsuspend' || body.action === 'delete'
      ? body.action
      : null;

    if (!businessId || !action) {
      return jsonResponse({ error: 'Missing businessId or action' }, 400);
    }

    if (action === 'delete') {
      const { data: deleted, error: deleteError } = await supabase
        .from('businesses')
        .delete()
        .eq('id', businessId)
        .select('id');

      if (!deleteError && (!deleted || deleted.length === 0)) {
        return jsonResponse({ error: 'Business not found' }, 404);
      }

      if (deleteError) {
        console.error('Failed to delete business:', deleteError);
        return jsonResponse({ error: 'Failed to delete business' }, 500);
      }

      return jsonResponse({ success: true });
    }

    const nextStatus = action === 'suspend' ? 'suspended' : 'active';
    const expectedStatus = action === 'suspend' ? 'active' : 'suspended';

    const { data: updated, error: updateError } = await supabase
      .from('businesses')
      .update({ status: nextStatus })
      .eq('id', businessId)
      .eq('status', expectedStatus)
      .select('id');

    if (!updateError && (!updated || updated.length === 0)) {
      return jsonResponse(
        { error: `Business is not currently ${expectedStatus}` },
        409
      );
    }

    if (updateError) {
      console.error('Failed to update business:', updateError);
      return jsonResponse({ error: 'Failed to update business' }, 500);
    }

    return jsonResponse({ success: true });
  } catch (error) {
    console.error('Error managing business:', error);
    return jsonResponse({ error: 'Failed to update business' }, 500);
  }
}
