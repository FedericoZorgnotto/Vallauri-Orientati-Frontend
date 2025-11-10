import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class Auth {
  private accessToken: string;
  private refreshToken: string;

  constructor() {
    this.accessToken = '';
    this.refreshToken = localStorage.getItem('refreshToken') || '';
  }

  public async login(email: string, password: string): Promise<boolean> {
    const body = {
      email: email,
      password: password
    };

    try {
      const response = await fetch('http://127.0.0.1:8000/api/v1/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
      });

      if (response.status === 200) {
        const data = await response.json();
        this.accessToken = data.accessToken;
        this.refreshToken = data.refreshToken;
        localStorage.setItem('refreshToken', this.refreshToken);
        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.error('Error during login:', error);
      return false;
    }
  }
}
