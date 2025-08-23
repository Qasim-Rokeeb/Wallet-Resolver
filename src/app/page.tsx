import { Hero } from "@/components/landing/hero";
import { Footer } from "@/components/layout/footer";
import { WalletResolverCard } from "@/components/wallet-resolver/wallet-resolver-card";

export default function Home() {
  return (
    <div className="flex flex-col flex-1">
      <main className="flex-grow">
        <Hero />
        <div className="w-full flex justify-center py-12 px-4 md:py-24">
          <WalletResolverCard />
        </div>
      </main>
      <Footer />
    </div>
  );
}
