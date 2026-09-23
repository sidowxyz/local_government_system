export type LocationType = 'DISTRICT' | 'SUB_DISTRICT' | 'SECTION' | 'ZONE';

export interface LocationItem {
  id: string;
  name: string;
  nameSomali?: string;
  code: string;
  type: LocationType;
  order?: number;
}

export interface DepartmentItem {
  id: string;
  name: string;
  nameSomali?: string;
  code: string;
}

export interface OfficeItem {
  id: string;
  name: string;
  nameSomali?: string;
  code: string;
  departmentCode: string;
  departmentName: string;
  locationCode?: string;
  locationName?: string;
  parentOfficeCode?: string;
  physicalAddress?: string;
}

export const initialLocations: LocationItem[] = [
  {
    id: 'loc-1',
    name: 'Garasbaaley',
    nameSomali: 'Garasbaaley',
    code: 'GR001',
    type: 'DISTRICT',
    order: 1,
  },
  {
    id: 'loc-2',
    name: 'Galmudug',
    nameSomali: 'Galmudug',
    code: 'GL001',
    type: 'SUB_DISTRICT',
    order: 2,
  },
  {
    id: 'loc-3',
    name: 'Hodan',
    nameSomali: 'Hodan',
    code: 'H001',
    type: 'DISTRICT',
    order: 3,
  },
  {
    id: 'loc-4',
    name: 'October',
    nameSomali: 'Oktoobar',
    code: 'H0012',
    type: 'SUB_DISTRICT',
    order: 4,
  },
  {
    id: 'loc-5',
    name: 'Tare_biyano',
    nameSomali: 'Taar-biyano',
    code: 'TAREBIYANO',
    type: 'SECTION',
    order: 5,
  },
  {
    id: 'loc-6',
    name: 'Howl_wadaag',
    nameSomali: 'Howlwadaag',
    code: 'HOWL_WADAAG',
    type: 'DISTRICT',
    order: 6,
  },
  {
    id: 'loc-7',
    name: 'Waberi',
    nameSomali: 'Waaberi',
    code: 'WB001',
    type: 'DISTRICT',
    order: 7,
  },
];

export const initialDepartments: DepartmentItem[] = [
  {
    id: 'dept-1',
    name: 'Administration',
    nameSomali: 'Maamulka',
    code: 'ADMIN',
  },
  {
    id: 'dept-2',
    name: 'Business License Section',
    nameSomali: 'Qeybta Shatiyada Ganacsiga',
    code: 'BS001',
  },
  {
    id: 'dept-3',
    name: 'business registion',
    nameSomali: 'Diiwaangelinta Ganacsiga',
    code: 'BUSINESS_REGISRATION',
  },
  {
    id: 'dept-4',
    name: 'Civil Registry',
    nameSomali: 'Diiwaanka Dadweynaha',
    code: 'C01',
  },
  {
    id: 'dept-5',
    name: 'Department One',
    nameSomali: 'Waaxda Kowaad',
    code: 'DEPART_1',
  },
  {
    id: 'dept-6',
    name: 'Department Two',
    nameSomali: 'Waaxda Labaad',
    code: 'DEPART_2',
  },
];

export const initialOffices: OfficeItem[] = [
  {
    id: 'off-1',
    name: 'Hodan office',
    nameSomali: 'Xafiiska Hodan',
    code: 'H01',
    departmentCode: 'C01',
    departmentName: 'Civil Registry',
    locationCode: 'H001',
    locationName: 'Hodan',
    physicalAddress: 'Wadada Maka Al-Mukarama, Hodan',
  },
  {
    id: 'off-2',
    name: 'hodan',
    nameSomali: 'Hodan',
    code: 'HODNA_DISTECT',
    departmentCode: 'BUSINESS_REGISRATION',
    departmentName: 'business registion',
    locationCode: 'H001',
    locationName: 'Hodan',
    physicalAddress: 'Sayidka Junction, Hodan',
  },
  {
    id: 'off-3',
    name: 'holwadaaf',
    nameSomali: 'Howlwadaag',
    code: 'HOWADAAG',
    departmentCode: 'C01',
    departmentName: 'Civil Registry',
    locationCode: 'HOWL_WADAAG',
    locationName: 'Howl_wadaag',
    physicalAddress: 'Bakaara Market Road, Howlwadaag',
  },
  {
    id: 'off-4',
    name: 'Headquarters',
    nameSomali: 'Xarunta Guud',
    code: 'HQ',
    departmentCode: 'ADMIN',
    departmentName: 'Administration',
    physicalAddress: 'Municipal Central Hall, Mogadishu',
  },
  {
    id: 'off-5',
    name: 'Garasbaaley',
    nameSomali: 'Garasbaaley',
    code: 'OF0012',
    departmentCode: 'BS001',
    departmentName: 'Business License Section',
    locationCode: 'GR001',
    locationName: 'Garasbaaley',
    physicalAddress: 'Main Afgooye Road, Garasbaaley',
  },
  {
    id: 'off-6',
    name: 'Tare_biyan Ofiice',
    nameSomali: 'Xafiiska Taar-biyano',
    code: 'OFFCIE_1',
    departmentCode: 'DEPART_1',
    departmentName: 'Department One',
    locationCode: 'TAREBIYANO',
    locationName: 'Tare_biyano',
    physicalAddress: 'Tarebiyano Section 4',
  },
  {
    id: 'off-7',
    name: 'Seybinayo',
    nameSomali: 'Seybiyaano',
    code: 'OFFCIE_2',
    departmentCode: 'DEPART_1',
    departmentName: 'Department One',
    physicalAddress: 'Seybiyano Centre',
  },
];
