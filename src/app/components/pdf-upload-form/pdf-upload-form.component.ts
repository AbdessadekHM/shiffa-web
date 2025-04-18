import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-pdf-upload-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './pdf-upload-form.component.html',
  styles: [`
    .modal-backdrop {
      background-color: rgba(0, 0, 0, 0.5);
    }
  `]
})
export class PdfUploadFormComponent {
  @Output() close = new EventEmitter<void>();
  @Output() submit = new EventEmitter<File>();

  selectedFile: File | null = null;
  fileName: string = '';
  description: string = '';

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      if (file.type !== 'application/pdf') {
        alert('Please select a PDF file');
        return;
      }
      this.selectedFile = file;
      this.fileName = file.name;
    }
  }

  onSubmit() {
    if (this.selectedFile) {
      this.submit.emit(this.selectedFile);
      this.close.emit();
    }
  }

  onClose() {
    this.close.emit();
  }
} 