import { Component } from '@angular/core';
import { trigger, state, style, animate, transition } from '@angular/animations';


@Component({
  selector: 'app-noimage',
  templateUrl: './noimage.component.html',
  styleUrl: './noimage.component.scss',
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('2s ease-in', style({ opacity: 1 }))
      ]),
      transition(':leave', [
        animate('2s ease-out', style({ opacity: 0 }))
      ])
    ])
  ]
})
export class NoimageComponent {

}
