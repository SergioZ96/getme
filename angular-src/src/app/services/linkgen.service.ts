import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LinkgenService {

  constructor(private http: HttpClient) { }

  updateLink(link): Observable<any> {
    return this.http.put<any>(`api/update_link/${link}`, link);
  }

  getProfile_from_link(link): Observable<any> {
    return this.http.get<any>( `api/profile_link/${link}`, link);
  }

}
