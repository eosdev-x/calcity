import { useEffect, useMemo, useState } from 'react';
import { Loader2, Search } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { UserProfile } from '../../types/auth';

export function UserManagement() {
  const [profiles, setProfiles] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState('');

  useEffect(() => {
    let isMounted = true;

    const fetchProfiles = async () => {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (!isMounted) return;

      if (fetchError) {
        setError(fetchError.message || 'Failed to load profiles');
        setProfiles([]);
      } else {
        setProfiles((data as UserProfile[]) || []);
      }
      setLoading(false);
    };

    void fetchProfiles();

    return () => {
      isMounted = false;
    };
  }, []);

  const filteredProfiles = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return profiles;

    return profiles.filter(profile => {
      const name = profile.full_name?.toLowerCase() || '';
      const email = profile.email?.toLowerCase() || '';
      return name.includes(normalized) || email.includes(normalized);
    });
  }, [profiles, query]);

  const roleStyles: Record<UserProfile['role'], string> = {
    admin: 'bg-error-container text-on-error-container',
    business_owner: 'bg-primary-container text-on-primary-container',
    user: 'bg-surface-container-high text-on-surface-variant',
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-surface py-12">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <Loader2 className="w-10 h-10 text-on-surface-variant animate-spin mx-auto mb-4" />
            <p className="text-on-surface-variant">Loading users...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface py-12">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-semibold text-on-surface">User Management</h1>
            <p className="text-on-surface-variant">Search and view platform users.</p>
          </div>
          <div className="relative w-full lg:w-80">
            <Search className="w-4 h-4 text-on-surface-variant absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by name or email"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              className="w-full rounded-xl border border-outline bg-surface px-10 py-3 text-sm text-on-surface"
            />
          </div>
        </div>

        {error && (
          <div className="mb-6 rounded-xl border border-error bg-error-container p-4 text-on-error-container text-sm">
            {error}
          </div>
        )}

        <div className="card">
          <div className="hidden md:grid grid-cols-[2fr_2fr_1fr_1fr_1fr] gap-4 text-xs uppercase text-on-surface-variant font-semibold mb-4">
            <div>Name</div>
            <div>Email</div>
            <div>Role</div>
            <div>Joined</div>
            <div>Actions</div>
          </div>

          {filteredProfiles.length === 0 ? (
            <div className="text-center text-on-surface-variant py-8">No users found.</div>
          ) : (
            <div className="space-y-4">
              {filteredProfiles.map(profile => (
                <div
                  key={profile.id}
                  className="grid grid-cols-1 md:grid-cols-[2fr_2fr_1fr_1fr_1fr] gap-4 items-center border-t border-outline-variant pt-4"
                >
                  <div>
                    <p className="text-sm font-medium text-on-surface">
                      {profile.full_name || 'Unnamed User'}
                    </p>
                    <p className="text-xs text-on-surface-variant md:hidden">{profile.email}</p>
                  </div>
                  <div className="hidden md:block text-sm text-on-surface-variant">{profile.email}</div>
                  <div>
                    <span
                      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                        roleStyles[profile.role]
                      }`}
                    >
                      {profile.role}
                    </span>
                  </div>
                  <div className="text-sm text-on-surface-variant">
                    {new Date(profile.created_at).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </div>
                  <div className="text-sm text-on-surface-variant">—</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
