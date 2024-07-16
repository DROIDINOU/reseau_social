import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';
import { User } from './user';

@Injectable({
  providedIn: 'root'
})
export class SearchuserService {
  private apiUrl = 'http://localhost:8000/search/friends';
  constructor(private http: HttpClient) { }


  searchFriends(searchTerm: string): Observable<any> {
    // Utiliser substring pour obtenir les trois premiers caractères
    const searchQuery = searchTerm.substring(0, 3);
    return this.http.get<User>(this.apiUrl, { params: { query: searchQuery } });
  }




}
