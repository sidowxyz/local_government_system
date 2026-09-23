export type UserStatus = 'Active' | 'Inactive';
export type ScopeAccess = 'No access' | 'Own office' | 'All offices';

export interface AdminUser {
  id: string;
  name: string;
  phone: string;
  roles: string[];
  status: UserStatus;
  lastSignedIn: string;
  lastSignedInSortKey: number;
  scopes?: Record<string, ScopeAccess>;
}

export const departmentList = [
  'Administration',
  'Business License Section',
  'business registion',
  'Civil Registry',
  'Department One',
  'Department Two',
  'Department Three',
  'Transport & development divsion',
];

export const defaultBashirScopes: Record<string, ScopeAccess> = {
  'Administration': 'No access',
  'Business License Section': 'Own office',
  'business registion': 'Own office',
  'Civil Registry': 'Own office',
  'Department One': 'No access',
  'Department Two': 'No access',
  'Department Three': 'No access',
  'Transport & development divsion': 'Own office',
};

export const adminUsers: AdminUser[] = [
  {
    id: 'usr-1',
    name: 'Bashir Ahmed Mohamud',
    phone: '+252615678',
    roles: ['Registerer'],
    status: 'Active',
    lastSignedIn: '22 Sept 2026, 10:34',
    lastSignedInSortKey: 202609221034,
  },
  {
    id: 'usr-2',
    name: 'Jimale Ahmed',
    phone: '+25261949',
    roles: ['Approval'],
    status: 'Active',
    lastSignedIn: '22 Sept 2026, 10:44',
    lastSignedInSortKey: 202609221044,
  },
  {
    id: 'usr-3',
    name: 'Mohamed Ahmed',
    phone: '+2526856278',
    roles: ['Finance'],
    status: 'Active',
    lastSignedIn: '13 Sept 2026, 13:03',
    lastSignedInSortKey: 202609131303,
  },
  {
    id: 'usr-4',
    name: 'Mohamed Sharif Abdullahi',
    phone: '+252615318669',
    roles: [
      'business registerer',
      'Civil Registery',
      'Appove Civil Registry',
      'Finance',
      'Issue Civil Regsitry',
      'Vehicle Register',
      'Civil Registry Payment',
      'Business Licence Registerer',
      'Vehicle Approver',
      'Vehicle Money Collector',
    ],
    status: 'Active',
    lastSignedIn: '09 Sept 2026, 09:07',
    lastSignedInSortKey: 202609090907,
  },
  {
    id: 'usr-5',
    name: 'System Administrator',
    phone: '+2526100000',
    roles: ['Super Administrator'],
    status: 'Active',
    lastSignedIn: '22 Sept 2026, 10:51',
    lastSignedInSortKey: 202609221051,
  },
  {
    id: 'usr-6',
    name: 'mumin',
    phone: '+2526133333',
    roles: ['business registerer'],
    status: 'Active',
    lastSignedIn: '18 Aug 2026, 15:29',
    lastSignedInSortKey: 202608181529,
  },
  {
    id: 'usr-7',
    name: 'reoorid',
    phone: '+2526139000',
    roles: ['None'],
    status: 'Active',
    lastSignedIn: '05 Sept 2026, 14:21',
    lastSignedInSortKey: 202609051421,
  },
  {
    id: 'usr-8',
    name: 'vechicle registerar',
    phone: '+2526122302',
    roles: ['Vehicle Register'],
    status: 'Active',
    lastSignedIn: '07 Sept 2026, 08:42',
    lastSignedInSortKey: 202609070842,
  },
];

export const allUserRoles = [
  ...new Set(adminUsers.flatMap((u) => u.roles).filter((r) => r !== 'None')),
];
