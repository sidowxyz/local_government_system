import { useState, useMemo, useEffect } from 'react';
import {
  SearchIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  ArrowRightIcon,
  AlertCircleIcon,
  MapPinIcon,
  Building2Icon,
} from '../components/icons';
import { PageHeading } from '../components/PageHeading';
import { Button } from '../components/Button';
import { Listbox } from '../components/Listbox';
import { EmptyState } from '../components/EmptyState';
import { CreateOfficeModal } from '../components/CreateOfficeModal';
import { CreateLocationModal } from '../components/CreateLocationModal';
import { CreateDepartmentModal } from '../components/CreateDepartmentModal';
import { EditLocationModal } from '../components/EditLocationModal';
import { EditDepartmentModal } from '../components/EditDepartmentModal';
import { EditOfficeModal } from '../components/EditOfficeModal';
import { MoveModal } from '../components/MoveModal';
import { RetireModal } from '../components/RetireModal';
import {
  initialLocations,
  initialDepartments,
  initialOffices,
  type LocationItem,
  type DepartmentItem,
  type OfficeItem,
  type LocationType,
} from '../data/organisation';

type TabKey = 'locations' | 'departments' | 'offices';

const headerClasses =
  'px-5 py-3 text-meta font-medium uppercase tracking-[0.06em] text-muted';
const PAGE_SIZE = 8;

