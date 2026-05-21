export const MAX_IMAGE_SIZE_BYTES = 10 * 1024 * 1024;
export const MAX_IMAGE_SIZE_LABEL = '10 MB';

export type AdminUploadBucket =
  | 'cars'
  | 'apartments'
  | 'hotels'
  | 'villas'
  | 'bundles'
  | 'blog-images';

export async function uploadAdminImage(file: File, bucket: AdminUploadBucket): Promise<string> {
  if (file.size > MAX_IMAGE_SIZE_BYTES) {
    throw new Error(`Image is too large. Maximum size is ${MAX_IMAGE_SIZE_LABEL}.`);
  }

  const fileExt = file.name.split('.').pop() || 'jpg';
  const signRes = await fetch('/api/admin/upload/signed', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ bucket, contentType: file.type, fileExt }),
  });

  if (!signRes.ok) {
    const err = await signRes.json().catch(() => ({ error: 'Failed to prepare upload' }));
    throw new Error(err.error || 'Failed to prepare upload');
  }

  const { signedUrl, publicUrl } = await signRes.json();

  const uploadRes = await fetch(signedUrl, {
    method: 'PUT',
    body: file,
    headers: {
      'Content-Type': file.type || 'application/octet-stream',
    },
  });

  if (!uploadRes.ok) {
    throw new Error('Upload to storage failed');
  }

  return publicUrl as string;
}
