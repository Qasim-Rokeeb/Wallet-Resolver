
"use client";

import { useState } from 'react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { X, Info } from 'lucide-react';
import { Button } from '../ui/button';
import { cn } from '@/lib/utils';

interface AlertBannerProps {
  title: string;
  description?: string;
  variant?: "default" | "destructive";
  initiallyVisible?: boolean;
}

export function AlertBanner({ title, description, variant = "default", initiallyVisible = true }: AlertBannerProps) {
  const [isVisible, setIsVisible] = useState(initiallyVisible);

  if (!isVisible) {
    return null;
  }

  return (
    <div className={cn("relative", {
      "bg-primary text-primary-foreground": variant === 'default',
      "bg-destructive text-destructive-foreground": variant === 'destructive',
    })}>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between py-3">
                <div className="flex items-center">
                    <Info className="h-5 w-5 mr-3 flex-shrink-0" />
                    <div className="text-sm">
                        <span className="font-bold">{title}</span>
                        {description && <span className="ml-2">{description}</span>}
                    </div>
                </div>
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsVisible(false)}
                    className="h-8 w-8 hover:bg-white/20 flex-shrink-0"
                    aria-label="Dismiss"
                >
                    <X className="h-5 w-5" />
                </Button>
            </div>
        </div>
    </div>
  );
}
