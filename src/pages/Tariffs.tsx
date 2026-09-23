import { useState, useMemo } from 'react';
import {
  SearchIcon,
  PlusIcon,
  PencilIcon,
  CheckIcon,
  TrashIcon,
  ScrollTextIcon,
  ChevronDownIcon,
  ChevronUpIcon,
} from '../components/icons';
import { Button } from '../components/Button';
import { NewVersionModal } from '../components/NewVersionModal';
import { CreateTariffModal } from '../components/CreateTariffModal';
import { EditTariffModal } from '../components/EditTariffModal';
import {
  initialTariffs,
  formatDate,
  getCurrentVersion,
  type Tariff,
  type TariffVersion,
  type TariffComponent,
} from '../data/tariffs';

type TabKey = 'current' | 'versions';

export function Tariffs() {
  const [tariffs, setTariffs] = useState<Tariff[]>(initialTariffs);
  const [selectedTariffId, setSelectedTariffId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<TabKey>('current');

  // Expanded version rows in Tab 2
  const [expandedVersionIds, setExpandedVersionIds] = useState<Record<string, boolean>>({
    'v-1-1': false,
  });

  // Notification notice
  const [saveSuccessNotice, setSaveSuccessNotice] = useState<string | null>(null);

  // Modals
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isNewVersionModalOpen, setIsNewVersionModalOpen] = useState(false);

  // Selected tariff object
  const selectedTariff = useMemo(() => {
    return tariffs.find((t) => t.id === selectedTariffId) || null;
  }, [tariffs, selectedTariffId]);

  // Current active version of the selected tariff
  const currentVersion = useMemo(() => {
    if (!selectedTariff) return null;
    return getCurrentVersion(selectedTariff);
  }, [selectedTariff]);

  // Filtered tariffs list on left panel
  const filteredTariffs = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return tariffs;
    return tariffs.filter(
      (t) =>
        t.name.toLowerCase().includes(term) ||
        (t.nameSomali && t.nameSomali.toLowerCase().includes(term)) ||
        t.code.toLowerCase().includes(term)
    );
  }, [tariffs, searchTerm]);

  const toggleVersionExpand = (versionId: string) => {
    setExpandedVersionIds((prev) => ({
      ...prev,
      [versionId]: !prev[versionId],
    }));
  };

  // Handler for adding a new tariff
  const handleAddTariff = (newTariff: Tariff) => {
    setTariffs((prev) => [newTariff, ...prev]);
    setSelectedTariffId(newTariff.id);
    setSaveSuccessNotice(`Tariff "${newTariff.name}" created.`);
    setTimeout(() => setSaveSuccessNotice(null), 3000);
  };

  // Handler for updating a tariff
  const handleUpdateTariff = (updated: Tariff) => {
    setTariffs((prev) =>
      prev.map((t) => (t.id === updated.id ? updated : t))
    );
    setSaveSuccessNotice('Tariff updated.');
    setTimeout(() => setSaveSuccessNotice(null), 3000);
  };

  // Handler for saving a new version
  const handleSaveVersion = (newVersion: TariffVersion) => {
    if (!selectedTariff) return;

    setTariffs((prev) =>
      prev.map((t) => {
        if (t.id !== selectedTariff.id) return t;

        const updatedVersions = t.versions.map((v) => {
          if (v.untilDate === null) {
            return { ...v, untilDate: newVersion.effectiveDate };
          }
          return v;
        });

        return {
          ...t,
          versions: [newVersion, ...updatedVersions],
        };
      })
    );

    setExpandedVersionIds((prev) => ({
      ...prev,
      [newVersion.id]: true,
    }));

    setSaveSuccessNotice('New version activated.');
    setTimeout(() => setSaveSuccessNotice(null), 3000);
  };

  // Handler for deleting a version
  const handleDeleteVersion = (versionId: string) => {
    if (!selectedTariff) return;
    if (selectedTariff.versions.length <= 1) {
      alert('A tariff must keep at least one version.');
      return;
    }

    setTariffs((prev) =>
      prev.map((t) => {
        if (t.id !== selectedTariff.id) return t;
        return {
          ...t,
          versions: t.versions.filter((v) => v.id !== versionId),
        };
      })
    );

    setSaveSuccessNotice('Version deleted.');
    setTimeout(() => setSaveSuccessNotice(null), 3000);
  };

  return (
    <section
      aria-labelledby="tariffs-heading"
      className="flex min-h-0 flex-1 flex-col"
    >
      {/* Tariff workspace */}
      <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-2xl border border-hairline bg-white shadow-card">
        <div className="flex shrink-0 flex-wrap items-center justify-between gap-4 border-b border-hairline px-6 py-5">
          <div>
            <h1 id="tariffs-heading" className="text-xl font-bold tracking-tight text-ink sm:text-2xl">
              Tariffs
            </h1>
          </div>
          <Button onClick={() => setIsCreateModalOpen(true)} className="shadow-sm">
            <PlusIcon className="h-4 w-4" strokeWidth={1.75} />
            <span>Create tariff</span>
          </Button>
        </div>

        {/* Main Two-Panel Layout */}
        <div className="flex min-h-0 flex-1 flex-col gap-4 overflow-auto p-3 sm:p-4 lg:flex-row lg:overflow-hidden">
        {/* Left Column: Tariffs List (Clean ~260px-280px) */}
        <div className="flex min-h-[260px] w-full shrink-0 flex-col overflow-hidden rounded-xl border border-hairline bg-surface/30 lg:min-h-0 lg:w-64 xl:w-72">
          {/* Search bar */}
          <div className="shrink-0 border-b border-hairline bg-white p-4">
            <div className="mb-3">
              <div className="flex items-center justify-between gap-2">
                <h2 className="text-body font-bold text-ink">Fee schedules</h2>
                <span className="rounded-full bg-primaryLight px-2 py-0.5 text-[11px] font-semibold text-primary">
                  {filteredTariffs.length}
                </span>
              </div>
              <p className="mt-1 text-meta text-muted">Select one to manage its pricing.</p>
            </div>
            <div className="relative">
              <label htmlFor="tariff-search" className="sr-only">
                Search tariffs
              </label>
              <SearchIcon
                className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted"
                strokeWidth={1.75}
              />
              <input
                id="tariff-search"
                type="search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search tariffs..."
                className="w-full rounded-lg border border-hairline bg-white py-2.5 pl-9 pr-3 text-body text-ink placeholder:text-muted/70 shadow-card transition-all duration-150 ease-standard focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
          </div>

          {/* Tariffs List */}
          <div className="min-h-0 flex-1 overflow-y-auto no-scrollbar divide-y divide-hairline">
            {filteredTariffs.length === 0 ? (
              <div className="p-6 text-center">
                <p className="text-body font-medium text-ink">No tariffs found</p>
                <p className="mt-1 text-meta text-muted">
                  No tariffs match "{searchTerm}".
                </p>
              </div>
            ) : (
              filteredTariffs.map((tariff) => {
                const isSelected = selectedTariffId === tariff.id;
                return (
                  <button
                    key={tariff.id}
                    type="button"
                    onClick={() => {
                      setSelectedTariffId(tariff.id);
                      setActiveTab('versions');
                    }}
                    className={[
                      'group flex w-full flex-col items-start px-4 py-2.5 text-left transition-all duration-150 ease-standard focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary',
                      isSelected
                        ? 'bg-primaryLight/70'
                        : 'hover:bg-surface/70',
                    ].join(' ')}
                  >
                    <div className="flex w-full items-center justify-between gap-1.5">
                      <span
                        className={[
                          'truncate text-[13px] font-semibold transition-colors',
                          isSelected ? 'text-primary' : 'text-ink group-hover:text-ink',
                        ].join(' ')}
                      >
                        {tariff.name}
                      </span>
                      {tariff.status === 'Inactive' && (
                        <span className="shrink-0 rounded-full border border-hairline bg-surface px-1.5 py-0.2 text-[9px] font-medium uppercase tracking-wider text-muted">
                          Inactive
                        </span>
                      )}
                    </div>
                    <div className="mt-0.5 flex items-center gap-1.5">
                      <span className="font-mono text-[11px] font-medium text-muted">{tariff.code}</span>
                      <span className="text-[10px] text-muted/60">•</span>
                      <span className="text-[11px] text-muted">
                        {tariff.versions.length} {tariff.versions.length === 1 ? 'version' : 'versions'}
                      </span>
                    </div>
                  </button>
                );
              })
            )}
          </div>

          {/* Footer count */}
          <div className="shrink-0 border-t border-hairline bg-white px-4 py-3 text-meta text-muted">
            {filteredTariffs.length} {filteredTariffs.length === 1 ? 'tariff' : 'tariffs'}
          </div>
        </div>

        {/* Right Column: Tariff Details View */}
        <div className="flex min-h-[420px] min-w-0 flex-1 flex-col overflow-hidden rounded-xl border border-hairline bg-white lg:min-h-0">
          {!selectedTariff ? (
            <div className="flex flex-1 flex-col items-center justify-center p-12 text-center">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl border border-hairline bg-surface/80 text-muted shadow-xs">
                <ScrollTextIcon className="h-7 w-7 text-muted/70" />
              </div>
              <h3 className="text-display font-semibold text-ink">Choose a tariff</h3>
              <p className="mt-1 max-w-sm text-body text-muted">
                Its pricing and version history appear here.
              </p>
            </div>
          ) : (
            <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
              {/* Streamlined Top Header */}
              <div className="border-b border-hairline bg-white px-5 py-3.5">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  {/* Left: Tariff identity */}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <h2 className="text-display font-bold text-ink">
                        {selectedTariff.name}
                      </h2>
                      {selectedTariff.status === 'Inactive' && (
                        <span className="rounded-full border border-hairline bg-surface px-2 py-0.2 text-[10px] font-medium text-muted">
                          Inactive
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Right: Actions */}
                  <div className="flex items-center gap-2 shrink-0">
                    <Button
                      variant="secondary"
                      onClick={() => setIsEditModalOpen(true)}
                      className="py-1 px-2.5 text-meta"
                    >
                      <PencilIcon className="h-3.5 w-3.5" />
                      Rename
                    </Button>

                    <Button
                      onClick={() => setIsNewVersionModalOpen(true)}
                      className="py-1 px-3 text-meta shadow-sm"
                    >
                      <PlusIcon className="h-3.5 w-3.5" />
                      New version
                    </Button>
                  </div>
                </div>

                {/* Save success notice */}
                {saveSuccessNotice && (
                  <div className="mt-2.5 flex items-center gap-2 rounded-md border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-meta text-emerald-900">
                    <CheckIcon className="h-3.5 w-3.5 shrink-0 text-emerald-700" />
                    <span>{saveSuccessNotice}</span>
                  </div>
                )}
              </div>

              {/* Navigation Tabs Bar */}
              <div className="flex items-center border-b border-hairline bg-surface/50 px-5 py-2">
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => setActiveTab('current')}
                    className={[
                      'inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-meta font-medium transition-colors',
                      activeTab === 'current'
                        ? 'bg-white text-primary font-semibold shadow-xs border border-hairline'
                        : 'text-muted hover:text-ink hover:bg-surface',
                    ].join(' ')}
                  >
                    <span>Current pricing</span>
                    <span
                      className={[
                        'rounded-full px-1.5 py-0.2 text-[11px]',
                        activeTab === 'current'
                          ? 'bg-primaryLight text-primary font-semibold'
                          : 'bg-surface text-muted',
                      ].join(' ')}
                    >
                      {currentVersion?.components.length || 0}
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveTab('versions')}
                    className={[
                      'inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-meta font-medium transition-colors',
                      activeTab === 'versions'
                        ? 'bg-white text-primary font-semibold shadow-xs border border-hairline'
                        : 'text-muted hover:text-ink hover:bg-surface',
                    ].join(' ')}
                  >
                    <span>Version history</span>
                    <span
                      className={[
                        'rounded-full px-1.5 py-0.2 text-[11px]',
                        activeTab === 'versions'
                          ? 'bg-primaryLight text-primary font-semibold'
                          : 'bg-surface text-muted',
                      ].join(' ')}
                    >
                      {selectedTariff.versions.length}
                    </span>
                  </button>
                </div>
              </div>

              {/* Tab Content Body */}
              <div className="min-h-0 flex-1 overflow-y-auto p-6">
                {/* TAB 1: CURRENT PRICING */}
                {activeTab === 'current' && (
                  <div className="space-y-6">
                    {currentVersion ? (
                      <div>
                        {/* Section Sub-heading */}
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-[11px] font-bold uppercase tracking-[0.08em] text-muted">
                            WHAT THIS CHARGES NOW
                          </h3>
                          {currentVersion.approvalDocument && (
                            <span className="text-meta text-muted">
                              Authority: {currentVersion.approvalDocument}
                            </span>
                          )}
                        </div>

                        {/* Charges breakdown */}
                        <div className="space-y-5">
                          {currentVersion.components.map((comp) => (
                            <ComponentChargeItem key={comp.id} component={comp} />
                          ))}
                        </div>

                        <div className="mt-5 text-meta text-muted border-t border-hairline pt-3">
                          In force since {formatDate(currentVersion.effectiveDate)}
                        </div>
                      </div>
                    ) : (
                      <p className="text-meta text-muted">No active version found.</p>
                    )}
                  </div>
                )}

                {/* TAB 2: VERSION HISTORY */}
                {activeTab === 'versions' && (
                  <div>
                    <div className="border-t border-hairline">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="border-b border-hairline text-meta font-medium uppercase tracking-[0.06em] text-muted">
                            <th className="py-3 px-3 w-10">#</th>
                            <th className="py-3 px-3">Effective</th>
                            <th className="py-3 px-3">Until</th>
                            <th className="py-3 px-3">Basis</th>
                            <th className="py-3 px-3">Amount</th>
                            <th className="py-3 px-3 text-right"></th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-hairline">
                          {selectedTariff.versions.map((ver, idx) => {
                            const isExpanded = !!expandedVersionIds[ver.id];
                            const isCurrent = ver.untilDate === null;
                            const uniqueBases = Array.from(
                              new Set(ver.components.map((c) => c.basis))
                            );

                            return (
                              <VersionRow
                                key={ver.id}
                                version={ver}
                                index={selectedTariff.versions.length - idx}
                                isCurrent={isCurrent}
                                isExpanded={isExpanded}
                                uniqueBases={uniqueBases}
                                onToggleExpand={() => toggleVersionExpand(ver.id)}
                                onDelete={() => handleDeleteVersion(ver.id)}
                              />
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
        </div>
      </div>

      {/* Modals */}
      <CreateTariffModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSave={handleAddTariff}
      />

      <EditTariffModal
        isOpen={isEditModalOpen}
        tariff={selectedTariff}
        onClose={() => setIsEditModalOpen(false)}
        onSave={handleUpdateTariff}
      />

      {selectedTariff && (
        <NewVersionModal
          isOpen={isNewVersionModalOpen}
          tariffCode={selectedTariff.code}
          onClose={() => setIsNewVersionModalOpen(false)}
          onSave={handleSaveVersion}
        />
      )}
    </section>
  );
}

/** Component charge item view */
function ComponentChargeItem({ component }: { component: TariffComponent }) {
  const getBasisBadge = () => {
    switch (component.basis) {
      case 'LOOKUP':
        return (
          <span className="rounded bg-primaryLight px-1.5 py-0.2 text-[10px] font-bold uppercase tracking-wider text-primary border border-primary/20">
            LOOKUP
          </span>
        );
      case 'DIFFERENCE':
        return (
          <span className="rounded bg-turquoise/50 px-1.5 py-0.2 text-[10px] font-bold uppercase tracking-wider text-yale border border-turquoise">
            DIFFERENCE
          </span>
        );
      case 'FIXED':
      default:
        return (
          <span className="rounded bg-emerald-50 px-1.5 py-0.2 text-[10px] font-bold uppercase tracking-wider text-success border border-emerald-200">
            FIXED
          </span>
        );
    }
  };

  return (
    <div className="space-y-1.5">
      {/* Component Title & Metadata */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-[13px] font-bold text-ink">{component.labelEn}</span>
        {getBasisBadge()}
        {component.lookupField && (
          <span className="font-mono text-[12px] text-muted">
            {component.lookupField}
          </span>
        )}
      </div>

      {/* Charge Rows */}
      {component.basis === 'FIXED' ? (
        <div className="pl-3.5 py-0.5">
          <div className="flex items-center justify-between text-meta max-w-xl py-0.5">
            <span className="text-muted">Standard rate</span>
            <span className="font-mono text-[13px] font-medium text-ink">
              {(component.amount ?? 0).toLocaleString('en-US')} USD
            </span>
          </div>
        </div>
      ) : (
        <div className="pl-3.5 py-0.5 space-y-1">
          {component.lookupValues && component.lookupValues.length > 0 ? (
            component.lookupValues.map((row, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between text-meta max-w-xl py-0.5"
              >
                <span className="text-ink">{row.label}</span>
                <span className="font-mono text-[13px] font-medium text-ink">
                  {row.amount.toLocaleString('en-US')} USD
                </span>
              </div>
            ))
          ) : (
            <div className="text-meta text-muted">No lookup values configured.</div>
          )}
        </div>
      )}
    </div>
  );
}

/** Version table row with expand drawer */
function VersionRow({
  version,
  index,
  isCurrent,
  isExpanded,
  uniqueBases,
  onToggleExpand,
  onDelete,
}: {
  version: TariffVersion;
  index: number;
  isCurrent: boolean;
  isExpanded: boolean;
  uniqueBases: string[];
  onToggleExpand: () => void;
  onDelete: () => void;
}) {
  return (
    <>
      <tr className="transition-colors hover:bg-surface/50 text-meta">
        {/* # Column with toggle chevron */}
        <td className="py-3.5 px-3">
          <button
            type="button"
            onClick={onToggleExpand}
            className="flex items-center gap-1 font-mono text-[13px] text-ink hover:text-primary transition-colors"
          >
            {isExpanded ? (
              <ChevronUpIcon className="h-3 w-3 text-primary" weight="duotone" />
            ) : (
              <ChevronDownIcon className="h-3 w-3 text-muted" weight="duotone" />
            )}
            <span className={isExpanded ? 'font-bold text-primary' : ''}>{index}</span>
          </button>
        </td>

        {/* Effective Date */}
        <td className="py-3.5 px-3 font-medium text-ink">
          {formatDate(version.effectiveDate)}
        </td>

        {/* Until Date / CURRENT Badge */}
        <td className="py-3.5 px-3">
          {isCurrent ? (
            <span className="inline-flex items-center rounded border border-emerald-300 bg-emerald-50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-emerald-800">
              CURRENT
            </span>
          ) : (
            <span className="text-muted">
              {version.untilDate ? formatDate(version.untilDate) : '—'}
            </span>
          )}
        </td>

        {/* Basis list */}
        <td className="py-3.5 px-3 font-mono text-[11px] font-semibold text-muted uppercase">
          {uniqueBases.join('  ')}
        </td>

        {/* Amount / Component count */}
        <td className="py-3.5 px-3 text-muted">
          {version.components.length === 1 && version.components[0].basis === 'FIXED'
            ? `${(version.components[0].amount ?? 0).toLocaleString('en-US')} USD`
            : `${version.components.length} components`}
        </td>

        {/* Actions */}
        <td className="py-3.5 px-3 text-right">
          <div className="flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onToggleExpand}
              className="text-meta text-primary hover:text-primaryHover font-medium transition-colors"
            >
              {isExpanded ? 'Hide what this version charges' : 'Show what this version charges'}
            </button>
            <button
              type="button"
              onClick={onDelete}
              aria-label="Delete version"
              className="text-muted hover:text-rose-600 p-1 transition-colors"
              title="Delete version"
            >
              <TrashIcon className="h-4 w-4" strokeWidth={1.5} />
            </button>
          </div>
        </td>
      </tr>

      {/* Expanded details below the row */}
      {isExpanded && (
        <tr className="bg-surface/40">
          <td colSpan={6} className="px-6 py-4 border-b border-hairline">
            <div className="space-y-4 pl-3">
              {version.components.map((comp) => (
                <ComponentChargeItem key={comp.id} component={comp} />
              ))}
            </div>
          </td>
        </tr>
      )}
    </>
  );
}
