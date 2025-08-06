import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-complaint-modal',
  imports: [CommonModule,ReactiveFormsModule, FormsModule],
  templateUrl: './complaint-modal.component.html',
  styleUrl: './complaint-modal.component.css'
})
export class ComplaintModalComponent implements OnInit{

  @Input() showModal: boolean = false;
  @Input() complaint: any;
  @Output() closeModal = new EventEmitter<void>();
  @Output() review = new EventEmitter<{ rating: number; comment: string }>();

  reviewForm!: FormGroup;
  rating: number = 0;
  starsArray: number[] = [1, 2, 3, 4, 5];
  constructor(private fb: FormBuilder) {
    this.reviewForm = this.fb.group({
      rating: [null, Validators.required],
      comment: ['', Validators.required]
    });
  }

  ngOnInit() {
  }

  setRating(value: number): void {
    this.rating = value;
    this.reviewForm.controls['rating'].setValue(this.rating);
  }

  sendReview(){
    if (this.reviewForm.invalid) {
      console.error("Form is invalid");
      return;
    }
    const{ rating, comment } = this.reviewForm.value;

    console.log("Updated Status:", rating, comment);

    this.review.emit({ rating, comment });
    this.closeModal.emit();
  }
  close() {
    this.closeModal.emit();
  }

}
