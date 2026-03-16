'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Upload, X, Crown, Plus, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface MultiImageUploadProps {
  images: string[];
  onChange: (images: string[]) => void;
  bucket: 'cars' | 'apartments' | 'hotels' | 'villas' | 'bundles';
  label?: string;
}

export function MultiImageUpload({ images, onChange, bucket, label = 'Images' }: MultiImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [urlInput, setUrlInput] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Keep a ref to the latest images so handleFile never has a stale closure
  const imagesRef = useRef<string[]>(images);
  useEffect(() => { imagesRef.current = images; }, [images]);

  const setMain = (index: number) => {
    if (index === 0) return;
    const next = [...images];
    const [moved] = next.splice(index, 1);
    next.unshift(moved);
    onChange(next);
  };

  const remove = (index: number) => {
    onChange(images.filter((_, i) => i !== index));
  };

  const addUrl = () => {
    const trimmed = urlInput.trim();
    if (!trimmed || images.includes(trimmed)) return;
    onChange([...images, trimmed]);
    setUrlInput('');
  };

  const handleFile = useCallback(async (file: File) => {
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('bucket', bucket);

      const res = await fetch('/api/admin/upload', { method: 'POST', body: formData });
      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: 'Upload failed' }));
        toast.error('Upload failed', { description: err.error });
        return;
      }
      const { url } = await res.json();
      if (url) {
        onChange([...imagesRef.current, url]);
      }
    } catch {
      toast.error('Upload failed');
    } finally {
      setUploading(false);
    }
  }, [bucket, onChange]);

  return (
    <div className="space-y-3">
      <Label>{label}</Label>

      {/* Images grid */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {images.map((src, i) => (
            <div
              key={src}
              className={cn(
                'relative group rounded-lg overflow-hidden border-2 aspect-video bg-muted',
                i === 0 ? 'border-primary shadow-md shadow-primary/20' : 'border-border/50'
              )}
            >
              <img src={src} alt={`Image ${i + 1}`} className="w-full h-full object-cover" />

              {i === 0 && (
                <div className="absolute top-1 left-1 flex items-center gap-1 bg-primary text-primary-foreground text-[10px] font-semibold px-1.5 py-0.5 rounded-full">
                  <Crown className="h-2.5 w-2.5" /> Main
                </div>
              )}

              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                {i !== 0 && (
                  <button
                    type="button"
                    title="Set as main"
                    onClick={() => setMain(i)}
                    className="h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center hover:bg-primary/90 transition-colors"
                  >
                    <Crown className="h-3.5 w-3.5" />
                  </button>
                )}
                <button
                  type="button"
                  title="Remove"
                  onClick={() => remove(i)}
                  className="h-8 w-8 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center hover:bg-destructive/90 transition-colors"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add image row */}
      <div className="flex gap-2">
        <Input
          value={urlInput}
          onChange={e => setUrlInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addUrl())}
          placeholder="Paste image URL and press Enter..."
          className="bg-background flex-1"
        />
        <Button type="button" variant="outline" size="icon" onClick={addUrl} disabled={!urlInput.trim()} title="Add URL">
          <Plus className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="outline"
          size="icon"
          disabled={uploading}
          title="Upload file"
          onClick={() => fileInputRef.current?.click()}
        >
          {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
        </Button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={e => {
            const file = e.target.files?.[0];
            if (file) handleFile(file);
            e.target.value = '';
          }}
        />
      </div>

      {images.length === 0 && (
        <p className="text-xs text-muted-foreground">No images yet. Paste a URL or upload a file.</p>
      )}
      {images.length > 0 && (
        <p className="text-xs text-muted-foreground">
          Hover to remove or set as main. First image = main.
        </p>
      )}
    </div>
  );
}
