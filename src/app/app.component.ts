import { Component } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router'; // N'oubliez pas d'importer Router et NavigationEnd

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']  // Utilisez 'styleUrls' (avec 's') et un tableau
})
export class AppComponent {
  showFooter: boolean | undefined; // Peut être undefined, true ou false
  customScrollbar: boolean = false;

  constructor(private router: Router) {}

  ngOnInit() {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        const url = event.urlAfterRedirects;

        // Vérifier si l'URL correspond à celles des composants concernés
        if (url.includes('/login') || url.includes('/register')) {
          window.scrollTo(0, 0); // Défiler vers le haut
        }
      }
    });
  }

  enableCustomScrollbar() {
    console.log("yessssssssssssssssssssssssssssss");
    this.customScrollbar = true;
  }

  disableCustomScrollbar() {
    console.log("falseeeeeeeeeeeeeeeeeeeeeeeeee");
    this.customScrollbar = false;
  }
}
