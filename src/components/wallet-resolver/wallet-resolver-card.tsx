
"use client";

import { useIsMobile } from "@/hooks/use-mobile";
import { WalletResolverDesktop } from "./wallet-resolver-desktop";
import { WalletResolverMobile } from "./wallet-resolver-mobile";

export function WalletResolverCard() {
    const isMobile = useIsMobile();

    if (isMobile === undefined) {
        return null;
    }

    return isMobile ? <WalletResolverMobile /> : <WalletResolverDesktop />;
}
