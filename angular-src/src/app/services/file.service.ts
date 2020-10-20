import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FileService {

  constructor(private http: HttpClient) { }

  postFile(file): Observable<any> {
    const formData: FormData = new FormData();
    formData.append('profile_photo', file, file.name);
    return this.http.post<any>('http://localhost:3000/upload', formData);
  }

}