export function Organisation() {
  const [activeTab, setActiveTab] = useState<TabKey>('locations');

  // State for organisation entities
  const [locations, setLocations] = useState<LocationItem[]>(initialLocations);
  const [departments, setDepartments] = useState<DepartmentItem[]>(initialDepartments);
  const [offices, setOffices] = useState<OfficeItem[]>(initialOffices);

  // Search terms
  const [locationSearch, setLocationSearch] = useState('');
  const [locationTypeFilter, setLocationTypeFilter] = useState<string>('all');
  const [departmentSearch, setDepartmentSearch] = useState('');
  const [officeSearch, setOfficeSearch] = useState('');
  const [officeDeptFilter, setOfficeDeptFilter] = useState('all');
  const [locationPage, setLocationPage] = useState(1);
  const [departmentPage, setDepartmentPage] = useState(1);
  const [officePage, setOfficePage] = useState(1);

  // Creation Modals
  const [isCreateOfficeOpen, setIsCreateOfficeOpen] = useState(false);
  const [isCreateLocationOpen, setIsCreateLocationOpen] = useState(false);
  const [isCreateDeptOpen, setIsCreateDeptOpen] = useState(false);

  // Edit Modals
  const [editingLocation, setEditingLocation] = useState<LocationItem | null>(null);
  const [editingDepartment, setEditingDepartment] = useState<DepartmentItem | null>(null);
  const [editingOffice, setEditingOffice] = useState<OfficeItem | null>(null);

  // Move Modal
  const [movingItem, setMovingItem] = useState<{
    code: string;
    options: { code: string; name: string }[];
    onConfirm: (newParent: string) => void;
  } | null>(null);

  // Retire Modal
  const [retiringItem, setRetiringItem] = useState<{
    code: string;
    name: string;
    onConfirm: () => void;
  } | null>(null);

  // Filtered lists
  const filteredLocations = useMemo(() => {
    const term = locationSearch.trim().toLowerCase();
    return locations.filter((loc) => {
      const matchesType =
        locationTypeFilter === 'all' || loc.type === locationTypeFilter;
      const matchesTerm =
        !term ||
        loc.name.toLowerCase().includes(term) ||
        loc.code.toLowerCase().includes(term) ||
        (loc.nameSomali && loc.nameSomali.toLowerCase().includes(term)) ||
        loc.type.toLowerCase().includes(term);
      return matchesType && matchesTerm;
    });
  }, [locations, locationSearch, locationTypeFilter]);

  const filteredDepartments = useMemo(() => {
    const term = departmentSearch.trim().toLowerCase();
    return departments.filter(
      (dept) =>
        !term ||
        dept.name.toLowerCase().includes(term) ||
        dept.code.toLowerCase().includes(term) ||
        (dept.nameSomali && dept.nameSomali.toLowerCase().includes(term))
    );
  }, [departments, departmentSearch]);

  const filteredOffices = useMemo(() => {
    const term = officeSearch.trim().toLowerCase();
    return offices.filter((off) => {
      const matchesDept =
        officeDeptFilter === 'all' || off.departmentCode === officeDeptFilter;
      const matchesTerm =
        !term ||
        off.name.toLowerCase().includes(term) ||
        off.code.toLowerCase().includes(term) ||
        (off.nameSomali && off.nameSomali.toLowerCase().includes(term)) ||
        off.departmentName.toLowerCase().includes(term) ||
        (off.locationName && off.locationName.toLowerCase().includes(term));
      return matchesDept && matchesTerm;
    });
  }, [offices, officeSearch, officeDeptFilter]);

  useEffect(() => setLocationPage(1), [locationSearch, locationTypeFilter, filteredLocations.length]);
  useEffect(() => setDepartmentPage(1), [departmentSearch, filteredDepartments.length]);
  useEffect(() => setOfficePage(1), [officeSearch, officeDeptFilter, filteredOffices.length]);

  const pagedLocations = filteredLocations.slice(
    (locationPage - 1) * PAGE_SIZE,
    locationPage * PAGE_SIZE
  );
  const pagedDepartments = filteredDepartments.slice(
    (departmentPage - 1) * PAGE_SIZE,
    departmentPage * PAGE_SIZE
  );
  const pagedOffices = filteredOffices.slice(
    (officePage - 1) * PAGE_SIZE,
    officePage * PAGE_SIZE
  );

  // Handlers
  const handleOpenCreate = () => {
    if (activeTab === 'locations') {
      setIsCreateLocationOpen(true);
    } else if (activeTab === 'departments') {
      setIsCreateDeptOpen(true);
    } else {
      setIsCreateOfficeOpen(true);
    }
  };

  const handleAddLocation = (newLoc: LocationItem) => {
    setLocations((prev) => [...prev, newLoc]);
  };

  const handleUpdateLocation = (updated: LocationItem) => {
    setLocations((prev) =>
      prev.map((l) => (l.id === updated.id ? updated : l))
    );
  };

  const handleDeleteLocation = (id: string) => {
    setLocations((prev) => prev.filter((l) => l.id !== id));
  };

  const handleAddDepartment = (newDept: DepartmentItem) => {
    setDepartments((prev) => [...prev, newDept]);
  };

  const handleUpdateDepartment = (updated: DepartmentItem) => {
    setDepartments((prev) =>
      prev.map((d) => (d.id === updated.id ? updated : d))
    );
  };

  const handleDeleteDepartment = (id: string) => {
    setDepartments((prev) => prev.filter((d) => d.id !== id));
  };

  const handleAddOffice = (newOffice: OfficeItem) => {
    setOffices((prev) => [...prev, newOffice]);
  };

  const handleUpdateOffice = (updated: OfficeItem) => {
    setOffices((prev) =>
      prev.map((o) => (o.id === updated.id ? updated : o))
    );
  };

  const handleDeleteOffice = (id: string) => {
    setOffices((prev) => prev.filter((o) => o.id !== id));
  };

  return (
    <section
      aria-labelledby="organisation-heading"
      className="flex min-h-0 flex-1 flex-col"
    >
      {/* Unified Big Card Container */}
      <div className="flex max-h-full min-h-0 flex-1 flex-col overflow-hidden rounded-2xl border border-hairline bg-white shadow-card">
        {/* Integrated Card Top Header */}
        <div className="border-b border-hairline bg-white px-6 py-5 shrink-0">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            {/* Title */}
            <div>
              <h1 id="organisation-heading" className="text-xl font-bold tracking-tight text-ink sm:text-2xl">
                Organisation
              </h1>
            </div>

            {/* Dynamic Action Button inside Card */}
            <div className="flex items-center gap-3">
              <Button
                onClick={handleOpenCreate}
                className="shadow-sm transition-all duration-150 hover:shadow"
              >
                <PlusIcon className="h-4 w-4" strokeWidth={2} />
                <span>
                  {activeTab === 'locations' && 'Add Location'}
                  {activeTab === 'departments' && 'Add Department'}
                  {activeTab === 'offices' && 'Add Office'}
                </span>
              </Button>
            </div>
          </div>

          {/* Segmented Tab Navigation inside Card Header */}
          <div className="mt-5 flex items-center justify-between gap-4 overflow-x-auto border-t border-hairline/70 pt-4">
            <div className="flex min-w-max items-center gap-1 rounded-xl border border-hairline/60 bg-surface/70 p-1">
              <button
                type="button"
                onClick={() => setActiveTab('locations')}
                className={[
                  'flex items-center gap-2 rounded-lg px-3.5 py-1.5 text-body font-medium transition-all duration-150',
                  activeTab === 'locations'
                    ? 'bg-white text-primary shadow-xs font-semibold'
                    : 'text-muted hover:text-ink hover:bg-white/50',
                ].join(' ')}
              >
                <MapPinIcon className="h-4 w-4" />
                <span>Locations</span>
                <span
                  className={[
                    'rounded-full px-2 py-0.2 text-[11px] font-mono',
                    activeTab === 'locations'
                      ? 'bg-primary/10 text-primary font-semibold'
                      : 'bg-muted/10 text-muted',
                  ].join(' ')}
                >
                  {locations.length}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('departments')}
                className={[
                  'flex items-center gap-2 rounded-lg px-3.5 py-1.5 text-body font-medium transition-all duration-150',
                  activeTab === 'departments'
                    ? 'bg-white text-primary shadow-xs font-semibold'
                    : 'text-muted hover:text-ink hover:bg-white/50',
                ].join(' ')}
              >
                <Building2Icon className="h-4 w-4" />
                <span>Departments</span>
                <span
                  className={[
                    'rounded-full px-2 py-0.2 text-[11px] font-mono',
                    activeTab === 'departments'
                      ? 'bg-primary/10 text-primary font-semibold'
                      : 'bg-muted/10 text-muted',
                  ].join(' ')}
                >
                  {departments.length}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('offices')}
                className={[
                  'flex items-center gap-2 rounded-lg px-3.5 py-1.5 text-body font-medium transition-all duration-150',
                  activeTab === 'offices'
                    ? 'bg-white text-primary shadow-xs font-semibold'
                    : 'text-muted hover:text-ink hover:bg-white/50',
                ].join(' ')}
              >
                <Building2Icon className="h-4 w-4" />
                <span>Offices</span>
                <span
                  className={[
                    'rounded-full px-2 py-0.2 text-[11px] font-mono',
                    activeTab === 'offices'
                      ? 'bg-primary/10 text-primary font-semibold'
                      : 'bg-muted/10 text-muted',
                  ].join(' ')}
                >
                  {offices.length}
                </span>
              </button>
            </div>

          </div>
        </div>

        {/* Tab Content Panes */}
        <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
          {/* ════════════════════════════════════════════════════════════════ */}
          {/* TAB 1: LOCATIONS TABLE                                          */}
          {/* ════════════════════════════════════════════════════════════════ */}
          {activeTab === 'locations' && (
            <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
              {/* Filter Bar */}
              <div className="border-b border-hairline px-5 py-4">
                <div className="flex flex-wrap items-end gap-3.5">
                  {/* Search Input */}
                  <div className="w-full sm:w-72">
                    <label
                      htmlFor="loc-search"
                      className="mb-1 block text-meta font-medium uppercase tracking-[0.06em] text-muted"
                    >
                      Search
                    </label>
                    <div className="relative">
                      <SearchIcon
                        className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted"
                        strokeWidth={1.75}
                      />
                      <input
                        id="loc-search"
                        type="search"
                        value={locationSearch}
                        onChange={(e) => setLocationSearch(e.target.value)}
                        placeholder="Location name or code"
                        className="w-full rounded-lg border border-hairline bg-white py-2 pl-9 pr-3 text-body text-ink placeholder:text-muted/70 shadow-card transition-all duration-150 ease-standard focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                      />
                    </div>
                  </div>

                  {/* Classification Filter */}
                  <div className="w-full sm:w-56">
                    <label
                      htmlFor="filter-loc-type"
                      className="mb-1 block text-meta font-medium uppercase tracking-[0.06em] text-muted"
                    >
                      Classification
                    </label>
                    <Listbox
                      id="filter-loc-type"
                      value={locationTypeFilter}
                      onChange={setLocationTypeFilter}
                      options={[
                        { value: 'all', label: `All (${locations.length})` },
                        { value: 'DISTRICT', label: `District (${locations.filter((l) => l.type === 'DISTRICT').length})` },
                        { value: 'SUB_DISTRICT', label: `Sub-District (${locations.filter((l) => l.type === 'SUB_DISTRICT').length})` },
                        { value: 'SECTION', label: `Section (${locations.filter((l) => l.type === 'SECTION').length})` },
                      ]}
                      placeholder="All"
                      compact={false}
                      className="w-56"
                    />
                  </div>

                  <div className="ml-auto flex items-center gap-3 pb-1">
                    {(locationSearch !== '' || locationTypeFilter !== 'all') && (
                      <button
                        type="button"
                        onClick={() => {
                          setLocationSearch('');
                          setLocationTypeFilter('all');
                        }}
                        className="rounded-md text-body text-muted transition-colors duration-150 ease-standard hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                      >
                        Reset
                      </button>
                    )}
                    <span className="text-meta text-muted">
                      {filteredLocations.length} {filteredLocations.length === 1 ? 'location' : 'locations'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Table */}
              {filteredLocations.length === 0 ? (
                <EmptyState
                  title="No locations match"
                  description="Try a different location name or reset the classification filter."
                />
              ) : (
                <div className="min-h-0 flex-1 overflow-auto">
                  <table className="w-full border-collapse text-left">
                    <caption className="sr-only">Locations directory table</caption>
                    <thead className="sticky top-0 z-10 border-b border-hairline bg-surface/60 backdrop-blur-sm">
                      <tr className="border-b border-hairline">
                        <th scope="col" className={`${headerClasses} w-12 text-center`}>
                          #
                        </th>
                        <th scope="col" className={`${headerClasses} min-w-[200px]`}>
                          Location
                        </th>
                        <th scope="col" className={`${headerClasses} w-[160px]`}>
                          Code
                        </th>
                        <th scope="col" className={`${headerClasses} w-[180px]`}>
                          Classification
                        </th>
                        <th scope="col" className={`${headerClasses} w-[120px] text-right`}>
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-hairline">
                      {pagedLocations.map((loc, idx) => (
                        <tr
                          key={loc.id}
                          className="group transition-colors duration-150 ease-standard hover:bg-surface"
                        >
                          <td className="px-5 py-3.5 text-center text-meta text-muted">
                            {(locationPage - 1) * PAGE_SIZE + idx + 1}
                          </td>
                          <td className="px-5 py-3.5">
                            <div className="flex items-center gap-2.5">
                              <MapPinIcon className="h-4 w-4 shrink-0 text-muted" />
                              <div>
                                <span className="block text-body font-semibold text-ink">
                                  {loc.name}
                                </span>
                                {loc.nameSomali && loc.nameSomali !== loc.name && (
                                  <span className="block text-[11px] text-muted italic">
                                    {loc.nameSomali}
                                  </span>
                                )}
                              </div>
                            </div>
                          </td>
                          <td className="px-5 py-3.5 font-mono text-body font-medium text-ink">
                            {loc.code}
                          </td>
                          <td className="px-5 py-3.5">
                            <LocationTypeBadge type={loc.type} />
                          </td>
                          <td className="px-5 py-3.5 text-right">
                            <div className="flex items-center justify-end gap-1.5 text-muted">
                              <button
                                type="button"
                                onClick={() => setEditingLocation(loc)}
                                className="rounded p-1 transition-colors hover:bg-surface hover:text-ink"
                                title="Edit location"
                              >
                                <PencilIcon className="h-4 w-4" />
                              </button>
                              <button
                                type="button"
                                onClick={() =>
                                  setMovingItem({
                                    code: loc.code,
                                    options: locations.map((l) => ({ code: l.code, name: l.name })),
                                    onConfirm: () => {},
                                  })
                                }
                                className="rounded p-1 transition-colors hover:bg-surface hover:text-ink"
                                title="Move location hierarchy"
                              >
                                <ArrowRightIcon className="h-4 w-4" />
                              </button>
                              <button
                                type="button"
                                onClick={() =>
                                  setRetiringItem({
                                    code: loc.code,
                                    name: loc.name,
                                    onConfirm: () => handleDeleteLocation(loc.id),
                                  })
                                }
                                className="rounded p-1 transition-colors hover:bg-surface hover:text-rose-600"
                                title="Retire location"
                              >
                                <TrashIcon className="h-4 w-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
              {filteredLocations.length > 0 && (
                <Pagination
                  page={locationPage}
                  total={filteredLocations.length}
                  onPageChange={setLocationPage}
                />
              )}
            </div>
          )}

          {/* ════════════════════════════════════════════════════════════════ */}
          {/* TAB 2: DEPARTMENTS TABLE                                        */}
          {/* ════════════════════════════════════════════════════════════════ */}
          {activeTab === 'departments' && (
            <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
              {/* Filter Bar */}
              <div className="border-b border-hairline px-5 py-4">
                <div className="flex flex-wrap items-end gap-3.5">
                  <div className="w-full sm:w-80">
                    <label
                      htmlFor="dept-search"
                      className="mb-1 block text-meta font-medium uppercase tracking-[0.06em] text-muted"
                    >
                      Search
                    </label>
                    <div className="relative">
                      <SearchIcon
                        className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted"
                        strokeWidth={1.75}
                      />
                      <input
                        id="dept-search"
                        type="search"
                        value={departmentSearch}
                        onChange={(e) => setDepartmentSearch(e.target.value)}
                        placeholder="Department name or code"
                        className="w-full rounded-lg border border-hairline bg-white py-2 pl-9 pr-3 text-body text-ink placeholder:text-muted/70 shadow-card transition-all duration-150 ease-standard focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                      />
                    </div>
                  </div>

                  <div className="ml-auto flex items-center gap-3 pb-1">
                    {departmentSearch !== '' && (
                      <button
                        type="button"
                        onClick={() => setDepartmentSearch('')}
                        className="rounded-md text-body text-muted transition-colors duration-150 ease-standard hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                      >
                        Reset
                      </button>
                    )}
                    <span className="text-meta text-muted">
                      {filteredDepartments.length} {filteredDepartments.length === 1 ? 'department' : 'departments'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Table */}
              {filteredDepartments.length === 0 ? (
                <EmptyState
                  title="No departments match"
                  description="Try a different department name or code, or reset the search."
                />
              ) : (
                <div className="min-h-0 flex-1 overflow-auto">
                  <table className="w-full border-collapse text-left">
                    <caption className="sr-only">Departments directory table</caption>
                    <thead className="sticky top-0 z-10 border-b border-hairline bg-surface/60 backdrop-blur-sm">
                      <tr className="border-b border-hairline">
                        <th scope="col" className={`${headerClasses} w-12 text-center`}>
                          #
                        </th>
                        <th scope="col" className={`${headerClasses} min-w-[240px]`}>
                          Department
                        </th>
                        <th scope="col" className={`${headerClasses} w-[180px]`}>
                          Code
                        </th>
                        <th scope="col" className={`${headerClasses} w-[160px]`}>
                          Assigned Offices
                        </th>
                        <th scope="col" className={`${headerClasses} w-[120px] text-right`}>
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-hairline">
                      {pagedDepartments.map((dept, idx) => {
                        const assignedCount = offices.filter(
                          (o) => o.departmentCode === dept.code
                        ).length;

                        return (
                          <tr
                            key={dept.id}
                            className="group transition-colors duration-150 ease-standard hover:bg-surface"
                          >
                            <td className="px-5 py-3.5 text-center text-meta text-muted">
                              {(departmentPage - 1) * PAGE_SIZE + idx + 1}
                            </td>
                            <td className="px-5 py-3.5">
                              <div className="flex items-center gap-2.5">
                                <Building2Icon className="h-4 w-4 shrink-0 text-muted" />
                                <div>
                                  <span className="block text-body font-semibold text-ink">
                                    {dept.name}
                                  </span>
                                  {dept.nameSomali && dept.nameSomali !== dept.name && (
                                    <span className="block text-[11px] text-muted italic">
                                      {dept.nameSomali}
                                    </span>
                                  )}
                                </div>
                              </div>
                            </td>
                            <td className="px-5 py-3.5 font-mono text-body font-medium text-ink">
                              {dept.code}
                            </td>
                            <td className="px-5 py-3.5 text-body text-ink">
                              <span className="inline-flex items-center rounded-md border border-hairline bg-surface px-2 py-0.5 text-meta text-muted">
                                {assignedCount} {assignedCount === 1 ? 'office' : 'offices'}
                              </span>
                            </td>
                            <td className="px-5 py-3.5 text-right">
                              <div className="flex items-center justify-end gap-1.5 text-muted">
                                <button
                                  type="button"
                                  onClick={() => setEditingDepartment(dept)}
                                  className="rounded p-1 transition-colors hover:bg-surface hover:text-ink"
                                  title="Edit department"
                                >
                                  <PencilIcon className="h-4 w-4" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() =>
                                    setRetiringItem({
                                      code: dept.code,
                                      name: dept.name,
                                      onConfirm: () => handleDeleteDepartment(dept.id),
                                    })
                                  }
                                  className="rounded p-1 transition-colors hover:bg-surface hover:text-rose-600"
                                  title="Retire department"
                                >
                                  <TrashIcon className="h-4 w-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
              {filteredDepartments.length > 0 && (
                <Pagination
                  page={departmentPage}
                  total={filteredDepartments.length}
                  onPageChange={setDepartmentPage}
                />
              )}
            </div>
          )}

          {/* ════════════════════════════════════════════════════════════════ */}
          {/* TAB 3: OFFICES TABLE                                            */}
          {/* ════════════════════════════════════════════════════════════════ */}
          {activeTab === 'offices' && (
            <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
              {/* Filter Bar */}
              <div className="border-b border-hairline px-5 py-4">
                <div className="flex flex-wrap items-end gap-3.5">
                  {/* Search Input */}
                  <div className="w-full sm:w-72">
                    <label
                      htmlFor="off-search"
                      className="mb-1 block text-meta font-medium uppercase tracking-[0.06em] text-muted"
                    >
                      Search
                    </label>
                    <div className="relative">
                      <SearchIcon
                        className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted"
                        strokeWidth={1.75}
                      />
                      <input
                        id="off-search"
                        type="search"
                        value={officeSearch}
                        onChange={(e) => setOfficeSearch(e.target.value)}
                        placeholder="Office name or code"
                        className="w-full rounded-lg border border-hairline bg-white py-2 pl-9 pr-3 text-body text-ink placeholder:text-muted/70 shadow-card transition-all duration-150 ease-standard focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                      />
                    </div>
                  </div>

                  {/* Department Filter */}
                  <div className="w-full sm:w-60">
                    <label
                      htmlFor="filter-off-dept"
                      className="mb-1 block text-meta font-medium uppercase tracking-[0.06em] text-muted"
                    >
                      Department
                    </label>
                    <Listbox
                      id="filter-off-dept"
                      value={officeDeptFilter}
                      onChange={setOfficeDeptFilter}
                      options={departments.map((d) => ({ value: d.code, label: d.name }))}
                      placeholder="All departments"
                      compact={false}
                      className="w-60"
                    />
                  </div>

                  <div className="ml-auto flex items-center gap-3 pb-1">
                    {(officeSearch !== '' || officeDeptFilter !== 'all') && (
                      <button
                        type="button"
                        onClick={() => {
                          setOfficeSearch('');
                          setOfficeDeptFilter('all');
                        }}
                        className="rounded-md text-body text-muted transition-colors duration-150 ease-standard hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                      >
                        Reset
                      </button>
                    )}
                    <span className="text-meta text-muted">
                      {filteredOffices.length} {filteredOffices.length === 1 ? 'office' : 'offices'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Table */}
              {filteredOffices.length === 0 ? (
                <EmptyState
                  title="No offices match"
                  description="Try a different office name or code, or reset the department filter."
                />
              ) : (
                <div className="min-h-0 flex-1 overflow-auto">
                  <table className="w-full border-collapse text-left">
                    <caption className="sr-only">Offices directory table</caption>
                    <thead className="sticky top-0 z-10 border-b border-hairline bg-surface/60 backdrop-blur-sm">
                      <tr className="border-b border-hairline">
                        <th scope="col" className={`${headerClasses} w-12 text-center`}>
                          #
                        </th>
                        <th scope="col" className={`${headerClasses} min-w-[200px]`}>
                          Office
                        </th>
                        <th scope="col" className={`${headerClasses} w-[150px]`}>
                          Code
                        </th>
                        <th scope="col" className={`${headerClasses} min-w-[180px]`}>
                          Department
                        </th>
                        <th scope="col" className={`${headerClasses} w-[160px]`}>
                          Location
                        </th>
                        <th scope="col" className={`${headerClasses} w-[120px] text-right`}>
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-hairline">
                      {pagedOffices.map((off, idx) => (
                        <tr
                          key={off.id}
                          className="group transition-colors duration-150 ease-standard hover:bg-surface"
                        >
                          <td className="px-5 py-3.5 text-center text-meta text-muted">
                            {(officePage - 1) * PAGE_SIZE + idx + 1}
                          </td>
                          <td className="px-5 py-3.5">
                            <div className="flex items-center gap-2.5">
                              <Building2Icon className="h-4 w-4 shrink-0 text-muted" />
                              <div>
                                <span className="block text-body font-semibold text-ink">
                                  {off.name}
                                </span>
                                {off.nameSomali && off.nameSomali !== off.name && (
                                  <span className="block text-[11px] text-muted italic">
                                    {off.nameSomali}
                                  </span>
                                )}
                              </div>
                            </div>
                          </td>
                          <td className="px-5 py-3.5 font-mono text-body font-medium text-ink">
                            {off.code}
                          </td>
                          <td className="px-5 py-3.5 text-body text-ink font-medium">
                            {off.departmentName}
                          </td>
                          <td className="px-5 py-3.5">
                            {off.locationName ? (
                              <span className="inline-flex items-center gap-1.5 text-meta text-muted">
                                <MapPinIcon className="h-3.5 w-3.5 text-muted/70" />
                                {off.locationName}
                              </span>
                            ) : (
                              <span className="text-meta text-muted/50">—</span>
                            )}
                          </td>
                          <td className="px-5 py-3.5 text-right">
                            <div className="flex items-center justify-end gap-1.5 text-muted">
                              <button
                                type="button"
                                onClick={() => setEditingOffice(off)}
                                className="rounded p-1 transition-colors hover:bg-surface hover:text-ink"
                                title="Edit office"
                              >
                                <PencilIcon className="h-4 w-4" />
                              </button>
                              <button
                                type="button"
                                onClick={() =>
                                  setMovingItem({
                                    code: off.code,
                                    options: offices.map((o) => ({ code: o.code, name: o.name })),
                                    onConfirm: () => {},
                                  })
                                }
                                className="rounded p-1 transition-colors hover:bg-surface hover:text-ink"
                                title="Move office hierarchy"
                              >
                                <ArrowRightIcon className="h-4 w-4" />
                              </button>
                              <button
                                type="button"
                                onClick={() =>
                                  setRetiringItem({
                                    code: off.code,
                                    name: off.name,
                                    onConfirm: () => handleDeleteOffice(off.id),
                                  })
                                }
                                className="rounded p-1 transition-colors hover:bg-surface hover:text-rose-600"
                                title="Retire office"
                              >
                                <TrashIcon className="h-4 w-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
              {filteredOffices.length > 0 && (
                <Pagination
                  page={officePage}
                  total={filteredOffices.length}
                  onPageChange={setOfficePage}
                />
              )}
            </div>
          )}
        </div>

        {/* Footer Notice Callout */}
        <div className="flex items-center gap-2 border-t border-hairline bg-surface/30 px-5 py-3 text-[12px] text-muted">
          <AlertCircleIcon className="h-4 w-4 shrink-0 text-muted/70" />
          <span>
            Moving an office changes what <strong className="font-mono font-bold text-ink">DIVISION</strong> scope resolves to for everybody assigned to it. A code cannot be changed once records reference it.
          </span>
        </div>
      </div>

      {/* Creation Modals */}
      <CreateLocationModal
        isOpen={isCreateLocationOpen}
        onClose={() => setIsCreateLocationOpen(false)}
        onSave={handleAddLocation}
      />

      <CreateDepartmentModal
        isOpen={isCreateDeptOpen}
        onClose={() => setIsCreateDeptOpen(false)}
        onSave={handleAddDepartment}
      />

      <CreateOfficeModal
        isOpen={isCreateOfficeOpen}
        departments={departments}
        locations={locations}
        offices={offices}
        onClose={() => setIsCreateOfficeOpen(false)}
        onSave={handleAddOffice}
      />

      {/* Edit Modals */}
      <EditLocationModal
        isOpen={editingLocation !== null}
        location={editingLocation}
        onClose={() => setEditingLocation(null)}
        onSave={handleUpdateLocation}
      />

      <EditDepartmentModal
        isOpen={editingDepartment !== null}
        department={editingDepartment}
        onClose={() => setEditingDepartment(null)}
        onSave={handleUpdateDepartment}
      />

      <EditOfficeModal
        isOpen={editingOffice !== null}
        office={editingOffice}
        departments={departments}
        locations={locations}
        onClose={() => setEditingOffice(null)}
        onSave={handleUpdateOffice}
      />

      {/* Move Modal */}
      {movingItem && (
        <MoveModal
          isOpen={true}
          code={movingItem.code}
          options={movingItem.options}
          onClose={() => setMovingItem(null)}
          onConfirm={(newParent) => {
            movingItem.onConfirm(newParent);
            setMovingItem(null);
          }}
        />
      )}

      {/* Retire Modal */}
      {retiringItem && (
        <RetireModal
          isOpen={true}
          code={retiringItem.code}
          name={retiringItem.name}
          onClose={() => setRetiringItem(null)}
          onConfirm={() => {
            retiringItem.onConfirm();
            setRetiringItem(null);
          }}
        />
      )}
    </section>
  );
}

function Pagination({
  page,
  total,
  onPageChange,
}: {
  page: number;
  total: number;
  onPageChange: (page: number) => void;
}) {
  const totalPages = Math.ceil(total / PAGE_SIZE);
  const start = (page - 1) * PAGE_SIZE + 1;
  const end = Math.min(page * PAGE_SIZE, total);

  if (totalPages <= 1) return null;

  return (
    <div className="flex shrink-0 items-center justify-between border-t border-hairline px-5 py-3 text-meta text-muted">
      <span>
        Showing {start}-{end} of {total}
      </span>
      <div className="flex items-center gap-1.5">
        <button
          type="button"
          disabled={page === 1}
          onClick={() => onPageChange(page - 1)}
          className="rounded-md border border-hairline px-2.5 py-1 text-meta font-medium text-muted transition-colors hover:bg-surface hover:text-ink disabled:cursor-not-allowed disabled:opacity-40"
        >
          Previous
        </button>
        <span className="px-2 font-medium text-ink">
          {page} / {totalPages}
        </span>
        <button
          type="button"
          disabled={page === totalPages}
          onClick={() => onPageChange(page + 1)}
          className="rounded-md border border-hairline px-2.5 py-1 text-meta font-medium text-muted transition-colors hover:bg-surface hover:text-ink disabled:cursor-not-allowed disabled:opacity-40"
        >
          Next
        </button>
      </div>
    </div>
  );
}

/** Visual differentiated badge for location classification types */
export function LocationTypeBadge({ type }: { type: LocationType | string }) {
  switch (type) {
    case 'DISTRICT':
      return (
        <span className="inline-flex items-center rounded-full border border-primary/20 bg-primaryLight px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-primary shadow-2xs">
          DISTRICT
        </span>
      );
    case 'SUB_DISTRICT':
      return (
        <span className="inline-flex items-center rounded-full border border-pacific/30 bg-sky/60 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-yale shadow-2xs">
          SUB_DISTRICT
        </span>
      );
    case 'SECTION':
      return (
        <span className="inline-flex items-center rounded-full border border-turquoise bg-turquoise/70 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-yale shadow-2xs">
          SECTION
        </span>
      );
    case 'ZONE':
    default:
      return (
        <span className="inline-flex items-center rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-success shadow-2xs">
          {type}
        </span>
      );
  }
}
