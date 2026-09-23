export type ServiceCategory = 'business' | 'civil' | 'vehicle';

export interface Service {
  id: string;
  name: string;
  code: string;
  category: ServiceCategory;
  description: string;
}

export type CaseState =
'draft' |
'open' |
'pending_payment' |
'review' |
'approved' |
'issued' |
'rejected' |
'cancelled';

export type CaseStatus = 'OPEN' | 'COMPLETED' | 'CANCELLED';

export type CaseChannel = 'citizen' | 'internal';

export interface CaseEvent {
  label: string;
  at: string;
  actor: string;
}

export interface CaseDocument {
  name: string;
  received: boolean;
}

export interface Application {
  id: string;
  reference: string;
  serviceCode: string;
  serviceName: string;
  state: CaseState;
  status: CaseStatus;
  submittedAt: string;
  submittedOn: number;
  channel: CaseChannel;
  applicant: string;
  applicantPartyId: string;
  location: string;
  fee: number;
  feePaid: boolean;
  assignee: string | null;
  currentStep: string;
  events: CaseEvent[];
  documents: CaseDocument[];
}

export type TaskQueue = 'mine' | 'office' | 'internal';

export interface InboxTask {
  id: string;
  queue: TaskQueue;
  reference: string;
  serviceName: string;
  step: string;
  applicant: string;
  waitingDays: number;
  dueLabel: string;
}

export type PartyType = 'IND' | 'ORG';

export type PartyState = 'ACTIVE' | 'MERGED' | 'INACTIVE';

export interface PartyIdentifier {
  type: string;
  number: string;
}

export interface Party {
  id: string;
  name: string;
  type: PartyType;
  identifiers: PartyIdentifier[];
  phone: string;
  altPhone: string | null;
  email: string | null;
  preferredChannel: string;
  location: string;
  address: string;
  state: PartyState;
  status: string | null;
  registeredAt: string;
  caseReferences: string[];
}