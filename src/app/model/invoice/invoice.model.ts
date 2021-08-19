import {Moment} from 'moment';

export interface InvoiceModel {
  id: number;
  number: string;
  date: Moment;
  type: 'cancel' | 'delivery' | 'draft' | 'estimate' | 'order' | 'proforma' | 'regular' | 'reverse_order';
  proformaId?: number;
  proformaTitle?: string;
  parentRegularId?: number;
  parentRegularTitle?: string;
  paymentType?: string;
  paymentId?: string | number;
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
