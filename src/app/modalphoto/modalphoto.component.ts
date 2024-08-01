import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { CommentModalsService } from '../comment-modals.service';
import { Observable, Subscription,firstValueFrom } from 'rxjs';
import { faTimes } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-modalphoto',
  templateUrl: './modalphoto.component.html',
  styleUrls: ['./modalphoto.component.scss']
})
export class ModalphotoComponent implements OnChanges, OnInit, OnDestroy {
  myForm!: FormGroup;
  username: string | null = null;
  content: string = "";
  comments_list: any[] = [];
  id_photo: number | null = null;
  totalcomments: number | null = null;
  faTimes = faTimes;
  data1: any[] = [];

  @Input() photo_id2: number | null = null;
  @Input() modal2: boolean = false;
  @Input() id_comment2: number | null = null;

  @Output() modalClosed2 = new EventEmitter<void>();
  @Output() commentAdded1 = new EventEmitter<void>();

  private routeSubscription!: Subscription; // Déclaration pour les abonnements
  private createCommentSubscription!: Subscription;

  constructor(private log: CommentModalsService, private formBuilder: FormBuilder, private route: ActivatedRoute, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.myForm = this.formBuilder.group({
      content: ['', Validators.required],
    });

    this.routeSubscription = this.route.paramMap.subscribe(params => {
      this.username = params.get('id');
      console.log(this.username); // Assurez-vous que 'id' est correctement récupéré
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['modal2'] && !changes['modal2'].firstChange) {
      if (this.modal2) {
        this.openModal2();
      } else {
        this.closeModal2();
      }
    }
  }

  openModal2() {
    const modals22 = document.getElementById('myModal10');
    if (modals22 && this.modal2) {
      this.modal2 = true
      console.log("ohhhhhh yejhhhhhhhhhhhhhhhhhhhhhhhh")
      modals22.style.display = 'block';
    }
  }

  async onSubmit1() {
    console.log("onsubmiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiit")
    if (this.myForm.valid) {
      const formData = this.myForm.value;
      if (this.id_comment2) {
        try {
          console.log("l id photo?????", this.id_comment2)
          const responseCreate = await firstValueFrom(this.log.createComment1(formData.content, this.id_comment2));
          console.log('Message créé avec succès', responseCreate);
          this.myForm.reset();
          this.commentAdded1.emit();
          this.modalClosed2.emit();
          this.myForm.reset();
        } catch (error) {
          console.error('Erreur lors de la création du message', error);
        }
      }
    } else {
      this.myForm.reset();
    }
  }


  closeModal2() {
    const modal22 = document.getElementById('myModal10');
    if (modal22) {
      modal22.style.display = 'none';
      this.modal2 = false;
      this.modalClosed2.emit();
      this.cdr.detectChanges();
    }
  }

  ngOnDestroy(): void {
    // Annuler les abonnements pour éviter les fuites de mémoire
    if (this.routeSubscription) {
      this.routeSubscription.unsubscribe();
    }
    if (this.createCommentSubscription) {
      this.createCommentSubscription.unsubscribe();
    }
  }
}
