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

  pouces = faThumbsUp;
  videos_photos = faPhotoVideo;
  faImage = faImage;

  id_message: number | null = null;
  id_photo: number | null = null;
  
  currentModal: boolean = false;
  currentModal1: boolean = false;
  currentModal2: boolean = false;
  currentModal3: boolean = false;

  id_commentaire: number | null = null;
  id_commentaire1: number | null = null;
  id_commentaire2: number | null = null;
  id_commentaire3: number | null = null;

  number_comments: any = {};
  number_comments1: any = {};
  number_comments2: any = {};
  number_comments3: any = {};

  listing_comment: boolean = false;
  listing_commentphoto: boolean = false;

  messages$: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
  photos$: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
  countcomments$: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
  countcommentsphotos$: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);

  @Output() modalClosed = new EventEmitter<void>();
  @ViewChild('fileInput') fileInput!: ElementRef;
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
      this.username = params.get('id') || null;

      if (!this.username) {
        this.username = this.userService.getUserId();
      }

      if (this.username) {
        this.userService.setUserId(this.username);
      }

      console.log('Current username:', this.username);
    });

    this.loadMessages();
    this.loadPhotos();
  }

  triggerFileInputClick(): void {
    this.fileInput.nativeElement.click();
  }

  async loadMessages() {
    try {
      const messagesResponse = await firstValueFrom(this.login.getMessages());
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
        this.messages$.next(messages);
        console.log('Valeur actuelle de messages$: ', this.messages$.getValue());
      } else {
        console.error('Réponse inattendue de getMessages()', messagesResponse);
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

  async liaison_click_modal(message_id: number) {
    this.id_commentaire = message_id;
    this.number_comments = await this.getComments(message_id);
    this.currentModal = true;
    this.currentModal1 = false;
    this.currentModal2 = false;
    this.currentModal3 = false;
  }

  async liaison_click_modal1(message_id: number) {
    this.id_commentaire1 = message_id;
    this.number_comments1 = await this.getComments(message_id);
    this.currentModal1 = true;
    this.currentModal = false;
    this.currentModal2 = false;
    this.currentModal3 = false;
  }

  async liaison_click_modal2(photo_id: number) {
    this.id_commentaire2 = photo_id;
    this.number_comments2 = await this.getCommentsPhoto(photo_id);
    this.currentModal2 = true;
    this.currentModal = false;
    this.currentModal1 = false;
    this.currentModal3 = false;
  }

  async liaison_click_modal3(photo_id: number) {
    this.id_commentaire3 = photo_id;
    this.number_comments3 = await this.getCommentsPhoto(photo_id);
    this.currentModal3 = true;
    this.currentModal = false;
    this.currentModal1 = false;
    this.currentModal2 = false;
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

  handleModalClosed() {
    console.log('Modal fermé');
    this.currentModal = false;
    this.currentModal2 = false;
  }

  handleModalClosed1() {
    console.log('Modal fermé');
    this.currentModal1 = false;
    this.currentModal = false;
    this.currentModal2 = false;
    this.currentModal3 = false;
  }

  handleModalClosed2() {
    console.log('Modal fermé');
    this.currentModal2 = false;
    this.currentModal1 = false;
    this.currentModal3 = false;
    this.currentModal = false;
  }

  handleModalClosed3() {
    console.log('Modal fermé');
    this.currentModal3 = false;
    this.currentModal = false;
    this.currentModal1 = false;
    this.currentModal2 = false;
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

  handleCommentAdded() {
    this.loadMessages();
  }

  handleCommentPhotosAdded() {
    this.loadPhotos();
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
}
