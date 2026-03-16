
import React, { useRef, useEffect, useState } from 'react';
import { Copy, Download, Smartphone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import QRCode from 'qrcode';

interface QRCodeSectionProps {
  url?: string;
  title?: string;
  className?: string;
}

const QRCodeSection: React.FC<QRCodeSectionProps> = ({ 
  url = typeof window !== 'undefined' ? window.location.origin : '', 
  title = "Scan to visit on mobile",
  className = ""
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [qrDataURL, setQrDataURL] = useState<string>('');

  useEffect(() => {
    const generateQRCode = async () => {
      if (canvasRef.current) {
        try {
          const canvas = canvasRef.current;
          await QRCode.toCanvas(canvas, url, {
            width: 140,
            margin: 2,
            color: {
              dark: '#000000',
              light: '#FFFFFF'
            },
            errorCorrectionLevel: 'M'
          });
          setQrDataURL(canvas.toDataURL('image/png'));
        } catch (error) {
          console.error('Error generating QR code:', error);
        }
      }
    };

    generateQRCode();
  }, [url]);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      toast.success('Link copied to clipboard!');
    } catch (err) {
      toast.error('Failed to copy link');
    }
  };

  const handleCopyQR = async () => {
    if (!qrDataURL) return;
    
    try {
      // Convert data URL to blob
      const response = await fetch(qrDataURL);
      const blob = await response.blob();
      
      await navigator.clipboard.write([
        new ClipboardItem({
          [blob.type]: blob
        })
      ]);
      toast.success('QR code copied to clipboard!');
    } catch (err) {
      // Fallback: copy the data URL
      try {
        await navigator.clipboard.writeText(qrDataURL);
        toast.success('QR code data copied to clipboard!');
      } catch (fallbackErr) {
        toast.error('Failed to copy QR code');
      }
    }
  };

  const handleDownloadQR = () => {
    if (!qrDataURL) return;
    
    const link = document.createElement('a');
    link.download = 'safeer-qr-code.png';
    link.href = qrDataURL;
    link.click();
    toast.success('QR code downloaded!');
  };

  return (
    <div className={`text-center ${className}`}>
      <div className="flex items-center justify-center gap-2 mb-4">
        <Smartphone className="w-4 h-4 text-background/70" />
        <span className="text-sm font-medium text-background/90">{title}</span>
      </div>
      
      <div className="bg-white p-4 rounded-xl shadow-lg inline-block mb-4 border border-gray-100">
        <canvas
          ref={canvasRef}
          className="block rounded-lg"
        />
      </div>
      
      <div className="flex justify-center gap-2 mb-3">
        <Button
          variant="outline"
          size="sm"
          onClick={handleCopyQR}
          className="text-xs h-8 px-3 bg-background/10 border-background/30 text-background/90 hover:bg-background/20 hover:text-background transition-all duration-200"
        >
          <Copy className="w-3 h-3 mr-1.5" />
          Copy QR
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={handleDownloadQR}
          className="text-xs h-8 px-3 bg-background/10 border-background/30 text-background/90 hover:bg-background/20 hover:text-background transition-all duration-200"
        >
          <Download className="w-3 h-3 mr-1.5" />
          Download
        </Button>
      </div>
      
      <div className="text-xs text-background/70 max-w-xs mx-auto">
        <div className="truncate mb-2 font-mono text-xs bg-background/10 px-2 py-1 rounded border border-background/20">
          {url}
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleCopyLink}
          className="text-xs h-7 px-2 text-background/70 hover:text-background/90 hover:bg-background/10 transition-all duration-200"
        >
          <Copy className="w-3 h-3 mr-1" />
          Copy link
        </Button>
      </div>
    </div>
  );
};

export default QRCodeSection;
