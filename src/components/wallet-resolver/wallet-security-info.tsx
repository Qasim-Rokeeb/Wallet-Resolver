
"use client";

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { ShieldCheck, KeyRound, Signature } from "lucide-react";

const securityPoints = [
    {
        title: "Non-Custodial Connection",
        icon: ShieldCheck,
        content: "We never have access to your funds or private keys. This is a non-custodial service, meaning you are always in full control of your assets. We only request permission to view your wallet address."
    },
    {
        title: "Transaction Signing",
        icon: Signature,
        content: "Every transaction must be explicitly approved and signed by you within your wallet application. We cannot initiate any transactions on your behalf without your direct confirmation."
    },
    {
        title: "Private Key Safety",
        icon: KeyRound,
        content: "This application will never ask for your private keys or seed phrase. Keep them secret and safe. If anyone asks for them, they are trying to scam you."
    }
]

export function WalletSecurityInfo() {
    return (
        <Accordion type="single" collapsible className="w-full" defaultValue="item-0">
            {securityPoints.map((point, index) => (
                <AccordionItem value={`item-${index}`} key={index}>
                    <AccordionTrigger>
                        <div className="flex items-center gap-3">
                           <point.icon className="h-5 w-5 text-primary" />
                           <span className="font-semibold">{point.title}</span>
                        </div>
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground pl-10">
                        {point.content}
                    </AccordionContent>
                </AccordionItem>
            ))}
        </Accordion>
    )
}
