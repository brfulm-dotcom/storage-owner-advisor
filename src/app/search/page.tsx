'use client';

import { useState } from 'react';
import Link from 'next/link';
import { createClient } from '@supabase/supabase-js';
import VendorCard from '@/components/VendorCard';
import type { Vendor } from '@/lib/supabase';

// Client-side Supabase instance for search
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Vendor[]>([]);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      const { data, error } = await supabase
        .from('vendors')
        .select('*')
        .or(`name.ilike.%${query}%,short_description.ilike.%${query}%`)
        .order('rating', { ascending: false });

      if (!error && data) {
        setResults(data);
      } else {
        setResults([]);
      }
      setHasSearched(true);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Search Header */}
      <div className="bg-white border-b border-gray-200 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
            Search Vendors
          </h1>
          <form onSubmit={handleSearch} className="flex gap-2 max-w-2xl">
            <input
              type="text"
              placeholder="Search vendors by name, category, or service..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="flex-1 px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
            />
            <button
              type="submit"
              className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors whitespace-nowrap"
            >
              Search
            </button>
          </form>
        </div>
      </div>

      {/* Results */}
      <div className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {hasSearched && (
            <div className="mb-8">
              <p className="text-gray-600">
                {results.length === 0
                  ? `No results found for "${query}"`
                  : `Found ${results.length} vendor${results.length !== 1 ? 's' : ''} matching "${query}"`}
              </p>
            </div>
          )}

          {hasSearched && results.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm p-12 text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                No vendors found
              </h2>
              <p className="text-gray-600 text-lg mb-8">
                Try a different search term or browse by category.
              </p>
              <Link
                href="/"
                className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                Browse Categories
              </Link>
            </div>
          ) : !hasSearched ? (
            <div className="bg-white rounded-lg shadow-sm p-12 text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Start searching
              </h2>
              <p className="text-gray-600 text-lg mb-8">
                Enter a vendor name, category, or service to get started.
              </p>
              <Link
                href="/"
                className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                Browse Categories
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {results.map((vendor) => (
                <VendorCard key={vendor.slug} vendor={vendor} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
