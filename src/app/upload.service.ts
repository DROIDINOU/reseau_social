import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UploadService {
  private apiUrl = 'http://localhost:8000/api/profile/photo/';
  private csrfToken: string | null = null;

  constructor(private http: HttpClient) {
    this.getCsrfToken();
  }

  getCsrfToken() {
    this.http.get('http://localhost:8000/csrf/', { withCredentials: true }).subscribe((response: any) => {
      this.csrfToken = response.csrfToken;
      console.log('CSRF Token:', this.csrfToken);
    });
  }

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

  createPhotoProfile(formData: FormData): Observable<any> {
    const headers = this.getAuthHeaders();
    console.log("FormData pour l'upload :", formData);  // Vérifiez le contenu de formData

    return this.http.put<any>(this.apiUrl, formData, { headers: headers, withCredentials: true }).pipe(
      tap(() => this.getCsrfToken())  // Rafraîchir le jeton après chaque requête
    );
  }

  getProfilePhoto(): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.get<any>(this.apiUrl, { headers: headers, withCredentials: true });
  }
}
