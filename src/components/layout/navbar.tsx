import { Wallet } from 'lucide-react';
import Link from 'next/link';

export function Navbar() {
  return (
    <header className="bg-white shadow-md">
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center gap-2 text-primary">
              <Wallet className="h-8 w-8" />
              <span className="text-2xl font-bold">Wallet Resolver</span>
            </Link>
          </div>
        </div>
      </nav>
    </header>
  );
}
