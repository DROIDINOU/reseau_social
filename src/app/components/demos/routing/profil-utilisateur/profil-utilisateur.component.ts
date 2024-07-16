import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-profil-utilisateur',
  templateUrl: './profil-utilisateur.component.html',
  styleUrl: './profil-utilisateur.component.scss'
})
export class ProfilUtilisateurComponent {
    idRecupere : number

    constructor(private activatedRoute : ActivatedRoute){
        this.idRecupere = activatedRoute.snapshot.params["idUtilisateur"]
    }
}
