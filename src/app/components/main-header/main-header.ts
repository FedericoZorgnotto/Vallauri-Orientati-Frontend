import { NgClass } from '@angular/common';
import { Component, HostListener } from '@angular/core';
import { RouterLink, Router, NavigationEnd, RouterModule } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-main-header',
  imports: [RouterModule, NgClass],
  templateUrl: './main-header.html',
  styleUrl: './main-header.css',
})
export class MainHeader {
  Routes = [
    { path: '/', label: 'Home' },
    { path: '/about', label: 'About' },
    { path: '/contact', label: 'Contact' },
  ];
  CurrentPage: string = '/';
  constructor(private router: Router) {
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        this.CurrentPage = event.urlAfterRedirects;
      });

    window.addEventListener('scroll', this.onScroll);
  }

  navigateTo(route: string): void {
    console.log('Navigating to:', route);

    this.router.navigate([route]).then(() => {
      document.body.scrollIntoView({ behavior: 'smooth' });
      this.CurrentPage = route;
    });
  }

  lastScrollY = 0;
  isHidden = false;

  @HostListener('window:scroll', [])
  onScroll(): void {
    const header = document.getElementById('header');
    if (!header) return;

    const currentScrollY = window.scrollY;

    // cambia colore se non sei in cima
    if (currentScrollY > 0) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }

    // logica visibilità
    if (currentScrollY > this.lastScrollY && currentScrollY > 50) {
      // scroll down → nascondi
      header.classList.add('hidden');
    } else if (currentScrollY < this.lastScrollY) {
      // scroll up → mostra
      header.classList.remove('hidden');
    }

    this.lastScrollY = currentScrollY;
  }
}
