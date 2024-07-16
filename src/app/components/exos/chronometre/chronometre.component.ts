import { Component } from '@angular/core';

@Component({
  selector: 'app-chronometre',
  templateUrl: './chronometre.component.html',
  styleUrl: './chronometre.component.scss'
})
export class ChronometreComponent {
    private intervale :any = null
    temps : number = 0
    enCours : boolean = false

    get minutes(): number{
        return Math.floor(this.temps / 60)
    }

    get secondes(): number{
        return this.temps % 60
    }

    demarrer() : void{
        if(!this.enCours){
            this.intervale = setInterval(() =>{
                this.temps += 1
            },1000)
        }
        this.enCours = true
    }

    pause(): void {
        if(this.enCours){
            clearInterval(this.intervale)
        }
        this.enCours = false
    }

    reinitialiser(): void {
        clearInterval(this.intervale)
        this.temps = 0
        this.enCours = false
    }
}
