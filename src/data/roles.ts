export interface FeaturePermission {
  key: string;
  label: string;
  allowedActions: string[];
}

export interface ServiceDefinitionPermission {
  name: string;
  code: string;
  allowedActions: string[];
}

export interface ReportItem {
  id: string;
  name: string;
  code: string;
  department: string;
}

export interface Role {
  id: string;
  name: string;
  nameSomali?: string;
  code: string;
  isSystem?: boolean;
  status?: 'Active' | 'Inactive';
  description?: string;
  userCount?: number;
  // Tab 1: Features (key -> array of granted action strings)
  featurePermissions: Record<string, string[]>;
  // Tab 2: Service definitions (code -> array of granted action strings)
  servicePermissions: Record<string, string[]>;
  // Tab 3: Reports
  reportScope: 'all' | 'specific';
  allowedReports: string[]; // Report IDs
}

export const featureActions = [
  'view',
  'create',
  'edit',
  'export',
  'collect',
  'open',
  'close',
  'verify',
  'approve',
  'use',
  'execute',
  'resolve',
] as const;

export type FeatureCategory =
  | 'Finance & Revenue'
  | 'Registry & Citizens'
  | 'Documents & Output'
  | 'System & Administration';

export const featureKeys: {
  key: string;
  label: string;
  category: FeatureCategory;
  description: string;
}[] = [
    // Finance & Revenue
    { key: 'cash_session', label: 'Cash session', category: 'Finance & Revenue', description: 'Open, manage, and verify teller cash sessions and registers.' },
    { key: 'cash_session_force_close', label: 'Cash session force close', category: 'Finance & Revenue', description: 'Emergency administrative closure of active cashier drawers.' },
    { key: 'cash_verification', label: 'Cash verification', category: 'Finance & Revenue', description: 'Physical cash counts, supervisor reconciliations, and safe deposits.' },
    { key: 'payment_counter', label: 'Payment counter', category: 'Finance & Revenue', description: 'Collect walk-in citizen fees, issue counter receipts, and handle payments.' },
    { key: 'reconciliation', label: 'Reconciliation', category: 'Finance & Revenue', description: 'Daily bank reconciliation, batch accounting, and ledger balancing.' },
    { key: 'unmatched_payment', label: 'Unmatched payment', category: 'Finance & Revenue', description: 'Investigate and resolve unassigned electronic or mobile banking receipts.' },
    { key: 'tariff_management', label: 'Tariff management', category: 'Finance & Revenue', description: 'Configure revenue tariff schedules, fee structures, and service rates.' },
    { key: 'bill_run', label: 'Bill run', category: 'Finance & Revenue', description: 'Batch billing execution, automated invoice generation, and recurring notices.' },
    { key: 'credit_transfer', label: 'Credit transfer', category: 'Finance & Revenue', description: 'Process account credit transfers and balance reassignments.' },
    { key: 'waiver', label: 'Waiver', category: 'Finance & Revenue', description: 'Review, verify, and approve administrative waivers and penalty reductions.' },
    { key: 'amnesty_campaign', label: 'Amnesty campaign', category: 'Finance & Revenue', description: 'Special revenue collection amnesty periods and incentive programs.' },

    // Registry & Citizens
    { key: 'party_registry', label: 'Party registry', category: 'Registry & Citizens', description: 'Individual citizen and legal entity master records and identification.' },
    { key: 'party_merge', label: 'Party merge', category: 'Registry & Citizens', description: 'De-duplicate and merge duplicate citizen identity profiles.' },
    { key: 'mobile_field_collection', label: 'Mobile field collection', category: 'Registry & Citizens', description: 'Field officer remote revenue collection via handheld mobile devices.' },
    { key: 'mobile_inspection', label: 'Mobile inspection', category: 'Registry & Citizens', description: 'On-site property and vehicle compliance inspections.' },
    { key: 'mobile_verification', label: 'Mobile verification', category: 'Registry & Citizens', description: 'Mobile identity and document verification in the field.' },

    // Documents & Output
    { key: 'document_management', label: 'Document management', category: 'Documents & Output', description: 'Central digital repository, scanned supporting files, and attachments.' },
    { key: 'print_invoice', label: 'Print invoice', category: 'Documents & Output', description: 'Generate and print official assessment sheets and tax bills.' },
    { key: 'print_receipt', label: 'Print receipt', category: 'Documents & Output', description: 'Issue and reprint verified payment receipts and fiscal vouchers.' },
    { key: 'import', label: 'Import', category: 'Documents & Output', description: 'Bulk file and external database batch import utility.' },

    // System & Administration
    { key: 'user_management', label: 'User management', category: 'System & Administration', description: 'Create and manage government officer user profiles and department assignments.' },
    { key: 'user_security_reset', label: 'User security reset', category: 'System & Administration', description: 'Reset officer passwords, PINs, and security credentials.' },
    { key: 'organisation_admin', label: 'Organisation admin', category: 'System & Administration', description: 'Manage municipal offices, branches, and organizational units.' },
    { key: 'service_definitions', label: 'Service definitions', category: 'System & Administration', description: 'Configure public services, required documents, and process workflows.' },
    { key: 'system_config', label: 'System config', category: 'System & Administration', description: 'System-wide environment variables, currency settings, and parameters.' },
    { key: 'system_jobs', label: 'System jobs', category: 'System & Administration', description: 'Automated background tasks, scheduler monitoring, and queue jobs.' },
    { key: 'audit_log', label: 'Audit log', category: 'System & Administration', description: 'Immutable audit trail of all security, authentication, and update events.' },
    { key: 'notification_management', label: 'Notification management', category: 'System & Administration', description: 'SMS alerts, citizen email dispatches, and system notice broadcasts.' },
    { key: 'report_officer_perf', label: 'Report officer perf', category: 'System & Administration', description: 'Staff productivity, SLA compliance, and daily transaction volume.' },
    { key: 'report_revenue', label: 'Report revenue', category: 'System & Administration', description: 'Fiscal revenue analytics, payment channel breakdowns, and collections.' },
    { key: 'reference_data', label: 'Reference data', category: 'System & Administration', description: 'Dropdown lookups, country codes, vehicle classes, and business types.' },
  ];

