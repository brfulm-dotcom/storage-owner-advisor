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
  created_at: string;
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
  status: 'pending' | 'contacted' | 'verified' | 'rejected';
  created_at: string;
}

interface ContactMessage {
  id: number;
  name: string;
  email: string;
  subject: string;
  message: string;
  submitted_at: string;
}

type Tab = 'submissions' | 'claims' | 'contacts';

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
  const [loading, setLoading] = useState(false);

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
      setAuthError('Incorrect password. Please try again.');
    }
  };

  // ---- Fetch data when authenticated or tab changes ----
  const fetchData = useCallback(async () => {
    if (!authenticated) return;
    setLoading(true);

    try {
      const tableMap: Record<Tab, string> = {
        submissions: 'submissions',
        claims: 'claims',
        contacts: 'contact_messages',
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

  // ---- Delete record ----
  const deleteRecord = async (table: string, id: number) => {
    if (!confirm('Are you sure you want to delete this record?')) return;
    await apiCall('DELETE', undefined, { table, id });
    fetchData();
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
          </nav>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
                            <p className="mt-2 text-xs text-gray-400">{formatDate(sub.created_at)}</p>
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
                            <p className="mt-2 text-xs text-gray-400">{formatDate(claim.created_at)}</p>
                          </div>

                          <div className="flex flex-wrap gap-2 sm:flex-col">
                            {claim.status !== 'contacted' && (
                              <button
                                onClick={() => updateStatus('claims', claim.id, 'contacted')}
                                className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-md transition-colors"
                              >
                                Contacted
                              </button>
                            )}
                            {claim.status !== 'verified' && (
                              <button
                                onClick={() => updateStatus('claims', claim.id, 'verified')}
                                className="px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white text-sm rounded-md transition-colors"
                              >
                                Verified
                              </button>
                            )}
                            {claim.status !== 'rejected' && (
                              <button
                                onClick={() => updateStatus('claims', claim.id, 'rejected')}
                                className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white text-sm rounded-md transition-colors"
                              >
                                Reject
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
          </>
        )}
      </div>
    </div>
  );
}
