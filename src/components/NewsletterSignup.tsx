'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function NewsletterSignup() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setSubmitting(true);
    setError('');

    // Save to Supabase
    const { error: dbError } = await supabase
      .from('newsletter_subscribers')
      .insert([{ email }]);

    if (dbError) {
      if (dbError.message.includes('duplicate') || dbError.code === '23505') {
        setError('You are already subscribed!');
      } else {
        setError('Something went wrong. Please try again.');
        console.error('Newsletter signup error:', dbError);
      }
      setSubmitting(false);
      return;
    }

    // Send email notification (fire-and-forget)
    fetch('/api/notify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: 'newsletter',
        data: { email },
      }),
    }).catch(() => {});

    setSubscribed(true);
    setEmail('');
    setSubmitting(false);
    setTimeout(() => setSubscribed(false), 5000);
  };

  return (
    <section className="py-8 sm:py-10 bg-gradient-to-r from-gray-900 to-gray-800">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Heading */}
        <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">
          Stay Updated
        </h2>

        {/* Description */}
        <p className="text-base text-gray-300 mb-5">
          Get the latest vendor reviews, industry news, and exclusive deals delivered to your inbox.
        </p>

        {/* Newsletter Form */}
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
          <input
            type="email"
            placeholder="Enter your email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="flex-1 px-4 py-3 rounded-lg text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
            required
          />
          <button
            type="submit"
            disabled={submitting}
            className="px-8 py-3 bg-orange-500 text-white rounded-lg font-medium hover:bg-orange-600 transition-colors whitespace-nowrap disabled:bg-orange-400 disabled:cursor-not-allowed"
          >
            {submitting ? 'Subscribing...' : 'Subscribe'}
          </button>
        </form>

        {/* Success Message */}
        {subscribed && (
          <p className="mt-4 text-orange-400 font-medium">
            Thank you for subscribing!
          </p>
        )}

        {/* Error Message */}
        {error && (
          <p className="mt-4 text-red-400 font-medium">
            {error}
          </p>
        )}

        {/* Privacy Notice */}
        <p className="text-xs text-gray-400 mt-4">
          We respect your privacy. Unsubscribe at any time.
        </p>
      </div>
    </section>
  );
}
