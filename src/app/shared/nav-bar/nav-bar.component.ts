import { Component, OnInit, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { faHome, faUserFriends, faSearch, faUserPlus, faStar, faBell, faExclamationCircle, faCheck, faTrash } from '@fortawesome/free-solid-svg-icons';
import { Subscription, BehaviorSubject } from 'rxjs';
import { AuthService } from '../../auth.service';
import { SearchuserService } from '../../searchuser.service';
import { UserService } from '../../user.service';
import { Router, ActivatedRoute } from '@angular/router';
import { User } from '../../user';
import { FriendsService } from '../../friends.service';
import { UploadService } from '../../upload.service';
import { LoginService } from '../../login.service';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.scss'],
})
export class NavBarComponent implements OnInit, OnDestroy {
  faHome = faHome;
  faUserFriends = faUserFriends;
  faStar = faStar;
  faBell = faBell;
  faExclamationCircle = faExclamationCircle;
  faTrash=faTrash;

  isLoggedIn = false;
  isLoggedInSubscription: Subscription = new Subscription();
  searchTerm: string = "";
  faSearch = faSearch;
  faCheck = faCheck;
  faUserPlus = faUserPlus;
  userId: string | null = null;
  countPending: number = 0;
  currentUser: { id: number, username: string } | null = null;
  sender: any[] = [];
  showList: boolean = false;
  allUsers: any[] = [];
  searchResults: User[] = [];
  senders_id: number[] = []
  photos_list: any[] = []

  protected search_state$ = new BehaviorSubject<User[]>([]);
  friendStatusSubscription: Subscription = new Subscription();

  friendStatus: any[] = [];

  constructor(
    private login: LoginService,
    private friendService: FriendsService,
    private upload: UploadService,
    private authService: AuthService,
    private searches: SearchuserService,
    private router: Router,
    private route: ActivatedRoute,
    public userService: UserService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.isLoggedInSubscription = this.authService.isLoggedIn$().subscribe(isLoggedIn => {
      this.isLoggedIn = isLoggedIn;
      console.log("iciiiiiiiiiiiiiiiiiiiii",this.isLoggedIn)
      if (isLoggedIn) {
        console.log("salut")
        console.log("10", this.userId)
        this.friend();
        this.loadCurrentUserFromStorage();
        console.log("11",this.loadCurrentUserFromStorage)
        this.updatePendingRequests();
      }
    });

    this.login.getAll().subscribe(all => {
      console.log("ici")

      this.allUsers = all;
      console.log("usssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssser", this.allUsers)
      console.log("usssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssser", this.isLoggedIn)


    });

    this.friendStatusSubscription = this.friendService.friendStatus$.subscribe(status => {
      this.friendStatus = status;
      this.updatePendingRequests();
    });
  }

  loadCurrentUserFromStorage(): void {
    this.currentUser = this.login.getCurrentUserFromStorage();
  }

  updatePendingRequests(): void {
    try {
      console.log("je suis la", this.currentUser)
      if (!this.currentUser || !this.currentUser.id) {
        console.log(this.currentUser)
      }

      const count = this.friendStatus.reduce((acc, current) => {
        if (current.status === 'pending' && this.currentUser && current.to_user === this.currentUser.id) {
          acc.count += 1;
          acc.sender.push(current.from_user);
        }
        return acc
      }, { count: 0, sender: [] });

      this.countPending = count.count;
      this.sender = count.sender;
      console.log("hhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhh", this.sender)
    } catch (error) {
      console.error("Error in updatePendingRequests:", error);
    }
  }

  async mouseentering(): Promise<void> {
    this.showList = !this.showList;
    try {
      const list = await this.upload.getProfilePhoto1().toPromise();
      this.photos_list = list;
      console.log("voici la liste de la table profil", this.photos_list);
    } catch (error) {
      console.error("Error in mouseentering:", error);
    }
  }
  

  ngOnDestroy(): void {
    if (this.isLoggedInSubscription) {
      this.isLoggedInSubscription.unsubscribe();
    }
    if (this.friendStatusSubscription) {
      this.friendStatusSubscription.unsubscribe();

    }
  }

  logout() {
    this.authService.logout();
    this.login.logout().subscribe(() => {
      this.currentUser = null;
      localStorage.removeItem('currentUser');
      this.router.navigate(['/login']); // Redirect to login page
    });
  }

  findfriends(): void {
    if (this.searchTerm && this.searchTerm.length >= 1) {
      this.searches.searchFriends(this.searchTerm).subscribe(users => {
        this.searchResults = users;
        this.search_state$.next(users);
      });
    } else {
      this.searchResults = [];
      this.search_state$.next([]);
    }
  }

  trackByUserId(index: number, user: any): number {
    return user.id;
  }

  redirectToUserProfile(user: User): void {
    if (user) {
      this.search_state$.next([]);
      this.searchTerm = "";
      this.router.navigate(['/userprofile', user.username]);
    }
  }

  async navigateToPhotoChat(): Promise<void> {
    console.log(this.userId);
    this.userId = await this.userService.getUserId();
    this.router.navigate(['/user-profile', this.userId]);
  }

  async navigateToFansList(): Promise<void> {
    this.userId = await this.userService.getUserId();
    this.router.navigate(['/listfan', this.userId]);
  }
  
  async friend(): Promise<void> {
    try {
      await this.friendService.updateFriendStatus();
    } catch (error) {
      console.error('Error receiving friend requests:', error);
    }
  }


  async acceptFriendRequest(id:number){
      const request_id = this.friendStatus.find(status => status.from_user === id && this.currentUser && status.to_user === this.currentUser.id);
      console.log("request_id:", request_id)
      if (request_id) {
        console.log("yes")
        const statusValue = 'accept'; // Définir le statut à 'accepted'
        
        // Appeler la méthode du service avec les paramètres
        this.friendService.acceptFriendRequest(statusValue, request_id.id).subscribe({
          next: response => {
            console.log('Friend request accepted successfully:', response);
            this.senders_id.push(id)
            // Ajouter ici le code pour mettre à jour l'interface utilisateur
          },
          error: error => {
            console.error('Error accepting friend request:', error);
          }
        });
      } else {
        console.error('Friend request not found');
      }
    }



refuseFriendRequest(){



}








}
