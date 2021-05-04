import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DocsNeededService {

  constructor(private http: HttpClient) { }

  getDocsNeededList() {
    return this.http.get(environment.apiURL + '/PurchaseDocsNeeded');
  }

  getDocsNeededByOrigin(origin) {
    return this.http.get(environment.apiURL + '/PurchaseDocsNeeded/docs/' + origin);
  }
}
