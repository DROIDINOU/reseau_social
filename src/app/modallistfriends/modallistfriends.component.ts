import { Component, ChangeDetectorRef, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges, ElementRef, Renderer2, OnDestroy } from '@angular/core';
import { LoginService } from '../login.service';
import { faTimes, faComment } from '@fortawesome/free-solid-svg-icons';
import { UploadService } from '../upload.service';
import { FriendsService } from '../friends.service';
import { firstValueFrom, Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { CommunicationService } from '../communication.service'; // Assurez-vous que le chemin est correct
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-modallistfriends',
  templateUrl: './modallistfriends.component.html',
  styleUrls: ['./modallistfriends.component.scss'],
  providers: [DatePipe]
})
export class ModallistfriendsComponent implements OnInit, OnChanges, OnDestroy {
  @Output() modalClosed100 = new EventEmitter<void>(); // Output pour signaler la fermeture du modal
  @Input() modal100: boolean = false;
  faTimes = faTimes;
  faComment = faComment;
  currentTime: Date = new Date();
  isMessageModalOpen: { [key: string]: boolean } = {}; // Gérer les fenêtres modales ouvertes pour chaque utilisateur
  mess: { [key: string]: Array<{ sender: string, message: string, receiver: string}> } = {};

  actual_user: { id: number, username: string } = { id: 0, username: "" };
  photos_list: any[] = [];
  friends_list: { id: number, username: string, friends: any[] } = { id: 0, username: "", friends: [] };

  entries: any[] = [];
  all_users: any;
  privatechats: boolean = false;
  friends_list_bis: any;
  friendsListSubscription: Subscription | null = null;

  public messages: any[] = [];
  public messageText: string = '';
  private chatSubscription: Subscription | null = null;
  public actuser: string = "";

  constructor(
    private cdr: ChangeDetectorRef,
    private elRef: ElementRef,
    private renderer: Renderer2,
    private datePipe: DatePipe,
    private login: LoginService,
    private upload: UploadService,
    private friends: FriendsService,
    private router: Router,
    private chatService: CommunicationService
  ) {}

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

