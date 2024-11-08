import { ChangeDetectorRef, Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { ActivatedRoute, Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from '../../Services/auth.service';
import { DropdownComponent } from '../../Components/dropdown/dropdown.component';
import { ChatService } from '../../Services/chat.service';
import { CustomDatePipe } from '../../Pipes/custom-date.pipe';
import { Chat } from '../../Interfaces/chat';
import { User } from '../../Interfaces/user';
import { UserService } from '../../Services/user.service';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs';

@Component({
  selector: 'app-chats',
  standalone: true,
  imports: [
    RouterOutlet,
    DropdownComponent,
    RouterLink,
    RouterLinkActive,
    CustomDatePipe,
    ReactiveFormsModule,
  ],
  templateUrl: './chats.component.html',
  styleUrl: './chats.component.scss',
})
export class ChatsComponent {
  show: boolean = false;
  chats: Chat[] = [];
  currentUser!: User;
  users!: User[];
  searchValue = new FormControl('');
  @ViewChild('dropdown') dropdown: ElementRef | undefined;
  @HostListener('document:click', ['$event.target'])
  onClickOutside(targetElement: HTMLElement) {
    if (
      this.show &&
      this.dropdown &&
      !this.dropdown.nativeElement.contains(targetElement)
    ) {
      this.show = false;
    }
  }

  constructor(

    private chatService: ChatService,
    private userService: UserService,
    private router:Router,

  ) {

  }
  ngOnInit(): void {

    this.loadUserChats();
    this.getCurrentUser();
    this.searchValue.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        switchMap((value) => this.userService.searchUser(value!)) // No inner subscribe here
      )
      .subscribe({
        next: (v: User[] | any) => {
          this.users = v;
          console.log(v);
        },
        error: (err) => console.error(err),
      });

  }

  loadUserChats() {
    this.chatService.getAllChats().subscribe({
      next: (chats: any) => {
        this.chats = chats;

      },
    });
  }

  getCurrentUser() {
    this.userService.getCurrentUser().subscribe((user: any) => {
      this.currentUser = user;
      console.log(user);
    });
  }
  createNewChat(receiverData: any) {
    this.chatService.createChat(receiverData).subscribe({
      next: () => {
        console.log('chat created successfully');
        this.searchValue.reset();
      },
    });
  }

}
