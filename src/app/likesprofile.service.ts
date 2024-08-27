import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap, switchMap } from 'rxjs/operators';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class LikesprofileService {

  
  private apiurl4 = 'http://localhost:8000/messages/getlikesprofile/';
  private apiurl5 = 'http://localhost:8000/messages/createlikesprofile/';
  private apiurl6 = 'http://localhost:8000/test/';
  private apiurl7 = 'http://localhost:8000/profile-picture-all/';

  
  
  


  authtoken: string | null = null;
  private csrfToken: string | null = null;

  constructor(private http: HttpClient, private auth: AuthService) {
    this.getCsrfToken();
  }

  getCsrfToken() {
    this.http.get('http://localhost:8000/csrf/', { withCredentials: true }).subscribe((response: any) => {
      this.csrfToken = response.csrfToken;
      console.log(this.csrfToken)
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

  private performRequest<T>(request: () => Observable<T>): Observable<T> {
    return this.refreshCsrfToken().pipe(
      switchMap(() => request()),
      catchError(error => {
        console.error('Request failed', error);
        return throwError(error);
      })
    );
  }

 
  createlikesprofile(user_id: any): Observable<any> {
    return this.refreshCsrfToken().pipe(
      switchMap(() => {
        const headers = this.getAuthHeaders();
        const body = { action: 'like' };
        const url = `${this.apiurl5}${user_id}/`;
        return this.http.post<any>(url, body, { headers: headers, withCredentials: true });
      })
    );
  }

  getlikesprofile(user_id: any): Observable<any> {
    return this.refreshCsrfToken().pipe(
      switchMap(() => {
        const url = `${this.apiurl4}${user_id}/`;
        return this.http.get<any>(url, { headers: this.getAuthHeaders(), withCredentials: true });
      })
    );
  }

  getid(user_id: any): Observable<any> {
    return this.refreshCsrfToken().pipe(
      switchMap(() => {
        const url = `${this.apiurl6}${user_id}/`;
        return this.http.get<any>(url, { headers: this.getAuthHeaders(), withCredentials: true });
      })
    );
  }

  test(user_id: any): Observable<any> {
    return this.refreshCsrfToken().pipe(
      switchMap(() => {
        const headers = this.getAuthHeaders();
        const url = `${this.apiurl6}`;  // Assure-toi que cette URL est correcte

        const body = { user_id: user_id };
        return this.http.post<any>(url,body, { headers: headers, withCredentials: true });
      })
    );
  }

 


  getAllprofile(): Observable<any> {
    return this.refreshCsrfToken().pipe(
      switchMap(() =>
        this.http.get<any>(this.apiurl7, { withCredentials: true })
      )
    );
  }


}
