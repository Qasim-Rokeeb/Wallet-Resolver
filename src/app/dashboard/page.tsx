
"use client";

import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { DollarSign, List, CreditCard, Activity, ArrowUpRight, ArrowDownLeft, Send } from "lucide-react";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { SheetFormWrapper } from "@/components/wallet-resolver/sheet-form-wrapper";
import { SendForm } from "@/components/wallet-resolver/send-form";

const chartData = [
  { month: "January", desktop: 186 },
  { month: "February", desktop: 305 },
  { month: "March", desktop: 237 },
  { month: "April", desktop: 73 },
  { month: "May", desktop: 209 },
  { month: "June", desktop: 214 },
];

const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "hsl(var(--primary))",
  },
};

function DashboardSkeleton() {
    return (
        <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
            <Skeleton className="h-10 w-1/3 mb-8" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Card>
                    <CardHeader>
                        <Skeleton className="h-5 w-2/3" />
                    </CardHeader>
                    <CardContent>
                        <Skeleton className="h-8 w-1/2 mb-2" />
                        <Skeleton className="h-4 w-1/3" />
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <Skeleton className="h-5 w-2/3" />
                    </CardHeader>
                    <CardContent>
                        <Skeleton className="h-8 w-1/2 mb-2" />
                        <Skeleton className="h-4 w-1/3" />
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <Skeleton className="h-5 w-2/3" />
                    </CardHeader>
                    <CardContent>
                        <Skeleton className="h-8 w-1/2 mb-2" />
                        <Skeleton className="h-4 w-1/3" />
                    </CardContent>
                </Card>
                <div className="md:col-span-2 lg:col-span-3">
                    <Card>
                        <CardHeader>
                            <Skeleton className="h-6 w-1/4 mb-2" />
                            <Skeleton className="h-4 w-1/2" />
                        </CardHeader>
                        <CardContent className="grid gap-4">
                            <Skeleton className="h-16 w-full" />
                            <Skeleton className="h-16 w-full" />
                            <Skeleton className="h-16 w-full" />
                        </CardContent>
                    </Card>
                </div>
                <div className="md:col-span-2 lg:col-span-3">
                    <Card>
                        <CardHeader>
                            <Skeleton className="h-6 w-1/4 mb-2" />
                            <Skeleton className="h-4 w-1/3" />
                        </CardHeader>
                        <CardContent>
                           <Skeleton className="w-full h-[250px] sm:h-[350px]" />
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000); 

    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return <DashboardSkeleton />;
  }

  return (
    <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-primary mb-8">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Balance Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Account Balance
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$4,523.89</div>
            <p className="text-xs text-muted-foreground">
              +20.1% from last month
            </p>
          </CardContent>
        </Card>

        {/* Subscriptions Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Subscriptions</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+2350</div>
            <p className="text-xs text-muted-foreground">
              +180.1% from last month
            </p>
          </CardContent>
        </Card>

        {/* Active Now Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Now</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+573</div>
            <p className="text-xs text-muted-foreground">
              +201 since last hour
            </p>
          </CardContent>
        </Card>

        {/* Recent Transactions Container */}
        <div className="md:col-span-2 lg:col-span-3">
          <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <List className="h-5 w-5" />
                    Recent Transactions
                </CardTitle>
                <CardDescription>
                  Here are the most recent transactions from your account.
                </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">
                <Card className="p-4 hover:bg-muted/50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-destructive/10 rounded-full">
                        <ArrowUpRight className="h-5 w-5 text-destructive" />
                      </div>
                      <div>
                        <p className="font-medium">Sent to +1 (555) 123-4567</p>
                        <p className="text-sm text-muted-foreground">2 hours ago</p>
                      </div>
                    </div>
                    <p className="text-destructive font-semibold text-lg">- $50.00</p>
                  </div>
                </Card>
                <Card className="p-4 hover:bg-muted/50 transition-colors">
                   <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-green-500/10 rounded-full">
                          <ArrowDownLeft className="h-5 w-5 text-green-600" />
                        </div>
                        <div>
                          <p className="font-medium">Received from +1 (555) 987-6543</p>
                          <p className="text-sm text-muted-foreground">1 day ago</p>
                        </div>
                      </div>
                      <p className="text-green-600 font-semibold text-lg">+ $120.50</p>
                  </div>
                </Card>
                <Card className="p-4 hover:bg-muted/50 transition-colors">
                   <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-destructive/10 rounded-full">
                          <ArrowUpRight className="h-5 w-5 text-destructive" />
                        </div>
                        <div>
                          <p className="font-medium">Sent to +1 (555) 555-5555</p>
                          <p className="text-sm text-muted-foreground">3 days ago</p>
                        </div>
                      </div>
                      <p className="text-destructive font-semibold text-lg">- $25.00</p>
                  </div>
                </Card>
            </CardContent>
          </Card>
        </div>
        
        {/* Chart Card */}
        <Card className="md:col-span-2 lg:col-span-3">
            <CardHeader>
                <CardTitle>Spending Overview</CardTitle>
                <CardDescription>January - June 2024</CardDescription>
            </CardHeader>
            <CardContent>
                <ChartContainer config={chartConfig} className="w-full h-[250px] sm:h-[350px]">
                    <BarChart accessibilityLayer data={chartData}>
                        <CartesianGrid vertical={false} />
                        <XAxis
                        dataKey="month"
                        tickLine={false}
                        tickMargin={10}
                        axisLine={false}
                        tickFormatter={(value) => value.slice(0, 3)}
                        />
                        <ChartTooltip
                        cursor={false}
                        content={<ChartTooltipContent indicator="dot" />}
                        />
                        <Bar dataKey="desktop" fill="var(--color-desktop)" radius={4} />
                    </BarChart>
                </ChartContainer>
            </CardContent>
        </Card>
      </div>
      <SheetFormWrapper
        title="Send a Quick Payment"
        description="Enter the recipient's details to send a payment instantly."
        trigger={
            <Button
                size="lg"
                className="fixed bottom-6 right-6 h-16 w-16 rounded-full shadow-2xl"
                aria-label="Send Payment"
            >
                <Send className="h-6 w-6" />
            </Button>
        }
    >
        <SendForm />
    </SheetFormWrapper>
    </div>
  );
}
