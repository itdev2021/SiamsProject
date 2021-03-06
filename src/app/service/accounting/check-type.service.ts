import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CheckTypeService {

  constructor(private http: HttpClient) { }

  getCheckTypeList() {
    return this.http.get(environment.apiURL + '/CheckType');
  }
}
