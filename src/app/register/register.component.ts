import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup,Validators } from '@angular/forms';
import { LoginService } from '../login.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent implements OnInit {
  snapForm!: FormGroup;
  is_clicked: boolean= false;
  message : string = "";
  isLoggedIn: boolean|null|string= null;

  constructor(private formBuilder: FormBuilder,private login:LoginService){}

  ngOnInit(): void {
    this.snapForm = this.formBuilder.group({
      first_name: ['', Validators.required],
      last_name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      username: ['', Validators.required],
      password: [null, [
        Validators.required,
        Validators.minLength(8), Validators.minLength(10)



        // Vous pouvez ajouter Validators.pattern ici si nécessaire
      ]]
    });
  }

  onSubmitForm() {
    if (this.snapForm.valid) {
      console.log(this.snapForm.value)
      console.log(this.isLoggedIn)
      this.login.registerUser(this.snapForm.value).subscribe(
        response => {
          console.log('Enregistrement réussi', response);
          // Ajoutez ici la gestion de la réponse de l'API
          this.is_clicked = true
          this.isLoggedIn=  true
          setTimeout(()=> {this.isLoggedIn = null; this.is_clicked = false}, 4000);
          console.log(this.isLoggedIn)
          this.snapForm.reset();
        },
        error => {
          this.is_clicked = true
          this.isLoggedIn=  false
          this.message = error.error.error;
          console.error('Erreur d\'enregistrement', error.error.error)
          setTimeout(()=> {this.isLoggedIn = null; this.is_clicked = false; this.message = "";
        }, 4000);
          console.log(this.isLoggedIn)
          console.log(this.snapForm.value)
          // Ajoutez ici la gestion des erreurs de l'API
        }
      );
    } else {
      this.isLoggedIn=  "invalid"
      this.is_clicked = true
      setTimeout(()=> {this.isLoggedIn = null; this.is_clicked = false;this.message = ""}, 10000);
          console.log(this.isLoggedIn)
      console.log(this.snapForm.value)
      console.log('Formulaire invalide');
      this.logFormErrors();  // Log form errors to the console

      this.snapForm.reset();


      // Ajoutez ici la gestion des cas où le formulaire n'est pas valide
    }
  }
  logFormErrors() {
    Object.keys(this.snapForm.controls).forEach(key => {
      const controlErrors = this.snapForm.get(key)?.errors;
      if (controlErrors) {
        Object.keys(controlErrors).forEach(keyError => {
          console.log(`Key control: ${key}, keyError: ${keyError}, errorValue:`, controlErrors[keyError]);
        });
      }
    });
  }
}