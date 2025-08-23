import { Hero } from "@/components/landing/hero";
import { WalletResolverCard } from "@/components/wallet-resolver/wallet-resolver-card";

export default function Home() {
  return (
    <main className="flex flex-col items-center">
      <Hero />
      <div className="w-full flex justify-center py-12 md:py-24 px-4">
        <WalletResolverCard />
      </div>
    </main>
  );
}
