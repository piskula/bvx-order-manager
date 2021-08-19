import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {OrderModel} from '../model/order/order.model';
import {map} from 'rxjs/operators';

@Injectable()
export class PacketaService {

  constructor(private httpClient: HttpClient) {
    this.headers = this.headers.set('Content-Type', 'application/xml');
  }

  private readonly URL = environment.packeta.url;
  private readonly PACKETA_API_PASSWORD = environment.packeta.apiPassword;

  private headers = new HttpHeaders();

  static getStatusFromResponse(response: string): string {
    return response.match(/<status>(.+)<\/status>/)[1];
  }

  static getErrorsFromResponse(response: string): string[] {
    return response.match(/<fault>([^<>]+)<\/fault>/g);
  }

  static getBarcodesFromResponse(response: string): string[] {
    return response.match(/<barcodeText>(.+)<\/barcodeText>/).slice(1);
  }

  registerPackage(order: OrderModel): Observable<string> {
    return this.httpClient.post(this.URL, this.getPacketXml(order), {headers: this.headers, responseType: 'text'})
      .pipe(
        map(response => {
          if (PacketaService.getStatusFromResponse(response) !== 'ok') {
            throw new Error(PacketaService.getErrorsFromResponse(response).join('\n'));
          } else {
            return PacketaService.getBarcodesFromResponse(response)[0];
          }
        }),
      );
  }

  private getPacketXml(order: OrderModel): string {
    const serviceOrPickUpPointId = this.extractServiceOrPickUpPointNumber(order);
    return `
<createPacket>
    <apiPassword>${this.PACKETA_API_PASSWORD}</apiPassword>
    <packetAttributes>
        <number>${order.number}</number>
        <name>${this.escapeChars(order.shipping.address.firstName)}</name>
        <surname>${this.escapeChars(order.shipping.address.lastName)}</surname>
        <company>${this.escapeChars(order.shipping.address.company)}</company>
        <street>${this.escapeChars(order.shipping.address.addressLine1)}</street>
        <city>${this.escapeChars(order.shipping.address.city)}</city>
        <zip>${order.shipping.address.zip}</zip>
        <email>${order.shipping.address.email}</email>
        <phone>${order.shipping.address.phone}</phone>
        <addressId>${serviceOrPickUpPointId}</addressId>
        <value>${order.total}</value>
        <weight>${order.weightInGrams / 1000}</weight>
        <eshop>https://biovoxel.tech/</eshop>
    </packetAttributes>
</createPacket>`;
  }

  private escapeChars(text: string): string {
    return text.replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&apos;');
  }

  private extractServiceOrPickUpPointNumber(order: OrderModel): string {
    switch (order.shipping.id) {
      case '2':
      case '5':
        return order.shipping.address.pickUpPointId;
      case '6':
      case '9':
        return this.getServiceForCountry(order);
      case '4':
      default:
        return '-1';
    }
  }

  private getServiceForCountry(order: OrderModel): string {
    switch (order.shipping.address.country.toUpperCase()) {
      case 'SK':
        return '131';
      case 'CZ':
        return '106';
      case 'AT':
        return '6830';
      case 'DE':
        return '111';
      case 'ES':
        return '4653';
      case 'RO':
        return '4161';
      case 'US':
        return '8289';
      default:
        return '-1';
    }
  }

}
