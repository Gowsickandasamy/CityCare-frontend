import { AfterViewInit, Component, OnInit } from '@angular/core';
import { Complaint } from '../../models/complaint';
import { ComplaintService } from '../../services/complaint.service';
import { StatusModalComponent } from '../../components-library/status-modal/status-modal.component';
import { AuthService } from '../../services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { User } from '../../models/user';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-current-complaint',
  imports: [CommonModule, ReactiveFormsModule, FormsModule, StatusModalComponent, MatIconModule, RouterLink],
  templateUrl: './current-complaint.component.html',
  styleUrl: './current-complaint.component.css',
})
export class CurrentComplaintComponent implements OnInit {
  complaints: Complaint[] = [];
  userRole = '';
  userName = '';
  searchText = '';
  selectedStatus = 'All';
  showModal = false;
  selectedComplaint: Complaint | null = null;
  isLoading = true;

  showImagePreview = false;
  previewImageUrl = '';
  previewImageTitle = '';

  constructor(
    private complaintService: ComplaintService,
    private authService: AuthService,
    private toastr: ToastrService,
  ) {}

  ngOnInit(): void {
    this.loadUserInfo();
  }

  loadUserInfo(): void {
    this.authService.getUserInfo().subscribe({
      next: (user: User) => {
        this.userRole = user.role;
        this.userName = user.username;
        this.loadComplaints();
      },
      error: (err) => {
        console.error('Error fetching user info:', err);
        this.toastr.error('Failed to load user information');
        this.isLoading = false;
      },
    });
  }

  loadComplaints(): void {
    this.isLoading = true;
    this.complaintService.get_current_complaint().subscribe({
      next: (response: any) => {
        this.complaints = response || [];
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error fetching complaints:', err);
        this.toastr.error('Failed to load complaints');
        this.isLoading = false;
      },
    });
  }

  openStatusModal(complaint: Complaint): void {
    this.selectedComplaint = complaint;
    this.showModal = true;
  }

  closeStatusModal(): void {
    this.showModal = false;
    this.selectedComplaint = null;
  }

  updateComplaintStatus(newStatus: any): void {
    if (!this.selectedComplaint?.id) {
      this.toastr.error('Error: Invalid complaint selected.');
      return;
    }

    const updatedComplaint = {
      id: this.selectedComplaint.id,
      status: newStatus,
    };

    this.complaintService.change_status(updatedComplaint).subscribe({
      next: () => {
        this.toastr.success('Status updated successfully');
        this.loadComplaints();
        this.closeStatusModal();
      },
      error: (err) => {
        console.error('Error updating status:', err);
        this.toastr.error('Failed to update status');
      },
    });
  }

  get filteredComplaints(): Complaint[] {
    return this.complaints.filter((complaint) => {
      if (complaint.status === 'RESOLVED') {
        return false;
      }
      
      const statusMatch = 
        this.selectedStatus === 'All' || 
        complaint.status === this.selectedStatus;

      const searchMatch =
        this.searchText.trim() === '' ||
        (complaint.title?.toLowerCase() || '').includes(this.searchText.toLowerCase()) ||
        (complaint.description?.toLowerCase() || '').includes(this.searchText.toLowerCase()) ||
        (complaint.area_name?.toLowerCase() || '').includes(this.searchText.toLowerCase()) ||
        (complaint.officer?.toLowerCase() || '').includes(this.searchText.toLowerCase());

      return statusMatch && searchMatch;
    });
  }

  setStatus(status: string): void {
    this.selectedStatus = status;
  }

  deleteComplaint(id: number): void {
    if (confirm('Are you sure you want to delete this complaint?')) {
      this.complaintService.delete_complaint(id).subscribe({
        next: () => {
          this.toastr.success('Complaint deleted successfully');
          this.loadComplaints();
        },
        error: (err) => {
          console.error('Error deleting complaint:', err);
          this.toastr.error('Failed to delete complaint');
        },
      });
    }
  }

  getPendingCount(): number {
    return this.complaints.filter((c) => c.status === 'PENDING').length;
  }

  getProgressCount(): number {
    return this.complaints.filter((c) => c.status === 'WORK_ON_PROGRESS').length;
  }

  getTotalCount(): number {
    return this.complaints.filter(c => 
      c.status === 'PENDING' || c.status === 'WORK_ON_PROGRESS'
    ).length;
  }

  previewImage(image: string, title: string): void {
    // If the image already starts with http(s), use it as-is; otherwise, prefix backend domain
    this.previewImageUrl = image.startsWith('http')
      ? image
      : `https://citycare-backend-1.onrender.com${image}`;

    this.previewImageTitle = title;
    this.showImagePreview = true;
    console.log(this.previewImageUrl);
  }
  closeImagePreview(): void {
    this.showImagePreview = false;
    this.previewImageUrl = '';
    this.previewImageTitle = '';
  }
}
