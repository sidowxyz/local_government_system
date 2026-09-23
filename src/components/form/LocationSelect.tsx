import { regions } from '../../data/locations';
import { RequiredMark } from './Field';
import { Listbox } from '../Listbox';

export interface LocationValue {
  region: string;
  district: string;
  section: string;
}

interface LocationSelectProps {
  idPrefix: string;
  label: string;
  value: LocationValue;
  onChange: (value: LocationValue) => void;
  required?: boolean;
  hint?: string;
}

export function LocationSelect({
  idPrefix,
  label,
  value,
  onChange,
  required,
  hint,
}: LocationSelectProps) {
  const region = regions.find((item) => item.name === value.region);
  const district = region?.districts.find((item) => item.name === value.district);

  const regionOptions = regions.map((item) => ({ value: item.name, label: item.name }));
  const districtOptions = (region?.districts ?? []).map((item) => ({
    value: item.name,
    label: item.name,
  }));
  const sectionOptions = (district?.sections ?? []).map((item) => ({
    value: item,
    label: item,
  }));

  return (
    <fieldset>
      <legend className="block text-body font-semibold text-ink">
        {label}
        {required ? <RequiredMark /> : null}
      </legend>

      <div className="mt-1.5 grid gap-3 sm:grid-cols-3">
        <div>
          <label htmlFor={`${idPrefix}-region`} className="sr-only">
            Region
          </label>
          <Listbox
            id={`${idPrefix}-region`}
            value={value.region}
            options={regionOptions}
            onChange={(val) =>
              onChange({ region: val, district: '', section: '' })
            }
            placeholder="Region…"
          />
        </div>

        <div>
          <label htmlFor={`${idPrefix}-district`} className="sr-only">
            District
          </label>
          <Listbox
            id={`${idPrefix}-district`}
            value={value.district}
            options={districtOptions}
            onChange={(val) =>
              onChange({ region: value.region, district: val, section: '' })
            }
            placeholder="District…"
            disabled={!region}
          />
        </div>

        <div>
          <label htmlFor={`${idPrefix}-section`} className="sr-only">
            Section
          </label>
          <Listbox
            id={`${idPrefix}-section`}
            value={value.section}
            options={sectionOptions}
            onChange={(val) =>
              onChange({ region: value.region, district: value.district, section: val })
            }
            placeholder="Section…"
            disabled={!district}
          />
        </div>
      </div>

      {hint ? (
        <p className="mt-1.5 max-w-prose text-meta text-muted">{hint}</p>
      ) : null}
    </fieldset>
  );
}