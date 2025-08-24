
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
import { OnboardingChecklist } from "@/components/onboarding/onboarding-checklist";
import { useTransaction, Transaction } from "@/context/transaction-context";
import { DataTable } from "@/components/ui/data-table";
import { type ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "@/components/ui/data-table-column-header";
import { Badge } from "@/components/ui/badge";
import { format } from 'date-fns';
import { DataTableFacetedFilter } from "@/components/ui/data-table-faceted-filter";

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

const transactionTypes = [
    {
        label: "Sent",
        value: "sent",
        icon: ArrowUpRight,
    },
    {
        label: "Received",
        value: "received",
        icon: ArrowDownLeft,
    }
]

const columns: ColumnDef<Transaction>[] = [
  {
    accessorKey: "type",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Type" />,
    cell: ({ row }) => {
      const type = row.getValue("type") as string;
      const isSent = type === 'sent';
      return (
        <div className="flex items-center gap-2">
            <div className={`p-2 rounded-full ${isSent ? 'bg-destructive/10' : 'bg-green-500/10'}`}>
                {isSent ? <ArrowUpRight className="h-4 w-4 text-destructive" /> : <ArrowDownLeft className="h-4 w-4 text-green-600" />}
            </div>
            <span className="capitalize font-medium">{type}</span>
        </div>
      );
    },
    enableSorting: true,
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
  },
  {
    accessorKey: "phone",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Recipient/Sender" />,
    cell: ({ row }) => <div className="font-mono">{row.getValue("phone")}</div>,
  },
  {
    accessorKey: "amount",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Amount (ETH)" />,
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("amount"));
      const isSent = row.getValue("type") === 'sent';
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "ETH",
        minimumFractionDigits: 4,
        maximumFractionDigits: 6,
      }).format(amount);

      return <div className={`text-right font-medium ${isSent ? 'text-destructive' : 'text-green-600'}`}>{isSent ? '-' : '+'}{formatted}</div>;
    },
    sortingFn: 'alphanumeric',
  },
   {
    accessorKey: "date",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Date" />,
    cell: ({ row }) => {
      const date = new Date(row.getValue("date"));
      return <span>{format(date, 'MMM d, yyyy, h:mm a')}</span>;
    },
    enableSorting: true,
  },
];


export default function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const { transactions } = useTransaction();

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
    <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-8">
      <OnboardingChecklist />
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
                    Transaction History
                </CardTitle>
                <CardDescription>
                  Here are the most recent transactions from your account.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <DataTable 
                    columns={columns} 
                    data={transactions} 
                    toolbar={(table) => (
                         <div className="flex items-center gap-2">
                            {table.getColumn("type") && (
                                <DataTableFacetedFilter
                                    column={table.getColumn("type")}
                                    title="Type"
                                    options={transactionTypes}
                                />
                            )}
                        </div>
                    )}
                />
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
