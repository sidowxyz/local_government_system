/* ------------------------------------------------------------------ */
/*  Tariff data model — versioned fee schedules                       */
/* ------------------------------------------------------------------ */

// How a component determines its price
export type ChargeBasis = 'FIXED' | 'LOOKUP' | 'DIFFERENCE';

// A single lookup / difference row
export interface LookupRow {
  label: string;      // e.g. "Retail — small"
  amount: number;     // in USD cents → display as whole USD
}

// One pricing component inside a version
export interface TariffComponent {
  id: string;
  code: string;            // e.g. "BASE_FEE"
  labelEn: string;
  labelSo: string;
  basis: ChargeBasis;
  amount?: number;         // only when basis === 'FIXED'
  lookupField?: string;    // e.g. "form.faultParty"
  lookupValues?: LookupRow[];
}

// A point-in-time snapshot of the tariff's pricing
export interface TariffVersion {
  id: string;
  effectiveDate: string;   // ISO date string
  untilDate: string | null; // null = current
  approvalDocument?: string;
  components: TariffComponent[];
}

export type TariffCategory =
  | 'Business Licensing'
  | 'Civil Registry'
  | 'Transport & Vehicles'
  | 'Finance & Treasury';

export const tariffCategories: TariffCategory[] = [
  'Business Licensing',
  'Civil Registry',
  'Transport & Vehicles',
  'Finance & Treasury',
];

// Top-level tariff
export interface Tariff {
  id: string;
  name: string;           // English display name
  nameSomali?: string;    // Somali display name
  code: string;           // e.g. "BIZ_AMENDMENT_FEE"
  category: TariffCategory;
  status: 'Active' | 'Inactive';
  description?: string;
  serviceCodes?: string[]; // Codes of public services utilizing this tariff
  versions: TariffVersion[];
}

/* ------------------------------------------------------------------ */
/*  Seed data                                                         */
/* ------------------------------------------------------------------ */

