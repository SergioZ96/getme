import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  authToken: any;
  user: any;

  /* ** Communicating w/ backend services using HTTP
          Most front-end applications need to communicate w/ a server over the HTTP protocol, in order 
          to download or upload data and access other back-end services. Angular provides a
          client HTTP API for Angular apps, the HttpClient service class in @angular/common/http
  */

  constructor(private http: HttpClient, private cs: CookieService) { }


  getCookie(){
    var cookieValue = JSON.parse(this.cs.get('jwt_user'));
    this.storeUserData(cookieValue.jwt, cookieValue.user);
    this.cs.delete('jwt_user');
  }
  /*  
  auth_User(): Observable<any> {
    let httpOptions = { headers: new HttpHeaders({'Content-Type': 'application/json'})};
    return this.http.post<any>('http://localhost:3000/auth', httpOptions);
  }  */

  
  storeUserData(token, user){
    localStorage.setItem('jwt', token);
    localStorage.setItem('user', JSON.stringify(user));
    this.authToken = token;
    this.user = user;
  }

}
