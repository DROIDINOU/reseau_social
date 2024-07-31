import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { tap, switchMap, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CommentModalsService {
  private apiurl1 = 'http://localhost:8000/api/log/';
  private apiurl2 = 'http://localhost:8000/comments/try/';
  private apiurl3 = 'http://localhost:8000/messages/comments/link/';
  private apiurl4 = 'http://localhost:8000/messages/comments/link/';
  private apiurl5 = 'http://localhost:8000/comments/createlikes/';
  private apiurl6 = 'http://localhost:8000/comments/all/';
  private apiurl7 = 'http://localhost:8000/comments/commentsbymessage/link/';
  private apiurl8 = 'http://localhost:8000/comments/commentsbyphoto/link/';
  private apiurl9 = 'http://localhost:8000/comments/trytry/';

  

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

  createComment(content: string, message_id: number): Observable<any> {
    return this.performRequest(() => {
      const headers = this.getAuthHeaders();
      return this.http.post<any>(this.apiurl2, { content, message_id }, { headers: headers, withCredentials: true });
    });
  }

  createComment1(content: string, photo_id: number): Observable<any> {
    return this.performRequest(() => {
      const headers = this.getAuthHeaders();
      return this.http.post<any>(this.apiurl9, { content, photo_id }, { headers: headers, withCredentials: true });
    });
  }

  getComment(): Observable<any> {
    return this.performRequest(() => 
      this.http.get<any>(this.apiurl3, { withCredentials: true })
    );
  }

  createLikesComment(comments_id: any): Observable<any> {
    return this.performRequest(() => {
      const headers = this.getAuthHeaders();
      const body = { action: 'like' };
      const url = `${this.apiurl5}${comments_id}/`;
      return this.http.post<any>(url, body, { headers: headers, withCredentials: true });
    });
  }

  getLikesComment(comments_id: any): Observable<any> {
    return this.performRequest(() => {
      const url = `${this.apiurl4}${comments_id}/`;
      const headers = this.getAuthHeaders();
      return this.http.get<any>(url, { headers: headers, withCredentials: true });
    });
  }

  get_All_Comments(): Observable<any> {
    return this.performRequest(() => 
      this.http.get<any>(this.apiurl6, { withCredentials: true })
    );
  }

  getCommentsByMessage(message_id: any): Observable<any> {
    return this.performRequest(() => {
      const params = { message: message_id };
      const url = `${this.apiurl7}${message_id}/`;
      const headers = this.getAuthHeaders();
      return this.http.get<any>(url, { params: params, headers: headers, withCredentials: true });
    });
  }

  getCommentsByPhoto(photo_id: any): Observable<any> {
    return this.performRequest(() => {
      const params = { photo: photo_id };
      const url = `${this.apiurl8}${photo_id}/`;
      const headers = this.getAuthHeaders();
      return this.http.get<any>(url, { params: params, headers: headers, withCredentials: true });
    });
  }
}
