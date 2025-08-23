
"use client";

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { LogOut, Timer } from 'lucide-react';

interface SessionExpirationModalProps {
  isOpen: boolean;
  onExtend: () => void;
  onLogout: () => void;
}

const MODAL_COUNTDOWN_SECONDS = 120; // 2 minutes

export function SessionExpirationModal({ isOpen, onExtend, onLogout }: SessionExpirationModalProps) {
  const [countdown, setCountdown] = useState(MODAL_COUNTDOWN_SECONDS);

  useEffect(() => {
    if (isOpen) {
      setCountdown(MODAL_COUNTDOWN_SECONDS);
      const timer = setInterval(() => {
        setCountdown((prevCountdown) => {
          if (prevCountdown <= 1) {
            clearInterval(timer);
            onLogout();
            return 0;
          }
          return prevCountdown - 1;
        });
      }, 1000);
      
      return () => clearInterval(timer);
    }
  }, [isOpen, onLogout]);
  
  if (!isOpen) {
    return null;
  }

  const minutes = Math.floor(countdown / 60);
  const seconds = countdown % 60;

  return (
    <Dialog open={isOpen}>
      <DialogContent onInteractOutside={(e) => e.preventDefault()} showCloseButton={false}>
        <DialogHeader>
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-amber-500/10 rounded-full">
              <Timer className="h-10 w-10 text-amber-600" />
            </div>
          </div>
          <DialogTitle className="text-center text-2xl">Session Expiring Soon</DialogTitle>
          <DialogDescription className="text-center pt-2">
            For your security, you will be logged out due to inactivity.
          </DialogDescription>
        </DialogHeader>
        <div className="text-center py-4">
          <p className="text-muted-foreground">You will be logged out in:</p>
          <p className="text-4xl font-bold font-mono tracking-widest">
            {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
          </p>
        </div>
        <DialogFooter className="grid grid-cols-2 gap-2">
          <Button variant="outline" onClick={onLogout}>
            <LogOut />
            Log Out Now
          </Button>
          <Button onClick={onExtend}>
            Stay Logged In
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
