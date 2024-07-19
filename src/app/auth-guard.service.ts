import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from './auth.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs'; 

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  token : string|null = "";
  constructor(private router: Router, private authservice: AuthService) {}

  canActivate(): Observable<boolean> {
    return this.authservice.isLoggedIn$().pipe(
      map(isLoggedIn => {
        if (isLoggedIn) {
          console.log("ttttttttttttttttttttttttttttttttttttttttttttfffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff")
          return true;
        } else {
          console.log("salllllllllllo");
          this.router.navigate(['/login']);
          return false;
        }
      })
    );
  }
  
}