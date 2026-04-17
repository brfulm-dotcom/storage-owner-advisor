import { Resend } from 'resend';
import { NextRequest, NextResponse } from 'next/server';

const ADMIN_EMAIL = 'brfulm@gmail.com';
const FROM_EMAIL = 'noreply@storageowneradvisor.com';

export async function POST(request: NextRequest) {
  try {
    const resend = new Resend(process.env.RESEND_API_KEY);
    const body = await request.json();
    const { type, data } = body;

    let subject = '';
    let html = '';

    switch (type) {
      case 'submission':
        subject = `New Vendor Submission: ${data.companyName}`;
        html = `
          <h2>New Vendor Submission</h2>
          <table style="border-collapse: collapse; width: 100%; max-width: 600px;">
            <tr><td style="padding: 8px; font-weight: bold; border-bottom: 1px solid #eee;">Company</td><td style="padding: 8px; border-bottom: 1px solid #eee;">${data.companyName}</td></tr>
            <tr><td style="padding: 8px; font-weight: bold; border-bottom: 1px solid #eee;">Website</td><td style="padding: 8px; border-bottom: 1px solid #eee;"><a href="${data.website}">${data.website}</a></td></tr>
            <tr><td style="padding: 8px; font-weight: bold; border-bottom: 1px solid #eee;">Category</td><td style="padding: 8px; border-bottom: 1px solid #eee;">${data.category}</td></tr>
            <tr><td style="padding: 8px; font-weight: bold; border-bottom: 1px solid #eee;">Email</td><td style="padding: 8px; border-bottom: 1px solid #eee;"><a href="mailto:${data.contactEmail}">${data.contactEmail}</a></td></tr>
            <tr><td style="padding: 8px; font-weight: bold; border-bottom: 1px solid #eee;">Phone</td><td style="padding: 8px; border-bottom: 1px solid #eee;">${data.phone}</td></tr>
            <tr><td style="padding: 8px; font-weight: bold; border-bottom: 1px solid #eee;">Description</td><td style="padding: 8px; border-bottom: 1px solid #eee;">${data.description}</td></tr>
          </table>
          <p style="margin-top: 20px; color: #666; font-size: 14px;">
            Log in to <a href="https://supabase.com/dashboard">Supabase</a> to review and approve this submission.
          </p>
        `;
        break;

      case 'claim':
        subject = `New Claim Request: ${data.vendorName}`;
        html = `
          <h2>New Listing Claim Request</h2>
          <table style="border-collapse: collapse; width: 100%; max-width: 600px;">
            <tr><td style="padding: 8px; font-weight: bold; border-bottom: 1px solid #eee;">Vendor</td><td style="padding: 8px; border-bottom: 1px solid #eee;">${data.vendorName}</td></tr>
            <tr><td style="padding: 8px; font-weight: bold; border-bottom: 1px solid #eee;">Vendor Slug</td><td style="padding: 8px; border-bottom: 1px solid #eee;">${data.vendorSlug}</td></tr>
            <tr><td style="padding: 8px; font-weight: bold; border-bottom: 1px solid #eee;">Contact Name</td><td style="padding: 8px; border-bottom: 1px solid #eee;">${data.contactName}</td></tr>
            <tr><td style="padding: 8px; font-weight: bold; border-bottom: 1px solid #eee;">Email</td><td style="padding: 8px; border-bottom: 1px solid #eee;"><a href="mailto:${data.contactEmail}">${data.contactEmail}</a></td></tr>
            <tr><td style="padding: 8px; font-weight: bold; border-bottom: 1px solid #eee;">Phone</td><td style="padding: 8px; border-bottom: 1px solid #eee;">${data.contactPhone || 'Not provided'}</td></tr>
            <tr><td style="padding: 8px; font-weight: bold; border-bottom: 1px solid #eee;">Job Title</td><td style="padding: 8px; border-bottom: 1px solid #eee;">${data.jobTitle || 'Not provided'}</td></tr>
            <tr><td style="padding: 8px; font-weight: bold; border-bottom: 1px solid #eee;">Message</td><td style="padding: 8px; border-bottom: 1px solid #eee;">${data.message || 'No message'}</td></tr>
          </table>
          <p style="margin-top: 20px; color: #666; font-size: 14px;">
            Log in to <a href="https://supabase.com/dashboard">Supabase</a> to review this claim.
          </p>
        `;
        break;

      case 'contact':
        subject = `New Contact Message: ${data.subject}`;
        html = `
          <h2>New Contact Form Message</h2>
          <table style="border-collapse: collapse; width: 100%; max-width: 600px;">
            <tr><td style="padding: 8px; font-weight: bold; border-bottom: 1px solid #eee;">Name</td><td style="padding: 8px; border-bottom: 1px solid #eee;">${data.name}</td></tr>
            <tr><td style="padding: 8px; font-weight: bold; border-bottom: 1px solid #eee;">Email</td><td style="padding: 8px; border-bottom: 1px solid #eee;"><a href="mailto:${data.email}">${data.email}</a></td></tr>
            <tr><td style="padding: 8px; font-weight: bold; border-bottom: 1px solid #eee;">Subject</td><td style="padding: 8px; border-bottom: 1px solid #eee;">${data.subject}</td></tr>
            <tr><td style="padding: 8px; font-weight: bold; border-bottom: 1px solid #eee;">Message</td><td style="padding: 8px; border-bottom: 1px solid #eee;">${data.message}</td></tr>
          </table>
          <p style="margin-top: 20px; color: #666; font-size: 14px;">
            Reply directly to <a href="mailto:${data.email}">${data.email}</a> to respond.
          </p>
        `;
        break;

      case 'newsletter':
        subject = `New Newsletter Subscriber: ${data.email}`;
        html = `
          <h2>New Newsletter Subscriber</h2>
          <table style="border-collapse: collapse; width: 100%; max-width: 600px;">
            <tr><td style="padding: 8px; font-weight: bold; border-bottom: 1px solid #eee;">Email</td><td style="padding: 8px; border-bottom: 1px solid #eee;"><a href="mailto:${data.email}">${data.email}</a></td></tr>
          </table>
          <p style="margin-top: 20px; color: #666; font-size: 14px;">
            View all subscribers in <a href="https://supabase.com/dashboard">Supabase</a> → newsletter_subscribers table.
          </p>
        `;
        break;

      default:
        return NextResponse.json({ error: 'Invalid notification type' }, { status: 400 });
    }

    const { error } = await resend.emails.send({
      from: `StorageOwnerAdvisor <${FROM_EMAIL}>`,
      to: ADMIN_EMAIL,
      subject,
      html,
    });

    if (error) {
      console.error('Resend error:', error);
      return NextResponse.json({ error: 'Failed to send notification' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Notify API error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
