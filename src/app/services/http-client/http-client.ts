import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

const BASE_URL = 'http://localhost:8000/api/v1';
const BASE_URL_REFRESH = `${BASE_URL}/auth/refresh`;
const BASE_URL_VERIFY = `${BASE_URL}/auth/verify`;
const LOGIN_PAGE = '/login';
const DO_NOT_REDIRECT = ['/login', '/register'];

const ACCESS_TOKEN_LABEL = 'access_token';
const REFRESH_TOKEN_LABEL = 'refresh_token';

@Injectable({
  providedIn: 'root'
})
export class HttpClientService {
  constructor(private http: HttpClient) {
  }

  /*async get<T>(endpoint: string, token_required: boolean = true, options: any = {}) : Promise<T> {
    if(token_required) {
      const valid = await checkToken();
      if(!valid) {
        window.location.href = LOGIN_PAGE;
        return Promise.reject('Not authenticated');
      }
    }
    return firstValueFrom(this.http.get<T>(`${BASE_URL}${endpoint}`, options));
  }*/
  async get<T>(endpoint: string, token_required: boolean = true, options: object = {}) : Promise<T> {
    if(token_required) {
      const valid = await checkToken();
      if(!valid) {
        window.location.href = LOGIN_PAGE;
        return Promise.reject('Not authenticated');
      }
    }
    return firstValueFrom(this.http.get<T>(`${BASE_URL}${endpoint}`, options));
  }
}

async function checkToken() {
  // Check if we are on a page that does not require authentication
  if (DO_NOT_REDIRECT.includes(window.location.pathname)) {
    return true;
  }

  let token = localStorage.getItem(ACCESS_TOKEN_LABEL);
  let notfound = false;
  if (!token) {
    localStorage.removeItem(ACCESS_TOKEN_LABEL);
    // Try to refresh the token
    notfound = true;
    token = await refreshToken();
    if (!token) {
      localStorage.removeItem(REFRESH_TOKEN_LABEL);
      return false;
    }

    // If we get here, we have a valid token
    localStorage.setItem(ACCESS_TOKEN_LABEL, token);
  }

  if(await isTokenExpired(token)) {
    localStorage.removeItem(ACCESS_TOKEN_LABEL);
    if(notfound) {
      localStorage.removeItem(REFRESH_TOKEN_LABEL);
      return false;
    }else{
      token = await refreshToken();
    }

    if (!token) {
      localStorage.removeItem(REFRESH_TOKEN_LABEL);
      return false;
    }
  }

  return true;
}

async function refreshToken() : Promise<string | null> {
  const refreshToken = localStorage.getItem(REFRESH_TOKEN_LABEL);
  if (!refreshToken) {
    return null;
  }

  let newAccessToken: string | null = null;

  const response = await fetch(BASE_URL_REFRESH, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${refreshToken}`
    }
  });

  if (response.ok) {
    const data = await response.json();
    newAccessToken = data.access_token;
    if(newAccessToken) {
      localStorage.setItem(ACCESS_TOKEN_LABEL, newAccessToken);
      return newAccessToken;
    }
  }

  return null
}

async function isTokenExpired(token: string) : Promise<boolean> {
  // TODO: Check if the token is expired
  const response = await fetch(BASE_URL_VERIFY, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  });

  if (response.ok) {
    const data = await response.json();
    return !!data.expired;  //data.expired ? true : false;
  }

  return true;
}

export class ClassicResponse {
  detail!: string;
}
