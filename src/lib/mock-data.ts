import type { PayoutRequest, Transaction, StoreAccount, ComplianceDocument, PlatformFeeConfig, RevenueDataPoint, StoreRevenue, PlatformMetrics } from './types';
import { subDays, subMonths, formatISO } from 'date-fns';

const today = new Date();

export const mockPayoutRequests: PayoutRequest[] = [
  { id: 'pr001', storeName: 'AutoParts Algiers', storeId: 's001', amountRequested: 150000, totalStoreBalance: 250000, transactionId: 'txn_payout_001', requestTime: subDays(today, 2).toISOString(), payoutMethod: 'Bank Transfer', status: 'Pending', region: 'Algiers' },
  { id: 'pr002', storeName: 'Oran Car Services', storeId: 's002', amountRequested: 75000, totalStoreBalance: 120000, transactionId: 'txn_payout_002', requestTime: subDays(today, 1).toISOString(), payoutMethod: 'Manual', status: 'Pending', region: 'Oran' },
  { id: 'pr003', storeName: 'Constantine Wheels', storeId: 's003', amountRequested: 220000, totalStoreBalance: 300000, transactionId: 'txn_payout_003', requestTime: subDays(today, 5).toISOString(), payoutMethod: 'Bank Transfer', status: 'Approved', region: 'Constantine' },
  { id: 'pr004', storeName: 'Sahara Auto Fix', storeId: 's004', amountRequested: 50000, totalStoreBalance: 60000, transactionId: 'txn_payout_004', requestTime: subDays(today, 3).toISOString(), payoutMethod: 'Paper-based', status: 'Rejected', region: 'Adrar' },
];

export const mockTransactions: Transaction[] = [
  { id: 'txn001', buyerName: 'Karim B.', storeName: 'AutoParts Algiers', storeId: 's001', itemsPurchased: ['Spark Plugs', 'Oil Filter'], amountPaid: 12500, paymentMethod: 'Bank API', status: 'Success', transactionDate: subDays(today, 3).toISOString(), type: 'Sale' },
  { id: 'txn002', buyerName: 'Fatima Z.', storeName: 'Oran Car Services', storeId: 's002', itemsPurchased: ['Full Car Wash'], amountPaid: 3000, paymentMethod: 'Cash on Delivery', status: 'Success', transactionDate: subDays(today, 1).toISOString(), type: 'Sale' },
  { id: 'txn003', buyerName: 'Ahmed K.', storeName: 'AutoParts Algiers', storeId: 's001', itemsPurchased: ['Brake Pads'], amountPaid: 8000, paymentMethod: 'Bank API', status: 'Failed', transactionDate: subDays(today, 2).toISOString(), type: 'Sale' },
  { id: 'txn004', buyerName: 'Leila M.', storeName: 'Constantine Wheels', storeId: 's003', itemsPurchased: ['Tire Set'], amountPaid: 45000, paymentMethod: 'Manual', status: 'Success', transactionDate: subDays(today, 7).toISOString(), type: 'Sale' },
  { id: 'txn005', buyerName: 'Yanis S.', storeName: 'AutoParts Algiers', storeId: 's001', itemsPurchased: ['Refund: Oil Filter'], amountPaid: -2500, paymentMethod: 'Bank API', status: 'Refunded', transactionDate: subDays(today, 1).toISOString(), type: 'Refund' },
];

export const mockStoreAccounts: StoreAccount[] = [
  { id: 's001', name: 'AutoParts Algiers', currentBalance: 250000, lastPayoutDate: subDays(today, 30).toISOString(), totalEarnings: 1200000, tier: 'Premium', region: 'Algiers', city: 'Algiers Center', joinDate: subMonths(today, 6).toISOString(), contactEmail: 'contact@autopartsalgiers.dz', isFlagged: false, isFrozen: false },
  { id: 's002', name: 'Oran Car Services', currentBalance: 120000, lastPayoutDate: subDays(today, 15).toISOString(), totalEarnings: 850000, tier: 'Basic', region: 'Oran', city: 'Oran', joinDate: subMonths(today, 3).toISOString(), contactEmail: 'info@orancarservices.dz', isFlagged: true, isFrozen: false },
  { id: 's003', name: 'Constantine Wheels', currentBalance: 300000, lastPayoutDate: subDays(today, 7).toISOString(), totalEarnings: 2500000, tier: 'Enterprise', region: 'Constantine', city: 'Constantine', joinDate: subMonths(today, 12).toISOString(), contactEmail: 'manager@constantinewheels.com', isFlagged: false, isFrozen: false },
  { id: 's004', name: 'Sahara Auto Fix', currentBalance: 60000, lastPayoutDate: null, totalEarnings: 150000, tier: 'Basic', region: 'Adrar', city: 'Adrar', joinDate: subMonths(today, 1).toISOString(), contactEmail: 'saharaautofix@email.com', isFlagged: false, isFrozen: true },
];

