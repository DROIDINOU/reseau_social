import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges,OnInit, ChangeDetectorRef  } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { CommentModalsService } from '../comment-modals.service';
import { firstValueFrom } from 'rxjs';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { Observable } from 'rxjs';


@Component({
  selector: 'app-modalgeneralvideo',
  templateUrl: './modalgeneralvideo.component.html',
  styleUrl: './modalgeneralvideo.component.scss'
})
export class ModalgeneralvideoComponent implements OnInit,OnChanges{
  myForm!: FormGroup;
  username: string | null = null;
  content: string = "";
  comments_list: any[] = [];
  id_video: number | null = null;
  totalcomments: number | null = null;
  faTimes = faTimes;
  data: any[] = [];

  @Input() video_id5: number | null = null;
  @Input() modal5: boolean = false;

  @Input() id_comment5: number | null = null;
  @Input() dataObservable2!: Observable<any[]>;
  @Output() modalClosed5 = new EventEmitter<void>(); // Output pour signaler la fermeture du modal

  constructor(private log: CommentModalsService, private formBuilder: FormBuilder, private route: ActivatedRoute,private cdr: ChangeDetectorRef) {
    this.myForm = this.formBuilder.group({
      content: ['', Validators.required],
    });

    
  }


  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.username = params.get('id');
    });
    this.dataObservable2.subscribe(value => {
      this.data = value;
      console.log("finalement!!!!!",this.data)
      console.log("finalement!!!!!",this.id_comment5)

    });
  }



  ngOnChanges(changes: SimpleChanges): void {
    if (changes['modal5'] && !changes['modal5'].firstChange) {
      if (this.modal5) {
        this.openModal(); // Ouvrir le modal si modal est true et que ce n'est pas le premier changement
        console.log("modal5");

      } else {
        this.closeModal(); // Fermer le modal si modal est false
      }
      this.cdr.detectChanges(); // Forcer la détection des changements si nécessaire

    }
  }

  openModal() {
    // Logique pour ouvrir la fenêtre modale
    const modals33 = document.getElementById('myModal5');
    if (modals33 && this.modal5) {
      modals33.style.display = 'block';
      this.modal5 = true

      console.log("ehqweeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",this.data)
      console.log('Modal 5 ouvert');
    }
  }

  trackById(index: number, item: any): number {
    return item.id;
  }
  

  onSubmit() {
    if (this.myForm.valid) {
      const formData = this.myForm.value;
      try {
        if (this.id_comment5){
        this.log.createComment(formData.content, this.id_comment5).subscribe(responseCreate => {
          console.log("debut des emmerdes",this.video_id5)
          console.log("debut des emmerdes",this.id_comment5)

          console.log('Message créé avec succès', responseCreate);
          this.myForm.reset();
          this.modalClosed5.emit(); // Émettre l'événement lorsque le modal est fermé
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
    const modal33 = document.getElementById('myModal5');
    if (modal33) {
      modal33.style.display = 'none';
      this.modal5 = false;
      this.modalClosed5.emit(); // Émettre l'événement lorsque le modal est fermé

    }
  }
}