
"use client";

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Send, Info, Fuel, Loader2, Users, Star, MessageSquare, Smile } from 'lucide-react';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { PhoneInput } from '../ui/phone-input';
import { Separator } from '../ui/separator';
import { TransactionProgress } from './transaction-progress';
import { Skeleton } from '../ui/skeleton';
import { useTransaction } from '@/context/transaction-context';
import { useFavorites } from '@/context/favorites-context';
import { Textarea } from '../ui/textarea';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import EmojiPicker, { EmojiClickData } from 'emoji-picker-react';

const sendFormSchema = z.object({
  phone: z.string().refine(value => {
        const parts = value.split(' ');
        if (parts.length < 2) return false;
        const number = parts.slice(1).join('');
        return /^\d{7,15}$/.test(number);
    }, { message: "Please enter a valid phone number." }),
  amount: z.coerce.number().positive({ message: "Amount must be positive." }),
  notes: z.string().max(100, { message: "Note must be 100 characters or less." }).optional(),
});

type SendFormValues = z.infer<typeof sendFormSchema>;

export function SendForm() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [gasFee, setGasFee] = useState<number | null>(null);
  const [isFetchingGas, setIsFetchingGas] = useState(false);
  const [formData, setFormData] = useState<SendFormValues | null>(null);
  const { recentRecipients } = useTransaction();
  const { favorites } = useFavorites();
  const maxBalance = 4.52389; // Mock balance

  const form = useForm<SendFormValues>({
    resolver: zodResolver(sendFormSchema),
    defaultValues: {
      phone: '',
      amount: undefined,
      notes: '',
    },
  });

  const amount = form.watch("amount");

  useEffect(() => {
    const fetchGasFee = () => {
      if (amount && amount > 0) {
        setIsFetchingGas(true);
        setGasFee(null);
        setTimeout(() => {
          // Simulate fetching gas fee, e.g., a small percentage of the amount
          const fee = Math.random() * 0.001;
          setGasFee(fee);
          setIsFetchingGas(false);
        }, 1000);
      } else {
        setGasFee(null);
      }
    };
    
    const debounce = setTimeout(fetchGasFee, 500);
    return () => clearTimeout(debounce);
  }, [amount]);


  const handleSubmit = (values: SendFormValues) => {
    setFormData(values);
    setLoading(true);
    setIsAlertOpen(false);
  };

  const handleSendMax = () => {
    const fee = gasFee || 0.0005; // Use current fee or a default if not calculated
    const maxSendable = maxBalance - fee;
    if (maxSendable > 0) {
        form.setValue('amount', parseFloat(maxSendable.toFixed(6)), { shouldValidate: true, shouldDirty: true });
    } else {
        toast({
            variant: 'destructive',
            title: 'Insufficient Balance',
            description: 'Your balance is not enough to cover the gas fee.',
        })
    }
  }

  const handleTransactionComplete = () => {
    setLoading(false);
    setFormData(null);
    form.reset();
  }

  const handleContactClick = (phone: string) => {
      form.setValue('phone', phone, { shouldValidate: true, shouldDirty: true });
  }

  const handleEmojiClick = (emojiData: EmojiClickData) => {
    const currentNotes = form.getValues('notes') || '';
    form.setValue('notes', currentNotes + emojiData.emoji);
  }

  if (loading && formData) {
      return <TransactionProgress 
                transaction={{ ...formData, gas: gasFee || 0 }} 
                onComplete={handleTransactionComplete}
            />;
  }

  const totalAmount = (amount || 0) + (gasFee || 0);

  return (
    <Form {...form}>
      <form onSubmit={(e) => e.preventDefault()} className="space-y-6">
        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <div className="flex items-center gap-2">
                <FormLabel>Recipient's Phone Number</FormLabel>
              </div>
              <FormControl>
                <PhoneInput placeholder="555 123 4567" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {favorites.length > 0 && (
            <div className="space-y-2">
                <Label className="flex items-center gap-2 text-muted-foreground">
                    <Star className="h-4 w-4" />
                    Favorites
                </Label>
                <div className="flex flex-wrap gap-2">
                    {favorites.map((fav, index) => (
                        <Button
                            key={index}
                            type="button"
                            variant="secondary"
                            size="sm"
                            className="text-xs h-7"
                            onClick={() => handleContactClick(fav.phone)}
                        >
                            {fav.phone}
                        </Button>
                    ))}
                </div>
            </div>
        )}
        {recentRecipients.length > 0 && (
            <div className="space-y-2">
                <Label className="flex items-center gap-2 text-muted-foreground">
                    <Users className="h-4 w-4" />
                    Recent Recipients
                </Label>
                <div className="flex flex-wrap gap-2">
                    {recentRecipients.map((phone, index) => (
                        <Button
                            key={index}
                            type="button"
                            variant="outline"
                            size="sm"
                            className="text-xs h-7"
                            onClick={() => handleContactClick(phone)}
                        >
                            {phone}
                        </Button>
                    ))}
                </div>
            </div>
        )}
        <FormField
          control={form.control}
          name="amount"
          render={({ field }) => (
            <FormItem>
              <div className="flex justify-between items-center">
                <FormLabel>Amount (ETH)</FormLabel>
                <Button
                    type="button"
                    variant="link"
                    size="sm"
                    className="h-auto p-0 text-primary"
                    onClick={handleSendMax}
                >
                    Send Max
                </Button>
              </div>
              <FormControl>
                <Input type="number" step="0.01" placeholder="0.1" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
                <div className="flex items-center justify-between">
                    <FormLabel className="flex items-center gap-2">
                        <MessageSquare className="h-4 w-4" />
                        Notes (Optional)
                    </FormLabel>
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-7 w-7">
                                <Smile className="h-4 w-4 text-muted-foreground" />
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-full p-0 border-0">
                            <EmojiPicker onEmojiClick={handleEmojiClick} />
                        </PopoverContent>
                    </Popover>
                </div>
                <FormControl>
                    <Textarea placeholder="e.g., For dinner last night 🍕" {...field} />
                </FormControl>
                <FormMessage />
            </FormItem>
          )}
        />

        {(isFetchingGas || gasFee) && (
            <div className="space-y-2 rounded-lg bg-muted/50 p-3">
                <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground">
                        <Fuel className="h-4 w-4" />
                        <span>Est. Gas Fee</span>
                        <Tooltip>
                            <TooltipTrigger asChild>
                            <Info className="h-4 w-4 cursor-help" />
                            </TooltipTrigger>
                            <TooltipContent>
                            <p>A network fee required for the transaction.</p>
                            </TooltipContent>
                        </Tooltip>
                    </div>
                    {isFetchingGas ? (
                        <Skeleton className="h-5 w-16" />
                    ) : (
                        <span className="font-medium text-foreground">{gasFee?.toFixed(6)} ETH</span>
                    )}
                </div>
                <Separator />
                 <div className="flex items-center justify-between font-semibold">
                    <span>Total</span>
                    {isFetchingGas ? (
                        <Skeleton className="h-5 w-24" />
                    ) : (
                        <span>{totalAmount.toFixed(6)} ETH</span>
                    )}
                </div>
            </div>
        )}

        <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
            <Button type="button" className="w-full" onClick={() => form.trigger().then(isValid => isValid && setIsAlertOpen(true))}>
              <Send className="mr-2 h-4 w-4" />
              Send Payment
            </Button>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Confirm Payment</AlertDialogTitle>
              <AlertDialogDescription>
                You are about to send a total of <strong className='text-foreground'>{totalAmount.toFixed(6)} ETH</strong> to <strong className='text-foreground'>{form.getValues().phone}</strong>. This includes an estimated gas fee of {gasFee?.toFixed(6)} ETH. This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={() => form.handleSubmit(handleSubmit)()}>
                Confirm
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </form>
    </Form>
  );
}
