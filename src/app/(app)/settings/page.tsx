"use client";
import { useState } from 'react';
import { PageHeader } from '@/components/shared/PageHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { mockPlatformFeeConfig } from '@/lib/mock-data';
import type { PlatformFeeConfig } from '@/lib/types';
import { formatCurrencyDZD } from '@/lib/formatters';
import { useToast } from '@/hooks/use-toast';
import { DollarSign, Percent, Banknote, Settings2 } from 'lucide-react';

export default function SettingsPage() {
  const [config, setConfig] = useState<PlatformFeeConfig>(mockPlatformFeeConfig);
  const { toast } = useToast();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    setConfig(prev => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) : value,
    }));
  };

  const handleSaveConfig = (section: string) => {
    // Here you would typically send the config to a backend API
    console.log(`Saving ${section}:`, config);
    toast({
      title: `${section} Settings Saved`,
      description: `The ${section.toLowerCase()} configuration has been updated.`,
    });
  };

  return (
    <>
      <PageHeader title="Configuration &amp; Fees" description="Manage platform-wide settings and financial parameters." />

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center"><Percent className="mr-2 h-5 w-5 text-primary" /> Commission Rates</CardTitle>
            <CardDescription>Set the platform's commission structure.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="commissionRate">Default Commission Rate (%)</Label>
              <div className="relative mt-1">
                <Input
                  id="commissionRate"
                  name="commissionRate"
                  type="number"
                  value={config.commissionRate * 100} // Display as percentage
                  onChange={(e) => setConfig(prev => ({ ...prev, commissionRate: parseFloat(e.target.value) / 100 }))}
                  step="0.1"
                  className="pl-8"
                />
                <Percent className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Current rate: {formatCurrencyDZD(10000 * config.commissionRate)} per 10,000 DZD transaction.
              </p>
            </div>
            {/* Add more category-specific rates here if needed */}
          </CardContent>
          <CardFooter>
            <Button onClick={() => handleSaveConfig('Commission')} className="w-full">Save Commissions</Button>
          </CardFooter>
        </Card>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center"><DollarSign className="mr-2 h-5 w-5 text-primary" /> Transaction Fees</CardTitle>
            <CardDescription>Define fees for various transaction types.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="bankTransferFee">Bank Transfer Fee (DZD)</Label>
              <div className="relative mt-1">
                <Input
                  id="bankTransferFee"
                  name="bankTransferFee"
                  type="number"
                  value={config.bankTransferFee}
                  onChange={handleInputChange}
                  className="pl-8"
                />
                 <Banknote className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              </div>
            </div>
            <div>
              <Label htmlFor="manualPayoutThreshold">Manual Payout Threshold (DZD)</Label>
               <div className="relative mt-1">
                <Input
                  id="manualPayoutThreshold"
                  name="manualPayoutThreshold"
                  type="number"
                  value={config.manualPayoutThreshold}
                  onChange={handleInputChange}
                  className="pl-8"
                />
                 <Banknote className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
               </div>
              <p className="text-xs text-muted-foreground mt-1">Minimum amount for a manual payout request.</p>
            </div>
          </CardContent>
          <CardFooter>
            <Button onClick={() => handleSaveConfig('Fees')} className="w-full">Save Fees</Button>
          </CardFooter>
        </Card>
        
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center"><Settings2 className="mr-2 h-5 w-5 text-primary" /> Payment Partners</CardTitle>
            <CardDescription>Manage integrations with payment gateways and banks (simulated).</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between rounded-lg border p-3 shadow-sm">
                <div>
                    <h4 className="font-semibold">Bank API XYZ</h4>
                    <p className="text-xs text-muted-foreground">api.bankxyz.dz/v1/payments</p>
                </div>
                <Switch checked={true} onCheckedChange={() => alert("Toggle Bank API XYZ (mock)")} />
            </div>
             <div className="flex items-center justify-between rounded-lg border p-3 shadow-sm">
                <div>
                    <h4 className="font-semibold">Cash on Delivery</h4>
                    <p className="text-xs text-muted-foreground">Manual processing</p>
                </div>
                <Switch checked={true} onCheckedChange={() => alert("Toggle Cash on Delivery (mock)")} />
            </div>
            <Button variant="outline" className="w-full" onClick={() => alert("Add new payment partner (mock)")}>Add New Partner</Button>
          </CardContent>
           <CardFooter>
            <Button onClick={() => handleSaveConfig('Payment Partners')} className="w-full">Save Partner Settings</Button>
          </CardFooter>
        </Card>
      </div>
    </>
  );
}
