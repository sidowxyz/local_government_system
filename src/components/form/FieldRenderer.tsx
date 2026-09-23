import { SearchIcon, PaperclipIcon } from '../icons';
import { Field, TextField, SelectField, ChoiceGroup } from './Field';
import { Button } from '../Button';
import { Checkbox } from '../Checkbox';
import type { FieldDef, FieldValue } from '../../types/forms';

interface FieldRendererProps {
  field: FieldDef;
  value: FieldValue | undefined;
  onChange: (name: string, value: FieldValue) => void;
}

export function FieldRenderer({ field, value, onChange }: FieldRendererProps) {
  const id = `field-${field.name}`;
  const text = typeof value === 'string' ? value : '';

  if (field.kind === 'checkbox') {
    return (
      <Checkbox
        id={id}
        checked={value === true}
        onChange={(event) => onChange(field.name, event.target.checked)}
        label={
          <>
            {field.label}
            {field.required ? <span className="text-muted"> *</span> : null}
          </>
        }
      />
    );
  }

  if (field.kind === 'choice') {
    return (
      <ChoiceGroup
        label={field.label}
        required={field.required}
        hint={field.hint}
        value={text}
        onChange={(next) => onChange(field.name, next)}
        options={(field.options ?? []).map((option) => ({
          value: option,
          label: option
        }))} />);


  }

  if (field.kind === 'upload') {
    return (
      <Field id={id} label={field.label} required={field.required} hint={field.hint}>
        <div className="flex items-center gap-3 rounded-lg border border-dashed border-hairline bg-surface/60 px-4 py-3">
          <PaperclipIcon className="h-4 w-4 shrink-0 text-primary/60" strokeWidth={1.75} />
          <p className="text-body text-muted">
            Save the draft first, then attach files.
          </p>
        </div>
      </Field>);

  }

  if (field.kind === 'search') {
    return (
      <Field id={id} label={field.label} required={field.required} hint={field.hint}>
        <div className="flex items-center gap-2">
          <div className="relative min-w-0 flex-1">
            <SearchIcon
              className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted"
              strokeWidth={1.75} />
            
            <TextField
              id={id}
              className="pl-9"
              value={text}
              onChange={(event) => onChange(field.name, event.target.value)} />
            
          </div>
          <Button variant="secondary">Search</Button>
        </div>
      </Field>);

  }

  if (field.kind === 'derived') {
    return (
      <Field id={id} label={field.label} required={field.required} hint={field.hint}>
        <p
          id={id}
          className="rounded-lg border border-hairline bg-surface/60 px-3.5 py-2.5 text-body italic text-muted/70">
          
          Auto-filled after selection
        </p>
      </Field>);

  }

  if (field.kind === 'select') {
    return (
      <Field id={id} label={field.label} required={field.required} hint={field.hint}>
        <SelectField
          id={id}
          value={text}
          onChange={(val) => onChange(field.name, val)}
          options={(field.options ?? []).map((option) => ({
            value: option,
            label: option,
          }))}
          placeholder="Select…"
        />
      </Field>);

  }

  return (
    <Field id={id} label={field.label} required={field.required} hint={field.hint}>
      <TextField
        id={id}
        type={field.kind === 'date' ? 'date' : field.kind === 'number' ? 'number' : 'text'}
        inputMode={field.kind === 'number' ? 'numeric' : undefined}
        placeholder={field.placeholder}
        value={text}
        onChange={(event) => onChange(field.name, event.target.value)} />
      
    </Field>);

}