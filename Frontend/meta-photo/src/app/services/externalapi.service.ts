import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class ExternalapiService {
  private baseUrl = 'https://relishiqmetaphoto-masterjd-masterjds-projects-e3c5d79f.vercel.app/externalapi';

  constructor(private http: HttpClient) {}

  getPhotos(params: any): Observable<any> {
    let httpParams = new HttpParams();
    for (const key in params) {
      if (params[key]) {
        httpParams = httpParams.set(key, params[key]);
      }
    }
    return this.http.get(`${this.baseUrl}/photos`, { params: httpParams });
  }

  getPhotoById(id: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/photos/${id}`);
  }
}
