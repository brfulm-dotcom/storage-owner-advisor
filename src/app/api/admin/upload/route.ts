import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

// =============================================================
// ADMIN UPLOAD ROUTE
// Handles file uploads to Supabase Storage for blog images.
// Protected by ADMIN_PASSWORD environment variable.
// =============================================================

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
const BUCKET = 'blog-images';
const MAX_SIZE_BYTES = 4 * 1024 * 1024; // 4MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

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

function slugifyFilename(name: string) {
  const ext = name.includes('.') ? name.substring(name.lastIndexOf('.')) : '';
  const base = (ext ? name.substring(0, name.lastIndexOf('.')) : name)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .substring(0, 60);
  return `${base || 'image'}${ext.toLowerCase()}`;
}

export async function POST(request: NextRequest) {
  if (!checkPassword(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const formData = await request.formData();
  const file = formData.get('file');

  if (!file || !(file instanceof File)) {
    return NextResponse.json({ error: 'No file provided' }, { status: 400 });
  }

  if (!ALLOWED_TYPES.includes(file.type)) {
    return NextResponse.json(
      { error: `Unsupported file type. Use JPG, PNG, WebP, or GIF.` },
      { status: 400 }
    );
  }

  if (file.size > MAX_SIZE_BYTES) {
    return NextResponse.json(
      { error: 'File too large. Max 4MB.' },
      { status: 400 }
    );
  }

  const supabase = getAdminClient();
  const timestamp = Date.now();
  const safeName = slugifyFilename(file.name);
  const path = `${timestamp}-${safeName}`;

  const bytes = Buffer.from(await file.arrayBuffer());

  const { error: uploadError } = await supabase.storage
    .from(BUCKET)
    .upload(path, bytes, {
      contentType: file.type,
      cacheControl: '31536000',
      upsert: false,
    });

  if (uploadError) {
    console.error('Upload error:', uploadError);
    return NextResponse.json(
      { error: uploadError.message || 'Upload failed' },
      { status: 500 }
    );
  }

  const { data: publicUrlData } = supabase.storage
    .from(BUCKET)
    .getPublicUrl(path);

  return NextResponse.json({ url: publicUrlData.publicUrl, path });
}
