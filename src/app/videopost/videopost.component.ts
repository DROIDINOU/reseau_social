
import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { faThumbsUp } from '@fortawesome/free-solid-svg-icons';
import { faEye,faTrophy,faPlay,faExpand } from '@fortawesome/free-solid-svg-icons';
import { LoginService } from '../login.service';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-videopost',
  templateUrl: './videopost.component.html',
  styleUrl: './videopost.component.scss'
})
export class VideopostComponent implements OnInit {
  faPlay = faPlay;  // Icône Play
  faExpand = faExpand;  // Icône Plein Écran
   fathumbsup = faThumbsUp;
   faeye = faEye;
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

async likeClicked(video_id: number): Promise<void> {
  this.likes += 1;
  console.log("salut", video_id);

  try {
    const responseCreate = await firstValueFrom(this.login.createlikesphotos(video_id));
    console.log('Like créé avec succès', responseCreate);
    const updatedVideos = [...this.liste_videos];
    // Trouver l'index de la photo aimée
    const videoIndex = updatedVideos.findIndex(v => v.id === video_id);
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


