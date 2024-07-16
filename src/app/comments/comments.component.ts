import { Component } from '@angular/core';
import { faComment } from '@fortawesome/free-solid-svg-icons';
@Component({
  selector: 'app-comments',
  templateUrl: './comments.component.html',
  styleUrl: './comments.component.scss'
})
export class CommentsComponent {
  facomments = faComment;

}
