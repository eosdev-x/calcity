import { useEffect, useMemo, useState } from 'react';
import { Plus, Save, Trash2, X, Edit3 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Business, Job } from '../../types/business';
import { createJob, deleteJob, fetchJobsByBusiness, toggleHiring, updateJob } from '../../api/jobs';

type JobManagerProps = {
  business: Business;
  onUpdated: (business: Business) => void;
};

const jobTypeOptions: Array<{ value: Job['job_type']; label: string }> = [
  { value: 'full-time', label: 'Full-time' },
  { value: 'part-time', label: 'Part-time' },
  { value: 'seasonal', label: 'Seasonal' },
  { value: 'contract', label: 'Contract' },
];

const jobTypeStyles: Record<Job['job_type'], string> = {
  'full-time': 'bg-primary-container text-on-primary-container',
  'part-time': 'bg-secondary-container text-on-secondary-container',
  seasonal: 'bg-tertiary-container text-on-tertiary-container',
  contract: 'border border-outline text-on-surface-variant',
};

export function JobManager({ business, onUpdated }: JobManagerProps) {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editingJob, setEditingJob] = useState<Job | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    job_type: 'full-time' as Job['job_type'],
    apply_url: '',
  });

  const isEligible = business.subscription_tier === 'premium' || business.subscription_tier === 'spotlight';
  const jobLimit = business.subscription_tier === 'spotlight' ? 3 : business.subscription_tier === 'premium' ? 1 : 0;
  const atLimit = isEligible && jobs.length >= jobLimit;

  const remainingLabel = useMemo(() => {
    if (!isEligible) return '';
    return `${jobs.length}/${jobLimit} jobs`;
  }, [isEligible, jobLimit, jobs.length]);

  useEffect(() => {
    let isMounted = true;
    const loadJobs = async () => {
      if (!business.id) return;
      setLoading(true);
      try {
        const data = await fetchJobsByBusiness(business.id);
        if (isMounted) {
          setJobs(data);
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err.message : 'Unable to load jobs');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    void loadJobs();
    return () => {
      isMounted = false;
    };
  }, [business.id]);

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      job_type: 'full-time',
      apply_url: '',
    });
    setEditingJob(null);
  };

  const handleEdit = (job: Job) => {
    setEditingJob(job);
    setFormData({
      title: job.title,
      description: job.description || '',
      job_type: job.job_type,
      apply_url: job.apply_url || '',
    });
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!formData.title.trim()) {
      setError('Job title is required.');
      return;
    }

    if (!isEligible) {
      setError('Upgrade to Premium to post jobs.');
      return;
    }

    if (!editingJob && atLimit) {
      setError('Job limit reached for your plan.');
      return;
    }

    setSaving(true);
    setError(null);
    try {
      if (editingJob) {
        const updated = await updateJob(editingJob.id, {
          title: formData.title.trim(),
          description: formData.description.trim() || null,
          job_type: formData.job_type,
          apply_url: formData.apply_url.trim() || null,
        });
        setJobs(prev => prev.map(job => (job.id === updated.id ? updated : job)));
        resetForm();
        return;
      }

      const created = await createJob({
        business_id: business.id,
        owner_id: business.owner_id,
        title: formData.title.trim(),
        description: formData.description.trim() || null,
        job_type: formData.job_type,
        apply_url: formData.apply_url.trim() || null,
      });
      setJobs(prev => [created, ...prev]);
      resetForm();

      if (!business.is_hiring) {
        const updatedBusiness = await toggleHiring(business.id, true);
        onUpdated(updatedBusiness);
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unable to save job';
      setError(message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (jobId: string) => {
    setDeletingId(jobId);
    setError(null);
    try {
      await deleteJob(jobId);
      const updatedJobs = jobs.filter(job => job.id !== jobId);
      setJobs(updatedJobs);

      if (updatedJobs.length === 0 && business.is_hiring) {
        const updatedBusiness = await toggleHiring(business.id, false);
        onUpdated(updatedBusiness);
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unable to delete job';
      setError(message);
    } finally {
      setDeletingId(null);
    }
  };

  if (!isEligible) {
    return (
      <div className="card">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="text-xl font-semibold text-on-surface mb-2">Jobs</h3>
            <p className="text-on-surface-variant text-sm">
              Job listings are available on Premium and Spotlight plans.
            </p>
          </div>
          <Link to="/pricing" className="btn-primary">
            Upgrade
          </Link>
        </div>
      </div>
    );
  }

  const inputClass =
    'w-full rounded-xl border border-outline bg-surface px-4 py-3 text-on-surface placeholder-on-surface-variant focus:border-primary focus:ring-1 focus:ring-primary transition-colors';

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h3 className="text-xl font-semibold text-on-surface">Job Listings</h3>
          <p className="text-sm text-on-surface-variant">{remainingLabel}</p>
        </div>
        {atLimit && !editingJob && (
          <span className="text-sm text-on-surface-variant">
            You&apos;ve reached your plan limit.
          </span>
        )}
      </div>

      {error && (
        <div className="rounded-xl border border-error bg-error-container p-4 text-on-error-container text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="card space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="text-lg font-semibold text-on-surface">
            {editingJob ? 'Edit Job' : 'Add Job'}
          </h4>
          {editingJob && (
            <button
              type="button"
              onClick={resetForm}
              className="text-on-surface-variant hover:text-primary transition-colors duration-[var(--md-sys-motion-duration-short3)]"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-on-surface mb-2">Job title</label>
          <input
            type="text"
            name="title"
            className={inputClass}
            value={formData.title}
            onChange={(event) => setFormData(prev => ({ ...prev, title: event.target.value }))}
            placeholder="e.g. Front Desk Associate"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-on-surface mb-2">Description</label>
          <textarea
            name="description"
            rows={4}
            className={inputClass}
            value={formData.description}
            onChange={(event) => setFormData(prev => ({ ...prev, description: event.target.value }))}
            placeholder="Share key responsibilities, skills, or perks."
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-on-surface mb-2">Job type</label>
            <select
              name="job_type"
              className={inputClass}
              value={formData.job_type}
              onChange={(event) =>
                setFormData(prev => ({ ...prev, job_type: event.target.value as Job['job_type'] }))
              }
            >
              {jobTypeOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-on-surface mb-2">Apply URL</label>
            <input
              type="url"
              name="apply_url"
              className={inputClass}
              value={formData.apply_url}
              onChange={(event) => setFormData(prev => ({ ...prev, apply_url: event.target.value }))}
              placeholder="https://"
            />
          </div>
        </div>

        <button
          type="submit"
          className="btn-primary inline-flex items-center justify-center"
          disabled={saving || (!editingJob && atLimit)}
        >
          {editingJob ? (
            <>
              <Save className="w-4 h-4 mr-2" />
              Save Changes
            </>
          ) : (
            <>
              <Plus className="w-4 h-4 mr-2" />
              Add Job
            </>
          )}
        </button>
      </form>

      <div className="space-y-4">
        <h4 className="text-lg font-semibold text-on-surface">Current Jobs</h4>
        {loading ? (
          <div className="card">
            <p className="text-on-surface-variant">Loading jobs...</p>
          </div>
        ) : jobs.length === 0 ? (
          <div className="card">
            <p className="text-on-surface-variant">No jobs posted yet.</p>
          </div>
        ) : (
          jobs.map(job => (
            <div key={job.id} className="card flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <h5 className="text-lg font-semibold text-on-surface line-clamp-1">{job.title}</h5>
                  <span
                    className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold ${jobTypeStyles[job.job_type]}`}
                  >
                    {jobTypeOptions.find(option => option.value === job.job_type)?.label}
                  </span>
                </div>
                <p className="text-sm text-on-surface-variant">
                  Posted {new Date(job.created_at).toLocaleDateString()}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleEdit(job)}
                  className="btn-outline inline-flex items-center"
                >
                  <Edit3 className="w-4 h-4 mr-2" />
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(job.id)}
                  className="btn-outline inline-flex items-center"
                  disabled={deletingId === job.id}
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  {deletingId === job.id ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
