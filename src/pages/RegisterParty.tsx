import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PlusIcon, UserPlusIcon, XIcon } from '../components/icons';
import { Button } from '../components/Button';
import {
  RecordCard,
  RecordHeader,
  RecordBody,
  RecordColumn,
  RecordSection } from
'../components/RecordCard';
import {
  Field,
  TextField,
  TextareaField,
  SelectField,
  PhoneField } from
'../components/form/Field';
import {
  LocationSelect,
  type LocationValue } from
'../components/form/LocationSelect';

interface IdentifierRow {
  id: number;
  type: string;
  number: string;
}

const identifierTypes = [
{ value: 'national_id', label: 'National ID' },
{ value: 'passport', label: 'Passport' },
{ value: 'business_registration', label: 'Business registration' },
{ value: 'phone', label: 'Phone' }];


const sections = [
{ id: 'identity', label: 'Identity' },
{ id: 'identifiers', label: 'Identifiers' },
{ id: 'contact', label: 'Contact' },
{ id: 'address', label: 'Address' }];


export function RegisterParty() {
  const navigate = useNavigate();
  const [partyType, setPartyType] = useState('');
  const [firstName, setFirstName] = useState('');
  const [middleName, setMiddleName] = useState('');
  const [lastName, setLastName] = useState('');
  const [sex, setSex] = useState('');
  const [channel, setChannel] = useState('SMS');
  const [phone, setPhone] = useState('');
  const [altPhone, setAltPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [location, setLocation] = useState<LocationValue>({
    region: '',
    district: '',
    section: ''
  });
  const [identifiers, setIdentifiers] = useState<IdentifierRow[]>([
  { id: 1, type: 'national_id', number: '' }]
  );

  const addIdentifier = () =>
  setIdentifiers((rows) => [
  ...rows,
  { id: Date.now(), type: 'national_id', number: '' }]
  );

  const removeIdentifier = (id: number) =>
  setIdentifiers((rows) =>
  rows.length === 1 ? rows : rows.filter((row) => row.id !== id)
  );

  const updateIdentifier = (id: number, patch: Partial<IdentifierRow>) =>
  setIdentifiers((rows) =>
  rows.map((row) => row.id === id ? { ...row, ...patch } : row)
  );

  const requiredValues = [
  partyType,
  firstName,
  identifiers[0]?.number ?? '',
  phone];

  const completedRequired = requiredValues.filter(
    (value) => value.trim() !== ''
  ).length;

  return (
    <section
      aria-label="Register a party"
      className="min-h-0 flex-1 overflow-y-auto pr-1">
      
      <form
        className="pb-2"
        onSubmit={(event) => {
          event.preventDefault();
          navigate('/parties');
        }}>
        
        <RecordCard>
          <RecordHeader
            backTo="/parties"
            backLabel="Parties"
            eyebrow="Registry"
            title="Register a party"
            meta={[
            <span className="text-body text-muted">Not yet created</span>,
            <span className="text-body text-muted">
                {completedRequired} of {requiredValues.length} required fields
                complete
              </span>]
            }
            actions={
            <>
                <Button variant="ghost" onClick={() => navigate('/parties')}>
                  Cancel
                </Button>
                <Button type="submit">
                  <UserPlusIcon className="h-4 w-4" strokeWidth={1.75} />
                  Create
                </Button>
              </>
            } />
          

          <RecordBody>
            <RecordColumn>
              <RecordSection id="identity" title="Identity">
                <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                  <div>
                    <Field
                      id="party-type"
                      label="Type"
                      required
                      hint="This cannot be changed later — a party recorded under the wrong type has to be merged, not edited.">
                      
                      <SelectField
                        id="party-type"
                        value={partyType}
                        onChange={(val) => setPartyType(val)}
                        options={[
                          { value: 'IND', label: 'Individual' },
                          { value: 'ORG', label: 'Organisation' },
                        ]}
                        placeholder="Select…"
                      />
                    </Field>
                  </div>

                  <Field id="first-name" label="First name" required>
                    <TextField
                      id="first-name"
                      value={firstName}
                      autoComplete="off"
                      onChange={(event) => setFirstName(event.target.value)} />
                    
                  </Field>
                  <Field id="middle-name" label="Middle name">
                    <TextField
                      id="middle-name"
                      value={middleName}
                      autoComplete="off"
                      onChange={(event) => setMiddleName(event.target.value)} />
                    
                  </Field>
                  <Field id="last-name" label="Last name">
                    <TextField
                      id="last-name"
                      value={lastName}
                      autoComplete="off"
                      onChange={(event) => setLastName(event.target.value)} />
                    
                  </Field>
                  <Field id="sex" label="Sex">
                    <SelectField
                      id="sex"
                      value={sex}
                      onChange={(val) => setSex(val)}
                      options={[
                        { value: 'male', label: 'Male' },
                        { value: 'female', label: 'Female' },
                      ]}
                      placeholder="Select…"
                    />
                  </Field>
                </div>
              </RecordSection>

              <RecordSection
                id="identifiers"
                title="Identifiers"
                description="A national ID, a passport or a business registration number. One is required: it is what lets the register recognise the same party again instead of creating a second record."
                action={
                <Button variant="secondary" onClick={addIdentifier}>
                    <PlusIcon className="h-4 w-4" strokeWidth={2} />
                    Add another
                  </Button>
                }>
                
                <div className="space-y-4">
                  {identifiers.map((row, index) =>
                  <div
                    key={row.id}
                    className="grid gap-4 sm:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_auto] sm:items-end">
                    
                      <Field id={`identifier-type-${row.id}`} label="Type">
                        <SelectField
                        id={`identifier-type-${row.id}`}
                        value={row.type}
                        onChange={(val) =>
                        updateIdentifier(row.id, { type: val })
                        }
                        options={identifierTypes}
                        />
                      </Field>
                      <Field
                      id={`identifier-number-${row.id}`}
                      label="Number"
                      required={index === 0}>
                      
                        <TextField
                        id={`identifier-number-${row.id}`}
                        value={row.number}
                        inputMode="numeric"
                        onChange={(event) =>
                        updateIdentifier(row.id, {
                          number: event.target.value
                        })
                        } />
                      
                      </Field>
                      <Button
                      variant="ghost"
                      aria-label="Remove identifier"
                      disabled={identifiers.length === 1}
                      onClick={() => removeIdentifier(row.id)}
                      className="justify-self-start disabled:cursor-not-allowed disabled:opacity-40">
                      
                        <XIcon className="h-4 w-4" strokeWidth={1.75} />
                      </Button>
                    </div>
                  )}
                </div>
              </RecordSection>

              <RecordSection
                id="contact"
                title="Contact"
                description="How this party is reached. Notices and receipts go here.">
                
                <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
                  <Field id="phone" label="Phone" required>
                    <PhoneField id="phone" value={phone} onChange={setPhone} />
                  </Field>
                  <Field id="alt-phone" label="Alternative phone">
                    <PhoneField
                      id="alt-phone"
                      value={altPhone}
                      onChange={setAltPhone} />
                    
                  </Field>
                  <Field id="email" label="Email">
                    <TextField
                      id="email"
                      type="email"
                      value={email}
                      onChange={(event) => setEmail(event.target.value)} />
                    
                  </Field>
                  <Field id="channel" label="Preferred channel">
                    <SelectField
                      id="channel"
                      value={channel}
                      onChange={(val) => setChannel(val)}
                      options={[
                        { value: 'SMS', label: 'SMS' },
                        { value: 'Email', label: 'Email' },
                        { value: 'In app', label: 'In app' },
                      ]}
                    />
                  </Field>
                </div>
              </RecordSection>

              <RecordSection id="address" title="Address">
                <div className="space-y-5">
                  <LocationSelect
                    idPrefix="location"
                    label="Location"
                    value={location}
                    onChange={setLocation}
                    hint="Where they are, which decides who may see this record." />
                  
                  <Field
                    id="address"
                    label="Street address"
                    hint="Most premises have no formal address — a description a person could follow is enough.">
                    
                    <TextareaField
                      id="address"
                      rows={3}
                      value={address}
                      onChange={(event) => setAddress(event.target.value)} />
                    
                  </Field>
                </div>
              </RecordSection>
            </RecordColumn>

            <RecordColumn side>
              <RecordSection title="Sections">
                <ol className="space-y-1">
                  {sections.map((section, index) =>
                  <li key={section.id}>
                      <a
                      href={`#${section.id}`}
                      className="flex items-center gap-3 rounded-md px-2 py-1.5 text-body text-muted transition-colors duration-150 ease-standard hover:bg-surface hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">
                      
                        <span className="w-4 shrink-0 font-mono text-meta">
                          {index + 1}
                        </span>
                        <span className="truncate">{section.label}</span>
                      </a>
                    </li>
                  )}
                </ol>
              </RecordSection>

              <RecordSection title="Before you create">
                <ul className="space-y-3 text-body text-muted">
                  <li>
                    Search the register first — creating a second record for the
                    same person has to be undone by a merge.
                  </li>
                  <li>
                    The type and the first identifier are what the register
                    matches on later.
                  </li>
                  <li>
                    Location decides which offices may see and act on this
                    record.
                  </li>
                </ul>
                <Button type="submit" className="mt-5 w-full">
                  <UserPlusIcon className="h-4 w-4" strokeWidth={1.75} />
                  Create
                </Button>
              </RecordSection>
            </RecordColumn>
          </RecordBody>
        </RecordCard>
      </form>
    </section>);

}