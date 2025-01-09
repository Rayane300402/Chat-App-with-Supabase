import { Component, effect, inject, signal } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { Form, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ChatService } from '../../supabase/chat.service';
import { Ichat } from '../../interface/chat-response';
import { DatePipe } from '@angular/common';
import { DeleteModalComponent } from "../../layout/delete-modal/delete-modal.component";

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  imports: [ReactiveFormsModule, DatePipe, DeleteModalComponent],
  standalone: true,
  styleUrl: './chat.component.css'
})
export class ChatComponent {
  private auth = inject(AuthService);
  private chat_service = inject(ChatService);
  private router = inject(Router);
  chatForm!: FormGroup;
  private fb = inject(FormBuilder); // we are using form builder to create the form group

  chats = signal<Ichat[]>([]);

  constructor() {
    this.chatForm = this.fb.group({
      chat_message: ['', Validators.required]
    });

    effect(() => {
     this.onListChat();
    });

  }

  async logOut(){
    await this.auth.signOut().then(() => {
      console.log("User logged out");
      this.router.navigate(['/login']);
    }).catch((error) => {
      console.log("Error logging out: ", error);
    });
  }

  onSubmit(){
    const formValue = this.chatForm.value.chat_message;
    console.log(formValue);

    this.chat_service.chatMessage(formValue).then((res) => {
      console.log("Message sent: ", res);
      this.chatForm.reset();
      this.onListChat();
    }).catch((error) => {
      alert( error.message);
    });

  }

  onListChat(){
    this.chat_service.listChat().then((res) => {
      console.log("Chat list: ", res);
      if (res) {
        this.chats.set(res);
      } else {
        console.error("Received null response for chat list");
      }
    }).catch((error) => {
      alert( error.message);
    });
  }

  openDropDown(msg: Ichat){
    console.log("Message: ", msg);
    this.chat_service.selectedChat(msg);
  }

}
