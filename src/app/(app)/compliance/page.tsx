"use client";
import { useState, useMemo } from 'react';
import Image from 'next/image';
import { PageHeader } from '@/components/shared/PageHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { CheckCircle2, XCircle, Eye, MoreVertical, UploadCloud, RefreshCcw } from 'lucide-react';
import { mockComplianceDocuments } from '@/lib/mock-data';
import type { ComplianceDocument, DocumentStatus } from '@/lib/types';
import { formatDate } from '@/lib/formatters';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';

const statusColors: Record<DocumentStatus, string> = {
  Verified: 'bg-green-500',
  'Pending Review': 'bg-yellow-500',
  Rejected: 'bg-red-500',
  Expired: 'bg-gray-500',
};

export default function CompliancePage() {
  const [documents, setDocuments] = useState<ComplianceDocument[]>(mockComplianceDocuments);
  const [searchTerm, setSearchTerm] = useState(''); // Search by store name or document name
  const [statusFilter, setStatusFilter] = useState<DocumentStatus | 'All'>('All');
  const [selectedDocument, setSelectedDocument] = useState<ComplianceDocument | null>(null);
  const { toast } = useToast();

  const handleUpdateStatus = (id: string, newStatus: DocumentStatus) => {
    setDocuments(prev => prev.map(doc => doc.id === id ? { ...doc, status: newStatus } : doc));
    const doc = documents.find(d => d.id === id);
    toast({
        title: `Document Status Updated`,
        description: `Document "${doc?.documentName}" for ${doc?.storeName} is now ${newStatus}.`,
      });
  };

  const filteredDocuments = useMemo(() => {
    return documents.filter(doc => {
      const matchesSearch = doc.storeName.toLowerCase().includes(searchTerm.toLowerCase()) || doc.documentName.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'All' || doc.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [documents, searchTerm, statusFilter]);

  const getStatusBadgeVariant = (status: DocumentStatus) => {
    switch (status) {
      case 'Verified': return 'default';
      case 'Pending Review': return 'secondary'; // use accent for pending
      case 'Rejected': return 'destructive';
      case 'Expired': return 'outline';
      default: return 'outline';
    }
  };

  return (
    <>
      <PageHeader title="Compliance &amp; Documents" description="Verify store legal and identity documents." />
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Filters &amp; Search</CardTitle>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
            <Input
              placeholder="Search Store or Document Name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="md:col-span-2"
            />
            <Select value={statusFilter} onValueChange={(value: DocumentStatus | 'All') => setStatusFilter(value)}>
              <SelectTrigger><SelectValue placeholder="Filter by Status" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Statuses</SelectItem>
                <SelectItem value="Verified">Verified</SelectItem>
                <SelectItem value="Pending Review">Pending Review</SelectItem>
                <SelectItem value="Rejected">Rejected</SelectItem>
                <SelectItem value="Expired">Expired</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Document Name</TableHead>
                <TableHead>Store Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Uploaded</TableHead>
                <TableHead>Expires</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredDocuments.map((doc) => (
                <TableRow key={doc.id}>
                  <TableCell className="font-medium">{doc.documentName}</TableCell>
                  <TableCell>{doc.storeName}</TableCell>
                  <TableCell>{doc.documentType}</TableCell>
                  <TableCell>{formatDate(doc.uploadDate, 'PP')}</TableCell>
                  <TableCell>{doc.expiryDate ? formatDate(doc.expiryDate, 'PP') : 'N/A'}</TableCell>
                  <TableCell>
                    <Badge variant={getStatusBadgeVariant(doc.status)} className={doc.status === 'Pending Review' ? 'bg-accent text-accent-foreground' : ''}>
                        {doc.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                     <Dialog>
                        <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                            <MoreVertical className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DialogTrigger asChild>
                                <DropdownMenuItem onClick={() => setSelectedDocument(doc)}>
                                    <Eye className="mr-2 h-4 w-4" /> View Document
                                </DropdownMenuItem>
                            </DialogTrigger>
                            {doc.status === 'Pending Review' && (
                            <>
                                <DropdownMenuItem onClick={() => handleUpdateStatus(doc.id, 'Verified')}>
                                <CheckCircle2 className="mr-2 h-4 w-4 text-green-500" /> Approve
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleUpdateStatus(doc.id, 'Rejected')}>
                                <XCircle className="mr-2 h-4 w-4 text-red-500" /> Reject
                                </DropdownMenuItem>
                            </>
                            )}
                            {(doc.status === 'Rejected' || doc.status === 'Expired') && (
                                <DropdownMenuItem onClick={() => alert(`Request reupload for ${doc.documentName}`)}>
                                    <RefreshCcw className="mr-2 h-4 w-4 text-blue-500" /> Request Reupload
                                </DropdownMenuItem>
                            )}
                        </DropdownMenuContent>
                        </DropdownMenu>
                        {selectedDocument && selectedDocument.id === doc.id && (
                             <DialogContent className="sm:max-w-[625px]">
                                <DialogHeader>
                                <DialogTitle>Document: {selectedDocument.documentName}</DialogTitle>
                                <DialogDescription>
                                    Store: {selectedDocument.storeName} | Type: {selectedDocument.documentType}
                                </DialogDescription>
                                </DialogHeader>
                                <div className="my-4">
                                    {selectedDocument.fileUrl ? (
                                        <Image src={selectedDocument.fileUrl} alt={selectedDocument.documentName} width={600} height={400} className="rounded-md object-contain" data-ai-hint={selectedDocument.dataAiHint}/>
                                    ) : (
                                        <p>No preview available.</p>
                                    )}
                                </div>
                                <DialogFooter>
                                <DialogClose asChild>
                                    <Button type="button" variant="secondary">Close</Button>
                                </DialogClose>
                                {(selectedDocument.status === 'Pending Review') && (
                                    <>
                                    <Button variant="destructive" onClick={() => { handleUpdateStatus(selectedDocument.id, 'Rejected'); setSelectedDocument(null); }}>Reject</Button>
                                    <Button onClick={() => { handleUpdateStatus(selectedDocument.id, 'Verified'); setSelectedDocument(null); }}>Approve</Button>
                                    </>
                                )}
                                </DialogFooter>
                            </DialogContent>
                        )}
                     </Dialog>
                  </TableCell>
                </TableRow>
              ))}
              {filteredDocuments.length === 0 && (
                 <TableRow>
                  <TableCell colSpan={7} className="text-center">No documents found.</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
       {/* Simulated Upload Section */}
      <Card className="mt-6 shadow-lg">
        <CardHeader>
            <CardTitle>Simulate Document Upload</CardTitle>
            <CardDescription>This is a placeholder for document upload functionality.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center p-10 border-2 border-dashed border-border rounded-md">
            <UploadCloud className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground mb-2">Drag &amp; drop files here, or click to select files</p>
            <Button variant="outline" onClick={() => alert("File selection dialog (mock)")}>Select Files</Button>
            <p className="text-xs text-muted-foreground mt-4">Max file size: 5MB. Supported types: PDF, JPG, PNG.</p>
        </CardContent>
      </Card>
    </>
  );
}
