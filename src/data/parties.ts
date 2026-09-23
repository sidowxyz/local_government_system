import type { Party, PartyState } from '../types/registry';

export const partyStates: PartyState[] = ['ACTIVE', 'MERGED', 'INACTIVE'];

export const parties: Party[] = [
{
  id: 'party-1',
  name: 'Bashir Ahmed Mohamud',
  type: 'IND',
  identifiers: [{ type: 'National ID', number: '1215454' }],
  phone: '+252615096278',
  altPhone: null,
  email: 'bashir.mohamud@example.so',
  preferredChannel: 'SMS',
  location: 'Banadir — Hodan — Taleh',
  address: 'Behind the district office, Taleh',
  state: 'ACTIVE',
  status: null,
  registeredAt: '11 Mar 2024',
  caseReferences: [
  'VEH_REGISTRATION-2026-000002',
  'VEH_REGISTRATION-2026-000001']

},
{
  id: 'party-2',
  name: 'Halima Hasan Gure',
  type: 'IND',
  identifiers: [{ type: 'National ID', number: '122545454545' }],
  phone: '+252615096278',
  altPhone: '+252611220034',
  email: null,
  preferredChannel: 'SMS',
  location: 'Banadir — Waaberi — Sheikh Ali',
  address: 'Second road past the market, Sheikh Ali',
  state: 'ACTIVE',
  status: null,
  registeredAt: '2 Nov 2023',
  caseReferences: [
  'CIV_BIRTH_REGISTRATION-2026-000005',
  'CIV_BIRTH_REGISTRATION-2026-000003',
  'CIV_BIRTH_REGISTRATION-2026-000002',
  'CIV_BIRTH_REGISTRATION-2026-000001']

}];