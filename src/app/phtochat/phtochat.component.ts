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
 currentModal1: boolean = false;





 liaison_click_modal1() {
  this.currentModal1 = true; 

}

handleModalClosed1() {
  console.log('Modal fermé');
  this.currentModal1 = false;
}

}
