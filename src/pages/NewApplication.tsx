import { useNavigate } from 'react-router-dom';
import {
  ArrowRightIcon,
  Building2Icon,
  BabyIcon,
  CarIcon,
  ScrollTextIcon,
  type IconComponent } from
'../components/icons';
import { services, serviceGroups } from '../data/services';

const serviceIcons: Record<string, IconComponent> = {
  BIZ_LICENCE_ISSUE: ScrollTextIcon,
  BIZ_NEW_REGISTRATION: Building2Icon,
  CIV_BIRTH_REGISTRATION: BabyIcon,
  VEH_REGISTRATION: CarIcon
};

export function NewApplication() {
  const navigate = useNavigate();

  return (
    <section
      aria-labelledby="new-application-heading"
      className="min-h-0 flex-1 overflow-y-auto pr-1">

      <div className="overflow-hidden rounded-2xl border border-hairline bg-white shadow-card">
        <header className="flex flex-wrap items-center justify-between gap-4 border-b border-hairline px-6 py-5">
          <div>
            <h1 id="new-application-heading" className="text-xl font-bold tracking-tight text-ink sm:text-2xl">
              New application
            </h1>
          </div>
          <span className="rounded-full bg-primaryLight px-2.5 py-1 text-meta font-semibold text-primary">
            {services.length} services
          </span>
        </header>

        <div className="space-y-8 p-6">
          {serviceGroups.map((group) => {
            const groupServices = services.filter(
              (service) => service.category === group.category
            );
            if (groupServices.length === 0) return null;

            return (
              <section key={group.category} aria-labelledby={`group-${group.category}`}>
                <div className="flex items-center gap-4">
                  <h2
                    id={`group-${group.category}`}
                    className="text-meta font-medium uppercase tracking-[0.08em] text-muted">
                    
                    {group.label}
                  </h2>
                  <span
                    aria-hidden="true"
                    className="h-px flex-1 bg-hairline" />
                  
                  <span className="text-meta text-muted">
                    {groupServices.length}{' '}
                    {groupServices.length === 1 ? 'service' : 'services'}
                  </span>
                </div>

                <ul className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                  {groupServices.map((service) => {
                    const Icon = serviceIcons[service.code] ?? ScrollTextIcon;
                    return (
                      <li key={service.id} className="h-full">
                        <button
                          type="button"
                          onClick={() =>
                          navigate(`/applications/new/${service.code}`)
                          }
                          className="group flex h-full w-full items-start gap-4 rounded-xl border border-hairline bg-surface/30 p-5 text-left transition-all duration-200 ease-standard hover:border-primary/30 hover:bg-white hover:shadow-cardHover hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-surface">
                          
                          <span
                            aria-hidden="true"
                            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primaryLight text-primary ring-1 ring-primary/20 transition-all duration-200 ease-standard group-hover:bg-primary group-hover:text-white group-hover:ring-primary/40 group-hover:shadow-sm">
                            
                            <Icon className="h-5 w-5" strokeWidth={1.75} weight="duotone" />
                          </span>

                          <span className="flex min-w-0 flex-1 flex-col self-stretch">
                            <span className="text-lead font-bold tracking-tight text-ink">
                              {service.name}
                            </span>
                            <span className="mt-auto pt-4 block break-all font-mono text-[11px] font-medium text-muted/70">
                              {service.code}
                            </span>
                          </span>

                          <ArrowRightIcon
                            className="mt-1 h-4 w-4 shrink-0 text-muted transition-all duration-200 ease-standard group-hover:translate-x-1 group-hover:text-primary"
                            strokeWidth={1.75} />
                          
                        </button>
                      </li>);

                  })}
                </ul>
              </section>);

          })}
        </div>
      </div>
    </section>);

}