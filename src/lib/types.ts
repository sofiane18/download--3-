export type PayoutRequestStatus = 'Pending' | 'Approved' | 'Rejected';
export type TransactionStatus = 'Success' | 'Failed' | 'Refunded' | 'Pending';
export type DocumentStatus = 'Verified' | 'Pending Review' | 'Rejected' | 'Expired';
export type StoreTier = 'Basic' | 'Premium' | 'Enterprise';

export interface PayoutRequest {
  id: string;
  storeName: string;
  storeId: string;
  amountRequested: number;
  totalStoreBalance: number;
  transactionId: string;
  requestTime: string; // ISO Date string
  payoutMethod: 'Bank Transfer' | 'Manual' | 'Paper-based';
  status: PayoutRequestStatus;
  region: string; // Wilaya
}

export interface Transaction {
  id: string;
  buyerName: string;
  storeName: string;
  storeId: string;
  itemsPurchased: string[];
  amountPaid: number;
  paymentMethod: 'Bank API' | 'Cash on Delivery' | 'Manual';
  status: TransactionStatus;
  transactionDate: string; // ISO Date string
  type: 'Sale' | 'Refund' | 'Fee';
}

export interface StoreAccount {
  id: string;
  name: string;
  currentBalance: number;
  lastPayoutDate: string | null; // ISO Date string
  totalEarnings: number;
  tier: StoreTier;
  region: string; // Wilaya
  city: string;
  joinDate: string; // ISO Date string
  contactEmail: string;
  isFlagged: boolean;
  isFrozen: boolean;
}

export interface ComplianceDocument {
  id:string;
  documentName: string;
  documentType: 'Bank Account Verification' | 'Identity (KYC)' | 'Business Registration';
  storeId: string;
  storeName: string;
  uploadDate: string; // ISO Date string
  expiryDate?: string | null; // ISO Date string
  status: DocumentStatus;
  fileUrl?: string; // Placeholder URL
}

export interface PlatformFeeConfig {
  commissionRate: number; // Percentage, e.g., 0.05 for 5%
  bankTransferFee: number; // Fixed amount in DZD
  manualPayoutThreshold: number; // Min amount in DZD for manual payout
}

export interface RevenueDataPoint {
  date: string; // Could be 'YYYY-MM-DD' for daily, 'YYYY-WW' for weekly, 'YYYY-MM' for monthly
  revenue: number;
}

export interface StoreRevenue {
  storeName: string;
  revenue: number;
}

export interface PlatformMetrics {
  totalGrossRevenue: number;
  platformEarnings: number;
  payoutsProcessed: number;
  pendingPayoutAmount: number;
}
