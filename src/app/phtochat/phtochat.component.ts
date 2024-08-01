import { Component } from '@angular/core';
import { faUserFriends, faVideo, faComment, faImage   } from '@fortawesome/free-solid-svg-icons';
@Component({
  selector: 'app-phtochat',
  templateUrl: './phtochat.component.html',
  styleUrl: './phtochat.component.scss'
})
export class PhtochatComponent {
 fauser = faUserFriends
 favideo = faVideo
 faComment = faComment
 faImage = faImage
 currentModal100: boolean = false;





 liaison_click_modal100() {
  this.currentModal100 = true; 

}

handleModalClosed100() {
  console.log('Modal fermé');
  this.currentModal100 = false;
}

}
