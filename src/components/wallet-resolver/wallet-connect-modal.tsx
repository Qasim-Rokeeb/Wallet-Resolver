
"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { CoinbaseIcon } from '../icons/coinbase';
import { LedgerIcon } from '../icons/ledger';
import { MetamaskIcon } from '../icons/metamask';
import { WalletConnectIcon } from '../icons/walletconnect';

const walletProviders = [
    { name: 'MetaMask', icon: MetamaskIcon },
    { name: 'Coinbase Wallet', icon: CoinbaseIcon },
    { name: 'WalletConnect', icon: WalletConnectIcon },
    { name: 'Ledger', icon: LedgerIcon },
];

interface WalletConnectModalProps {
    children: React.ReactNode;
    onConnect: (address: string) => void;
}

export function WalletConnectModal({ children, onConnect }: WalletConnectModalProps) {
    const { toast } = useToast();
    const [isOpen, setIsOpen] = useState(false);

    const handleWalletConnect = (walletName: string) => {
        console.log(`Connecting with ${walletName}...`);
        // Mock connection logic
        setTimeout(() => {
            const mockAddress = "0x" + Array(40).fill(0).map(() => Math.floor(Math.random() * 16).toString(16)).join('');
            toast({
                variant: 'success',
                title: 'Wallet Connected!',
                description: `Connected to ${walletName}.`,
            });
            onConnect(mockAddress);
            setIsOpen(false);
        }, 1500);
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent className="sm:max-w-sm">
                <DialogHeader>
                    <DialogTitle className="text-center text-2xl">Connect a Wallet</DialogTitle>
                    <DialogDescription className="text-center pt-1">
                        Choose your wallet provider to continue.
                    </DialogDescription>
                </DialogHeader>
                <div className="flex flex-col space-y-2 pt-4">
                    {walletProviders.map((provider) => (
                        <Button
                            key={provider.name}
                            variant="outline"
                            className="w-full justify-start h-14 text-base gap-4 px-4"
                            onClick={() => handleWalletConnect(provider.name)}
                        >
                           <provider.icon className="h-8 w-8" />
                           <span>{provider.name}</span>
                        </Button>
                    ))}
                </div>
            </DialogContent>
        </Dialog>
    );
}
