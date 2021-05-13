export interface AddressModel {
  name: string;
  addressLine: string;
  city: string;
  zip: string;
  country: CountryModel;
}

export interface CountryModel {
  iso: string;
  id: number;
  name: string;
}
