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
    return this.http.post<any>('api/profile/pic', formData);
  }

  getProfile(): Observable<any> {
    //let httpOptions = { headers: new HttpHeaders({'Content-Type': 'application/json'})};
    return this.http.get<any>('api/profile');
  }

  /* getProfileImages(): Observable<any> {
    return this.http.get<any>('api/profile_images');
  } */

  currentImage(photoID): Observable<any> {
    return this.http.put<any>(`api/profile/pic/${photoID}`, photoID);
  }

  deleteImage(photoID): Observable<any> {
    return this.http.delete<any>(`api/profile/pic/${photoID}`);
  }

  postBio(bio): Observable<any> {
    const httpOptions = { headers: new HttpHeaders({'Content-Type': 'application/json'})};
    return this.http.post<any>('api/profile/bio', {bio: bio}, httpOptions);
  }

  editBio(bio): Observable<any> {
    return this.http.put<any>(`api/profile/bio/${bio}`, bio);
  }

}
