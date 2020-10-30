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
    return this.http.post<any>('http://localhost:3000/upload_profile_pic', formData);
  }

  getProfile(): Observable<any> {
    //let httpOptions = { headers: new HttpHeaders({'Content-Type': 'application/json'})};
    return this.http.get<any>('http://localhost:3000/profile');
  }

  getProfileImages(): Observable<any> {
    return this.http.get<any>('http://localhost:3000/profile_images');
  }

  currentImage(photoID): Observable<any> {
    return this.http.put<any>(`http://localhost:3000/update_current/${photoID}`, photoID);
  }

  deleteImage(photoID): Observable<any> {
    return this.http.delete<any>(`http://localhost:3000/delete_photo/${photoID}`);
  }

  postBio(bio): Observable<any> {
    const httpOptions = { headers: new HttpHeaders({'Content-Type': 'application/json'})};
    return this.http.post<any>('http://localhost:3000/bio', {bio: bio}, httpOptions);
  }

}
