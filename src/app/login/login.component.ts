import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup,Validators } from '@angular/forms';
import { LoginService } from '../login.service';
import { Router } from '@angular/router'; // Importez Router depuis @angular/router
import { AuthService } from '../auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpErrorResponse } from '@angular/common/http';  // Import nécessaire pour la gestion des erreurs HTTP


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

constructor(private snackBar: MatSnackBar,private formBuilder: FormBuilder,private login:LoginService,private router: Router, private authService: AuthService){}


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
        this.message = 'Bienvenue redirection en cours';
        console.log('Enregistrement réussi', this.message);
        this.snackBar.open('Bienvenue redirection en cours', 'Fermer', {
          duration: 5000,  panelClass: ['green-snackbar'], // Durée d'affichage en millisecondes
        });
        this.authService.login(this.snapForm1.value.username); // Mettre à jour l'état de connexion
      },
      error => {
        const httpError = error as HttpErrorResponse;  // Utilisation d'une assertion de type pour l'erreur
        console.error('Erreur de connexion', error);
        this.openSnackBar(`Mot de passe ou nom d'utilisateur incorrect`, 'Fermer');
        this.isLoggedIn = false;
        this.message = 'Erreur de connexion. Veuillez réessayer.';
        console.log(this.isLoggedIn)
        console.log(this.message)
      }
    );
  } else {
    // Construire un message d'erreur à partir des erreurs du formulaire
      const errors = this.getFormErrors();
      this.openSnackBar(`Formulaire invalide. ${errors}`, 'Fermer');
      this.snapForm1.reset();
    }
  }

getFormErrors(): string {
  let errorMessages: string[] = [];

  Object.keys(this.snapForm1.controls).forEach(key => {
    const controlErrors = this.snapForm1.get(key)?.errors;
    if (controlErrors) {
      Object.keys(controlErrors).forEach(keyError => {
        switch (keyError) {
          case 'required':
            errorMessages.push(`Le champ ${key} est requis.`);
            break;
          case 'email':
            errorMessages.push(`Le champ ${key} doit être un email valide.`);
            break;
          case 'minlength':
            errorMessages.push(`Le champ ${key} doit avoir au moins ${controlErrors['minlength'].requiredLength} caractères.`);
            break;
          case 'maxlength':
            errorMessages.push(`Le champ ${key} ne peut pas dépasser ${controlErrors['maxlength'].requiredLength} caractères.`);
            break;
          default:
            errorMessages.push(`Erreur inconnue dans le champ ${key}.`);
            break;
        }
      });
    }
  });

  return errorMessages.join(' ');
}

openSnackBar(message: string, action: string) {
  this.snackBar.open(message, action, {
    duration: 5000, // Affiche le snack bar pendant 5 secondes
    verticalPosition: 'top', // Position en haut de l'écran
    horizontalPosition: 'center',
    panelClass: ['red-snackbar'], // Position au centre horizontalement
  });
}

openSnackBarGreen(message: string, action: string) {
  this.snackBar.open(message, action, {
    duration: 5000, // Affiche le snack bar pendant 5 secondes
    verticalPosition: 'top', // Position en haut de l'écran
    horizontalPosition: 'center',
    panelClass: ['green-snackbar'], // Position au centre horizontalement
  });
}

}
