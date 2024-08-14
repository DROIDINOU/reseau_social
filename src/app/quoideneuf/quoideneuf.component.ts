import { Component, OnInit, EventEmitter, Output, ChangeDetectionStrategy, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { firstValueFrom, BehaviorSubject } from 'rxjs';
import { LoginService } from '../login.service';
import { CommentModalsService } from '../comment-modals.service';
import { faThumbsUp, faPhotoVideo, faImage } from '@fortawesome/free-solid-svg-icons';
import { UserService } from '../user.service';
import { UploadService } from '../upload.service';
import { HttpErrorResponse } from '@angular/common/http';  // Import nécessaire pour la gestion des erreurs HTTP
import { Observable, of, map, catchError , tap} from 'rxjs';

interface Profile {
  userId: number;
  photoUrl: string;
}

interface Message {
  id: number;
  message: string;
  timestamp: string;
}

interface Photo {
  id: number;
  photo: string;
  timestamp: string;
}

interface Video {
  id: number;
  video: string;
  timestamp: string;
}


type Result = Message | Photo | Video;


@Component({
  selector: 'app-quoideneuf',
  templateUrl: './quoideneuf.component.html',
  styleUrls: ['./quoideneuf.component.scss'],
})
export class QuoideneufComponent implements OnInit {
  myForm!: FormGroup;
  username: string | null = null;
  photos_Url: string | null = "";
   videos_Url:  string | null = ""; 

  pouces = faThumbsUp;
  videos_photos = faPhotoVideo;
  faImage = faImage;

  profileImageUrl: string | null = null;
  profilePictures$: Observable<{ [key: string]: string }> = of({});
  defaultProfileImageUrl = 'path/to/default/profile/image.png';  // URL par défaut pour les photos de profil

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
  messages: any[] = [];
  messagesfromfriends: any[] = [];

  photos: any[] = [];
  videos: any[] = [];
  results: any[] = [];
  results1: any[] = [];

  
  friendsMessages: any[] = []; // Pour stocker les messages récupérés



  messages$: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
  photos$: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
  videos$: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
  test$: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);


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

      this.loadDatas();

      this.concatData();

    });
  }


  async loadData(): Promise<{ messages: any[], photos: any[], videos: any[] }> {
    try {
      console.time('loadData'); // Démarrer le chronomètre
  
      // Effectuer tous les appels réseau en parallèle
      const [messagesResponse, photosResponse, photosFriendsResponse, videosResponse, videosFriendsResponse] = await Promise.all([
        firstValueFrom(this.login.getMessages()),
        firstValueFrom(this.upload.getPhotofilactu()),
        firstValueFrom(this.login.getPhotosFriends()),
        firstValueFrom(this.upload.getVideofilactu()),
        firstValueFrom(this.login.getVideosFriends())
      ]);
  
      // Traiter les messages
      const messages = Array.isArray(messagesResponse) ? await Promise.all(
        messagesResponse.map(async (message) => {
          const [likesResponse, commentsResponse] = await Promise.all([
            firstValueFrom(this.login.getlikes(message.id)),
            firstValueFrom(this.log.getCommentsByMessage(message.id))
          ]);
  
          return {
            ...message,
            likes: likesResponse.likes,
            comments: commentsResponse,
          };
        })
      ) : [];
  
      // Combiner les photos normales et les photos des amis
      const combinedPhotos = [...(Array.isArray(photosResponse) ? photosResponse : []), 
                              ...(Array.isArray(photosFriendsResponse) ? photosFriendsResponse : [])];
  
      // Filtrer les photos pour ne garder que les uniques
      const uniquePhotos = Array.from(new Set(combinedPhotos.map(photo => photo.id)))
        .map(id => combinedPhotos.find(photo => photo.id === id));
  
      // Traiter les photos
      const photos = await Promise.all(
        uniquePhotos.map(async (photo) => {
          try {
            const [likesResponse, commentsResponse] = await Promise.all([
              firstValueFrom(this.login.getlikesphotos(photo.id)),
              firstValueFrom(this.log.getCommentsByPhoto(photo.id))
            ]);
  
            return {
              ...photo,
              likes: likesResponse.likes,
              comments: commentsResponse,
            };
          } catch (error) {
            console.error(`Erreur lors du traitement de la photo ${photo.id}:`, error);
            return {
              ...photo,
              likes: [],
              comments: [],
            };
          }
        })
      );
  
      // Combiner les vidéos normales et les vidéos des amis
      const combinedVideos = [...(Array.isArray(videosResponse) ? videosResponse : []), 
                              ...(Array.isArray(videosFriendsResponse) ? videosFriendsResponse : [])];
  
      // Filtrer les vidéos pour ne garder que les uniques
      const uniqueVideos = Array.from(new Set(combinedVideos.map(video => video.id)))
        .map(id => combinedVideos.find(video => video.id === id));
  
      // Traiter les vidéos
      const videos = await Promise.all(
        uniqueVideos.map(async (video) => {
          try {
            const [likesResponse, commentsResponse] = await Promise.all([
              firstValueFrom(this.login.getlikesvideos(video.id)),
              firstValueFrom(this.log.getCommentsByVideo(video.id))
            ]);
  
            return {
              ...video,
              likes: likesResponse.likes,
              comments: commentsResponse,
            };
          } catch (error) {
            console.error(`Erreur lors du traitement de la vidéo ${video.id}:`, error);
            return {
              ...video,
              likes: [],
              comments: [],
            };
          }
        })
      );
  
      // Mettre à jour les observables et les variables d'état
      this.messages = messages;
      this.messages$.next(messages);
      this.photos = photos;
      this.photos$.next(photos);
      this.videos = videos;
      this.videos$.next(videos);
  
      console.log("Messages, photos et vidéos chargés avec succès :", { messages, photos, videos });
      console.timeEnd('loadData'); // Arrêter le chronomètre
  
      return { messages, photos, videos };
    } catch (error) {
      console.error('Erreur lors du chargement des données', error);
      console.timeEnd('loadData'); // Arrêter le chronomètre en cas d'erreur
      return { messages: [], photos: [], videos: [] };
    }
  }
  
  
  
  async loadDatas() {
    try {
      await Promise.all([
        this.loadMessages(),
        this.loadPhotos(),
        this.loadVideos(),
      ]);    this.concatData();
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

  

  async loadProfileImage() {
    try {
      const response = await firstValueFrom(this.upload.getProfilePhoto());
      this.profileImageUrl = response.profile_picture;
      console.log('Loaded profile image:', this.profileImageUrl);
    } catch (error) {
      const httpError = error as HttpErrorResponse;  // Utilisation d'une assertion de type pour l'erreur
      if (error && httpError.status === 403) {
        console.log('Erreur 403, tentative de rafraîchir le token CSRF');
        try {
          await firstValueFrom(this.upload.refreshCsrfToken());
          const retryResponse = await firstValueFrom(this.upload.getProfilePhoto());
          this.profileImageUrl = retryResponse.profile_picture;
          console.log('Loaded profile image after refreshing CSRF token:', this.profileImageUrl);
        } catch (refreshError) {
          console.error('Erreur lors du rafraîchissement du token CSRF', refreshError);
        }
      } else {
        console.error('Erreur lors du chargement de l\'image de profil', error);
      }
    }
  }


 

  concatData() {
    const messages = this.messages$.getValue() as Message[];
    const photos = this.photos$.getValue() as Photo[];
    const videos = this.videos$.getValue() as Video[];
  
    
    // Concaténation des messages, photos et vidéos
    this.results1 = [...messages, ...photos, ...videos] as Result[];
  
    console.log("Avant le tri:", this.results1);
    
    try {
      // Tri des résultats par timestamp
      this.results1.sort((a, b) => {
        const dateA = new Date(a.timestamp).getTime();
        const dateB = new Date(b.timestamp).getTime();
        console.log("Comparing:", dateA, dateB);
        return dateB - dateA;
      });
    } catch (error) {
    }
  
    // Affichage du tableau trié
  }
  
  

  
  
  async loadMessages(): Promise<any[]> {
    try {
      console.time('loadData'); // Démarrer le chronomètre
  
      // Récupérer tous les messages
      const messagesResponse = await firstValueFrom(this.login.getMessages());
  
      if (Array.isArray(messagesResponse)) {
        // Mapper sur chaque message pour récupérer les likes et les commentaires
        const messages = await Promise.all(messagesResponse.map(async (message) => {
          // Récupérer les likes et les commentaires en parallèle
          const [likesResponse, commentsResponse] = await Promise.all([
            firstValueFrom(this.login.getlikes(message.id)),
            firstValueFrom(this.log.getCommentsByMessage(message.id))
          ]);
  
          // Retourner le message enrichi avec les likes et commentaires
          return {
            ...message,
            likes: likesResponse.likes,
            comments: commentsResponse,
          };
        }));
  
        // Mettre à jour les messages dans le service
        this.messages = messages;
        this.messages$.next(messages); // Met à jour l'observable
        console.log("Messages chargés avec succès :", this.messages);
  
        console.timeEnd('loadData'); // Arrêter le chronomètre
  
        return messages;
      } else {
        console.error('Réponse inattendue de getMessages()', messagesResponse);
        console.timeEnd('loadData'); // Arrêter le chronomètre même en cas d'erreur
        return [];
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des messages', error);
      console.timeEnd('loadData'); // Arrêter le chronomètre en cas d'erreur
      return [];
    }
  }
  
  async loadPhotos(): Promise<any[]> {
    try {
      console.time('loadPhotos'); // Démarrer le chronomètre pour le chargement des photos
  
      // Récupérer les photos normales et les photos des amis en parallèle
      const [photosResponse, photosFriendsResponse] = await Promise.all([
        firstValueFrom(this.upload.getPhotofilactu()),
        firstValueFrom(this.login.getPhotosFriends())
      ]);
  
      // Vérifier si les réponses sont des tableaux
      if (Array.isArray(photosResponse) && Array.isArray(photosFriendsResponse)) {
        console.log('Les réponses des photos normales et des photos des amis sont des tableaux');
  
        // Combiner les photos des amis et les photos normales
        const combinedPhotos = [...photosResponse, ...photosFriendsResponse];
  
        // Filtrer les photos pour ne garder que les uniques
        const uniquePhotos = Array.from(new Set(combinedPhotos.map(photo => photo.id)))
          .map(id => combinedPhotos.find(photo => photo.id === id));
  
        // Traitement des photos pour enrichir avec les likes et commentaires
        const photos = await Promise.all(uniquePhotos.map(async (photo) => {
          try {
            // Récupérer les likes et les commentaires en parallèle
            const [likesResponse, commentsResponse] = await Promise.all([
              firstValueFrom(this.login.getlikesphotos(photo.id)),
              firstValueFrom(this.log.getCommentsByPhoto(photo.id)) // Assurez-vous que cette méthode est correcte
            ]);
  
            // Construire l'objet de photo enrichi
            return {
              ...photo,
              likes: likesResponse.likes,
              comments: commentsResponse,
            };
          } catch (error) {
            console.error(`Erreur lors du traitement de la photo ${photo.id}:`, error);
            return {
              ...photo,
              likes: [],
              comments: [],
            };
          }
        }));
  
        // Mettre à jour les photos et l'observable
        this.photos$.next(photos);
        this.photos = photos;
  
        console.log('Photos combinées et uniques chargées :', photos);
        console.timeEnd('loadPhotos'); // Arrêter le chronomètre
        return photos;
  
      } else {
        console.error('Réponse inattendue de getPhotofilactu() ou getPhotosFriends()', photosResponse, photosFriendsResponse);
        return [];
      }
  
    } catch (error) {
      console.error('Erreur lors de la récupération des photos', error);
      console.timeEnd('loadPhotos'); // Arrêter le chronomètre en cas d'erreur
      return [];
    }
  }
  

  async loadVideos(): Promise<any[]> {
    try {
      console.time('loadVideos'); // Démarrer le chronomètre pour le chargement des vidéos
  
      // Récupérer les vidéos normales et les vidéos des amis en parallèle
      const [videosResponse, videosFriendsResponse] = await Promise.all([
        firstValueFrom(this.upload.getVideofilactu()),
        firstValueFrom(this.login.getVideosFriends())
      ]);
  
      // Vérifier si les réponses sont des tableaux
      if (Array.isArray(videosResponse) && Array.isArray(videosFriendsResponse)) {
        console.log('Les réponses des vidéos normales et des vidéos des amis sont des tableaux');
  
        // Combiner les vidéos des amis et les vidéos normales
        const combinedVideos = [...videosResponse, ...videosFriendsResponse];
  
        // Filtrer les vidéos pour ne garder que les uniques
        const uniqueVideos = Array.from(new Set(combinedVideos.map(video => video.id)))
          .map(id => combinedVideos.find(video => video.id === id));
  
        // Traitement des vidéos pour enrichir avec les likes et commentaires
        const videos = await Promise.all(uniqueVideos.map(async (video) => {
          try {
            // Récupérer les likes et les commentaires en parallèle
            const [likesResponse, commentsResponse] = await Promise.all([
              firstValueFrom(this.login.getlikesvideos(video.id)),
              firstValueFrom(this.log.getCommentsByVideo(video.id)) // Assurez-vous que cette méthode est correcte
            ]);
  
            // Construire l'objet de vidéo enrichi
            return {
              ...video,
              likes: likesResponse.likes,
              comments: commentsResponse,
            };
          } catch (error) {
            console.error(`Erreur lors du traitement de la vidéo ${video.id}:`, error);
            return {
              ...video,
              likes: [],
              comments: [],
            };
          }
        }));
  
        // Mettre à jour les vidéos et l'observable
        this.videos$.next(videos);
        this.videos = videos;
  
        console.log('Vidéos combinées et uniques chargées :', videos);
        console.timeEnd('loadVideos'); // Arrêter le chronomètre
        return videos;
  
      } else {
        console.error('Réponse inattendue de getVideofilactu() ou getVideosFriends()', videosResponse, videosFriendsResponse);
        return [];
      }
  
    } catch (error) {
      console.error('Erreur lors de la récupération des vidéos', error);
      console.timeEnd('loadVideos'); // Arrêter le chronomètre en cas d'erreur
      return [];
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


  }

  async liaison_click_modal1(message_id: number) {
    console.log("click comment")
    this.id_commentaire1 = message_id;
    this.number_comments1 = await this.getComments(message_id);

    this.currentModal1 = true;
    this.currentModal = false;
    this.currentModal2 = false;
    this.currentModal3 = false;
    this.currentModal4 = false;
    this.currentModal5 = false;

  }

  async liaison_click_modal2(photo_id: number) {
    console.log("click comment")

    this.id_commentaire2 = photo_id;
    this.number_comments2 = await this.getCommentsPhoto(photo_id);

    this.currentModal2 = true;
    this.currentModal = false;
    this.currentModal1 = false;
    this.currentModal3 = false;
    this.currentModal4 = false;
    this.currentModal5 = false;


  }

  async liaison_click_modal3(photo_id: number) {
    console.log("click comment")

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
    console.log("click comment")

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
    console.log("click comment")

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
        console.log("hello du formulaire")
        const responseCreate = await firstValueFrom(this.login.createMessage(formData.message));
        console.log('Message créé avec succès', responseCreate);
        await this.loadData ()

        this.myForm.reset();
      } catch (error: any) {
        if (error.status === 403) {
          console.log('Erreur 403, tentative de rafraîchir le token CSRF');
          try {
            await firstValueFrom(this.login.refreshCsrfToken());
            const responseCreateRetry = await firstValueFrom(this.login.createMessage(formData.message));
            console.log('Message créé avec succès après rafraîchissement du token', responseCreateRetry);
            await this.loadData ()
            this.myForm.reset();


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
        this.photos_Url = response.photo;
        await this.loadData ()
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
        this.videos_Url = response.video;
        await this.loadData ()

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
        message.likes = response.likes;
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
      console.log(photo)
      if (photo) {
        photo.likes = response.likes;
        console.log(photos)
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
        video.likes = response.likes;
        this.videos$.next([...videos]);

      }
    } catch (error) {
      console.error('Erreur lors du processus de like', error);
    }
  }
 

 async handleModalClosed(item:number) {
    console.log('Modal fermé');
    this.currentModal = false;
    this.currentModal1 = false;
    this.currentModal2 = false;
    this.currentModal3 = false;

    this.currentModal4 = false;
    this.currentModal5 = false;
    const response = await firstValueFrom(this.log.getCommentsByMessage(item));
    console.log("rrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrr",response)
    const comments = this.messages$.getValue()
    console.log(comments)
    const video = comments.find(vi => vi.id === item);
      if (video) {
        video.comments.push(response.content);
        this.messages$.next([...comments]);


      }

  }

  handleModalClosed1() {
    console.log('Modal fermé');
    this.currentModal1 = false;
    this.currentModal = false;
    this.currentModal2 = false;
    this.currentModal3 = false;
    this.currentModal4 = false;
    this.currentModal5 = false;

  }

  handleModalClosed2() {
    console.log('Modal fermé');
    this.currentModal2 = false;
    this.currentModal1 = false;
    this.currentModal3 = false;
    this.currentModal = false;
    this.currentModal4 = false;
    this.currentModal5 = false;

  }

  handleModalClosed3() {
    console.log('Modal fermé');
    this.currentModal3 = false;
    this.currentModal = false;
    this.currentModal1 = false;
    this.currentModal2 = false;
    this.currentModal4 = false;
    this.currentModal5 = false;

  }

   handleModalClosed4() {
    console.log('Modal fermé');
    this.currentModal2 = false;
    this.currentModal1 = false;
    this.currentModal3 = false;
    this.currentModal = false;
    this.currentModal4 = false;
    this.currentModal5 = false;

  }

  handleModalClosed5() {
    console.log('Modal fermé');
    this.currentModal3 = false;
    this.currentModal = false;
    this.currentModal1 = false;
    this.currentModal2 = false;
    this.currentModal4 = false;
    this.currentModal5 = false;

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