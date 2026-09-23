export interface LocationSection {
  name: string;
}

export interface LocationDistrict {
  name: string;
  sections: string[];
}

export interface LocationRegion {
  name: string;
  districts: LocationDistrict[];
}

export const regions: LocationRegion[] = [
{
  name: 'Banadir',
  districts: [
  { name: 'Hodan', sections: ['Taleh', 'Wadnaha', 'Towfiq'] },
  { name: 'Waaberi', sections: ['Sheikh Ali', 'Bulsho', 'Horseed'] },
  { name: 'Wadajir', sections: ['Lafweyn', 'Jazeera', 'Beerta Darawiishta'] },
  { name: 'Hamar Weyne', sections: ['Gaheyr', 'Xamar Jajab'] }]

},
{
  name: 'Lower Shabelle',
  districts: [
  { name: 'Afgooye', sections: ['Lafoole', 'Bulo Mareer'] },
  { name: 'Marka', sections: ['Shalambood', 'Jannaale'] }]

},
{
  name: 'Bay',
  districts: [
  { name: 'Baidoa', sections: ['Isha', 'Berdale'] },
  { name: 'Buur Hakaba', sections: ['Buulo Bardaale'] }]

}];