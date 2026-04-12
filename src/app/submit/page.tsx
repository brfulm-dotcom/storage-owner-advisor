'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { createClient } from '@supabase/supabase-js';
import type { Category } from '@/lib/supabase';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function SubmitPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [formData, setFormData] = useState({
    companyName: '',
    website: '',
    category: '',
    contactEmail: '',
    phone: '',
    description: '',
    serviceArea: '' as '' | 'local' | 'national',
    city: '',
    state: '',
    yearFounded: '',
    logoUrl: '',
    features: '',
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Fetch categories from Supabase on mount
  useEffect(() => {
    async function loadCategories() {
      const { data } = await supabase
        .from('categories')
        .select('*')
        .order('name');
      if (data) setCategories(data);
    }
    loadCategories();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing again
    if (error) setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    // Auto-add https:// if missing
    let website = formData.website.trim();
    if (website && !website.startsWith('http://') && !website.startsWith('https://')) {
      website = 'https://' + website;
    }

    const { error: insertError } = await supabase
      .from('submissions')
      .insert({
        company_name: formData.companyName,
        website: website,
        category_slug: formData.category,
        contact_email: formData.contactEmail,
        phone: formData.phone,
        description: formData.description,
        service_area: formData.serviceArea || null,
        city: formData.city.trim() || null,
        state: formData.state.trim() || null,
        year_founded: formData.yearFounded ? parseInt(formData.yearFounded) : null,
        logo_url: formData.logoUrl.trim() || null,
        features: formData.features.trim() || null,
      });

    setIsSubmitting(false);

    if (insertError) {
      setError('Something went wrong. Please try again.');
      console.error('Submission error:', insertError);
      return;
    }

    // Send email notification (don't block on failure)
    fetch('/api/notify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: 'submission',
        data: {
          companyName: formData.companyName,
          website,
          category: formData.category,
          contactEmail: formData.contactEmail,
          phone: formData.phone,
          description: formData.description,
          serviceArea: formData.serviceArea,
          city: formData.city,
          state: formData.state,
          yearFounded: formData.yearFounded,
          logoUrl: formData.logoUrl,
          features: formData.features,
        },
      }),
    }).catch((err) => console.error('Notification error:', err));

    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      setFormData({
        companyName: '',
        website: '',
        category: '',
        contactEmail: '',
        phone: '',
        description: '',
        serviceArea: '',
        city: '',
        state: '',
        yearFounded: '',
        logoUrl: '',
        features: '',
      });
    }, 5000);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            Get Listed on StorageOwnerAdvisor
          </h1>
          <p className="text-xl text-gray-600">
            Reach thousands of storage facility owners looking for solutions
            like yours.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm p-8">
              {isSubmitted ? (
                <div className="text-center py-12">
                  <div className="text-5xl mb-4">✓</div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    Thank You!
                  </h2>
                  <p className="text-gray-600 mb-6">
                    We&apos;ve received your submission. Our team will review your
                    vendor profile and get in touch within 2-3 business days.
                  </p>
                  <p className="text-sm text-gray-500">
                    Redirecting back to form...
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label htmlFor="companyName" className="block text-sm font-semibold text-gray-900 mb-2">
                      Company Name *
                    </label>
                    <input type="text" id="companyName" name="companyName" value={formData.companyName} onChange={handleChange} required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Your company name" />
                  </div>
                  <div>
                    <label htmlFor="website" className="block text-sm font-semibold text-gray-900 mb-2">
                      Website *
                    </label>
                    <input type="text" id="website" name="website" value={formData.website} onChange={handleChange} required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="www.yourcompany.com" />
                  </div>
                  <div>
                    <label htmlFor="category" className="block text-sm font-semibold text-gray-900 mb-2">
                      Primary Category *
                    </label>
                    <select id="category" name="category" value={formData.category} onChange={handleChange} required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                      <option value="">Select a category</option>
                      {categories.map((cat) => (
                        <option key={cat.slug} value={cat.slug}>{cat.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label htmlFor="contactEmail" className="block text-sm font-semibold text-gray-900 mb-2">
                      Contact Email *
                    </label>
                    <input type="email" id="contactEmail" name="contactEmail" value={formData.contactEmail} onChange={handleChange} required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="contact@yourcompany.com" />
                  </div>
                  <div>
                    <label htmlFor="phone" className="block text-sm font-semibold text-gray-900 mb-2">
                      Phone *
                    </label>
                    <input type="tel" id="phone" name="phone" value={formData.phone} onChange={handleChange} required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="(555) 123-4567" />
                  </div>
                  <div>
                    <label htmlFor="description" className="block text-sm font-semibold text-gray-900 mb-2">
                      Brief Description *
                    </label>
                    <textarea id="description" name="description" value={formData.description} onChange={handleChange} required rows={6}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Tell us about your service and why storage facility owners should consider your solution..." />
                  </div>

                  {/* Additional Details Section */}
                  <div className="border-t border-gray-200 pt-6 mt-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-1">Additional Details</h3>
                    <p className="text-sm text-gray-500 mb-4">Optional but helps us create a better listing for you.</p>

                    <div className="space-y-6">
                      {/* Service Area */}
                      <div>
                        <label htmlFor="serviceArea" className="block text-sm font-semibold text-gray-900 mb-2">
                          Service Area
                        </label>
                        <select id="serviceArea" name="serviceArea" value={formData.serviceArea} onChange={handleChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                          <option value="">Select service area</option>
                          <option value="national">National — we serve customers across the country</option>
                          <option value="local">Local/Regional — we serve a specific area</option>
                        </select>
                      </div>

                      {/* City & State */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label htmlFor="city" className="block text-sm font-semibold text-gray-900 mb-2">
                            Headquarters City
                          </label>
                          <input type="text" id="city" name="city" value={formData.city} onChange={handleChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="e.g. Austin" />
                        </div>
                        <div>
                          <label htmlFor="state" className="block text-sm font-semibold text-gray-900 mb-2">
                            State
                          </label>
                          <input type="text" id="state" name="state" value={formData.state} onChange={handleChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="e.g. TX" maxLength={2} />
                        </div>
                      </div>

                      {/* Year Founded */}
                      <div>
                        <label htmlFor="yearFounded" className="block text-sm font-semibold text-gray-900 mb-2">
                          Year Founded
                        </label>
                        <input type="number" id="yearFounded" name="yearFounded" value={formData.yearFounded} onChange={handleChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="e.g. 2015" min="1900" max={new Date().getFullYear()} />
                      </div>

                      {/* Logo URL */}
                      <div>
                        <label htmlFor="logoUrl" className="block text-sm font-semibold text-gray-900 mb-2">
                          Logo URL
                        </label>
                        <input type="url" id="logoUrl" name="logoUrl" value={formData.logoUrl} onChange={handleChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="https://yoursite.com/logo.png" />
                        <p className="text-xs text-gray-400 mt-1">Link to your company logo (PNG or JPG, at least 200x200px recommended)</p>
                      </div>

                      {/* Key Features */}
                      <div>
                        <label htmlFor="features" className="block text-sm font-semibold text-gray-900 mb-2">
                          Key Features / Services
                        </label>
                        <input type="text" id="features" name="features" value={formData.features} onChange={handleChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="e.g. 24/7 Support, Mobile App, Revenue Sharing, Free Setup" />
                        <p className="text-xs text-gray-400 mt-1">Comma-separated list of your top features</p>
                      </div>
                    </div>
                  </div>

                  {error && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700 text-sm">
                      {error}
                    </div>
                  )}

                  <button type="submit" disabled={isSubmitting}
                    className="w-full bg-blue-600 text-white px-6 py-4 rounded-lg font-bold text-lg hover:bg-blue-700 transition-colors disabled:bg-blue-400 disabled:cursor-not-allowed">
                    {isSubmitting ? 'Submitting...' : 'Submit Vendor Profile'}
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Listing Types</h3>
              <div className="space-y-4">
                <div className="border border-gray-200 rounded-lg p-4">
                  <p className="font-bold text-gray-900 mb-2">Free Basic Listing</p>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>✓ Company name &amp; website</li>
                    <li>✓ One category</li>
                    <li>✓ Basic description</li>
                    <li>✓ Contact info</li>
                  </ul>
                </div>
                <div className="border-2 border-blue-600 rounded-lg p-4 bg-blue-50">
                  <p className="font-bold text-gray-900 mb-2">Premium Listing</p>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>✓ Everything in Basic</li>
                    <li>✓ Multiple categories</li>
                    <li>✓ Featured placement</li>
                    <li>✓ Premium badge</li>
                    <li>✓ Analytics dashboard</li>
                  </ul>
                  <p className="text-xs text-blue-600 font-semibold mt-4">Starting at $99/month</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-8">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Why Get Listed?</h3>
              <ul className="space-y-3 text-sm text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 font-bold mt-1">✓</span>
                  <span>Reach thousands of qualified storage facility buyers</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 font-bold mt-1">✓</span>
                  <span>Build credibility and trust in the industry</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 font-bold mt-1">✓</span>
                  <span>Get customer reviews and ratings</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 font-bold mt-1">✓</span>
                  <span>Increase visibility and inbound inquiries from decision makers</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
