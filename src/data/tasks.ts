import type { InboxTask } from '../types/registry';

export const inboxTasks: InboxTask[] = [
{
  id: 'task-1',
  queue: 'office',
  reference: 'CIV_BIRTH_REGISTRATION-2026-000005',
  serviceName: 'Birth registration',
  step: 'Document review',
  applicant: 'Halima Hasan Gure',
  waitingDays: 3,
  dueLabel: 'Due today'
},
{
  id: 'task-2',
  queue: 'office',
  reference: 'CIV_BIRTH_REGISTRATION-2026-000003',
  serviceName: 'Birth registration',
  step: 'Verification',
  applicant: 'Halima Hasan Gure',
  waitingDays: 27,
  dueLabel: 'Overdue'
}];