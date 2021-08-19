import {Injectable} from '@angular/core';
import {Observable, throwError} from 'rxjs';
import {HttpClient, HttpErrorResponse, HttpHeaders} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {OrderModel} from '../model/order/order.model';
import {catchError, map} from 'rxjs/operators';

@Injectable()
export class SkPostService {

  private readonly URL = environment.skPost.url;
  private readonly SK_POST_USER_ID = environment.skPost.userId;
  private readonly SK_POST_API_KEY = environment.skPost.apiKey;

  private headers = new HttpHeaders();

  constructor(
    private httpClient: HttpClient,
  ) {
    this.headers = this.headers.set('SOAPAction', 'importSheet');
    this.headers = this.headers.set('Content-Type', 'application/xml');
  }

  importSheet(orders: OrderModel[]): Observable<string> {
    return this.httpClient.post(this.URL, this.getSheetXml(orders), {headers: this.headers, responseType: 'text'})
      .pipe(
        map(xmlResponse => xmlResponse.match(/<sheetId>(.+)<\/sheetId>/)[1]),
        catchError((err: HttpErrorResponse) => throwError(err.statusText)),
      );
  }

  private getSheetXml(orders: OrderModel[]): string {
    const packages = orders.map(order => `
      <Zasielka>
        <Adresat>
          <Meno>${order.shipping.address.firstName} ${order.shipping.address.lastName}</Meno>
          <Organizacia>${order.shipping.address.company}</Organizacia>
          <Ulica>${order.shipping.address.addressLine1}</Ulica>
          <Mesto>${order.shipping.address.city}</Mesto>
          <PSC>${order.shipping.address.zip}</PSC>
          <Krajina>${order.shipping.address.country}</Krajina>
          <Telefon>${order.shipping.address.phone}</Telefon>
          <Email>${order.shipping.address.email}</Email>
        </Adresat>
        <Info>
          <ZasielkaID>${order.number}</ZasielkaID>
          <Hmotnost>${order.weightInGrams / 1000}</Hmotnost>
          <Poznamka/>
        </Info>
        <PouziteSluzby/>
      </Zasielka>
    `).join('\n');
    return `<?xml version="1.0" encoding="UTF-8"?>
<SOAP-ENV:Envelope xmlns:SOAP-ENV="http://schemas.xmlsoap.org/soap/envelope/">
    <SOAP-ENV:Body>
        <importSheetRequest>
            <auth>
                <userId>${this.SK_POST_USER_ID}</userId>
                <apiKey>${this.SK_POST_API_KEY}</apiKey>
            </auth>
            <EPH>
                <InfoEPH>
                    <Mena>EUR</Mena>
                    <TypEPH>1</TypEPH>
                    <Datum>2021-04-22</Datum>
                    <PocetZasielok>${orders.length}</PocetZasielok>
                    <Uhrada>
                        <SposobUhrady>5</SposobUhrady>
                        <SumaUhrady>0.00</SumaUhrady>
                    </Uhrada>
                    <DruhZasielky>1</DruhZasielky>
                    <SposobSpracovania>1</SposobSpracovania>
                    <Odosielatel>
                        <Meno/>
                        <Organizacia>MDDr. Maroš Čižmár</Organizacia>
                        <Ulica>Kominárska 141/4</Ulica>
                        <Mesto>Bratislava</Mesto>
                        <PSC>83104</PSC>
                        <Krajina>SK</Krajina>
                        <Telefon>00421908474924</Telefon>
                        <Email>info@biovoxel.tech</Email>
                        <CisloUctu>SK9783300000002601597323</CisloUctu>
                    </Odosielatel>
                </InfoEPH>
                <Zasielky>${packages}</Zasielky>
            </EPH>
            <contract>false</contract>
        </importSheetRequest>
    </SOAP-ENV:Body>
</SOAP-ENV:Envelope>`;
  }

}
