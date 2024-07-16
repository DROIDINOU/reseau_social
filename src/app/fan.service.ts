import { Injectable } from '@angular/core';
import { Moninterface } from './interface';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { HttpHeaders } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class FanService {
  private fans: Moninterface[] = [
    { id: 0, name: 'Marc LOSSON', birthYear: 1990, favoriteSeries: ['Breaking Bad', 'Game of Thrones'] },
    { id: 1, name: 'Nar Bilgic', birthYear: 1985, favoriteSeries: ['Stranger Things', 'The Mandalorian'] }
  ];

  private apiUrl = 'http://localhost:8000/api/add-cat/';
  private headers = new HttpHeaders({
    'Content-Type': 'application/json',
    'Authorization': 'Bearer your_token_if_needed'
  });

  constructor(private http:HttpClient) { }

  getFans(): Moninterface[] {
    console.log(this.fans)
    return this.fans;
  }

  getFan(id: number) {
    return this.fans.find(fan => fan.id === id);
  }

  getFanbyname(name: string) {
    return this.fans.find(fan => fan.name === name);
  }

  getid(name:string):any {
    let i:any = this.fans.find(fan => fan.name === name);
    console.log(i.id)
    return i
  }

  addFan(fan: any): undefined {
    fan.id = this.fans.length > 0 ? Math.max(...this.fans.map(f => f.id)) + 1 : 1;
    if (this.fans.filter(value=> value.name == fan).length === 0){
    this.fans.push(fan);
    console.log("salut du service", this.fans);
    return fan
  }
    else{console.log("t es pas trop con finalement")
    return undefined
  }

  }

  updateFan (id:string, ajout:string):void{
    console.log("service",this.fans)
    const fan = this.getFanbyname(id);
    console.log("?????",fan);
    if (fan){
    console.log("suis la");
    fan.favoriteSeries.push(ajout);
    console.log("service",this.fans)};
    console.log(this.fans)

  }

  deleteFavoriteSeries(id: string, favoriteSeries: string): void {
    const fan = this.getFanbyname(id);
    if (fan ) {
      fan.favoriteSeries = fan.favoriteSeries.filter(value => value !== favoriteSeries);
    }
  }

  addCat(formData: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, formData, { headers: this.headers });

  }

  ajouterSeries(id: string, favoriteSeries: string): void {
    const fan = this.getFanbyname(id);
    if (fan ) {
      fan.favoriteSeries.push(favoriteSeries)
      console.log(fan)
    }
  }
}

