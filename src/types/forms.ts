export type FieldKind =
'text' |
'select' |
'search' |
'date' |
'number' |
'derived' |
'choice' |
'checkbox' |
'upload';

export interface FieldDef {
  name: string;
  label: string;
  kind: FieldKind;
  required?: boolean;
  hint?: string;
  note?: string;
  placeholder?: string;
  options?: string[];
  width?: 'half' | 'full';
}

export interface FormSectionDef {
  title: string;
  description?: string;
  fields: FieldDef[];
}

export interface ServiceForm {
  code: string;
  name: string;
  sections: FormSectionDef[];
}

export type FieldValue = string | boolean;