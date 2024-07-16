import { Component, OnInit } from '@angular/core';
import { faHome } from '@fortawesome/free-solid-svg-icons';
import { faUserFriends, faSearch } from '@fortawesome/free-solid-svg-icons';
import { faStar } from '@fortawesome/free-solid-svg-icons';
import { Subscription } from 'rxjs';
import { AuthService } from '../../auth.service';
import { SearchuserService } from '../../searchuser.service';
import { User } from '../../user';
import { Observable, BehaviorSubject } from 'rxjs';
import { Router, ActivatedRoute, ActivatedRouteSnapshot } from '@angular/router';


@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrl: './nav-bar.component.scss',

})
export class NavBarComponent implements OnInit {
  faHome = faHome; // Déclarez une variable pour votre icône
  faUserFriends = faUserFriends;
  fas_Star = faStar;
  isLoggedIn = false;
  isLoggedInSubscription: Subscription= new Subscription();
  searchTerm : string = ""
  faSearch = faSearch;
  redirect : string|null = null;

  protected search_state$ = new BehaviorSubject<User[]>([]);



  constructor(private authService: AuthService, private searches: SearchuserService,private router: Router, private route: ActivatedRoute) { }
  result : any[] = []
  users : User [] = [];

  ngOnInit(): void {
    this.isLoggedInSubscription = this.authService.isLoggedIn$().subscribe(isLoggedIn => {
      this.isLoggedIn = isLoggedIn;
      console.log("logggggggggggggggggggggggggggggggggg",isLoggedIn)
    });
  }

  ngOnDestroy(): void {
    if (this.isLoggedInSubscription) {
      this.isLoggedInSubscription.unsubscribe();
    }
  }

  logout() {
    this.authService.logout();
  }

  findfriends(): void {
    if (this.searchTerm && this.searchTerm.length >= 1) {
      console.log(this.searchTerm);
      this.searches.searchFriends(this.searchTerm).subscribe(users => {
        this.search_state$.next(users);
        console.log(this.search_state$.value);
        const entries = this.search_state$.value.filter(user => user.username.includes(this.searchTerm));
        console.log("entries", entries);
        if (entries.length > 0) {
          console.log("Au moins un utilisateur trouvé");
          return true
        } else {
          console.log("Aucun utilisateur trouvé");
          this.search_state$.next([]);
          return false
          // Faire quelque chose si aucun utilisateur n'est trouvé
        }
      });
    } else {
      this.search_state$.next([]);
    }
  }

  redirectToUserProfile(user:User): void {
    // Snapshot de la route actuelle
    const snapshot: ActivatedRouteSnapshot = this.route.snapshot;

    // Supposons que nous avons un paramètre d'URL nommé 'userId'
    const userId = user
    console.log(user)

    if (user) {
      // Redirection vers une autre route en utilisant le paramètre 'userId'
      this.search_state$.next([]);
      this.searchTerm =""
      this.router.navigate(['/friend', user.username]);
    }
  }
    }
