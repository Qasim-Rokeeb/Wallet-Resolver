
"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, ArrowRight, Loader2, Cpu, Check, Send, AlertTriangle, XCircle, RefreshCw } from 'lucide-react';
import { Separator } from '../ui/separator';

interface TransactionProgressProps {
  transaction: {
    phone: string;
    amount: number;
    gas: number;
  };
  onComplete: () => void;
}

const statusSteps = [
  { status: 'Processing...', icon: <Loader2 className="h-5 w-5 animate-spin" />, progress: 25 },
  { status: 'Submitting to network...', icon: <Send className="h-5 w-5 text-primary" />, progress: 50 },
  { status: 'Confirming on Blockchain...', icon: <Cpu className="h-5 w-5 text-primary" />, progress: 75 },
  { status: 'Success!', icon: <Check className="h-5 w-5 text-primary" />, progress: 100 },
];


export function TransactionProgress({ transaction, onComplete }: TransactionProgressProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    if (isError || currentStep >= statusSteps.length - 1) {
      return; // Stop if there's an error or it's complete
    }

    const timer = setTimeout(() => {
      // Simulate a failure at the "Confirming" step
      if (currentStep === 2 && Math.random() < 0.4) { // 40% chance of failure
        setIsError(true);
      } else {
        setCurrentStep(prev => prev + 1);
      }
    }, 1500);
    return () => clearTimeout(timer);
  }, [currentStep, isError]);

  const handleRetry = () => {
      setIsError(false);
      setCurrentStep(0);
  }

  const { status, icon, progress } = statusSteps[currentStep];
  const isComplete = !isError && currentStep === statusSteps.length - 1;

  const totalAmount = transaction.amount + transaction.gas;
  
  if (isError) {
      return (
        <Card className="w-full border-none shadow-none">
            <CardHeader>
                <div className="flex flex-col items-center justify-center text-center p-6 space-y-4">
                     <XCircle className="h-24 w-24 text-destructive" />
                    <CardTitle className="text-2xl pt-2">Transaction Failed</CardTitle>
                    <CardDescription>
                        Unfortunately, we were unable to process your transaction. Please try again.
                    </CardDescription>
                </div>
            </CardHeader>
            <CardContent>
                <div className="space-y-2 text-sm rounded-lg bg-muted/50 p-4">
                    <div className="flex justify-between">
                        <span className="text-muted-foreground">To:</span>
                        <span className="font-medium">{transaction.phone}</span>
                    </div>
                    <div className="flex justify-between font-bold text-base">
                        <span>Total:</span>
                        <span>{totalAmount.toFixed(4)} ETH</span>
                    </div>
                </div>
            </CardContent>
            <CardFooter className="grid grid-cols-2 gap-2">
                 <Button variant="outline" onClick={onComplete}>
                    Back to Form
                </Button>
                <Button onClick={handleRetry}>
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Try Again
                </Button>
            </CardFooter>
        </Card>
      )
  }

  return (
    <Card className="w-full border-none shadow-none">
        <CardHeader>
            {isComplete ? (
                <div className="flex flex-col items-center justify-center text-center p-6 space-y-4">
                    <div className="h-24 w-24">
                        <svg
                            className="w-full h-full"
                            viewBox="0 0 52 52"
                        >
                            <circle
                                className="text-green-500/20 stroke-current"
                                cx="26"
                                cy="26"
                                r="25"
                                fill="none"
                            />
                            <circle
                                className="text-green-600 stroke-current animate-checkmark-circle"
                                strokeLinecap="round"
                                cx="26"
                                cy="26"
                                r="25"
                                fill="none"
                            />
                            <path
                                className="text-green-600 stroke-current animate-checkmark-check"
                                fill="none"
                                strokeLinecap="round"
                                strokeMiterlimit="10"
                                d="M14 27l5.917 5.917L38 20"
                            />
                        </svg>
                    </div>
                    <CardTitle className="text-2xl pt-2">Transaction Sent!</CardTitle>
                    <CardDescription>
                        You successfully sent {transaction.amount.toFixed(4)} ETH to {transaction.phone}.
                    </CardDescription>
                </div>
            ) : (
                <>
                <CardTitle className="text-center text-xl">Sending Payment</CardTitle>
                <CardDescription className="text-center">Please wait while we securely process your transaction.</CardDescription>
                </>
            )}
        </CardHeader>
        <CardContent className="space-y-6">
            {!isComplete && (
                <>
                    <div className="space-y-2">
                        <Progress value={progress} className="h-2" />
                        <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                            {icon}
                            <span>{status}</span>
                        </div>
                    </div>
                    <Separator />
                </>
            )}
            
            <div className="space-y-2 text-sm rounded-lg bg-muted/50 p-4">
                <div className="flex justify-between">
                    <span className="text-muted-foreground">To:</span>
                    <span className="font-medium">{transaction.phone}</span>
                </div>
                 <div className="flex justify-between">
                    <span className="text-muted-foreground">Amount:</span>
                    <span className="font-medium">{transaction.amount.toFixed(4)} ETH</span>
                </div>
                 <div className="flex justify-between">
                    <span className="text-muted-foreground">Gas Fee:</span>
                    <span className="font-medium">{transaction.gas.toFixed(4)} ETH</span>
                </div>
                 <div className="flex justify-between font-bold text-base">
                    <span>Total:</span>
                    <span>{totalAmount.toFixed(4)} ETH</span>
                </div>
            </div>
        </CardContent>
        {isComplete && (
            <CardFooter>
                 <Button onClick={onComplete} className="w-full">
                    Done
                </Button>
            </CardFooter>
        )}
    </Card>
  );
}
