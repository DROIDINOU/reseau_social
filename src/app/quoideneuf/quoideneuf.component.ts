import { Component, OnInit, EventEmitter, Output, ChangeDetectionStrategy, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { firstValueFrom, BehaviorSubject } from 'rxjs';
import { LoginService } from '../login.service';
import { CommentModalsService } from '../comment-modals.service';
import { faThumbsUp, faPhotoVideo, faImage } from '@fortawesome/free-solid-svg-icons';
import { UserService } from '../user.service';
import { UploadService } from '../upload.service';

@Component({
  selector: 'app-quoideneuf',
  templateUrl: './quoideneuf.component.html',
  styleUrls: ['./quoideneuf.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class QuoideneufComponent implements OnInit {
  myForm!: FormGroup;
  username: string | null = null;
  photos_Url: string | null = "";
   videos_Url:  string | null = ""; 

  pouces = faThumbsUp;
  videos_photos = faPhotoVideo;
  faImage = faImage;

  id_message: number | null = null;
  id_photo: number | null = null;
   id_video: number | null = null
  
  currentModal: boolean = false;
  currentModal1: boolean = false;
  currentModal2: boolean = false;
  currentModal3: boolean = false;
  currentModal4: boolean = false;
  currentModal5: boolean = false;

  id_commentaire: number | null = null;
  id_commentaire1: number | null = null;
  id_commentaire2: number | null = null;
  id_commentaire3: number | null = null;
  id_commentaire4: number | null = null;
  id_commentaire5: number | null = null;

  number_comments: any = {};
  number_comments1: any = {};
  number_comments2: any = {};
  number_comments3: any = {};
  number_comments4: any = {};
  number_comments5: any = {};


  listing_comment: boolean = false;
  listing_commentphoto: boolean = false;
  listing_commentvideo: boolean = false;

  
  friendsMessages: any[] = []; // Pour stocker les messages récupérés



  messages$: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
  photos$: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
  videos$: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);

  countcomments$: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
  countcommentsphotos$: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
  countcommentsvideos$: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);


  @Output() modalClosed = new EventEmitter<void>();
  @ViewChild('fileInput') fileInput!: ElementRef;
  @ViewChild('fileInput1') fileInput1!: ElementRef;

  selectedFile: File | null = null;

  constructor(
    private login: LoginService,
    private log: CommentModalsService,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private userService: UserService,
    private upload: UploadService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    console.log('ngOnInit called in QuoideneufComponent');
    this.myForm = this.formBuilder.group({
      message: ['', Validators.required],
    });
  
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
  
      // Charger les données après avoir obtenu l'identifiant de l'utilisateur
      this.loadData();
    });
  }
  
  async loadData() {
    try {
      await Promise.all([
        this.loadMessages(),
        this.loadPhotos(),
        this.loadVideos(),
        this.messagesfriends(),
        this.photosfriends(),
        this.videosfriends(),
      ]);
    } catch (error) {
      console.error('Erreur lors du chargement des données', error);
    }
  }
  
  // reste le trigger a faire je pense
  triggerFileInputClick(): void {
    console.log("photo is triggered")
    this.fileInput.nativeElement.click();
  }

  triggerFileInputClick1(): void {
    console.log("video is triggered")
    this.fileInput1.nativeElement.click();
  }


  
  async loadMessages(): Promise<any[]> {
    try {
      const messagesResponse = await firstValueFrom(this.login.getMessages());
      console.log("reponse 1", messagesResponse)
      if (Array.isArray(messagesResponse)) {
        const messages = await Promise.all(messagesResponse.map(async message => {
          const [likesResponse, commentsResponse] = await Promise.all([
            firstValueFrom(this.login.getlikes(message.id)),
            firstValueFrom(this.log.getCommentsByMessage(message.id))
          ]);
          return {
            ...message,
            likes_count: likesResponse.likes_count,
            comments: commentsResponse,
          };
        }));
        this.messages$.next(messages); // Met à jour l'observable
        this.cdr.detectChanges(); // Ajout de detectChanges
        return messages; // Retourne les messages pour les utiliser dans test()
      } else {
        console.error('Réponse inattendue de getMessages()', messagesResponse);
        return [];
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des messages', error);
      return [];
    }
  }
  
  
  async messagesfriends() {
    try {
      console.log('Avant d\'appeler getMessagesFriends');
      
      // Récupère les messages des amis
      const messagesFriendsResponse = await firstValueFrom(this.login.getMessagesFriends());
      console.log('Réponse des messages des amis:', messagesFriendsResponse);
      
      // Récupère les messages normaux
      const messagesResponse = await this.loadMessages();
      
      // Si les réponses sont des tableaux, combinez-les
      if (Array.isArray(messagesFriendsResponse) && Array.isArray(messagesResponse)) {
        // Combine les messages des amis et les messages normaux
        const combinedMessages = [...messagesFriendsResponse, ...messagesResponse];
        
        // Assurez-vous que chaque message est unique, si nécessaire (par exemple, en filtrant les doublons)
        const uniqueMessages = Array.from(new Set(combinedMessages.map(message => message.id)))
          .map(id => combinedMessages.find(message => message.id === id));
        
        // Met à jour messages$ avec les données combinées
        this.messages$.next(uniqueMessages);
        console.log('Valeur actuelle de messages$: ', this.messages$.getValue());
        
      } else {
        console.error('Réponse inattendue de getMessagesFriends() ou getMessages()', messagesFriendsResponse, messagesResponse);
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des messages', error);
    }
  }
  
  async loadPhotos() {
    try {
      const photosResponse = await firstValueFrom(this.upload.getPhotofilactu());
      if (Array.isArray(photosResponse)) {
        const photos = await Promise.all(photosResponse.map(async photo => {
          const [likesResponse, commentsResponse] = await Promise.all([
            firstValueFrom(this.login.getlikesphotos(photo.id)),
            firstValueFrom(this.log.getCommentsByPhoto(photo.id))
          ]);
          return {
            ...photo,
            likes_count: likesResponse.likes_count,
            comments: commentsResponse,
          };
        }));
        console.log("Photos chargées :", photos);
        this.photos$.next(photos);
      } else {
        console.error('Réponse inattendue de getPhotofilactu()', photosResponse);
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des photos', error);
    }
  }

  async photosfriends() {
    try {
      console.log('Avant d\'appeler getMessagesFriends');
      
      // Récupère les messages des amis
      const photosFriendsResponse = await firstValueFrom(this.login.getPhotosFriends());
      
      // Récupère les messages normaux
      const photosResponse = await this.loadPhotos();
      
      // Si les réponses sont des tableaux, combinez-les
      if (Array.isArray(photosFriendsResponse) && Array.isArray(photosResponse)) {
        // Combine les messages des amis et les messages normaux
        const combinedPhotos = [...photosFriendsResponse, ...photosResponse];
        
        // Assurez-vous que chaque message est unique, si nécessaire (par exemple, en filtrant les doublons)
        const uniquePhotos = Array.from(new Set(combinedPhotos.map(photo => photo.id)))
          .map(id => combinedPhotos.find(photo => photo.id === id));
        
        // Met à jour messages$ avec les données combinées
        this.photos$.next(uniquePhotos);
        console.log('Valeur actuelle de photos§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§$: ', this.messages$.getValue());
        
      } else {
        console.error('Réponse inattendue de getMessagesFriends() ou getMessages()', photosFriendsResponse, photosResponse);
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des messages', error);
    }
  }

   async loadVideos() {
    try {
      const videosResponse = await firstValueFrom(this.upload.getVideofilactu());
      if (Array.isArray(videosResponse)) {
        const videos = await Promise.all(videosResponse.map(async video => {
          const [likesResponse, commentsResponse] = await Promise.all([
            firstValueFrom(this.login.getlikesvideos(video.id)),
            firstValueFrom(this.log.getCommentsByVideo(video.id))
          ]);
          return {
            ...video,
            likes_count: likesResponse.likes_count,
            comments: commentsResponse,
          };
        }));
        console.log("videos chargées :", videos);
        this.videos$.next(videos);
      } else {
        console.error('Réponse inattendue de getVideofilactu()', videosResponse);
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des videos', error);
    }
  }


  async videosfriends() {
    try {
      console.log('Avant d\'appeler getVideosFriends');
      
      // Récupère les messages des amis
      const videosFriendsResponse = await firstValueFrom(this.login.getVideosFriends());
      console.log('Réponse des photos des amis:', videosFriendsResponse);
      
      // Récupère les messages normaux
      const videosResponse = await this.loadVideos();
      
      // Si les réponses sont des tableaux, combinez-les
      if (Array.isArray(videosFriendsResponse) && Array.isArray(videosResponse)) {
        // Combine les messages des amis et les messages normaux
        const combinedVideos= [...videosFriendsResponse, ...videosResponse];
        
        // Assurez-vous que chaque message est unique, si nécessaire (par exemple, en filtrant les doublons)
        const uniqueVideos = Array.from(new Set(combinedVideos.map(video => video.id)))
          .map(id => combinedVideos.find(video => video.id === id));
        
        // Met à jour messages$ avec les données combinées
        this.videos$.next(uniqueVideos);
        console.log('Valeur actuelle de photos§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§$: ', this.videos$.getValue());
        
      } else {
        console.error('Réponse inattendue de getMessagesFriends() ou getMessages()', videosFriendsResponse, videosResponse);
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des messages', error);
    }
  }


  async liaison_click_modal(message_id: number) {
    this.id_commentaire = message_id;
    this.number_comments = await this.getComments(message_id);
    this.currentModal = true;
    this.currentModal1 = false;
    this.currentModal2 = false;
    this.currentModal3 = false;
    this.currentModal4 = false;
    this.currentModal5 = false;
    this.cdr.detectChanges(); // Forcer la détection des changements

  }

  async liaison_click_modal1(message_id: number) {
    this.id_commentaire1 = message_id;
    this.number_comments1 = await this.getComments(message_id);
    this.currentModal1 = true;
    this.currentModal = false;
    this.currentModal2 = false;
    this.currentModal3 = false;
    this.currentModal4 = false;
    this.currentModal5 = false;
    this.cdr.detectChanges(); // Forcer la détection des changements

  }

  async liaison_click_modal2(photo_id: number) {
    this.id_commentaire2 = photo_id;
    this.number_comments2 = await this.getCommentsPhoto(photo_id);
    this.currentModal2 = true;
    this.currentModal = false;
    this.currentModal1 = false;
    this.currentModal3 = false;
    this.currentModal4 = false;
    this.currentModal5 = false;
    this.cdr.detectChanges(); // Forcer la détection des changements

  }

  async liaison_click_modal3(photo_id: number) {
    this.id_commentaire3 = photo_id;
    this.number_comments3 = await this.getCommentsPhoto(photo_id);
    this.currentModal3 = true;
    this.currentModal = false;
    this.currentModal1 = false;
    this.currentModal2 = false;
    this.currentModal4 = false;
    this.currentModal5 = false;
    this.cdr.detectChanges(); // Forcer la détection des changements


  }

   async liaison_click_modal4(video_id: number) {
    console.log("j ai bien cliqué ici!!!!!!!!!!!!!!!")
    this.id_commentaire4 = video_id;
    this.number_comments4 = await this.getCommentsVideo(video_id);
    this.currentModal4 = true;
    this.currentModal = false;
    this.currentModal1 = false;
    this.currentModal3 = false;
      this.currentModal2 = false;
    this.currentModal5 = false;
    this.cdr.detectChanges(); // Forcer la détection des changements


  }

  async liaison_click_modal5(video_id: number) {
    console.log("click 555555555555555555555555555555555555555555555555555555555555555555")
    this.id_commentaire5 = video_id;
    this.number_comments5 = await this.getCommentsVideo(video_id);
    this.currentModal5 = true;
    this.currentModal = false;
    this.currentModal1 = false;
    this.currentModal2 = false;
      this.currentModal3 = false;
    this.currentModal4 = false;
    this.cdr.detectChanges(); // Forcer la détection des changements


  } 

  async onSubmit() {
    if (this.myForm.valid) {
      const formData = this.myForm.value;
      try {
        const responseCreate = await firstValueFrom(this.login.createMessage(formData.message));
        console.log('Message créé avec succès', responseCreate);
        this.myForm.reset();
        await this.loadMessages();
      } catch (error: any) {
        if (error.status === 403) {
          console.log('Erreur 403, tentative de rafraîchir le token CSRF');
          try {
            await firstValueFrom(this.login.refreshCsrfToken());
            const responseCreateRetry = await firstValueFrom(this.login.createMessage(formData.message));
            console.log('Message créé avec succès après rafraîchissement du token', responseCreateRetry);
            this.myForm.reset();
            await this.loadMessages();
            this.cdr.detectChanges(); // Forcer la détection des changements

          } catch (retryError) {
            console.error('Erreur lors de la création du message après rafraîchissement du token', retryError);
          }
        } else {
          console.error('Erreur lors de la création du message', error);
        }
      }
    } else {
      console.log('Formulaire invalide');
      this.myForm.reset();
    }
  }

  async onFileSelected(event: any): Promise<void> {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      console.log("Fichier sélectionné :", this.selectedFile);
      const formData1 = new FormData();
      formData1.append('photo', file);

      try {
        const response = await firstValueFrom(this.upload.createPhotofil(formData1));
        console.log('Enregistrement réussi', response);
        this.photos_Url = `http://localhost:8000/${response.photo}`;
        await this.loadPhotos(); // Recharger les photos après ajout
      } catch (error) {
        console.error('Erreur de connexion', error);
      }
    } else {
      console.error('Aucun fichier sélectionné.');
    }
  }
   async onFileSelectedvideo(event: any): Promise<void> {
    const file = event.target.files[0];
    console.log("onfileselected", file);
    if (file) {
      this.selectedFile = file;
      console.log("Fichier sélectionné :", this.selectedFile);
      const formData1 = new FormData();
      formData1.append('video', file);

      try {
        const response = await firstValueFrom(this.upload.createVideofil(formData1));
        console.log('Enregistrement réussi', response);
        this.videos_Url = `http://localhost:8000/${response.video}`;
        await this.loadVideos(); // Recharger les photos après ajout
        this.cdr.detectChanges(); // Forcer la détection des changements

      } catch (error) {
        console.error('Erreur de connexion', error);
      }
    } else {
      console.error('Aucun fichier sélectionné.');
    }
  }
 

  async likeClicked(messageid: number) {
    console.log("Like button clicked for message ID:", messageid);
    try {
      const response = await firstValueFrom(this.login.getlikes(messageid));
      console.log('Likes récupérés avec succès', response);
      const messages = this.messages$.getValue();
      const message = messages.find(msg => msg.id === messageid);
      if (message) {
        message.likes_count = response.likes_count;
        this.messages$.next([...messages]);
      }
    } catch (error) {
      console.error('Erreur lors du processus de like', error);
    }
  }

  async likeClickedphoto(photo_id: number) {
    console.log("Like button clicked for photo ID:", photo_id);
    try {
      const response = await firstValueFrom(this.login.getlikesphotostest(photo_id));
      console.log('Likes récupérés avec succès', response);
      const photos = this.photos$.getValue();
      const photo = photos.find(ph => ph.id === photo_id);
      if (photo) {
        photo.likes_count = response.likes_count;
        this.photos$.next([...photos]);
      }
    } catch (error) {
      console.error('Erreur lors du processus de like', error);
    }
  }


    async likeClickedvideo(video_id: number) {
    console.log("Like button clicked for video ID:", video_id);
    try {
      const response = await firstValueFrom(this.login.getlikesvideostest(video_id));
      console.log('Likes récupérés avec succès', response);
      const videos = this.videos$.getValue();
      console.log(videos);
      const video = videos.find(vi => vi.id === video_id);
      if (video) {
        video.likes_count = response.videos_count;
        this.videos$.next([...videos]);
      }
    } catch (error) {
      console.error('Erreur lors du processus de like', error);
    }
  }
 

  handleModalClosed() {
    console.log('Modal fermé');
    this.currentModal = false;
    this.currentModal1 = false;
    this.currentModal2 = false;
    this.currentModal4 = false;
    this.currentModal5 = false;
    this.cdr.detectChanges(); // Forcer la détection des changements

  }

  handleModalClosed1() {
    console.log('Modal fermé');
    this.currentModal1 = false;
    this.currentModal = false;
    this.currentModal2 = false;
    this.currentModal3 = false;
    this.currentModal4 = false;
    this.currentModal5 = false;
    this.cdr.detectChanges(); // Forcer la détection des changements

  }

  handleModalClosed2() {
    console.log('Modal fermé');
    this.currentModal2 = false;
    this.currentModal1 = false;
    this.currentModal3 = false;
    this.currentModal = false;
    this.currentModal4 = false;
    this.currentModal5 = false;
    this.cdr.detectChanges(); // Forcer la détection des changements

  }

  handleModalClosed3() {
    console.log('Modal fermé');
    this.currentModal3 = false;
    this.currentModal = false;
    this.currentModal1 = false;
    this.currentModal2 = false;
    this.currentModal4 = false;
    this.currentModal5 = false;
    this.cdr.detectChanges(); // Forcer la détection des changements

  }

   handleModalClosed4() {
    console.log('Modal fermé');
    this.currentModal2 = false;
    this.currentModal1 = false;
    this.currentModal3 = false;
    this.currentModal = false;
    this.currentModal4 = false;
    this.currentModal5 = false;
    this.cdr.detectChanges(); // Forcer la détection des changements

  }

  handleModalClosed5() {
    console.log('Modal fermé');
    this.currentModal3 = false;
    this.currentModal = false;
    this.currentModal1 = false;
    this.currentModal2 = false;
    this.currentModal4 = false;
    this.currentModal5 = false;
    this.cdr.detectChanges(); // Forcer la détection des changements

  } 

  async getComments(message_id: number) {
    try {
      const response = await firstValueFrom(this.log.getCommentsByMessage(message_id));
      console.log("Commentaires récupérés :", response);
      this.countcomments$.next([...response]);
      return response;
    } catch (error) {
      console.error('Erreur lors de la récupération des commentaires', error);
    }
  }

  async getCommentsPhoto(photo_id: number) {
    try {
      const response = await firstValueFrom(this.log.getCommentsByPhoto(photo_id));
      console.log("Commentaires photos récupérés :", response);
      this.countcommentsphotos$.next([...response]);
      return response;
    } catch (error) {
      console.error('Erreur lors de la récupération des commentaires photos', error);
    }
  }

    async getCommentsVideo(video_id: number) {
    try {
      const response = await firstValueFrom(this.log.getCommentsByVideo(video_id));
      console.log("Commentaires videos récupérés :", response);
      this.countcommentsvideos$.next([...response]);
      return response;
    } catch (error) {
      console.error('Erreur lors de la récupération des commentaires videos', error);
    }
  }
 

  handleCommentAdded() {
    this.loadMessages();
  }

  handleCommentPhotosAdded() {
    this.loadPhotos();
  }

  handleCommentVideosAdded() {
    this.loadVideos();
  } 

  list_comments(messageid: number) {
    console.log("Affichage des commentaires pour le message ID:", messageid);
    this.id_commentaire1 = messageid;
    this.listing_comment = !this.listing_comment;
    this.loadMessages();
  }

  list_commentsphotos(photoid: number) {
    console.log("Affichage des commentaires photos pour le photo ID:", photoid);
    this.id_commentaire2 = photoid;
    this.listing_commentphoto = !this.listing_commentphoto;
    this.loadPhotos();
  }

  
  list_commentsvideos(videoid: number) {
    console.log("Affichage des commentaires videos pour le video ID:", videoid);
    this.id_commentaire4 = videoid;
    this.listing_commentvideo = !this.listing_commentvideo;
    this.loadVideos();
  } 
}
