import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup,Validators } from '@angular/forms';
import { LoginService } from '../login.service';
import { Router } from '@angular/router'; // Importez Router depuis @angular/router
import { AuthService } from '../auth.service';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent  implements OnInit{

snapForm1!: FormGroup;
is_clicked: boolean= false;
isLoggedIn: boolean|null|string= null;
message : string = "";

constructor(private formBuilder: FormBuilder,private login:LoginService,private router: Router, private authService: AuthService){}


ngOnInit(): void {
  this.snapForm1 = this.formBuilder.group({
    username: ['', Validators.required],
    password: [null, [
      Validators.required,
      Validators.minLength(8), Validators.minLength(10)


      // Vous pouvez ajouter Validators.pattern ici si nécessaire
    ]]
  });
}

onSubmitForm() {
  if (this.snapForm1.valid) {
    console.log(this.snapForm1.value)
    this.login.login(this.snapForm1.value.username, this.snapForm1.value.password).subscribe(
      response => {
        console.log('Enregistrement réussi', response.token);
        this.authService.login(this.snapForm1.value.username); // Mettre à jour l'état de connexion
      },
      error => {
        console.error('Erreur de connexion', error);
        this.isLoggedIn = false;
        this.message = 'Erreur de connexion. Veuillez réessayer.';
        console.log(this.isLoggedIn)
        console.log(this.message)

      }
    );
  } else {
    console.log('Formulaire invalide');
    this.isLoggedIn = 'invalid';
    this.message = 'Formulaire invalide. Veuillez vérifier les champs.';
    console.log(this.isLoggedIn)
        console.log(this.message)
  }
}

}
