import { Injectable,OnInit } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LocalstorageserviceService implements OnInit {

  private tokenSubject: BehaviorSubject<string | null>;

  constructor() {
    // Initialiser tokenSubject dans le constructeur
    this.tokenSubject = new BehaviorSubject<string | null>(localStorage.getItem('token'));

    // Écouter les changements dans localStorage
    window.addEventListener('storage', (event) => {
      if (event.key === 'token') {
        this.tokenSubject.next(event.newValue);
      }
    });
  }

  ngOnInit(): void {
    // Vous pouvez initialiser ici si vous utilisez ce service dans un composant
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  getTokenObservable(): Observable<string | null> {
    return this.tokenSubject.asObservable();
  }
}
