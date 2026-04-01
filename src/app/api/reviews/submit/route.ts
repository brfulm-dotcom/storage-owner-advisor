import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

// POST /api/reviews/submit
// Accepts a review submission, validates it, saves it with approved=false
// An admin must approve it before it appears publicly.

function getServiceClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { vendor_slug, rating, title, review_text, reviewer_name, reviewer_title } = body;

    // ── Validation ─────────────────────────────────────────────
    if (!vendor_slug || typeof vendor_slug !== 'string') {
      return NextResponse.json({ error: 'vendor_slug is required' }, { status: 400 });
    }
    if (!rating || typeof rating !== 'number' || rating < 1 || rating > 5) {
      return NextResponse.json({ error: 'rating must be 1–5' }, { status: 400 });
    }
    if (!review_text || typeof review_text !== 'string' || review_text.trim().length < 20) {
      return NextResponse.json({ error: 'review_text must be at least 20 characters' }, { status: 400 });
    }
    if (!reviewer_name || typeof reviewer_name !== 'string' || reviewer_name.trim().length < 2) {
      return NextResponse.json({ error: 'reviewer_name is required' }, { status: 400 });
    }

    // ── Basic spam checks ───────────────────────────────────────
    const spamWords = ['viagra', 'casino', 'crypto', 'bitcoin', 'click here', 'free money'];
    const lowerText = review_text.toLowerCase();
    if (spamWords.some(w => lowerText.includes(w))) {
      return NextResponse.json({ error: 'Review flagged as spam' }, { status: 400 });
    }
    if (review_text.length > 2000) {
      return NextResponse.json({ error: 'Review too long (max 2000 characters)' }, { status: 400 });
    }

    // ── Verify vendor exists ────────────────────────────────────
    const supabase = getServiceClient();
    const { data: vendor } = await supabase
      .from('vendors')
      .select('slug, name')
      .eq('slug', vendor_slug)
      .eq('active', true)
      .single();

    if (!vendor) {
      return NextResponse.json({ error: 'Vendor not found' }, { status: 404 });
    }

    // ── Rate limit: max 1 review per vendor per IP per 24h ─────
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0] || 'unknown';
    // (Simple check — in production add Redis rate limiting)
    // For now we rely on manual moderation to catch duplicates

    // ── Save review (approved=false → goes to moderation queue) ─
    const { error: insertError } = await supabase
      .from('vendor_reviews')
      .insert({
        vendor_slug:    vendor_slug.trim(),
        rating:         Math.round(rating),
        title:          title?.trim()?.slice(0, 120) || null,
        review_text:    review_text.trim().slice(0, 2000),
        reviewer_name:  reviewer_name.trim().slice(0, 80),
        reviewer_title: reviewer_title?.trim()?.slice(0, 100) || null,
        source:         'site',
        approved:       false,
      });

    if (insertError) {
      console.error('Review insert error:', insertError);
      return NextResponse.json({ error: 'Failed to save review' }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: 'Thank you! Your review has been submitted and will appear after moderation (usually within 24 hours).',
    });

  } catch (err) {
    console.error('Review submit error:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
