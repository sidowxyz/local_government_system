import type { Service, ServiceCategory } from '../types/registry';

export const serviceGroups: {category: ServiceCategory;label: string;}[] = [
{ category: 'business', label: 'Business' },
{ category: 'civil', label: 'Civil registration' },
{ category: 'vehicle', label: 'Vehicles' }];


export const services: Service[] = [
{
  id: 'svc-1',
  name: 'Business licence',
  code: 'BIZ_LICENCE_ISSUE',
  category: 'business',
  description:
  'Issue or renew a trading licence for a business already on the register.'
},
{
  id: 'svc-2',
  name: 'Business registration',
  code: 'BIZ_NEW_REGISTRATION',
  category: 'business',
  description:
  'Record a new business, its owner, premises and declared activity.'
},
{
  id: 'svc-3',
  name: 'Birth registration',
  code: 'CIV_BIRTH_REGISTRATION',
  category: 'civil',
  description:
  'Register a birth and issue the certificate to the informant.'
},
{
  id: 'svc-4',
  name: 'Vehicle registration',
  code: 'VEH_REGISTRATION',
  category: 'vehicle',
  description:
  'Register a vehicle to a party and open its quarterly tax account.'
}];