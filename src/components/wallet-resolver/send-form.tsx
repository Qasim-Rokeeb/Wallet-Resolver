
"use client";

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Send } from 'lucide-react';

export function SendForm() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="send-phone">Recipient's Phone Number</Label>
        <Input id="send-phone" name="phone" type="tel" placeholder="+1 (555) 123-4567" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="amount">Amount (ETH)</Label>
        <Input id="amount" name="amount" type="number" step="0.01" placeholder="0.1" />
      </div>
      <Button type="submit" className="w-full">
        <Send className="mr-2 h-4 w-4" />
        Send Payment
      </Button>
    </div>
  );
}
