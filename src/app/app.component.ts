import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';

import { ThemeService } from './services/theme.service';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { NavbarComponent } from './shared/navbar/navbar.component';
import { FooterComponent } from './shared/footer/footer.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent, FooterComponent, CommonModule, RouterLink],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'shifaa';
  isDarkMode$: Observable<boolean>;

  constructor(private themeService: ThemeService) {
    this.isDarkMode$ = this.themeService.isDarkMode$;
  }
}
