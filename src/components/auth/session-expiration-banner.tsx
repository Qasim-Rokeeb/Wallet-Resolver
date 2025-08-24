
"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { LogOut, Timer } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SessionExpirationBannerProps {
  isOpen: boolean;
  onExtend: () => void;
  onLogout: () => void;
  countdownSeconds: number;
}

export function SessionExpirationBanner({ isOpen, onExtend, onLogout, countdownSeconds }: SessionExpirationBannerProps) {
  const [countdown, setCountdown] = useState(countdownSeconds);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isOpen) {
      setCountdown(countdownSeconds);
      timer = setInterval(() => {
        setCountdown((prevCountdown) => {
          if (prevCountdown <= 1) {
            clearInterval(timer);
            // The logout is handled by the auth context timeout, so we don't call it here.
            return 0;
          }
          return prevCountdown - 1;
        });
      }, 1000);
    }
    
    return () => clearInterval(timer);
  }, [isOpen, countdownSeconds]);
  
  const minutes = Math.floor(countdown / 60);
  const seconds = countdown % 60;

  return (
    <div className={cn(
        "bg-amber-500 text-white transition-all duration-300 ease-in-out overflow-hidden",
        isOpen ? "max-h-20" : "max-h-0"
    )}>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between py-3">
                <div className="flex items-center gap-4">
                    <Timer className="h-6 w-6" />
                    <div>
                        <p className="font-bold">Session Expiring Soon</p>
                        <p className="text-sm">
                            You will be logged out in{" "}
                            <span className="font-mono tracking-widest">
                                {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
                            </span>
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="ghost" className="hover:bg-white/20" onClick={onLogout}>
                        <LogOut className="mr-2" />
                        Log Out
                    </Button>
                    <Button onClick={onExtend} className="bg-white text-amber-600 hover:bg-white/90">
                        Stay Logged In
                    </Button>
                </div>
            </div>
        </div>
    </div>
  );
}
