"use client";

import { useFormState, useFormStatus } from 'react-dom';
import { send } from '@/app/actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Loader2, Send, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { useEffect, useRef } from 'react';

const initialState = {
  message: null,
  status: null,
  errors: null,
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" className="w-full" disabled={pending}>
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Sending...
        </>
      ) : (
        <>
          <Send className="mr-2 h-4 w-4" />
          Send Payment
        </>
      )}
    </Button>
  );
}

export function SendForm() {
  const [state, formAction] = useFormState(send, initialState);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.status === 'success' || state.status === 'escrow') {
      formRef.current?.reset();
    }
  }, [state.status]);

  return (
    <form ref={formRef} action={formAction} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="send-phone">Recipient's Phone Number</Label>
        <Input id="send-phone" name="phone" type="tel" placeholder="+1 (555) 123-4567" required />
        {state?.errors?.phone && <p className="text-sm font-medium text-destructive">{state.errors.phone[0]}</p>}
      </div>
      <div className="space-y-2">
        <Label htmlFor="amount">Amount (ETH)</Label>
        <Input id="amount" name="amount" type="number" step="0.01" placeholder="0.1" required />
        {state?.errors?.amount && <p className="text-sm font-medium text-destructive">{state.errors.amount[0]}</p>}
      </div>
      <SubmitButton />
      {state.message && (
        <Alert variant={state.status === 'error' ? 'destructive' : 'default'} className="mt-4 animate-in fade-in-50">
           {state.status === 'success' && <CheckCircle className="h-4 w-4" />}
           {state.status === 'escrow' && <Clock className="h-4 w-4" />}
           {state.status === 'error' && <AlertCircle className="h-4 w-4" />}
          <AlertTitle>
            {state.status === 'success' && 'Transaction Sent'}
            {state.status === 'escrow' && 'Funds in Escrow'}
            {state.status === 'error' && 'Submission Error'}
          </AlertTitle>
          <AlertDescription>{state.message}</AlertDescription>
        </Alert>
      )}
    </form>
  );
}
