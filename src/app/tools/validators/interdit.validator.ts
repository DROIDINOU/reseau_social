import { AbstractControl, ValidatorFn } from "@angular/forms";

export function interditValidator(value : string) : ValidatorFn | null{
    return (control : AbstractControl): {[key : string] :any} | null => {
        const interdit = control.value.includes(value)
        console.log(interdit);
        return interdit ? {'erreur': `Le mot ${value} ne doit pas être compris dans la valeur du nom`} : null
    }
}