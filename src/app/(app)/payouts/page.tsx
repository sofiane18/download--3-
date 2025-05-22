"use client";
import { useState, useMemo } from 'react';
import { PageHeader } from '@/components/shared/PageHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { CheckCircle2, XCircle, Eye, MoreVertical, Filter, CalendarDays } from 'lucide-react';
import { mockPayoutRequests, regions } from '@/lib/mock-data';
import type { PayoutRequest, PayoutRequestStatus } from '@/lib/types';
import { formatCurrencyDZD, formatDate } from '@/lib/formatters';
import { Badge } from '@/components/ui/badge';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import type { DateRange } from 'react-day-picker';
import { addDays, format, subDays } from 'date-fns';

const statusColors: Record<PayoutRequestStatus, string> = {
  Pending: 'bg-yellow-500',
  Approved: 'bg-green-500',
  Rejected: 'bg-red-500',
};

export default function PayoutsPage() {
  const [requests, setRequests] = useState<PayoutRequest[]>(mockPayoutRequests);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<PayoutRequestStatus | 'All'>('All');
  const [regionFilter, setRegionFilter] = useState<string | 'All'>('All');
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: subDays(new Date(), 30),
    to: new Date(),
  });


  const handleApprove = (id: string) => {
    setRequests(prev => prev.map(req => req.id === id ? { ...req, status: 'Approved' } : req));
    // Add toast notification
  };

  const handleReject = (id: string) => {
    setRequests(prev => prev.map(req => req.id === id ? { ...req, status: 'Rejected' } : req));
    // Add toast notification
  };

  const filteredRequests = useMemo(() => {
    return requests.filter(req => {
      const matchesSearch = req.storeName.toLowerCase().includes(searchTerm.toLowerCase()) || req.transactionId.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'All' || req.status === statusFilter;
      const matchesRegion = regionFilter === 'All' || req.region === regionFilter;
      const requestDate = new Date(req.requestTime);
      const matchesDate = dateRange?.from && dateRange?.to ? requestDate >= dateRange.from && requestDate <= dateRange.to : true;
      return matchesSearch && matchesStatus && matchesRegion && matchesDate;
    });
  }, [requests, searchTerm, statusFilter, regionFilter, dateRange]);
  
  const getStatusBadgeVariant = (status: PayoutRequestStatus) => {
    switch (status) {
      case 'Approved': return 'default'; // bg-primary which is teal
      case 'Pending': return 'secondary'; // Should be visible, maybe needs custom yellow variant in badge
      case 'Rejected': return 'destructive';
      default: return 'outline';
    }
  };


  return (
    <>
      <PageHeader title="Payout Requests" description="Manage and process store payout requests." />
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Filters &amp; Search</CardTitle>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-4">
            <Input
              placeholder="Search by Store or Txn ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="lg:col-span-1"
            />
            <Select value={statusFilter} onValueChange={(value: PayoutRequestStatus | 'All') => setStatusFilter(value)}>
              <SelectTrigger><SelectValue placeholder="Filter by Status" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Statuses</SelectItem>
                <SelectItem value="Pending">Pending</SelectItem>
                <SelectItem value="Approved">Approved</SelectItem>
                <SelectItem value="Rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
            <Select value={regionFilter} onValueChange={(value: string | 'All') => setRegionFilter(value)}>
              <SelectTrigger><SelectValue placeholder="Filter by Region" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Regions</SelectItem>
                {regions.map(region => <SelectItem key={region} value={region}>{region}</SelectItem>)}
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
                <TableHead>Store Name</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Balance</TableHead>
                <TableHead>Txn ID</TableHead>
                <TableHead>Requested</TableHead>
                <TableHead>Method</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Region</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRequests.map((req) => (
                <TableRow key={req.id}>
                  <TableCell className="font-medium">{req.storeName}</TableCell>
                  <TableCell>{formatCurrencyDZD(req.amountRequested)}</TableCell>
                  <TableCell>{formatCurrencyDZD(req.totalStoreBalance)}</TableCell>
                  <TableCell>{req.transactionId}</TableCell>
                  <TableCell>{formatDate(req.requestTime, 'PP p')}</TableCell>
                  <TableCell>{req.payoutMethod}</TableCell>
                  <TableCell>
                    <Badge variant={getStatusBadgeVariant(req.status)} className={req.status === 'Pending' ? 'bg-accent text-accent-foreground' : ''}>
                        {req.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{req.region}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        {req.status === 'Pending' && (
                          <>
                            <DropdownMenuItem onClick={() => handleApprove(req.id)}>
                              <CheckCircle2 className="mr-2 h-4 w-4 text-green-500" /> Approve
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleReject(req.id)}>
                              <XCircle className="mr-2 h-4 w-4 text-red-500" /> Reject
                            </DropdownMenuItem>
                          </>
                        )}
                        <DropdownMenuItem>
                          <Eye className="mr-2 h-4 w-4" /> View Store Profile
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
              {filteredRequests.length === 0 && (
                <TableRow>
                  <TableCell colSpan={9} className="text-center">No payout requests found.</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </>
  );
}
