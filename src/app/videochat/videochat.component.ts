
import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { faThumbsUp } from '@fortawesome/free-solid-svg-icons';
import { faEye,faTrophy } from '@fortawesome/free-solid-svg-icons';
import { LoginService } from '../login.service';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-videochat',
  templateUrl: './videochat.component.html',
  styleUrl: './videochat.component.scss'
})
export class VideochatComponent implements OnInit {
   fathumbsup = faThumbsUp;
   faeye = faEye;
   id_photo: number|null = null
   id_video: number|null = null

   likes : number = 0;
   views : number = 0;
   trophy = faTrophy

   constructor (private login: LoginService){}

   @Input() liste_videos: any[] = [];
   @Output() videosUpdated: EventEmitter<any[]> = new EventEmitter<any[]>();


  ngOnInit(): void {
    
    console.log("voivi la liste des photos",this.liste_videos)

  }


   meslikes():void{
         this.likes += 1;
         console.log(this.likes)

   }

   mesviews():void{
    this.views += 1;
    console.log(this.views)

}

async likeClicked(videos_id: number): Promise<void> {
  this.likes += 1;
  console.log("salut", videos_id);

  try {
    const responseCreate = await firstValueFrom(this.login.createlikesvideos(videos_id));
    console.log('Like créé avec succès', responseCreate);
    const updatedVideos = [...this.liste_videos];
    // Trouver l'index de la photo aimée
    const videoIndex = updatedVideos.findIndex(p => p.id === videos_id);
    // Ajouter le like à la photo
    if (videoIndex !== -1) {
      updatedVideos[videoIndex].likes.push(responseCreate.user);
    }
    // Émettre l'événement avec la liste mise à jour
    this.videosUpdated.emit(updatedVideos);
    // Copier la liste de photos
    // Trouver l'index de la photo aimée
    
  }
  catch (error) {
    console.error('Erreur lors de la création du like', error);
  }
}


}





