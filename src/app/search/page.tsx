'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { createClient } from '@supabase/supabase-js';
import VendorCard from '@/components/VendorCard';
import type { Vendor, Category } from '@/lib/supabase';

// Client-side Supabase instance for search
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Vendor[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Filter state
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedState, setSelectedState] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedServiceArea, setSelectedServiceArea] = useState('');

  // Dropdown options
  const [categories, setCategories] = useState<Category[]>([]);
  const [states, setStates] = useState<string[]>([]);
  const [cities, setCities] = useState<string[]>([]);

  // Load filter options on mount
  useEffect(() => {
    async function loadFilterOptions() {
      // Load categories
      const { data: catData } = await supabase
        .from('categories')
        .select('*')
        .order('name');
      if (catData) setCategories(catData);

      // Load unique states
      const { data: stateData } = await supabase
        .from('vendors')
        .select('state')
        .neq('active', false)
        .not('state', 'is', null)
        .not('state', 'eq', '')
        .order('state');
      if (stateData) {
        const unique = Array.from(new Set(stateData.map((r: { state: string }) => r.state)));
        setStates(unique);
      }
    }
    loadFilterOptions();
  }, []);

  // Load cities when state changes
  useEffect(() => {
    async function loadCities() {
      if (!selectedState) {
        setCities([]);
        setSelectedCity('');
        return;
      }
      const { data: cityData } = await supabase
        .from('vendors')
        .select('city')
        .eq('state', selectedState)
        .neq('active', false)
        .not('city', 'is', null)
        .not('city', 'eq', '')
        .order('city');
      if (cityData) {
        const unique = Array.from(new Set(cityData.map((r: { city: string }) => r.city)));
        setCities(unique);
      }
    }
    loadCities();
  }, [selectedState]);

  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsLoading(true);

    let queryBuilder = supabase
      .from('vendors')
      .select('*')
      .neq('active', false);

    // Text search
    if (query.trim()) {
      queryBuilder = queryBuilder.or(
        `name.ilike.%${query}%,short_description.ilike.%${query}%`
      );
    }

    // Category filter
    if (selectedCategory) {
      queryBuilder = queryBuilder.eq('category_slug', selectedCategory);
    }

    // Service area filter
    if (selectedServiceArea) {
      queryBuilder = queryBuilder.eq('service_area', selectedServiceArea);
    }

    // State filter
    if (selectedState) {
      queryBuilder = queryBuilder.eq('state', selectedState);
    }

    // City filter
    if (selectedCity) {
      queryBuilder = queryBuilder.eq('city', selectedCity);
    }

    queryBuilder = queryBuilder.order('rating', { ascending: false }).limit(100);

    const { data, error } = await queryBuilder;

    if (!error && data) {
      setResults(data);
    } else {
      setResults([]);
    }
    setHasSearched(true);
    setIsLoading(false);
  };

  const handleClearFilters = () => {
    setQuery('');
    setSelectedCategory('');
    setSelectedState('');
    setSelectedCity('');
    setSelectedServiceArea('');
    setResults([]);
    setHasSearched(false);
  };

  const hasActiveFilters = query || selectedCategory || selectedState || selectedCity || selectedServiceArea;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Search Header */}
      <div className="bg-white border-b border-gray-200 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
            Search Vendors
          </h1>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="flex gap-2 max-w-2xl mb-6">
            <input
              type="text"
              placeholder="Search vendors by name or service..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="flex-1 px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
            />
            <button
              type="submit"
              disabled={isLoading}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors whitespace-nowrap disabled:bg-blue-400"
            >
              {isLoading ? 'Searching...' : 'Search'}
            </button>
          </form>

          {/* Filters */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Category */}
            <div>
              <label htmlFor="category" className="block text-sm font-semibold text-gray-700 mb-1">
                Category
              </label>
              <select
                id="category"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              >
                <option value="">All Categories</option>
                {categories.map((cat) => (
                  <option key={cat.slug} value={cat.slug}>{cat.name}</option>
                ))}
              </select>
            </div>

            {/* Service Area */}
            <div>
              <label htmlFor="serviceArea" className="block text-sm font-semibold text-gray-700 mb-1">
                Service Area
              </label>
              <select
                id="serviceArea"
                value={selectedServiceArea}
                onChange={(e) => setSelectedServiceArea(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              >
                <option value="">Local &amp; National</option>
                <option value="local">Local Only</option>
                <option value="national">National Only</option>
              </select>
            </div>

            {/* State */}
            <div>
              <label htmlFor="state" className="block text-sm font-semibold text-gray-700 mb-1">
                State
              </label>
              <select
                id="state"
                value={selectedState}
                onChange={(e) => {
                  setSelectedState(e.target.value);
                  setSelectedCity('');
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              >
                <option value="">All States</option>
                {states.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            {/* City */}
            <div>
              <label htmlFor="city" className="block text-sm font-semibold text-gray-700 mb-1">
                City
              </label>
              <select
                id="city"
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                disabled={!selectedState}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm disabled:bg-gray-100 disabled:text-gray-400"
              >
                <option value="">{selectedState ? 'All Cities' : 'Select a state first'}</option>
                {cities.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Filter Actions */}
          <div className="flex gap-4 mt-4">
            <button
              type="button"
              onClick={() => handleSearch()}
              disabled={isLoading}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium text-sm hover:bg-blue-700 transition-colors disabled:bg-blue-400"
            >
              Apply Filters
            </button>
            {hasActiveFilters && (
              <button
                type="button"
                onClick={handleClearFilters}
                className="px-4 py-2 text-gray-600 hover:text-gray-900 font-medium text-sm transition-colors"
              >
                Clear All Filters
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {hasSearched && (
            <div className="mb-8">
              <p className="text-gray-600">
                {results.length === 0
                  ? 'No vendors found matching your criteria'
                  : `Found ${results.length} vendor${results.length !== 1 ? 's' : ''}`}
              </p>
            </div>
          )}

          {hasSearched && results.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm p-12 text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                No vendors found
              </h2>
              <p className="text-gray-600 text-lg mb-8">
                Try a different search term, adjust your filters, or browse by category.
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
                Find the right vendor
              </h2>
              <p className="text-gray-600 text-lg mb-8">
                Search by name or use the filters above to narrow down vendors by category, location, or service area.
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
