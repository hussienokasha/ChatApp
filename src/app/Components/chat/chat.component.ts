import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  ViewChild,
} from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { MessageService } from '../../Services/message.service';
import { ActivatedRoute } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { ChatService } from '../../Services/chat.service';
import { UserService } from '../../Services/user.service';
import { Message } from '../../Interfaces/message';
import { User } from '../../Interfaces/user';
import { Chat } from '../../Interfaces/chat';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.scss',
})
export class ChatComponent {
  @ViewChild('messagesContainer') messagesContainer!: ElementRef;
  showDelete: boolean = false;
  receiverData!: Chat;
  messages: Message[] = [];
  message = new FormControl('', Validators.required);
  userData!: User;
  chatId: string = '';

  constructor(
    private messageService: MessageService,
    private activatedRoute: ActivatedRoute,
    private chatService: ChatService,
    private userService: UserService,
    private route: ActivatedRoute
  ) {
   route.params.subscribe({
    next:()=>{
      this.chatId = this.route.snapshot.paramMap.get('id') as string;
      this.loadMessages();
      this.getChatDetails();
    }
   })
  }
  ngOnInit(): void {
    this.chatId = this.activatedRoute.snapshot.params['id']!;
    this.loadMessages();
    this.getChatDetails();
    this.getUserData();
  }
  sendMessage() {
    if (this.userData?.uid == this.receiverData?.users[0].uid) {
      this.messageService
        .sendMessage(
          this.message.value!,
          this.receiverData?.users[1].uid!,
          this.chatId
        )
        .then(() => {
          this.message.reset();
          this.scrollToBottom();
        });
    } else {
      this.messageService
        .sendMessage(
          this.message.value!,
          this.receiverData?.users[0].uid!,
          this.chatId
        )
        .then(() => {
          this.message.reset();
          this.scrollToBottom();
        });
    }
  }

  loadMessages() {
    this.messageService
      .loadMessages(this.chatId)
      .subscribe((messages: any[]) => {
        this.messages = messages;
        this.scrollToBottom();
      });
  }

  scrollToBottom() {
    const container = this.messagesContainer.nativeElement;
    container.scrollTop = container.scrollHeight;
  }
  deleteMessage(mId: string) {
    this.messageService.deleteMessage(mId, this.chatId).then(() => {
      this.showDelete = false;
    });
  }

  getChatDetails() {
    this.chatService.getChatById(this.chatId).subscribe({
      next: (c: any) => {
        this.receiverData = c;
      },
    });
  }
  getUserData() {
    this.userService.getCurrentUser().subscribe({
      next: (user: any) => {
        this.userData = user;
      },
    });
  }
}
