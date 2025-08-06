import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-change-password',
  imports: [ReactiveFormsModule, FormsModule,CommonModule],
  templateUrl: './change-password.component.html',
  styleUrl: './change-password.component.css'
})
export class ChangePasswordComponent {
  changePasswordForm!:FormGroup;
  successMessage:string='';
  errorMessage:string='';

  constructor(private fb:FormBuilder,
    private authService:AuthService,
    private router:Router
  ){
    this.changePasswordForm = this.fb.group({
      old_password : ['', Validators.required],
      new_password:['', [Validators.required, Validators.minLength(6)]],
      confirm_password:['', Validators.required]
    },{
      validators:this.passwordMatchValidator
    })
  }

  passwordMatchValidator(form: FormGroup){
    const new_password = form.get('new_password')?.value
    const confirm_password = form.get('confirm_password')?.value
    return new_password === confirm_password?null:{mismatch:true}
  }

  onSubmit(){
    if(this.changePasswordForm.invalid){
      this.errorMessage = 'Please fix the errors in the form.';
      return;
    }
    const {old_password,new_password,confirm_password} = this.changePasswordForm.value;

    this.authService.changepassword(old_password,new_password,confirm_password).subscribe({
      next:(res)=>{
        this.successMessage = "Password Changed Successfully"
        this.errorMessage = "";
        this.changePasswordForm.reset();

        setTimeout(()=>{
          this.router.navigate(['/profile']);
        },2000)
      },
      error:(err)=>{
        this.errorMessage = err.error?.message || 'Failed to change password.';
        this.successMessage = '';
      }
    })
  }
}
