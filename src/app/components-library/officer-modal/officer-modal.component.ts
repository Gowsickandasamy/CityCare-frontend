import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-officer-modal',
  imports: [ReactiveFormsModule, CommonModule, FormsModule],
  templateUrl: './officer-modal.component.html',
  styleUrl: './officer-modal.component.css',
})
export class OfficerModalComponent {
  @Input() header!: string;
  @Input() formGroup!: FormGroup;
  @Input() showModal = false;
  @Input() isSubmitting = false; // New input for loading state
  @Output() closeModal = new EventEmitter<void>();
  @Output() formSubmit = new EventEmitter<void>();

  close() {
    this.closeModal.emit();
  }

  submitForm() {
    if (this.formGroup.valid) {
      this.formSubmit.emit();
    }
  }
}
