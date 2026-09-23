import { Navigate, useParams } from 'react-router-dom';
import {
  FileTextIcon,
  PrinterIcon,
  ScissorsIcon,
  InboxIcon,
} from '../components/icons';
import { Button } from '../components/Button';
import {
  RecordCard,
  RecordHeader,
  RecordBody,
  RecordColumn,
  RecordSection,
  Fact,
} from '../components/RecordCard';
import { invoices, type Invoice } from '../data/invoices';

function InvoiceStatusBadge({ status }: { status: Invoice['status'] }) {
  const styles =
    status === 'Paid'
      ? 'bg-emerald-50 text-emerald-700 ring-emerald-200'
      : 'bg-goldLight text-ink ring-gold/30';

  return (
    <span
      className={[
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-meta font-semibold uppercase tracking-wider ring-1',
        styles,
      ].join(' ')}
    >
      {status}
    </span>
  );
}

export function InvoiceDetail() {
  const { id } = useParams<{ id: string }>();
  const invoice = invoices.find(
    (inv) => inv.id === id || inv.reference.toLowerCase() === id?.toLowerCase()
  );

  if (!invoice) {
    return <Navigate to="/counter" replace />;
  }

  const formatAmount = (amount: number) =>
    amount.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

  return (
    <section
      aria-label={`Invoice record ${invoice.reference}`}
      className="no-scrollbar min-h-0 flex-1 overflow-y-auto pr-1"
    >
      <div className="pb-4">
        <RecordCard>
          <RecordHeader
            backTo="/counter"
            backLabel="Money"
            eyebrow={
              <span className="font-mono text-meta font-medium uppercase tracking-[0.07em] text-primary/80">
                {invoice.serviceCode}
              </span>
            }
            title={invoice.reference}
            meta={[
              <InvoiceStatusBadge status={invoice.status} />,
              <span className="text-body text-muted">
                Due {invoice.dueDate}
              </span>,
              <span className="text-body text-muted">{invoice.payer}</span>,
            ]}
            actions={
              <>
                <Button variant="secondary">
                  <FileTextIcon className="h-4 w-4" strokeWidth={1.75} />
                  Issue notice
                </Button>
                <Button variant="secondary">
                  <PrinterIcon className="h-4 w-4" strokeWidth={1.75} />
                  Print
                </Button>
                <Button variant="secondary">
                  <ScissorsIcon className="h-4 w-4" strokeWidth={1.75} />
                  Reduce
                </Button>
              </>
            }
          />

          <RecordBody>
            {/* Main Column */}
            <RecordColumn>
              {/* Summary Facts */}
              <RecordSection title="Summary">
                <dl className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                  <Fact label="Payer" value={invoice.payer} />
                  <Fact label="Service" value={invoice.service} />
                  <Fact label="Due date" value={invoice.dueDate} />
                </dl>
              </RecordSection>

              {/* Line Items Table */}
              <RecordSection title="Invoice">
                <div className="overflow-x-auto rounded-lg border border-hairline bg-white">
                  <table className="w-full min-w-[560px] border-collapse text-left">
                    <caption className="sr-only">Invoice line items</caption>
                    <thead>
                      <tr className="border-b border-hairline bg-surface/60 text-meta font-medium uppercase tracking-[0.06em] text-muted">
                        <th scope="col" className="px-5 py-3">
                          Charge
                        </th>
                        <th scope="col" className="w-20 px-5 py-3 text-center">
                          Qty
                        </th>
                        <th scope="col" className="w-28 px-5 py-3 text-right">
                          Unit
                        </th>
                        <th scope="col" className="w-28 px-5 py-3 text-right">
                          Total
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-hairline">
                      {invoice.items.map((item, idx) => (
                        <tr key={idx} className="transition-colors hover:bg-surface/40">
                          <td className="px-5 py-3.5">
                            <div className="text-body font-semibold text-ink">
                              {item.name}
                            </div>
                            <div className="mt-0.5 font-mono text-meta text-muted">
                              {item.code}
                            </div>
                          </td>
                          <td className="px-5 py-3.5 text-center text-body text-ink">
                            {item.qty}
                          </td>
                          <td className="px-5 py-3.5 text-right font-mono text-body text-ink">
                            {formatAmount(item.unitPrice)}
                          </td>
                          <td className="px-5 py-3.5 text-right font-mono text-body font-medium text-ink">
                            {formatAmount(item.total)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  {/* Totals Summary */}
                  <div className="border-t border-hairline bg-surface/20 px-5 py-4">
                    <div className="ml-auto max-w-xs space-y-2">
                      <div className="flex items-center justify-between text-body text-muted">
                        <span>Total</span>
                        <span className="font-mono text-ink">
                          {formatAmount(invoice.totalAmount)}{' '}
                          <span className="text-meta text-muted">USD</span>
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-body text-muted">
                        <span>Settled</span>
                        <span className="font-mono text-ink">
                          {formatAmount(invoice.settledAmount)}{' '}
                          <span className="text-meta text-muted">USD</span>
                        </span>
                      </div>
                      <div className="flex items-center justify-between rounded-lg border border-danger/15 bg-danger/5 px-3 py-2.5 text-lead font-bold text-ink">
                        <span>Amount due</span>
                        <span className={invoice.amountDue > 0 ? 'font-mono text-danger' : 'font-mono text-ink'}>
                          {formatAmount(invoice.amountDue)}{' '}
                          <span className="text-meta font-normal text-muted">USD</span>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </RecordSection>
            </RecordColumn>

            {/* Side Column: Payments */}
            <RecordColumn side>
              <RecordSection title="Payments">
                {invoice.payments.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-surface">
                      <InboxIcon
                        className="h-5 w-5 text-muted/60"
                        strokeWidth={1.5}
                      />
                    </div>
                    <p className="mt-2.5 text-body font-medium text-muted">
                      No records
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {invoice.payments.map((p) => (
                      <div
                        key={p.id}
                        className="rounded-lg border border-hairline bg-surface/30 p-4 transition-colors duration-150 hover:bg-surface/60"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <div className="font-mono text-meta font-semibold text-primary">
                              {p.reference}
                            </div>
                            <div className="mt-1 text-meta text-muted">
                              {p.date} · {p.method}
                            </div>
                            {p.receiptNumber ? (
                              <div className="mt-0.5 text-meta text-muted">
                                Receipt: {p.receiptNumber}
                              </div>
                            ) : null}
                          </div>
                          <div className="text-right">
                            <span className="font-mono text-body font-semibold text-emerald-600">
                              {formatAmount(p.amount)}{' '}
                              <span className="text-meta font-normal text-muted">
                                USD
                              </span>
                            </span>
                            <div className="mt-0.5 text-[11px] font-semibold uppercase tracking-wider text-emerald-600">
                              Settled
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </RecordSection>
            </RecordColumn>
          </RecordBody>
        </RecordCard>
      </div>
    </section>
  );
}

