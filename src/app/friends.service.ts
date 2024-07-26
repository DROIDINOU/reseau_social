import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject, firstValueFrom } from 'rxjs';
import { catchError, switchMap, tap } from 'rxjs/operators';
import { AuthService } from './auth.service';
import { observableToBeFn } from 'rxjs/internal/testing/TestScheduler';

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
  private apiUrl6 = 'http://localhost:8000/api/friendlist/';


  private csrfToken: string | null = null;
  private friendStatusSubject = new BehaviorSubject<any[]>([]);
  friendStatus$ = this.friendStatusSubject.asObservable();

  constructor(private http: HttpClient, private auth: AuthService) {
    this.getCsrfToken();
  }

  private getCsrfToken(): void {
    this.http.get('http://localhost:8000/csrf/', { withCredentials: true }).subscribe((response: any) => {
      this.csrfToken = response.csrfToken;
      console.log('CSRF Token:', this.csrfToken);
    }, error => {
      console.error('Error getting CSRF token:', error);
    });
  }

  private refreshCsrfToken(): Observable<any> {
    return this.http.get<any>('http://localhost:8000/csrf/', { withCredentials: true }).pipe(
      tap(response => {
        this.csrfToken = response.csrfToken;
        console.log('Refreshed CSRF Token:', this.csrfToken);
      }),
      catchError(error => {
        console.error('Error refreshing CSRF token:', error);
        throw error;
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
        console.log('Friend status received:', response); // Ajoutez un log ici
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
    return this.refreshCsrfToken().pipe(
      switchMap(() => 
        this.http.post<any>(this.apiUrl3, body, { headers: this.getAuthHeaders(), withCredentials: true })
      ),
      catchError(error => {
        console.error('Error sending friend request:', error);
        throw error;
      })
    );
  }

  receiveFriendRequest(): Observable<any> {
    return this.refreshCsrfToken().pipe(
      switchMap(() => 
        this.http.get<any>(this.apiUrl5, { headers: this.getAuthHeaders(), withCredentials: true })
      ),
      catchError(error => {
        console.error('Error receiving friend requests:', error);
        throw error;
      })
    );
  }


  getfriends(): Observable<any> {
    return this.refreshCsrfToken().pipe(
      switchMap(() => 
        this.http.get<any>(this.apiUrl, { headers: this.getAuthHeaders(), withCredentials: true })
      ),
      catchError(error => {
        console.error('Error receiving friend requests:', error);
        throw error;
      })
    );
  }

  getfriendsAsPromise(): Promise<any[]> {
    return firstValueFrom(this.getfriends());
  }



  acceptFriendRequest(action: string, request_id: number): Observable<any> {
    return this.refreshCsrfToken().pipe(
      switchMap(() => {
        const body = { action: action, request_id: request_id };
        return this.http.post<any>(this.apiUrl4, body, { headers: this.getAuthHeaders(), withCredentials: true });
      }),
      catchError(error => {
        console.error('Error accepting friend request:', error);
        throw error;
      })
    );
  }
  }




