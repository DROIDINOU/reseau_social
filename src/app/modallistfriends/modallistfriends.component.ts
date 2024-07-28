import { Component,OnInit, Input,Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { LoginService } from '../login.service';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { UploadService } from '../upload.service';
import { FriendsService } from '../friends.service';
import { firstValueFrom } from 'rxjs';



@Component({
  selector: 'app-modallistfriends',
  templateUrl: './modallistfriends.component.html',
  styleUrl: './modallistfriends.component.scss'
})


export class ModallistfriendsComponent implements OnInit, OnChanges {
  constructor( private login:LoginService, private upload: UploadService, private friends: FriendsService)
  {}
  @Output() modalClosed1 = new EventEmitter<void>(); // Output pour signaler la fermeture du modal
  @Input() modal11: boolean = false;
  faTimes = faTimes;
  actual_user: {id: number | null, user: string | null} = {id: null, user: null};
  photos_list : any[] = []
  friends_list : any
  entries: any[]=[]
  all_users: any

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
this.actual_user = this.login.getCurrentUserFromStorage()  }
    

ngOnChanges(changes: SimpleChanges): void {
      if (changes['modal11'] && !changes['modal11'].firstChange) {
        if (this.modal11) {
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
      

      
    closeModal() {
      const modal = document.getElementById('myModal11');
      if (modal) {
        modal.style.display = 'none';
        this.modal11 = false;
        this.modalClosed1.emit(); // Émettre l'événement lorsque le modal est fermé
  
      }}

      openModal() {
        // Logique pour ouvrir la fenêtre modale
        const modals = document.getElementById('myModal11');
        if (modals && this.modal11) {
          modals.style.display = 'block';
          console.log('Modal ouvert');
          console.log("voici....................................photos", this.photos_list);
          
        }
      }
    

  
    }



  



