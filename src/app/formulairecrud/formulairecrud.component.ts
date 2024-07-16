import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ageMinimum } from '../tools/validators/age-minimum.validator';
import { Router } from '@angular/router';
import { FanService } from '../fan.service';

@Component({
  selector: 'app-formulairecrud',
  templateUrl: './formulairecrud.component.html',
  styleUrl: './formulairecrud.component.scss'
})
export class FormulairecrudComponent {
  formulaire1 : FormGroup
  complete : boolean = false

  constructor(private formBuilder : FormBuilder, private router: Router, private fanservice: FanService){
      // Utilisation de FormBuilder pour créer un formulaire réactif
      this.formulaire1 = this.formBuilder.group({
          name : ['', [Validators.required]], // Validator custom pour vérifier la présence de mot interdit
          birthYear : ['', [Validators.required,Validators.pattern(/^(19|20)\d{2}$/)]],
          favoriteSeries : this.formBuilder.array([this.formBuilder.control('')]), // FormArray initialisé avec un champ de texte
      })
  }

  get titres(){
      return this.formulaire1.get('favoriteSeries') as FormArray
  }

  ajoutertitre() {
      this.titres.push(this.formBuilder.control(''))
  }

  onSubmit(){
      console.log("réception du formulaire");
      console.log("formulaire",this.formulaire1.value);
      this.fanservice.addFan(this.formulaire1.value)
      this.router.navigate(['/exos/fanpage', this.formulaire1.value.name])

      this.complete = true
  }
}
