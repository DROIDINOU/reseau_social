import { Component, OnInit } from '@angular/core';
import { UploadService } from '../upload.service';
import { HttpErrorResponse } from '@angular/common/http';  // Import nécessaire pour la gestion des erreurs HTTP
import { AuthService } from '../auth.service';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';

import { UserService } from '../user.service';
import { faUserPlus } from '@fortawesome/free-solid-svg-icons';
import { FriendsService } from '../friends.service';
import { LoginService } from '../login.service';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';


@Component({
  selector: 'app-friendrequestpage',
  templateUrl: './friendrequestpage.component.html',
  styleUrl: './friendrequestpage.component.scss'
})
export class FriendrequestpageComponent implements OnInit{
  constructor(private upload: UploadService,private authService: AuthService, private login:LoginService,private router: Router, private route: ActivatedRoute,public UserService: UserService, private FriendService:FriendsService
    ){}
  profileImageUrl: string | null = null;
  userId: string | null = null;
  faUserPlus = faUserPlus
  actual_user: {id: number | null, user: string | null} = {id: null, user: null};
  sender_user :string | null = null;
  friends_status:any
  




  private friendStatusSubject = new BehaviorSubject<any[]>([]);
  friendStatus$ = this.friendStatusSubject.asObservable();

  ngOnInit() {
    // Abonnez-vous aux paramètres de la route pour obtenir l'ID utilisateur
    this.route.paramMap.subscribe(params => {
      // Récupérez l'ID utilisateur depuis les paramètres de la route
      this.userId = params.get('id');

      // Affichez l'ID utilisateur récupéré pour le débogage
      console.log('Utilisateur qui navigue!!!!!!!!!!!!!!!!!!!!!:', this.userId);
      
      // Assignez l'ID utilisateur à `sender_user` après l'avoir récupéré
      this.sender_user = this.userId;
     
      // Si `sender_user` est défini, récupérez les informations de l'utilisateur connecté
      if (this.sender_user) {
        this.authService.getCurrentUser$().subscribe(user => {
          this.sender_user = user;
          console.log('Utilisateur connecté:', this.sender_user);

          // Chargez les images et les données utilisateur après avoir récupéré les informations
          this.loadProfileImage();
          this.loaduser();
          this.checkfriend()
        });
      } else {
        // Chargez les images et les données utilisateur si `sender_user` n'est pas défini
        this.loadProfileImage();
        this.loaduser();
        this.checkfriend()
      }
    });
  }

  async loadProfileImage() {
    try {
      if(this.userId){
      const response = await this.upload.getProfileByUsername(this.userId).toPromise();
      console.log("senderrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrr",response);
      console.log (this.actual_user);
      this.profileImageUrl = `http://localhost:8000${response.profile_picture}`;
      console.log('Loaded profile image:', this.profileImageUrl);}
    } catch (error) {
      const httpError = error as HttpErrorResponse;  // Utilisation d'une assertion de type pour l'erreur
      if (error && httpError.status === 403) {
        console.log('Erreur 403, tentative de rafraîchir le token CSRF');
        try {
          await this.upload.refreshCsrfToken().toPromise();
          const retryResponse = await this.upload.getProfilePhoto().toPromise();
          this.profileImageUrl = `http://localhost:8000${retryResponse.profile_picture}`;
          console.log('Loaded profile image after refreshing CSRF token:', this.profileImageUrl);
        } catch (refreshError) {
          console.error('Erreur lors du rafraîchissement du token CSRF', refreshError);
        }
      } else {
        console.error('Erreur lors du chargement de l\'image de profil', error);
      }
    }

    




  }

  async loaduser() {
    try {
      if(this.userId){
      const response = await this.login.getUserByName(this.userId).toPromise();
      console.log(response);
      this.actual_user = response;
      console.log("user!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!", this.actual_user)

    } }catch (error) {
      const httpError = error as HttpErrorResponse;  // Utilisation d'une assertion de type pour l'erreur
      if (error && httpError.status === 403) {
        console.log('Erreur 403, tentative de rafraîchir le token CSRF');
        try {
          await this.upload.refreshCsrfToken().toPromise();
          const retryResponse = await this.login.getUserByName(this.userId).toPromise();
          this.actual_user = retryResponse;
          console.log("user!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!", this.actual_user)

        } catch (refreshError) {
          console.error('Erreur lors du rafraîchissement du token CSRF', refreshError);
        }
      } else {
        console.error('Erreur lors du chargement de l\'image de profil', error);
      }
    }
  }



   async friend(){

    try {
      if(this.actual_user){
      console.log("ahahahaha", this.userId)
      if(this.actual_user&& this.actual_user.id){
      const response =  await this.FriendService.sendFriendRequest(this.actual_user.id).toPromise();
        console.log('Utilisateur connecté:', response);}}}

        catch (error) {
          const httpError = error as HttpErrorResponse;  // Utilisation d'une assertion de type pour l'erreur
          if (error && httpError.status === 403) {
            console.log('Erreur 403, tentative de rafraîchir le token CSRF');
            try {
              await this.login.refreshCsrfToken().toPromise();
              if(this.actual_user&& this.actual_user.id){
              const retryResponse = await this.FriendService.sendFriendRequest(this.actual_user.id).toPromise();
              console.log("user!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!", retryResponse)}
    
            } catch (refreshError) {
              console.error('Erreur lors du rafraîchissement du token CSRF', refreshError);
            }
          } else {
            console.error('Erreur lors du chargement de l\'image de profil', error);
          }
        }


    }

    async checkfriend(): Promise<void> {
      try {
        console.log("Appel de la méthode friend avec l'ID utilisateur:", this.userId);
        
        // Suppose que this.friends.receiveFriendRequest() retourne une Observable
        // Convertir l'Observable en Promise
        const response = await this.FriendService.receiveFriendRequest().toPromise();
        
        // Traitement de la réponse
        console.log('Réponse des requêtes d\'amitié:', response);
        this.friends_status = response;
        console.log('Réponse des requêtes d\'amitié:', this.friends_status);
      } catch (error) {
        console.error('Erreur lors de la récupération des requêtes d\'amitié:', error);
      }
    }








  





















}