export const initialTariffs: Tariff[] = [
  {
    id: 'tariff-1',
    name: 'Business amendment fee',
    nameSomali: 'Khidmadda wax-ka-bedelka ganacsiga',
    code: 'BIZ_AMENDMENT_FEE',
    category: 'Business Licensing',
    status: 'Active',
    description: 'Tariff schedule applied during modification of commercial license records and ownership changes.',
    serviceCodes: ['BIZ_AMENDMENT'],
    versions: [
      {
        id: 'v-1-1',
        effectiveDate: '2020-01-01',
        untilDate: null,
        approvalDocument: 'Council Decision 04/2019',
        components: [
          {
            id: 'c-1-1-1',
            code: 'AMENDMENT_FEE',
            labelEn: 'Amendment fee',
            labelSo: 'Khidmad wax-ka-bedelka',
            basis: 'LOOKUP',
            lookupField: 'form.faultParty',
            lookupValues: [
              { label: 'Recorded wrongly by this office', amount: 0 },
              { label: 'Requested by the owner', amount: 2000 },
            ],
          },
          {
            id: 'c-1-1-2',
            code: 'REG_FEE_DIFF',
            labelEn: 'Registration fee difference',
            labelSo: 'Farqiga khidmadda diiwaangelinta',
            basis: 'DIFFERENCE',
            lookupField: 'form.categoryCode',
            lookupValues: [
              { label: 'Retail — small', amount: 5000 },
              { label: 'Retail — large', amount: 15000 },
              { label: 'Wholesale', amount: 25000 },
              { label: 'Import / export', amount: 50000 },
              { label: 'Services', amount: 8000 },
              { label: 'Manufacturing', amount: 30000 },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'tariff-2',
    name: 'Annual business licence fee',
    nameSomali: 'Khidmadda shatiga sannadlaha ah',
    code: 'BIZ_ANNUAL_LICENCE',
    category: 'Business Licensing',
    status: 'Active',
    description: 'Annual municipal operating license tariff tiered according to commercial category classification.',
    serviceCodes: ['BIZ_LICENCE_ISSUE'],
    versions: [
      {
        id: 'v-2-1',
        effectiveDate: '2021-07-01',
        untilDate: null,
        approvalDocument: 'Municipal By-law 11/2021',
        components: [
          {
            id: 'c-2-1-1',
            code: 'LICENCE_FEE',
            labelEn: 'Annual licence fee',
            labelSo: 'Lacagta shati sannadeedka',
            basis: 'LOOKUP',
            lookupField: 'form.categoryCode',
            lookupValues: [
              { label: 'Retail — small', amount: 3000 },
              { label: 'Retail — large', amount: 8000 },
              { label: 'Wholesale', amount: 12000 },
              { label: 'Import / export', amount: 20000 },
              { label: 'Services', amount: 5000 },
              { label: 'Manufacturing', amount: 15000 },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'tariff-3',
    name: 'Legacy arrears brought forward',
    nameSomali: 'Deymihii hore ee la wareejiyey',
    code: 'BIZ_LEGACY_ARREARS',
    category: 'Finance & Treasury',
    status: 'Active',
    description: 'Brought-forward arrears balance adjustment applied during financial transitions and ledger settlements.',
    serviceCodes: ['RECONCILIATION_REVIEW', 'WAIVER_APPROVAL'],
    versions: [
      {
        id: 'v-3-1',
        effectiveDate: '2020-01-01',
        untilDate: null,
        approvalDocument: 'Treasury Directive 01/2020',
        components: [
          {
            id: 'c-3-1-1',
            code: 'ARREARS',
            labelEn: 'Arrears balance',
            labelSo: 'Deynta hore',
            basis: 'FIXED',
            amount: 0,
          },
        ],
      },
    ],
  },
  {
    id: 'tariff-4',
    name: 'Business registration fee',
    nameSomali: 'Khidmadda diiwaangelinta ganacsiga',
    code: 'BIZ_REGISTRATION_FEE',
    category: 'Business Licensing',
    status: 'Active',
    description: 'Initial commercial enterprise creation and registration fee based on company scale and classification.',
    serviceCodes: ['BIZ_NEW_REGISTRATION'],
    versions: [
      {
        id: 'v-4-1',
        effectiveDate: '2020-01-01',
        untilDate: null,
        approvalDocument: 'Council Resolution 02/2019',
        components: [
          {
            id: 'c-4-1-1',
            code: 'REG_FEE',
            labelEn: 'Registration fee',
            labelSo: 'Lacagta diiwaangelinta',
            basis: 'LOOKUP',
            lookupField: 'form.categoryCode',
            lookupValues: [
              { label: 'Retail — small', amount: 5000 },
              { label: 'Retail — large', amount: 15000 },
              { label: 'Wholesale', amount: 25000 },
              { label: 'Import / export', amount: 50000 },
              { label: 'Services', amount: 8000 },
              { label: 'Manufacturing', amount: 30000 },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'tariff-5',
    name: 'Birth registration fee',
    nameSomali: 'Khidmadda diiwaangelinta dhalashada',
    code: 'CIV_BIRTH_FEE',
    category: 'Civil Registry',
    status: 'Active',
    description: 'Standard civil vital statistics certificate processing fee for birth registration.',
    serviceCodes: ['CIV_BIRTH_REGISTRATION'],
    versions: [
      {
        id: 'v-5-1',
        effectiveDate: '2021-01-01',
        untilDate: null,
        approvalDocument: 'Civil Status Act 09/2020',
        components: [
          {
            id: 'c-5-1-1',
            code: 'BIRTH_FEE',
            labelEn: 'Birth registration',
            labelSo: 'Diiwaangelinta dhalashada',
            basis: 'FIXED',
            amount: 500,
          },
        ],
      },
    ],
  },
  {
    id: 'tariff-6',
    name: 'Vehicle quarterly tax',
    nameSomali: 'Canshuurta rubuc-sannadeedka gaadiidka',
    code: 'VEH_QUARTERLY_TAX',
    category: 'Transport & Vehicles',
    status: 'Active',
    description: 'Quarterly recurrent municipal road tax assessed on registered automotive transport vehicles.',
    serviceCodes: ['VEH_REGISTRATION'],
    versions: [
      {
        id: 'v-6-1',
        effectiveDate: '2022-01-01',
        untilDate: null,
        approvalDocument: 'Transport Code By-law 07/2021',
        components: [
          {
            id: 'c-6-1-1',
            code: 'QTRLY_TAX',
            labelEn: 'Quarterly vehicle tax',
            labelSo: 'Canshuurta rubuc-sannadeedka gaadiidka',
            basis: 'FIXED',
            amount: 1500,
          },
        ],
      },
    ],
  },
  {
    id: 'tariff-7',
    name: 'Vehicle registration fee',
    nameSomali: 'Khidmadda diiwaangelinta gaadiidka',
    code: 'VEH_REGISTRATION_FEE',
    category: 'Transport & Vehicles',
    status: 'Active',
    description: 'Initial title, license plate assignment, and vehicle registration charge.',
    serviceCodes: ['VEH_REGISTRATION'],
    versions: [
      {
        id: 'v-7-1',
        effectiveDate: '2022-01-01',
        untilDate: null,
        approvalDocument: 'Transport Code By-law 07/2021',
        components: [
          {
            id: 'c-7-1-1',
            code: 'VEH_REG',
            labelEn: 'Vehicle registration',
            labelSo: 'Diiwaangelinta gaari',
            basis: 'FIXED',
            amount: 10000,
          },
        ],
      },
    ],
  },
];

/* ------------------------------------------------------------------ */
/*  Helpers                                                           */
/* ------------------------------------------------------------------ */

/** Format a number as USD with commas, no decimals */
export function formatUSD(amount: number): string {
  return amount.toLocaleString('en-US') + ' USD';
}

/** Format an ISO date string as "01 Jan 2020" */
export function formatDate(iso: string): string {
  const d = new Date(iso + 'T00:00:00');
  return d.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

/** Find the current (latest) version of a tariff */
export function getCurrentVersion(tariff: Tariff): TariffVersion | null {
  if (tariff.versions.length === 0) return null;
  // Current = untilDate is null, or latest by effectiveDate
  const current = tariff.versions.find((v) => v.untilDate === null);
  if (current) return current;
  // Fallback: sort descending
  return [...tariff.versions].sort(
    (a, b) => new Date(b.effectiveDate).getTime() - new Date(a.effectiveDate).getTime()
  )[0];
}
