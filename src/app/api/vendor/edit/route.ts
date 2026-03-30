import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

const ALLOWED_FIELDS = [
  'logo', 'full_description', 'short_description', 'phone',
  'email', 'website', 'features', 'pricing',
];

export async function GET(request: NextRequest) {
  const supabase = getSupabase();
  const token = request.nextUrl.searchParams.get('token');
  if (!token) {
    return NextResponse.json({ error: 'Token required' }, { status: 400 });
  }

  // Look up token
  const { data: tokenData, error: tokenError } = await supabase
    .from('vendor_access_tokens')
    .select('*')
    .eq('token', token)
    .single();

  if (tokenError || !tokenData) {
    return NextResponse.json({ error: 'Invalid token' }, { status: 404 });
  }

  // Check expiration
  if (new Date(tokenData.expires_at) < new Date()) {
    return NextResponse.json({ error: 'Token expired' }, { status: 410 });
  }

  // Get vendor data
  const { data: vendor, error: vendorError } = await supabase
    .from('vendors')
    .select('*')
    .eq('id', tokenData.vendor_id)
    .single();

  if (vendorError || !vendor) {
    return NextResponse.json({ error: 'Vendor not found' }, { status: 404 });
  }

  return NextResponse.json({ vendor });
}

export async function PUT(request: NextRequest) {
  const supabase = getSupabase();
  const token = request.nextUrl.searchParams.get('token');
  if (!token) {
    return NextResponse.json({ error: 'Token required' }, { status: 400 });
  }

  // Look up token
  const { data: tokenData, error: tokenError } = await supabase
    .from('vendor_access_tokens')
    .select('*')
    .eq('token', token)
    .single();

  if (tokenError || !tokenData) {
    return NextResponse.json({ error: 'Invalid token' }, { status: 404 });
  }

  if (new Date(tokenData.expires_at) < new Date()) {
    return NextResponse.json({ error: 'Token expired' }, { status: 410 });
  }

  const body = await request.json();

  // Filter to only allowed fields
  const updates: Record<string, unknown> = {};
  for (const field of ALLOWED_FIELDS) {
    if (field in body) {
      updates[field] = body[field];
    }
  }

  if (Object.keys(updates).length === 0) {
    return NextResponse.json({ error: 'No valid fields to update' }, { status: 400 });
  }

  updates.updated_at = new Date().toISOString();

  const { error: updateError } = await supabase
    .from('vendors')
    .update(updates)
    .eq('id', tokenData.vendor_id);

  if (updateError) {
    return NextResponse.json({ error: 'Failed to update vendor' }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
