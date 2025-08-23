
'use client';

import { Footer } from "@/components/layout/footer";
import { Sidebar, SidebarProvider, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { LayoutDashboard, Send, UserPlus, Home, Wallet } from "lucide-react";
import Link from "next/link";
import { usePathname } from 'next/navigation';
import { Breadcrumbs } from "@/components/ui/breadcrumb";
import { useBreadcrumbs } from "@/hooks/use-breadcrumb";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
    const pathname = usePathname();
    const isActive = (path: string) => pathname === path;
    const breadcrumbs = useBreadcrumbs();

  return (
    <SidebarProvider>
      <div className="flex flex-col min-h-screen">
          <Sidebar>
            <div className="flex items-center gap-2 p-4 border-b">
                <Wallet className="h-8 w-8 text-primary" />
                <h2 className="text-xl font-bold text-primary">Wallet Resolver</h2>
            </div>
            <SidebarMenu>
                <SidebarMenuItem>
                    <SidebarMenuButton asChild isActive={isActive('/dashboard')}>
                        <Link href="/dashboard">
                            <LayoutDashboard />
                            <span>Dashboard</span>
                        </Link>
                    </SidebarMenuButton>
                </SidebarMenuItem>
                 <SidebarMenuItem>
                    <SidebarMenuButton asChild isActive={isActive('/#send')}>
                        <Link href="/#send">
                            <Send />
                            <span>Send</span>
                        </Link>
                    </SidebarMenuButton>
                </SidebarMenuItem>
                 <SidebarMenuItem>
                    <SidebarMenuButton asChild isActive={isActive('/#register')}>
                        <Link href="/#register">
                            <UserPlus />
                            <span>Register</span>
                        </Link>
                    </SidebarMenuButton>
                </SidebarMenuItem>
                 <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                        <Link href="/">
                            <Home />
                            <span>Back to Home</span>
                        </Link>
                    </SidebarMenuButton>
                </SidebarMenuItem>
            </SidebarMenu>
          </Sidebar>
          <SidebarInset>
            <div className="flex flex-col flex-1">
                <header className="flex items-center justify-between p-4 border-b">
                    <div className="flex items-center gap-4">
                        <div className="md:hidden">
                            <SidebarTrigger />
                        </div>
                        <Breadcrumbs segments={breadcrumbs} />
                    </div>
                    <div className="hidden md:block">
                        <SidebarTrigger />
                    </div>
                </header>
                <main className="flex-grow p-4 md:p-6 lg:p-8">
                    {children}
                </main>
                <Footer />
            </div>
          </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
