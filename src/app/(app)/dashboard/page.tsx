"use client";
import type { ReactNode } from 'react';
import { DollarSign, TrendingUp, Users, Clock, ArrowUpRight, ArrowDownRight, Landmark, AlertTriangle, ShoppingCart } from 'lucide-react';
import { PageHeader } from '@/components/shared/PageHeader';
import { StatCard } from '@/components/shared/StatCard';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from '@/components/ui/chart';
import type { ChartConfig } from '@/components/ui/chart';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Line, LineChart, ResponsiveContainer } from 'recharts';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { mockPlatformMetrics, mockWeeklyRevenue, mockMonthlyRevenue, mockTopEarningStores, mockStoreRevenueBreakdown } from '@/lib/mock-data';
import { formatCurrencyDZD, formatDate } from '@/lib/formatters';
import { Badge } from '@/components/ui/badge';

const revenueChartConfig = {
  revenue: { label: "Revenue (DZD)", color: "hsl(var(--primary))" },
} satisfies ChartConfig;

const storeRevenueChartConfig = {
  revenue: { label: "Revenue (DZD)", color: "hsl(var(--accent))" },
} satisfies ChartConfig;


export default function DashboardPage() {

  const weeklyRevenueData = mockWeeklyRevenue.map(item => ({ ...item, date: formatDate(item.date, 'MMM d')}));
  const monthlyRevenueData = mockMonthlyRevenue.map(item => ({ ...item, date: formatDate(item.date, 'MMM yy')}));


  return (
    <>
      <PageHeader title="Platform Revenue Dashboard" description="Overview of financial performance." />

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-6">
        <StatCard
          title="Total Gross Revenue"
          value={formatCurrencyDZD(mockPlatformMetrics.totalGrossRevenue)}
          icon={DollarSign}
          description="All sales processed"
        />
        <StatCard
          title="Platform Earnings"
          value={formatCurrencyDZD(mockPlatformMetrics.platformEarnings)}
          icon={TrendingUp}
          description="7% commission on gross"
        />
        <StatCard
          title="Payouts Processed"
          value={formatCurrencyDZD(mockPlatformMetrics.payoutsProcessed)}
          icon={Landmark}
          description="Successfully paid to stores"
        />
        <StatCard
          title="Pending Payouts"
          value={formatCurrencyDZD(mockPlatformMetrics.pendingPayoutAmount)}
          icon={Clock}
          description="Awaiting approval/processing"
        />
      </div>

      <Tabs defaultValue="weekly" className="mb-6">
        <TabsList className="grid w-full grid-cols-2 md:w-1/3">
            <TabsTrigger value="weekly">Weekly Revenue</TabsTrigger>
            <TabsTrigger value="monthly">Monthly Revenue</TabsTrigger>
        </TabsList>
        <TabsContent value="weekly">
            <Card className="shadow-lg">
                <CardHeader>
                <CardTitle>Weekly Revenue Growth</CardTitle>
                <CardDescription>Revenue generated per week.</CardDescription>
                </CardHeader>
                <CardContent className="h-[350px] w-full">
                <ChartContainer config={revenueChartConfig} className="h-full w-full">
                    <LineChart data={weeklyRevenueData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false}/>
                    <XAxis dataKey="date" tickLine={false} axisLine={false} tickMargin={8} />
                    <YAxis tickFormatter={(value) => `${value/1000}k`} tickLine={false} axisLine={false} tickMargin={8}/>
                    <ChartTooltip content={<ChartTooltipContent indicator="line" />} />
                    <Line type="monotone" dataKey="revenue" stroke="var(--color-revenue)" strokeWidth={2} dot={true} />
                    </LineChart>
                </ChartContainer>
                </CardContent>
            </Card>
        </TabsContent>
        <TabsContent value="monthly">
            <Card className="shadow-lg">
                <CardHeader>
                <CardTitle>Monthly Revenue Growth</CardTitle>
                <CardDescription>Revenue generated per month.</CardDescription>
                </CardHeader>
                <CardContent className="h-[350px] w-full">
                <ChartContainer config={revenueChartConfig} className="h-full w-full">
                    <BarChart data={monthlyRevenueData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="date" tickLine={false} axisLine={false} tickMargin={8} />
                    <YAxis tickFormatter={(value) => `${value/1000000}M`} tickLine={false} axisLine={false} tickMargin={8}/>
                    <ChartTooltip content={<ChartTooltipContent indicator="dot" />} />
                    <Bar dataKey="revenue" fill="var(--color-revenue)" radius={4} />
                    </BarChart>
                </ChartContainer>
                </CardContent>
            </Card>
        </TabsContent>
       </Tabs>


      <div className="grid gap-6 md:grid-cols-2">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Top 5 Earning Stores</CardTitle>
            <CardDescription>Stores with the highest total earnings.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Store Name</TableHead>
                  <TableHead className="text-right">Total Earnings</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockTopEarningStores.map((store) => (
                  <TableRow key={store.storeName}>
                    <TableCell className="font-medium">{store.storeName}</TableCell>
                    <TableCell className="text-right">{formatCurrencyDZD(store.revenue)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Store Revenue Breakdown (Sample)</CardTitle>
             <CardDescription>Current period revenue by store.</CardDescription>
          </CardHeader>
          <CardContent className="h-[350px] w-full">
            <ChartContainer config={storeRevenueChartConfig} className="h-full w-full">
                <BarChart data={mockStoreRevenueBreakdown} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" horizontal={false}/>
                    <XAxis type="number" tickFormatter={(value) => `${value/1000}k`} tickLine={false} axisLine={false} tickMargin={8}/>
                    <YAxis dataKey="storeName" type="category" tickLine={false} axisLine={false} tickMargin={8} width={120} />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="revenue" fill="var(--color-revenue)" radius={4} />
                </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
