import { Component } from '@angular/core';
import { faThumbsUp } from '@fortawesome/free-solid-svg-icons';


@Component({
  selector: 'app-pouces',
  templateUrl: './pouces.component.html',
  styleUrl: './pouces.component.scss'
})
export class PoucesComponent {
  pouce = faThumbsUp
}
