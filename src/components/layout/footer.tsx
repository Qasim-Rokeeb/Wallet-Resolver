
import { Book, Github, LifeBuoy } from 'lucide-react';
import Link from 'next/link';
import { Separator } from '../ui/separator';

export function Footer() {
  return (
    <footer className="bg-background/50 border-t mt-auto">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-center md:text-left">
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} Wallet Resolver. All Rights Reserved.
            </p>
          </div>
          <div className="flex items-center gap-6">
            <Link
              href="#"
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              <Book className="h-4 w-4" />
              <span>Docs</span>
            </Link>
            <Link
              href="#"
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              <Github className="h-4 w-4" />
              <span>GitHub</span>
            </Link>
            <Link
              href="#"
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              <LifeBuoy className="h-4 w-4" />
              <span>Support</span>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
