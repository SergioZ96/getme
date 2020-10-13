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
    return this.http.post<any>('http://localhost:3000/addgetme', getme, httpOptions);
  }

  loadGetme(): Observable<any> {
    let httpOptions = { headers: new HttpHeaders({'Content-Type': 'application/json'})};
    return this.http.get<any>('http://localhost:3000/loadgetme', httpOptions);
  }

  editGetme(getme): Observable<any> {
    let httpOptions = { headers: new HttpHeaders({'Content-Type': 'application/json'})};
    return this.http.put<any>(`http://localhost:3000/editgetme/${getme._id}`, getme, httpOptions);
  }

  deleteGetme(id): Observable<any> {
    //let httpOptions = { headers: new HttpHeaders({'Content-Type': 'application/json'})};
    return this.http.delete<any>(`http://localhost:3000/deletegetme/${id}`);
  }


}
