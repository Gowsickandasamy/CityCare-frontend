import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter} from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-button',
  imports: [RouterLink,CommonModule],
  templateUrl: './button.component.html',
  styleUrl: './button.component.css',
})
export class ButtonComponent {
  @Input() buttonText: string = 'HoverMe';
  @Input() routerLink?: string ;
  @Output() buttonClick = new EventEmitter<void>();

  onClick(event: Event) {
    if (!this.routerLink) {
      event.preventDefault(); // Prevents navigation if no routerLink is provided
      this.buttonClick.emit();
    }
  }
}
