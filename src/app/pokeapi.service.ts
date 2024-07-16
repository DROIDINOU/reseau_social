import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PokeApiResponse } from './poke';

@Injectable({
  providedIn: 'root'
})
export class PokeapiService {

  private apiUrl = 'https://pokeapi.co/api/v2/pokemon';

  constructor(private http: HttpClient) { }

  getPokemon(start:number,end:number): Observable<PokeApiResponse> {
    return this.http.get<PokeApiResponse>(`${this.apiUrl}?offset=${start}&limit=${end}`);
  }

  getsample(): Observable<PokeApiResponse>{

    return this.http.get<PokeApiResponse>(this.apiUrl)
  }

}
