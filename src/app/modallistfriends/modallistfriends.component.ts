import { Component,OnInit, Input,Output, EventEmitter, OnChanges, SimpleChanges, OnDestroy } from '@angular/core';
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
  constructor(private datePipe: DatePipe, private login:LoginService, private upload: UploadService, private friends: FriendsService, private router: Router, private chatService: CommunicationService)
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

    
      
    navigateToChat(username:string) {
           console.log("usernammmmmmmmmmmmmmmmmmmmmmmmmmmmme",username)
           console.log("usernammmmmmmmmmmmmmmmmmmmmmmmmmmmme",this.actual_user)
        
           this.privatechats = true;
           this.chatService.connect(this.actual_user.username, username);

    // Abonnez-vous aux messages du service
    this.chatSubscription = this.chatService.messages$.subscribe((message: string) => {
      const parsedMessage = JSON.parse(message);
      console.log('Message reçu:', parsedMessage); // Vérifiez la structure des messages reçus
      this.messages.push(parsedMessage);
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
          this.chatService.sendMessage(this.messageText);
          console.log(this.messageText)
          this.messageText = '';  // Réinitialiser le champ de message après envoi
        }
      }

      ngOnDestroy(): void {
        // Nettoyez la connexion WebSocket lorsque le composant est détruit
        this.chatService.disconnect();
        if (this.chatSubscription) {
          this.chatSubscription.unsubscribe();
        }

      }
    

  
    }



  



