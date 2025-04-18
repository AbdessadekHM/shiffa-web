import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-add-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './add-card.component.html',
})
export class AddCardComponent {
  @Input() title: string = '';
  @Input() iconPath: string = '';
  @Input() acceptFileType: string = '';
  @Output() action = new EventEmitter<File | void>();

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      if (this.acceptFileType && !file.type.match(this.acceptFileType)) {
        alert(`Please select a file of type: ${this.acceptFileType}`);
        return;
      }
      this.action.emit(file);
      // Reset the input to allow selecting the same file again
      input.value = '';
    }
  }

  onCardClick() {
    if (!this.acceptFileType) {
      this.action.emit();
    }
  }
} 