'use client';

import { useState } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface ClaimListingProps {
  vendorSlug: string;
  vendorName: string;
}

export default function ClaimListing({ vendorSlug, vendorName }: ClaimListingProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    contactName: '',
    contactEmail: '',
    contactPhone: '',
    jobTitle: '',
    message: '',
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (error) setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    const { error: insertError } = await supabase
      .from('claims')
      .insert({
        vendor_slug: vendorSlug,
        vendor_name: vendorName,
        contact_name: formData.contactName,
        contact_email: formData.contactEmail,
        contact_phone: formData.contactPhone || null,
        job_title: formData.jobTitle || null,
        message: formData.message || null,
      });

    setIsSubmitting(false);

    if (insertError) {
      setError('Something went wrong. Please try again.');
      console.error('Claim error:', insertError);
      return;
    }

    // Send email notification (don't block on failure)
    fetch('/api/notify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: 'claim',
        data: {
          vendorName,
          vendorSlug,
          contactName: formData.contactName,
          contactEmail: formData.contactEmail,
          contactPhone: formData.contactPhone,
          jobTitle: formData.jobTitle,
          message: formData.message,
        },
      }),
    }).catch((err) => console.error('Notification error:', err));

    setIsSubmitted(true);
  };

  if (isSubmitted) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
        <div className="text-3xl mb-2">✓</div>
        <h3 className="text-lg font-bold text-green-800 mb-2">Claim Submitted!</h3>
        <p className="text-sm text-green-700">
          We&apos;ll review your claim and get in touch within 1-2 business days to verify your ownership.
        </p>
      </div>
    );
  }

  if (!isOpen) {
    return (
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-2">
          Is this your business?
        </h3>
        <p className="text-sm text-gray-600 mb-4">
          Claim this listing to update your info, respond to reviews, and unlock premium features.
        </p>
        <button
          onClick={() => setIsOpen(true)}
          className="w-full bg-amber-500 text-white px-6 py-3 rounded-lg font-bold hover:bg-amber-600 transition-colors"
        >
          Claim This Listing
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-gray-900">Claim This Listing</h3>
        <button
          onClick={() => setIsOpen(false)}
          className="text-gray-400 hover:text-gray-600 text-xl"
        >
          &times;
        </button>
      </div>
      <p className="text-sm text-gray-600 mb-4">
        Verify that you represent <strong>{vendorName}</strong> to manage this listing.
      </p>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="contactName" className="block text-sm font-semibold text-gray-700 mb-1">
            Your Name *
          </label>
          <input
            type="text" id="contactName" name="contactName"
            value={formData.contactName} onChange={handleChange} required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
            placeholder="Jane Smith"
          />
        </div>
        <div>
          <label htmlFor="contactEmail" className="block text-sm font-semibold text-gray-700 mb-1">
            Business Email *
          </label>
          <input
            type="email" id="contactEmail" name="contactEmail"
            value={formData.contactEmail} onChange={handleChange} required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
            placeholder="jane@company.com"
          />
        </div>
        <div>
          <label htmlFor="contactPhone" className="block text-sm font-semibold text-gray-700 mb-1">
            Phone
          </label>
          <input
            type="tel" id="contactPhone" name="contactPhone"
            value={formData.contactPhone} onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
            placeholder="(555) 123-4567"
          />
        </div>
        <div>
          <label htmlFor="jobTitle" className="block text-sm font-semibold text-gray-700 mb-1">
            Job Title
          </label>
          <input
            type="text" id="jobTitle" name="jobTitle"
            value={formData.jobTitle} onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
            placeholder="Marketing Manager"
          />
        </div>
        <div>
          <label htmlFor="message" className="block text-sm font-semibold text-gray-700 mb-1">
            Message (optional)
          </label>
          <textarea
            id="message" name="message"
            value={formData.message} onChange={handleChange} rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
            placeholder="Any additional info to help us verify your ownership..."
          />
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-red-700 text-sm">
            {error}
          </div>
        )}

        <button
          type="submit" disabled={isSubmitting}
          className="w-full bg-amber-500 text-white px-6 py-3 rounded-lg font-bold hover:bg-amber-600 transition-colors disabled:bg-amber-300 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Submitting...' : 'Submit Claim'}
        </button>
      </form>
    </div>
  );
}
