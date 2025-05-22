"use client";
import { useState, useMemo } from 'react';
import { PageHeader } from '@/components/shared/PageHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Eye, MoreVertical, Lock, Unlock, AlertTriangle, DollarSign } from 'lucide-react';
import { mockStoreAccounts, regions } from '@/lib/mock-data';
import type { StoreAccount, StoreTier } from '@/lib/types';
import { formatCurrencyDZD, formatDate } from '@/lib/formatters';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';

export default function StoresPage() {
  const [stores, setStores] = useState<StoreAccount[]>(mockStoreAccounts);
  const [searchTerm, setSearchTerm] = useState('');
  const [tierFilter, setTierFilter] = useState<StoreTier | 'All'>('All');
  const [regionFilter, setRegionFilter] = useState<string | 'All'>('All');
  const { toast } = useToast();

  const handleToggleFreeze = (id: string) => {
    setStores(prev => prev.map(store => store.id === id ? { ...store, isFrozen: !store.isFrozen } : store));
    const store = stores.find(s => s.id === id);
    if (store) {
      toast({
        title: `Store ${store.isFrozen ? 'Unfrozen' : 'Frozen'}`,
        description: `${store.name} has been ${store.isFrozen ? 'unfrozen' : 'frozen'}.`,
      });
    }
  };
  
  const handleToggleFlag = (id: string) => {
    setStores(prev => prev.map(store => store.id === id ? { ...store, isFlagged: !store.isFlagged } : store));
     const store = stores.find(s => s.id === id);
    if (store) {
      toast({
        title: `Store ${store.isFlagged ? 'Unflagged' : 'Flagged'}`,
        description: `${store.name} has been ${store.isFlagged ? 'unflagged' : 'flagged for review'}.`,
        variant: store.isFlagged ? "default" : "destructive",
      });
    }
  };

  const filteredStores = useMemo(() => {
    return stores.filter(store => {
      const matchesSearch = store.name.toLowerCase().includes(searchTerm.toLowerCase()) || store.id.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesTier = tierFilter === 'All' || store.tier === tierFilter;
      const matchesRegion = regionFilter === 'All' || store.region === regionFilter;
      return matchesSearch && matchesTier && matchesRegion;
    });
  }, [stores, searchTerm, tierFilter, regionFilter]);

  return (
    <>
      <PageHeader title="Store Accounts &amp; Balances" description="Manage financial profiles of all stores." />
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Filters</CardTitle>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
            <Input
              placeholder="Search by Store Name or ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Select value={tierFilter} onValueChange={(value: StoreTier | 'All') => setTierFilter(value)}>
              <SelectTrigger><SelectValue placeholder="Filter by Tier" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Tiers</SelectItem>
                <SelectItem value="Basic">Basic</SelectItem>
                <SelectItem value="Premium">Premium</SelectItem>
                <SelectItem value="Enterprise">Enterprise</SelectItem>
              </SelectContent>
            </Select>
            <Select value={regionFilter} onValueChange={(value: string | 'All') => setRegionFilter(value)}>
              <SelectTrigger><SelectValue placeholder="Filter by Region" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Regions</SelectItem>
                {regions.map(region => <SelectItem key={region} value={region}>{region}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Store Name (ID)</TableHead>
                <TableHead>Balance</TableHead>
                <TableHead>Last Payout</TableHead>
                <TableHead>Total Earnings</TableHead>
                <TableHead>Tier</TableHead>
                <TableHead>Region</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredStores.map((store) => (
                <TableRow key={store.id} className={store.isFrozen ? 'bg-destructive/10' : store.isFlagged ? 'bg-yellow-400/10' : ''}>
                  <TableCell className="font-medium">{store.name} <span className="text-xs text-muted-foreground">({store.id})</span></TableCell>
                  <TableCell>{formatCurrencyDZD(store.currentBalance)}</TableCell>
                  <TableCell>{store.lastPayoutDate ? formatDate(store.lastPayoutDate, 'PP') : 'N/A'}</TableCell>
                  <TableCell>{formatCurrencyDZD(store.totalEarnings)}</TableCell>
                  <TableCell><Badge variant={store.tier === "Enterprise" ? "default" : store.tier === "Premium" ? "secondary" : "outline"}>{store.tier}</Badge></TableCell>
                  <TableCell>{store.region}</TableCell>
                  <TableCell className="space-x-1">
                    {store.isFrozen && <Badge variant="destructive">Frozen</Badge>}
                    {store.isFlagged && <Badge className="bg-accent text-accent-foreground">Flagged</Badge>}
                    {(!store.isFrozen && !store.isFlagged) && <Badge variant="outline">Active</Badge>}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Eye className="mr-2 h-4 w-4" /> View History
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleToggleFreeze(store.id)}>
                          {store.isFrozen ? <Unlock className="mr-2 h-4 w-4 text-green-500" /> : <Lock className="mr-2 h-4 w-4 text-red-500" />}
                           {store.isFrozen ? 'Unfreeze Funds' : 'Freeze Funds'}
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleToggleFlag(store.id)}>
                           <AlertTriangle className={`mr-2 h-4 w-4 ${store.isFlagged ? 'text-green-500' : 'text-yellow-500'}`} />
                           {store.isFlagged ? 'Remove Flag' : 'Flag Irregularity'}
                        </DropdownMenuItem>
                         <DropdownMenuItem>
                          <DollarSign className="mr-2 h-4 w-4" /> Initiate Manual Payout
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
              {filteredStores.length === 0 && (
                 <TableRow>
                  <TableCell colSpan={8} className="text-center">No stores found.</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </>
  );
}
