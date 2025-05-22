"use client";
import { useState, useMemo } from 'react';
import { PageHeader } from '@/components/shared/PageHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { mockTransactions } from '@/lib/mock-data';
import type { Transaction, TransactionStatus } from '@/lib/types';
import { formatCurrencyDZD, formatDate } from '@/lib/formatters';
import { Badge } from '@/components/ui/badge';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import type { DateRange } from 'react-day-picker';
import { addDays, format, subDays } from 'date-fns';
import { CalendarDays } from 'lucide-react';

type PaymentType = 'Bank API' | 'Cash on Delivery' | 'Manual' | 'All';

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>(mockTransactions);
  const [searchTerm, setSearchTerm] = useState(''); // Search by buyer or store name
  const [storeIdFilter, setStoreIdFilter] = useState(''); // Filter by Store ID
  const [paymentTypeFilter, setPaymentTypeFilter] = useState<PaymentType>('All');
  const [statusFilter, setStatusFilter] = useState<TransactionStatus | 'All'>('All');
   const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: subDays(new Date(), 30),
    to: new Date(),
  });

  const filteredTransactions = useMemo(() => {
    return transactions.filter(txn => {
      const matchesSearch = txn.buyerName.toLowerCase().includes(searchTerm.toLowerCase()) || txn.storeName.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStoreId = !storeIdFilter || txn.storeId.toLowerCase().includes(storeIdFilter.toLowerCase());
      const matchesPaymentType = paymentTypeFilter === 'All' || txn.paymentMethod === paymentTypeFilter;
      const matchesStatus = statusFilter === 'All' || txn.status === statusFilter;
      const transactionDate = new Date(txn.transactionDate);
      const matchesDate = dateRange?.from && dateRange?.to ? transactionDate >= dateRange.from && transactionDate <= dateRange.to : true;
      return matchesSearch && matchesStoreId && matchesPaymentType && matchesStatus && matchesDate;
    });
  }, [transactions, searchTerm, storeIdFilter, paymentTypeFilter, statusFilter, dateRange]);

  const getStatusBadgeVariant = (status: TransactionStatus) => {
    switch (status) {
      case 'Success': return 'default'; // bg-primary
      case 'Failed': return 'destructive';
      case 'Refunded': return 'outline'; // Should be visible
      case 'Pending': return 'secondary'; // Should use accent for pending
      default: return 'outline';
    }
  };

  return (
    <>
      <PageHeader title="Transaction Records" description="View all successful and failed transactions." />
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Filters</CardTitle>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 pt-4">
            <Input
              placeholder="Search Buyer/Store..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Input
              placeholder="Filter by Store ID..."
              value={storeIdFilter}
              onChange={(e) => setStoreIdFilter(e.target.value)}
            />
            <Select value={paymentTypeFilter} onValueChange={(value: PaymentType) => setPaymentTypeFilter(value)}>
              <SelectTrigger><SelectValue placeholder="Payment Type" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Types</SelectItem>
                <SelectItem value="Bank API">Bank API</SelectItem>
                <SelectItem value="Cash on Delivery">Cash on Delivery</SelectItem>
                <SelectItem value="Manual">Manual</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={(value: TransactionStatus | 'All') => setStatusFilter(value)}>
              <SelectTrigger><SelectValue placeholder="Status" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Statuses</SelectItem>
                <SelectItem value="Success">Success</SelectItem>
                <SelectItem value="Failed">Failed</SelectItem>
                <SelectItem value="Refunded">Refunded</SelectItem>
                <SelectItem value="Pending">Pending</SelectItem>
              </SelectContent>
            </Select>
            <Popover>
                <PopoverTrigger asChild>
                    <Button
                    variant={"outline"}
                    className="w-full justify-start text-left font-normal"
                    >
                    <CalendarDays className="mr-2 h-4 w-4" />
                    {dateRange?.from ? (
                        dateRange.to ? (
                        <>
                            {format(dateRange.from, "LLL dd, y")} -{" "}
                            {format(dateRange.to, "LLL dd, y")}
                        </>
                        ) : (
                        format(dateRange.from, "LLL dd, y")
                        )
                    ) : (
                        <span>Pick a date range</span>
                    )}
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                    initialFocus
                    mode="range"
                    defaultMonth={dateRange?.from}
                    selected={dateRange}
                    onSelect={setDateRange}
                    numberOfMonths={2}
                    />
                </PopoverContent>
            </Popover>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Buyer</TableHead>
                <TableHead>Store</TableHead>
                <TableHead>Items/Services</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Method</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTransactions.map((txn) => (
                <TableRow key={txn.id}>
                  <TableCell>{formatDate(txn.transactionDate, 'PP p')}</TableCell>
                  <TableCell className="font-medium">{txn.buyerName}</TableCell>
                  <TableCell>{txn.storeName} ({txn.storeId})</TableCell>
                  <TableCell>{txn.itemsPurchased.join(', ')}</TableCell>
                  <TableCell>{formatCurrencyDZD(txn.amountPaid)}</TableCell>
                  <TableCell>{txn.paymentMethod}</TableCell>
                  <TableCell>
                     <Badge variant={getStatusBadgeVariant(txn.status)} className={txn.status === 'Pending' ? 'bg-accent text-accent-foreground' : ''}>
                        {txn.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
              {filteredTransactions.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="text-center">No transactions found.</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </>
  );
}
