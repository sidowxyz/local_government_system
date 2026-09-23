import { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AlertCircleIcon, CheckIcon, GitMergeIcon, SearchIcon, UserPlusIcon, UsersIcon } from '../components/icons';
import { SelectFilter } from '../components/SelectFilter';
import { EmptyState } from '../components/EmptyState';
import { parties, partyStates } from '../data/parties';
import { useScreenInit } from '../useScreenInit.js';

const headerClasses =
'px-5 py-3 text-meta font-medium uppercase tracking-[0.06em] text-muted';

export function Parties() {
  const screenInit = useScreenInit();
  const navigate = useNavigate();
  const [term, setTerm] = useState<string>(screenInit.query ?? '');
  const [state, setState] = useState<string>(screenInit.state ?? '');
  const [type, setType] = useState<string>('');

  const rows = useMemo(() => {
    const needle = term.trim().toLowerCase();
    return parties.filter((party) => {
      const matchesState = state === '' || party.state === state;
      const matchesType = type === '' || party.type === type;
      const matchesTerm =
      needle === '' ||
      party.name.toLowerCase().includes(needle) ||
      party.identifiers.some((id) => id.number.includes(needle)) ||
      party.phone.includes(needle);
      return matchesState && matchesType && matchesTerm;
    });
  }, [term, state, type]);

  const openParty = (id: string) => navigate(`/parties/${id}`);

  return (
    <section
      aria-labelledby="parties-heading"
      className="flex min-h-0 flex-1 flex-col">
      
      <div className="flex max-h-full min-h-0 flex-col overflow-hidden rounded-2xl border border-hairline bg-white shadow-card">
        <div className="flex shrink-0 flex-wrap items-center justify-between gap-3 border-b border-hairline bg-white px-4 py-4 sm:px-6 sm:py-5">
          <h1 id="parties-heading" className="text-xl font-bold tracking-tight text-ink sm:text-2xl">
            Parties
          </h1>
          <Link
            to="/parties/new"
            className="inline-flex items-center gap-2 rounded-md bg-primary px-3 py-2 text-body text-white transition-colors duration-150 ease-standard hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
          >
            <UserPlusIcon className="h-4 w-4" strokeWidth={1.75} />
            Create
          </Link>
        </div>

        <div className="flex shrink-0 flex-wrap items-center gap-3 border-b border-hairline px-5 py-3">
          <div className="relative w-full sm:w-72">
            <label htmlFor="party-search" className="sr-only">
              Search parties
            </label>
            <SearchIcon
              className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted"
              strokeWidth={1.75} />
            
            <input
              id="party-search"
              type="search"
              value={term}
              onChange={(event) => setTerm(event.target.value)}
              placeholder="National ID, phone or name"
              className="w-full rounded-lg border border-hairline bg-white py-2.5 pl-9 pr-3 text-body text-ink placeholder:text-muted/70 shadow-card transition-all duration-150 ease-standard focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20" />
            
          </div>

          <SelectFilter
            id="party-type-filter"
            label="Party type"
            placeholder="Any type"
            value={type}
            onChange={setType}
            options={[
            { value: 'IND', label: 'Individual' },
            { value: 'ORG', label: 'Organisation' }]
            } />
          
          <SelectFilter
            id="party-state"
            label="State"
            placeholder="Any state"
            value={state}
            onChange={setState}
            options={partyStates.map((value) => ({ value, label: value }))} />
          

          <span className="ml-auto text-meta text-muted">
            {rows.length} {rows.length === 1 ? 'party' : 'parties'}
          </span>
        </div>

        {rows.length === 0 ?
        <EmptyState
          title="No parties found"
          description="Search by name, identifier or phone number, or clear the filters." /> :


        <>
            <div className="min-h-0 overflow-auto">
              <table className="w-full border-collapse text-left">
                <caption className="sr-only">
                  Parties — select a row to open the record
                </caption>
                <thead className="sticky top-0 z-10 border-b border-hairline bg-surface/60 backdrop-blur-sm">
                  <tr className="border-b border-hairline">
                    <th scope="col" className={headerClasses}>
                      Name
                    </th>
                    <th scope="col" className={`${headerClasses} w-[90px]`}>
                      Type
                    </th>
                    <th scope="col" className={headerClasses}>
                      Identifiers
                    </th>
                    <th scope="col" className={`${headerClasses} w-[170px]`}>
                      Phone
                    </th>
                    <th scope="col" className={`${headerClasses} w-[110px]`}>
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-hairline">
                  {rows.map((party) =>
                <tr
                  key={party.id}
                  tabIndex={0}
                  onClick={() => openParty(party.id)}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter' || event.key === ' ') {
                      event.preventDefault();
                      openParty(party.id);
                    }
                  }}
                  className="cursor-pointer transition-colors duration-150 ease-standard hover:bg-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary">
                  
                      <td className="px-5 py-3.5 text-body font-semibold text-ink">
                        <div className="flex items-center gap-2.5">
                          <UsersIcon className="h-4 w-4 shrink-0 text-muted" weight="duotone" />
                          <span>{party.name}</span>
                        </div>
                      </td>
                      <td className="px-5 py-3.5">
                        <span className="inline-flex items-center rounded-md border border-hairline bg-surface/80 px-1.5 py-0.5 font-mono text-meta text-muted">
                          {party.type}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 font-mono text-meta text-primary/70">
                        {party.identifiers.
                    map((identifier) => identifier.number).
                    join(', ')}
                      </td>
                      <td className="whitespace-nowrap px-5 py-3.5 font-mono text-meta text-ink">
                        {party.phone}
                      </td>
                      <td className="px-5 py-3.5">
                        <span
                          aria-label={`Party state: ${party.state}`}
                          className={
                            party.state === 'ACTIVE'
                              ? 'text-success'
                              : party.state === 'MERGED'
                                ? 'text-primary'
                                : 'text-ink'
                          }
                        >
                          {party.state === 'ACTIVE' ? (
                            <CheckIcon className="h-4 w-4" weight="duotone" />
                          ) : party.state === 'MERGED' ? (
                            <GitMergeIcon className="h-4 w-4" weight="duotone" />
                          ) : (
                            <AlertCircleIcon className="h-4 w-4" weight="duotone" />
                          )}
                        </span>
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