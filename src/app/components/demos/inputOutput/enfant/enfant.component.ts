import { Component, Input, Output, input, EventEmitter, output } from '@angular/core';

@Component({
  selector: 'app-enfant',
  templateUrl: './enfant.component.html',
  styleUrl: './enfant.component.scss'
})
export class EnfantComponent {
    // Propriété d'entréer pour recevoir l'id de la personne
    @Input() personne : any

    // Événement de sortie pour notifier le parent de la demande de suppression
    @Output() suppressionEnfantClick : EventEmitter<number> = new EventEmitter<number>()

    // Événement de sortie pour notier le parent de la demande de mise à jour du prénom
    @Output() updateEnfantClick: EventEmitter<{id:number, prenom: string}> = new EventEmitter<{id:number, prenom: string}>()

    // Booléen pour controler l'affichage de l'input de mise à jour du prénom
    triggerUpdate : boolean = false

    // Nouvelle valeur du prénom a mettre à jour
    newPrenom : string = ""

    supprimeMoi(idPersonne : number){
        this.suppressionEnfantClick.emit(idPersonne)
    }

    // Méthode pour affiche l'input de mise à jour du prénom avec la valeur actuelle du prénom
    showInput(prenom : string){
        this.newPrenom = prenom
        this.triggerUpdate = !this.triggerUpdate
    }

    // M2thode pour émmetre l'événement de mise à jour du prénom avec l'id et le nouveau prénom
    sauvegarde(idPersonne : number){
        this.updateEnfantClick.emit({id: idPersonne, prenom : this.newPrenom})
    }
}
