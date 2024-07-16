import { AbstractControl, ValidatorFn } from "@angular/forms";


export function ageMinimum(value: number): ValidatorFn {
    return (control: AbstractControl) => {
        let valeurtoControl: number = control.value
        if (control.value == null) {
            return null
        }
        if (valeurtoControl >= value) {
            return null
        }
        return { erreurAge: `L'age doit être supérieur ou égal à ${value}` }
    }
}