import { Link } from 'react-router-dom';
import { Briefcase, Mail, Phone } from 'lucide-react';
import { Job } from '../types/business';

type JobCardProps = {
  job: Job;
  business?: {
    id: string;
    name: string;
    phone: string | null;
    email: string | null;
    slug?: string | null;
  };
  showBusinessName?: boolean;
  showContactFallback?: boolean;
};

const jobTypeLabels: Record<Job['job_type'], string> = {
  'full-time': 'Full-time',
  'part-time': 'Part-time',
  seasonal: 'Seasonal',
  contract: 'Contract',
};

const jobTypeStyles: Record<Job['job_type'], string> = {
  'full-time': 'bg-primary-container text-on-primary-container',
  'part-time': 'bg-secondary-container text-on-secondary-container',
  seasonal: 'bg-tertiary-container text-on-tertiary-container',
  contract: 'border border-outline text-on-surface-variant',
};

export function JobCard({
  job,
  business,
  showBusinessName = true,
  showContactFallback = true,
}: JobCardProps) {
  const postedDate = new Date(job.created_at).toLocaleDateString();
  const showContact = showContactFallback && !job.apply_url && (business?.email || business?.phone);
  const contactHref = business?.email
    ? `mailto:${business.email}`
    : business?.phone
      ? `tel:${business.phone.replace(/[^\d]/g, '')}`
      : '#';

  return (
    <div className="card flex flex-col gap-4">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h3 className="text-xl font-semibold text-on-surface mb-1 line-clamp-1">
            {job.title}
          </h3>
          {showBusinessName && business && (
            <Link
              to={`/businesses/${business.id}`}
              className="text-sm text-on-surface-variant hover:text-primary transition-colors duration-[var(--md-sys-motion-duration-short3)]"
            >
              {business.name}
            </Link>
          )}
        </div>
        <div className="flex flex-col items-end gap-2">
          <span
            className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold ${jobTypeStyles[job.job_type]}`}
          >
            {jobTypeLabels[job.job_type]}
          </span>
          <span className="text-xs text-on-surface-variant">Posted {postedDate}</span>
        </div>
      </div>

      {job.description && (
        <p className="text-on-surface-variant line-clamp-2">
          {job.description}
        </p>
      )}

      {showContact && (
        <div className="space-y-2 text-sm text-on-surface-variant">
          {business?.email && (
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4" />
              <span>{business.email}</span>
            </div>
          )}
          {business?.phone && (
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4" />
              <span>{business.phone}</span>
            </div>
          )}
        </div>
      )}

      <div className="pt-2">
        {job.apply_url ? (
          <a
            href={job.apply_url}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary w-full text-center inline-flex items-center justify-center"
          >
            <Briefcase className="w-4 h-4 mr-2" />
            Apply
          </a>
        ) : (
          <a
            href={contactHref}
            className="btn-outline w-full text-center inline-flex items-center justify-center"
          >
            <Briefcase className="w-4 h-4 mr-2" />
            Contact
          </a>
        )}
      </div>
    </div>
  );
}
