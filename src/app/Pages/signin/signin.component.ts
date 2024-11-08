import { Component } from '@angular/core';
import { Router, RouterLink, } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../Services/auth.service';
import { AngularFireAuth } from '@angular/fire/compat/auth';

@Component({
  selector: 'app-signin',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterLink],
  templateUrl: './signin.component.html',
  styleUrl: './signin.component.scss',
})
export class SigninComponent {
  isHidden: boolean = false;
  loginForm!: FormGroup;
  constructor(fb: FormBuilder, private authService: AuthService,private router:Router,) {
    this.loginForm = fb.group({
      email: ['',Validators.required],
      password: ['',Validators.required],
    });

    
  }


  login() {
    const { email, password } = this.loginForm.value;
    this.authService.signIn(email, password).subscribe({
      next:()=>{
        this.router.navigate(['/chats']);
      }
    });
  }
}
