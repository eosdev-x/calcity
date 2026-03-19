import { useEffect, useMemo, useState } from 'react';
import { Briefcase } from 'lucide-react';
import { Link } from 'react-router-dom';
import { SEO } from '../components/SEO';
import { siteConfig } from '../config/site';
import { JobCard } from '../components/JobCard';
import { fetchJobs, JobWithBusiness } from '../api/jobs';
import { Job } from '../types/business';

type JobFilter = 'all' | Job['job_type'];

const filterOptions: Array<{ value: JobFilter; label: string }> = [
  { value: 'all', label: 'All' },
  { value: 'full-time', label: 'Full-time' },
  { value: 'part-time', label: 'Part-time' },
  { value: 'seasonal', label: 'Seasonal' },
  { value: 'contract', label: 'Contract' },
];

export function Jobs() {
  const [jobs, setJobs] = useState<JobWithBusiness[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<JobFilter>('all');

  useEffect(() => {
    let isMounted = true;
    const loadJobs = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchJobs();
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
  }, []);

  const filteredJobs = useMemo(() => {
    if (activeFilter === 'all') return jobs;
    return jobs.filter(job => job.job_type === activeFilter);
  }, [activeFilter, jobs]);

  return (
    <div className="min-h-screen bg-surface text-on-surface">
      <SEO
        title={`${siteConfig.name} Jobs`}
        description={`Explore open roles from ${siteConfig.city} businesses.`}
        path="/jobs"
        type="website"
      />

      <section className="relative bg-surface-container-low overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-tertiary/10" />
        <div className="container mx-auto px-4 py-16 relative">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div>
              <p className="text-primary font-semibold mb-3">Now hiring in {siteConfig.city}</p>
              <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">
                Find Your Next Role
              </h1>
              <p className="text-lg text-on-surface-variant mb-6">
                Browse openings from local businesses and apply directly. New roles are added as
                {` ${siteConfig.city}`} keeps growing.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link to="/dashboard" className="btn-primary inline-flex items-center">
                  <Briefcase className="w-4 h-4 mr-2" />
                  Post a Job
                </Link>
                <Link to="/businesses" className="btn-outline">
                  Explore Businesses
                </Link>
              </div>
            </div>
            <div className="card">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-primary-container text-on-primary-container flex items-center justify-center">
                  <Briefcase className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm text-on-surface-variant">Open roles</p>
                  <p className="text-2xl font-semibold text-on-surface">{jobs.length}</p>
                </div>
              </div>
              <p className="text-on-surface-variant text-sm">
                Premium and Spotlight businesses can post roles and reach the community instantly.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-12">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h2 className="text-3xl font-semibold text-on-surface">Open Positions</h2>
            <p className="text-on-surface-variant">
              Showing {filteredJobs.length} role{filteredJobs.length !== 1 ? 's' : ''}.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            {filterOptions.map(option => (
              <button
                key={option.value}
                type="button"
                onClick={() => setActiveFilter(option.value)}
                className={`px-5 py-2 rounded-full text-base font-medium transition-colors duration-[var(--md-sys-motion-duration-short3)] ${
                  activeFilter === option.value
                    ? 'bg-primary text-on-primary'
                    : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {error && (
          <div className="mb-6 rounded-xl border border-error bg-error-container p-4 text-on-error-container text-sm">
            {error}
          </div>
        )}

        {loading ? (
          <div className="card">
            <p className="text-on-surface-variant">Loading jobs...</p>
          </div>
        ) : filteredJobs.length === 0 ? (
          <div className="card text-center py-12">
            <p className="text-xl text-on-surface-variant">No jobs found for this filter yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredJobs.map((job) => (
              <JobCard
                key={job.id}
                job={job}
                business={job.business}
                showBusinessName
                showContactFallback
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
