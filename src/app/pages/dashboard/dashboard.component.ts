import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AddCardComponent } from '../../components/add-card/add-card.component';
import { PdfUploadFormComponent } from '../../components/pdf-upload-form/pdf-upload-form.component';
import { PdfCardComponent } from '../../components/pdf-card/pdf-card.component';

interface Pdf {
  title: string;
  description?: string;
  file: File;
  thumbnailUrl?: string;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, AddCardComponent, PdfUploadFormComponent, PdfCardComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {
  activeTab: 'resources' | 'accesses' | 'qr' = 'resources';
  showAssistant = false;
  showPdfUploadForm = false;
  showCreateAccessForm = false;
  pdfs: Pdf[] = []; // This will be populated with actual PDFs from your service

  toggleTab(tab: 'resources' | 'accesses' | 'qr') {
    this.activeTab = tab;
  }

  toggleAssistant() {
    this.showAssistant = !this.showAssistant;
  }

  onPdfSelected(file: File) {
    if (file) {
      console.log('PDF selected:', file.name);
      // TODO: Implement PDF upload logic
      // You can use a service to handle the file upload to your backend
      this.closePdfUploadForm();
    }
  }

  openPdfUploadForm() {
    this.showPdfUploadForm = true;
  }

  closePdfUploadForm() {
    this.showPdfUploadForm = false;
  }

  openCreateAccessForm() {
    this.showCreateAccessForm = true;
  }

  closeCreateAccessForm() {
    this.showCreateAccessForm = false;
  }
}
