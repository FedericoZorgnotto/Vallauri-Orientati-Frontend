import { NgClass } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink, Router, NavigationEnd, RouterModule } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-main-header',
  imports: [RouterModule, NgClass],
  templateUrl: './main-header.html',
  styleUrl: './main-header.css'
})
export class MainHeader {
  Routes = [
    { path: '/', label: 'Home' },
    { path: '/about', label: 'About' },
    { path: '/contact', label: 'Contact' }
  ];
  CurrentPage: string = '/';
  constructor(private router: Router) {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        this.CurrentPage = event.urlAfterRedirects;
      });
  }

  navigateTo(route: string): void { 
    console.log('Navigating to:', route);

    this.router.navigate([route]).then(() => {
      document.body.scrollIntoView({ behavior: 'smooth' });
      this.CurrentPage = route;
    });
  }
}