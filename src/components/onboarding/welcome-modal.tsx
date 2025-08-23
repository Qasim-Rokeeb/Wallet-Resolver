
"use client";

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Rocket } from 'lucide-react';

const WELCOME_MODAL_KEY = 'welcome_modal_shown';

export function WelcomeModal() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const hasBeenShown = localStorage.getItem(WELCOME_MODAL_KEY);
    if (!hasBeenShown) {
      setIsOpen(true);
    }
  }, []);

  const handleClose = () => {
    localStorage.setItem(WELCOME_MODAL_KEY, 'true');
    setIsOpen(false);
  };

  if (!isOpen) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-primary/10 rounded-full">
                <Rocket className="h-10 w-10 text-primary" />
            </div>
          </div>
          <DialogTitle className="text-center text-2xl font-bold">Welcome to Wallet Resolver!</DialogTitle>
          <DialogDescription className="text-center text-base pt-2">
            The simplest way to send and receive crypto with just a phone number.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4 text-center">
            <p className="text-muted-foreground">
                Get started by registering your number or sending a payment to a friend.
            </p>
        </div>
        <DialogFooter>
          <Button onClick={handleClose} className="w-full" size="lg">
            Let's Get Started
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
