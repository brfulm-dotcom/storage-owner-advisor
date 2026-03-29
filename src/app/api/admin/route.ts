import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import crypto from 'crypto';

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

  if (!table || !['submissions', 'claims', 'contact_messages', 'newsletter_subscribers', 'vendor_clicks'].includes(table)) {
    return NextResponse.json({ error: 'Invalid table' }, { status: 400 });
  }

  const supabase = getAdminClient();

  const orderColumn = table === 'newsletter_subscribers' ? 'subscribed_at' : table === 'vendor_clicks' ? 'clicked_at' : 'submitted_at';
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

// POST - Approve or reject claims
export async function POST(request: NextRequest) {
  if (!checkPassword(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();
  const { action, claimId, reason } = body;

  const supabase = getAdminClient();

  if (action === 'approve_claim') {
    // Get the claim
    const { data: claim, error: claimError } = await supabase
      .from('claims')
      .select('*')
      .eq('id', claimId)
      .single();

    if (claimError || !claim) {
      return NextResponse.json({ error: 'Claim not found' }, { status: 404 });
    }

    // Find the vendor by slug
    const { data: vendor, error: vendorError } = await supabase
      .from('vendors')
      .select('id, name, slug')
      .eq('slug', claim.vendor_slug)
      .single();

    if (vendorError || !vendor) {
      return NextResponse.json({ error: 'Vendor not found for this claim' }, { status: 404 });
    }

    // Generate token
    const token = crypto.randomUUID();

    // Create access token
    const { error: tokenError } = await supabase
      .from('vendor_access_tokens')
      .insert({
        vendor_id: vendor.id,
        claim_id: claimId,
        token,
        email: claim.contact_email,
        expires_at: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(),
      });

    if (tokenError) {
      return NextResponse.json({ error: 'Failed to create access token' }, { status: 500 });
    }

    // Update claim status and mark vendor as verified
    await supabase.from('claims').update({ status: 'approved' }).eq('id', claimId);
    await supabase.from('vendors').update({ verified: true }).eq('id', vendor.id);

    // Send approval email with edit link
    const resend = new Resend(process.env.RESEND_API_KEY);
    const editUrl = `https://storageowneradvisor.com/vendor/edit/${token}`;

    await resend.emails.send({
      from: 'StorageOwnerAdvisor <onboarding@resend.dev>',
      to: claim.contact_email,
      subject: `Your claim for ${vendor.name} has been approved!`,
      html: `
        <h2>Claim Approved!</h2>
        <p>Hi ${claim.contact_name},</p>
        <p>Great news — your claim for <strong>${vendor.name}</strong> on StorageOwnerAdvisor has been approved.</p>
        <p>You can now edit your listing using the link below:</p>
        <p><a href="${editUrl}" style="display:inline-block;background:#2563eb;color:white;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:bold;">Edit Your Listing</a></p>
        <p style="color:#666;font-size:14px;">This link is private and expires in 90 days. Do not share it with anyone.</p>
        <p>If you have any questions, reply to this email or contact us at support@storageowneradvisor.com.</p>
        <p>Thanks,<br/>StorageOwnerAdvisor Team</p>
      `,
    });

    return NextResponse.json({ success: true, token });
  }

  if (action === 'reject_claim') {
    // Get the claim
    const { data: claim, error: claimError } = await supabase
      .from('claims')
      .select('*')
      .eq('id', claimId)
      .single();

    if (claimError || !claim) {
      return NextResponse.json({ error: 'Claim not found' }, { status: 404 });
    }

    // Update claim status
    await supabase.from('claims').update({ status: 'rejected' }).eq('id', claimId);

    // Get vendor name
    const { data: vendor } = await supabase
      .from('vendors')
      .select('name')
      .eq('slug', claim.vendor_slug)
      .single();

    // Send rejection email
    const resend = new Resend(process.env.RESEND_API_KEY);
    await resend.emails.send({
      from: 'StorageOwnerAdvisor <onboarding@resend.dev>',
      to: claim.contact_email,
      subject: `Update on your claim for ${vendor?.name || claim.vendor_slug}`,
      html: `
        <h2>Claim Update</h2>
        <p>Hi ${claim.contact_name},</p>
        <p>Thank you for your interest in claiming the listing for <strong>${vendor?.name || claim.vendor_slug}</strong> on StorageOwnerAdvisor.</p>
        <p>Unfortunately, we were unable to verify your ownership at this time.${reason ? ` <strong>Reason:</strong> ${reason}` : ''}</p>
        <p>If you believe this was a mistake, please contact us at support@storageowneradvisor.com with additional verification.</p>
        <p>Thanks,<br/>StorageOwnerAdvisor Team</p>
      `,
    });

    return NextResponse.json({ success: true });
  }

  return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
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
