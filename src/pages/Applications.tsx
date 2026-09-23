import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PlusIcon, SearchIcon } from '../components/icons';
import { SelectFilter } from '../components/SelectFilter';
import { EmptyState } from '../components/EmptyState';
import { SortHeader, type SortDirection } from '../components/SortHeader';
import { CaseStateCell, CaseStatusCell } from '../components/CaseStateCell';
import { Button } from '../components/Button';
import { applications, caseStates } from '../data/applications';
import { services } from '../data/services';
import type { Application } from '../types/registry';
import { useScreenInit } from '../useScreenInit.js';

type SortKey =
'reference' |
'applicant' |
'state' |
'status' |
'submittedOn' |
'fee';

const headerClasses =
'px-5 py-3 text-meta font-medium uppercase tracking-[0.06em] text-muted';

function compare(a: Application, b: Application, key: SortKey): number {
  if (key === 'submittedOn') return a.submittedOn - b.submittedOn;
  if (key === 'fee') return a.fee - b.fee;
  return String(a[key]).localeCompare(String(b[key]));
}

export function Applications() {
  const screenInit = useScreenInit();
  const navigate = useNavigate();
  const [channel, setChannel] = useState<string>(screenInit.tab ?? 'citizen');
  const [service, setService] = useState<string>(screenInit.service ?? '');
  const [state, setState] = useState<string>(screenInit.state ?? '');
  const [term, setTerm] = useState<string>(screenInit.query ?? '');
  const [sortKey, setSortKey] = useState<SortKey>('submittedOn');
  const [direction, setDirection] = useState<SortDirection>('desc');

  const rows = useMemo(() => {
    const needle = term.trim().toLowerCase();
    const filtered = applications.filter((app) => {
      const matchesChannel = app.channel === channel;
      const matchesService = service === '' || app.serviceCode === service;
      const matchesState = state === '' || app.state.toUpperCase() === state;
      const matchesTerm =
      needle === '' ||
      app.reference.toLowerCase().includes(needle) ||
      app.applicant.toLowerCase().includes(needle) ||
      app.serviceName.toLowerCase().includes(needle);
      return matchesChannel && matchesService && matchesState && matchesTerm;
    });
    return [...filtered].sort((a, b) =>
    direction === 'asc' ? compare(a, b, sortKey) : compare(b, a, sortKey)
    );
  }, [channel, service, state, term, sortKey, direction]);

  const filtersActive = service !== '' || state !== '' || term !== '';

  const toggleSort = (key: SortKey) => {
    if (key === sortKey) {
      setDirection((current) => current === 'asc' ? 'desc' : 'asc');
      return;
    }
    setSortKey(key);
    setDirection(key === 'submittedOn' || key === 'fee' ? 'desc' : 'asc');
  };

  const openCase = (id: string) => navigate(`/applications/${id}`);

  return (
    <section
      aria-labelledby="applications-heading"
      className="flex min-h-0 flex-1 flex-col">
      
      <div className="flex max-h-full min-h-0 flex-col overflow-hidden rounded-2xl border border-hairline bg-white shadow-card">
        <div className="flex shrink-0 flex-wrap items-center justify-between gap-3 border-b border-hairline bg-white px-4 py-4 sm:px-6 sm:py-5">
          <h1 id="applications-heading" className="text-xl font-bold tracking-tight text-ink sm:text-2xl">
            Applications
          </h1>
          <Button
            onClick={() => navigate('/applications/new')}
            className="shadow-sm transition-all duration-150 hover:shadow"
          >
            <PlusIcon className="h-4 w-4" strokeWidth={1.75} />
            <span>New application</span>
          </Button>
        </div>

        <div className="flex shrink-0 flex-wrap items-center gap-3 border-b border-hairline px-5 py-3">
          <div className="relative w-full sm:w-72">
            <label htmlFor="case-search" className="sr-only">
              Search cases
            </label>
            <SearchIcon
              className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted"
              strokeWidth={1.75} />
            
            <input
              id="case-search"
              type="search"
              value={term}
              onChange={(event) => setTerm(event.target.value)}
              placeholder="Reference, applicant or service"
              className="w-full rounded-lg border border-hairline bg-white py-2.5 pl-9 pr-3 text-body text-ink placeholder:text-muted/70 shadow-card transition-all duration-150 ease-standard focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20" />
            
          </div>

          <SelectFilter
            id="filter-service"
            label="Service"
            placeholder="All services"
            value={service}
            onChange={setService}
            options={services.map((item) => ({
              value: item.code,
              label: item.name
            }))} />
          
          <SelectFilter
            id="filter-state"
            label="State"
            placeholder="Any state"
            value={state}
            onChange={setState}
            options={caseStates.map((value) => ({
              value: value.toUpperCase(),
              label: value.toUpperCase()
            }))} />
          
          <SelectFilter
            id="filter-channel"
            label="Case channel"
            value={channel}
            onChange={setChannel}
            options={[
            { value: 'citizen', label: 'Citizen cases' },
            { value: 'internal', label: 'Internal cases' }]
            } />
          

          <div className="ml-auto flex items-center gap-3">
            {filtersActive ?
            <button
              type="button"
              onClick={() => {
                setService('');
                setState('');
                setTerm('');
              }}
              className="rounded-md text-body text-muted transition-colors duration-150 ease-standard hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">
              
                Reset
              </button> :
            null}
            <span className="text-meta text-muted">
              {rows.length} {rows.length === 1 ? 'case' : 'cases'}
            </span>
          </div>
        </div>

        {rows.length === 0 ?
        <EmptyState
          title="No cases match"
          description={
          channel === 'internal' ?
          'Cases raised inside the office will appear here once one is opened.' :
          'Try a different reference, or reset the service and state filters.'
          } /> :


        <>
            <div className="min-h-0 overflow-auto">
              <table className="w-full border-collapse text-left">
                <caption className="sr-only">
                  Applications — select a row to open the case
                </caption>
                <thead className="sticky top-0 z-10 border-b border-hairline bg-surface/60 backdrop-blur-sm">
                  <tr className="border-b border-hairline">
                    <th scope="col" className={headerClasses}>
                      <SortHeader
                      label="Case"
                      active={sortKey === 'reference'}
                      direction={direction}
                      onClick={() => toggleSort('reference')} />
                    
                    </th>
                    <th scope="col" className={`${headerClasses} w-[190px]`}>
                      <SortHeader
                      label="Applicant"
                      active={sortKey === 'applicant'}
                      direction={direction}
                      onClick={() => toggleSort('applicant')} />
                    
                    </th>
                    <th scope="col" className={`${headerClasses} w-[140px]`}>
                      <SortHeader
                      label="State"
                      active={sortKey === 'state'}
                      direction={direction}
                      onClick={() => toggleSort('state')} />
                    
                    </th>
                    <th scope="col" className={`${headerClasses} w-[130px]`}>
                      <SortHeader
                      label="Status"
                      active={sortKey === 'status'}
                      direction={direction}
                      onClick={() => toggleSort('status')} />
                    
                    </th>
                    <th scope="col" className={`${headerClasses} w-[130px]`}>
                      <SortHeader
                      label="Submitted"
                      active={sortKey === 'submittedOn'}
                      direction={direction}
                      onClick={() => toggleSort('submittedOn')} />
                    
                    </th>
                    <th
                    scope="col"
                    className={`${headerClasses} w-[100px] text-right`}>
                    
                      <SortHeader
                      label="Fee"
                      active={sortKey === 'fee'}
                      direction={direction}
                      onClick={() => toggleSort('fee')}
                      align="right" />
                    
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-hairline">
                  {rows.map((app) =>
                <tr
                  key={app.id}
                  tabIndex={0}
                  onClick={() => openCase(app.id)}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter' || event.key === ' ') {
                      event.preventDefault();
                      openCase(app.id);
                    }
                  }}
                  className="group cursor-pointer transition-colors duration-150 ease-standard hover:bg-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary">
                  
                      <td className="px-5 py-3.5">
                        <span className="block text-body font-semibold text-ink">
                          {app.serviceName}
                        </span>
                        <span className="mt-0.5 block break-all font-mono text-meta text-primary/70">
                          {app.reference}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-body text-ink">
                        {app.applicant}
                      </td>
                      <td className="px-5 py-3.5">
                        <CaseStateCell state={app.state} status={app.status} />
                      </td>
                      <td className="px-5 py-3.5">
                        <CaseStatusCell status={app.status} />
                      </td>
                      <td className="whitespace-nowrap px-5 py-3.5 text-body text-muted">
                        {app.submittedAt}
                      </td>
                      <td className="whitespace-nowrap px-5 py-3.5 text-right text-body">
                        {app.fee === 0 ?
                    <span className="text-muted">No fee</span> :

                    <span
                      className={
                      app.feePaid ? 'font-medium text-ink' : 'font-medium text-danger'
                      }>
                      
                            ${app.fee}
                          </span>
                    }
                      </td>
                    </tr>
                )}
                </tbody>
              </table>
            </div>
            <div className="shrink-0 border-t border-hairline px-5 py-3 text-right text-meta text-muted">
              Showing 1–{rows.length} of {rows.length}
            </div>
          </>
        }
      </div>
    </section>);

}