export const serviceActions = [
  'view',
  'create',
  'submit',
  'accept',
  'pass',
  'verify',
  'complete',
  'review',
  'approve',
  'confirm',
  'issue',
  'collect',
  'return',
  'reject',
  'cancel',
  'print',
  'reprint',
  'attach',
  'amend',
  'expedite',
] as const;

export interface WorkflowStage {
  name: string;
  actions: string[];
}

export const serviceWorkflowStages: WorkflowStage[] = [
  {
    name: 'Intake & Reception',
    actions: ['view', 'create', 'submit', 'accept', 'pass'],
  },
  {
    name: 'Verification & Review',
    actions: ['verify', 'complete', 'review'],
  },
  {
    name: 'Approval & Decision',
    actions: ['approve', 'confirm', 'issue', 'collect', 'return', 'reject', 'cancel'],
  },
  {
    name: 'Output & Documentation',
    actions: ['print', 'reprint', 'attach', 'amend', 'expedite'],
  },
];

export const serviceDefinitions: {
  name: string;
  code: string;
  department: string;
  description: string;
}[] = [
    {
      name: 'Business amendment',
      code: 'BIZ_AMENDMENT',
      department: 'Business Licensing',
      description: 'Commercial license modification, trade name changes, and owner updates.',
    },
    {
      name: 'Business licence',
      code: 'BIZ_LICENCE_ISSUE',
      department: 'Business Licensing',
      description: 'Annual business operating permit, inspection compliance, and renewal.',
    },
    {
      name: 'Business registration',
      code: 'BIZ_NEW_REGISTRATION',
      department: 'Business Licensing',
      description: 'Initial commercial enterprise creation and corporate registry.',
    },
    {
      name: 'Birth registration',
      code: 'CIV_BIRTH_REGISTRATION',
      department: 'Civil Registry',
      description: 'Official vital statistics birth record, citizenship certification, and parentage index.',
    },
    {
      name: 'Reconciliation review',
      code: 'RECONCILIATION_REVIEW',
      department: 'Finance',
      description: 'End-of-day revenue audit, treasury verification, and ledger approval.',
    },
    {
      name: 'Vehicle registration',
      code: 'VEH_REGISTRATION',
      department: 'Transport',
      description: 'Automobile title ownership, road tax assessment, and license plate assignment.',
    },
    {
      name: 'Waiver approval',
      code: 'WAIVER_APPROVAL',
      department: 'Finance',
      description: 'Administrative fee waiver, penalty relief, and exceptional tariff reduction.',
    },
  ];

