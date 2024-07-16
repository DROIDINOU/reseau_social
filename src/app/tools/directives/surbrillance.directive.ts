import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
    selector: '[surbrillance]'
})
export class SurbrillanceDirective {

    constructor(private el: ElementRef) { }

    @HostListener('mouseenter') onMouseEnter(){
        this.surbrillance('yellow')
    }

    @HostListener('mouseleave') onMouveLeave(){
        this.surbrillance(null)
    }


    private surbrillance(couleur : string | null){
        console.log(this.el.nativeElement.style);
        this.el.nativeElement.style.backgroundColor = couleur
    }
}
