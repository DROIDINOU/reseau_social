import { Component } from '@angular/core';
import { faThumbsUp } from '@fortawesome/free-solid-svg-icons';
import { faEye,faTrophy } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-photospost',
  templateUrl: './photospost.component.html',
  styleUrl: './photospost.component.scss'
})
export class PhotospostComponent {
   fathumbsup = faThumbsUp;
   faeye = faEye;
   likes : number = 0;
   views : number = 0;
   trophy = faTrophy
   meslikes():void{
         this.likes += 1;
         console.log(this.likes)

   }

   mesviews():void{
    this.views += 1;
    console.log(this.views)

}
}


