import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { SearchIcon, FileTextIcon, InfoIcon } from '../components/icons';
import { SelectFilter } from '../components/SelectFilter';
import { EmptyState } from '../components/EmptyState';
import { SortHeader, type SortDirection } from '../components/SortHeader';
import { Button } from '../components/Button';
import { invoices, invoiceServices, type Invoice } from '../data/invoices';

type SortKey = 'reference' | 'payer' | 'dueSortKey' | 'status' | 'amountDue';

const headerClasses =
  'px-5 py-3 text-meta font-medium uppercase tracking-[0.06em] text-muted';

function compare(a: Invoice, b: Invoice, key: SortKey): number {
  if (key === 'dueSortKey') return a.dueSortKey - b.dueSortKey;
  if (key === 'amountDue') return a.amountDue - b.amountDue;
  return String(a[key]).localeCompare(String(b[key]));
}

function InvoiceStatusBadge({ status }: { status: Invoice['status'] }) {
  const styles =
    status === 'Paid'
      ? 'bg-emerald-50 text-emerald-700 ring-emerald-200'
      : 'bg-goldLight text-ink ring-gold/30';

  return (
    <span
      className={[
        'inline-flex items-center rounded px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wider ring-1',
        styles,
      ].join(' ')}
    >
      {status}
    </span>
  );
}

