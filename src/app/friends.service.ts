import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class FriendsService {

  private apiUrl = 'http://localhost:8000/getfriends/';
  private apiUrl1 = 'http://localhost:8000/addfriends/';
  private apiUrl2 = 'http://localhost:8000/removefriends/';
  private apiUrl3 = 'http://localhost:8000/send-friend-request/';
  private apiUrl4 = 'http://localhost:8000/respond-friend-request/';
  private apiUrl5 = 'http://localhost:8000/friendrequest-all/';

  private csrfToken: string | null = null;
  private friendStatusSubject = new BehaviorSubject<any[]>([]);
  friendStatus$ = this.friendStatusSubject.asObservable();

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
      'X-CSRFToken': this.csrfToken || '',
      
    });
  }

  updateFriendStatus(): void {
    this.receiveFriendRequest().subscribe(
      response => {
        this.friendStatusSubject.next(response);
      },
      error => {
        console.error('Error receiving friend requests:', error);
      }
    );
  }

  sendFriendRequest(to_user: number): Observable<any> {
    const body = { to_user: to_user };
    console.log('Sending friend request:', body); // Ajoutez un log ici pour vérifier si le code est exécuté
    return this.http.post<any>(this.apiUrl3, body, {headers: this.getAuthHeaders(), withCredentials: true }).pipe(
      tap(response => {
        this.csrfToken = response.csrfToken;
        console.log('Refreshed CSRF Token:', this.csrfToken);
      }),
      catchError(error => {
        console.error('Error sending friend request:', error);
        throw error;
      })
    );
  }

  receiveFriendRequest(): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.get<any>(this.apiUrl5, { headers, withCredentials: true }).pipe(
      catchError(error => {
        console.error('Error receiving friend requests:', error);
        throw error;
      })
    );
  }

  getProfilePhoto(): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.get<any>(this.apiUrl, { headers, withCredentials: true }).pipe(
      catchError(error => {
        console.error('Error getting profile photo:', error);
        throw error;
      })
    );
  }
}


  
 