export const reportItems: ReportItem[] = [
  { id: 'rep-01', name: 'Daily Cash Reconciliation Report', code: 'REP_CASH_DAILY', department: 'Finance' },
  { id: 'rep-02', name: 'Revenue Collection by Department', code: 'REP_REV_DEPT', department: 'Finance' },
  { id: 'rep-03', name: 'Officer Performance & KPI Report', code: 'REP_OFFICER_PERF', department: 'Administration' },
  { id: 'rep-04', name: 'Unmatched Payments & Exceptions Ledger', code: 'REP_UNMATCHED_PAY', department: 'Finance' },
  { id: 'rep-05', name: 'Audit Trail & Security Log', code: 'REP_AUDIT_TRAIL', department: 'Administration' },
  { id: 'rep-06', name: 'Business License Issuance Ledger', code: 'REP_BIZ_LIC_LOG', department: 'Business' },
  { id: 'rep-07', name: 'Commercial Registration Registry', code: 'REP_BIZ_REG_LOG', department: 'Business' },
  { id: 'rep-08', name: 'Birth & Civil Status Registry', code: 'REP_CIV_BIRTH_LOG', department: 'Civil Registry' },
  { id: 'rep-09', name: 'Vehicle Road Tax & Inspection Summary', code: 'REP_VEH_TAX_LOG', department: 'Transport' },
  { id: 'rep-10', name: 'Tariff & Fee Schedule Summary', code: 'REP_TARIFF_SCHED', department: 'Finance' },
  { id: 'rep-11', name: 'Waiver & Amnesty Grant Summary', code: 'REP_WAIVER_LOG', department: 'Finance' },
];

// Helper to create initial matrix
const createFeatureMap = (defaults: Record<string, string[]> = {}) => {
  const map: Record<string, string[]> = {};
  featureKeys.forEach((f) => {
    map[f.key] = defaults[f.key] || [];
  });
  return map;
};

const createAllFeaturesGranted = () => {
  const map: Record<string, string[]> = {};
  featureKeys.forEach((f) => {
    map[f.key] = [...featureActions];
  });
  return map;
};

const createAllServicesGranted = () => {
  const map: Record<string, string[]> = {};
  serviceDefinitions.forEach((s) => {
    map[s.code] = [...serviceActions];
  });
  return map;
};

