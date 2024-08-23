import { Component } from '@angular/core';
import { faTimes, faHeart } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-tinder',
  templateUrl: './tinder.component.html',
  styleUrl: './tinder.component.scss'
})
export class TinderComponent {
faTimes = faTimes;
faHeart = faHeart;
}
