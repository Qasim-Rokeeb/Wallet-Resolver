
"use client";

import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { DollarSign, List, CreditCard, Activity, ArrowUpRight, ArrowDownLeft, Send, ListX, Clock, MoreHorizontal, Printer, Copy } from "lucide-react";
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from "@/components/ui/chart"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Area, AreaChart } from "recharts"
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { SendForm } from "@/components/wallet-resolver/send-form";
import { OnboardingChecklist } from "@/components/onboarding/onboarding-checklist";
import { useTransaction, Transaction } from "@/context/transaction-context";
import { DataTable } from "@/components/ui/data-table";
import { type ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "@/components/ui/data-table-column-header";
import { Badge } from "@/components/ui/badge";
import { format, isToday } from 'date-fns';
import { DataTableFacetedFilter } from "@/components/ui/data-table-faceted-filter";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { useToast } from "@/hooks/use-toast";

const balanceData = [
  { day: "Mon", balance: 4450 },
  { day: "Tue", balance: 4480 },
  { day: "Wed", balance: 4500 },
  { day: "Thu", balance: 4510 },
  { day: "Fri", balance: 4550 },
  { day: "Sat", balance: 4540 },
  { day: "Sun", balance: 4523.89 },
]

const chartData = [
  { month: "January", sent: 186, received: 80 },
  { month: "February", sent: 305, received: 200 },
  { month: "March", sent: 237, received: 120 },
  { month: "April", sent: 73, received: 190 },
  { month: "May", sent: 209, received: 130 },
  { month: "June", sent: 214, received: 140 },
];

const chartConfig = {
  balance: {
    label: "Balance",
    color: "hsl(var(--primary))",
  },
  sent: {
    label: "Sent",
    color: "hsl(var(--destructive))",
  },
  received: {
    label: "Received",
    color: "hsl(var(--primary))",
  },
};

function DashboardSkeleton() {
    return (
        <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <Skeleton className="h-5 w-2/3" />
                        <Skeleton className="h-4 w-4" />
                    </CardHeader>
                    <CardContent>
                        <Skeleton className="h-8 w-1/2 mb-2" />
                        <Skeleton className="h-4 w-1/3" />
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <Skeleton className="h-5 w-2/3" />
                        <Skeleton className="h-4 w-4" />
                    </CardHeader>
                    <CardContent>
                        <Skeleton className="h-8 w-1/2 mb-2" />
                        <Skeleton className="h-4 w-1/3" />
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <Skeleton className="h-5 w-2/3" />
                        <Skeleton className="h-4 w-4" />
                    </CardHeader>
                    <CardContent>
                        <Skeleton className="h-8 w-1/2 mb-2" />
                        <Skeleton className="h-4 w-1/3" />
                    </CardContent>
                </Card>
            </div>
            <div className="md:col-span-2 lg:col-span-3">
                <Card>
                    <CardHeader>
                        <Skeleton className="h-6 w-1/4 mb-2" />
                        <Skeleton className="h-4 w-1/2" />
                    </CardHeader>
                    <CardContent className="grid gap-4">
                        <div className="flex items-center space-x-4 p-2">
                            <Skeleton className="h-12 w-12 rounded-full" />
                            <div className="flex-1 space-y-2">
                                <Skeleton className="h-4 w-3/4" />
                                <Skeleton className="h-4 w-1/2" />
                            </div>
                            <Skeleton className="h-4 w-1/4" />
                        </div>
                        <div className="flex items-center space-x-4 p-2">
                            <Skeleton className="h-12 w-12 rounded-full" />
                            <div className="flex-1 space-y-2">
                                <Skeleton className="h-4 w-3/4" />
                                <Skeleton className="h-4 w-1/2" />
                            </div>
                            <Skeleton className="h-4 w-1/4" />
                        </div>
                        <div className="flex items-center space-x-4 p-2">
                            <Skeleton className="h-12 w-12 rounded-full" />
                            <div className="flex-1 space-y-2">
                                <Skeleton className="h-4 w-3/4" />
                                <Skeleton className="h-4 w-1/2" />
                            </div>
                            <Skeleton className="h-4 w-1/4" />
                        </div>
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

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center space-y-4 py-8">
      <div className="p-4 bg-muted rounded-full">
        <ListX className="h-12 w-12 text-muted-foreground" />
      </div>
      <h3 className="text-xl font-semibold">No transactions yet</h3>
      <p className="text-muted-foreground">Send your first payment to see it here.</p>
      <Sheet>
        <SheetTrigger asChild>
            <Button>
                <Send className="mr-2 h-4 w-4" /> Send Payment
            </Button>
        </SheetTrigger>
        <SheetContent side="bottom" className="rounded-t-2xl">
            <SheetHeader className="text-left px-4 pt-4">
                <SheetTitle className="text-2xl">Send a Quick Payment</SheetTitle>
                <SheetDescription>Enter the recipient's details to send a payment instantly.</SheetDescription>
            </SheetHeader>
            <div className="p-4">
                <SendForm />
            </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}

function PendingTransactions({ transactions }: { transactions: Transaction[] }) {
    if (transactions.length === 0) {
        return null;
    }
    return (
        <Card className="no-print">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5" />
                    Pending Transactions
                </CardTitle>
                <CardDescription>
                    These transactions are currently being processed.
                </CardDescription>
            </CardHeader>
            <CardContent className="divide-y">
                {transactions.map(tx => (
                    <div key={tx.id} className="flex items-center justify-between py-3">
                        <div className="flex items-center gap-4">
                            <LoadingSpinner className="h-6 w-6" />
                            <div>
                                <p className="font-semibold">Sending to {tx.phone}</p>
                                <p className="text-sm text-muted-foreground">Amount: {tx.amount.toFixed(4)} ETH</p>
                            </div>
                        </div>
                        <MoreHorizontal className="h-5 w-5 text-muted-foreground" />
                    </div>
                ))}
            </CardContent>
        </Card>
    );
}

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const { transactions } = useTransaction();
  const { toast } = useToast();

  const columns: ColumnDef<Transaction>[] = [
    {
      accessorKey: "type",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Type" />,
      cell: ({ row }) => {
        const type = row.getValue("type") as string;
        const isSent = type === 'sent';
        return (
          <div className="flex items-center gap-2">
              <div className={`p-2 rounded-full no-print ${isSent ? 'bg-destructive/10' : 'bg-green-500/10'}`}>
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
      cell: ({ row }) => {
        const phone = row.getValue("phone") as string;
        const handleCopy = () => {
          navigator.clipboard.writeText(phone);
          toast({
            title: "Copied!",
            description: "Phone number copied to clipboard.",
          });
        };
        return (
          <div className="flex items-center gap-2">
            <span className="font-mono">{phone}</span>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 opacity-50 hover:opacity-100"
              onClick={handleCopy}
            >
              <Copy className="h-3 w-3" />
            </Button>
          </div>
        )
      },
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
      enableSorting: true,
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

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000); 

    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return <DashboardSkeleton />;
  }
  
  const completedTransactions = transactions.filter(t => t.status === 'completed');
  const pendingTransactions = transactions.filter(t => t.status === 'pending');

  const todayTransactions = completedTransactions.filter(t => isToday(new Date(t.date)));
  const todaySent = todayTransactions.filter(t => t.type === 'sent').reduce((acc, t) => acc + t.amount, 0);
  const todayReceived = todayTransactions.filter(t => t.type === 'received').reduce((acc, t) => acc + t.amount, 0);

  const handlePrint = () => {
    window.print();
  }

  return (
    <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-8">
      <div className="no-print">
        <OnboardingChecklist />
      </div>
      <PendingTransactions transactions={pendingTransactions} />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 no-print">
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
             <div className="h-8">
                <ChartContainer config={chartConfig} className="w-full h-full -ml-4">
                    <AreaChart
                        accessibilityLayer
                        data={balanceData}
                        margin={{
                            left: 12,
                            right: 12,
                        }}
                    >
                        <defs>
                            <linearGradient id="fillBalance" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="var(--color-balance)" stopOpacity={0.8} />
                                <stop offset="95%" stopColor="var(--color-balance)" stopOpacity={0.1} />
                            </linearGradient>
                        </defs>
                        <ChartTooltip 
                            cursor={false} 
                            content={({ active, payload }) => {
                                if (active && payload && payload.length) {
                                return (
                                    <div className="rounded-lg border bg-background p-2 shadow-sm">
                                        <div className="grid grid-cols-2 gap-2">
                                            <div className="flex flex-col">
                                            <span className="text-[0.70rem] uppercase text-muted-foreground">
                                                Balance
                                            </span>
                                            <span className="font-bold text-muted-foreground">
                                                ${payload[0].value}
                                            </span>
                                            </div>
                                        </div>
                                    </div>
                                )
                                }
                                return null
                            }} 
                        />
                        <Area
                            dataKey="balance"
                            type="natural"
                            fill="url(#fillBalance)"
                            fillOpacity={0.4}
                            stroke="var(--color-balance)"
                            stackId="a"
                        />
                    </AreaChart>
                </ChartContainer>
            </div>
          </CardContent>
        </Card>

        {/* Daily Summary Card */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Daily Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-destructive">
                      <ArrowUpRight className="h-4 w-4" />
                      <span>Sent</span>
                  </div>
                  <span className="font-semibold">{todaySent.toFixed(4)} ETH</span>
              </div>
              <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-green-600">
                      <ArrowDownLeft className="h-4 w-4" />
                      <span>Received</span>
                  </div>
                  <span className="font-semibold">{todayReceived.toFixed(4)} ETH</span>
              </div>
            </div>
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
      </div>

      {/* Recent Transactions Container */}
      <div className="md:col-span-2 lg:col-span-3 printable-area">
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
                  data={completedTransactions} 
                  toolbar={(table) => (
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                {table.getColumn("type") && (
                                    <DataTableFacetedFilter
                                        column={table.getColumn("type")}
                                        title="Type"
                                        options={transactionTypes}
                                    />
                                )}
                            </div>
                            <Button variant="outline" size="sm" onClick={handlePrint} className="ml-auto">
                                <Printer className="mr-2 h-4 w-4" />
                                Print
                            </Button>
                        </div>
                  )}
                  emptyState={<EmptyState />}
              />
          </CardContent>
        </Card>
      </div>
      
      {/* Chart Card */}
      <Card className="md:col-span-2 lg:col-span-3 no-print">
          <CardHeader>
              <CardTitle>Activity Overview</CardTitle>
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
                      <YAxis tickLine={false} axisLine={false} />
                      <ChartTooltip
                        cursor={false}
                        content={<ChartTooltipContent indicator="dot" />}
                      />
                      <ChartLegend content={<ChartLegendContent />} />
                      <Bar dataKey="sent" fill="var(--color-sent)" radius={4} />
                      <Bar dataKey="received" fill="var(--color-received)" radius={4} />
                  </BarChart>
              </ChartContainer>
          </CardContent>
      </Card>
      
      <div className="no-print">
        <Sheet>
            <SheetTrigger asChild>
                <Button
                    size="lg"
                    className="fixed bottom-6 right-6 h-16 w-16 rounded-full shadow-2xl"
                    aria-label="Send Payment"
                >
                    <Send className="h-6 w-6" />
                </Button>
            </SheetTrigger>
            <SheetContent side="bottom" className="rounded-t-2xl">
                <SheetHeader className="text-left px-4 pt-4">
                    <SheetTitle className="text-2xl">Send a Quick Payment</SheetTitle>
                    <SheetDescription>Enter the recipient's details to send a payment instantly.</SheetDescription>
                </SheetHeader>
                <div className="p-4">
                    <SendForm />
                </div>
            </SheetContent>
        </Sheet>
      </div>
    </div>
  );
}
