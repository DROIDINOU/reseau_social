import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges,OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { CommentModalsService } from '../comment-modals.service';
import { firstValueFrom,Observable, take } from 'rxjs';
import { faTimes } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-modalcomments',
  templateUrl: './modalcomments.component.html',
  styleUrls: ['./modalcomments.component.scss']
})
export class ModalcommentsComponent implements OnChanges {
  myForm!: FormGroup;
  username: string | null = null;
  content: string = "";
  comments_list: any[] = [];
  id_message: number | null = null;
  totalcomments: number | null = null;
  faTimes = faTimes;
  data1: any[] = [];

  @Input() message_id: number | null = null;
  @Input() modal: boolean = false;
  @Input() id_comment: number | null = null;


  @Output() modalClosed = new EventEmitter<void>(); // Output pour signaler la fermeture du modal
  @Output() commentAdded = new EventEmitter<void>(); // Output pour signaler qu'un commentaire a été ajouté

  constructor(private log: CommentModalsService, private formBuilder: FormBuilder, private route: ActivatedRoute) {
    this.myForm = this.formBuilder.group({
      content: ['', Validators.required],
    });

    this.route.paramMap.pipe(
      take(1) // Ne prend que la première valeur émise et se désabonne automatiquement
    ).subscribe(params => {
      this.username = params.get('id');
    });
  
  }

  

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['modal'] && !changes['modal'].firstChange) {
      if (this.modal) {
        this.openModal(); // Ouvrir le modal si modal est true et que ce n'est pas le premier changement
      } else {
        
        this.closeModal(); // Fermer le modal si modal est false
      }
    }
  }

  openModal() {
    // Logique pour ouvrir la fenêtre modale
    const modals = document.getElementById('myModal');
    if (modals && this.modal) {
      modals.style.display = 'block';
      this.modal = true

      console.log('Modal ouvert');
    }
  }

  onSubmit() {
    if (this.myForm.valid) {
      const formData = this.myForm.value;
      try {
        if (this.id_comment){
        this.log.createComment(formData.content, this.id_comment).subscribe(responseCreate => {
          console.log("debut des emmerdes",this.message_id)
          console.log("debut des emmerdes",this.id_comment)

          console.log('Message créé avec succès ICIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIII', responseCreate);
          this.myForm.reset();
          this.commentAdded.emit(); // Émettre l'événement lorsqu'un commentaire est ajouté

          this.modalClosed.emit(); // Émettre l'événement lorsque le modal est fermé
        }, error => {
          console.error('Erreur lors de la création du message', error);
        });}
      } catch (error) {
        console.error('Erreur lors de la création du message', error);
      }
    } else {
      console.log('Formulaire invalide');
      this.myForm.reset();
    }
  }

  

  closeModal() {
    // Logique pour fermer la fenêtre modale
    const modal = document.getElementById('myModal');
    if (modal) {
      modal.style.display = 'none';
      this.modal = false;
      this.modalClosed.emit(); // Émettre l'événement lorsque le modal est fermé

    }
  }
}


  // Charger les messages au démarrage du composant
  // Charger les messages au démarrage du composant



  /*
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['modal'] && !changes['modal'].isFirstChange()) {
      this.openModal();
      console.log("tttttttttttttttttttttttttttttt",this.message_id)
    }
    if (changes['modalcomments'] && !changes['modalcomments'].isFirstChange()) {
      this.openModalComments();
      console.log("yyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyy",this.message_id)

    }
    
   
  }

  openModal() {
    // Logique pour ouvrir la fenêtre modale
    const modals = document.getElementById('myModal');
    if(modals && this.modal){
    modals.style.display = 'block';
    console.log("fermé", this.modal);

    // Charger les messages au démarrage du composant
    // Charger les messages au démarrage du composant
  }

  }

  openModalComments() {
    console.log("lancé??????????????????????????????????????????????????????????????????")
    this.comments_list = this.listcomments;
    if (typeof this.id_message == 'number')
    {this.id_message = this.message_id;console.log("please???????????????????????????????????????????????????????????????????????????????????????????????????????????????3",this.message_id)
  }
    // Logique pour ouvrir la fenêtre modale
    const modals = document.getElementById('myModal');
    if(modals && this.modalcomments){
    modals.style.display = 'block';
    console.log("fermé", this.modalcomments);

    // Charger les messages au démarrage du composant
    // Charger les messages au démarrage du composant
  }

  }

ngOnInit(): void {
    this.myForm = this.formBuilder.group({
      content: ['', Validators.required],
    });
    this.route.paramMap.subscribe(params => {
      this.username = params.get('id');
      console.log(this.username); // Affiche 'gg' dans ce cas
    });
  }
  async onSubmit() {
    if (this.myForm.valid) {

      const formData = this.myForm.value;
      console.log(formData);
      try {
        console.log("salut 1 de serveur",this.id_message)
        // Appel à la méthode du service pour créer un message
        console.log(formData)
        
        const responseCreate = await firstValueFrom(this.log.createComment(formData.content,this.id_message));
        console.log('Message créé avec succès', responseCreate);
        this.commentCreated.emit(responseCreate);

        // Réinitialise le formulaire après création réussie
        this.myForm.reset();

        // Toujours récupérer les messages après soumission pour garantir la synchronisation
      } catch (error) {
        console.error('Erreur lors de la création du message', error);
        // Gérer l'erreur de création de message
      }
    } else {
      console.log('Formulaire invalide');
      this.myForm.reset(); // Réinitialise le formulaire en cas de validation invalide
    }
  }



  async loadMessages() {
    try {
      const messagesResponse = await firstValueFrom(this.log.getComment());
      if (messagesResponse) {
        this.content = messagesResponse; // Met à jour les messages dans le composant
        console.log("salut 2 de serveur",this.content)
        // Charger les likes pour chaque message
      } else {
        console.error('Réponse inattendue de getMessages()', messagesResponse);
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des messages', error);
      // Ajoutez ici la gestion des erreurs
    }
  }

  async onSubmit() {
    if (this.myForm.valid) {

      const formData = this.myForm.value;
      console.log(formData);
      try {
        console.log("salut 1 de serveur",this.id_message)
        // Appel à la méthode du service pour créer un message
        console.log(formData)
        
        const responseCreate = await firstValueFrom(this.log.createComment(formData.content,this.id_message));
        console.log('Message créé avec succès', responseCreate);
        this.commentCreated.emit(responseCreate);

        // Réinitialise le formulaire après création réussie
        this.myForm.reset();

        // Toujours récupérer les messages après soumission pour garantir la synchronisation
      } catch (error) {
        console.error('Erreur lors de la création du message', error);
        // Gérer l'erreur de création de message
      }
    } else {
      console.log('Formulaire invalide');
      this.myForm.reset(); // Réinitialise le formulaire en cas de validation invalide
    }
  }


  closeModal() {
    // Logique pour fermer la fenêtre modale
    const modal = document.getElementById('myModal');
    if(modal){

    modal.style.display = 'none';
    this.modal = false;
    this.loadComments.emit();

  }}
*/