          const updatedUsers = this.photos_list.map(user => {
            if (user.user === this.actual_user.id) {
              const newLikes = filteredData.map(filteredItem => filteredItem.from_user);
              return { ...user, likes: [...user.likes, ...newLikes] };
            }
            return user;
          });
          this.friends_list_bis = updatedUsers;
          console.log('Photos chargées:', this.photos_list);
          console.log("friendsbissssssssssssssssssssssss", this.friends_list_bis);
        },
        (error) => {
          console.error('Erreur lors de la récupération du statut des amis:', error);
        }
      );

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
    this.actual_user = this.login.getCurrentUserFromStorage();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['modal100'] && !changes['modal100'].firstChange) {
      if (this.modal100) {
        this.openModal(); // Ouvrir le modal si modal est true et que ce n'est pas le premier changement
      } else {
        this.closeModal(); // Fermer le modal si modal est false
      }
    }
  }

  async loadPhotos(): Promise<void> {
    try {
      this.photos_list = await this.upload.getProfilePhotoAllAsPromise();
      console.log("photos_list après chargement:", this.photos_list);
    } catch (error) {
      console.error("Erreur dans loadPhotos:", error);
    }
  }

  openMessageModal(userId: string): void {
    this.isMessageModalOpen[userId] = true;
    this.cdr.detectChanges();
  }

  closeMessageModal(userId: string): void {
    this.isMessageModalOpen[userId] = false;
    this.cdr.detectChanges();
  }

  getUserContainerHeight(): number {
    const userContainer = document.querySelector('.user-container');
    this.cdr.detectChanges();
    return userContainer ? userContainer.clientHeight : 300;
  }

  async getallfriends(): Promise<void> {
    try {
      const friends = await firstValueFrom(this.friends.getfriends());
      this.friends_list = friends;
      console.log("list après chargement:", this.friends_list);
    } catch (error) {
      console.error("Erreur dans getallfriends:", error);
    }
  }

  async getallusers(): Promise<void> {
    try {
      this.all_users = await firstValueFrom(this.login.getAll());
    } catch (error) {
      console.error("Erreur dans getallusers:", error);
    }
  }

  navigateToChat(username: string): void {
    console.log("Nom d'utilisateur sélectionné:", username);
    console.log("Utilisateur actuel:", this.actual_user);
  
    this.privatechats = true;
    this.actuser = username;  // L'utilisateur actuellement sélectionné est le destinataire du message
  
    // Connectez-vous à la salle de chat WebSocket pour cet utilisateur
    this.chatService.connect(this.actual_user.username, username);
  
    if (!this.mess[username]) {
      this.mess[username] = [];
    }
  
    // Se désabonner de l'abonnement précédent (s'il y en a un) pour éviter les fuites de mémoire
    if (this.chatSubscription) {
      this.chatSubscription.unsubscribe();
    }
  
    // S'abonner aux messages reçus pour l'utilisateur actuel
    this.chatSubscription = this.chatService.messages$.subscribe((message: any) => this.handleIncomingMessage(message, username));
  }
  
  handleIncomingMessage(message: any, username: string): void {
    console.log('Message brut reçu:', message);
  
    let parsedMessage: any;
  
    try {
      if (typeof message === 'string') {
        parsedMessage = JSON.parse(message);
      } else {
        parsedMessage = message;
      }
    } catch (error) {
      console.error('Erreur lors de l\'analyse du message JSON:', error, message);
      return;
    }
  
    console.log('Message analysé:', parsedMessage);
  
    // Assurez-vous que `timestamp` est bien présent et valide
    const timestamp = parsedMessage.timestamp || new Date().toISOString();
  
    if ((parsedMessage.receiver === this.actual_user.username && parsedMessage.sender === username) ||
        (parsedMessage.sender === this.actual_user.username && parsedMessage.receiver === username)) {
      console.log("Message à ajouter:", parsedMessage);
  
      // Ajoutez le message si ce n'est pas déjà présent
      if (!this.mess[username].some(msg => msg.message === parsedMessage.message && msg.sender === parsedMessage.sender)) {
        this.mess[username].push({
          sender: parsedMessage.sender,
          message: parsedMessage.message,
          receiver: parsedMessage.receiver  // Utilisez le timestamp du message ou une valeur par défaut
        });
        this.cdr.detectChanges(); // Mettez à jour la vue après chaque ajout de message
        console.log("Messages après ajout:", this.mess);
      }
    } else {
      console.warn('Message reçu mal formaté ou ne correspond pas au chat en cours:', parsedMessage);
    }
  
    console.log("Messages actuels:", this.mess[username]);
  }
  
  
  
  

  closeModal() {
    const modal = document.getElementById('myModal11');
    if (modal) {
      modal.style.display = 'none';
      this.modal100 = false;
      this.modalClosed100.emit();
      this.privatechats = false;
    }
  }

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
    const allFriends = new Set([...targetFriends, ...newFriends]);
    return Array.from(allFriends);
  }

  formatMessageTime(timestamp: string): string {
    const date = new Date(timestamp); // Convertit le timestamp en objet Date
    if (isNaN(date.getTime())) { // Vérifie si la date est valide
      return 'Invalid Time';
    }
    const formattedDate = this.datePipe.transform(date, 'HH:mm'); // Formate la date
    return formattedDate !== null ? formattedDate : 'Invalid Time';
  }
  public sendMessage(): void {
    if (this.messageText.trim()) {
      // Envoyer le message via WebSocket
      this.chatService.sendMessage(this.actual_user.username, this.actuser, this.messageText);
      console.log("Message envoyé:", this.messageText);
  
      // Ajouter immédiatement le message à la liste des messages de l'utilisateur actuel
      this.mess[this.actuser].push({
        sender: this.actual_user.username,
        message: this.messageText,
        receiver: this.actuser
      });
      console.log("Messages après envoi:", this.mess);
  
      this.messageText = '';
      this.cdr.detectChanges(); // Mettez à jour la vue
    }
  }
  

  ngOnDestroy(): void {
    this.chatService.disconnect();
    if (this.chatSubscription) {
      this.chatSubscription.unsubscribe();
    }

    if (this.friendsListSubscription) {
      this.friendsListSubscription.unsubscribe();
    }
  }
}
