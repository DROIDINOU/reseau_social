import { Injectable, HostListener // Ajoutez ici si vous ne souhaitez pas utiliser 'providedIn: root'
} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ScrollPreventionServiceService {

  private isScrolling: boolean = false;

  constructor() {
    this.initializeScrollPrevention();
  }

  private initializeScrollPrevention() {
    // Ajouter des écouteurs d'événements pour le défilement
    window.addEventListener('scroll', this.handleScroll, { passive: false });
  }

  private handleScroll = (event: Event) => {
    const scrollTop = window.scrollY;
    const scrollHeight = document.documentElement.scrollHeight;
    const windowHeight = window.innerHeight;

    // Détecter si l'utilisateur est en haut ou en bas
    if (scrollTop === 0 || scrollTop + windowHeight >= scrollHeight) {
      // Prévenir le défilement au-delà des limites
      event.preventDefault();
      event.stopPropagation();
    }
  }

  ngOnDestroy() {
    // Nettoyer les écouteurs d'événements lorsqu'ils ne sont plus nécessaires
    window.removeEventListener('scroll', this.handleScroll);
  }}