export const initialRoles: Role[] = [
  {
    id: 'role-approval',
    name: 'Approval',
    code: 'A001',
    status: 'Active',
    description: 'Senior reviewer authorized to approve workflows, waivers, licenses, and reconciliations.',
    userCount: 4,
    featurePermissions: createFeatureMap({
      amnesty_campaign: ['view', 'verify', 'approve'],
      audit_log: ['view', 'export'],
      bill_run: ['view', 'verify', 'approve'],
      cash_verification: ['view', 'verify', 'approve', 'resolve'],
      document_management: ['view', 'export'],
      party_registry: ['view', 'verify'],
      reconciliation: ['view', 'verify', 'approve', 'resolve'],
      reference_data: ['view'],
      report_officer_perf: ['view', 'export'],
      report_revenue: ['view', 'export'],
      service_definitions: ['view'],
      unmatched_payment: ['view', 'resolve'],
      waiver: ['view', 'verify', 'approve', 'resolve'],
    }),
    servicePermissions: {
      BIZ_AMENDMENT: ['view', 'review', 'approve', 'confirm', 'issue', 'expedite'],
      BIZ_LICENCE_ISSUE: ['view', 'review', 'approve', 'confirm', 'issue', 'print', 'reprint'],
      BIZ_NEW_REGISTRATION: ['view', 'review', 'approve', 'confirm', 'issue', 'expedite'],
      CIV_BIRTH_REGISTRATION: ['view', 'review', 'approve', 'confirm', 'issue', 'print', 'reprint'],
      RECONCILIATION_REVIEW: ['view', 'create', 'submit', 'accept', 'pass', 'verify', 'complete', 'review', 'approve', 'confirm', 'issue', 'collect', 'return', 'reject', 'cancel', 'print', 'reprint', 'attach', 'amend', 'expedite'],
      VEH_REGISTRATION: ['view', 'review', 'approve', 'confirm', 'issue', 'print', 'reprint'],
      WAIVER_APPROVAL: ['view', 'create', 'submit', 'accept', 'pass', 'verify', 'complete', 'review', 'approve', 'confirm', 'issue', 'collect', 'return', 'reject', 'cancel', 'print', 'reprint', 'attach', 'amend', 'expedite'],
    },
    reportScope: 'all',
    allowedReports: reportItems.map((r) => r.id),
  },
  {
    id: 'role-biz-reg',
    name: 'business registerer',
    code: 'BUSINESS_REGISTERE',
    status: 'Active',
    description: 'Front-desk commercial officer accepting, verifying, and indexing company registrations.',
    userCount: 6,
    featurePermissions: createFeatureMap({
      document_management: ['view', 'create', 'edit'],
      party_registry: ['view', 'create', 'edit'],
      print_invoice: ['view', 'use'],
      print_receipt: ['view', 'use'],
      reference_data: ['view'],
    }),
    servicePermissions: {
      BIZ_AMENDMENT: ['view', 'create', 'submit', 'accept', 'attach'],
      BIZ_LICENCE_ISSUE: ['view', 'create', 'submit', 'accept', 'attach'],
      BIZ_NEW_REGISTRATION: ['view', 'create', 'submit', 'accept', 'verify', 'attach'],
      CIV_BIRTH_REGISTRATION: [],
      RECONCILIATION_REVIEW: [],
      VEH_REGISTRATION: [],
      WAIVER_APPROVAL: [],
    },
    reportScope: 'specific',
    allowedReports: ['rep-06', 'rep-07'],
  },
  {
    id: 'role-civ-reg',
    name: 'Civil Registery',
    code: 'CIV01',
    status: 'Active',
    description: 'Vital records registrar logging births, civil status, and parentage records.',
    userCount: 8,
    featurePermissions: createFeatureMap({
      document_management: ['view', 'create', 'edit'],
      party_registry: ['view', 'create', 'edit'],
      print_invoice: ['view', 'use'],
      print_receipt: ['view', 'use'],
      reference_data: ['view'],
    }),
    servicePermissions: {
      BIZ_AMENDMENT: [],
      BIZ_LICENCE_ISSUE: [],
      BIZ_NEW_REGISTRATION: [],
      CIV_BIRTH_REGISTRATION: ['view', 'create', 'submit', 'accept', 'pass', 'verify', 'attach'],
      RECONCILIATION_REVIEW: [],
      VEH_REGISTRATION: [],
      WAIVER_APPROVAL: [],
    },
    reportScope: 'specific',
    allowedReports: ['rep-08'],
  },
  {
    id: 'role-appove-civ',
    name: 'Appove Civil Registry',
    code: 'CV012',
    status: 'Active',
    description: 'Civil status magistrate approving and verifying birth records and citizenship proofs.',
    userCount: 3,
    featurePermissions: createFeatureMap({
      document_management: ['view', 'export'],
      party_registry: ['view', 'verify'],
      reference_data: ['view'],
    }),
    servicePermissions: {
      BIZ_AMENDMENT: [],
      BIZ_LICENCE_ISSUE: [],
      BIZ_NEW_REGISTRATION: [],
      CIV_BIRTH_REGISTRATION: ['view', 'review', 'approve', 'confirm', 'issue'],
      RECONCILIATION_REVIEW: [],
      VEH_REGISTRATION: [],
      WAIVER_APPROVAL: [],
    },
    reportScope: 'specific',
    allowedReports: ['rep-08'],
  },
  {
    id: 'role-finance',
    name: 'Finance',
    code: 'FINANCE',
    status: 'Active',
    description: 'Treasury operations, daily cashier supervision, bill runs, and ledger accounting.',
    userCount: 5,
    featurePermissions: createFeatureMap({
      bill_run: ['view', 'create', 'edit', 'execute'],
      cash_session: ['view', 'open', 'close', 'verify'],
      cash_session_force_close: ['view', 'execute'],
      cash_verification: ['view', 'verify', 'resolve'],
      credit_transfer: ['view', 'create', 'execute'],
      payment_counter: ['view', 'collect', 'open', 'close'],
      print_invoice: ['view', 'use', 'export'],
      print_receipt: ['view', 'use', 'export'],
      reconciliation: ['view', 'create', 'verify', 'resolve', 'export'],
      report_revenue: ['view', 'export'],
      tariff_management: ['view', 'edit'],
      unmatched_payment: ['view', 'resolve'],
    }),
    servicePermissions: {
      BIZ_AMENDMENT: ['view', 'collect'],
      BIZ_LICENCE_ISSUE: ['view', 'collect'],
      BIZ_NEW_REGISTRATION: ['view', 'collect'],
      CIV_BIRTH_REGISTRATION: ['view', 'collect'],
      RECONCILIATION_REVIEW: ['view', 'create', 'submit', 'verify', 'complete', 'review', 'approve'],
      VEH_REGISTRATION: ['view', 'collect'],
      WAIVER_APPROVAL: ['view', 'verify'],
    },
    reportScope: 'all',
    allowedReports: ['rep-01', 'rep-02', 'rep-04', 'rep-10', 'rep-11'],
  },
  {
    id: 'role-issue-civ',
    name: 'Issue Civil Regsitry',
    code: 'I0021',
    status: 'Active',
    description: 'Official certificate print master and physical security credential dispatcher.',
    userCount: 4,
    featurePermissions: createFeatureMap({
      document_management: ['view', 'export'],
      party_registry: ['view'],
      print_receipt: ['view', 'use'],
      reference_data: ['view'],
    }),
    servicePermissions: {
      BIZ_AMENDMENT: [],
      BIZ_LICENCE_ISSUE: [],
      BIZ_NEW_REGISTRATION: [],
      CIV_BIRTH_REGISTRATION: ['view', 'complete', 'issue', 'print', 'reprint'],
      RECONCILIATION_REVIEW: [],
      VEH_REGISTRATION: [],
      WAIVER_APPROVAL: [],
    },
    reportScope: 'specific',
    allowedReports: ['rep-08'],
  },
  {
    id: 'role-veh-reg',
    name: 'Vehicle Register',
    code: 'PL0012',
    status: 'Active',
    description: 'Motor vehicle clerk handling automobile ownership registration and inspections.',
    userCount: 5,
    featurePermissions: createFeatureMap({
      document_management: ['view', 'create', 'edit'],
      mobile_inspection: ['view', 'create', 'verify'],
      party_registry: ['view', 'create', 'edit'],
      print_invoice: ['view', 'use'],
      print_receipt: ['view', 'use'],
      reference_data: ['view'],
    }),
    servicePermissions: {
      BIZ_AMENDMENT: [],
      BIZ_LICENCE_ISSUE: [],
      BIZ_NEW_REGISTRATION: [],
      CIV_BIRTH_REGISTRATION: [],
      RECONCILIATION_REVIEW: [],
      VEH_REGISTRATION: ['view', 'create', 'submit', 'accept', 'verify', 'attach'],
      WAIVER_APPROVAL: [],
    },
    reportScope: 'specific',
    allowedReports: ['rep-09'],
  },
  {
    id: 'role-civ-pay',
    name: 'Civil Registry Payment',
    code: 'PL01',
    status: 'Active',
    description: 'Dedicated cashier window for vital records issuance and certificate fee settlement.',
    userCount: 3,
    featurePermissions: createFeatureMap({
      cash_session: ['view', 'open', 'close'],
      payment_counter: ['view', 'collect', 'open', 'close'],
      print_invoice: ['view', 'use'],
      print_receipt: ['view', 'use'],
    }),
    servicePermissions: {
      BIZ_AMENDMENT: [],
      BIZ_LICENCE_ISSUE: [],
      BIZ_NEW_REGISTRATION: [],
      CIV_BIRTH_REGISTRATION: ['view', 'collect', 'print', 'reprint'],
      RECONCILIATION_REVIEW: [],
      VEH_REGISTRATION: [],
      WAIVER_APPROVAL: [],
    },
    reportScope: 'specific',
    allowedReports: ['rep-01', 'rep-08'],
  },
  {
    id: 'role-reg',
    name: 'Rgisterer',
    code: 'R001',
    status: 'Active',
    description: 'General front-desk multi-service registrar for walk-in public services.',
    userCount: 7,
    featurePermissions: createFeatureMap({
      document_management: ['view', 'create', 'edit'],
      party_registry: ['view', 'create', 'edit'],
      print_invoice: ['view', 'use'],
      print_receipt: ['view', 'use'],
      reference_data: ['view'],
    }),
    servicePermissions: {
      BIZ_AMENDMENT: ['view', 'create', 'submit', 'accept'],
      BIZ_LICENCE_ISSUE: ['view', 'create', 'submit', 'accept'],
      BIZ_NEW_REGISTRATION: ['view', 'create', 'submit', 'accept'],
      CIV_BIRTH_REGISTRATION: ['view', 'create', 'submit', 'accept'],
      RECONCILIATION_REVIEW: [],
      VEH_REGISTRATION: ['view', 'create', 'submit', 'accept'],
      WAIVER_APPROVAL: [],
    },
    reportScope: 'specific',
    allowedReports: ['rep-06', 'rep-07', 'rep-08', 'rep-09'],
  },
  {
    id: 'role-super-admin',
    name: 'Super Administrator',
    code: 'SUPER_ADMIN',
    isSystem: true,
    status: 'Active',
    description: 'Root system administrator with unrestricted privileges across all features, services, and reports.',
    userCount: 2,
    featurePermissions: createAllFeaturesGranted(),
    servicePermissions: createAllServicesGranted(),
    reportScope: 'all',
    allowedReports: reportItems.map((r) => r.id),
  },
  {
    id: 'role-biz-lic-reg',
    name: 'Business Licence Registerer',
    code: 'V1',
    status: 'Active',
    description: 'Commercial registry officer issuing and printing trade licenses and permits.',
    userCount: 4,
    featurePermissions: createFeatureMap({
      document_management: ['view', 'create', 'edit', 'export'],
      party_registry: ['view', 'create', 'edit'],
      print_invoice: ['view', 'use'],
      print_receipt: ['view', 'use'],
      reference_data: ['view'],
    }),
    servicePermissions: {
      BIZ_AMENDMENT: ['view', 'create', 'submit', 'accept', 'issue', 'print', 'reprint'],
      BIZ_LICENCE_ISSUE: ['view', 'create', 'submit', 'accept', 'issue', 'print', 'reprint'],
      BIZ_NEW_REGISTRATION: ['view', 'create', 'submit', 'accept', 'issue', 'print', 'reprint'],
      CIV_BIRTH_REGISTRATION: [],
      RECONCILIATION_REVIEW: [],
      VEH_REGISTRATION: [],
      WAIVER_APPROVAL: [],
    },
    reportScope: 'specific',
    allowedReports: ['rep-06', 'rep-07'],
  },
  {
    id: 'role-veh-approver',
    name: 'Vehicle Approver',
    code: 'VEHICLE_APPROVER',
    status: 'Active',
    description: 'Transport directorate officer validating vehicle ownership titles and roadworthiness.',
    userCount: 3,
    featurePermissions: createFeatureMap({
      document_management: ['view', 'export'],
      mobile_inspection: ['view', 'verify', 'approve'],
      party_registry: ['view', 'verify'],
      reference_data: ['view'],
    }),
    servicePermissions: {
      BIZ_AMENDMENT: [],
      BIZ_LICENCE_ISSUE: [],
      BIZ_NEW_REGISTRATION: [],
      CIV_BIRTH_REGISTRATION: [],
      RECONCILIATION_REVIEW: [],
      VEH_REGISTRATION: ['view', 'review', 'approve', 'confirm', 'issue', 'print', 'reprint'],
      WAIVER_APPROVAL: [],
    },
    reportScope: 'specific',
    allowedReports: ['rep-09'],
  },
  {
    id: 'role-veh-money',
    name: 'Vehicle Money Collector',
    code: 'VEHICLE_MONAEY_COLLECTOR',
    status: 'Active',
    description: 'Payment teller dedicated to road licensing fees, plate tariffs, and transfer charges.',
    userCount: 3,
    featurePermissions: createFeatureMap({
      cash_session: ['view', 'open', 'close'],
      payment_counter: ['view', 'collect', 'open', 'close'],
      print_invoice: ['view', 'use'],
      print_receipt: ['view', 'use'],
    }),
    servicePermissions: {
      BIZ_AMENDMENT: [],
      BIZ_LICENCE_ISSUE: [],
      BIZ_NEW_REGISTRATION: [],
      CIV_BIRTH_REGISTRATION: [],
      RECONCILIATION_REVIEW: [],
      VEH_REGISTRATION: ['view', 'collect', 'print', 'reprint'],
      WAIVER_APPROVAL: [],
    },
    reportScope: 'specific',
    allowedReports: ['rep-01', 'rep-09'],
  },
];
