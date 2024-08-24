import { Component, OnInit } from '@angular/core';
import { faTimes, faHeart } from '@fortawesome/free-solid-svg-icons';
import { LikesprofileService } from '../likesprofile.service';
import { UserService } from '../user.service';
import { firstValueFrom } from 'rxjs';
import { SearchuserService } from '../searchuser.service';
import { LoginService } from '../login.service';
import { CacheService } from '../cache.service';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-tinder',
  templateUrl: './tinder.component.html',
  styleUrl: './tinder.component.scss'
})
export class TinderComponent implements OnInit {
faTimes = faTimes;
faHeart = faHeart;
user : any[] = []
users: { user: number; profile_picture: string | null }[] = []; // Liste d'objets avec type implicite
username: string | null = null;


constructor(  private route: ActivatedRoute,
              private profile:LikesprofileService,
              private cache:CacheService, 
              private userService:UserService, 
              private searchUser: SearchuserService){}

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
this.createsprofilelike()
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

async createsprofilelike() {
  console.log("User list before getuser:", this.user);

  const profileMap = await this.getuser();  // Attendre que getuser se résolve
  console.log("profilemap",profileMap)
  if (profileMap) {
    this.user.push(profileMap.userIdbis);
    
    // Ajoutez chaque utilisateur de `all_users` à `this.users` individuellement
    profileMap.all_users.forEach((user: { user: number; profile_picture: string | null }) => {
      this.users.push(user);
      console.log("1",user.user);
      console.log("2",profileMap.userIdbis.id);

      if (user.user == profileMap.userIdbis.id){console.log("c est bien l utilisateur")}

    });

    console.log("User list after adding profileMap:", this.user);
    console.log("User list after adding profileMap:", this.users);
  }

  console.log("Final user list:", this.users);
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
       

