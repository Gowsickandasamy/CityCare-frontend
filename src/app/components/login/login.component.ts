import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { RegisterComponent } from '../register/register.component';
import { ToastrService } from 'ngx-toastr';
import { timeout } from 'rxjs';

@Component({
  selector: 'app-login',
  imports: [CommonModule,ReactiveFormsModule,RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent implements OnInit{
  loginForm!: FormGroup;
  errorMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private toastr:ToastrService
  ) {}

  ngOnInit(): void {
      this.loginForm = this.fb.group({
        email:['',[Validators.required, Validators.email]],
        password:['',[Validators.required]]
      })
  }

  onSubmit():void{
    if(this.loginForm.valid){
      this.authService.login(this.loginForm.value).subscribe((res)=>{
        this.authService.saveTokens(res.access,res.refresh)
        this.toastr.success("Login Successfull",'',{timeOut:2000})
        this.router.navigate(['/home'])
      },
    (error)=>{
      this.errorMessage=error.error.message || "Invalid Login Credentials"
      this.toastr.error(this.errorMessage);
    })
    }
  }

}
