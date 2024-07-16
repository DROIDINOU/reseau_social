import { Component } from '@angular/core';
import { FakeAuthService } from '../../../../tools/services/fake-auth.service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-routing',
    templateUrl: './routing.component.html',
    styleUrl: './routing.component.scss'
})
export class RoutingComponent {

    username: string = ""
    password: string = ""
    idUtilisateur : number = 1

    constructor(private authService : FakeAuthService, private router : Router){}

    validation(): void {
        if(this.authService.login(this.username, this.password)){
            this.router.navigate(['/demos/profil', this.idUtilisateur])
        } else{
            alert("Echec de la connexion ...")
        }
    }
}