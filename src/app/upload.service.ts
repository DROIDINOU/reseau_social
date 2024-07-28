import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, firstValueFrom, throwError } from 'rxjs';
import { tap, switchMap, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UploadService {
  private apiUrl = 'http://localhost:8000/api/profile/photo/';
  private apiUrl1 = 'http://localhost:8000/profile/by-username';
  private apiUrl2 = 'http://localhost:8000/profile/by-username';
  private apiUrl3 = 'http://localhost:8000/api/profilid/';
  private apiUrl4 = 'http://localhost:8000/api/photosupload/';
  private apiUrl5 = 'http://localhost:8000/api/photosuploadbis/';
  private apiUrl6 = 'http://localhost:8000/photos/by-username/';

  private csrfToken: string | null = null;

  constructor(private http: HttpClient) {}

  refreshCsrfToken(): Observable<any> {
    return this.http.get<any>('http://localhost:8000/csrf/', { withCredentials: true }).pipe(
      tap(response => {
        this.csrfToken = response.csrfToken;
        console.log('Refreshed CSRF Token:', this.csrfToken);
      })
    );
  }

  private getAuthHeaders(): HttpHeaders {
    return new HttpHeaders({
      'X-CSRFToken': this.csrfToken || ''
    });
  }

  private performRequest<T>(request: () => Observable<T>): Observable<T> {
    return this.refreshCsrfToken().pipe(
      switchMap(() => request()),
      catchError(error => {
        console.error('Request failed', error);
        return throwError(error);
      })
    );
  }

  createPhotoProfile(formData: FormData): Observable<any> {
    return this.performRequest(() => 
      this.http.put<any>(this.apiUrl, formData, { headers: this.getAuthHeaders(), withCredentials: true })
    );
  }

  createPhoto(formData1: FormData): Observable<any> {
    return this.performRequest(() => 
      this.http.post<any>(this.apiUrl4, formData1, { headers: this.getAuthHeaders(), withCredentials: true })
    );
  }

  getProfilePhoto(): Observable<any> {
    return this.performRequest(() => 
      this.http.get<any>(this.apiUrl, { headers: this.getAuthHeaders(), withCredentials: true })
    );
  }

  getPhoto(): Observable<any> {
    return this.performRequest(() => 
      this.http.get<any>(this.apiUrl4, { headers: this.getAuthHeaders(), withCredentials: true })
    );
  }

  getProfilePhoto1(): Observable<any> {
    return this.performRequest(() => 
      this.http.get<any>(this.apiUrl3, { headers: this.getAuthHeaders(), withCredentials: true })
    );
  }

  // Convertir Observable en Promise
  getProfilePhoto1AsPromise(): Promise<any[]> {
    return firstValueFrom(this.getProfilePhoto1());
  }

  getPhoto1(): Observable<any> {
    return this.performRequest(() => 
      this.http.get<any>(this.apiUrl5, { headers: this.getAuthHeaders(), withCredentials: true })
    );
  }

  // Convertir Observable en Promise
  getPhoto1AsPromise(): Promise<any[]> {
    return firstValueFrom(this.getPhoto1());
  }

  getProfileByUsername(username: string): Observable<any> {
    return this.performRequest(() => {
      const params = new HttpParams().set('username', username);
      return this.http.get<any>(`${this.apiUrl1}/`, { headers: this.getAuthHeaders(), params: params, withCredentials: true });
    });
  }

  getPhotosByUsername(username: string): Observable<any> {
    return this.performRequest(() => {
      const params = new HttpParams().set('username', username);
      return this.http.get<any>(`${this.apiUrl6}/`, { headers: this.getAuthHeaders(), params: params, withCredentials: true });
    });
  }
}
