import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private isLoggedIn = new BehaviorSubject<boolean>(false);

  constructor(private router:Router) {}

  // Méthode pour vérifier si l'utilisateur est connecté
  isLoggedIn$() {
    return this.isLoggedIn.asObservable();
  }

  // Méthode pour connecter l'utilisateur
  login(user: string) {
    console.log("???????????????????????????????????????????????")
    // Implémentez votre logique de connexion ici
    this.isLoggedIn.next(true);
    this.router.navigate(['/user-profile',user]); // Redirige vers la route protégée après la connexion

  }
  login1(user: string) {
    console.log("???????????????????????????????????????????????")
    // Implémentez votre logique de connexion ici
    this.isLoggedIn.next(true);
    this.router.navigate([['/personal-page']]); // Redirige vers la route protégée après la connexion

  }


  // Méthode pour déconnecter l'utilisateur
  logout() {
    // Implémentez votre logique de déconnexion ici
    this.isLoggedIn.next(false);
  }
  
}
