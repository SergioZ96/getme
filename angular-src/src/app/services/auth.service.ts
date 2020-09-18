import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';
import { JwtHelperService } from '@auth0/angular-jwt';

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

  constructor(private http: HttpClient, private cs: CookieService, public jwtHelper: JwtHelperService) { }


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

  //getProfile(): Observable<any>{

  //}
  addGetme(getme): Observable<any> {
    let httpOptions = { headers: new HttpHeaders({'Content-Type': 'application/json'})};
    return this.http.post<any>('http://localhost:3000/addgetme', getme, httpOptions);
  }

  loadGetme(): Observable<any> {
    let httpOptions = { headers: new HttpHeaders({'Content-Type': 'application/json'})};
    return this.http.get<any>('http://localhost:3000/loadgetme',httpOptions);
  }

  deleteGetme(topic): Observable<any> {
    let httpOptions = { headers: new HttpHeaders({'Content-Type': 'application/json'})};
    return this.http.post<any>('http://localhost:3000/deletegetme', topic, httpOptions);
  }

  
  storeUserData(token, user){
    localStorage.setItem('jwt', token);
    localStorage.setItem('user', JSON.stringify(user));
    this.authToken = token;
    this.user = user;
  }

  loadToken(){
    const token = localStorage.getItem('jwt');
    this.authToken = token;
  }

  loggedIn(){
   // true if token not available or expired
   // flase if token is not
    return !(this.jwtHelper.isTokenExpired());
  }

  logout(){
    this.authToken = null;
    this.user = null;
    localStorage.clear();
    //this.cs.delete('jwt_user');
  }

}
