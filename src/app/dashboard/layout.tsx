
'use client';

import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Sidebar, SidebarProvider, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { LayoutDashboard, Send, UserPlus, Home } from "lucide-react";
import Link from "next/link";
import { usePathname } from 'next/navigation';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
    const pathname = usePathname();
    const isActive = (path: string) => pathname === path;

  return (
    <SidebarProvider>
      <div className="flex flex-col min-h-screen">
          <Sidebar>
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
                    <h1 className="text-2xl font-bold text-primary">Dashboard</h1>
                    <SidebarTrigger />
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
