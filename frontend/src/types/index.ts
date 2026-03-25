export interface User {
  id: string;
  name: string;
  email: string;
}

export type IntakeMethod = 'text' | 'voice' | 'upload';

export interface TaxAssessmentRule {
  isExempt: boolean;
  reason?: string;
  taxDue?: number;
  incomeEstimated?: number;
}

export interface TaxRecord {
  id: string;
  userId: string;
  date: string;
  method: IntakeMethod;
  status: 'pending' | 'assessed' | 'paid';
  assessment: TaxAssessmentRule;
  receiptUrl?: string;
}
