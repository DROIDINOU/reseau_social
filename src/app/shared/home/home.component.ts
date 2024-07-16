import { Component } from '@angular/core';
import { FakeAuthService } from '../../tools/services/fake-auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
    estConnecte : boolean = false

    constructor(private fakeAuth : FakeAuthService){
        this.estConnecte = fakeAuth.estConnecte()
    }

    // ngOnInit(){

    // }
}
