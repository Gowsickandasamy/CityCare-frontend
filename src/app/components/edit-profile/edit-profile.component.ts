import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-edit-profile',
  imports: [ReactiveFormsModule, CommonModule, RouterLink],
  templateUrl: './edit-profile.component.html',
  styleUrl: './edit-profile.component.css'
})
export class EditProfileComponent implements OnInit{
  profileForm!:FormGroup
  loading = true;

  constructor(private fb:FormBuilder, private authService:AuthService){

  }

  get username(): string {
  return this.profileForm?.get('username')?.value || '';
}
  ngOnInit():void{
    this.loading = false
    this.profileForm = this.fb.group({
      username:['',Validators.required],
      email:['',Validators.required],
      phone_number:['',Validators.required]
    });
    
    this.loadUserProfile()

  }

  loadUserProfile(){
    this.authService.getUserInfo().subscribe({
      next:(user)=>{
        this.profileForm.patchValue(user)
        this.loading = false
      },
      error:(err)=>{
        console.error("Something went wrong",err)
        this.loading = false
      }
    })
  }

  onSubmit(){
    if(this.profileForm.valid){
      this.authService.updateUserProfile(this.profileForm.value).subscribe({
        next:()=> alert('Profile updated successfully'),
        error:()=>alert('Error updating profile')
      })
    }  
  }

}
