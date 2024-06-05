import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environments';

@Injectable({
  providedIn: 'root'
})
export class ExternalapiService {

  private baseUrl = environment.apiUrl + '/externalapi'; // Replace with your Vercel backend URL

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
