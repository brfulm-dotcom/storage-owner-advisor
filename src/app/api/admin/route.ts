import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

// =============================================================
// ADMIN API ROUTE
// Handles fetching and updating submissions, claims, and contacts.
// Protected by ADMIN_PASSWORD environment variable.
// =============================================================

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// Use service role key to bypass RLS policies
function getAdminClient() {
  return createClient(supabaseUrl, supabaseServiceKey);
}

function checkPassword(request: NextRequest): boolean {
  const password = request.headers.get('x-admin-password');
  return password === ADMIN_PASSWORD;
}

// GET - Fetch data for a specific table
export async function GET(request: NextRequest) {
  if (!checkPassword(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const table = searchParams.get('table');

  if (!table || !['submissions', 'claims', 'contact_messages', 'newsletter_subscribers'].includes(table)) {
    return NextResponse.json({ error: 'Invalid table' }, { status: 400 });
  }

  const supabase = getAdminClient();

  const orderColumn = table === 'newsletter_subscribers' ? 'subscribed_at' : 'submitted_at';
  const { data, error } = await supabase
    .from(table)
    .select('*')
    .order(orderColumn, { ascending: false });

  if (error) {
    console.error(`Error fetching ${table}:`, error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ data });
}

// PATCH - Update status of a record
export async function PATCH(request: NextRequest) {
  if (!checkPassword(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();
  const { table, id, status } = body;

  if (!table || !['submissions', 'claims'].includes(table)) {
    return NextResponse.json({ error: 'Invalid table' }, { status: 400 });
  }

  const supabase = getAdminClient();

  const { error } = await supabase
    .from(table)
    .update({ status })
    .eq('id', id);

  if (error) {
    console.error(`Error updating ${table}:`, error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}

// DELETE - Delete a record
export async function DELETE(request: NextRequest) {
  if (!checkPassword(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();
  const { table, id } = body;

  if (!table || !['submissions', 'claims', 'contact_messages', 'newsletter_subscribers'].includes(table)) {
    return NextResponse.json({ error: 'Invalid table' }, { status: 400 });
  }

  const supabase = getAdminClient();

  const { error } = await supabase
    .from(table)
    .delete()
    .eq('id', id);

  if (error) {
    console.error(`Error deleting from ${table}:`, error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
