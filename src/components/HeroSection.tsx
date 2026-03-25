'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function HeroSection() {
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  const popularSearches = [
    { label: 'Management Software', slug: 'management-software' },
    { label: 'Security Systems', slug: 'security-systems' },
    { label: 'Construction', slug: 'construction' },
    { label: 'Insurance', slug: 'insurance' },
  ];

  return (
    <section className="bg-gradient-to-r from-blue-50 to-blue-100 py-10 sm:py-12 md:py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Headline */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 mb-4 text-center">
          Find Trusted Vendors for Your Storage Facility
        </h1>

        {/* Subheadline */}
        <p className="text-lg sm:text-xl text-gray-700 text-center mb-8 max-w-2xl mx-auto">
          The #1 directory of vetted service providers, equipment suppliers, and technology partners for self-storage owners and operators.
        </p>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="flex gap-2 mb-8 max-w-2xl mx-auto">
          <input
            type="text"
            placeholder="Search vendors, services, or products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
          />
          <button
            type="submit"
            className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors whitespace-nowrap"
          >
            Search
          </button>
        </form>

        {/* Popular Searches */}
        <div className="text-center">
          <p className="text-sm text-gray-600 mb-3">Popular:</p>
          <div className="flex flex-wrap justify-center gap-3">
            {popularSearches.map((search) => (
              <Link
                key={search.slug}
                href={`/category/${search.slug}`}
                className="px-4 py-2 bg-white rounded-full text-gray-700 font-medium hover:bg-blue-600 hover:text-white transition-colors border border-gray-200"
              >
                {search.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
