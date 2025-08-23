
"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { HelpCircle, Loader2 } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';

export function AIGuide() {
  const [guide, setGuide] = useState<string | null>(null);

  const showGuide = (task: 'add' | 'resolve') => {
    if (task === 'add') {
      setGuide('To register, connect your wallet, enter your phone number, and click "Register Phone".');
    } else {
      setGuide('To send a payment, enter the recipient\'s phone number, the amount, and click "Send Payment".');
    }
  };

  return (
    <Dialog onOpenChange={() => setGuide(null)}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" aria-label="Help">
          <HelpCircle className="h-6 w-6 text-muted-foreground hover:text-primary transition-colors" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Quick Start Guide</DialogTitle>
          <DialogDescription>
            Get a quick guide on how to use Wallet Resolver.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="flex gap-4">
            <Button
              onClick={() => showGuide('add')}
              className="w-full"
            >
              How to Register
            </Button>
            <Button
              onClick={() => showGuide('resolve')}
              className="w-full"
            >
              How to Send
            </Button>
          </div>
          {guide && <Separator />}
          {guide && (
             <Alert>
              <AlertTitle>Quick Start Guide</AlertTitle>
              <AlertDescription>
                {guide}
              </AlertDescription>
            </Alert>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
