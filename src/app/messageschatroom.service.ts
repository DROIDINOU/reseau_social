import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap, switchMap } from 'rxjs/operators';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class MessageschatroomService {

  private apiUrl = 'http://localhost:8000/messageschat/';
  private apiUrl1 = 'http://localhost:8000/messageschat/list/';
  authtoken: string | null = null;
  private csrfToken: string | null = null;

  constructor(private http: HttpClient, private auth: AuthService) { this.getCsrfToken();}


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


createChatMessage(content: string,sender_id:number, receiver_id:number): Observable<any> {
  return this.refreshCsrfToken().pipe(
    switchMap(() =>
      this.http.post<any>(this.apiUrl, { content, sender_id, receiver_id }, { headers: this.getAuthHeaders(), withCredentials: true })
    )
  );


}

getMessages(senderId: string, receiverId: string): Observable<any> {
  // Configuration des paramètres de la requête
  const params = new HttpParams()
    .set('sender', senderId)
    .set('receiver', receiverId);

  // Effectuer une requête GET avec des paramètres de requête
  return this.http.get<any>(this.apiUrl1, { params });
}








}
