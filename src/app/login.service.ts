import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap, switchMap } from 'rxjs/operators';
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
  private apiurl7 = 'http://localhost:8000/friendrequest-all/';
  private apiurl8 = 'http://localhost:8000/UserrequestAll/';
  private apiurl9 = 'http://localhost:8000/api/logout/';
  private apiurl10 = 'http://localhost:8000/photos/getlikes/';
  private apiurl11 = 'http://localhost:8000/photos/createlikes/';
  private apiurl12 = 'http://localhost:8000/photos/all/';
  private apiurl13 = 'http://localhost:8000/videos/all/';
  private apiurl14 = 'http://localhost:8000/videos/getlikes/';
  private apiurl15 = 'http://localhost:8000/videos/createlikes/';
  private apiurl16 = 'http://localhost:8000/photos/getlikes/photo';
  private apiurl17 = 'http://localhost:8000/photo/getlikestest/';
  private apiurl18 = 'http://localhost:8000/video/getlikesvideostest/';
  private apiurl19 = 'http://localhost:8000/api/friends/messages/';
  private apiurl20 = 'http://localhost:8000/api/friends/photos/';
  private apiurl21 = 'http://localhost:8000/api/friends/videos/';


 



  
  


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

  registerUser(formData: any): Observable<any> {
    return this.refreshCsrfToken().pipe(
      switchMap(() =>
        this.http.post<any>(this.apiUrl, formData, { headers: this.getAuthHeaders(), withCredentials: true })
      )
    );
  }

  login(username: string, password: string): Observable<any> {
    return this.refreshCsrfToken().pipe(
      switchMap(() =>
        this.http.post<any>(this.apiUrl1, { username, password }, { headers: this.getAuthHeaders(), withCredentials: true })
      ),
      tap(response => {
        if (response && response.user) {
          localStorage.setItem('currentUser', JSON.stringify(response.user));
          console.log("ttttttttttttttttttttttttttttttttt",response.user)
        }
      }),
      catchError(error => {
        console.error('Login failed', error);
        return throwError(error);
      })
    );
  }
  logout(): Observable<any> {
    return this.refreshCsrfToken().pipe(
      switchMap(() => 
        this.http.post<any>(this.apiurl9, {}, { headers: this.getAuthHeaders(), withCredentials: true }).pipe(
          tap(() => {
            console.log('Logged out successfully');
            this.csrfToken = null;
            this.getCsrfToken();  // Rafraîchir le jeton CSRF après la déconnexion
          }),
          catchError(error => {
            console.error('Logout failed', error);
            return throwError(error);
          })
        )
      )
    );
  }

  // MESSAGES
  createMessage(message: string): Observable<any> {
    return this.refreshCsrfToken().pipe(
      switchMap(() =>
        this.http.post<any>(this.apiurl2, { message }, { headers: this.getAuthHeaders(), withCredentials: true })
      )
    );
  }

  getMessages(): Observable<any> {
    return this.http.get<any>(this.apiurl3, { withCredentials: true });
  }

  createlikes(message_id: any): Observable<any> {
    return this.refreshCsrfToken().pipe(
      switchMap(() => {
        const headers = this.getAuthHeaders();
        const body = { action: 'like' };
        const url = `${this.apiurl5}${message_id}/`;
        return this.http.post<any>(url, body, { headers: headers, withCredentials: true });
      })
    );
  }

  getlikes(message_id: any): Observable<any> {
    return this.refreshCsrfToken().pipe(
      switchMap(() => {
        const url = `${this.apiurl4}${message_id}/`;
        return this.http.get<any>(url, { headers: this.getAuthHeaders(), withCredentials: true });
      })
    );
  }

  
  createlikesvideos(videos_id: any): Observable<any> {
    return this.refreshCsrfToken().pipe(
      switchMap(() => {
        const headers = this.getAuthHeaders();
        const body = { action: 'like' };
        const url = `${this.apiurl15}${videos_id}/`;
        return this.http.post<any>(url, body, { headers: headers, withCredentials: true });
      })
    );
  }




  getUserByName(message_id: any): Observable<any> {
    return this.refreshCsrfToken().pipe(
      switchMap(() => {
        const params = new HttpParams().set('username', message_id);
        return this.http.get<any>(this.apiurl6, {params: params, withCredentials: true });
      })
    );
  }

  getAll(): Observable<any> {
    return this.refreshCsrfToken().pipe(
      switchMap(() =>
        this.http.get<any>(this.apiurl8, { withCredentials: true })
      )
    );
  }

  

  getCurrentUserFromStorage(): any {
    const storedUser = localStorage.getItem('currentUser');
    return storedUser ? JSON.parse(storedUser) : null;
  }




  // PHOTOS

  getlikesphotostest(photo_id: any): Observable<any> {
    return this.refreshCsrfToken().pipe(
      switchMap(() => {
        const url = `${this.apiurl17}${photo_id}/`;
        return this.http.get<any>(url, {withCredentials: true });
      })
    );
  }


  getlikesvideostest(video_id: any): Observable<any> {
    return this.refreshCsrfToken().pipe(
      switchMap(() => {
        const url = `${this.apiurl18}${video_id}/`;
        return this.http.get<any>(url, {withCredentials: true} );
      })
    );
  }

  


  createlikesphotos(photo_id: number): Observable<any> {
    console.log("id photo",photo_id)
    return this.refreshCsrfToken().pipe(
      switchMap(() => {
        const headers = this.getAuthHeaders();
        const body = { action: 'like' };
        const url = `${this.apiurl11}${photo_id}/`;
        return this.http.post<any>(url, body, { headers: headers, withCredentials: true });
      })
    );
  }

  getlikesphotos(photo_id: any): Observable<any> {
    return this.refreshCsrfToken().pipe(
      switchMap(() => {
        const url = `${this.apiurl10}${photo_id}/`;
        return this.http.get<any>(url, { withCredentials: true });
      })
    );
  }

  getlikesvideos(video_id: any): Observable<any> {
    return this.refreshCsrfToken().pipe(
      switchMap(() => {
        const url = `${this.apiurl14}${video_id}/`;
        return this.http.get<any>(url, {withCredentials: true });
      })
    );
  }
  getAllPhotos(): Observable<any> {
    return this.refreshCsrfToken().pipe(
      switchMap(() =>
        this.http.get<any>(this.apiurl12, { withCredentials: true })
      )
    );
  }



  //FRIENDS

  getMessagesFriends(): Observable<any> {
    return this.http.get<any>(this.apiurl19, { withCredentials: true });
  }

  getPhotosFriends(): Observable<any> {
    return this.http.get<any>(this.apiurl20, { withCredentials: true });
  }

  getVideosFriends(): Observable<any> {
    return this.http.get<any>(this.apiurl21, { withCredentials: true });
  }

}