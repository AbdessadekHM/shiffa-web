import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-pdf-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pdf-card.component.html',
})
export class PdfCardComponent {
  @Input() isAddCard = false;
  @Input() title = '';
  @Input() description = '';
  @Input() thumbnailUrl = '';
  @Output() onAddClick = new EventEmitter<void>();
} 