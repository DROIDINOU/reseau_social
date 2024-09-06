import { Component, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-footerindications',
  templateUrl: './footerindications.component.html',
  styleUrl: './footerindications.component.scss'
})
export class FooterindicationsComponent implements OnDestroy {
  isActive: boolean = false;

  toggleArrow() {
    this.isActive = !this.isActive;
    if (this.isActive) {
      this.scrollToBottom();
    } else {
      this.scrollToTop();
    }
  }

  scrollToBottom() {
    if(this.isBrowser()) {
    window.scrollTo({
      top: document.body.scrollHeight,
      behavior: 'smooth'
    });
  }}

  scrollToTop() {
    if (this.isBrowser()) {  // Vérification du contexte du navigateur
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }
  }

  private isBrowser(): boolean {
    return typeof window !== 'undefined';
  }

  ngOnDestroy() {
    // Réinitialiser l'état à la fermeture du composant
    this.isActive = false;
    this.scrollToBottom(); // Ajouter cette ligne pour remonter au sommet

  }
}
