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
    return this.http.post<any>('upload_profile_pic', formData);
  }

  getProfile(): Observable<any> {
    //let httpOptions = { headers: new HttpHeaders({'Content-Type': 'application/json'})};
    return this.http.get<any>('profile');
  }

  getProfileImages(): Observable<any> {
    return this.http.get<any>('profile_images');
  }

  currentImage(photoID): Observable<any> {
    return this.http.put<any>(`update_current/${photoID}`, photoID);
  }

  deleteImage(photoID): Observable<any> {
    return this.http.delete<any>(`delete_photo/${photoID}`);
  }

  postBio(bio): Observable<any> {
    const httpOptions = { headers: new HttpHeaders({'Content-Type': 'application/json'})};
    return this.http.post<any>('bio', {bio: bio}, httpOptions);
  }

  editBio(bio): Observable<any> {
    return this.http.put<any>(`update_bio/${bio}`, bio);
  }

}
