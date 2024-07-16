import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'reduction'
})
export class ReductionPipe implements PipeTransform {
    transform(prix : number, taux : number, unite : string): string {
        if(typeof prix !== 'number' || typeof taux !== 'number'){
            return prix.toString()
        }
        const prixProduit = prix - (prix * (taux / 100))
        return `${prixProduit} ${unite}`
    }
}