import { Component, OnInit } from '@angular/core';
import { faHome } from '@fortawesome/free-solid-svg-icons';
import { faUserFriends, faSearch, faUserPlus } from '@fortawesome/free-solid-svg-icons';
import { faStar,faBell, faExclamationCircle} from '@fortawesome/free-solid-svg-icons';
import { Subscription } from 'rxjs';
import { AuthService } from '../../auth.service';
import { SearchuserService } from '../../searchuser.service';
import { UserService } from '../../user.service';
import { Observable, BehaviorSubject } from 'rxjs';
import { Router, ActivatedRoute, ActivatedRouteSnapshot } from '@angular/router';
import { User } from '../../user';
import { FriendsService } from '../../friends.service';
import { UploadService } from '../../upload.service';
import { switchMap } from 'rxjs/operators';
import { LoginService } from '../../login.service';


@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrl: './nav-bar.component.scss',

})
export class NavBarComponent implements OnInit {
  faHome = faHome; // Déclarez une variable pour votre icône
  faUserFriends = faUserFriends;
  fas_Star = faStar;
  faBell = faBell
  faExclamationCircle = faExclamationCircle

  isLoggedIn = false;
  isLoggedInSubscription: Subscription= new Subscription();
  searchTerm : string = ""
  faSearch = faSearch;
  faUserPlus = faUserPlus;
  redirect : string|null = null;
  userId: string | null = null;
  friend_status : any[] = []
  count_pending :number|null = null
  currentUser: any;
  sender: any[] = []
  showList: boolean = false;

 

  protected search_state$ = new BehaviorSubject<User[]>([]);
  friendStatusSubscription: Subscription = new Subscription();
  friendStatus: any[] = [];


  constructor(private login: LoginService, private FriendService: FriendsService,private upload: UploadService, private authService: AuthService, private searches: SearchuserService,private router: Router, private route: ActivatedRoute, public UserService: UserService) {
  }
  result : any[] = []
  users : User [] = [];

  ngOnInit(): void {
    this.isLoggedInSubscription = this.authService.isLoggedIn$().subscribe(isLoggedIn => {
      this.isLoggedIn = isLoggedIn;
      console.log("Logged in status:", isLoggedIn);
      if (isLoggedIn) {
        this.userId = this.UserService.getUserId();
        console.log("Current user ID:", this.userId);
        this.friend();
      }
    });

    this.authService.getCurrentUser$().pipe(
      switchMap(async user => {
        this.currentUser = user;
        console.log("Current user:", this.currentUser);
        if (this.currentUser) {
          try {
            const result = await this.login.getUserByName(this.currentUser).toPromise();
            console.log("Profile result:", result);
            this.currentUser = result.id;
          } catch (error) {
            console.error("Error fetching profile:", error);
          }
        }
      })
    ).subscribe();

    this.friendStatusSubscription = this.FriendService.friendStatus$.subscribe(status => {
      console.log('Friend request status:', status);
      this.friendStatus = status;




      const count = this.friendStatus.reduce((acc, current) => {
        // Vérifiez si le statut courant est 'pending' et si l'utilisateur cible est l'utilisateur actuel
        if (current.status === 'pending' && current.to_user === this.currentUser) {
          acc.count += 1; // Incrémentez le nombre de demandes en attente
          acc.sender.push(current.from_user); // Ajoutez l'expéditeur de la demande
        }
        return acc; // Assurez-vous de retourner l'accumulateur dans tous les cas
      }, { count: 0, sender: [] }); // Valeur initiale de l'accumulateur
    
      console.log("Nombre de demandes en attente :", count.count);
      console.log("Expéditeurs des demandes :", count.sender);
      this.count_pending = count.count;
      this.sender = count.sender// La valeur initiale de l'accumulateur est 0)
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
        console.log("??????????????????????????????????????????",this.search_state$.value);
        const entries = this.search_state$.value.filter(user => user.username.includes(this.searchTerm));
        console.log("entries", entries);
        if (entries.length > 0) {
          console.log("Au moins un utilisateur trouvé");
          return true
        } else {
          console.log("Aucun utilisateur trouvé");
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
    console.log("iciiiiiiiiiiiiiiiiiiiiiiiiiiiiiiii",userId)

    if (user) {
      // Redirection vers une autre route en utilisant le paramètre 'userId'
      this.search_state$.next([]);
      this.searchTerm =""
      this.router.navigate(['/userprofile', user.username]);
    }
  }


  navigateToPhotoChat(): void {
    this.userId = this.UserService.getUserId(); // Assurez-vous que userId est à jour
    this.router.navigate(['/phtochat', this.userId]);
    console.log("rrrrrrrrrrrrrrrrrrrrrrrrrr",this.userId)
  }

  navigateToFansList(): void {
    this.userId = this.UserService.getUserId(); // Assurez-vous que userId est à jour
    this.router.navigate(['/fanslist', this.userId]);
    console.log("rrrrrrrrrrrrrrrrrrrrrrrrrr",this.userId)

  }
  async friend(): Promise<void> {
    try {
      this.FriendService.updateFriendStatus();
    } catch (error) {
      console.error('Error receiving friend requests:', error);
    }
  }
    }
