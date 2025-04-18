import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {
  activeTab: 'resources' | 'accesses' = 'resources';
  showAssistant = false;

  toggleTab(tab: 'resources' | 'accesses') {
    this.activeTab = tab;
  }

  toggleAssistant() {
    this.showAssistant = !this.showAssistant;
  }
}
