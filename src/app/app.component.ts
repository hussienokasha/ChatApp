import { Component, computed } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { initFlowbite } from 'flowbite'
import { UserService } from './Services/user.service';
import { ChatService } from './Services/chat.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  constructor(private  userService:ChatService){}

  ngOnInit(): void {
  
  }

}
