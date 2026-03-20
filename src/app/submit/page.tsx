'use client';

import type { Metadata } from 'next';
import { useState } from 'react';
import Link from 'next/link';
import { categories } from '@/data/categories';

export default function SubmitPage() {
  const [formData, setFormData] = useState({
    companyName: '',
    website: '',
    category: '',
    contactEmail: '',
    phone: '',
    description: '',
  });

  const [isSubmitted, setIsSubmitted] = useState(false);

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
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real application, you would send this data to your backend
    console.log('Form submitted:', formData);
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
      });
    }, 3000);
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
                    We've received your submission. Our team will review your
                    vendor profile and get in touch within 2-3 business days.
                  </p>
                  <p className="text-sm text-gray-500">
                    Redirecting back to form...
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Company Name */}
                  <div>
                    <label
                      htmlFor="companyName"
                      className="block text-sm font-semibold text-gray-900 mb-2"
                    >
                      Company Name *
                    </label>
                    <input
                      type="text"
                      id="companyName"
                      name="companyName"
                      value={formData.companyName}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Your company name"
                    />
                  </div>

                  {/* Website */}
                  <div>
                    <label
                      htmlFor="website"
                      className="block text-sm font-semibold text-gray-900 mb-2"
                    >
                      Website *
                    </label>
                    <input
                      type="url"
                      id="website"
                      name="website"
                      value={formData.website}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="https://yourcompany.com"
                    />
                  </div>

                  {/* Category */}
                  <div>
                    <label
                      htmlFor="category"
                      className="block text-sm font-semibold text-gray-900 mb-2"
                    >
                      Primary Category *
                    </label>
                    <select
                      id="category"
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select a category</option>
                      {categories.map((cat) => (
                        <option key={cat.slug} value={cat.slug}>
                          {cat.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Contact Email */}
                  <div>
                    <label
                      htmlFor="contactEmail"
                      className="block text-sm font-semibold text-gray-900 mb-2"
                    >
                      Contact Email *
                    </label>
                    <input
                      type="email"
                      id="contactEmail"
                      name="contactEmail"
                      value={formData.contactEmail}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="contact@yourcompany.com"
                    />
                  </div>

                  {/* Phone */}
                  <div>
                    <label
                      htmlFor="phone"
                      className="block text-sm font-semibold text-gray-900 mb-2"
                    >
                      Phone *
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="(555) 123-4567"
                    />
                  </div>

                  {/* Description */}
                  <div>
                    <label
                      htmlFor="description"
                      className="block text-sm font-semibold text-gray-900 mb-2"
                    >
                      Brief Description *
                    </label>
                    <textarea
                      id="description"
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      required
                      rows={6}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Tell us about your service and why storage facility owners should consider your solution..."
                    />
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    className="w-full bg-blue-600 text-white px-6 py-4 rounded-lg font-bold text-lg hover:bg-blue-700 transition-colors"
                  >
                    Submit Vendor Profile
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Listing Types */}
            <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                Listing Types
              </h3>
              <div className="space-y-4">
                <div className="border border-gray-200 rounded-lg p-4">
                  <p className="font-bold text-gray-900 mb-2">
                    Free Basic Listing
                  </p>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>✓ Company name & website</li>
                    <li>✓ One category</li>
                    <li>✓ Basic description</li>
                    <li>✓ Contact info</li>
                  </ul>
                </div>
                <div className="border-2 border-blue-600 rounded-lg p-4 bg-blue-50">
                  <p className="font-bold text-gray-900 mb-2">
                    Premium Listing
                  </p>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>✓ Everything in Basic</li>
                    <li>✓ Multiple categories</li>
                    <li>✓ Featured placement</li>
                    <li>✓ Premium badge</li>
                    <li>✓ Analytics dashboard</li>
                  </ul>
                  <p className="text-xs text-blue-600 font-semibold mt-4">
                    Starting at $99/month
                  </p>
                </div>
              </div>
            </div>

            {/* Benefits */}
            <div className="bg-white rounded-lg shadow-sm p-8">
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                Why Get Listed?
              </h3>
              <ul className="space-y-3 text-sm text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 font-bold mt-1">✓</span>
                  <span>
                    Reach thousands of qualified storage facility buyers
                  </span>
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
                  <span>
                    Increase visibility and inbound inquiries from decision
                    makers
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 font-bold mt-1">✓</span>
                  <span>
                    Monitor your profile performance with analytics
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
