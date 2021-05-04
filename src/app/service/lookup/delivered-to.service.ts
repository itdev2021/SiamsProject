import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DeliveredToService {

  constructor(private http:HttpClient) { }

  getList():any {
    return this.http.get(environment.apiURL + '/wsdelivered');
  }
}
