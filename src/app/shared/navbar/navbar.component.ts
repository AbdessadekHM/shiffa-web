import { Component } from '@angular/core';
import { RouterModule, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

import { Observable } from 'rxjs';
import { ThemeService } from '../../services/theme.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule, RouterLink],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  isDarkMode$: Observable<boolean>;

  constructor(private themeService: ThemeService) {
    this.isDarkMode$ = this.themeService.isDarkMode$;
  }

  toggleTheme(): void {
    this.themeService.toggleTheme();
  }
}
