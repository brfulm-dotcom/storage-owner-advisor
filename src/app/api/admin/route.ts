import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import crypto from 'crypto';
import { revalidatePath } from 'next/cache';

// =============================================================
// ADMIN API ROUTE
// Handles fetching and updating submissions, claims, and contacts.
// Protected by ADMIN_PASSWORD environment variable.
// =============================================================

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

// Use service role key to bypass RLS policies
function getAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
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

  if (!table || !['submissions', 'claims', 'contact_messages', 'newsletter_subscribers', 'vendor_clicks', 'vendor_reviews', 'blog_posts'].includes(table)) {
    return NextResponse.json({ error: 'Invalid table' }, { status: 400 });
  }

  const supabase = getAdminClient();

  const orderColumn =
    table === 'newsletter_subscribers' ? 'subscribed_at' :
    table === 'vendor_clicks' ? 'clicked_at' :
    table === 'vendor_reviews' ? 'created_at' :
    table === 'blog_posts' ? 'created_at' :
    'submitted_at';
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
  const { table, id, status, approved } = body;

  if (!table || !['submissions', 'claims', 'vendor_reviews', 'blog_posts'].includes(table)) {
    return NextResponse.json({ error: 'Invalid table' }, { status: 400 });
  }

  const supabase = getAdminClient();

  // blog_posts updates all fields passed in the body
  if (table === 'blog_posts') {
    const { table: _, id: postId, ...updateFields } = body;
    const { error } = await supabase
      .from('blog_posts')
      .update(updateFields)
      .eq('id', postId);

    if (error) {
      console.error('Error updating blog post:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ success: true });
  }

  // vendor_reviews uses approved boolean, not status string
  if (table === 'vendor_reviews') {
    const { error } = await supabase
      .from('vendor_reviews')
      .update({ approved: approved === true })
      .eq('id', id);

    if (error) {
      console.error('Error updating review:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ success: true });
  }

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

  if (action === 'check_vendor_exists') {
    const { company_name } = body;
    const slug = company_name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();

    // Check by slug match or name match (case-insensitive)
    const { data: bySlug } = await supabase
      .from('vendors')
      .select('id, slug, name, category_slug, active, rating')
      .eq('slug', slug)
      .single();

    if (bySlug) {
      return NextResponse.json({ exists: true, vendor: bySlug });
    }

    const { data: byName } = await supabase
      .from('vendors')
      .select('id, slug, name, category_slug, active, rating')
      .ilike('name', company_name)
      .single();

    if (byName) {
      return NextResponse.json({ exists: true, vendor: byName });
    }

    return NextResponse.json({ exists: false });
  }

  if (action === 'approve_submission') {
    const { submissionId, rating, service_area, short_description, features, year_founded, headquarters, logo } = body;

    // Get the submission
    const { data: submission, error: subError } = await supabase
      .from('submissions')
      .select('*')
      .eq('id', submissionId)
      .single();

    if (subError || !submission) {
      return NextResponse.json({ error: 'Submission not found' }, { status: 404 });
    }

    // Generate slug from company name
    const slug = submission.company_name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();

    // Check if vendor slug already exists
    const { data: existingVendor } = await supabase
      .from('vendors')
      .select('id')
      .eq('slug', slug)
      .single();

    if (existingVendor) {
      return NextResponse.json({ error: `A vendor with slug "${slug}" already exists.` }, { status: 409 });
    }

    // Create the vendor record
    const { error: vendorError } = await supabase
      .from('vendors')
      .insert({
        slug,
        name: submission.company_name,
        category_slug: submission.category_slug,
        short_description: short_description || submission.description.substring(0, 150),
        full_description: submission.description,
        website: submission.website,
        phone: submission.phone || null,
        email: submission.contact_email || null,
        logo: logo || null,
        features: features || [],
        rating: rating || 0,
        review_count: 0,
        featured: false,
        tier: 'free',
        service_area: service_area || 'national',
        year_founded: year_founded || null,
        headquarters: headquarters || null,
        verified: false,
        active: true,
      });

    if (vendorError) {
      console.error('Error creating vendor:', vendorError);
      return NextResponse.json({ error: 'Failed to create vendor: ' + vendorError.message }, { status: 500 });
    }

    // Update submission status to approved
    await supabase.from('submissions').update({ status: 'approved' }).eq('id', submissionId);

    // Send approval notification email
    try {
      const resend = new Resend(process.env.RESEND_API_KEY);
      const vendorUrl = `https://www.storageowneradvisor.com/vendor/${slug}`;

      await resend.emails.send({
        from: 'StorageOwnerAdvisor <onboarding@resend.dev>',
        to: submission.contact_email,
        subject: `${submission.company_name} is now listed on StorageOwnerAdvisor!`,
        html: `
          <h2>Your Listing is Live!</h2>
          <p>Hi there,</p>
          <p>Great news — <strong>${submission.company_name}</strong> has been reviewed and approved for listing on StorageOwnerAdvisor.</p>
          <p>Your vendor page is now live:</p>
          <p><a href="${vendorUrl}" style="display:inline-block;background:#2563eb;color:white;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:bold;">View Your Listing</a></p>
          <h3>What's Next?</h3>
          <ul>
            <li><strong>Claim your listing</strong> to unlock editing capabilities and keep your info up to date.</li>
            <li><strong>Upgrade to Premium or Featured</strong> to get more visibility and stand out from competitors.</li>
          </ul>
          <p>To claim your listing, visit your vendor page and click the "Claim This Listing" button.</p>
          <p>If you have any questions, reply to this email or contact us at support@storageowneradvisor.com.</p>
          <p>Thanks,<br/>StorageOwnerAdvisor Team</p>
        `,
      });
    } catch (emailErr) {
      console.error('Approval email failed (vendor was still created):', emailErr);
    }

    // Revalidate the category page so the new vendor shows up
    try {
      revalidatePath(`/category/${submission.category_slug}`, 'page');
      revalidatePath('/', 'layout');
    } catch {
      // Non-critical
    }

    return NextResponse.json({ success: true, slug });
  }

  if (action === 'create_blog_post') {
    const { title, slug, excerpt, content, category_slug, author, meta_description, status: postStatus, published_at } = body;

    const { data, error } = await supabase
      .from('blog_posts')
      .insert({
        title,
        slug,
        excerpt,
        content,
        category_slug: category_slug || null,
        author: author || 'StorageOwnerAdvisor Team',
        meta_description: meta_description || null,
        status: postStatus || 'draft',
        published_at: published_at || null,
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating blog post:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ success: true, data });
  }

  if (action === 'revalidate_seo') {
    try {
      // Revalidate all SEO landing pages, category pages, and homepage
      revalidatePath('/best', 'layout');
      revalidatePath('/', 'layout');
      revalidatePath('/sitemap.xml');
      return NextResponse.json({ success: true, message: 'SEO pages revalidated' });
    } catch (err) {
      return NextResponse.json({ error: 'Failed to revalidate: ' + String(err) }, { status: 500 });
    }
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

  if (!table || !['submissions', 'claims', 'contact_messages', 'newsletter_subscribers', 'vendor_reviews', 'blog_posts'].includes(table)) {
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
