'use client';

import { useState, useEffect, useCallback } from 'react';

// =============================================================
// ADMIN DASHBOARD
// Password-protected page for managing submissions, claims,
// and contact messages. No link to this page from the public site.
// Access directly at: /admin
// =============================================================

interface Submission {
  id: number;
  company_name: string;
  website: string;
  category_slug: string;
  contact_email: string;
  phone: string;
  description: string;
  status: 'pending' | 'approved' | 'rejected';
  submitted_at: string;
}

interface Claim {
  id: number;
  vendor_slug: string;
  vendor_name: string;
  contact_name: string;
  contact_email: string;
  contact_phone: string | null;
  job_title: string | null;
  message: string | null;
  status: 'pending' | 'approved' | 'rejected';
  submitted_at: string;
}

interface ContactMessage {
  id: number;
  name: string;
  email: string;
  subject: string;
  message: string;
  submitted_at: string;
}

interface Subscriber {
  id: number;
  email: string;
  subscribed_at: string;
}

interface ClickData {
  vendor_name: string;
  vendor_slug: string;
  total_clicks: number;
  website_clicks: number;
  affiliate_clicks: number;
  details_clicks: number;
}

interface BlogPost {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  category_slug: string | null;
  author: string;
  meta_description: string | null;
  status: 'draft' | 'published';
  published_at: string | null;
  created_at: string;
}

type Tab = 'submissions' | 'claims' | 'contacts' | 'newsletter' | 'analytics' | 'blog';

