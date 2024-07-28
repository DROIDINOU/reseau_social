import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { faThumbsUp } from '@fortawesome/free-solid-svg-icons';
import { faEye,faTrophy } from '@fortawesome/free-solid-svg-icons';
import { LoginService } from '../login.service';
import { firstValueFrom } from 'rxjs';



@Component({
  selector: 'app-photospost',
  templateUrl: './photospost.component.html',
  styleUrl: './photospost.component.scss'
})
export class PhotospostComponent implements OnInit {
   fathumbsup = faThumbsUp;
   faeye = faEye;
   id_photo: number|null = null
   likes : number = 0;
   views : number = 0;
   trophy = faTrophy

   constructor (private login: LoginService){}

   @Input() liste_photos: any[] = [];
   @Output() photosUpdated: EventEmitter<any[]> = new EventEmitter<any[]>();


  ngOnInit(): void {
    
    console.log("voivi la liste des photos",this.liste_photos)

  }


   meslikes():void{
         this.likes += 1;
         console.log(this.likes)

   }

   mesviews():void{
    this.views += 1;
    console.log(this.views)

}

async likeClicked(photo_id: number): Promise<void> {
  this.likes += 1;
  console.log("salut", photo_id);

  try {
    const responseCreate = await firstValueFrom(this.login.createlikesphotos(photo_id));
    console.log('Like créé avec succès', responseCreate);
    const updatedPhotos = [...this.liste_photos];
    // Trouver l'index de la photo aimée
    const photoIndex = updatedPhotos.findIndex(p => p.id === photo_id);
    // Ajouter le like à la photo
    if (photoIndex !== -1) {
      updatedPhotos[photoIndex].likes.push(responseCreate.user);
    }
    // Émettre l'événement avec la liste mise à jour
    this.photosUpdated.emit(updatedPhotos);
    // Copier la liste de photos
    // Trouver l'index de la photo aimée
    
  }
  catch (error) {
    console.error('Erreur lors de la création du like', error);
  }
}


}


