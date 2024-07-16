import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { time } from 'console';
import { interditValidator } from '../../../tools/validators/interdit.validator';
import { ageMinimum } from '../../../tools/validators/age-minimum.validator';

@Component({
    selector: 'app-formulaire',
    templateUrl: './formulaire.component.html',
    styleUrl: './formulaire.component.scss'
})
export class FormulaireComponent {
    formulaire : FormGroup
    complete : boolean = false

    constructor(private formBuilder : FormBuilder){
        // Utilisation de FormBuilder pour créer un formulaire réactif
        this.formulaire = this.formBuilder.group({
            nom : ['', [Validators.required, interditValidator("test")]], // Validator custom pour vérifier la présence de mot interdit
            age : ['', [Validators.required, ageMinimum(18)]],
            email : ['', [Validators.required, Validators.email]], // Validateur custom pour s'assurer de l'âge minimum d'un utilisateur
            genre : ['', [Validators.required]],
            hobbies : this.formBuilder.array([this.formBuilder.control('')]), // FormArray initialisé avec un champ de texte
            pays : ['', [Validators.required]]
        })
    }

    get hobbies(){
        return this.formulaire.get('hobbies') as FormArray
    }

    ajouterHobbie() {
        this.hobbies.push(this.formBuilder.control(''))
    }

    onSubmit(){
        console.log("réceptino du formulaire");
        console.log(this.formulaire.value);
        this.complete = true
    }
}
