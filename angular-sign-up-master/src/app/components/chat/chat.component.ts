import { Component, OnInit, OnDestroy, ViewChild, ElementRef, AfterViewInit, OnChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UsersService } from '../../services/users.service';
import { AuthService } from '../../services/auth.service';
import { IChatMessage } from '../../models/ichat-message';
import { Observable, Subscription, take } from 'rxjs';
import { ProfileUser } from '../../models/user';
import { Timestamp } from '@angular/fire/firestore';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit, OnDestroy,AfterViewInit,OnChanges {
  messageForm: FormGroup;
  messages: IChatMessage[] = [];
  currentUser$: Observable<ProfileUser | null>;
  selectedUser: ProfileUser | null = null;
  users: ProfileUser[] = [];
  userType: string = '';
  private subscriptions: Subscription[] = [];

  constructor(
    private fb: FormBuilder,
    private usersService: UsersService,
    private authService: AuthService
  ) {
    this.messageForm = this.fb.group({
      message: ['', Validators.required]
    });
    this.currentUser$ = this.usersService.currentUserProfile$;
  }
@ViewChild('scrollContainer') private scrollContainer!: ElementRef;

scrollToBottom(): void {
  setTimeout(() => {
    this.scrollContainer.nativeElement.scrollTop = this.scrollContainer.nativeElement.scrollHeight;
  }, 100);
}

ngAfterViewInit() {
  this.scrollToBottom();
}

ngOnChanges() {
  this.scrollToBottom();
}

  ngOnInit(): void {
    const userSub = this.currentUser$.subscribe(user => {
      console.log(user)
      if (user) {
        this.userType = user.userCategory || '';
        this.loadUsers(user.uid);
      }
    });
    this.subscriptions.push(userSub);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  loadUsers(id:string) {
    const usersSub = this.usersService.getAllUsers().subscribe(users => {
      // if (this.userType === '4') {
      //   // المعلم يرى فقط الطلاب
      //   this.users = users.filter(user => user.userCategory === '3');
      // } else if (this.userType === '3') {
      //   // الطالب يرى فقط المعلمين
      //   this.users = users.filter(user => user.userCategory === '4');
      // }
      this.users = users.filter(user => user.uid != id);
    });
    this.subscriptions.push(usersSub);
  }

  selectUser(user: ProfileUser) {
    this.selectedUser = user;
    this.loadMessages();
  }

  loadMessages() {
    if (!this.selectedUser) return;
    
    // إلغاء الاشتراك السابق في الرسائل إن وجد
    this.subscriptions.forEach(sub => sub.unsubscribe());
    this.subscriptions = [];

    const messageSub = this.currentUser$.pipe(take(1)).subscribe(currentUser => {
      if (currentUser && this.selectedUser) {
        const chatSub = this.usersService.getChatMessages(currentUser.uid, this.selectedUser.uid)
          .subscribe(messages => {
            this.messages = messages.sort((a, b) => {
              const timeA = (a.timestamp as any)?.seconds || 0;
              const timeB = (b.timestamp as any)?.seconds || 0;
              return timeA - timeB;
            });
          });
        this.subscriptions.push(chatSub);
      }
    });
    this.subscriptions.push(messageSub);
  }

  sendMessage() {
    if (this.messageForm.invalid || !this.selectedUser) return;

    this.currentUser$.pipe(take(1)).subscribe(currentUser => {
      if (currentUser) {
        const newMessage: IChatMessage = {
          senderId: currentUser.uid,
          senderName: currentUser.displayName || '',
          receiverId: this.selectedUser!.uid,
          receiverName: this.selectedUser!.displayName || '',
          message: this.messageForm.value.message,
          timestamp: Timestamp.now()
          
        };

        this.usersService.sendMessage(newMessage).pipe(take(1)).subscribe(() => {
          this.messageForm.reset();
    this.scrollToBottom();
        });
      }
    });
  }
} 