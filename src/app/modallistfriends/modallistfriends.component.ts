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
  friends_list: { id: number, username: string, friends: any[] } = {id:0, username:"",friends:[]
  };

  entries: any[]=[];
  all_users: any;
  privatechats: boolean = false;
  friends_list_bis: any;
  friendsListSubscription: Subscription | null = null;


  public messages: any[] = [];
  public messageText: string = '';
  private chatSubscription: Subscription | null = null;
  private actuser: string = ""


  async ngOnInit(): Promise<void> {
    await this.loadPhotos();

    await this.getallusers();
    console.log('Tous les utilisateurs chargés:', this.all_users);

    await this.loadCurrentUserFromStorage();
    console.log('Utilisateur actuel chargé:', this.actual_user);

    await this.getallfriends();
    console.log('Amis chargés:', this.friends_list);

    try {
      this.friends.friendStatus$.subscribe(
        (status: any[]) => {
          console.log('Status des amis:', status);
          const filteredData = status.filter(item => item.to_user === this.actual_user.id && item.status === "accepted");

// Utiliser `map()` pour créer une nouvelle version de `users` avec les `likes` mis à jour
const updatedUsers = this.photos_list.map(user => {
  // Si `user.user` correspond à `userIdToFilter`, ajoutez `from_user` à `likes`
  if (user.user === this.actual_user.id) {
    const newLikes = filteredData.map(filteredItem => filteredItem.from_user); // Obtenir tous les `from_user` correspondants
    return { ...user, likes: [...user.likes, ...newLikes] };  // Retourner un nouvel objet avec les `likes` mis à jour
  }
});
this.friends_list_bis = updatedUsers; // Retourner l'objet utilisateur inchangé s'il ne correspond pas
console.log('Photos chargées:', this.photos_list);


console.log("friendsbissssssssssssssssssssssss", this.friends_list_bis);
          // Faites quelque chose avec `status`
        },
        (error) => {
          console.error('Erreur lors de la récupération du statut des amis:', error);
        }
      );
     
      
  
      // Assurez-vous que `this.friends_list` est défini et valide
      if (this.friends_list) {
        this.entries = Object.entries(this.friends_list);
        console.log('Entries après mise à jour:', this.entries);
      } else {
        console.warn('friends_list est undefined ou null');
      }
  
      

      
  
    } catch (error) {
      console.error('Erreur dans ngOnInit:', error);
    }
  }
  
  

  async loadCurrentUserFromStorage(): Promise<void> {
this.actual_user = this.login.getCurrentUserFromStorage()
  }

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
          this.photos_list = await this.upload.getProfilePhotoAllAsPromise();
          console.log("photos_list après chargement:", this.photos_list);
        } catch (error) {
          console.error("Error in loadPhotos:", error);
        }
      }

  async getallfriends(): Promise<void> {
        try {
          // L ERREUR SEMBLE ETRE ICI8888888888888888888?????????????????????????????????????????????
          const friends = await firstValueFrom(this.friends.getfriends());
          this.friends_list = friends
          console.log("list après chargement:", this.friends_list);
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
     
    closeModal() {
      const modal = document.getElementById('myModal11');
      if (modal) {
        modal.style.display = 'none';
        this.modal100 = false;
        this.modalClosed100.emit(); // Émettre l'événement lorsque le modal est fermé
        this.privatechats = false;

      }}

        async openModal(): Promise<void> {
  const modals = document.getElementById('myModal11');
  if (modals && this.modal100) {
    try {
      await this.getallfriends();
      console.log('Amis chargés:', this.friends_list);
      modals.style.display = 'block';
      console.log('Modal ouvert');
      console.log("voici....................................FRIENDLIST", this.friends_list);
    } catch (error) {
      console.error('Erreur lors de l\'ouverture du modal:', error);
    }
  }
}


 mergeFriends(targetFriends: number[], newFriends: number[]): number[] {
  const allFriends = new Set([...targetFriends, ...newFriends]); // Utilise Set pour éviter les duplications
  return Array.from(allFriends);
}

// Mise à jour de l'objet cible



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

        // Nettoyez la connexion WebSocket lorsque le composant est détruit
        this.chatService.disconnect();
        if (this.chatSubscription) {
          this.chatSubscription.unsubscribe();
        }

        if (this.friendsListSubscription) {
          this.friendsListSubscription.unsubscribe();
        }

      }
    

  
    }



  



