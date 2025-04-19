import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AddCardComponent } from '../../components/add-card/add-card.component';
import { PdfUploadFormComponent } from '../../components/pdf-upload-form/pdf-upload-form.component';
import { PdfCardComponent } from '../../components/pdf-card/pdf-card.component';
import { SupabaseService } from '../../services/supabase.service';
import { FileMetadata } from '../../models';

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
export class DashboardComponent implements OnInit {
  activeTab: 'resources' | 'accesses' | 'qr' = 'resources';
  showAssistant = false;
  showPdfUploadForm = false;
  showCreateAccessForm = false;
  pdfs: FileMetadata[] | null= null; 

  constructor(
    private supabaseService: SupabaseService,
  ){}
  ngOnInit(): void {
    this.loadPdfs()
    
    console.log("end")
}

  toggleTab(tab: 'resources' | 'accesses' | 'qr') {
    console.log(tab)
    this.activeTab = tab;
  }

  toggleAssistant() {
    this.showAssistant = !this.showAssistant;
  }
  loadPdfs(){

    this.supabaseService.getUserFiles().then((response) => {
      this.pdfs = response.data;
      console.log("from dashboard init")
      console.log(response.data)
      console.log(response.error)

    }).catch((error) => {
        console.error('Error fetching PDFs:', error);
      }
      );
  }

  onPdfSelected(file: File) {
    if (file) {
      console.log('PDF selected:', file.name);
      console.log("from here")
      // TODO: Implement PDF upload logic
      // You can use a service to handle the file upload to your backend
      this.supabaseService.uploadFile(file, "report").then((response) => {
        console.log('PDF uploaded successfully:', response);
        // Optionally, you can add the uploaded PDF to the local state
        this.loadPdfs()
      
        
      }).catch((error) => {
        console.error('Error uploading PDF:', error);
      });
      
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
