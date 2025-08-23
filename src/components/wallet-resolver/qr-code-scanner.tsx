
"use client";

import { useEffect, useRef, useState } from 'react';
import { Html5Qrcode, Html5QrcodeScannerState } from 'html5-qrcode';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface QrCodeScannerProps {
  onScan: (decodedText: string) => void;
}

export function QrCodeScanner({ onScan }: QrCodeScannerProps) {
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const scannerContainerId = "qr-code-reader";
  const { toast } = useToast();
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);

  useEffect(() => {
    const initializeScanner = async () => {
      try {
        await navigator.mediaDevices.getUserMedia({ video: true });
        setHasPermission(true);

        const scanner = new Html5Qrcode(scannerContainerId);
        scannerRef.current = scanner;

        if (scanner.getState() === Html5QrcodeScannerState.SCANNING) {
            return;
        }

        scanner.start(
          { facingMode: "environment" },
          {
            fps: 10,
            qrbox: { width: 250, height: 250 },
          },
          (decodedText) => {
            onScan(decodedText);
            if (scannerRef.current?.isScanning) {
                scannerRef.current.stop();
            }
          },
          (errorMessage) => {
            // console.warn(`QR Code no match: ${errorMessage}`);
          }
        ).catch(err => {
            console.error("Scanner start error:", err);
            toast({
              variant: 'destructive',
              title: 'Scanner Error',
              description: 'Could not start the QR code scanner.',
            });
        });
      } catch (err) {
        console.error("Camera permission error:", err);
        setHasPermission(false);
        toast({
          variant: 'destructive',
          title: 'Camera Access Denied',
          description: 'Please enable camera permissions in your browser settings.',
        });
      }
    };
    
    initializeScanner();

    return () => {
        if (scannerRef.current && scannerRef.current.isScanning) {
            scannerRef.current.stop().catch(err => {
              console.error("Failed to stop scanner", err);
            });
        }
    };
  }, [onScan, toast]);

  return (
    <div>
        <div id={scannerContainerId} className="w-full aspect-square rounded-md bg-muted" aria-label="QR Code Scanner Viewport" />
        {hasPermission === false && (
             <Alert variant="destructive" className="mt-4">
              <AlertTitle>Camera Access Required</AlertTitle>
              <AlertDescription>
                Please allow camera access to use the QR code scanner.
              </AlertDescription>
            </Alert>
        )}
    </div>
  );
}
