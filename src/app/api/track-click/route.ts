import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

// =============================================================
// CLICK TRACKING API
// Logs vendor website clicks to the vendor_clicks table.
// Uses anon key since RLS allows public inserts.
// =============================================================

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(request: NextRequest) {
  try {
    const { vendor_slug, vendor_name, click_type } = await request.json();

    if (!vendor_slug || !vendor_name) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    }

    const { error } = await supabase
      .from('vendor_clicks')
      .insert([{
        vendor_slug,
        vendor_name,
        click_type: click_type || 'website',
      }]);

    if (error) {
      console.error('Click tracking error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Track click error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
