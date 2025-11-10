import {Component} from '@angular/core';
import {Auth} from '../../services/auth/auth';

@Component({
  selector: 'app-login-page',
  imports: [],
  templateUrl: './login-page.html',
  styleUrl: './login-page.css'
})
export class LoginPage {
  constructor(private authService: Auth) {
  }

  protected onLogin() {
    let email = (document.getElementById('email') as HTMLInputElement).value;
    let password = (document.getElementById('password') as HTMLInputElement).value;
    this.authService.login(email, password).then((success) => {
      if (success) {
        alert('Login successful!');
      } else {
        alert('Login failed. Please check your credentials.');
      }
    });
  }
}