export const mockComplianceDocuments: ComplianceDocument[] = [
  { id: 'doc001', documentName: 'S001_KYC.pdf', documentType: 'Identity (KYC)', storeId: 's001', storeName: 'AutoParts Algiers', uploadDate: subMonths(today, 5).toISOString(), status: 'Verified', fileUrl: 'https://placehold.co/600x400.png' , dataAiHint: 'document id' },
  { id: 'doc002', documentName: 'S002_BankStatement.pdf', documentType: 'Bank Account Verification', storeId: 's002', storeName: 'Oran Car Services', uploadDate: subDays(today, 10).toISOString(), status: 'Pending Review', fileUrl: 'https://placehold.co/600x400.png', dataAiHint: 'document bank' },
  { id: 'doc003', documentName: 'S003_BusinessReg.pdf', documentType: 'Business Registration', storeId: 's003', storeName: 'Constantine Wheels', uploadDate: subMonths(today, 11).toISOString(), expiryDate: subMonths(today, -1).toISOString(), status: 'Verified', fileUrl: 'https://placehold.co/600x400.png', dataAiHint: 'document certificate' },
  { id: 'doc004', documentName: 'S004_Old_KYC.jpg', documentType: 'Identity (KYC)', storeId: 's004', storeName: 'Sahara Auto Fix', uploadDate: subMonths(today, 2).toISOString(), expiryDate: subDays(today, 5).toISOString(), status: 'Expired', fileUrl: 'https://placehold.co/600x400.png', dataAiHint: 'document form' },
];

export const mockPlatformFeeConfig: PlatformFeeConfig = {
  commissionRate: 0.07, // 7%
  bankTransferFee: 500,
  manualPayoutThreshold: 10000,
};

export const mockPlatformMetrics: PlatformMetrics = {
  totalGrossRevenue: 15750000,
  platformEarnings: 1102500, // 7% of total gross
  payoutsProcessed: 9850000,
  pendingPayoutAmount: 495000,
};

export const mockWeeklyRevenue: RevenueDataPoint[] = [
  { date: formatISO(subDays(today, 28), { representation: 'date' }), revenue: 350000 },
  { date: formatISO(subDays(today, 21), { representation: 'date' }), revenue: 420000 },
  { date: formatISO(subDays(today, 14), { representation: 'date' }), revenue: 380000 },
  { date: formatISO(subDays(today, 7), { representation: 'date' }), revenue: 510000 },
  { date: formatISO(today, { representation: 'date' }), revenue: 450000 },
];

export const mockMonthlyRevenue: RevenueDataPoint[] = [
  { date: formatISO(subMonths(today, 4), { representation: 'date' }).substring(0,7), revenue: 1200000 },
  { date: formatISO(subMonths(today, 3), { representation: 'date' }).substring(0,7), revenue: 1500000 },
  { date: formatISO(subMonths(today, 2), { representation: 'date' }).substring(0,7), revenue: 1350000 },
  { date: formatISO(subMonths(today, 1), { representation: 'date' }).substring(0,7), revenue: 1800000 },
  { date: formatISO(today, { representation: 'date' }).substring(0,7), revenue: 1600000 },
];


export const mockStoreRevenueBreakdown: StoreRevenue[] = [
  { storeName: 'AutoParts Algiers', revenue: 650000 },
  { storeName: 'Constantine Wheels', revenue: 850000 },
  { storeName: 'Oran Car Services', revenue: 420000 },
  { storeName: 'Sahara Auto Fix', revenue: 150000 },
  { storeName: 'Tlemcen Auto Gear', revenue: 300000 },
];

export const mockTopEarningStores: StoreRevenue[] = mockStoreAccounts
  .sort((a, b) => b.totalEarnings - a.totalEarnings)
  .slice(0, 5)
  .map(store => ({ storeName: store.name, revenue: store.totalEarnings }));

export const regions = ["Algiers", "Oran", "Constantine", "Annaba", "Adrar", "Tamanrasset", "Béjaïa", "Sétif", "Tlemcen"];
