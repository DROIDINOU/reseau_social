import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { CommentModalsService } from '../comment-modals.service';
import { Observable, Subscription,firstValueFrom, take } from 'rxjs';
import { faTimes } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-modalvideo',
  templateUrl: './modalvideo.component.html',
  styleUrl: './modalvideo.component.scss'
})
export class ModalvideoComponent  implements OnChanges, OnInit, OnDestroy {
  myForm!: FormGroup;
  username: string | null = null;
  content: string = "";
  comments_list: any[] = [];
  id_videos: number | null = null;
  totalcomments: number | null = null;
  faTimes = faTimes;
  data1: any[] = [];

  @Input() video_id4: number | null = null;
  @Input() modal4: boolean = false;
  @Input() id_comment4: number | null = null;


  @Output() modalClosed4 = new EventEmitter<void>();
  @Output() commentAdded2 = new EventEmitter<void>();

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
    if (changes['modal4'] && !changes['modal4'].firstChange) {
      if (this.modal4) {
        this.openModal4();
      } else {
        this.closeModal4();
      }
    }
  }

  openModal4() {
    const modals22 = document.getElementById('my11');
    if (modals22 && this.modal4) {
      this.modal4 = true
      console.log("ohhhhhh yejhhhhhhhhhhhhhhhhhhhhhhhh")
      modals22.style.display = 'block';
    }
  }

  async onSubmit2() {
    console.log("onsubmiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiit")
    if (this.myForm.valid) {
      const formData = this.myForm.value;
      if (this.id_comment4) {
        try {
          console.log("l id photo?????", this.id_comment4)
          const responseCreate = await firstValueFrom(this.log.createComment2(formData.content, this.id_comment4));
          console.log('Message créé avec succès', responseCreate);
          this.myForm.reset();
          this.commentAdded2.emit();
          this.modalClosed4.emit();
          this.myForm.reset();
        } catch (error) {
          console.error('Erreur lors de la création du message', error);
        }
      }
    } else {
      this.myForm.reset();
    }
  }


  closeModal4() {
    const modal22 = document.getElementById('my11');
    if (modal22) {
      modal22.style.display = 'none';
      this.modal4 = false;
      this.modalClosed4.emit();
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