export function PaymentCounter() {
  const navigate = useNavigate();
  const [payableRef, setPayableRef] = useState('');
  const [term, setTerm] = useState('');
  const [settlement, setSettlement] = useState('');
  const [service, setService] = useState('');
  const [office, setOffice] = useState('');
  const [sortKey, setSortKey] = useState<SortKey>('dueSortKey');
  const [direction, setDirection] = useState<SortDirection>('desc');

  const rows = useMemo(() => {
    const needle = term.trim().toLowerCase();
    const filtered = invoices.filter((inv) => {
      const matchesSettlement =
        settlement === '' ||
        (settlement === 'paid' && inv.status === 'Paid') ||
        (settlement === 'unpaid' && inv.status === 'Issued');
      const matchesService = service === '' || inv.service === service;
      const matchesTerm =
        needle === '' ||
        inv.reference.toLowerCase().startsWith(needle) ||
        inv.payer.toLowerCase().includes(needle);
      return matchesSettlement && matchesService && matchesTerm;
    });
    return [...filtered].sort((a, b) =>
      direction === 'asc' ? compare(a, b, sortKey) : compare(b, a, sortKey)
    );
  }, [term, settlement, service, sortKey, direction]);

  const toggleSort = (key: SortKey) => {
    if (key === sortKey) {
      setDirection((current) => (current === 'asc' ? 'desc' : 'asc'));
      return;
    }
    setSortKey(key);
    setDirection(key === 'dueSortKey' || key === 'amountDue' ? 'desc' : 'asc');
  };

  const handleFind = () => {
    const search = payableRef.trim();
    if (!search) return;
    const match = invoices.find(
      (inv) =>
        inv.reference.toLowerCase() === search.toLowerCase() ||
        inv.id.toLowerCase() === search.toLowerCase()
    );
    if (match) {
      navigate(`/counter/${match.id}`);
    } else {
      setTerm(search);
    }
  };

  const formatAmount = (amount: number) =>
    amount.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

  return (
    <section
      aria-labelledby="counter-heading"
      className="flex min-h-0 flex-1 flex-col"
    >
      {/* ── Payable reference lookup ── */}
      <div className="mb-6 rounded-2xl border border-hairline bg-white shadow-card">
        <div className="border-b border-hairline px-6 py-5">
          <h1 id="counter-heading" className="text-xl font-bold tracking-tight text-ink sm:text-2xl">
            Payment counter
          </h1>
        </div>
        <div className="p-5">
          <div className="flex items-center gap-1.5">
          <label
            htmlFor="payable-ref"
            className="block text-body font-semibold text-ink"
          >
            Payable reference
          </label>
          <div className="group relative inline-flex items-center">
            <button
              type="button"
              tabIndex={-1}
              aria-label="Payable reference help"
              className="cursor-help text-muted/60 transition-colors hover:text-ink focus:outline-none"
            >
              <InfoIcon className="h-4 w-4" strokeWidth={1.75} />
            </button>
            <div className="pointer-events-none absolute left-0 top-full z-50 mt-2 hidden w-80 rounded-lg border border-hairline bg-ink p-3 text-xs leading-relaxed text-white shadow-2xl group-hover:block group-focus-within:block">
              <div className="absolute -top-1.5 left-4 h-3 w-3 rotate-45 border-l border-t border-hairline bg-ink" />
              <span className="relative z-10">
                An invoice number, a case reference, or another reference this
                install accepts — if nothing matches, the accepted forms are
                listed.
              </span>
            </div>
          </div>
          </div>
          <div className="mt-2.5 flex items-center gap-3">
          <div className="flex-1">
            <input
              id="payable-ref"
              type="text"
              value={payableRef}
              onChange={(e) => setPayableRef(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleFind();
                }
              }}
              placeholder="e.g. INV-2026-000007"
              className="w-full rounded-lg border border-hairline bg-white px-3.5 py-2.5 text-body text-ink placeholder:text-muted/60 shadow-card transition-all duration-150 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>
          <Button onClick={handleFind}>
            <SearchIcon className="h-4 w-4" strokeWidth={1.75} />
            Find
          </Button>
          </div>
        </div>
      </div>

      {/* ── Payables section ── */}
      <div className="flex max-h-full min-h-0 flex-1 flex-col overflow-hidden rounded-2xl border border-hairline bg-white shadow-card">
        <div className="shrink-0 border-b border-hairline bg-white px-6 py-5">
          <h2 className="text-xl font-bold tracking-tight text-ink sm:text-2xl">
            Payables
          </h2>
        </div>

        {/* Filters */}
        <div className="border-b border-hairline px-5 py-4">
          <div className="flex flex-wrap items-end gap-3.5">
            <div className="w-full sm:w-72">
              <div className="mb-1 flex items-center gap-1.5">
                <label
                  htmlFor="inv-search"
                  className="text-meta font-medium uppercase tracking-[0.06em] text-muted"
                >
                  Search
                </label>
                <div className="group relative inline-flex items-center">
                  <button
                    type="button"
                    tabIndex={-1}
                    aria-label="Search match criteria explanation"
                    className="cursor-help text-muted/60 transition-colors hover:text-ink focus:outline-none"
                  >
                    <InfoIcon className="h-3.5 w-3.5" strokeWidth={1.75} />
                  </button>
                  <div className="pointer-events-none absolute left-0 top-full z-50 mt-2 hidden w-80 rounded-lg border border-hairline bg-ink p-3 text-xs leading-relaxed text-white shadow-2xl group-hover:block group-focus-within:block">
                    <div className="absolute -top-1.5 left-4 h-3 w-3 rotate-45 border-l border-t border-hairline bg-ink" />
                    <span className="relative z-10">
                      Matches the start of an invoice reference, or the payer
                      name on a walk-in invoice. An invoice raised for a
                      registered party carries no payer name — find those from
                      the party's record.
                    </span>
                  </div>
                </div>
              </div>
              <div className="relative">
                <SearchIcon
                  className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted"
                  strokeWidth={1.75}
                />
                <input
                  id="inv-search"
                  type="search"
                  value={term}
                  onChange={(event) => setTerm(event.target.value)}
                  placeholder="Reference or payer name"
                  className="w-full rounded-lg border border-hairline bg-white py-2.5 pl-9 pr-3 text-body text-ink placeholder:text-muted/70 shadow-card transition-all duration-150 ease-standard focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
            </div>

            <SelectFilter
              id="filter-settlement"
              label="Settlement"
              placeholder="All payables"
              value={settlement}
              onChange={setSettlement}
              options={[
                { value: 'paid', label: 'Paid' },
                { value: 'unpaid', label: 'Unpaid' },
              ]}
            />
            <SelectFilter
              id="filter-inv-service"
              label="Service"
              placeholder="All services"
              value={service}
              onChange={setService}
              options={invoiceServices.map((s) => ({ value: s, label: s }))}
            />
            <SelectFilter
              id="filter-office"
              label="Office"
              placeholder="All offices"
              value={office}
              onChange={setOffice}
              options={[
                { value: 'hodan', label: 'Hodan' },
                { value: 'waaberi', label: 'Waaberi' },
                { value: 'wadajir', label: 'Wadajir' },
              ]}
            />

            <div className="ml-auto flex items-center gap-3 pb-2.5">
              {(term !== '' || settlement !== '' || service !== '' || office !== '') && (
                <button
                  type="button"
                  onClick={() => {
                    setTerm('');
                    setSettlement('');
                    setService('');
                    setOffice('');
                  }}
                  className="rounded-md text-body text-muted transition-colors duration-150 ease-standard hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                >
                  Reset
                </button>
              )}
              <span className="text-meta text-muted">
                {rows.length} {rows.length === 1 ? 'invoice' : 'invoices'}
              </span>
            </div>
          </div>
        </div>

        {/* Table */}
        {rows.length === 0 ? (
          <EmptyState
            title="No invoices match"
            description="Try a different reference or payer name, or reset the filters."
          />
        ) : (
          <>
            <div className="min-h-0 overflow-auto">
              <table className="w-full border-collapse text-left">
                <caption className="sr-only">
                  Payable invoices — select an invoice to view details
                </caption>
                <thead className="sticky top-0 z-10 border-b border-hairline bg-surface/60 backdrop-blur-sm">
                  <tr className="border-b border-hairline">
                    <th scope="col" className={`${headerClasses} w-[180px]`}>
                      <SortHeader
                        label="Reference"
                        active={sortKey === 'reference'}
                        direction={direction}
                        onClick={() => toggleSort('reference')}
                      />
                    </th>
                    <th scope="col" className={headerClasses}>
                      <SortHeader
                        label="Payer"
                        active={sortKey === 'payer'}
                        direction={direction}
                        onClick={() => toggleSort('payer')}
                      />
                    </th>
                    <th scope="col" className={`${headerClasses} w-[200px]`}>
                      Service
                    </th>
                    <th scope="col" className={`${headerClasses} w-[140px]`}>
                      <SortHeader
                        label="Due"
                        active={sortKey === 'dueSortKey'}
                        direction={direction}
                        onClick={() => toggleSort('dueSortKey')}
                      />
                    </th>
                    <th scope="col" className={`${headerClasses} w-[110px]`}>
                      <SortHeader
                        label="Status"
                        active={sortKey === 'status'}
                        direction={direction}
                        onClick={() => toggleSort('status')}
                      />
                    </th>
                    <th
                      scope="col"
                      className={`${headerClasses} w-[160px] text-right`}
                    >
                      <SortHeader
                        label="Amount due"
                        active={sortKey === 'amountDue'}
                        direction={direction}
                        onClick={() => toggleSort('amountDue')}
                        align="right"
                      />
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-hairline">
                  {rows.map((inv) => (
                    <tr
                      key={inv.id}
                      tabIndex={0}
                      onClick={() => navigate(`/counter/${inv.id}`)}
                      onKeyDown={(event) => {
                        if (event.key === 'Enter' || event.key === ' ') {
                          event.preventDefault();
                          navigate(`/counter/${inv.id}`);
                        }
                      }}
                      className="group cursor-pointer transition-colors duration-150 ease-standard hover:bg-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary"
                    >
                      <td className="px-5 py-3.5 font-mono text-body font-medium text-ink">
                        {inv.reference}
                      </td>
                      <td className="px-5 py-3.5 text-body text-ink">
                        {inv.payer}
                      </td>
                      <td className="px-5 py-3.5 text-body text-muted">
                        {inv.service}
                      </td>
                      <td className="whitespace-nowrap px-5 py-3.5 text-body text-muted">
                        {inv.dueDate}
                      </td>
                      <td className="px-5 py-3.5">
                        <InvoiceStatusBadge status={inv.status} />
                      </td>
                      <td className="whitespace-nowrap px-5 py-3.5 text-right text-body">
                        <div className="flex items-center justify-end gap-3">
                          {inv.amountDue === 0 ? (
                            <span className="text-muted">
                              0.00
                              <span className="ml-1 text-meta">USD</span>
                            </span>
                          ) : (
                            <span
                              className={
                                inv.status === 'Issued'
                                  ? 'font-medium text-danger'
                                  : 'font-medium text-ink'
                              }
                            >
                              {formatAmount(inv.amountDue)}
                              <span className="ml-1 text-meta font-normal text-muted">
                                USD
                              </span>
                            </span>
                          )}
                          <button
                            type="button"
                            title="View invoice"
                            aria-label={`View invoice ${inv.reference}`}
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(`/counter/${inv.id}`);
                            }}
                            className="rounded p-1 text-muted/70 transition-colors duration-150 hover:bg-surface-hover hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                          >
                            <FileTextIcon
                              className="h-4 w-4"
                              strokeWidth={1.75}
                            />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="shrink-0 border-t border-hairline px-5 py-3 text-right text-meta text-muted">
              Showing 1–{rows.length} of {rows.length}
            </div>
          </>
        )}
      </div>
    </section>
  );
}

