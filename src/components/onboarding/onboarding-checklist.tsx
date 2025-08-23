
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { usePhoneVerification } from "@/context/phone-verification-context";
import { useWallet } from "@/context/wallet-context";
import { CheckCircle2, UserCheck, Wallet, Send } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { useTransaction } from "@/context/transaction-context";
import { useRouter } from "next/navigation";
import { Button } from "../ui/button";

function ChecklistItem({ isCompleted, title, description, icon: Icon, action }: { isCompleted: boolean; title: string; description: string; icon: React.ElementType, action?: () => void }) {
    return (
        <div className="flex items-center gap-4">
            <div className={`flex h-10 w-10 items-center justify-center rounded-full ${isCompleted ? 'bg-green-500/10' : 'bg-muted'}`}>
                {isCompleted ? <CheckCircle2 className="h-6 w-6 text-green-600" /> : <Icon className="h-6 w-6 text-muted-foreground" />}
            </div>
            <div className="flex-grow">
                <p className="font-semibold">{title}</p>
                <p className="text-sm text-muted-foreground">{description}</p>
            </div>
            {!isCompleted && action && (
                <Button size="sm" onClick={action}>Go</Button>
            )}
        </div>
    )
}

export function OnboardingChecklist() {
    const router = useRouter();
    const { isPhoneVerified } = usePhoneVerification();
    const { walletAddress } = useWallet();
    const { hasSentTransaction } = useTransaction();

    const checklistItems = [
        { 
            isCompleted: isPhoneVerified, 
            title: "Verify Your Phone", 
            description: "Link your phone to receive payments.", 
            icon: UserCheck,
            action: () => router.push('/#register')
        },
        { 
            isCompleted: !!walletAddress, 
            title: "Link Your Wallet", 
            description: "Connect your crypto wallet securely.", 
            icon: Wallet,
            action: () => router.push('/#register')
        },
        { 
            isCompleted: hasSentTransaction, 
            title: "Send Your First Payment", 
            description: "Try out the platform by sending crypto.", 
            icon: Send,
            action: () => router.push('/#send')
        },
    ];

    const completedCount = checklistItems.filter(item => item.isCompleted).length;
    const progress = (completedCount / checklistItems.length) * 100;
    
    if (completedCount === checklistItems.length) {
        return null;
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Getting Started</CardTitle>
                <CardDescription>Complete these steps to get the most out of Wallet Resolver.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="space-y-2">
                    <div className="flex justify-between items-center mb-2">
                        <p className="text-sm font-semibold">{completedCount} of {checklistItems.length} completed</p>
                    </div>
                    <Progress value={progress} className="h-2" />
                </div>

                <div className="space-y-4">
                    {checklistItems.map((item, index) => (
                        <ChecklistItem key={index} {...item} />
                    ))}
                </div>
            </CardContent>
        </Card>
    )
}
