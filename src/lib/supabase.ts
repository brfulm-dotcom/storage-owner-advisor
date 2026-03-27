// =============================================================
// SUPABASE CLIENT
// This connects your website to the Supabase database.
// The URL and key come from your Supabase project settings.
// =============================================================

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// =============================================================
// DATABASE TYPES (match the Supabase tables)
// =============================================================

export interface Category {
  id?: number;
  slug: string;
  name: string;
  description: string;
  icon: string;
  vendor_count: number;
  visible: boolean;
  created_at?: string;
}

export interface Vendor {
  id?: number;
  slug: string;
  name: string;
  category_slug: string;
  short_description: string;
  full_description: string;
  website: string;
  phone?: string | null;
  email?: string | null;
  logo?: string | null;
  features: string[];
  pricing?: string | null;
  rating: number;
  review_count: number;
  featured: boolean;
  tier: 'free' | 'premium' | 'featured';
  affiliate_url?: string | null;
  year_founded?: number | null;
  headquarters?: string | null;
  city?: string | null;
  state?: string | null;
  service_area: 'local' | 'national';
  created_at?: string;
  updated_at?: string;
}

// =============================================================
// DATA FETCHING FUNCTIONS
// These replace the old functions from data/vendors.ts
// =============================================================

export async function getCategories(): Promise<Category[]> {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .order('name');

  if (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
  return data || [];
}

export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .eq('slug', slug)
    .single();

  if (error) {
    console.error('Error fetching category:', error);
    return null;
  }
  return data;
}

export async function getVendors(): Promise<Vendor[]> {
  const { data, error } = await supabase
    .from('vendors')
    .select('*')
    .neq('active', false)
    .order('name');

  if (error) {
    console.error('Error fetching vendors:', error);
    return [];
  }
  return data || [];
}

export async function getVendorBySlug(slug: string): Promise<Vendor | null> {
  const { data, error } = await supabase
    .from('vendors')
    .select('*')
    .eq('slug', slug)
    .single();

  if (error) {
    console.error('Error fetching vendor:', error);
    return null;
  }
  return data;
}

export async function getVendorsByCategory(categorySlug: string): Promise<Vendor[]> {
  const { data, error } = await supabase
    .from('vendors')
    .select('*')
    .eq('category_slug', categorySlug)
    .neq('active', false)
    .order('featured', { ascending: false })
    .order('rating', { ascending: false });

  if (error) {
    console.error('Error fetching vendors by category:', error);
    return [];
  }
  return data || [];
}

export async function getFeaturedVendors(): Promise<Vendor[]> {
  const { data, error } = await supabase
    .from('vendors')
    .select('*')
    .eq('featured', true)
    .neq('active', false)
    .order('rating', { ascending: false });

  if (error) {
    console.error('Error fetching featured vendors:', error);
    return [];
  }
  return data || [];
}

export async function searchVendors(query: string): Promise<Vendor[]> {
  const { data, error } = await supabase
    .from('vendors')
    .select('*')
    .neq('active', false)
    .or(`name.ilike.%${query}%,short_description.ilike.%${query}%`)
    .order('rating', { ascending: false });

  if (error) {
    console.error('Error searching vendors:', error);
    return [];
  }
  return data || [];
}

export async function getCategorySlugs(): Promise<string[]> {
  const { data, error } = await supabase
    .from('categories')
    .select('slug');

  if (error) return [];
  return (data || []).map((c) => c.slug);
}

export async function getVendorSlugs(): Promise<string[]> {
  const { data, error } = await supabase
    .from('vendors')
    .select('slug')
    .neq('active', false);

  if (error) return [];
  return (data || []).map((v) => v.slug);
}
