
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Footer } from "@/components/layout/footer";
import { Sidebar, SidebarProvider, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { LayoutDashboard, Send, UserPlus, Home, Wallet, User, Settings, LogOut, CheckCircle, AlertTriangle } from "lucide-react";
import Link from "next/link";
import { usePathname } from 'next/navigation';
import { Breadcrumbs } from "@/components/ui/breadcrumb";
import { useBreadcrumbs } from "@/hooks/use-breadcrumb";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { usePhoneVerification } from "@/context/phone-verification-context";
import { useAuth } from '@/context/auth-context';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { Badge } from '@/components/ui/badge';
import { LogoutConfirmationModal } from '@/components/auth/logout-confirmation-modal';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
    const pathname = usePathname();
    const router = useRouter();
    const { isAuthenticated, isLoading, logout } = useAuth();
    const isActive = (path: string) => pathname === path;
    const breadcrumbs = useBreadcrumbs();
    const { isPhoneVerified } = usePhoneVerification();

    useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            router.push('/login');
        }
    }, [isLoading, isAuthenticated, router]);

    if (isLoading || !isAuthenticated) {
        return (
            <div className="flex h-screen items-center justify-center">
                <LoadingSpinner className="h-12 w-12" />
            </div>
        );
    }

  return (
    <SidebarProvider>
      <div className="flex flex-col min-h-screen">
          <div className="no-print">
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
          </div>
          <SidebarInset>
            <div className="flex flex-col flex-1">
                <header className="flex items-center justify-between p-4 border-b no-print">
                    <div className="flex items-center gap-4">
                        <div className="md:hidden">
                            <SidebarTrigger />
                        </div>
                        <Breadcrumbs segments={breadcrumbs} />
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="hidden md:block">
                            <SidebarTrigger />
                        </div>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                                    <Avatar className="h-10 w-10">
                                        <AvatarImage src="https://placehold.co/100x100.png" alt="User Avatar" />
                                        <AvatarFallback>U</AvatarFallback>
                                    </Avatar>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-56" align="end" forceMount>
                                <DropdownMenuLabel className="font-normal">
                                    <div className="flex flex-col space-y-2">
                                        <p className="text-sm font-medium leading-none">User</p>
                                        <div className='flex items-center justify-between'>
                                          <p className="text-xs leading-none text-muted-foreground">
                                              user@example.com
                                          </p>
                                          {isPhoneVerified ? (
                                              <Badge variant="secondary" className="border-green-500 text-green-700">
                                                  <CheckCircle className="mr-1 h-3 w-3" />
                                                  Verified
                                              </Badge>
                                          ) : (
                                              <Badge variant="secondary" className="border-amber-500 text-amber-700">
                                                  <AlertTriangle className="mr-1 h-3 w-3" />
                                                  Not Verified
                                              </Badge>
                                          )}
                                        </div>
                                    </div>
                                </DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem>
                                    <User className="mr-2 h-4 w-4" />
                                    <span>Profile</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                    <Settings className="mr-2 h-4 w-4" />
                                    <span>Settings</span>
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <LogoutConfirmationModal onConfirm={logout}>
                                    <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                                        <LogOut className="mr-2 h-4 w-4" />
                                        <span>Log out</span>
                                    </DropdownMenuItem>
                                </LogoutConfirmationModal>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </header>
                <main className="flex-grow p-4 md:p-6 lg:p-8">
                    {children}
                </main>
                <div className="no-print">
                    <Footer />
                </div>
            </div>
          </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
