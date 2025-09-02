import { CommonModule } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ComplaintService } from '../../services/complaint.service';
import { ToastrService } from 'ngx-toastr';
import { MapComponent } from '../../components-library/map/map.component';
import { ActivatedRoute, Router } from '@angular/router';

interface UploadedFile {
  file: File;
  name: string;
  preview: string;
}
@Component({
  selector: 'app-create-complaint',
  imports: [CommonModule, FormsModule, ReactiveFormsModule, MapComponent],
  templateUrl: './create-complaint.component.html',
  styleUrl: './create-complaint.component.css',
})
export class CreateComplaintComponent implements OnInit {
  @ViewChild('fileInput') fileInput!: ElementRef;

  complaintForm!: FormGroup;
  errorMessage: string = '';
  isModalOpen = false;
  complaintId: string | null = null;
  isEditMode = false;
  isSubmitting = false;
  title!: string;
  uploadedFiles: UploadedFile[] = [];

  constructor(
    private complaintService: ComplaintService,
    private fb: FormBuilder,
    private toastr: ToastrService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.initializeForm();
    this.setupRouteParams();
  }

  initializeForm(): void {
    this.complaintForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(5)]],
      description: [
        '',
        [
          Validators.required,
          Validators.minLength(10),
          Validators.maxLength(500),
        ],
      ],
      area_name: ['', Validators.required],
      location_link: ['', Validators.required],
      category: ['', Validators.required],
      priority: ['medium', Validators.required],
    });
  }

  setupRouteParams(): void {
    this.route.paramMap.subscribe((params) => {
      this.complaintId = params.get('id');
      this.isEditMode = !!this.complaintId;

      if (this.isEditMode) {
        this.loadComplaint();
        this.title = 'Edit Complaint';
      } else {
        this.title = 'Create Complaint';
      }
    });
  }

  loadComplaint(): void {
    this.complaintService.get_complaint().subscribe(
      (complaints) => {
        const complaint = complaints.find(
          (c) => c.id === Number(this.complaintId)
        );

        if (complaint) {
          this.complaintForm.patchValue(complaint);
          this.checkFilled();
        } else {
          this.toastr.error('Complaint not found');
          this.router.navigate(['/current-complaints']);
        }
      },
      (err) => {
        this.toastr.error('Failed to load complaint');
        console.error(err);
      }
    );
  }

  onSubmit(): void {
    if (this.complaintForm.valid) {
      this.isSubmitting = true;

      if (this.isEditMode) {
        this.updateComplaint();
      } else {
        this.createComplaint();
      }
    } else {
      this.markFormGroupTouched();
      this.toastr.warning('Please fill in all required fields correctly');
    }
  }

  createComplaint(): void {
    const formData = this.prepareFormData();

    this.complaintService.createComplaint(formData).subscribe(
      (res) => {
        this.toastr.success('Complaint submitted successfully!');
        this.resetForm();
        this.router.navigate(['/current-complaints']);
      },
      (err) => {
        this.toastr.error('Failed to submit complaint. Please try again.');
        console.error(err);
      },
      () => {
        this.isSubmitting = false;
      }
    );
  }

  updateComplaint(): void {
    const formData = this.prepareFormData();
    formData.append('id', this.complaintId!);

    this.complaintService.edit_complaint(formData).subscribe(
      (res) => {
        this.toastr.success('Complaint updated successfully!');
        this.router.navigate(['/current-complaints']);
      },
      (err) => {
        this.toastr.error('Failed to update complaint. Please try again.');
        console.error(err);
      },
      () => {
        this.isSubmitting = false;
      }
    );
  }

  prepareFormData(): FormData {
    const formValue = this.complaintForm.value;
    const formData = new FormData();

    formData.append('title', formValue.title);
    formData.append('description', formValue.description);
    formData.append('area_name', formValue.area_name);
    formData.append('location_link', formValue.location_link);

    if (this.uploadedFiles.length > 0) {
      formData.append('image', this.uploadedFiles[0].file);
    }

    return formData;
  }

  receiveLocationLink(locationLink: string): void {
    this.complaintForm.patchValue({ location_link: locationLink });
    this.isModalOpen = false;
    this.checkFilled();
    this.toastr.success('Location selected successfully');
  }

  openModal(event: Event): void {
    event.preventDefault();
    this.isModalOpen = true;
  }

  closeModal(): void {
    this.isModalOpen = false;
  }

  checkFilled(event?: any): void {
    // Update form progress
    setTimeout(() => {
      const inputs = document.querySelectorAll('.input-text');
      inputs.forEach((input) => {
        const inputElement = input as HTMLInputElement;
        if (inputElement.value.trim()) {
          input.classList.add('filled');
        } else {
          input.classList.remove('filled');
        }
      });
    }, 0);
  }

  getFormProgress(): number {
    const totalFields = Object.keys(this.complaintForm.controls).length;
    let filledFields = 0;

    Object.keys(this.complaintForm.controls).forEach((key) => {
      const control = this.complaintForm.get(key);
      if (control && control.value && control.value.toString().trim()) {
        filledFields++;
      }
    });

    return Math.round((filledFields / totalFields) * 100);
  }

  getDescriptionLength(): number {
    const description = this.complaintForm.get('description')?.value || '';
    return description.length;
  }

  resetForm(): void {
    this.complaintForm.reset();
    this.uploadedFiles = [];
    this.complaintForm.patchValue({ priority: 'medium' });
    this.checkFilled();
  }

  markFormGroupTouched(): void {
    Object.keys(this.complaintForm.controls).forEach((key) => {
      const control = this.complaintForm.get(key);
      if (control) {
        control.markAsTouched();
      }
    });
  }

  // File Upload Methods
  triggerFileInput(): void {
    this.fileInput.nativeElement.click();
  }

  onFileSelected(event: any): void {
    const files = Array.from(event.target.files) as File[];
    this.processFiles(files);
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
  }

  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();

    const files = Array.from(event.dataTransfer?.files || []) as File[];
    this.processFiles(files);
  }

  processFiles(files: File[]): void {
    files.forEach((file) => {
      if (this.isValidFile(file)) {
        const reader = new FileReader();
        reader.onload = (e) => {
          this.uploadedFiles.push({
            file: file,
            name: file.name,
            preview: e.target?.result as string,
          });
        };
        reader.readAsDataURL(file);
      }
    });
  }

  isValidFile(file: File): boolean {
    const validTypes = ['image/jpeg', 'image/png', 'image/gif'];
    const maxSize = 5 * 1024 * 1024; // 5MB

    if (!validTypes.includes(file.type)) {
      this.toastr.error(`${file.name} is not a valid image format`);
      return false;
    }

    if (file.size > maxSize) {
      this.toastr.error(`${file.name} is too large. Maximum size is 5MB`);
      return false;
    }

    return true;
  }

  removeFile(index: number): void {
    this.uploadedFiles.splice(index, 1);
  }
}
