import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges,OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { CommentModalsService } from '../comment-modals.service';
import { firstValueFrom } from 'rxjs';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-modalgeneral',
  templateUrl: './modalgeneral.component.html',
  styleUrl: './modalgeneral.component.scss'
})
export class ModalgeneralComponent implements OnInit{
  myForm!: FormGroup;
  username: string | null = null;
  content: string = "";
  comments_list: any[] = [];
  id_message: number | null = null;
  totalcomments: number | null = null;
  faTimes = faTimes;
  data: any[] = [];

  @Input() message_id1: number | null = null;
  @Input() modal1: boolean = false;
  @Input() id_comment1: number | null = null;
  @Input() dataObservable!: Observable<any[]>;
  @Output() modalClosed1 = new EventEmitter<void>(); // Output pour signaler la fermeture du modal

  constructor(private log: CommentModalsService, private formBuilder: FormBuilder, private route: ActivatedRoute) {
    this.myForm = this.formBuilder.group({
      content: ['', Validators.required],
    });

    this.route.paramMap.subscribe(params => {
      this.username = params.get('id');
    });
  }


  ngOnInit() {
    this.dataObservable.subscribe(value => {
      this.data = value;
      console.log("final!!!!!",this.data)
      console.log("final!!!!!",this.id_comment1)

    });
  }



  ngOnChanges(changes: SimpleChanges): void {
    if (changes['modal1'] && !changes['modal1'].firstChange) {
      if (this.modal1) {
        this.openModal(); // Ouvrir le modal si modal est true et que ce n'est pas le premier changement
        console.log("modal1")


      } else {
        this.closeModal(); // Fermer le modal si modal est false
      }
    }
  }

  openModal() {
    // Logique pour ouvrir la fenêtre modale
    const modals = document.getElementById('myModal1');
    if (modals && this.modal1) {
      modals.style.display = 'block';
      this.modal1 = true

      console.log("ehqweeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",this.data)
      console.log('Modal 1 ouvert');
    }
  }

  onSubmit() {
    if (this.myForm.valid) {
      const formData = this.myForm.value;
      try {
        if (this.id_comment1){
        this.log.createComment(formData.content, this.id_comment1).subscribe(responseCreate => {
          console.log("debut des emmerdes",this.message_id1)
          console.log("debut des emmerdes",this.id_comment1)

          console.log('Message créé avec succès', responseCreate);
          this.myForm.reset();
          this.modalClosed1.emit(); // Émettre l'événement lorsque le modal est fermé
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
    const modal = document.getElementById('myModal1');
    if (modal) {
      modal.style.display = 'none';
      this.modal1 = false;
      this.modalClosed1.emit(); // Émettre l'événement lorsque le modal est fermé

    }
  }
}



