import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AddCardComponent } from '../../components/add-card/add-card.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, AddCardComponent],
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

  onPdfSelected(file: File | void) {
    // Handle PDF file upload
    if(!file) return;
    console.log('PDF selected:', file);
    // TODO: Implement file upload logic
  }

  onAnalysisRequested() {
    // Handle analysis request
    console.log('Analysis requested');
    // TODO: Implement analysis request logic
  }
}
