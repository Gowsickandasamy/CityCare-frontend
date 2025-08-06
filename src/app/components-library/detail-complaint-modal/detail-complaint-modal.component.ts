import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-detail-complaint-modal',
  imports: [CommonModule],
  templateUrl: './detail-complaint-modal.component.html',
  styleUrl: './detail-complaint-modal.component.css'
})
export class DetailComplaintModalComponent implements OnInit{

  @Input() showModal: boolean = false;
  @Input() complaint: any;
  @Output() closeModal = new EventEmitter<void>();
  @Output() review = new EventEmitter<{ rating: number; comment: string }>();

  rating: number = 0;
  starsArray: number[] = [1, 2, 3, 4, 5];

  ngOnInit() {
    console.log('Complaint received in detail modal:', this.complaint);
    console.log('Complaint Title',this.complaint.title)
  }
  
  close() {
    this.closeModal.emit();
  }

}
