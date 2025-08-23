
"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { CoinbaseIcon } from '../icons/coinbase';
import { LedgerIcon } from '../icons/ledger';
import { MetamaskIcon } from '../icons/metamask';
import { WalletConnectIcon } from '../icons/walletconnect';
import { useWallet } from '@/context/wallet-context';
import { Loader2 } from 'lucide-react';

const walletProviders = [
    { name: 'MetaMask', icon: MetamaskIcon },
    { name: 'Coinbase Wallet', icon: CoinbaseIcon },
    { name: 'WalletConnect', icon: WalletConnectIcon },
    { name: 'Ledger', icon: LedgerIcon },
];

interface WalletConnectModalProps {
    children: React.ReactNode;
    onConnect?: (address: string) => void;
}

export function WalletConnectModal({ children, onConnect }: WalletConnectModalProps) {
    const { toast } = useToast();
    const [isOpen, setIsOpen] = useState(false);
    const [loadingWallet, setLoadingWallet] = useState<string | null>(null);
    const { connectWallet } = useWallet();

    const handleWalletConnect = (walletName: string) => {
        setLoadingWallet(walletName);
        console.log(`Connecting with ${walletName}...`);
        // Mock connection logic with random failure
        setTimeout(() => {
            if (Math.random() > 0.3) { // 70% success rate
                const mockAddress = "0x" + Array(40).fill(0).map(() => Math.floor(Math.random() * 16).toString(16)).join('');
                
                if (onConnect) {
                    onConnect(mockAddress);
                } else {
                    connectWallet(mockAddress);
                }
                
                setLoadingWallet(null);
                setIsOpen(false);
            } else {
                toast({
                    variant: 'destructive',
                    title: 'Connection Failed',
                    description: `Could not connect to ${walletName}. Please try again.`
                });
                setLoadingWallet(null);
            }
        }, 1500);
    };

    const handleOpenChange = (open: boolean) => {
        setIsOpen(open);
        if (!open) {
            setLoadingWallet(null);
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={handleOpenChange}>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent className="sm:max-w-sm">
                <DialogHeader>
                    <DialogTitle className="text-center text-2xl">Connect a Wallet</DialogTitle>
                    <DialogDescription className="text-center pt-1">
                        Choose your wallet provider to continue.
                    </DialogDescription>
                </DialogHeader>
                <div className="flex flex-col space-y-2 pt-4">
                    {walletProviders.map((provider) => {
                        const isLoading = loadingWallet === provider.name;
                        return (
                            <Button
                                key={provider.name}
                                variant="outline"
                                className="w-full justify-start h-14 text-base gap-4 px-4"
                                onClick={() => handleWalletConnect(provider.name)}
                                disabled={isLoading || (loadingWallet !== null && loadingWallet !== provider.name)}
                            >
                               {isLoading ? (
                                    <Loader2 className="h-8 w-8 animate-spin" />
                                ) : (
                                    <provider.icon className="h-8 w-8" />
                                )}
                               <span>{provider.name}</span>
                            </Button>
                        )
                    })}
                </div>
            </DialogContent>
        </Dialog>
    );
}
