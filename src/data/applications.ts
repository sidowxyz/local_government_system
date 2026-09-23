import type { Application, CaseState } from '../types/registry';

export const caseStates: CaseState[] = [
'draft',
'open',
'pending_payment',
'review',
'approved',
'issued',
'rejected',
'cancelled'];


export const applications: Application[] = [
{
  id: 'app-1',
  reference: 'VEH_REGISTRATION-2026-000002',
  serviceCode: 'VEH_REGISTRATION',
  serviceName: 'Vehicle registration',
  state: 'issued',
  status: 'COMPLETED',
  submittedAt: '14 Sept 2026',
  submittedOn: 20260914,
  channel: 'citizen',
  applicant: 'Bashir Ahmed Mohamud',
  applicantPartyId: 'party-1',
  location: 'Banadir — Hodan — Taleh',
  fee: 85,
  feePaid: true,
  assignee: 'Bashir Ahmed Mohamud',
  currentStep: 'Closed',
  events: [
  { label: 'Application submitted', at: '14 Sept 2026', actor: 'Front desk' },
  { label: 'Fee paid — $85', at: '14 Sept 2026', actor: 'Cashier' },
  { label: 'Plate issued', at: '14 Sept 2026', actor: 'Registrar' }],

  documents: [
  { name: 'Owner identification', received: true },
  { name: 'Import declaration', received: true }]

},
{
  id: 'app-2',
  reference: 'CIV_BIRTH_REGISTRATION-2026-000005',
  serviceCode: 'CIV_BIRTH_REGISTRATION',
  serviceName: 'Birth registration',
  state: 'review',
  status: 'OPEN',
  submittedAt: '12 Sept 2026',
  submittedOn: 20260912,
  channel: 'citizen',
  applicant: 'Halima Hasan Gure',
  applicantPartyId: 'party-2',
  location: 'Banadir — Waaberi — Sheikh Ali',
  fee: 0,
  feePaid: true,
  assignee: null,
  currentStep: 'Document review',
  events: [
  { label: 'Application submitted', at: '12 Sept 2026', actor: 'Front desk' },
  { label: 'Sent to document review', at: '12 Sept 2026', actor: 'System' }],

  documents: [
  { name: 'Notification of birth', received: true },
  { name: "Mother's identification", received: false }]

},
{
  id: 'app-3',
  reference: 'VEH_REGISTRATION-2026-000001',
  serviceCode: 'VEH_REGISTRATION',
  serviceName: 'Vehicle registration',
  state: 'issued',
  status: 'COMPLETED',
  submittedAt: '12 Sept 2026',
  submittedOn: 20260912,
  channel: 'citizen',
  applicant: 'Bashir Ahmed Mohamud',
  applicantPartyId: 'party-1',
  location: 'Banadir — Hodan — Wadnaha',
  fee: 85,
  feePaid: true,
  assignee: 'Bashir Ahmed Mohamud',
  currentStep: 'Closed',
  events: [
  { label: 'Application submitted', at: '12 Sept 2026', actor: 'Front desk' },
  { label: 'Fee paid — $85', at: '12 Sept 2026', actor: 'Cashier' },
  { label: 'Plate issued', at: '12 Sept 2026', actor: 'Registrar' }],

  documents: [{ name: 'Owner identification', received: true }]
},
{
  id: 'app-4',
  reference: 'CIV_BIRTH_REGISTRATION-2026-000003',
  serviceCode: 'CIV_BIRTH_REGISTRATION',
  serviceName: 'Birth registration',
  state: 'review',
  status: 'OPEN',
  submittedAt: '19 Aug 2026',
  submittedOn: 20260819,
  channel: 'citizen',
  applicant: 'Halima Hasan Gure',
  applicantPartyId: 'party-2',
  location: 'Banadir — Waaberi — Bulsho',
  fee: 0,
  feePaid: true,
  assignee: 'Bashir Ahmed Mohamud',
  currentStep: 'Verification',
  events: [
  { label: 'Application submitted', at: '19 Aug 2026', actor: 'Front desk' },
  { label: 'Claimed for review', at: '20 Aug 2026', actor: 'Bashir Ahmed Mohamud' }],

  documents: [
  { name: 'Notification of birth', received: true },
  { name: 'Declarant identification', received: true }]

},
{
  id: 'app-5',
  reference: 'CIV_BIRTH_REGISTRATION-2026-000002',
  serviceCode: 'CIV_BIRTH_REGISTRATION',
  serviceName: 'Birth registration',
  state: 'cancelled',
  status: 'CANCELLED',
  submittedAt: '16 Aug 2026',
  submittedOn: 20260816,
  channel: 'citizen',
  applicant: 'Halima Hasan Gure',
  applicantPartyId: 'party-2',
  location: 'Banadir — Waaberi — Horseed',
  fee: 0,
  feePaid: false,
  assignee: null,
  currentStep: 'Cancelled',
  events: [
  { label: 'Application submitted', at: '16 Aug 2026', actor: 'Front desk' },
  {
    label: 'Cancelled — duplicate of 000001',
    at: '18 Aug 2026',
    actor: 'Registrar'
  }],

  documents: [{ name: 'Notification of birth', received: true }]
},
{
  id: 'app-6',
  reference: 'CIV_BIRTH_REGISTRATION-2026-000001',
  serviceCode: 'CIV_BIRTH_REGISTRATION',
  serviceName: 'Birth registration',
  state: 'issued',
  status: 'COMPLETED',
  submittedAt: '16 Aug 2026',
  submittedOn: 20260816,
  channel: 'citizen',
  applicant: 'Halima Hasan Gure',
  applicantPartyId: 'party-2',
  location: 'Banadir — Waaberi — Sheikh Ali',
  fee: 0,
  feePaid: true,
  assignee: 'Bashir Ahmed Mohamud',
  currentStep: 'Closed',
  events: [
  { label: 'Application submitted', at: '16 Aug 2026', actor: 'Front desk' },
  { label: 'Certificate issued', at: '17 Aug 2026', actor: 'Registrar' }],

  documents: [
  { name: 'Notification of birth', received: true },
  { name: 'Declarant identification', received: true }]

}];