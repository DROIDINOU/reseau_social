import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, firstValueFrom } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UploadService {
  private apiUrl = 'http://localhost:8000/api/profile/photo/';
  private apiUrl1 = 'http://localhost:8000/profile/by-username';
  private apiUrl2 = 'http://localhost:8000/profile/by-username';
  private apiUrl3 = 'http://localhost:8000/api/profilid/';
  
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
    let headers = new HttpHeaders({
      'Accept': 'application/json',
      'X-CSRFToken': this.csrfToken || ''
    });

    // Si vous envoyez des données en JSON
    headers = headers.append('Content-Type', 'application/json');

    return headers;
  }

  createPhotoProfile(formData: FormData): Observable<any> {
    const headers = new HttpHeaders({
      'X-CSRFToken': this.csrfToken || ''
    });
    console.log("FormData pour l'upload :", formData);  // Vérifiez le contenu de formData

    return this.http.put<any>(this.apiUrl, formData, { headers: headers, withCredentials: true }).pipe(
      tap(() => this.getCsrfToken())  // Rafraîchir le jeton après chaque requête
    );
  }

  getProfilePhoto(): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.get<any>(this.apiUrl, { headers: headers, withCredentials: true });
  }

  getProfilePhoto1(): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.get<any>(this.apiUrl3, { headers: headers, withCredentials: true });
  }

  // Convertir Observable en Promise
  getProfilePhoto1AsPromise(): Promise<any[]> {
    return firstValueFrom(this.getProfilePhoto1());
  }

  getProfileByUsername(username: string): Observable<any> {
    const headers = this.getAuthHeaders();
    // Construit les paramètres de requête
    const params = new HttpParams().set('username', username);
    // Effectue la requête GET avec les paramètres
    return this.http.get(`${this.apiUrl1}/`, { headers: headers, params: params, withCredentials: true });
  }
}
