
import { Twitter, Github, Linkedin, Wallet } from 'lucide-react';
import Link from 'next/link';

export function Footer() {
  return (
    <footer className="bg-background/50 border-t mt-auto no-print">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2 text-primary">
              <Wallet className="h-8 w-8" />
              <span className="text-xl font-bold">Wallet Resolver</span>
            </Link>
            <p className="text-sm text-muted-foreground">
              Simplifying crypto payments, one phone number at a time.
            </p>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider">Quick Links</h3>
            <ul className="mt-4 space-y-2">
              <li><Link href="/dashboard" className="text-sm text-muted-foreground hover:text-primary transition-colors">Dashboard</Link></li>
              <li><Link href="/#send" className="text-sm text-muted-foreground hover:text-primary transition-colors">Send</Link></li>
              <li><Link href="/#register" className="text-sm text-muted-foreground hover:text-primary transition-colors">Register</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider">Legal</h3>
            <ul className="mt-4 space-y-2">
              <li><Link href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">Privacy Policy</Link></li>
              <li><Link href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">Terms of Service</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider">Follow Us</h3>
             <div className="flex mt-4 space-x-4">
              <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Twitter className="h-6 w-6" />
                <span className="sr-only">Twitter</span>
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Github className="h-6 w-6" />
                <span className="sr-only">GitHub</span>
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Linkedin className="h-6 w-6" />
                <span className="sr-only">LinkedIn</span>
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-8 border-t pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Wallet Resolver. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
}
