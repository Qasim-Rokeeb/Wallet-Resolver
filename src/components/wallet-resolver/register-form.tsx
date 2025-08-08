"use client";

import { useFormState, useFormStatus } from 'react-dom';
import { register } from '@/app/actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Loader2, CheckCircle, UserPlus, Wallet, AlertCircle } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

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
          Registering...
        </>
      ) : (
        <>
          <UserPlus className="mr-2 h-4 w-4" />
          Register Phone
        </>
      )}
    </Button>
  );
}

export function RegisterForm() {
  const [state, formAction] = useFormState(register, initialState);
  const [walletAddress, setWalletAddress] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.status === 'success') {
      formRef.current?.reset();
      setWalletAddress('');
      setIsConnected(false);
    }
  }, [state.status]);

  const connectWallet = () => {
    const mockAddress = `0x${Array(40).fill(0).map(() => Math.floor(Math.random() * 16).toString(16)).join('')}`;
    setWalletAddress(mockAddress);
    setIsConnected(true);
  };

  return (
    <>
      <div className="flex justify-center mb-6">
        <Button onClick={connectWallet} variant="outline" className="w-full" disabled={isConnected}>
          <Wallet className="mr-2 h-4 w-4" />
          {isConnected ? 'Wallet Connected' : 'Connect Wallet'}
        </Button>
      </div>

      <form ref={formRef} action={formAction} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="register-phone">Your Phone Number</Label>
          <Input id="register-phone" name="phone" type="tel" placeholder="+1 (555) 987-6543" required />
          {state?.errors?.phone && <p className="text-sm font-medium text-destructive">{state.errors.phone[0]}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="walletAddress">Wallet Address</Label>
          <Input id="walletAddress" name="walletAddress" value={walletAddress} onChange={(e) => setWalletAddress(e.target.value)} placeholder="Connect wallet or paste address" required />
          {state?.errors?.walletAddress && <p className="text-sm font-medium text-destructive">{state.errors.walletAddress[0]}</p>}
        </div>
        <SubmitButton />
        {state.message && (
          <Alert variant={state.status === 'error' ? 'destructive' : 'default'} className="mt-4 animate-in fade-in-50">
            {state.status === 'success' ? <CheckCircle className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
            <AlertTitle>{state.status === 'success' ? 'Success' : 'Error'}</AlertTitle>
            <AlertDescription>{state.message}</AlertDescription>
          </Alert>
        )}
      </form>
    </>
  );
}
