import { useMemo, useState } from 'react';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import { SaveIcon } from '../components/icons';
import { Button } from '../components/Button';
import {
  RecordCard,
  RecordHeader,
  RecordBody,
  RecordColumn,
  RecordSection } from
'../components/RecordCard';
import { FieldRenderer } from '../components/form/FieldRenderer';
import { findServiceForm } from '../data/serviceForms';
import { slugify } from '../utils/slug';
import type { FieldValue } from '../types/forms';

export function ServiceApplication() {
  const { code } = useParams<{code: string;}>();
  const navigate = useNavigate();
  const form = findServiceForm(code);
  const [values, setValues] = useState<Record<string, FieldValue>>({});

  const requiredFields = useMemo(
    () =>
    (form?.sections ?? []).flatMap((section) =>
    section.fields.filter((field) => field.required)
    ),
    [form]
  );

  if (!form) return <Navigate to="/applications/new" replace />;

  const setValue = (name: string, value: FieldValue) =>
  setValues((current) => ({ ...current, [name]: value }));

  const completedRequired = requiredFields.filter((field) => {
    const value = values[field.name];
    if (typeof value === 'boolean') return value;
    return typeof value === 'string' && value.trim() !== '';
  }).length;

  return (
    <section
      aria-label={`${form.name} application`}
      className="no-scrollbar min-h-0 flex-1 overflow-y-auto pr-1">
      
      <form
        className="pb-2"
        onSubmit={(event) => {
          event.preventDefault();
          navigate('/applications');
        }}>
        
        <RecordCard>
          <RecordHeader
            backTo="/applications/new"
            backLabel="Choose a service"
            eyebrow="New application"
            title={form.name}
            meta={[
            <span className="break-all font-mono text-meta text-muted">
                {form.code}
              </span>,
            <span className="text-body text-muted">Draft — not submitted</span>,
            <span className="text-body text-muted">
                {completedRequired} of {requiredFields.length} required fields
                complete
              </span>]
            }
            actions={
            <>
                <Button
                variant="ghost"
                onClick={() => navigate('/applications/new')}>
                
                  Cancel
                </Button>
                <Button type="submit">
                  <SaveIcon className="h-4 w-4" strokeWidth={1.75} />
                  Save draft
                </Button>
              </>
            } />
          

          <RecordBody>
            <RecordColumn>
              {form.sections.map((section) =>
              <RecordSection
                key={section.title}
                id={slugify(section.title)}
                title={section.title}
                description={section.description}
                collapsibleDescription
              >
                
                  <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3 sm:gap-5">
                    {section.fields.map((field) =>
                  <div
                    key={field.name}
                    className={
                    field.width === 'full' ?
                    'sm:col-span-2 xl:col-span-3' :
                    undefined
                    }>
                    
                        <FieldRenderer
                      field={field}
                      value={values[field.name]}
                      onChange={setValue} />
                    
                      </div>
                  )}
                  </div>
                </RecordSection>
              )}
            </RecordColumn>

            <RecordColumn side>
              <RecordSection title="Sections">
                <ol className="space-y-1">
                  {form.sections.map((section, index) =>
                  <li key={section.title}>
                      <a
                      href={`#${slugify(section.title)}`}
                      className="group flex items-center gap-3 rounded-lg px-2 py-1.5 text-body text-muted transition-colors duration-150 ease-standard hover:bg-surface hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">
                      
                        <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-surface text-[10px] font-bold text-muted ring-1 ring-hairline transition-colors duration-150 group-hover:bg-primary group-hover:text-white group-hover:ring-primary">
                          {index + 1}
                        </span>
                        <span className="truncate">{section.title}</span>
                      </a>
                    </li>
                  )}
                </ol>
              </RecordSection>

              <RecordSection title="Before you submit">
                <ul className="space-y-2.5 text-body text-muted">
                  <li className="flex items-start gap-2">
                    <span aria-hidden="true" className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary/50" />
                    Required fields are marked with an asterisk. The draft can be
                    saved at any point.
                  </li>
                  <li className="flex items-start gap-2">
                    <span aria-hidden="true" className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary/50" />
                    Documents are attached after the draft is saved, from the case
                    file.
                  </li>
                  <li className="flex items-start gap-2">
                    <span aria-hidden="true" className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary/50" />
                    The fee is calculated from the category and class once the
                    case is opened.
                  </li>
                </ul>
                <Button type="submit" className="mt-5 w-full">
                  <SaveIcon className="h-4 w-4" strokeWidth={1.75} />
                  Save draft
                </Button>
              </RecordSection>
            </RecordColumn>
          </RecordBody>
        </RecordCard>
      </form>
    </section>);

}