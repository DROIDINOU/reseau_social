import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders , HttpParams} from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  private apiUrl = 'http://localhost:8000/api/register/';
  private apiUrl1 = 'http://localhost:8000/api/log/';
  private apiurl2 = 'http://localhost:8000/messages/create/';
  private apiurl3 = 'http://localhost:8000/messages/creates/';
  private apiurl4 = 'http://localhost:8000/messages/getlikes/';
  private apiurl5 = 'http://localhost:8000/messages/createlikes/';
  private apiurl6 = 'http://localhost:8000/user-by-username/';

  authtoken: string | null = null;
  private csrfToken: string | null = null;

  private headers = new HttpHeaders({
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  });

  constructor(private http: HttpClient, private auth: AuthService) {
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
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'X-CSRFToken': this.csrfToken || ''
    });
  }

  registerUser(formData: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, formData, { headers: this.getAuthHeaders(), withCredentials: true });
  }

  login(username: string, password: string): Observable<any> {
    return this.http.post<any>(this.apiUrl1, { username, password }, { headers: this.getAuthHeaders(), withCredentials: true });
  }

  logout(): Observable<any> {
    return this.http.post<any>('http://localhost:8000/api/logout/', {}, { headers: this.getAuthHeaders(), withCredentials: true });
  }

  createMessage(message: string): Observable<any> {
    const headers = this.getAuthHeaders();
    console.log('Creating message:', message);
    console.log('CSRF Token create message:', this.csrfToken);

    return this.http.post<any>(this.apiurl2, { message }, { headers: headers, withCredentials: true }).pipe(
      tap(() => this.getCsrfToken()) // Rafraîchir le jeton après chaque requête
    );
  }

  getMessages(): Observable<any> {
    return this.http.get<any>(this.apiurl3, { withCredentials: true });
  }

  createlikes(message_id: any): Observable<any> {
    const headers = this.getAuthHeaders();
    const body = { action: 'like' };
    console.log('Liking message:', message_id);
    const url = `${this.apiurl5}${message_id}/`;
    return this.http.post<any>(url, body, { headers: headers, withCredentials: true }).pipe(
      tap(() => this.getCsrfToken()) // Rafraîchir le jeton après chaque requête
    );
  }

  getlikes(message_id: any): Observable<any> {
    console.log('Getting likes for message:', message_id);
    const url = `${this.apiurl4}${message_id}/`;
    const headers = this.getAuthHeaders();
    return this.http.get<any>(url, { headers: headers, withCredentials: true });
  }

  getUserByName(message_id: any): Observable<any> {
    const params = new HttpParams().set('username', message_id);
    const headers = this.getAuthHeaders(); // Vous pouvez ajuster cette méthode selon vos besoins
    return this.http.get<any>(this.apiurl6, { headers: headers, params: params, withCredentials: true });
  }
}
