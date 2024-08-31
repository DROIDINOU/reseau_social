import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoginService } from '../login.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  snapForm!: FormGroup;
  is_clicked: boolean = false;
  isLoggedIn: boolean | null | string = null;

  constructor(
    private snackBar: MatSnackBar,
    private formBuilder: FormBuilder,
    private login: LoginService
  ) {}

  ngOnInit(): void {
    this.snapForm = this.formBuilder.group({
      first_name: ['', Validators.required],
      last_name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      username: ['', Validators.required],
      password: [null, [Validators.required, Validators.minLength(8), Validators.maxLength(10)]]
    });
  }

  onSubmitForm() {
    if (this.snapForm.valid) {
      this.login.registerUser(this.snapForm.value).subscribe(
        response => {
          console.log('Enregistrement réussi', response);
          this.openSnackBarGreen('Enregistrement réussi', 'Fermer');
          this.snapForm.reset();
        },
        (error: HttpErrorResponse) => {
          this.openSnackBar(error.error.message || 'Erreur d\'enregistrement', 'Fermer');
        }
      );
    } else {

      // Construire un message d'erreur à partir des erreurs du formulaire
      const errors = this.getFormErrors();
      this.openSnackBar(`Formulaire invalide. ${errors}`, 'Fermer');
      this.snapForm.reset();
    }
  }

  getFormErrors(): string {
    let errorMessages: string[] = [];

    Object.keys(this.snapForm.controls).forEach(key => {
      const controlErrors = this.snapForm.get(key)?.errors;
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
