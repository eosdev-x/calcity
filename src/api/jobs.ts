import { supabase } from '../lib/supabase';
import { Business, Job } from '../types/business';

const JOB_LIMITS: Record<Business['subscription_tier'], number> = {
  free: 0,
  basic: 0,
  premium: 1,
  spotlight: 3,
};

type JobWithBusinessRow = Job & {
  businesses: Pick<Business, 'id' | 'name' | 'phone' | 'email' | 'slug'> | null;
};

export type JobWithBusiness = Job & {
  business: Pick<Business, 'id' | 'name' | 'phone' | 'email' | 'slug'>;
};

export async function fetchJobs(): Promise<JobWithBusiness[]> {
  const now = new Date().toISOString();
  const { data, error } = await supabase
    .from('jobs')
    .select('*, businesses ( id, name, phone, email, slug )')
    .gt('expires_at', now)
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(error.message || 'Failed to load jobs');
  }

  const rows = (data as JobWithBusinessRow[]) || [];
  return rows
    .filter((row) => row.businesses)
    .map((row) => ({
      ...row,
      business: row.businesses!,
    }));
}

export async function fetchJobsByBusiness(businessId: string): Promise<Job[]> {
  const now = new Date().toISOString();
  const { data, error } = await supabase
    .from('jobs')
    .select('*')
    .eq('business_id', businessId)
    .gt('expires_at', now)
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(error.message || 'Failed to load jobs');
  }

  return (data as Job[]) || [];
}

export async function createJob(job: Omit<Job, 'id' | 'created_at' | 'updated_at' | 'expires_at'>): Promise<Job> {
  const { data: business, error: businessError } = await supabase
    .from('businesses')
    .select('subscription_tier')
    .eq('id', job.business_id)
    .maybeSingle();

  if (businessError) {
    throw new Error(businessError.message || 'Unable to verify subscription tier');
  }

  const tier = (business?.subscription_tier || 'free') as Business['subscription_tier'];
  const limit = JOB_LIMITS[tier] ?? 0;
  if (limit === 0) {
    throw new Error('Upgrade to a Premium plan to post jobs.');
  }

  const { count, error: countError } = await supabase
    .from('jobs')
    .select('id', { count: 'exact', head: true })
    .eq('business_id', job.business_id);

  if (countError) {
    throw new Error(countError.message || 'Unable to check job limits');
  }

  if ((count ?? 0) >= limit) {
    throw new Error('Job limit reached for your plan.');
  }

  const payload = {
    ...job,
    updated_at: new Date().toISOString(),
  };

  const { data, error } = await supabase
    .from('jobs')
    .insert(payload)
    .select('*')
    .single();

  if (error || !data) {
    throw new Error(error?.message || 'Failed to create job');
  }

  return data as Job;
}

export async function updateJob(
  id: string,
  updates: Partial<Pick<Job, 'title' | 'description' | 'job_type' | 'apply_url'>>
): Promise<Job> {
  const payload = {
    ...updates,
    updated_at: new Date().toISOString(),
  };

  const { data, error } = await supabase
    .from('jobs')
    .update(payload)
    .eq('id', id)
    .select('*')
    .single();

  if (error || !data) {
    throw new Error(error?.message || 'Failed to update job');
  }

  return data as Job;
}

export async function deleteJob(id: string): Promise<void> {
  const { error } = await supabase
    .from('jobs')
    .delete()
    .eq('id', id);

  if (error) {
    throw new Error(error.message || 'Failed to delete job');
  }
}

export async function toggleHiring(businessId: string, isHiring: boolean): Promise<Business> {
  const { data, error } = await supabase
    .from('businesses')
    .update({ is_hiring: isHiring, updated_at: new Date().toISOString() })
    .eq('id', businessId)
    .select('*')
    .single();

  if (error || !data) {
    throw new Error(error?.message || 'Failed to update hiring status');
  }

  return data as Business;
}
