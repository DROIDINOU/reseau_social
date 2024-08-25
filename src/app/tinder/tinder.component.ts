import { Component, OnInit } from '@angular/core';
import { faTimes, faHeart } from '@fortawesome/free-solid-svg-icons';
import { LikesprofileService } from '../likesprofile.service';
import { UserService } from '../user.service';
import { firstValueFrom } from 'rxjs';
import { SearchuserService } from '../searchuser.service';
import { LoginService } from '../login.service';
import { CacheService } from '../cache.service';
import { ActivatedRoute } from '@angular/router';
import { ChangeDetectorRef } from '@angular/core';  // Import pour forcer la détection des changements
import { trigger, state, style, animate, transition } from '@angular/animations';

@Component({
  selector: 'app-tinder',
  templateUrl: './tinder.component.html',
  styleUrl: './tinder.component.scss',
  animations: [
    trigger('likeAnimation', [
      state('default', style({
        transform: 'scale(1)',
        backgroundColor: 'white'
      })),
      state('liked', style({
        transform: 'scale(1.1)',
        backgroundColor: '#FFD700'   // Light red color
      })),
      transition('default => liked', [
        animate('300ms ease-in')
      ]),
      transition('liked => default', [
        animate('300ms ease-out')
      ])
    ])
  ]
})
export class TinderComponent implements OnInit {
faTimes = faTimes;
faHeart = faHeart;
user : any[] = [];
count: any[] = [0,1];
users: { user: number; profile_picture: string | null }[] = []; // Liste d'objets avec type implicite
username: string | null = null;
animationStates : string[] = ['default', 'default'];

constructor(  private route: ActivatedRoute,
              private profile:LikesprofileService,
              private cache:CacheService, 
              private userService:UserService, 
              private searchUser: SearchuserService,
              private cdr: ChangeDetectorRef ) // Injecter ChangeDetectorRef
              {}

ngOnInit(): void {
  this.route.paramMap.subscribe(params => {
    const paramUsername = params.get('id');
    
    if (paramUsername) {
      this.username = paramUsername;
    } else {
      // Essayez de récupérer l'utilisateur actuel
      const userId = this.userService.getUserId();
      this.username = userId || 'defaultUsername'; // Remplacez 'defaultUsername' par une valeur par défaut appropriée
    }

    if (this.username) {
      this.userService.setUserId(this.username);
    }

    console.log('Current username:', this.username);
})
this.getpictures()
}

toggleLike(index: number) {
  this.animationStates[index] = 'liked';

  // Revert back to 'default' state after 1 second
  setTimeout(() => {
    this.animationStates[index] = 'default';
  }, 1000);
}



async getuser() {
  const userId = this.userService.getUserId();
  console.log('User ID:', userId);

  if (userId) {
    try {
      // Utiliser firstValueFrom pour convertir l'observable en promesse
      const userIdbis = await firstValueFrom(this.profile.getid(userId));
      const all_users = await firstValueFrom( this.profile.getAllprofile());

      // Retourner un objet contenant userIdbis et all_users
      return { userIdbis, all_users };
    } catch (error) {
      console.error("Erreur lors de la recherche d'amis:", error);
    }
  }
  return null;
}

async getpictures() {
  console.log("User list before getuser:", this.user);

  const profileMap = await this.getuser();  // Attendre que getuser se résolve
  console.log("profilemap",profileMap)
  if (profileMap) {
    this.user.push(profileMap.userIdbis);
    
    // Ajoutez chaque utilisateur de `all_users` à `this.users` individuellement
    profileMap.all_users.forEach((user: { user: number; profile_picture: string | null }) => {
      console.log("1",user.user);
      console.log("2",profileMap.userIdbis.id);

      this.users.push(user);
    }

    );

    console.log("User list after adding profileMap:", this.user);
    console.log("User list after adding profileMap:", this.users);

  }
 
  console.log("Final user list:", this.users);
}


async createsprofilelike(index:number){
  const userId = this.userService.getUserId();
  if (userId) {
    try {
      // Utiliser firstValueFrom pour convertir l'observable en promesse
      const user = await firstValueFrom(this.profile.getid(userId));
      console.log("user",user)
      this.profile.createlikesprofile(user.id).subscribe({
        next: (profile) => {
          console.log("Valeur de l'Observable :", profile);
      
          // Mettez à jour vos éléments après réception de la valeur
          
        },
        error: (err) => console.error("Erreur lors de la création du like pour le profil :", err),
      });
      // Retourner un objet contenant userIdbis et all_users
    } catch (error) {
      console.error("Erreur lors de la recherche d'amis:", error);
    }
  
const firstElement = this.count[0] + 1;
const secondeElement = this.count[1] + 1;

// Ajouter de nouveaux éléments
this.count[0] = firstElement;
  this.count[1] = secondeElement
  console.log(this.count)
 this. toggleLike(index)
}
}
}

/*async loadProfilePictures(): Promise<{ [key: number]: string }> {
  try {
    // Utilisation de 'await' pour obtenir la valeur de l'Observable avec 'firstValueFrom'
    const userId = this.userService.getUserId();console.log(userId)
    const profiles = await firstValueFrom(this.profile.getlikesprofile());

    // Affiche les données reçues de l'API
    console.log('Données reçues de getphotoprofileall:', profiles);

    // Convertir la liste des profils en un objet avec userId comme clé
    const profileMap = profiles.reduce((acc: { [key: number]: string }, profile: { user: number; profile_picture: string | null }) => {
      if (profile.user != null && profile.profile_picture != null) {
        acc[profile.user] = profile.profile_picture;
      }
      return acc;
    }, {} as { [key: number]: string });

    // Affiche les données après transformation
    console.log('Profile map après transformation:', profileMap);

    return profileMap;
  } catch (err) {
    console.error('Erreur lors du chargement des photos de profil', err);
    return {};  // Retourne un objet vide en cas d'erreur
  }
} */  
       

