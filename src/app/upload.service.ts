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
  private apiUrl7 = 'http://localhost:8000/api/videosupload/';
  private apiUrl8 = 'http://localhost:8000/api/videosuploadbis/';
  private apiUrl9 = 'http://localhost:8000/videos/by-username/';
  private apiUrl10 = 'http://localhost:8000/api/photosuploadfilactu/';
  private apiUrl11 = 'http://localhost:8000/api/videosuploadfilactu/';
  private apiUrl12 = 'http://localhost:8000/profile-picture-all/';


  

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
      'X-CSRFToken': this.csrfToken || '',

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

  createPhotofil(formData1: FormData): Observable<any> {
    return this.performRequest(() => 
      this.http.post<any>(this.apiUrl10, formData1, { headers: this.getAuthHeaders(), withCredentials: true })
    );
  }

  createVideofil(formData1: FormData): Observable<any> {
    return this.performRequest(() => 
      this.http.post<any>(this.apiUrl11, formData1, { headers: this.getAuthHeaders(), withCredentials: true })
    );
  }

  getPhotofil(): Observable<any> {
    return this.performRequest(() => 
      this.http.get<any>(this.apiUrl10, { withCredentials: true })
    );
  }

  createVideo(formData1: FormData): Observable<any> {
    return this.performRequest(() => 
      this.http.post<any>(this.apiUrl7, formData1, { headers: this.getAuthHeaders(), withCredentials: true })
    );
  }

  getProfilePhoto(): Observable<any> {
    return this.performRequest(() => 
      this.http.get<any>(this.apiUrl, { withCredentials: true })
    );
  }

  getPhoto(): Observable<any> {
    return this.performRequest(() => 
      this.http.get<any>(this.apiUrl4, { withCredentials: true })
    );
  }

  getPhotofilactu(): Observable<any> {
    return this.performRequest(() => 
      this.http.get<any>(this.apiUrl10, { withCredentials: true })
    );
  }

  getVideofilactu(): Observable<any> {
    return this.performRequest(() => 
      this.http.get<any>(this.apiUrl11, { withCredentials: true })
    );
  }

  getVideo(): Observable<any> {
    return this.performRequest(() => 
      this.http.get<any>(this.apiUrl7, {withCredentials: true })
    );
  }


  getphotoprofileall(): Observable<any> {
    return this.performRequest(() => 
      this.http.get<any>(this.apiUrl12, { withCredentials: true })
    );
  }

  getProfilePhoto1(): Observable<any> {
    return this.performRequest(() => 
      this.http.get<any>(this.apiUrl3, { withCredentials: true })
    );
  }

  

  // Convertir Observable en Promise
  getProfilePhoto1AsPromise(): Promise<any[]> {
    return firstValueFrom(this.getProfilePhoto1());
  }

  

  getPhoto1(): Observable<any> {
    return this.performRequest(() => 
      this.http.get<any>(this.apiUrl5, { withCredentials: true })
    );
  }

  // Convertir Observable en Promise
  getPhoto1AsPromise(): Promise<any[]> {
    return firstValueFrom(this.getPhoto1());
  }


  getVideo1(): Observable<any> {
    return this.performRequest(() => 
      this.http.get<any>(this.apiUrl8, { withCredentials: true })
    );
  }

  // Convertir Observable en Promise
  getVideoAsPromise(): Promise<any[]> {
    return firstValueFrom(this.getVideo1());
  }

  getProfileByUsername(username: string): Observable<any> {
    return this.performRequest(() => {
      const params = new HttpParams().set('username', username);
      return this.http.get<any>(`${this.apiUrl1}/`, { params: params, withCredentials: true });
    });
  }




  getPhotosByUsername(username: string): Observable<any> {
    return this.performRequest(() => {
      const params = new HttpParams().set('username', username);
      return this.http.get<any>(`${this.apiUrl6}/`, { params: params, withCredentials: true });
    });
  }


  getVideosByUsername(username: string): Observable<any> {
    return this.performRequest(() => {
      const params = new HttpParams().set('username', username);
      return this.http.get<any>(`${this.apiUrl9}/`, { params: params, withCredentials: true });
    });
  }
}
