import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MainFooter } from "./components/main-footer/main-footer";
import { MainHeader } from "./components/main-header/main-header";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, MainFooter, MainHeader],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('frontend_orientati');
}
