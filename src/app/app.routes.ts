import {Routes} from '@angular/router';
import {HomePage} from './pages/home-page/home-page';
import {AboutPage} from './pages/about-page/about-page';
import {ContactPage} from './pages/contact-page/contact-page';
import {NotfoundPage} from './pages/notfound-page/notfound-page';
import {LoginPage} from './pages/login-page/login-page';

export const routes: Routes = [
  {path: '', component: HomePage},
  {path: 'about', component: AboutPage},
  {path: 'contact', component: ContactPage},
  {path: 'login', component: LoginPage},
  {path: '**', component: NotfoundPage}
];
