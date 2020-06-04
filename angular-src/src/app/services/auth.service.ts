import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  /* ** Communicating w/ backend services using HTTP
          Most front-end applications need to communicate w/ a server over the HTTP protocol, in order 
          to download or upload data and access other back-end services. Angular provides a
          client HTTP API for Angular apps, the HttpClient service class in @angular/common/http
  */

  constructor(private http: HttpClient) { }

  auth_GoogleUser(): Observable<any>{
    let httpOptions = {headers: new HttpHeaders({'Content-Type': 'application/json'})};
    return this.http.get<any>('http://localhost:3000/auth/google/', httpOptions);
  }

  auth_FacebookUser(): Observable<any>{
    let httpOptions = {headers: new HttpHeaders({'Content-Type': 'application/json'})};
    return this.http.get<any>('http://localhost:3000/auth/facebook/', httpOptions);
  }


}
