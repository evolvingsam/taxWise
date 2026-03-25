import { TaxRecord, User } from "../types";

export const mockUser: User = {
  id: "USR-001",
  name: "Adeola Chinedu",
  email: "adeola@example.com",
};

export const mockLedger: TaxRecord[] = [
  {
    id: "TX-99201",
    userId: "USR-001",
    date: "2025-05-14T10:00:00Z",
    method: "text",
    status: "paid",
    assessment: {
      isExempt: false,
      taxDue: 45000,
      incomeEstimated: 1200000,
    },
    receiptUrl: "/receipts/TX-99201.pdf",
  },
  {
    id: "TX-99202",
    userId: "USR-001",
    date: "2024-05-10T11:00:00Z",
    method: "upload",
    status: "paid",
    assessment: {
      isExempt: true,
      reason: "Annual income below minimum taxable threshold (₦300,000)",
      incomeEstimated: 250000,
    },
    receiptUrl: "/receipts/TX-99202.pdf",
  }
];

export const mockPendingTax: TaxRecord = {
  id: "TX-99203",
  userId: "USR-001",
  date: new Date().toISOString(),
  method: "voice",
  status: "assessed",
  assessment: {
    isExempt: false,
    taxDue: 15500,
    incomeEstimated: 600000,
  }
};
