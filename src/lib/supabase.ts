// =============================================================
// SUPABASE CLIENT
// This connects your website to the Supabase database.
// The URL and key come from your Supabase project settings.
// =============================================================

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Supabase client — may be null during Vercel build if env vars aren't available
const _supabase = supabaseUrl ? createClient(supabaseUrl, supabaseAnonKey) : null;
export const supabase = _supabase as NonNullable<typeof _supabase>;

// Helper: returns true if supabase is configured and ready
export function isSupabaseReady(): boolean {
  return _supabase !== null;
}

// =============================================================
// DATABASE TYPES (match the Supabase tables)
// =============================================================

export interface CategoryFaq {
  question: string;
  answer: string;
}

export interface Category {
  id?: number;
  slug: string;
  name: string;
  description: string;
  icon: string;
  vendor_count: number;
  visible: boolean;
  sort_order?: number;
  hero_image?: string | null;
  buyer_guide?: string | null;
  category_faqs?: CategoryFaq[] | null;
  created_at?: string;
}

export interface BlogPost {
  id?: number;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  category_slug?: string | null;
  author: string;
  featured_image?: string | null;
  meta_description?: string | null;
  status: 'draft' | 'published';
  published_at?: string | null;
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
  pros?: string[] | null;
  cons?: string[] | null;
  video_url?: string | null;
  screenshots?: string[] | null;
  faq?: { question: string; answer: string }[] | null;
  verified?: boolean;
  badges?: string[] | null;
  active?: boolean;
  site_rating?: number;
  site_review_count?: number;
  created_at?: string;
  updated_at?: string;
}

// =============================================================
// DATA FETCHING FUNCTIONS
// These replace the old functions from data/vendors.ts
// =============================================================

export async function getCategories(): Promise<Category[]> {
  if (!isSupabaseReady()) return [];

  // Fetch categories and live vendor counts in parallel
  const [catResult, vendorResult] = await Promise.all([
    supabase.from('categories').select('*').eq('visible', true).order('sort_order', { ascending: true, nullsFirst: false }),
    supabase.from('vendors').select('category_slug').eq('active', true),
  ]);

  if (catResult.error) {
    console.error('Error fetching categories:', catResult.error);
    return [];
  }

  // Build live count map from actual active vendors
  const countMap: Record<string, number> = {};
  for (const v of vendorResult.data || []) {
    countMap[v.category_slug] = (countMap[v.category_slug] || 0) + 1;
  }

  // Override stored vendor_count with live count so it's always accurate
  return (catResult.data || []).map(cat => ({
    ...cat,
    vendor_count: countMap[cat.slug] || 0,
  }));
}

export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  if (!isSupabaseReady()) return null;
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
  if (!isSupabaseReady()) return [];
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
  if (!isSupabaseReady()) return null;
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
  if (!isSupabaseReady()) return [];
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
  if (!isSupabaseReady()) return [];
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
  if (!isSupabaseReady()) return [];
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

// =============================================================
// SEO LANDING PAGE HELPERS
// =============================================================

export async function getVendorsByStateAndCategory(state: string, categorySlug: string): Promise<Vendor[]> {
  if (!isSupabaseReady()) return [];
  const { data, error } = await supabase
    .from('vendors')
    .select('*')
    .eq('category_slug', categorySlug)
    .neq('active', false)
    .or(`state.ilike.${state},service_area.ilike.national`)
    .order('featured', { ascending: false })
    .order('rating', { ascending: false });

  if (error) {
    console.error('Error fetching vendors by state and category:', error);
    return [];
  }
  return data || [];
}

export async function getVendorsByState(state: string): Promise<Vendor[]> {
  if (!isSupabaseReady()) return [];
  const { data, error } = await supabase
    .from('vendors')
    .select('*')
    .neq('active', false)
    .or(`state.ilike.${state},service_area.ilike.national`)
    .order('featured', { ascending: false })
    .order('rating', { ascending: false });

  if (error) {
    console.error('Error fetching vendors by state:', error);
    return [];
  }
  return data || [];
}

export async function getUniqueStates(): Promise<string[]> {
  if (!isSupabaseReady()) return [];
  const { data, error } = await supabase
    .from('vendors')
    .select('state')
    .neq('active', false)
    .not('state', 'is', null)
    .not('state', 'eq', '');

  if (error) return [];
  const states = Array.from(new Set((data || []).map((v: { state: string }) => v.state))).sort();
  return states;
}

export async function getUniqueCitiesByState(state: string): Promise<string[]> {
  if (!isSupabaseReady()) return [];
  const { data, error } = await supabase
    .from('vendors')
    .select('city')
    .neq('active', false)
    .ilike('state', state)
    .not('city', 'is', null)
    .not('city', 'eq', '');

  if (error) return [];
  const cities = Array.from(new Set((data || []).map((v: { city: string }) => v.city))).sort();
  return cities;
}

export async function getCategorySlugs(): Promise<string[]> {
  if (!isSupabaseReady()) return [];
  const { data, error } = await supabase
    .from('categories')
    .select('slug');

  if (error) return [];
  return (data || []).map((c) => c.slug);
}

export async function getVendorSlugs(): Promise<string[]> {
  if (!isSupabaseReady()) return [];
  const { data, error } = await supabase
    .from('vendors')
    .select('slug')
    .neq('active', false);

  if (error) return [];
  return (data || []).map((v) => v.slug);
}

export async function getRelatedVendors(categorySlug: string, excludeSlug: string, limit = 4): Promise<Vendor[]> {
  if (!isSupabaseReady()) return [];
  const { data, error } = await supabase
    .from('vendors')
    .select('*')
    .eq('category_slug', categorySlug)
    .neq('slug', excludeSlug)
    .neq('active', false)
    .order('featured', { ascending: false })
    .order('rating', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('Error fetching related vendors:', error);
    return [];
  }
  return data || [];
}

// =============================================================
// BLOG POST QUERIES
// =============================================================

export async function getBlogPosts(): Promise<BlogPost[]> {
  if (!isSupabaseReady()) return [];
  const { data, error } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('status', 'published')
    .order('published_at', { ascending: false });

  if (error) {
    console.error('Error fetching blog posts:', error);
    return [];
  }
  return data || [];
}

export async function getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  if (!isSupabaseReady()) return null;
  const { data, error } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('slug', slug)
    .eq('status', 'published')
    .single();

  if (error) {
    console.error('Error fetching blog post:', error);
    return null;
  }
  return data;
}

export async function getBlogPostSlugs(): Promise<string[]> {
  if (!isSupabaseReady()) return [];
  const { data, error } = await supabase
    .from('blog_posts')
    .select('slug')
    .eq('status', 'published');

  if (error) {
    console.error('Error fetching blog post slugs:', error);
    return [];
  }
  return (data || []).map((p) => p.slug);
}
