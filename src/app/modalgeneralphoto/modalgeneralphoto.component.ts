import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges,OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { CommentModalsService } from '../comment-modals.service';
import { firstValueFrom } from 'rxjs';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { Observable } from 'rxjs';


@Component({
  selector: 'app-modalgeneralphoto',
  templateUrl: './modalgeneralphoto.component.html',
  styleUrl: './modalgeneralphoto.component.scss'
})
export class ModalgeneralphotoComponent implements OnInit{
  myForm!: FormGroup;
  username: string | null = null;
  content: string = "";
  comments_list: any[] = [];
  id_photo: number | null = null;
  totalcomments: number | null = null;
  faTimes = faTimes;
  data: any[] = [];

  @Input() photo_id3: number | null = null;
  @Input() modal3: boolean = false;
  @Input() id_comment3: number | null = null;
  @Input() dataObservable1!: Observable<any[]>;
  @Output() modalClosed3 = new EventEmitter<void>(); // Output pour signaler la fermeture du modal

  constructor(private log: CommentModalsService, private formBuilder: FormBuilder, private route: ActivatedRoute) {
    this.myForm = this.formBuilder.group({
      content: ['', Validators.required],
    });

    this.route.paramMap.subscribe(params => {
      this.username = params.get('id');
    });
  }


  ngOnInit() {
    this.dataObservable1.subscribe(value => {
      this.data = value;
      console.log("finalement!!!!!",this.data)
      console.log("finalement!!!!!",this.id_comment3)

    });
  }



  ngOnChanges(changes: SimpleChanges): void {
    if (changes['modal3'] && !changes['modal3'].firstChange) {
      if (this.modal3) {
        this.openModal(); // Ouvrir le modal si modal est true et que ce n'est pas le premier changement
        console.log("modal3");

      } else {
        this.closeModal(); // Fermer le modal si modal est false
      }
    }
  }

  openModal() {
    // Logique pour ouvrir la fenêtre modale
    const modals33 = document.getElementById('myModal3');
    if (modals33 && this.modal3) {
      modals33.style.display = 'block';
      this.modal3 = true

      console.log("ehqweeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",this.data)
      console.log('Modal 3 ouvert');
    }
  }

  onSubmit() {
    if (this.myForm.valid) {
      const formData = this.myForm.value;
      try {
        if (this.id_comment3){
        this.log.createComment(formData.content, this.id_comment3).subscribe(responseCreate => {
          console.log("debut des emmerdes",this.photo_id3)
          console.log("debut des emmerdes",this.id_comment3)

          console.log('Message créé avec succès', responseCreate);
          this.myForm.reset();
          this.modalClosed3.emit(); // Émettre l'événement lorsque le modal est fermé
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
    const modal33 = document.getElementById('myModal3');
    if (modal33) {
      modal33.style.display = 'none';
      this.modal3 = false;
      this.modalClosed3.emit(); // Émettre l'événement lorsque le modal est fermé

    }
  }
}




