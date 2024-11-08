import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../Services/auth.service';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss',
})
export class SignupComponent {
  registerForm!: FormGroup;
  constructor(fb: FormBuilder, private authService: AuthService,private router:Router) {
    this.registerForm = fb.group({
      displayName: ['', Validators.required],
      email: ['', Validators.required],
      password: ['', Validators.required],
    });
  }
  onRegister() {
    const { displayName, email, password } = this.registerForm.value;
    this.authService.signup(email,password,displayName).subscribe({
      next:()=>{
        console.log('User created'),
        this.router.navigate(['/signin'])
      },error:(e)=>{
        console.error(e)
      }
    })
  }
}
