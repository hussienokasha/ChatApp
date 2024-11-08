import { Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { User } from '../../Interfaces/user';
import { UserService } from '../../Services/user.service';
import { Router } from '@angular/router';
import { AuthService } from '../../Services/auth.service';

@Component({
  selector: 'app-dropdown',
  standalone: true,
  imports: [],
  templateUrl: './dropdown.component.html',
  styleUrl: './dropdown.component.scss',
})
export class DropdownComponent {
  userData!: User | undefined;

  constructor(
    private user: UserService,
    private router: Router,
    private auth: AuthService
  ) {}
  ngOnInit(): void {
    this.getUserData();
  }

  getUserData() {
    this.user.getCurrentUser().subscribe({
      next: (u: User | undefined) => {
        this.userData = u;
      },
    });
  }
  logOut() {
    this.auth.signOut().subscribe({
      next: () => {
        this.router.navigate(['/signin']);
      },
    });
  }
}