export default function AdminPage() {
  // ---- Auth State ----
  const [password, setPassword] = useState('');
  const [authenticated, setAuthenticated] = useState(false);
  const [authError, setAuthError] = useState('');

  // ---- Tab State ----
  const [activeTab, setActiveTab] = useState<Tab>('submissions');

  // ---- Data State ----
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [claims, setClaims] = useState<Claim[]>([]);
  const [contacts, setContacts] = useState<ContactMessage[]>([]);
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [clickData, setClickData] = useState<ClickData[]>([]);
  const [totalClicks, setTotalClicks] = useState(0);
  const [loading, setLoading] = useState(false);
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [showPostForm, setShowPostForm] = useState(false);
  const [postForm, setPostForm] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    category_slug: '',
    author: 'StorageOwnerAdvisor Team',
    meta_description: '',
    status: 'draft' as 'draft' | 'published',
  });
  const [showPreview, setShowPreview] = useState(false);

  // ---- Stored password for API calls ----
  const [storedPassword, setStoredPassword] = useState('');

  // ---- API helper ----
  const apiCall = useCallback(async (method: string, params?: Record<string, string>, body?: object) => {
    const url = params
      ? `/api/admin?${new URLSearchParams(params).toString()}`
      : '/api/admin';

    const res = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        'x-admin-password': storedPassword,
      },
      ...(body ? { body: JSON.stringify(body) } : {}),
    });

    return res.json();
  }, [storedPassword]);

  // ---- Login ----
  const handleLogin = async () => {
    setAuthError('');
    const res = await fetch('/api/admin?table=submissions', {
      headers: { 'x-admin-password': password },
    });

    if (res.ok) {
      setAuthenticated(true);
      setStoredPassword(password);
    } else {
      const data = await res.json().catch(() => ({}));
      setAuthError(`Login failed (${res.status}): ${data.error || 'Unknown error'}. Please try again.`);
    }
  };

  // ---- Fetch data when authenticated or tab changes ----
  const fetchData = useCallback(async () => {
    if (!authenticated) return;
    setLoading(true);

    try {
      if (activeTab === 'analytics') {
        const result = await apiCall('GET', { table: 'vendor_clicks' });
        if (result.data) {
          // Aggregate clicks by vendor
          const map = new Map<string, ClickData>();
          for (const click of result.data) {
            const existing = map.get(click.vendor_slug) || {
              vendor_name: click.vendor_name,
              vendor_slug: click.vendor_slug,
              total_clicks: 0,
              website_clicks: 0,
              affiliate_clicks: 0,
              details_clicks: 0,
            };
            existing.total_clicks++;
            if (click.click_type === 'website') existing.website_clicks++;
            if (click.click_type === 'affiliate') existing.affiliate_clicks++;
            if (click.click_type === 'details') existing.details_clicks++;
            map.set(click.vendor_slug, existing);
          }
          const sorted = Array.from(map.values()).sort((a, b) => b.total_clicks - a.total_clicks);
          setClickData(sorted);
          setTotalClicks(result.data.length);
        }
      } else {
        const tableMap: Record<string, string> = {
          submissions: 'submissions',
          claims: 'claims',
          contacts: 'contact_messages',
          newsletter: 'newsletter_subscribers',
          blog: 'blog_posts',
        };

        const result = await apiCall('GET', { table: tableMap[activeTab] });

        if (result.data) {
          switch (activeTab) {
            case 'submissions':
              setSubmissions(result.data);
              break;
            case 'claims':
              setClaims(result.data);
              break;
            case 'contacts':
              setContacts(result.data);
              break;
            case 'newsletter':
              setSubscribers(result.data);
              break;
            case 'blog':
              setBlogPosts(result.data);
              break;
          }
        }
      }
    } catch (err) {
      console.error('Error fetching data:', err);
    }

    setLoading(false);
  }, [authenticated, activeTab, apiCall]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // ---- Update status ----
  const updateStatus = async (table: string, id: number, status: string) => {
    await apiCall('PATCH', undefined, { table, id, status });
    fetchData();
  };

  // ---- Approve/Reject claims with email ----
  const approveClaim = async (claimId: number) => {
    if (!confirm('Approve this claim? An email with an edit link will be sent to the vendor.')) return;
    try {
      const result = await apiCall('POST', undefined, { action: 'approve_claim', claimId });
      if (result.success) {
        alert('Claim approved! Edit link emailed to vendor.');
        fetchData();
      } else {
        alert('Error: ' + (result.error || 'Unknown error'));
      }
    } catch {
      alert('Failed to approve claim.');
    }
  };

  const rejectClaim = async (claimId: number) => {
    const reason = prompt('Optional: Enter a reason for rejection (or leave blank):');
    if (reason === null) return; // cancelled
    try {
      const result = await apiCall('POST', undefined, { action: 'reject_claim', claimId, reason });
      if (result.success) {
        alert('Claim rejected. Notification emailed to vendor.');
        fetchData();
      } else {
        alert('Error: ' + (result.error || 'Unknown error'));
      }
    } catch {
      alert('Failed to reject claim.');
    }
  };

  // ---- Delete record ----
  const deleteRecord = async (table: string, id: number) => {
    if (!confirm('Are you sure you want to delete this record?')) return;
    await apiCall('DELETE', undefined, { table, id });
    fetchData();
  };

  // ---- Blog post helpers ----
  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  };

  const openNewPostForm = () => {
    setEditingPost(null);
    setPostForm({
      title: '',
      slug: '',
      excerpt: '',
      content: '',
      category_slug: '',
      author: 'StorageOwnerAdvisor Team',
      meta_description: '',
      status: 'draft',
    });
    setShowPostForm(true);
    setShowPreview(false);
  };

  const openEditPostForm = (post: BlogPost) => {
    setEditingPost(post);
    setPostForm({
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt,
      content: post.content,
      category_slug: post.category_slug || '',
      author: post.author,
      meta_description: post.meta_description || '',
      status: post.status,
    });
    setShowPostForm(true);
    setShowPreview(false);
  };

  const savePost = async () => {
    if (!postForm.title || !postForm.slug || !postForm.content) {
      alert('Title, slug, and content are required.');
      return;
    }

    try {
      if (editingPost) {
        // Update existing
        await apiCall('PATCH', undefined, {
          table: 'blog_posts',
          id: editingPost.id,
          ...postForm,
          category_slug: postForm.category_slug || null,
          meta_description: postForm.meta_description || null,
          published_at: postForm.status === 'published' && !editingPost.published_at
            ? new Date().toISOString()
            : editingPost.published_at,
        });
        alert('Post updated!');
      } else {
        // Create new
        await apiCall('POST', undefined, {
          action: 'create_blog_post',
          ...postForm,
          category_slug: postForm.category_slug || null,
          meta_description: postForm.meta_description || null,
          published_at: postForm.status === 'published' ? new Date().toISOString() : null,
        });
        alert('Post created!');
      }
      setShowPostForm(false);
      setEditingPost(null);
      fetchData();
    } catch {
      alert('Failed to save post.');
    }
  };

  // ---- Format date ----
  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    });
  };

  // ---- Status badge colors ----
  const statusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'approved': case 'verified': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'contacted': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // ---- Count badges for tabs ----
  const pendingSubmissions = submissions.filter(s => s.status === 'pending').length;
  const pendingClaims = claims.filter(c => c.status === 'pending').length;

  // ==========================================
  // LOGIN SCREEN
  // ==========================================
  if (!authenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8">
          <h1 className="text-2xl font-bold text-gray-900 text-center mb-2">Admin Dashboard</h1>
          <p className="text-gray-500 text-center mb-6">StorageOwnerAdvisor</p>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter admin password"
              />
            </div>

            {authError && (
              <p className="text-red-600 text-sm">{authError}</p>
            )}

            <button
              onClick={handleLogin}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors"
            >
              Log In
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ==========================================
  // ADMIN DASHBOARD
  // ==========================================
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="text-sm text-gray-500">StorageOwnerAdvisor</p>
          </div>
          <a
            href="/"
            className="text-sm text-blue-600 hover:text-blue-700 font-medium"
          >
            ← Back to Site
          </a>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8">
            <button
              onClick={() => setActiveTab('submissions')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'submissions'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Submissions
              {pendingSubmissions > 0 && (
                <span className="ml-2 bg-yellow-100 text-yellow-800 text-xs font-semibold px-2 py-0.5 rounded-full">
                  {pendingSubmissions}
                </span>
              )}
            </button>
            <button
              onClick={() => setActiveTab('claims')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'claims'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Claims
              {pendingClaims > 0 && (
                <span className="ml-2 bg-yellow-100 text-yellow-800 text-xs font-semibold px-2 py-0.5 rounded-full">
                  {pendingClaims}
                </span>
              )}
            </button>
            <button
              onClick={() => setActiveTab('contacts')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'contacts'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Contact Messages
            </button>
            <button
              onClick={() => setActiveTab('newsletter')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'newsletter'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Newsletter
              {subscribers.length > 0 && (
                <span className="ml-2 bg-green-100 text-green-800 text-xs font-semibold px-2 py-0.5 rounded-full">
                  {subscribers.length}
                </span>
              )}
            </button>
            <button
              onClick={() => setActiveTab('analytics')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'analytics'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Analytics
              {totalClicks > 0 && (
                <span className="ml-2 bg-purple-100 text-purple-800 text-xs font-semibold px-2 py-0.5 rounded-full">
                  {totalClicks}
                </span>
              )}
            </button>
            <button
              onClick={() => setActiveTab('blog')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'blog'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Blog
              {blogPosts.length > 0 && (
                <span className="ml-2 bg-indigo-100 text-indigo-800 text-xs font-semibold px-2 py-0.5 rounded-full">
                  {blogPosts.length}
                </span>
              )}
            </button>
          </nav>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
        <div className="flex justify-end">
          <button
            onClick={async () => {
              try {
                const result = await apiCall('POST', undefined, { action: 'revalidate_seo' });
                if (result.success) {
                  alert('SEO pages refreshed! New vendors and changes are now live.');
                } else {
                  alert('Error: ' + (result.error || 'Unknown error'));
                }
              } catch {
                alert('Failed to revalidate SEO pages.');
              }
            }}
            className="bg-teal-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-teal-700 transition-colors"
          >
            Refresh SEO Pages
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-500 border-t-transparent"></div>
            <p className="mt-2 text-gray-500">Loading...</p>
          </div>
        ) : (
          <>
            {/* ======== SUBMISSIONS TAB ======== */}
            {activeTab === 'submissions' && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-semibold text-gray-900">
                    Vendor Submissions ({submissions.length})
                  </h2>
                  <button
                    onClick={fetchData}
                    className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                  >
                    Refresh
                  </button>
                </div>

                {submissions.length === 0 ? (
                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
                    <p className="text-gray-500">No submissions yet.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {submissions.map((sub) => (
                      <div key={sub.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="text-lg font-semibold text-gray-900">{sub.company_name}</h3>
                              <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${statusColor(sub.status)}`}>
                                {sub.status}
                              </span>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-gray-600">
                              <div><span className="font-medium">Website:</span>{' '}
                                <a href={sub.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">{sub.website}</a>
                              </div>
                              <div><span className="font-medium">Category:</span> {sub.category_slug}</div>
                              <div><span className="font-medium">Email:</span>{' '}
                                <a href={`mailto:${sub.contact_email}`} className="text-blue-600 hover:underline">{sub.contact_email}</a>
                              </div>
                              <div><span className="font-medium">Phone:</span> {sub.phone}</div>
                            </div>
                            <p className="mt-2 text-sm text-gray-600">
                              <span className="font-medium">Description:</span> {sub.description}
                            </p>
                            <p className="mt-2 text-xs text-gray-400">{formatDate(sub.submitted_at)}</p>

                            {/* Research Links */}
                            <div className="mt-3 pt-3 border-t border-gray-100">
                              <p className="text-xs font-medium text-gray-500 mb-2">Research this vendor:</p>
                              <div className="flex flex-wrap gap-2">
                                <a
                                  href={`https://www.google.com/search?q=${encodeURIComponent('"' + sub.company_name + '" reviews')}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center px-2.5 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs rounded-md transition-colors"
                                >
                                  Reviews
                                </a>
                                <a
                                  href={`https://www.google.com/search?q=${encodeURIComponent('"' + sub.company_name + '" BBB')}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center px-2.5 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs rounded-md transition-colors"
                                >
                                  BBB
                                </a>
                                <a
                                  href={`https://www.google.com/search?q=${encodeURIComponent('"' + sub.company_name + '" complaints')}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center px-2.5 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs rounded-md transition-colors"
                                >
                                  Complaints
                                </a>
                                <a
                                  href={`https://www.trustpilot.com/search?query=${encodeURIComponent(sub.company_name)}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center px-2.5 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs rounded-md transition-colors"
                                >
                                  Trustpilot
                                </a>
                                <a
                                  href={`https://www.google.com/search?q=${encodeURIComponent('"' + sub.company_name + '" self storage')}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center px-2.5 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs rounded-md transition-colors"
                                >
                                  Industry
                                </a>
                                <a
                                  href={sub.website.startsWith('http') ? sub.website : `https://${sub.website}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center px-2.5 py-1 bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs rounded-md transition-colors"
                                >
                                  Visit Website
                                </a>
                              </div>
                            </div>
                          </div>

                          <div className="flex flex-wrap gap-2 sm:flex-col">
                            {sub.status !== 'approved' && (
                              <button
                                onClick={() => updateStatus('submissions', sub.id, 'approved')}
                                className="px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white text-sm rounded-md transition-colors"
                              >
                                Approve
                              </button>
                            )}
                            {sub.status !== 'rejected' && (
                              <button
                                onClick={() => updateStatus('submissions', sub.id, 'rejected')}
                                className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white text-sm rounded-md transition-colors"
                              >
                                Reject
                              </button>
                            )}
                            {sub.status !== 'pending' && (
                              <button
                                onClick={() => updateStatus('submissions', sub.id, 'pending')}
                                className="px-3 py-1.5 bg-gray-200 hover:bg-gray-300 text-gray-700 text-sm rounded-md transition-colors"
                              >
                                Reset
                              </button>
                            )}
                            <button
                              onClick={() => deleteRecord('submissions', sub.id)}
                              className="px-3 py-1.5 bg-white hover:bg-red-50 text-red-600 text-sm rounded-md border border-red-300 transition-colors"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* ======== CLAIMS TAB ======== */}
            {activeTab === 'claims' && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-semibold text-gray-900">
                    Claim Requests ({claims.length})
                  </h2>
                  <button
                    onClick={fetchData}
                    className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                  >
                    Refresh
                  </button>
                </div>

                {claims.length === 0 ? (
                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
                    <p className="text-gray-500">No claim requests yet.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {claims.map((claim) => (
                      <div key={claim.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="text-lg font-semibold text-gray-900">{claim.vendor_name}</h3>
                              <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${statusColor(claim.status)}`}>
                                {claim.status}
                              </span>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-gray-600">
                              <div><span className="font-medium">Contact:</span> {claim.contact_name}</div>
                              <div><span className="font-medium">Job Title:</span> {claim.job_title || 'Not provided'}</div>
                              <div><span className="font-medium">Email:</span>{' '}
                                <a href={`mailto:${claim.contact_email}`} className="text-blue-600 hover:underline">{claim.contact_email}</a>
                              </div>
                              <div><span className="font-medium">Phone:</span> {claim.contact_phone || 'Not provided'}</div>
                              <div><span className="font-medium">Vendor Slug:</span> {claim.vendor_slug}</div>
                            </div>
                            {claim.message && (
                              <p className="mt-2 text-sm text-gray-600">
                                <span className="font-medium">Message:</span> {claim.message}
                              </p>
                            )}
                            <p className="mt-2 text-xs text-gray-400">{formatDate(claim.submitted_at)}</p>
                          </div>

                          <div className="flex flex-wrap gap-2 sm:flex-col">
                            {claim.status === 'pending' && (
                              <>
                                <button
                                  onClick={() => approveClaim(claim.id)}
                                  className="px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white text-sm rounded-md transition-colors"
                                >
                                  Approve & Send Edit Link
                                </button>
                                <button
                                  onClick={() => rejectClaim(claim.id)}
                                  className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white text-sm rounded-md transition-colors"
                                >
                                  Reject
                                </button>
                              </>
                            )}
                            {claim.status === 'approved' && (
                              <span className="text-xs text-green-700 bg-green-50 px-3 py-1.5 rounded-md">
                                Edit link sent to vendor
                              </span>
                            )}
                            {claim.status === 'rejected' && (
                              <button
                                onClick={() => updateStatus('claims', claim.id, 'pending')}
                                className="px-3 py-1.5 bg-gray-200 hover:bg-gray-300 text-gray-700 text-sm rounded-md transition-colors"
                              >
                                Reset to Pending
                              </button>
                            )}
                            <button
                              onClick={() => deleteRecord('claims', claim.id)}
                              className="px-3 py-1.5 bg-white hover:bg-red-50 text-red-600 text-sm rounded-md border border-red-300 transition-colors"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* ======== CONTACTS TAB ======== */}
            {activeTab === 'contacts' && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-semibold text-gray-900">
                    Contact Messages ({contacts.length})
                  </h2>
                  <button
                    onClick={fetchData}
                    className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                  >
                    Refresh
                  </button>
                </div>

                {contacts.length === 0 ? (
                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
                    <p className="text-gray-500">No contact messages yet.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {contacts.map((msg) => (
                      <div key={msg.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                          <div className="flex-1 min-w-0">
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">{msg.subject}</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-gray-600">
                              <div><span className="font-medium">From:</span> {msg.name}</div>
                              <div><span className="font-medium">Email:</span>{' '}
                                <a href={`mailto:${msg.email}`} className="text-blue-600 hover:underline">{msg.email}</a>
                              </div>
                            </div>
                            <p className="mt-3 text-sm text-gray-700 bg-gray-50 rounded-md p-3">
                              {msg.message}
                            </p>
                            <p className="mt-2 text-xs text-gray-400">{formatDate(msg.submitted_at)}</p>
                          </div>

                          <div className="flex flex-wrap gap-2 sm:flex-col">
                            <a
                              href={`mailto:${msg.email}?subject=Re: ${msg.subject}`}
                              className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-md transition-colors text-center"
                            >
                              Reply
                            </a>
                            <button
                              onClick={() => deleteRecord('contact_messages', msg.id)}
                              className="px-3 py-1.5 bg-white hover:bg-red-50 text-red-600 text-sm rounded-md border border-red-300 transition-colors"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* ======== ANALYTICS TAB ======== */}
            {activeTab === 'analytics' && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-semibold text-gray-900">
                    Click Analytics ({totalClicks} total clicks)
                  </h2>
                  <button
                    onClick={fetchData}
                    className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                  >
                    Refresh
                  </button>
                </div>

                {/* Summary Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                    <p className="text-sm text-gray-500">Total Clicks</p>
                    <p className="text-2xl font-bold text-gray-900">{totalClicks}</p>
                  </div>
                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                    <p className="text-sm text-gray-500">Website Clicks</p>
                    <p className="text-2xl font-bold text-blue-600">
                      {clickData.reduce((sum, v) => sum + v.website_clicks, 0)}
                    </p>
                  </div>
                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                    <p className="text-sm text-gray-500">Affiliate Clicks</p>
                    <p className="text-2xl font-bold text-green-600">
                      {clickData.reduce((sum, v) => sum + v.affiliate_clicks, 0)}
                    </p>
                  </div>
                </div>

                {clickData.length === 0 ? (
                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
                    <p className="text-gray-500">No clicks tracked yet. Clicks will appear here as visitors click &quot;Visit Website&quot; and &quot;Details&quot; on vendor listings.</p>
                  </div>
                ) : (
                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vendor</th>
                          <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                          <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Website</th>
                          <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Affiliate</th>
                          <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Details</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {clickData.map((vendor) => (
                          <tr key={vendor.vendor_slug}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              {vendor.vendor_name}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-center font-bold text-gray-900">
                              {vendor.total_clicks}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-blue-600">
                              {vendor.website_clicks}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-green-600">
                              {vendor.affiliate_clicks}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-600">
                              {vendor.details_clicks}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {/* ======== NEWSLETTER TAB ======== */}
            {activeTab === 'newsletter' && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-semibold text-gray-900">
                    Newsletter Subscribers ({subscribers.length})
                  </h2>
                  <button
                    onClick={fetchData}
                    className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                  >
                    Refresh
                  </button>
                </div>

                {subscribers.length === 0 ? (
                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
                    <p className="text-gray-500">No subscribers yet.</p>
                  </div>
                ) : (
                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subscribed</th>
                          <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {subscribers.map((sub) => (
                          <tr key={sub.id}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                              <a href={`mailto:${sub.email}`} className="text-blue-600 hover:underline">{sub.email}</a>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {formatDate(sub.subscribed_at)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                              <button
                                onClick={() => deleteRecord('newsletter_subscribers', sub.id)}
                                className="text-red-600 hover:text-red-800 font-medium"
                              >
                                Remove
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {/* ======== BLOG TAB ======== */}
            {activeTab === 'blog' && (
              <div>
                {showPostForm ? (
                  /* ---- Post Editor Form ---- */
                  <div>
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-lg font-semibold text-gray-900">
                        {editingPost ? 'Edit Post' : 'New Post'}
                      </h2>
                      <button
                        onClick={() => { setShowPostForm(false); setEditingPost(null); }}
                        className="text-sm text-gray-600 hover:text-gray-800 font-medium"
                      >
                        Cancel
                      </button>
                    </div>

                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 space-y-4">
                      {/* Title */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                        <input
                          type="text"
                          value={postForm.title}
                          onChange={(e) => {
                            const title = e.target.value;
                            setPostForm(prev => ({
                              ...prev,
                              title,
                              slug: editingPost ? prev.slug : generateSlug(title),
                            }));
                          }}
                          className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Post title"
                        />
                      </div>

                      {/* Slug */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Slug (URL)</label>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-gray-500">/blog/</span>
                          <input
                            type="text"
                            value={postForm.slug}
                            onChange={(e) => setPostForm(prev => ({ ...prev, slug: e.target.value }))}
                            className="flex-1 border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="post-url-slug"
                          />
                        </div>
                      </div>

                      {/* Category & Status row */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Category (optional)</label>
                          <input
                            type="text"
                            value={postForm.category_slug}
                            onChange={(e) => setPostForm(prev => ({ ...prev, category_slug: e.target.value }))}
                            className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="e.g. management-software"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Author</label>
                          <input
                            type="text"
                            value={postForm.author}
                            onChange={(e) => setPostForm(prev => ({ ...prev, author: e.target.value }))}
                            className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                          <select
                            value={postForm.status}
                            onChange={(e) => setPostForm(prev => ({ ...prev, status: e.target.value as 'draft' | 'published' }))}
                            className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                          >
                            <option value="draft">Draft</option>
                            <option value="published">Published</option>
                          </select>
                        </div>
                      </div>

                      {/* Excerpt */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Excerpt (shown on blog listing)</label>
                        <textarea
                          value={postForm.excerpt}
                          onChange={(e) => setPostForm(prev => ({ ...prev, excerpt: e.target.value }))}
                          rows={2}
                          className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="A brief summary of the post..."
                        />
                      </div>

                      {/* Meta Description */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Meta Description (SEO) <span className="text-gray-400 font-normal">— {postForm.meta_description.length}/160</span>
                        </label>
                        <input
                          type="text"
                          value={postForm.meta_description}
                          onChange={(e) => setPostForm(prev => ({ ...prev, meta_description: e.target.value }))}
                          maxLength={160}
                          className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="SEO description (max 160 characters)"
                        />
                      </div>

                      {/* Content with Preview toggle */}
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <label className="block text-sm font-medium text-gray-700">Content (HTML)</label>
                          <button
                            onClick={() => setShowPreview(!showPreview)}
                            className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                          >
                            {showPreview ? 'Edit' : 'Preview'}
                          </button>
                        </div>
                        {showPreview ? (
                          <div className="border border-gray-300 rounded-md p-6 min-h-[300px] bg-white prose prose-lg max-w-none prose-headings:text-gray-900 prose-p:text-gray-700 prose-a:text-blue-600 prose-li:text-gray-700 prose-strong:text-gray-900"
                            dangerouslySetInnerHTML={{ __html: postForm.content }}
                          />
                        ) : (
                          <textarea
                            value={postForm.content}
                            onChange={(e) => setPostForm(prev => ({ ...prev, content: e.target.value }))}
                            rows={20}
                            className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono text-sm"
                            placeholder="<h2>Your heading</h2>\n<p>Your content...</p>"
                          />
                        )}
                      </div>

                      {/* Action buttons */}
                      <div className="flex items-center gap-3 pt-2">
                        <button
                          onClick={savePost}
                          className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-colors"
                        >
                          {editingPost ? 'Update Post' : 'Create Post'}
                        </button>
                        <button
                          onClick={() => { setShowPostForm(false); setEditingPost(null); }}
                          className="px-6 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium rounded-md transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  /* ---- Post List ---- */
                  <div>
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-lg font-semibold text-gray-900">
                        Blog Posts ({blogPosts.length})
                      </h2>
                      <div className="flex items-center gap-3">
                        <button
                          onClick={fetchData}
                          className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                        >
                          Refresh
                        </button>
                        <button
                          onClick={openNewPostForm}
                          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-md transition-colors"
                        >
                          + New Post
                        </button>
                      </div>
                    </div>

                    {blogPosts.length === 0 ? (
                      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
                        <p className="text-gray-500 mb-4">No blog posts yet.</p>
                        <button
                          onClick={openNewPostForm}
                          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-md transition-colors"
                        >
                          Create Your First Post
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {blogPosts.map((post) => (
                          <div key={post.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-3 mb-1">
                                  <h3 className="text-base font-semibold text-gray-900 truncate">{post.title}</h3>
                                  <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full flex-shrink-0 ${
                                    post.status === 'published'
                                      ? 'bg-green-100 text-green-800'
                                      : 'bg-yellow-100 text-yellow-800'
                                  }`}>
                                    {post.status}
                                  </span>
                                </div>
                                <div className="flex items-center gap-3 text-sm text-gray-500">
                                  <span>/blog/{post.slug}</span>
                                  {post.category_slug && (
                                    <>
                                      <span>·</span>
                                      <span className="capitalize">{post.category_slug.replace(/-/g, ' ')}</span>
                                    </>
                                  )}
                                  {post.published_at && (
                                    <>
                                      <span>·</span>
                                      <span>{formatDate(post.published_at)}</span>
                                    </>
                                  )}
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                {post.status === 'published' && (
                                  <a
                                    href={`/blog/${post.slug}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm rounded-md transition-colors"
                                  >
                                    View
                                  </a>
                                )}
                                <button
                                  onClick={() => openEditPostForm(post)}
                                  className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-md transition-colors"
                                >
                                  Edit
                                </button>
                                <button
                                  onClick={() => deleteRecord('blog_posts', post.id)}
                                  className="px-3 py-1.5 bg-white hover:bg-red-50 text-red-600 text-sm rounded-md border border-red-300 transition-colors"
                                >
                                  Delete
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
