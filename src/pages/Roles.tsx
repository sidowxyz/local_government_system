import { useState, useMemo } from 'react';
import {
  SearchIcon,
  PlusIcon,
  TickIcon,
  InfoIcon,
  CheckIcon,
  PencilIcon,
} from '../components/icons';
import { Button } from '../components/Button';
import { Checkbox } from '../components/Checkbox';
import { CreateRoleModal } from '../components/CreateRoleModal';
import { EditRoleModal } from '../components/EditRoleModal';
import {
  initialRoles,
  featureKeys,
  featureActions,
  serviceDefinitions,
  serviceWorkflowStages,
  reportItems,
  type Role,
  type FeatureCategory,
} from '../data/roles';

type TabKey = 'features' | 'services' | 'reports';

const categories: FeatureCategory[] = [
  'Finance & Revenue',
  'Registry & Citizens',
  'Documents & Output',
  'System & Administration',
];

export function Roles() {
  const [roles, setRoles] = useState<Role[]>(initialRoles);
  const [selectedRoleId, setSelectedRoleId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<TabKey>('features');

  // Staged state for the selected role
  const [stagedFeatures, setStagedFeatures] = useState<Record<string, string[]>>({});
  const [stagedServices, setStagedServices] = useState<Record<string, string[]>>({});
  const [stagedReportScope, setStagedReportScope] = useState<'all' | 'specific'>('all');
  const [stagedReports, setStagedReports] = useState<string[]>([]);

  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [saveSuccessNotice, setSaveSuccessNotice] = useState(false);

  // Modals
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Filters inside tabs
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [featureSearch, setFeatureSearch] = useState('');
  const [serviceSearch, setServiceSearch] = useState('');
  const [reportSearch, setReportSearch] = useState('');

  const selectedRole = useMemo(() => {
    return roles.find((r) => r.id === selectedRoleId) || null;
  }, [roles, selectedRoleId]);

  // Sync staged state when selecting a role
  const handleSelectRole = (role: Role) => {
    setSelectedRoleId(role.id);
    setStagedFeatures(JSON.parse(JSON.stringify(role.featurePermissions)));
    setStagedServices(JSON.parse(JSON.stringify(role.servicePermissions)));
    setStagedReportScope(role.reportScope || 'all');
    setStagedReports([...(role.allowedReports || [])]);
    setHasUnsavedChanges(false);
    setSaveSuccessNotice(false);
  };

  // Initialize selected role on mount
  useMemo(() => {
    if (selectedRole && Object.keys(stagedFeatures).length === 0) {
      setStagedFeatures(JSON.parse(JSON.stringify(selectedRole.featurePermissions)));
      setStagedServices(JSON.parse(JSON.stringify(selectedRole.servicePermissions)));
      setStagedReportScope(selectedRole.reportScope || 'all');
      setStagedReports([...(selectedRole.allowedReports || [])]);
    }
  }, [selectedRole]);

  // Filtered roles list on left
  const filteredRoles = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return roles;
    return roles.filter(
      (r) =>
        r.name.toLowerCase().includes(term) ||
        r.code.toLowerCase().includes(term) ||
        (r.isSystem && 'system'.includes(term))
    );
  }, [roles, searchTerm]);

  // Filtered features in Tab 1
  const filteredFeatures = useMemo(() => {
    const term = featureSearch.trim().toLowerCase();
    return featureKeys.filter((f) => {
      const matchesCategory = selectedCategory === 'all' || f.category === selectedCategory;
      const matchesTerm =
        !term ||
        f.key.toLowerCase().includes(term) ||
        f.label.toLowerCase().includes(term) ||
        f.description.toLowerCase().includes(term);
      return matchesCategory && matchesTerm;
    });
  }, [selectedCategory, featureSearch]);

  // Filtered services in Tab 2
  const filteredServices = useMemo(() => {
    const term = serviceSearch.trim().toLowerCase();
    if (!term) return serviceDefinitions;
    return serviceDefinitions.filter(
      (s) =>
        s.code.toLowerCase().includes(term) ||
        s.name.toLowerCase().includes(term) ||
        s.department.toLowerCase().includes(term)
    );
  }, [serviceSearch]);

  // Filtered reports in Tab 3
  const filteredReports = useMemo(() => {
    const term = reportSearch.trim().toLowerCase();
    if (!term) return reportItems;
    return reportItems.filter(
      (r) =>
        r.name.toLowerCase().includes(term) ||
        r.code.toLowerCase().includes(term) ||
        r.department.toLowerCase().includes(term)
    );
  }, [reportSearch]);

  // Feature actions helpers
  const handleToggleFeatureAction = (key: string, action: string) => {
    if (selectedRole?.isSystem) return;

    setStagedFeatures((current) => {
      const currentActions = current[key] || [];
      const hasAction = currentActions.includes(action);
      const nextActions = hasAction
        ? currentActions.filter((a) => a !== action)
        : [...currentActions, action];

      setHasUnsavedChanges(true);
      setSaveSuccessNotice(false);
      return {
        ...current,
        [key]: nextActions,
      };
    });
  };

  const handleSetFeaturePreset = (key: string, preset: 'full' | 'readonly' | 'clear') => {
    if (selectedRole?.isSystem) return;

    setStagedFeatures((current) => {
      let nextActions: string[] = [];
      if (preset === 'full') {
        nextActions = [...featureActions];
      } else if (preset === 'readonly') {
        nextActions = ['view'];
      }

      setHasUnsavedChanges(true);
      setSaveSuccessNotice(false);
      return {
        ...current,
        [key]: nextActions,
      };
    });
  };

  const handleCategoryGrantAll = (category: FeatureCategory, grant: boolean) => {
    if (selectedRole?.isSystem) return;

    setStagedFeatures((current) => {
      const next = { ...current };
      featureKeys
        .filter((f) => f.category === category)
        .forEach((f) => {
          next[f.key] = grant ? [...featureActions] : [];
        });

      setHasUnsavedChanges(true);
      setSaveSuccessNotice(false);
      return next;
    });
  };

  // Service actions helpers
  const handleToggleServiceAction = (code: string, action: string) => {
    if (selectedRole?.isSystem) return;

    setStagedServices((current) => {
      const currentActions = current[code] || [];
      const hasAction = currentActions.includes(action);
      const nextActions = hasAction
        ? currentActions.filter((a) => a !== action)
        : [...currentActions, action];

      setHasUnsavedChanges(true);
      setSaveSuccessNotice(false);
      return {
        ...current,
        [code]: nextActions,
      };
    });
  };

  const handleSetServicePreset = (
    code: string,
    preset: 'full' | 'approver' | 'intake' | 'clear'
  ) => {
    if (selectedRole?.isSystem) return;

    let actions: string[] = [];
    if (preset === 'full') {
      actions = [
        'view', 'create', 'submit', 'accept', 'pass', 'verify', 'complete', 'review',
        'approve', 'confirm', 'issue', 'collect', 'return', 'reject', 'cancel',
        'print', 'reprint', 'attach', 'amend', 'expedite'
      ];
    } else if (preset === 'approver') {
      actions = ['view', 'verify', 'review', 'approve', 'confirm', 'issue', 'reject', 'print'];
    } else if (preset === 'intake') {
      actions = ['view', 'create', 'submit', 'accept', 'attach', 'print'];
    }

    setStagedServices((current) => {
      setHasUnsavedChanges(true);
      setSaveSuccessNotice(false);
      return {
        ...current,
        [code]: actions,
      };
    });
  };

  // Report toggle
  const handleToggleReport = (reportId: string) => {
    if (selectedRole?.isSystem) return;

    setStagedReports((current) => {
      const exists = current.includes(reportId);
      const next = exists
        ? current.filter((id) => id !== reportId)
        : [...current, reportId];

      setHasUnsavedChanges(true);
      setSaveSuccessNotice(false);
      return next;
    });
  };

  // Save changes
  const handleSaveAll = () => {
    if (!selectedRole) return;

    setRoles((current) =>
      current.map((r) =>
        r.id === selectedRole.id
          ? {
            ...r,
            featurePermissions: stagedFeatures,
            servicePermissions: stagedServices,
            reportScope: stagedReportScope,
            allowedReports: stagedReports,
          }
          : r
      )
    );
    setHasUnsavedChanges(false);
    setSaveSuccessNotice(true);
    setTimeout(() => setSaveSuccessNotice(false), 3500);
  };

  // Reset changes
  const handleReset = () => {
    if (!selectedRole) return;
    setStagedFeatures(JSON.parse(JSON.stringify(selectedRole.featurePermissions)));
    setStagedServices(JSON.parse(JSON.stringify(selectedRole.servicePermissions)));
    setStagedReportScope(selectedRole.reportScope || 'all');
    setStagedReports([...(selectedRole.allowedReports || [])]);
    setHasUnsavedChanges(false);
  };

  // Deactivate role
  const handleToggleDeactivate = () => {
    if (!selectedRole || selectedRole.isSystem) return;
    const newStatus = selectedRole.status === 'Inactive' ? 'Active' : 'Inactive';
    const updated = { ...selectedRole, status: newStatus as 'Active' | 'Inactive' };
    setRoles((current) =>
      current.map((r) => (r.id === selectedRole.id ? updated : r))
    );
  };

  // Update role metadata
  const handleUpdateRole = (updated: Role) => {
    setRoles((current) =>
      current.map((r) => (r.id === updated.id ? updated : r))
    );
  };

  // Add new role
  const handleAddRole = (newRole: Role) => {
    setRoles((current) => [...current, newRole]);
    handleSelectRole(newRole);
  };

  // Summary counts
  const totalGrantedFeatures = useMemo(() => {
    return Object.values(stagedFeatures).filter((actions) => actions.length > 0).length;
  }, [stagedFeatures]);

  const totalGrantedServices = useMemo(() => {
    return Object.values(stagedServices).filter((actions) => actions.length > 0).length;
  }, [stagedServices]);

  return (
    <section
      aria-labelledby="roles-heading"
      className="flex min-h-0 flex-1 flex-col"
    >
      {/* Unified Master Big Card Container */}
      <div className="flex max-h-full min-h-0 flex-1 flex-col overflow-hidden rounded-2xl border border-hairline bg-white shadow-card">
        {/* Integrated Card Top Header */}
        <div className="border-b border-hairline bg-white px-6 py-5 shrink-0">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            {/* Title */}
            <div>
              <h1 id="roles-heading" className="text-xl font-bold tracking-tight text-ink sm:text-2xl">
                Roles & access
              </h1>
            </div>

            {/* Dynamic Action Button inside Card */}
            <div className="flex items-center gap-3">
              <Button
                onClick={() => setIsCreateModalOpen(true)}
                className="shadow-sm transition-all duration-150 hover:shadow"
              >
                <PlusIcon className="h-4 w-4" strokeWidth={2} />
                <span>Add Role</span>
              </Button>
            </div>
          </div>
        </div>

        {/* Master-Detail Split Layout inside Card */}
        <div className="flex min-h-0 flex-1 flex-col gap-4 overflow-auto p-3 sm:p-4 lg:flex-row lg:overflow-hidden">
          {/* Left Column: Roles list */}
          <div className="flex min-h-[260px] w-full shrink-0 flex-col overflow-hidden rounded-xl border border-hairline bg-surface/30 lg:min-h-0 lg:w-64 xl:w-72">
            {/* Search bar */}
            <div className="border-b border-hairline bg-white p-4">
              <div className="relative">
                <label htmlFor="role-search" className="sr-only">
                  Search roles
                </label>
                <SearchIcon
                  className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted"
                  strokeWidth={1.75}
                />
                <input
                  id="role-search"
                  type="search"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search roles..."
                  className="w-full rounded-lg border border-hairline bg-white py-2.5 pl-9 pr-3 text-body text-ink placeholder:text-muted/70 shadow-card transition-all duration-150 ease-standard focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
            </div>

            {/* Roles List */}
            <div className="min-h-0 flex-1 overflow-y-auto no-scrollbar divide-y divide-hairline bg-white">
              {filteredRoles.length === 0 ? (
                <div className="p-6 text-center">
                  <p className="text-body font-medium text-ink">No roles found</p>
                  <p className="mt-1 text-meta text-muted">
                    No roles match "{searchTerm}".
                  </p>
                </div>
              ) : (
                filteredRoles.map((role) => {
                  const isSelected = selectedRoleId === role.id;
                  return (
                    <button
                      key={role.id}
                      type="button"
                      onClick={() => handleSelectRole(role)}
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
                          {role.name}
                        </span>
                        {role.isSystem && (
                          <span className="shrink-0 rounded-full border border-gold/30 bg-goldLight px-1.5 py-0.2 text-[9px] font-semibold uppercase tracking-wider text-ink">
                            system
                          </span>
                        )}
                        {role.status === 'Inactive' && !role.isSystem && (
                          <span className="shrink-0 rounded-full border border-hairline bg-surface px-1.5 py-0.2 text-[9px] font-medium uppercase tracking-wider text-muted">
                            Inactive
                          </span>
                        )}
                      </div>

                      <div className="mt-0.5 flex items-center gap-1.5">
                        <span className="font-mono text-[11px] font-medium text-muted">
                          {role.code}
                        </span>
                        {role.userCount !== undefined && (
                          <>
                            <span className="text-[10px] text-muted/60">•</span>
                            <span className="text-[11px] text-muted">
                              {role.userCount} {role.userCount === 1 ? 'user' : 'users'}
                            </span>
                          </>
                        )}
                      </div>
                    </button>
                  );
                })
              )}
            </div>

            {/* Footer count */}
            <div className="shrink-0 border-t border-hairline bg-surface/30 px-3.5 py-2 text-meta text-muted">
              {filteredRoles.length} {filteredRoles.length === 1 ? 'role' : 'roles'}
            </div>
          </div>

          {/* Right Column: Role Detail View with Clean Structured Design */}
          <div className="flex min-h-[420px] min-w-0 flex-1 flex-col overflow-hidden rounded-xl border border-hairline bg-white lg:min-h-0">
          {!selectedRole ? (
            <div className="flex flex-1 flex-col items-center justify-center p-12 text-center">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl border border-hairline bg-surface/80 text-muted shadow-xs">
                <span className="block h-6 w-6 rounded border-2 border-dashed border-muted/70" />
              </div>
              <h3 className="text-display font-semibold text-ink">Choose a role</h3>
              <p className="mt-1 max-w-sm text-body text-muted">
                Its permissions appear here.
              </p>
            </div>
          ) : (
            <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
              {/* Streamlined Top Header */}
              <div className="border-b border-hairline bg-white px-5 py-3.5">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  {/* Left: Role identity */}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <h2 className="text-display font-bold text-ink">
                        {selectedRole.name}
                      </h2>
                      <span className="font-mono rounded-md border border-hairline bg-surface px-2 py-0.5 text-meta font-medium text-ink">
                        {selectedRole.code}
                      </span>
                      {selectedRole.isSystem && (
                        <span className="rounded-full border border-gold/30 bg-goldLight px-2 py-0.2 text-[10px] font-semibold uppercase tracking-wider text-ink">
                          system
                        </span>
                      )}
                      {selectedRole.status === 'Inactive' && !selectedRole.isSystem && (
                        <span className="rounded-full border border-hairline bg-surface px-2 py-0.2 text-[10px] font-medium text-muted">
                          Inactive
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Right: Grants Summary & Actions */}
                  <div className="flex items-center gap-3 shrink-0">
                    {/* Compact stats pill */}
                    <div className="hidden sm:flex items-center gap-1.5 text-meta text-muted bg-surface/70 px-2.5 py-1 rounded-lg border border-hairline">
                      <span><strong className="text-ink font-semibold">{totalGrantedFeatures}</strong>/31 feats</span>
                      <span className="text-muted/40">•</span>
                      <span><strong className="text-ink font-semibold">{totalGrantedServices}</strong>/7 svcs</span>
                      <span className="text-muted/40">•</span>
                      <span><strong className="text-ink font-semibold">{stagedReportScope === 'all' ? 'All' : stagedReports.length}</strong> reps</span>
                    </div>

                    <Button
                      variant="secondary"
                      onClick={() => setIsEditModalOpen(true)}
                      className="py-1 px-2.5 text-meta"
                    >
                      <PencilIcon className="h-3.5 w-3.5" />
                      Rename
                    </Button>

                    {!selectedRole.isSystem && (
                      <Button
                        variant="secondary"
                        onClick={handleToggleDeactivate}
                        className={`py-1 px-2.5 text-meta ${selectedRole.status === 'Inactive'
                            ? 'text-emerald-700 hover:text-emerald-800'
                            : 'text-rose-600 hover:text-rose-700 hover:border-rose-200'
                          }`}
                      >
                        {selectedRole.status === 'Inactive' ? 'Activate' : 'Deactivate'}
                      </Button>
                    )}

                    {!selectedRole.isSystem && hasUnsavedChanges && (
                      <div className="flex items-center gap-1.5">
                        <Button
                          variant="secondary"
                          onClick={handleReset}
                          className="py-1 px-2.5 text-meta"
                        >
                          Cancel
                        </Button>
                        <Button
                          onClick={handleSaveAll}
                          className="py-1 px-3 text-meta shadow-sm"
                        >
                          <TickIcon className="h-3.5 w-3.5" />
                          Save changes
                        </Button>
                      </div>
                    )}
                  </div>
                </div>

                {/* System notification banner if system role */}
                {selectedRole.isSystem && (
                  <div className="mt-2.5 flex items-center gap-2 rounded-md border border-amber-200 bg-amber-50/70 px-3 py-1.5 text-meta text-amber-900">
                    <InfoIcon className="h-3.5 w-3.5 shrink-0 text-amber-700" />
                    <span>
                      Super Administrator is a protected system role with all platform authorizations.
                    </span>
                  </div>
                )}

                {/* Save success notice */}
                {saveSuccessNotice && (
                  <div className="mt-2.5 flex items-center gap-2 rounded-md border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-meta text-emerald-900">
                    <CheckIcon className="h-3.5 w-3.5 shrink-0 text-emerald-700" />
                    <span>Permissions successfully updated.</span>
                  </div>
                )}
              </div>

              {/* Combined Navigation & Filters Bar */}
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-hairline bg-surface/50 px-5 py-2">
                {/* Left: Main Tabs */}
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => setActiveTab('features')}
                    className={[
                      'inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-meta font-medium transition-colors',
                      activeTab === 'features'
                        ? 'bg-white text-primary font-semibold shadow-xs border border-hairline'
                        : 'text-muted hover:text-ink hover:bg-surface',
                    ].join(' ')}
                  >
                    <span>Features</span>
                    <span
                      className={[
                        'rounded-full px-1.5 py-0.2 text-[11px]',
                        activeTab === 'features'
                          ? 'bg-primaryLight text-primary font-semibold'
                          : 'bg-surface text-muted',
                      ].join(' ')}
                    >
                      31
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveTab('services')}
                    className={[
                      'inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-meta font-medium transition-colors',
                      activeTab === 'services'
                        ? 'bg-white text-primary font-semibold shadow-xs border border-hairline'
                        : 'text-muted hover:text-ink hover:bg-surface',
                    ].join(' ')}
                  >
                    <span>Service definitions</span>
                    <span
                      className={[
                        'rounded-full px-1.5 py-0.2 text-[11px]',
                        activeTab === 'services'
                          ? 'bg-primaryLight text-primary font-semibold'
                          : 'bg-surface text-muted',
                      ].join(' ')}
                    >
                      7
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveTab('reports')}
                    className={[
                      'inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-meta font-medium transition-colors',
                      activeTab === 'reports'
                        ? 'bg-white text-primary font-semibold shadow-xs border border-hairline'
                        : 'text-muted hover:text-ink hover:bg-surface',
                    ].join(' ')}
                  >
                    <span>Reports</span>
                    <span
                      className={[
                        'rounded-full px-1.5 py-0.2 text-[11px]',
                        activeTab === 'reports'
                          ? 'bg-primaryLight text-primary font-semibold'
                          : 'bg-surface text-muted',
                      ].join(' ')}
                    >
                      11
                    </span>
                  </button>
                </div>

                {/* Right: Sub-filter & Search based on Active Tab */}
                <div className="flex items-center gap-2">
                  {activeTab === 'features' && (
                    <>
                      {/* Compact Category Selector */}
                      <div className="hidden xl:flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => setSelectedCategory('all')}
                          className={[
                            'rounded-md px-2 py-1 text-[11px] font-medium transition-colors',
                            selectedCategory === 'all'
                              ? 'bg-primary/10 text-primary font-semibold'
                              : 'text-muted hover:text-ink',
                          ].join(' ')}
                        >
                          All
                        </button>
                        {categories.map((cat) => (
                          <button
                            key={cat}
                            type="button"
                            onClick={() => setSelectedCategory(cat)}
                            className={[
                              'rounded-md px-2 py-1 text-[11px] font-medium transition-colors',
                              selectedCategory === cat
                                ? 'bg-primary/10 text-primary font-semibold'
                                : 'text-muted hover:text-ink',
                            ].join(' ')}
                          >
                            {cat.split(' ')[0]}
                          </button>
                        ))}
                      </div>

                      <div className="relative w-48">
                        <SearchIcon className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted" />
                        <input
                          type="search"
                          value={featureSearch}
                          onChange={(e) => setFeatureSearch(e.target.value)}
                          placeholder="Search features..."
                          className="w-full rounded-md border border-hairline bg-white py-1 pl-8 pr-2 text-meta text-ink placeholder:text-muted/70 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/20"
                        />
                      </div>
                    </>
                  )}

                  {activeTab === 'services' && (
                    <div className="relative w-52">
                      <SearchIcon className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted" />
                      <input
                        type="search"
                        value={serviceSearch}
                        onChange={(e) => setServiceSearch(e.target.value)}
                        placeholder="Search services..."
                        className="w-full rounded-md border border-hairline bg-white py-1 pl-8 pr-2 text-meta text-ink placeholder:text-muted/70 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/20"
                      />
                    </div>
                  )}

                  {activeTab === 'reports' && (
                    <div className="relative w-52">
                      <SearchIcon className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted" />
                      <input
                        type="search"
                        value={reportSearch}
                        onChange={(e) => setReportSearch(e.target.value)}
                        placeholder="Search reports..."
                        className="w-full rounded-md border border-hairline bg-white py-1 pl-8 pr-2 text-meta text-ink placeholder:text-muted/70 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/20"
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Tab Content Panes */}
              <div className="min-h-0 flex-1 overflow-hidden flex flex-col bg-surface/20">
                {/* TAB 1: FEATURES (Structured Categories View) */}
                {activeTab === 'features' && (
                  <div className="flex min-h-0 flex-1 flex-col overflow-hidden">

                    {/* Features Content List */}
                    <div className="min-h-0 flex-1 overflow-y-auto p-5 space-y-5">
                      {categories
                        .filter(
                          (cat) => selectedCategory === 'all' || selectedCategory === cat
                        )
                        .map((cat) => {
                          const catFeatures = filteredFeatures.filter(
                            (f) => f.category === cat
                          );
                          if (catFeatures.length === 0) return null;

                          return (
                            <div
                              key={cat}
                              className="rounded-xl border border-hairline bg-white shadow-xs overflow-hidden"
                            >
                              {/* Category Header */}
                              <div className="flex items-center justify-between border-b border-hairline bg-surface/60 px-4 py-2.5">
                                <div className="flex items-center gap-2">
                                  <span className="text-body font-semibold text-ink">
                                    {cat}
                                  </span>
                                  <span className="rounded-full bg-white px-2 py-0.5 text-[11px] font-medium text-muted border border-hairline">
                                    {catFeatures.length}
                                  </span>
                                </div>

                                {!selectedRole.isSystem && (
                                  <div className="flex items-center gap-3 text-meta">
                                    <button
                                      type="button"
                                      onClick={() => handleCategoryGrantAll(cat, true)}
                                      className="text-primary hover:underline font-medium"
                                    >
                                      Grant category
                                    </button>
                                    <span className="text-muted/40">•</span>
                                    <button
                                      type="button"
                                      onClick={() => handleCategoryGrantAll(cat, false)}
                                      className="text-muted hover:text-ink hover:underline"
                                    >
                                      Clear
                                    </button>
                                  </div>
                                )}
                              </div>

                              {/* Features Rows */}
                              <div className="divide-y divide-hairline">
                                {catFeatures.map((f) => {
                                  const granted = stagedFeatures[f.key] || [];
                                  const isFull =
                                    selectedRole.isSystem ||
                                    featureActions.every((a) => granted.includes(a));
                                  const isReadOnly =
                                    !isFull &&
                                    granted.length === 1 &&
                                    granted.includes('view');

                                  return (
                                    <div
                                      key={f.key}
                                      className="p-4 transition-colors hover:bg-surface/30"
                                    >
                                      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                                        {/* Left: Feature title */}
                                        <div className="min-w-0 flex-1">
                                          <span className="text-body font-semibold text-ink">
                                            {f.label}
                                          </span>
                                        </div>

                                        {/* Right: Quick Preset Toggles */}
                                        {!selectedRole.isSystem && (
                                          <div className="flex items-center gap-1.5 shrink-0">
                                            <button
                                              type="button"
                                              onClick={() =>
                                                handleSetFeaturePreset(f.key, 'full')
                                              }
                                              className={[
                                                'rounded px-2 py-1 text-[11px] font-medium transition-colors border',
                                                isFull
                                                  ? 'border-primary bg-primaryLight text-primary font-semibold'
                                                  : 'border-hairline bg-surface/50 text-muted hover:text-ink',
                                              ].join(' ')}
                                            >
                                              Full
                                            </button>
                                            <button
                                              type="button"
                                              onClick={() =>
                                                handleSetFeaturePreset(f.key, 'readonly')
                                              }
                                              className={[
                                                'rounded px-2 py-1 text-[11px] font-medium transition-colors border',
                                                isReadOnly
                                                  ? 'border-primary bg-primaryLight text-primary font-semibold'
                                                  : 'border-hairline bg-surface/50 text-muted hover:text-ink',
                                              ].join(' ')}
                                            >
                                              View only
                                            </button>
                                            <button
                                              type="button"
                                              onClick={() =>
                                                handleSetFeaturePreset(f.key, 'clear')
                                              }
                                              className="rounded px-2 py-1 text-[11px] font-medium text-muted hover:text-rose-600 transition-colors"
                                            >
                                              Clear
                                            </button>
                                          </div>
                                        )}
                                      </div>

                                      {/* Action Chips / Checkboxes */}
                                      <div className="mt-3 flex flex-wrap items-center gap-1.5 pt-1">
                                        {featureActions.map((action) => {
                                          const isChecked =
                                            selectedRole.isSystem ||
                                            granted.includes(action);

                                          return (
                                            <label
                                              key={action}
                                              className={[
                                                'inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-meta transition-all select-none',
                                                isChecked
                                                  ? 'border-primary/40 bg-primary/5 text-primary font-medium shadow-2xs'
                                                  : 'border-hairline bg-white text-muted hover:border-hairline hover:bg-surface/50 hover:text-ink',
                                                selectedRole.isSystem
                                                  ? 'cursor-default'
                                                  : 'cursor-pointer',
                                              ].join(' ')}
                                            >
                                              <Checkbox
                                                checked={isChecked}
                                                disabled={selectedRole.isSystem}
                                                onChange={() =>
                                                  handleToggleFeatureAction(
                                                    f.key,
                                                    action
                                                  )
                                                }
                                              />
                                              <span>{action}</span>
                                            </label>
                                          );
                                        })}
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          );
                        })}
                    </div>
                  </div>
                )}

                {/* TAB 2: SERVICE DEFINITIONS (Clean Structured Cards) */}
                {activeTab === 'services' && (
                  <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
                    {/* Search bar */}
                    <div className="flex shrink-0 items-center justify-between border-b border-hairline bg-white px-5 py-3">
                      <div className="relative w-64">
                        <SearchIcon className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted" />
                        <input
                          type="search"
                          value={serviceSearch}
                          onChange={(e) => setServiceSearch(e.target.value)}
                          placeholder="Search 7 services..."
                          className="w-full rounded-md border border-hairline bg-surface/40 py-1.5 pl-8 pr-2.5 text-meta text-ink placeholder:text-muted/70 focus:border-primary focus:bg-white focus:outline-none focus:ring-1 focus:ring-primary/20"
                        />
                      </div>
                      <span className="text-meta text-muted">
                        Showing {filteredServices.length} of 7 public services
                      </span>
                    </div>

                    {/* Service Cards List */}
                    <div className="min-h-0 flex-1 overflow-y-auto p-5 space-y-5">
                      {filteredServices.map((service) => {
                        const granted = stagedServices[service.code] || [];
                        const isFull =
                          selectedRole.isSystem || granted.length === 20;

                        return (
                          <div
                            key={service.code}
                            className="rounded-xl border border-hairline bg-white shadow-xs overflow-hidden"
                          >
                            {/* Service Card Header */}
                            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-hairline bg-surface/50 p-4">
                              <div>
                                <h3 className="text-body font-bold text-ink">
                                  {service.name}
                                </h3>
                              </div>

                              {/* Service Presets */}
                              {!selectedRole.isSystem && (
                                <div className="flex items-center gap-1.5">
                                  <button
                                    type="button"
                                    onClick={() =>
                                      handleSetServicePreset(service.code, 'full')
                                    }
                                    className={[
                                      'rounded px-2.5 py-1 text-meta font-medium transition-colors border',
                                      isFull
                                        ? 'border-primary bg-primaryLight text-primary font-semibold'
                                        : 'border-hairline bg-white text-muted hover:text-ink',
                                    ].join(' ')}
                                  >
                                    Full access
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() =>
                                      handleSetServicePreset(
                                        service.code,
                                        'approver'
                                      )
                                    }
                                    className="rounded border border-hairline bg-white px-2.5 py-1 text-meta font-medium text-muted hover:text-ink transition-colors"
                                  >
                                    Approval only
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() =>
                                      handleSetServicePreset(
                                        service.code,
                                        'intake'
                                      )
                                    }
                                    className="rounded border border-hairline bg-white px-2.5 py-1 text-meta font-medium text-muted hover:text-ink transition-colors"
                                  >
                                    Intake only
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() =>
                                      handleSetServicePreset(
                                        service.code,
                                        'clear'
                                      )
                                    }
                                    className="rounded px-2 py-1 text-meta font-medium text-muted hover:text-rose-600 transition-colors"
                                  >
                                    Clear
                                  </button>
                                </div>
                              )}
                            </div>

                            {/* Service Stages Grid (4 Workflow Stage Columns) */}
                            <div className="grid grid-cols-1 divide-y divide-hairline md:grid-cols-2 md:divide-x md:divide-y-0 lg:grid-cols-4 bg-white">
                              {serviceWorkflowStages.map((stage) => (
                                <div key={stage.name} className="p-3.5 space-y-2">
                                  <div className="text-[11px] font-semibold uppercase tracking-wider text-muted/80">
                                    {stage.name}
                                  </div>
                                  <div className="flex flex-wrap gap-1.5">
                                    {stage.actions.map((action) => {
                                      const isChecked =
                                        selectedRole.isSystem ||
                                        granted.includes(action);

                                      return (
                                        <label
                                          key={action}
                                          className={[
                                            'inline-flex items-center gap-1.5 rounded-md border px-2 py-0.5 text-meta transition-all select-none',
                                            isChecked
                                              ? 'border-primary/40 bg-primary/5 text-primary font-medium'
                                              : 'border-hairline bg-surface/30 text-muted hover:text-ink hover:bg-surface',
                                            selectedRole.isSystem
                                              ? 'cursor-default'
                                              : 'cursor-pointer',
                                          ].join(' ')}
                                        >
                                          <Checkbox
                                            checked={isChecked}
                                            disabled={selectedRole.isSystem}
                                            onChange={() =>
                                              handleToggleServiceAction(
                                                service.code,
                                                action
                                              )
                                            }
                                          />
                                          <span className="capitalize">
                                            {action}
                                          </span>
                                        </label>
                                      );
                                    })}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* TAB 3: REPORTS (Structured Scope Selector & Report Cards) */}
                {activeTab === 'reports' && (
                  <div className="min-h-0 flex-1 overflow-y-auto p-5 space-y-5">
                    {/* Radio Options Cards */}
                    <div className="grid grid-cols-1 gap-3.5 md:grid-cols-2">
                      {/* Option 1: Automatic Scope */}
                      <label
                        className={[
                          'flex items-start gap-3.5 rounded-xl border p-4 transition-all duration-150',
                          stagedReportScope === 'all'
                            ? 'border-primary bg-primaryLight/40 shadow-xs ring-1 ring-primary/20'
                            : 'border-hairline bg-white hover:bg-surface/50 cursor-pointer',
                        ].join(' ')}
                      >
                        <input
                          type="radio"
                          name="report-scope"
                          value="all"
                          checked={stagedReportScope === 'all'}
                          disabled={selectedRole.isSystem}
                          onChange={() => {
                            setStagedReportScope('all');
                            setHasUnsavedChanges(true);
                            setSaveSuccessNotice(false);
                          }}
                          className="mt-0.5 h-4 w-4 shrink-0 accent-primary"
                        />
                        <div>
                          <div className="text-body font-semibold text-ink">
                            All permitted reports
                          </div>
                          <p className="mt-1 text-meta text-muted leading-relaxed">
                            Includes reports added by future services.
                          </p>
                        </div>
                      </label>

                      {/* Option 2: Custom Ticked Scope */}
                      <label
                        className={[
                          'flex items-start gap-3.5 rounded-xl border p-4 transition-all duration-150',
                          stagedReportScope === 'specific'
                            ? 'border-primary bg-primaryLight/40 shadow-xs ring-1 ring-primary/20'
                            : 'border-hairline bg-white hover:bg-surface/50 cursor-pointer',
                        ].join(' ')}
                      >
                        <input
                          type="radio"
                          name="report-scope"
                          value="specific"
                          checked={stagedReportScope === 'specific'}
                          disabled={selectedRole.isSystem}
                          onChange={() => {
                            setStagedReportScope('specific');
                            setHasUnsavedChanges(true);
                            setSaveSuccessNotice(false);
                          }}
                          className="mt-0.5 h-4 w-4 shrink-0 accent-primary"
                        />
                        <div>
                          <div className="text-body font-semibold text-ink">
                            Selected reports only
                          </div>
                          <p className="mt-1 text-meta text-muted leading-relaxed">
                            Narrows access without granting new permissions.
                          </p>
                        </div>
                      </label>
                    </div>

                    {/* Reports List Grid */}
                    <div
                      className={[
                        'rounded-xl border border-hairline bg-white overflow-hidden shadow-xs transition-opacity',
                        stagedReportScope === 'all' && !selectedRole.isSystem
                          ? 'opacity-65 pointer-events-none'
                          : 'opacity-100',
                      ].join(' ')}
                    >
                      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-hairline bg-surface/50 px-5 py-3">
                        <div className="flex items-center gap-3">
                          <span className="text-meta font-semibold uppercase tracking-wider text-muted">
                            Available Reports (11)
                          </span>
                          <div className="relative w-48">
                            <SearchIcon className="pointer-events-none absolute left-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted" />
                            <input
                              type="search"
                              value={reportSearch}
                              onChange={(e) => setReportSearch(e.target.value)}
                              placeholder="Search report..."
                              className="w-full rounded border border-hairline bg-white py-1 pl-7 pr-2 text-meta text-ink placeholder:text-muted/70 focus:border-primary focus:outline-none"
                            />
                          </div>
                        </div>

                        {stagedReportScope === 'specific' && !selectedRole.isSystem && (
                          <div className="flex items-center gap-3 text-meta">
                            <button
                              type="button"
                              onClick={() => {
                                setStagedReports(reportItems.map((r) => r.id));
                                setHasUnsavedChanges(true);
                              }}
                              className="text-primary hover:underline font-medium"
                            >
                              Select all
                            </button>
                            <span className="text-muted/50">•</span>
                            <button
                              type="button"
                              onClick={() => {
                                setStagedReports([]);
                                setHasUnsavedChanges(true);
                              }}
                              className="text-muted hover:text-ink hover:underline"
                            >
                              Deselect all
                            </button>
                          </div>
                        )}
                      </div>

                      <div className="grid grid-cols-1 divide-y divide-hairline md:grid-cols-2 md:divide-x md:divide-y-0">
                        {/* Column 1 */}
                        <div className="divide-y divide-hairline">
                          {filteredReports
                            .slice(0, Math.ceil(filteredReports.length / 2))
                            .map((report) => {
                              const isTicked =
                                stagedReportScope === 'all' ||
                                selectedRole.isSystem ||
                                stagedReports.includes(report.id);

                              return (
                                <div
                                  key={report.id}
                                  className="flex items-center justify-between p-4 hover:bg-surface/40 transition-colors"
                                >
                                  <Checkbox
                                    checked={isTicked}
                                    disabled={
                                      stagedReportScope === 'all' ||
                                      selectedRole.isSystem
                                    }
                                    onChange={() => handleToggleReport(report.id)}
                                    label={report.name}
                                    description={report.code}
                                    className="flex-1 pr-3"
                                  />
                                  <span className="shrink-0 rounded-md border border-hairline bg-surface/70 px-2 py-0.5 text-[11px] font-medium text-muted">
                                    {report.department}
                                  </span>
                                </div>
                              );
                            })}
                        </div>

                        {/* Column 2 */}
                        <div className="divide-y divide-hairline">
                          {filteredReports
                            .slice(Math.ceil(filteredReports.length / 2))
                            .map((report) => {
                              const isTicked =
                                stagedReportScope === 'all' ||
                                selectedRole.isSystem ||
                                stagedReports.includes(report.id);

                              return (
                                <div
                                  key={report.id}
                                  className="flex items-center justify-between p-4 hover:bg-surface/40 transition-colors"
                                >
                                  <Checkbox
                                    checked={isTicked}
                                    disabled={
                                      stagedReportScope === 'all' ||
                                      selectedRole.isSystem
                                    }
                                    onChange={() => handleToggleReport(report.id)}
                                    label={report.name}
                                    description={report.code}
                                    className="flex-1 pr-3"
                                  />
                                  <span className="shrink-0 rounded-md border border-hairline bg-surface/70 px-2 py-0.5 text-[11px] font-medium text-muted">
                                    {report.department}
                                  </span>
                                </div>
                              );
                            })}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
      </div>

      {/* Create Role Modal */}
      <CreateRoleModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSave={handleAddRole}
      />

      {/* Edit Role Modal */}
      <EditRoleModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        role={selectedRole}
        onSave={handleUpdateRole}
      />
    </section>
  );
}
