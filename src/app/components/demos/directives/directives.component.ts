import { Component } from '@angular/core';

@Component({
  selector: 'app-directives',
  templateUrl: './directives.component.html',
  styleUrl: './directives.component.scss'
})
export class DirectivesComponent {
    estVisible : boolean = true;
    optionSelectionnee : string | null = null
    // optionSelectionnee = <string | null>(null) => autres syntaxe
    elements : string[] = ['élément 1', 'élément 2', 'élément 3', 'élément 4', 'élément 5']
    estSpecial : boolean = true
    peutEnregistrer : boolean = false


    basculerVisibilite() : void {
        this.estVisible = !this.estVisible
    }

    selectionnerOption(option : string) : void{
        this.optionSelectionnee = option
    }

    reset(): void{
        this.optionSelectionnee = null
    }
}
