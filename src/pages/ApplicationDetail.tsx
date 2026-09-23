import { Link, Navigate, useParams } from 'react-router-dom';
import {
  ArrowUpRightIcon,
  ArrowRightIcon,
  BanknoteIcon,
  DownloadIcon,
  PrinterIcon,
  UserCheckIcon } from
'../components/icons';
import { Button } from '../components/Button';
import {
  RecordCard,
  RecordHeader,
  RecordBody,
  RecordColumn,
  RecordSection,
  Fact } from
'../components/RecordCard';
import { Timeline } from '../components/Timeline';
import {
  CaseStateCell,
  StatusBadge,
  PaymentBadge } from
'../components/CaseStateCell';
import { applications } from '../data/applications';
import { parties } from '../data/parties';

export function ApplicationDetail() {
  const { id } = useParams<{id: string;}>();
  const application = applications.find((app) => app.id === id);

  if (!application) return <Navigate to="/applications" replace />;

  const party = parties.find((item) => item.id === application.applicantPartyId);
  const missingDocuments = application.documents.filter((doc) => !doc.received);
  const feeApplicable = application.fee > 0;

  return (
    <section
      aria-label="Case record"
      className="no-scrollbar min-h-0 flex-1 overflow-y-auto pr-1">
      
      <div className="pb-2">
        <RecordCard>
          <RecordHeader
            backTo="/applications"
            backLabel="Applications"
            eyebrow={
            <span className="break-all font-mono text-[11px] font-medium uppercase tracking-[0.07em] text-primary/80">{application.reference}</span>
            }
            title={application.serviceName}
            meta={[
            <CaseStateCell
              state={application.state}
              status={application.status}
              sentenceCase />,

            <StatusBadge status={application.status} />,
            <span className="text-body text-muted">
                Submitted {application.submittedAt}
              </span>]
            }
            actions={
            application.status === 'OPEN' ?
            <>
                  <Button>
                    Advance step
                    <ArrowRightIcon className="h-4 w-4" strokeWidth={1.75} />
                  </Button>
                  <Button variant="secondary">
                    <UserCheckIcon className="h-4 w-4" strokeWidth={1.75} />
                    {application.assignee === null ? 'Assign to me' : 'Reassign'}
                  </Button>
                </> :

            <Button variant="secondary">
                  <PrinterIcon className="h-4 w-4" strokeWidth={1.75} />
                  Print certificate
                </Button>

            } />
          

          <RecordBody>
            <RecordColumn>
              <RecordSection title="Case">
                <dl className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                  <Fact label="Current step" value={application.currentStep} />
                  <Fact
                    label="Assigned to"
                    value={application.assignee ?? 'Unassigned'} />
                  
                  <Fact
                    label="Channel"
                    value={
                    application.channel === 'citizen' ?
                    'Citizen case' :
                    'Internal case'
                    } />
                  
                  <Fact
                    label="Service code"
                    value={
                    <span className="break-all font-mono text-meta">
                        {application.serviceCode}
                      </span>
                    } />
                  
                  <Fact label="Submitted" value={application.submittedAt} />
                  <Fact label="Location" value={application.location} />
                </dl>
              </RecordSection>

              <RecordSection
                title="Applicant"
                action={
                party ?
                <Link
                  to={`/parties/${party.id}`}
                  className="inline-flex items-center gap-1 rounded-md text-body text-muted transition-colors duration-150 ease-standard hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">
                  
                      Open party record
                      <ArrowUpRightIcon
                    className="h-3.5 w-3.5"
                    strokeWidth={1.75} />
                  
                    </Link> :
                undefined
                }>
                
                <dl className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                  <Fact label="Party" value={application.applicant} />
                  <Fact
                    label="Phone"
                    value={
                    party ?
                    <span className="font-mono text-meta">
                          {party.phone}
                        </span> :

                    '—'

                    } />
                  
                  <Fact
                    label="Identifier"
                    value={
                    party?.identifiers[0] ?
                    <span className="font-mono text-meta">
                          {party.identifiers[0].number}
                        </span> :

                    '—'

                    } />
                  
                  <Fact
                    label="Preferred channel"
                    value={party?.preferredChannel ?? '—'} />
                  
                  <Fact label="Address" value={party?.address ?? '—'} />
                </dl>
              </RecordSection>

              <RecordSection
                title="Documents"
                action={
                <span
                  className={[
                  'text-meta',
                  missingDocuments.length > 0 ?
                  'text-danger' :
                  'text-muted'].
                  join(' ')}>
                  
                    {missingDocuments.length > 0 ?
                  `${missingDocuments.length} missing` :
                  'All received'}
                  </span>
                }>
                
                <ul className="grid gap-x-8 sm:grid-cols-2">
                  {application.documents.map((doc) =>
                  <li
                    key={doc.name}
                    className="flex items-center justify-between gap-4 rounded-lg border border-hairline bg-surface/35 px-3.5 py-3">
                    
                      <span className="min-w-0 text-body font-medium text-ink">
                        {doc.name}
                      </span>
                      {doc.received ?
                    <button
                      type="button"
                      className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-meta font-medium text-emerald-700 ring-1 ring-emerald-200 transition-colors duration-150 ease-standard hover:bg-emerald-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">
                      
                          <DownloadIcon className="h-3 w-3" strokeWidth={2} />
                          Received
                        </button> :

                    <span className="inline-flex shrink-0 items-center rounded-full bg-red-50 px-2.5 py-1 text-meta font-medium text-danger ring-1 ring-red-200">
                          Missing
                        </span>
                    }
                    </li>
                  )}
                </ul>
              </RecordSection>
            </RecordColumn>

            <RecordColumn side>
              <RecordSection title="Fee">
                <div className="rounded-xl border border-primary/15 bg-primaryLight/40 p-4">
                  <dl className="flex items-end justify-between gap-4">
                    <div>
                      <dt className="text-[11px] font-semibold uppercase tracking-[0.07em] text-muted/80">Amount</dt>
                      <dd className="mt-1.5 text-display font-bold tracking-tight text-ink">
                        {feeApplicable ? `$${application.fee}` : <span className="text-lead font-medium text-muted">No fee</span>}
                      </dd>
                    </div>
                    <div className="text-right">
                      <dt className="text-[11px] font-semibold uppercase tracking-[0.07em] text-muted/80">Payment</dt>
                      <dd className="mt-1.5">
                        <PaymentBadge
                          paid={application.feePaid}
                          applicable={feeApplicable} />
                      </dd>
                    </div>
                  </dl>
                </div>
                {feeApplicable && !application.feePaid ?
                <Button className="mt-5 w-full">
                    <BanknoteIcon className="h-4 w-4" strokeWidth={1.75} />
                    Record payment
                  </Button> :
                null}
              </RecordSection>

              <RecordSection title="History">
                <div className="rounded-xl border border-hairline bg-surface/30 px-4 py-4">
                  <Timeline events={application.events} />
                </div>
              </RecordSection>
            </RecordColumn>
          </RecordBody>
        </RecordCard>
      </div>
    </section>);

}