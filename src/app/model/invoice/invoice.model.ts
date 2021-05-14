export interface InvoiceModel {
  id: number;
  number: string;
  type: 'cancel' | 'delivery' | 'draft' | 'estimate' | 'order' | 'proforma' | 'regular' | 'reverse_order';
  proformaId?: number;
  proformaTitle?: string;
  parentRegularId?: number;
  parentRegularTitle?: string;
  orderNr: number;
  amount: number;
  currency: string;
  flag: string;
  status: StatusModel;
}

export interface StatusModel {
  status: '1' | '2' | '3' | '99';
  statusIcon: string;
  statusTitle: string;
}
