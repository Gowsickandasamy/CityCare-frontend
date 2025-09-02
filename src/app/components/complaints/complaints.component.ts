import { Component, OnInit, AfterViewInit } from '@angular/core';
import { ComplaintService } from '../../services/complaint.service';
import { Complaint } from '../../models/complaint';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models/user';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { StatusModalComponent } from '../../components-library/status-modal/status-modal.component';
import { ToastrService } from 'ngx-toastr';
import { ComplaintModalComponent } from '../../components-library/complaint-modal/complaint-modal.component';
import { DetailComplaintModalComponent } from '../../components-library/detail-complaint-modal/detail-complaint-modal.component';
declare var bootstrap: any;
@Component({
  selector: 'app-complaints',
  imports: [
    CommonModule,
    MatIconModule,
    FormsModule,
    ComplaintModalComponent,
    DetailComplaintModalComponent,
  ],
  templateUrl: './complaints.component.html',
  styleUrl: './complaints.component.css',
})
export class ComplaintsComponent implements OnInit {
  complaints: Complaint[] = []
  userRole = ""
  userName = ""
  searchText = ""
  selectedStatus = "All"
  showModal = false
  selectedComplaint: Complaint | null = null
  showDetailModal = false
  isLoading = true
  showImagePreview = false;
  previewImageUrl = '';
  previewImageTitle = '';

  constructor(
    private complaintService: ComplaintService,
    private authService: AuthService,
    private toastr: ToastrService,
  ) {}

  ngOnInit(): void {
    this.loadUserInfo()
  }

  loadUserInfo(): void {
    this.authService.getUserInfo().subscribe({
      next: (user: User) => {
        this.userRole = user.role
        this.userName = user.username
        this.loadComplaints()
      },
      error: (err) => {
        console.error("Error fetching user info:", err)
        this.toastr.error("Failed to load user information")
        this.isLoading = false
      },
    })
  }

  loadComplaints(): void {
    this.isLoading = true
    this.complaintService.get_complaint().subscribe({
      next: (response: any) => {
        this.complaints = response || []
        this.isLoading = false
      },
      error: (err) => {
        console.error("Error fetching complaints:", err)
        this.toastr.error("Failed to load complaints")
        this.isLoading = false
      },
    })
  }

  openReviewModal(complaint: Complaint): void {
    this.selectedComplaint = complaint
    this.showModal = true
  }

  closeReviewModal(): void {
    this.showModal = false
    this.selectedComplaint = null
  }

  openDetailModal(complaint: Complaint): void {
    this.getDetailComplaint(complaint)
  }

  closeDetailModal(): void {
    this.showDetailModal = false
    this.selectedComplaint = null
  }

  updateRating(review: { rating: number; comment: string }): void {
    if (!this.selectedComplaint?.id) {
      this.toastr.error("Error: Invalid complaint selected.")
      return
    }

    const updatedComplaint = {
      id: this.selectedComplaint.id,
      rating: review.rating,
      comment: review.comment,
    }

    this.complaintService.add_review(updatedComplaint).subscribe({
      next: () => {
        this.toastr.success("Review submitted successfully")
        this.loadComplaints()
        this.closeReviewModal()
      },
      error: (err) => {
        console.error("Error updating review:", err)
        this.toastr.error("Failed to submit review")
      },
    })
  }

  get filteredComplaints(): Complaint[] {
    return this.complaints.filter((complaint) => {
      const statusMatch = this.selectedStatus === "All" || complaint.status === this.selectedStatus

      const searchMatch =
        this.searchText.trim() === "" ||
        (complaint.title?.toLowerCase() || "").includes(this.searchText.toLowerCase()) ||
        (complaint.description?.toLowerCase() || "").includes(this.searchText.toLowerCase()) ||
        (complaint.area_name?.toLowerCase() || "").includes(this.searchText.toLowerCase()) ||
        (complaint.officer?.toLowerCase() || "").includes(this.searchText.toLowerCase())

      return statusMatch && searchMatch
    })
  }

  setStatus(status: string): void {
    this.selectedStatus = status
  }

  deleteComplaint(id: number): void {
    if (confirm("Are you sure you want to delete this complaint?")) {
      this.complaintService.delete_complaint(id).subscribe({
        next: () => {
          this.toastr.success("Complaint deleted successfully")
          this.loadComplaints()
        },
        error: (err) => {
          console.error("Error deleting complaint:", err)
          this.toastr.error("Failed to delete complaint")
        },
      })
    }
  }

  getDetailComplaint(complaint: any): void {
    if (!complaint?.id) {
      this.toastr.error("Error: Complaint ID is missing.")
      return
    }

    this.complaintService.get_detail_complaint(complaint.id).subscribe({
      next: (data) => {
        this.selectedComplaint = data
        this.showDetailModal = true
      },
      error: (err) => {
        console.error("Error fetching complaint details:", err)
        this.toastr.error("Failed to load complaint details")
      },
    })
  }

  getStatusBadgeClass(status: string): string {
    switch (status) {
      case "PENDING":
        return "badge-pending"
      case "WORK_ON_PROGRESS":
        return "badge-progress"
      case "RESOLVED":
        return "badge-resolved"
      default:
        return "badge-default"
    }
  }

  getStatusText(status: string): string {
    switch (status) {
      case "PENDING":
        return "Pending"
      case "WORK_ON_PROGRESS":
        return "In Progress"
      case "RESOLVED":
        return "Resolved"
      default:
        return status
    }
  }

  getPendingCount(): number {
    return this.complaints.filter((c) => c.status === "PENDING").length
  }

  getProgressCount(): number {
    return this.complaints.filter((c) => c.status === "WORK_ON_PROGRESS").length
  }

  getResolvedCount(): number {
    return this.complaints.filter((c) => c.status === "RESOLVED").length
  }

  getTotalCount(): number {
    return this.complaints.length
  }

  previewImage(image: string, title: string): void {
    this.previewImageUrl = `https://citycare-backend-1.onrender.com${image}`;;
    this.previewImageTitle = title;
    this.showImagePreview = true;
  }

  closeImagePreview(): void {
    this.showImagePreview = false;
    this.previewImageUrl = '';
    this.previewImageTitle = '';
  }

  
}
