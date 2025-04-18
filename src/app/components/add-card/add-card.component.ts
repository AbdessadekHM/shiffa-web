import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-add-card',
  templateUrl: './add-card.component.html',
  
  standalone: true,
  imports: [CommonModule]
})
export class AddCardComponent {
  @Input() title: string = '';
  @Input() iconPath: string = '';
  @Input() acceptFileType?: string;
  @Output() action = new EventEmitter<File | void>();

  onFileSelected(event: Event) {
    if (!this.acceptFileType) return;
    
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      if (file.type === this.acceptFileType) {
        this.action.emit(file);
      } else {
        alert(`Please select a ${this.acceptFileType.split('/')[1].toUpperCase()} file`);
      }
    }
  }

  onCardClick() {
    if (!this.acceptFileType) {
      this.action.emit();
    }
  }
} 