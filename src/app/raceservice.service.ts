import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders} from '@angular/common/http';
import { Observable } from 'rxjs';
import { Raceinterface } from './raceinterface';

@Injectable({
  providedIn: 'root'
})
export class RaceserviceService {

  private url : string = "https://api.thecatapi.com/v1/breeds";
  private headers = new HttpHeaders({
    'Content-Type': 'application/json',
    'x-api-key': 'live_k4wXHpMU7GbdRJ0qhX7msc00Iobgo6HcAtjjTYHGz6zi0rRWZJFasQnBk9PbgyKk'
  });
  constructor(private http: HttpClient) { }

  getrace():Observable<Raceinterface[]>{
    console.log("iciiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiii")
    console.log(this.http.get<Raceinterface[]>(this.url,{ headers: this.headers }));
    return this.http.get<Raceinterface[]>(this.url,{ headers: this.headers })


  }








}
