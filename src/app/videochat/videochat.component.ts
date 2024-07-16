import { Component } from '@angular/core';
import { faThumbsUp } from '@fortawesome/free-solid-svg-icons';
import { faEye,faTrophy  } from '@fortawesome/free-solid-svg-icons';


@Component({
  selector: 'app-videochat',
  templateUrl: './videochat.component.html',
  styleUrl: './videochat.component.scss'
})
export class VideochatComponent {
  fathumbsup = faThumbsUp;
  faeye = faEye;
  likes1:number = 0;
  views1:number = 0;
  trophy = faTrophy;

  meslikes1():void{
    this.likes1 += 1;
    console.log(this.likes1)

}

mesviews1():void{
console.log("ssssssssssssssssssssssssssssss");
this.views1 += 1;
console.log(this.views1)

}
}
