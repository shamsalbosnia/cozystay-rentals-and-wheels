import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { createSupabaseServerClient } from '@/lib/supabaseServer';

const ALLOWED_BUCKETS = [
  'cars',
  'apartments',
  'hotels',
  'villas',
  'bundles',
  'blog-images',
] as const;

type AllowedBucket = (typeof ALLOWED_BUCKETS)[number];

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  let body: { bucket?: string; fileExt?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }

  const bucket = body.bucket as AllowedBucket | undefined;
  if (!bucket || !ALLOWED_BUCKETS.includes(bucket)) {
    return NextResponse.json({ error: 'Invalid bucket' }, { status: 400 });
  }

  const ext = (body.fileExt || 'jpg').replace(/[^a-z0-9]/gi, '') || 'jpg';
  const fileName = `${Math.random().toString(36).slice(2)}.${ext}`;

  const supabase = createSupabaseServerClient();
  const { data, error } = await supabase.storage.from(bucket).createSignedUploadUrl(fileName);

  if (error || !data) {
    return NextResponse.json({ error: error?.message || 'Failed to create upload URL' }, { status: 500 });
  }

  const { data: publicData } = supabase.storage.from(bucket).getPublicUrl(fileName);

  return NextResponse.json({
    signedUrl: data.signedUrl,
    token: data.token,
    path: data.path,
    publicUrl: publicData.publicUrl,
  });
}
