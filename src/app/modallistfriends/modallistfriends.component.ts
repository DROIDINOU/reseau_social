import { Component,OnInit, Input,Output, EventEmitter, OnChanges, SimpleChanges,ElementRef, Renderer2, OnDestroy, HostListener  } from '@angular/core';
import { LoginService } from '../login.service';
import { faTimes, faComment } from '@fortawesome/free-solid-svg-icons';
import { UploadService } from '../upload.service';
import { FriendsService } from '../friends.service';
import { firstValueFrom } from 'rxjs';
import { Router } from '@angular/router';
import { CommunicationService } from '../communication.service'; // Assurez-vous que le chemin est correct
import { Subscription } from 'rxjs';
import { DatePipe } from '@angular/common';



@Component({
  selector: 'app-modallistfriends',
  templateUrl: './modallistfriends.component.html',
  styleUrls: ['./modallistfriends.component.scss'],
  providers: [DatePipe]

})


export class ModallistfriendsComponent implements OnInit, OnChanges {
  constructor(private elRef: ElementRef, private renderer: Renderer2,private datePipe: DatePipe, private login:LoginService, private upload: UploadService, private friends: FriendsService, private router: Router, private chatService: CommunicationService)
  {this.currentTime = new Date();}
  @Output() modalClosed100 = new EventEmitter<void>(); // Output pour signaler la fermeture du modal
  @Input() modal100: boolean = false;
  faTimes = faTimes;
  faComment = faComment
  currentTime: Date;

  actual_user: {id: number, username: string } = {id: 0, username: ""};
  photos_list : any[] = [];
  friends_list : any;
  entries: any[]=[];
  all_users: any;
  privatechats: boolean = false;


  public messages: any[] = [];
  public messageText: string = '';
  private chatSubscription: Subscription | null = null;
  private actuser: string = ""
 async ngOnInit(): Promise<void> {
  await this.loadCurrentUserFromStorage()
  await this.loadPhotos();
  await this.getallfriends()
  this.entries = Object.entries(this.friends_list)
  console.log("voici....................................l utilisateur actuel", this.actual_user);
  console.log("voici....................................photos", this.photos_list);
  console.log("voici....................................friends", this.friends_list);
  await this.getallusers()
  console.log("voici....................................allusers", this.all_users);
  }

  async loadCurrentUserFromStorage(): Promise<void> {
this.actual_user = this.login.getCurrentUserFromStorage()
this.disableBodyScroll();

console.log("''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''",this.actual_user)  }

ngOnChanges(changes: SimpleChanges): void {
      if (changes['modal100'] && !changes['modal100'].firstChange) {
        if (this.modal100) {
          console.log("pourquoi????????????????????????????????????????????????????????")
          this.openModal(); // Ouvrir le modal si modal est true et que ce n'est pas le premier changement
  
  
        } else {
          this.closeModal(); // Fermer le modal si modal est false
        }
      }}

      async loadPhotos(): Promise<void> {
        try {
          this.photos_list = await this.upload.getProfilePhoto1AsPromise();
          console.log("photos_list après chargement:", this.photos_list.length);
        } catch (error) {
          console.error("Error in loadPhotos:", error);
        }
      }

      async getallfriends(): Promise<void> {
        try {
          this.friends_list = await this.friends.getfriendsAsPromise();
          console.log("photos_list après chargement:", this.photos_list.length);
        } catch (error) {
          console.error("Error in loadPhotos:", error);
        }}

        async getallusers(): Promise<void> {
          try {
            this.all_users = await firstValueFrom(this.login.getAll());
          } catch (error) {
            console.error("Error in getallusers:", error);
          }
        }

        private disableBodyScroll(): void {
          this.renderer.addClass(document.body, 'no-scroll');
        }
      
        private enableBodyScroll(): void {
          this.renderer.removeClass(document.body, 'no-scroll');
        }
      
        navigateToChat(username: string) {
          console.log("Nom d'utilisateur sélectionné:", username);
          console.log("Utilisateur actuel:", this.actual_user);
        
          this.privatechats = true;
          this.chatService.connect(this.actual_user.username, username);
        
          // Abonnement aux messages reçus du service de communication
          this.chatSubscription = this.chatService.messages$.subscribe((message: any) => {
            console.log('Message brut reçu:', message);
        
            let parsedMessage: any;
            
            // Vérifie si le message est déjà un objet ou une chaîne JSON
            try {
              if (typeof message === 'string') {
                parsedMessage = JSON.parse(message); // Premier parsing
                if (typeof parsedMessage.message === 'string') {
                  parsedMessage = JSON.parse(parsedMessage.message); // Deuxième parsing
                }
              } else if (message.message && typeof message.message === 'string') {
                parsedMessage = JSON.parse(message.message); // Si message est déjà un objet, parser seulement la propriété `message`
              } else {
                parsedMessage = message;
              }
            } catch (error) {
              console.error('Erreur lors de l\'analyse du message JSON:', error, message);
              return;  // Quitte si le message est invalide
            }
        
            console.log('Message analysé:', parsedMessage);
        
            // Vérifie que les propriétés `sender` et `message` existent dans le message reçu
            if (parsedMessage.sender && parsedMessage.message) {
              // Vérifie si le message a déjà été ajouté en utilisant un identifiant unique ou en vérifiant son contenu
              if (!this.messages.some(msg => msg.message === parsedMessage.message && msg.sender === parsedMessage.sender)) {
                this.messages.push({
                  sender: parsedMessage.sender,
                  message: parsedMessage.message,
                  isSender: parsedMessage.sender === this.actual_user.username
                });
              }
            } else {
              console.warn('Message reçu mal formaté:', parsedMessage);
            }
        
            console.log("Voici les messages actuels:", this.messages);
          });
        }
     @HostListener('touchmove', ['$event'])
        onTouchMove(event: Event): void {
          event.stopPropagation(); // Empêche la propagation de l'événement de défilement tactile
        }  
      
    closeModal() {
      const modal = document.getElementById('myModal11');
      if (modal) {
        modal.style.display = 'none';
        this.modal100 = false;
        this.modalClosed100.emit(); // Émettre l'événement lorsque le modal est fermé
        this.privatechats = false;

      }}

      openModal() {
        // Logique pour ouvrir la fenêtre modale
        const modals = document.getElementById('myModal11');
        if (modals && this.modal100) {
          modals.style.display = 'block';
          console.log('Modal ouvert');
          console.log("voici....................................photos", this.photos_list);
          
        }
      }

      formatTime(date: Date): string {
        const formattedDate = this.datePipe.transform(date, 'HH:mm');
        // Assurez-vous que formattedDate n'est pas null
        return formattedDate !== null ? formattedDate : '';
      }

      public sendMessage(): void {
        if (this.messageText.trim()) {
          const messageData = JSON.stringify({
            sender: this.actual_user.username,  // Indique que l'utilisateur actuel est l'expéditeur
            message: this.messageText
          });
      
          this.chatService.sendMessage(messageData);  // Envoie l'objet JSON
          console.log("Message envoyé:", messageData);
      
          this.messages.push({
            sender: this.actual_user.username,
            message: this.messageText,
            isSender: true  // Côté client, nous savons que c'est l'utilisateur actuel qui a envoyé le message
          });
      
          this.messageText = '';  // Réinitialiser le champ de message après envoi
        }
      }
      

      ngOnDestroy(): void {
        this.enableBodyScroll();

        // Nettoyez la connexion WebSocket lorsque le composant est détruit
        this.chatService.disconnect();
        if (this.chatSubscription) {
          this.chatSubscription.unsubscribe();
        }

      }
    

  
    }



  



