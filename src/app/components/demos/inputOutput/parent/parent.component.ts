import { Component } from '@angular/core';
import { users } from '../datas';

@Component({
  selector: 'app-parent',
  templateUrl: './parent.component.html',
  styleUrl: './parent.component.scss'
})
export class ParentComponent {
    // Déclaration de la liste de personne à partir des données importées (fake db)
    listePersonne : {id : number, prenom : string}[] = users

    // Méthode pour supprimmer une élément de la liste par son identifiant
    supprimerEnfantParID(idPersonne : number) {
        const index = this.listePersonne.findIndex(personne => personne.id === idPersonne)
        this.listePersonne.splice(index, 1)
    }

    // Méthode pour mettre à jour le prénom d'un éléments de la liste
    updateEnfantPrenom(updatePersonne: {id:number, prenom: string}){
        console.log(updatePersonne);
        const index = this.listePersonne.findIndex(personne => personne.id === updatePersonne.id)
        this.listePersonne[index].prenom = updatePersonne.prenom
    }
}
