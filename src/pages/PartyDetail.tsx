import { Link, Navigate, useParams } from 'react-router-dom';
import {
  ArrowRightIcon,
  GitMergeIcon,
  PencilIcon,
  SendIcon } from
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
import { parties } from '../data/parties';
import { applications } from '../data/applications';

export function PartyDetail() {
  const { id } = useParams<{id: string;}>();
  const party = parties.find((item) => item.id === id);

  if (!party) return <Navigate to="/parties" replace />;

  const cases = applications.filter((app) => app.applicantPartyId === party.id);
  const openCases = cases.filter((item) => item.status === 'OPEN');

  return (
    <section
      aria-label="Party record"
      className="no-scrollbar min-h-0 flex-1 overflow-y-auto pr-1">
      
      <div className="pb-2">
        <RecordCard>
          <RecordHeader
            backTo="/parties"
            backLabel="Parties"
            eyebrow={party.type === 'IND' ? 'Individual' : 'Organisation'}
            title={party.name}
            meta={[
            <span className="inline-flex items-center rounded-full bg-emerald-50 px-2.5 py-0.5 font-mono text-meta font-semibold text-success ring-1 ring-emerald-200">
                {party.state}
              </span>,
            <span className="text-body text-muted">
                Registered {party.registeredAt}
              </span>,
            <span className="text-body text-muted">
                {cases.length} {cases.length === 1 ? 'case' : 'cases'}
                {openCases.length > 0 ? ` · ${openCases.length} open` : ''}
              </span>]
            }
            actions={
            <>
                <Button>
                  <PencilIcon className="h-4 w-4" strokeWidth={1.75} />
                  Edit record
                </Button>
                <Button variant="secondary">
                  <GitMergeIcon className="h-4 w-4" strokeWidth={1.75} />
                  Merge
                </Button>
              </>
            } />
          

          <RecordBody>
            <RecordColumn>
              <RecordSection title="Identity">
                <dl className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                  <Fact label="Full name" value={party.name} />
                  <Fact
                    label="Type"
                    value={party.type === 'IND' ? 'Individual' : 'Organisation'} />
                  
                  <Fact label="State" value={party.state} />
                  {party.identifiers.map((identifier) =>
                  <Fact
                    key={identifier.number}
                    label={identifier.type}
                    value={
                    <span className="break-all font-mono text-meta">
                          {identifier.number}
                        </span>
                    } />

                  )}
                </dl>
              </RecordSection>

              <RecordSection title="Contact">
                <dl className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                  <Fact
                    label="Phone"
                    value={
                    <span className="font-mono text-meta">{party.phone}</span>
                    } />
                  
                  <Fact
                    label="Alternative phone"
                    value={
                    party.altPhone === null ?
                    '—' :

                    <span className="font-mono text-meta">
                          {party.altPhone}
                        </span>

                    } />
                  
                  <Fact label="Email" value={party.email ?? '—'} />
                  <Fact label="Preferred channel" value={party.preferredChannel} />
                  <Fact label="Location" value={party.location} />
                  <Fact label="Address" value={party.address} />
                </dl>
              </RecordSection>

              <RecordSection title={`Cases (${cases.length})`}>
                {cases.length === 0 ?
                <p className="text-body text-muted">
                    No cases have been filed for this party.
                  </p> :

                <ul className="grid gap-x-8 gap-y-0 sm:grid-cols-2">
                    {cases.map((item) =>
                  <li key={item.id} className="rounded-lg border border-hairline bg-surface/35">
                        <Link
                      to={`/applications/${item.id}`}
                      className="group flex items-center justify-between gap-4 px-3.5 py-3.5 transition-colors duration-150 ease-standard hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">
                      
                          <span className="min-w-0">
                            <span className="block text-body font-semibold text-ink group-hover:text-primary transition-colors duration-150">
                              {item.serviceName}
                            </span>
                            <span className="mt-0.5 block break-all font-mono text-meta text-primary/70">
                              {item.reference}
                            </span>
                          </span>
                          <span className="flex shrink-0 items-center gap-2">
                            <span className="inline-flex items-center rounded-full border border-hairline bg-surface/80 px-2 py-0.5 font-mono text-meta text-muted">
                              {item.status}
                            </span>
                            <ArrowRightIcon
                          className="h-4 w-4 text-muted transition-all duration-150 ease-standard group-hover:translate-x-1 group-hover:text-primary"
                          strokeWidth={1.75} />
                        
                          </span>
                        </Link>
                      </li>
                  )}
                  </ul>
                }
              </RecordSection>
            </RecordColumn>

            <RecordColumn side>
              <RecordSection title="Register">
                <div className="rounded-xl border border-hairline bg-surface/30 p-4">
                <dl className="space-y-4">
                  <Fact label="Registered" value={party.registeredAt} />
                  <Fact label="Party id" value={
                  <span className="font-mono text-meta">{party.id}</span>
                  } />
                  <Fact
                    label="Open cases"
                    value={openCases.length === 0 ? 'None' : openCases.length} />
                  
                </dl>
                </div>
              </RecordSection>

              <RecordSection title="Notices">
                <div className="rounded-xl border border-primary/15 bg-primaryLight/40 p-4">
                <p className="text-body text-muted">
                  Notices and receipts are sent by {party.preferredChannel} to{' '}
                  <span className="font-mono text-meta text-ink">
                    {party.phone}
                  </span>
                  .
                </p>
                <Button variant="secondary" className="mt-4 w-full">
                  <SendIcon className="h-4 w-4" strokeWidth={1.75} />
                  Send a notice
                </Button>
                </div>
              </RecordSection>
            </RecordColumn>
          </RecordBody>
        </RecordCard>
      </div>
    </section>);

}