import { Injectable} from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LocalstorageserviceService {

  private tokenSubject: BehaviorSubject<string | null>;
  private preoLoadedDataSubject: BehaviorSubject<any[] | null>;


  constructor() {
    // Initialiser tokenSubject dans le constructeur
    const storedData = localStorage.getItem('preloadeddata');
    const parsedData: any[] | null = storedData ? JSON.parse(storedData) : null;

    this.tokenSubject = new BehaviorSubject<string | null>(localStorage.getItem('token'));
    this.preoLoadedDataSubject = new BehaviorSubject<any[] | null>(parsedData);

    // Écouter les changements dans localStorage
    window.addEventListener('storage', (event) => {
      if (event.key === 'token') {
        this.tokenSubject.next(event.newValue);
      }
      if (event.key === 'preloadeddata') {
        const newData: any[] | null = event.newValue ? JSON.parse(event.newValue) : null;
        this.preoLoadedDataSubject.next(newData);
      }
    });
  }


  getToken(): string | null {

    return localStorage.getItem('token');
  }

  getTokenObservable(): Observable<string | null> {
    return this.tokenSubject.asObservable();
  }

  getPreLoadedData(): any[] | null {
    return JSON.parse(localStorage.getItem('preloadeddata') || '[]');
  }
  
  getPreLoadedDataObservable(): Observable<any[] | null> {
    return this.preoLoadedDataSubject.asObservable();
  }
  
  setPreLoadedData(data: any[]): void {
    localStorage.setItem('preloadeddata', JSON.stringify(data));
    this.preoLoadedDataSubject.next(data);
  }
  
  

}
