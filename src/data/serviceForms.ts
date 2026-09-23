import type { ServiceForm } from '../types/forms';

const locations = [
'Hodan — Taleh',
'Hodan — Wadnaha',
'Waaberi — Sheikh Ali',
'Wadajir — Lafweyn',
'Hamar Weyne — Gaheyr'];


const sectors = ['Goods and trade', 'Services', 'Production and industry'];

const declaration = (statement: string) => ({
  title: 'Declaration',
  fields: [
  {
    name: 'declarantName',
    label: 'Name of declarant',
    kind: 'text' as const,
    required: true
  },
  { name: 'declarationDate', label: 'Date', kind: 'date' as const, required: true },
  {
    name: 'declarationAccepted',
    label: statement,
    kind: 'checkbox' as const,
    required: true,
    width: 'full' as const
  }]

});

export const serviceForms: ServiceForm[] = [
{
  code: 'BIZ_LICENCE_ISSUE',
  name: 'Business licence',
  sections: [
  {
    title: 'The business',
    fields: [
    {
      name: 'registrationReference',
      label: 'Business registration reference',
      kind: 'text',
      required: true,
      width: 'full',
      placeholder: 'BIZ-2026-000123',
      hint: 'The registration reference on the certificate — for example BIZ-2026-000123. The business must be registered and active.'
    },
    {
      name: 'licenceHolder',
      label: 'Licence holder',
      kind: 'search',
      required: true,
      width: 'full',
      hint: 'The business’s own party record — search it by the trade name. The licence and its renewal invoices are billed to this account.'
    }]

  },
  {
    title: 'The licence',
    fields: [
    {
      name: 'licenceType',
      label: 'Licence type',
      kind: 'select',
      required: true,
      options: [
      'General trading licence',
      'Food establishment',
      'Fuel station',
      'Pharmacy',
      'Professional services'],

      hint: 'One business may hold several licences at once, at different premises.'
    },
    {
      name: 'sector',
      label: 'Sector',
      kind: 'select',
      options: sectors
    },
    {
      name: 'category',
      label: 'Category',
      kind: 'derived',
      hint: 'Leave blank to licence under the business’s registered category. The category sets the annual fee.'
    },
    {
      name: 'licensedActivity',
      label: 'Licensed activity',
      kind: 'text'
    }]

  },
  {
    title: 'Premises',
    description:
    'Where this licence trades. A branch licence names its own premises; leave blank for the business’s registered location.',
    fields: [
    {
      name: 'premisesLocation',
      label: 'Location',
      kind: 'select',
      options: locations
    },
    {
      name: 'premisesAddress',
      label: 'Street address',
      kind: 'text'
    }]

  }]

},
{
  code: 'BIZ_NEW_REGISTRATION',
  name: 'Business registration',
  sections: [
  {
    title: 'Owner',
    fields: [
    {
      name: 'owner',
      label: 'Owner',
      kind: 'search',
      required: true,
      hint: 'Search the party register by national ID, phone or name. Create the record first if the owner is not on file.'
    }]

  },
  {
    title: 'Business',
    fields: [
    {
      name: 'tradeName',
      label: 'Trade name',
      kind: 'text',
      required: true,
      hint: 'The name the business trades under. It is checked against the register before approval.'
    },
    {
      name: 'legalName',
      label: 'Legal name',
      kind: 'text',
      required: true,
      hint: 'The registered legal name. For a sole proprietorship this is usually the owner’s full name.'
    },
    {
      name: 'legalForm',
      label: 'Legal form',
      kind: 'select',
      required: true,
      options: [
      'Sole proprietorship',
      'Partnership',
      'Company',
      'Cooperative',
      'Non-governmental organisation',
      'Foreign branch']

    },
    {
      name: 'sector',
      label: 'Sector',
      kind: 'select',
      required: true,
      options: sectors
    },
    {
      name: 'category',
      label: 'Category',
      kind: 'derived',
      required: true,
      hint: 'The category sets the registration fee.'
    },
    { name: 'activity', label: 'Activity', kind: 'text', required: true },
    {
      name: 'declaredCapital',
      label: 'Declared capital',
      kind: 'number',
      hint: 'Optional. Some local governments add a percentage of declared capital as a second fee component.'
    },
    {
      name: 'employees',
      label: 'Number of employees',
      kind: 'number'
    }]

  },
  {
    title: 'Premises',
    fields: [
    {
      name: 'location',
      label: 'Location',
      kind: 'select',
      required: true,
      options: locations,
      hint: 'Choose down to section level. This is what the location scope and the register report filter on.'
    },
    {
      name: 'streetAddress',
      label: 'Street address',
      kind: 'text',
      required: true,
      hint: 'Most premises have no formal address — a description a person could follow is enough.'
    },
    {
      name: 'tenure',
      label: 'Premises are',
      kind: 'choice',
      required: true,
      width: 'full',
      options: ['Owned', 'Rented']
    },
    {
      name: 'propertyReference',
      label: 'Property reference',
      kind: 'text',
      width: 'full',
      hint: 'If the premises are a registered property, quote its number. Linked to the property register from phase 2.'
    }]

  },
  {
    title: 'Contact',
    fields: [
    {
      name: 'businessPhone',
      label: 'Business phone',
      kind: 'text',
      required: true,
      placeholder: '+252…'
    },
    { name: 'altPhone', label: 'Alternate phone', kind: 'text' },
    { name: 'email', label: 'Email', kind: 'text' }]

  },
  {
    title: 'Documents',
    fields: [
    {
      name: 'ownerId',
      label: 'Owner identification',
      kind: 'upload',
      required: true
    },
    {
      name: 'proofOfPremises',
      label: 'Proof of premises',
      kind: 'upload',
      required: true,
      hint: 'A lease, a title, or a letter from the section administration.'
    },
    {
      name: 'passportPhoto',
      label: 'Passport photograph',
      kind: 'upload'
    }]

  },
  declaration('I declare that the information given is true and complete.')]

},
{
  code: 'CIV_BIRTH_REGISTRATION',
  name: 'Birth registration',
  sections: [
  {
    title: 'Child',
    fields: [
    { name: 'firstName', label: 'First name', kind: 'text', required: true },
    { name: 'middleName', label: 'Middle name', kind: 'text' },
    { name: 'lastName', label: 'Last name', kind: 'text', required: true },
    {
      name: 'sex',
      label: 'Sex',
      kind: 'select',
      required: true,
      options: ['Male', 'Female']
    },
    {
      name: 'dateOfBirth',
      label: 'Date of birth',
      kind: 'date',
      required: true
    },
    {
      name: 'placeOfBirth',
      label: 'Place of birth',
      kind: 'select',
      required: true,
      options: locations,
      hint: 'Choose down to section level. This is what reports and the location scope filter on.'
    },
    {
      name: 'placeOfBirthPrinted',
      label: 'Place of birth (as printed)',
      kind: 'text',
      required: true,
      width: 'full',
      hint: 'The hospital, village or district name as it should appear on the certificate.'
    }]

  },
  {
    title: 'Mother',
    fields: [
    {
      name: 'motherName',
      label: 'Full name of mother',
      kind: 'text',
      required: true,
      width: 'full'
    },
    {
      name: 'motherParty',
      label: 'Mother’s party record',
      kind: 'search',
      required: true,
      width: 'full',
      hint: 'Search the party register by national ID, phone or name. Create the record first if she is not on file.'
    }]

  },
  {
    title: 'Father',
    fields: [
    {
      name: 'fatherName',
      label: 'Full name of father',
      kind: 'text',
      width: 'full'
    },
    {
      name: 'fatherParty',
      label: 'Father’s party record',
      kind: 'search',
      width: 'full'
    }]

  },
  {
    title: 'Informant',
    fields: [
    {
      name: 'informant',
      label: 'Informant',
      kind: 'search',
      required: true,
      width: 'full',
      hint: 'The person registering the birth — often a parent. The fee is billed to this person.'
    }]

  },
  {
    title: 'Registration timing',
    fields: [
    {
      name: 'timing',
      label: 'Timing',
      kind: 'select',
      required: true,
      width: 'full',
      options: [
      'Timely — within the registration period (standard fee)',
      'Late — after the registration period (higher fee)'],

      hint: 'Late registration carries a higher fee than timely registration.'
    }]

  },
  declaration('I declare that the information given is true and complete.')]

},
{
  code: 'VEH_REGISTRATION',
  name: 'Vehicle registration',
  sections: [
  {
    title: 'Owner',
    fields: [
    {
      name: 'owner',
      label: 'Owner',
      kind: 'search',
      required: true,
      width: 'full',
      hint: 'A person or a registered business. The registration fee and every quarterly tax invoice are billed to this account.'
    }]

  },
  {
    title: 'Vehicle',
    fields: [
    {
      name: 'plateNumber',
      label: 'Plate number',
      kind: 'text',
      required: true,
      hint: 'Letters, digits and dashes only. Stored in upper case; one plate may be registered to one vehicle.'
    },
    {
      name: 'chassisNumber',
      label: 'Chassis number (VIN)',
      kind: 'text',
      required: true,
      hint: 'As stamped on the vehicle. One chassis number may be registered once.'
    },
    { name: 'engineNumber', label: 'Engine number', kind: 'text' },
    { name: 'make', label: 'Make', kind: 'text', required: true },
    { name: 'model', label: 'Model', kind: 'text', required: true },
    { name: 'year', label: 'Year of manufacture', kind: 'number' },
    { name: 'colour', label: 'Colour', kind: 'text' },
    {
      name: 'vehicleClass',
      label: 'Vehicle class',
      kind: 'select',
      required: true,
      options: ['Motorcycle', 'Car', 'Minibus', 'Truck', 'Trailer'],
      hint: 'The class sets both the registration fee and the quarterly tax.'
    }]

  },
  declaration(
    'I declare that the vehicle details given are true and that I am entitled to register it.'
  )]

}];


export function findServiceForm(code: string | undefined) {
  if (!code) return undefined;
  return serviceForms.find((form) => form.code === code);
}