import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import { Observable,throwError,tap } from 'rxjs';


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
  private apiurl7 ='http://localhost:8000/comments/commentsbymessage/link/'


  

  authtoken : string|null = null
  private csrfToken: string | null = null;
  content : string|null = ''

  private headers = new HttpHeaders({
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  });
  

  constructor(private http: HttpClient, private auth: AuthService) {this.getCsrfToken() }


getCsrfToken() {
  this.http.get('http://localhost:8000/csrf/', { withCredentials: true }).subscribe((response: any) => {
    this.csrfToken = response.csrfToken;
    console.log(this.csrfToken )
  });
}


createComment(content: string,message_id:number): Observable<any> {
  const headers = new HttpHeaders({
    'X-CSRFToken': this.csrfToken || ''
  });
  console.log("create commmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmm",message_id)
  return this.http.post<any>(this.apiurl2, { content, message_id }, { headers: headers, withCredentials: true }).pipe(
    tap(() => this.getCsrfToken())  // Rafraîchir le jeton après chaque requête
  );
}

getComment(): Observable<any> {
  console.log("bien ici")
  return this.http.get<any>(this.apiurl3, { withCredentials: true });
}

createLikesComment(comments_id:any): Observable<any> {
  const headers = new HttpHeaders({
    'X-CSRFToken': this.csrfToken || ''
  });
  const body = {action: 'like' };
  console.log("salut",body)
  const url = `${this.apiurl5}${comments_id}/`;
  return this.http.post<any>(url,body, {headers: headers, withCredentials: true }).pipe(
    tap(() => this.getCsrfToken())  // Rafraîchir le jeton après chaque requête
  );
}

getLikesComment(comments_id:any): Observable<any> {
  console.log("iciiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiii");
  const url = `${this.apiurl4}${comments_id}/`;
  console.log("url",url);
  const headers = new HttpHeaders({
    'X-CSRFToken': this.csrfToken || ''
  });
  return this.http.get<any>(url, {headers: headers, withCredentials: true });
}

get_All_Comments(): Observable<any> {
  console.log("bien ici")
  return this.http.get<any>(this.apiurl6, { withCredentials: true });
}

getCommentsByMessage(message_id:any): Observable<any> {
  const params = { message: message_id };
  console.log("iciiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiii");
  const url = `${this.apiurl7}${message_id}/`;
  console.log("url",url);
  const headers = new HttpHeaders({
    'X-CSRFToken': this.csrfToken || ''
  });
  return this.http.get<any>(url, { params: params, headers: headers, withCredentials: true });

}




























}
