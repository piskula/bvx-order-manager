export interface InvoiceModel {
  id: number;
  type: 'cancel' | 'delivery' | 'draft' | 'estimate' | 'order' | 'proforma' | 'regular' | 'reverse_order';
  proformaId: number;
  orderNr: number;
  amount: number;
  currency: string;
  flag: string;
}
