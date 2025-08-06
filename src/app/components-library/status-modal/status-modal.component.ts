import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-status-modal',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './status-modal.component.html',
  styleUrl: './status-modal.component.css'
})
export class StatusModalComponent implements OnInit {
  @Input() showModal: boolean = false;
  @Input() complaint: any;
  @Output() closeModal = new EventEmitter<void>();
  @Output() statusUpdated = new EventEmitter<string>();

  statusForm!: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.statusForm = this.fb.group({
      status: [this.complaint?.status || 'PENDING', Validators.required]
    });
  }

  updateStatus() {
    if (this.statusForm.invalid) {
      console.error("Form is invalid");
      return;
    }

    const updatedStatus = this.statusForm.value.status;
    console.log("Updated Status:", updatedStatus);

    this.statusUpdated.emit(updatedStatus);
    this.closeModal.emit();
  }

  close() {
    this.closeModal.emit();
  }
}
