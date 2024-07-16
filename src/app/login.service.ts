import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable,throwError } from 'rxjs';
import { AuthService } from './auth.service';
import { catchError } from 'rxjs/operators';
import { tap } from 'rxjs';



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


  authtoken : string|null = null
  private csrfToken: string | null = null;

  private headers = new HttpHeaders({
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  });
  
  


  constructor(private http: HttpClient, private auth: AuthService) {     this.getCsrfToken();
  }
  getCsrfToken() {
    this.http.get('http://localhost:8000/csrf/', { withCredentials: true }).subscribe((response: any) => {
      this.csrfToken = response.csrfToken;
    });
  }
  registerUser(formData: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, formData);
  }

  login(username: string, password: string) {
    return this.http.post<any>(this.apiUrl1, { username, password });
  }

  logout() {
    return this.http.post<any>('http://localhost:8000/api/logout/', {});
  }

  createMessage(message: string): Observable<any> {
    const headers = new HttpHeaders({
      'X-CSRFToken': this.csrfToken || ''
    });
    console.log(message)
    return this.http.post<any>(this.apiurl2, { message }, { headers: headers, withCredentials: true }).pipe(
      tap(() => this.getCsrfToken())  // Rafraîchir le jeton après chaque requête
    );
  }

  getMessages(): Observable<any> {
    return this.http.get<any>(this.apiurl3, { withCredentials: true });
  }

  createlikes(message_id:any): Observable<any> {
    const headers = new HttpHeaders({
      'X-CSRFToken': this.csrfToken || ''
    });
    const body = {action: 'like' };
    console.log("salut",body)
    const url = `${this.apiurl5}${message_id}/`;
    return this.http.post<any>(url,body, {headers: headers, withCredentials: true }).pipe(
      tap(() => this.getCsrfToken())  // Rafraîchir le jeton après chaque requête
    );
  }

  getlikes(message_id:any): Observable<any> {
    console.log("iciiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiii");
    const url = `${this.apiurl4}${message_id}/`;
    const headers = new HttpHeaders({
      'X-CSRFToken': this.csrfToken || ''
    });
    return this.http.get<any>(url, {headers: headers, withCredentials: true });
  }

}
