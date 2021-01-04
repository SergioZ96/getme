import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GService {

  constructor(private http: HttpClient) { }

  addGetme(getme): Observable<any> {
    let httpOptions = { headers: new HttpHeaders({'Content-Type': 'application/json'})};
    return this.http.post<any>('api/getme', getme, httpOptions);
  }

  loadGetme(): Observable<any> {
    let httpOptions = { headers: new HttpHeaders({'Content-Type': 'application/json'})};
    return this.http.get<any>('api/getme', httpOptions);
  }

  editGetme(getme): Observable<any> {
    let httpOptions = { headers: new HttpHeaders({'Content-Type': 'application/json'})};
    return this.http.put<any>(`api/getme/${getme._id}`, getme, httpOptions);
  }

  deleteGetme(id): Observable<any> {
    //let httpOptions = { headers: new HttpHeaders({'Content-Type': 'application/json'})};
    return this.http.delete<any>(`api/getme/${id}`);
  }


}
