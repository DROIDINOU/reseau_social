import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap, switchMap } from 'rxjs/operators';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class PointscountService {
  
  private apiurl1 = 'http://localhost:8000/top-profiles/';
  private apiurl2 = 'http://localhost:8000/top-videos/';
  private apiurl3 = 'http://localhost:8000/top-photos';
  
  
  
  authtoken: string | null = null;
  private csrfToken: string | null = null;
  constructor(private http: HttpClient, private auth: AuthService) { }




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




getphotoscount(): Observable<any> {
  return this.http.get<any>(this.apiurl3, { withCredentials: true });
}

getvideoscount(): Observable<any> {
  return this.http.get<any>(this.apiurl2, { withCredentials: true });
}

getprofilecount(): Observable<any> {
  return this.http.get<any>(this.apiurl1, { withCredentials: true });
}

}