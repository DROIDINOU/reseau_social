import { Component, OnInit, EventEmitter, Output,ChangeDetectionStrategy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { firstValueFrom,  BehaviorSubject } from 'rxjs';
import { LoginService } from '../login.service';
import { CommentModalsService } from '../comment-modals.service';
import { faThumbsUp, faPhotoVideo, faImage } from '@fortawesome/free-solid-svg-icons';
import { UserService } from '../user.service';
@Component({
  selector: 'app-quoideneuf',
  templateUrl: './quoideneuf.component.html',
  styleUrls: ['./quoideneuf.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush

})
export class QuoideneufComponent implements OnInit {
  myForm!: FormGroup;
  username: string | null = null;
  messages: any[] = [];
  comments: any[] = [];
  comments_All: any[] = []  
  pouces = faThumbsUp;
  videos_photos = faPhotoVideo;
  faImage = faImage;
  id_message: number | null = null;
  currentModal: boolean = false;
  currentModal1: boolean = false;

  id_commentaire: number | null = null;
  id_commentaire1: number | null = null;

  number_comments : any = {};
  number_comments1 : any = {};

  listing_comment : Boolean = false
  messages$: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]); 
  countcomments$: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]); 

  currentModalMessageId: number | null = null;



  @Output() modalClosed = new EventEmitter<void>(); 

  constructor(
    private login: LoginService,
    private log: CommentModalsService,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private userService: UserService
  ) { ;
  }

  ngOnInit(): void {
    this.myForm = this.formBuilder.group({
      message: ['', Validators.required],
    });

    this.route.paramMap.subscribe(params => {
      this.username = params.get('id');

      // Vérifier si l'ID de l'utilisateur est déjà enregistré dans le UserService
      const storedUserId = this.userService.getUserId();
      if (storedUserId) {
        this.username = storedUserId; // Utiliser l'ID enregistré s'il existe déjà
      } else {
        // Si l'ID n'est pas encore enregistré, enregistrer et utiliser celui récupéré de la route
        this.userService.setUserId(this.username);
      }

      console.log('Current username:', this.username);
    });

    // Appeler une fonction pour charger les messages après avoir récupéré l'ID de l'utilisateur
    this.loadMessages();
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
      } else {
        console.error('Réponse inattendue de getMessages()', messagesResponse);
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des messages', error);
    }
  }

  liaison_click_modal(message_id: number) {
    this.id_commentaire = message_id;
    this.getComments(message_id).then(data => this.number_comments = data);
    this.currentModal = true; 
  }

  liaison_click_modal1(message_id: number) {
    this.id_commentaire1 = message_id;
    this.getComments(message_id).then(data => this.number_comments1 = data);
    this.currentModal1 = true; 
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
          // Erreur 403 indique un problème potentiel avec le token CSRF
          console.log('Erreur 403, tentative de rafraîchir le token CSRF');
          try {
            await firstValueFrom(this.login.refreshCsrfToken());
            // Retenter la requête après rafraîchissement du token
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

  handleModalClosed() {
    console.log('Modal fermé');
    this.currentModal = false;
  }

  handleModalClosed1() {
    console.log('Modal fermé');
    this.currentModal1 = false;
  }

  async getComments(message_id: number) {
    try {
      const response = await firstValueFrom(this.log.getCommentsByMessage(message_id));
      this.countcomments$.next(response);
      return response;
    } catch (error) {
      console.error('Erreur lors de la récupération des commentaires', error);
    }
  }

  handleCommentAdded() {
    this.loadMessages();
  }

  list_comments(messageid: number) {
    console.log("Affichage des commentaires pour le message ID:", messageid);
    this.id_commentaire1 = messageid;
    this.listing_comment = !this.listing_comment;
    this.loadMessages();
  }
}