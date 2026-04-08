'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { createClient } from '@supabase/supabase-js';
import type { Category } from '@/lib/supabase';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [topCategories, setTopCategories] = useState<Category[]>([]);

  // Fetch categories from Supabase on mount
  useEffect(() => {
    async function loadCategories() {
      const { data } = await supabase
        .from('categories')
        .select('*')
        .eq('visible', true)
        .gt('vendor_count', 0)
        .order('name')
        .limit(6);
      if (data) setTopCategories(data);
    }
    loadCategories();
  }, []);

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 3000);
    }
  };

  return (
    <footer className="bg-gray-900 text-gray-300 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* About Column */}
          <div>
            <h3 className="text-white font-bold text-lg mb-4">About</h3>
            <p className="text-sm text-gray-400 mb-4">
              StorageOwnerAdvisor is the #1 B2B directory for self-storage facility owners and operators to discover trusted vendors and service providers.
            </p>
          </div>

          {/* Categories Column */}
          <div>
            <h3 className="text-white font-bold text-lg mb-4">Categories</h3>
            <ul className="space-y-2">
              {topCategories.map((category) => (
                <li key={category.slug}>
                  <Link
                    href={`/category/${category.slug}`}
                    className="text-sm text-gray-400 hover:text-orange-500 transition-colors"
                  >
                    {category.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources Column */}
          <div>
            <h3 className="text-white font-bold text-lg mb-4">Resources</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/blog"
                  className="text-sm text-gray-400 hover:text-orange-500 transition-colors"
                >
                  Blog
                </Link>
              </li>
              <li>
                <Link
                  href="/guides"
                  className="text-sm text-gray-400 hover:text-orange-500 transition-colors"
                >
                  Guides
                </Link>
              </li>
              <li>
                <Link
                  href="/faq"
                  className="text-sm text-gray-400 hover:text-orange-500 transition-colors"
                >
                  FAQ
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-sm text-gray-400 hover:text-orange-500 transition-colors"
                >
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Column */}
          <div>
            <h3 className="text-white font-bold text-lg mb-4">Contact</h3>
            <p className="text-sm text-gray-400 mb-3">
              Have questions? We'd love to hear from you.
            </p>
            <a
              href="mailto:info@storageowneradvisor.com"
              className="text-orange-500 font-medium hover:text-orange-400 transition-colors"
            >
              info@storageowneradvisor.com
            </a>
            <a
              href="tel:925-272-8644"
              className="block text-sm text-gray-400 mt-4 hover:text-orange-500 transition-colors"
            >
              925-272-8644
            </a>
          </div>
        </div>

        {/* Newsletter Section */}
        <div className="border-t border-gray-800 pt-8 mb-8">
          <h3 className="text-white font-bold text-lg mb-2">Stay Updated</h3>
          <p className="text-sm text-gray-400 mb-4">
            Get the latest vendor reviews and industry news delivered to your inbox.
          </p>
          <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-2">
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 px-4 py-2 rounded text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
              required
            />
            <button
              type="submit"
              className="px-6 py-2 bg-orange-500 text-white rounded font-medium hover:bg-orange-600 transition-colors whitespace-nowrap"
            >
              Subscribe
            </button>
          </form>
          {subscribed && (
            <p className="text-orange-400 text-sm mt-2">
              Thank you for subscribing!
            </p>
          )}
        </div>

        {/* Affiliate Disclaimer */}
        <div className="border-t border-gray-800 pt-6 mb-6">
          <p className="text-xs text-gray-500 text-center max-w-3xl mx-auto">
            Some links on this site are affiliate links. We may earn a commission at no extra cost to you if you make a purchase through these links. This does not influence our recommendations. See our{' '}
            <Link href="/affiliate-disclosure" className="text-gray-400 underline hover:text-orange-500 transition-colors">
              Affiliate Disclosure
            </Link>{' '}
            for more details.
          </p>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-800 pt-8">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-gray-400">
            <p>&copy; 2024 StorageOwnerAdvisor. All rights reserved.</p>
            <div className="flex gap-6">
              <Link
                href="/privacy"
                className="hover:text-orange-500 transition-colors"
              >
                Privacy Policy
              </Link>
              <Link
                href="/terms"
                className="hover:text-orange-500 transition-colors"
              >
                Terms of Service
              </Link>
              <Link
                href="/affiliate-disclosure"
                className="hover:text-orange-500 transition-colors"
              >
                Affiliate Disclosure
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
