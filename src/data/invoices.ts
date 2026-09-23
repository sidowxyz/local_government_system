export type InvoiceStatus = 'Issued' | 'Paid';

export interface InvoiceItem {
  name: string;
  code: string;
  qty: number;
  unitPrice: number;
  total: number;
}

export interface PaymentRecord {
  id: string;
  reference: string;
  date: string;
  amount: number;
  method: string;
  receiptNumber?: string;
}

export interface Invoice {
  id: string;
  reference: string;
  serviceCode: string;
  payer: string;
  service: string;
  dueDate: string;
  dueSortKey: number;
  status: InvoiceStatus;
  totalAmount: number;
  settledAmount: number;
  amountDue: number;
  items: InvoiceItem[];
  payments: PaymentRecord[];
}

export const invoices: Invoice[] = [
  {
    id: 'inv-7',
    reference: 'INV-2026-000007',
    serviceCode: 'VEH_REGISTRATION',
    payer: 'mumin ahmed ali',
    service: 'Vehicle registration',
    dueDate: '22 Oct 2026',
    dueSortKey: 20261022,
    status: 'Issued',
    totalAmount: 10.0,
    settledAmount: 0.0,
    amountDue: 10.0,
    items: [
      {
        name: 'Vehicle registration fee',
        code: 'vehicle_registration_fee · MOTORCYCLE',
        qty: 1,
        unitPrice: 10.0,
        total: 10.0,
      },
    ],
    payments: [],
  },
  {
    id: 'inv-6',
    reference: 'INV-2026-000006',
    serviceCode: 'VEH_REGISTRATION',
    payer: 'mumin ahmed ali',
    service: 'Vehicle registration',
    dueDate: '14 Oct 2026',
    dueSortKey: 20261014,
    status: 'Paid',
    totalAmount: 10.0,
    settledAmount: 10.0,
    amountDue: 0.0,
    items: [
      {
        name: 'Vehicle registration fee',
        code: 'vehicle_registration_fee · MOTORCYCLE',
        qty: 1,
        unitPrice: 10.0,
        total: 10.0,
      },
    ],
    payments: [
      {
        id: 'pay-6',
        reference: 'REC-2026-000045',
        date: '14 Oct 2026',
        amount: 10.0,
        method: 'Cash',
        receiptNumber: 'RCT-7712',
      },
    ],
  },
  {
    id: 'inv-5',
    reference: 'INV-2026-000005',
    serviceCode: 'VEH_REGISTRATION',
    payer: 'Bashir Ahmed Mohamud',
    service: 'Vehicle registration',
    dueDate: '12 Oct 2026',
    dueSortKey: 20261012,
    status: 'Paid',
    totalAmount: 50.0,
    settledAmount: 50.0,
    amountDue: 0.0,
    items: [
      {
        name: 'Vehicle registration fee',
        code: 'vehicle_registration_fee · COMMERCIAL',
        qty: 1,
        unitPrice: 50.0,
        total: 50.0,
      },
    ],
    payments: [
      {
        id: 'pay-5',
        reference: 'REC-2026-000039',
        date: '12 Oct 2026',
        amount: 50.0,
        method: 'EVC Plus',
        receiptNumber: 'RCT-6901',
      },
    ],
  },
  {
    id: 'inv-4',
    reference: 'INV-2026-000004',
    serviceCode: 'BIZ_REGISTRATION',
    payer: 'mumin ahmed ali',
    service: 'Business registration',
    dueDate: '09 Oct 2026',
    dueSortKey: 20261009,
    status: 'Paid',
    totalAmount: 120.0,
    settledAmount: 120.0,
    amountDue: 0.0,
    items: [
      {
        name: 'Business registration fee',
        code: 'business_registration_fee · RETAIL_STORE',
        qty: 1,
        unitPrice: 120.0,
        total: 120.0,
      },
    ],
    payments: [
      {
        id: 'pay-4',
        reference: 'REC-2026-000028',
        date: '09 Oct 2026',
        amount: 120.0,
        method: 'Bank transfer',
        receiptNumber: 'RCT-5542',
      },
    ],
  },
  {
    id: 'inv-3',
    reference: 'INV-2026-000003',
    serviceCode: 'BIZ_REGISTRATION',
    payer: 'Mohamed Sharif Abdullahi',
    service: 'Business registration',
    dueDate: '09 Oct 2026',
    dueSortKey: 20261009,
    status: 'Issued',
    totalAmount: 5000.0,
    settledAmount: 0.0,
    amountDue: 5000.0,
    items: [
      {
        name: 'Commercial business license',
        code: 'business_license_fee · TIER_1_ENTERPRISE',
        qty: 1,
        unitPrice: 5000.0,
        total: 5000.0,
      },
    ],
    payments: [],
  },
  {
    id: 'inv-2',
    reference: 'INV-2026-000002',
    serviceCode: 'BIZ_REGISTRATION',
    payer: 'mumin ahmed ali',
    service: 'Business registration',
    dueDate: '17 Sept 2026',
    dueSortKey: 20260917,
    status: 'Paid',
    totalAmount: 150.0,
    settledAmount: 150.0,
    amountDue: 0.0,
    items: [
      {
        name: 'Trade name renewal fee',
        code: 'trade_name_renewal · ANNUAL',
        qty: 1,
        unitPrice: 150.0,
        total: 150.0,
      },
    ],
    payments: [
      {
        id: 'pay-2',
        reference: 'REC-2026-000015',
        date: '17 Sept 2026',
        amount: 150.0,
        method: 'EVC Plus',
        receiptNumber: 'RCT-4109',
      },
    ],
  },
  {
    id: 'inv-1',
    reference: 'INV-2026-000001',
    serviceCode: 'BIRTH_REGISTRATION',
    payer: 'Halima Hasan Gure',
    service: 'Birth registration',
    dueDate: '15 Sept 2026',
    dueSortKey: 20260915,
    status: 'Paid',
    totalAmount: 5.0,
    settledAmount: 5.0,
    amountDue: 0.0,
    items: [
      {
        name: 'Birth certificate issuance',
        code: 'birth_cert_issuance · STANDARD',
        qty: 1,
        unitPrice: 5.0,
        total: 5.0,
      },
    ],
    payments: [
      {
        id: 'pay-1',
        reference: 'REC-2026-000002',
        date: '15 Sept 2026',
        amount: 5.0,
        method: 'Cash',
        receiptNumber: 'RCT-1004',
      },
    ],
  },
];

export const invoiceServices = [
  ...new Set(invoices.map((inv) => inv.service)),
];
