import { Component, effect, inject, signal } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { Form, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ChatService } from '../../supabase/chat.service';
import { Ichat } from '../../interface/chat-response';
import { CommonModule, DatePipe } from '@angular/common';
import { DeleteModalComponent } from "../../layout/delete-modal/delete-modal.component";

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  imports: [ReactiveFormsModule, DatePipe, DeleteModalComponent, CommonModule],
  standalone: true,
  styleUrl: './chat.component.css'
})
export class ChatComponent {
  private auth = inject(AuthService);
  private chat_service = inject(ChatService);
  private router = inject(Router);
  private fb = inject(FormBuilder); // we are using form builder to create the form group

  chats = signal<Ichat[]>([]);

  chatForm!: FormGroup;

  // For editing existing messages:
  editingChatId = signal<string | null>(null);
  editingChatForm = signal<FormGroup | null>(null);

  constructor() {
    this.chatForm = this.fb.group({
      chat_message: ['', Validators.required]
    });

    effect(() => {
      this.onListChat();
    });

  }

  async logOut() {
    await this.auth.signOut().then(() => {
      console.log("User logged out");
      this.router.navigate(['/login']);
    }).catch((error) => {
      console.log("Error logging out: ", error);
    });
  }

  onSubmit() {
    const formValue = this.chatForm.value.chat_message;
    console.log(formValue);

    this.chat_service.chatMessage(formValue).then((res) => {
      console.log("Message sent: ", res);
      this.chatForm.reset();
      this.onListChat();
    }).catch((error) => {
      if (error instanceof Error) {
        alert(error.message);
      } else {
        alert('An unknown error occurred');
      }
    });

  }

  onListChat() {
    this.chat_service.listChat().then((res) => {
      console.log("Chat list: ", res);
      if (res) {
        this.chats.set(res);
      } else {
        console.error("Received null response for chat list");
      }
    }).catch((error) => {
      alert(error.message);
    });
  }

  openDropDown(msg: Ichat) {
    console.log("Message: ", msg);
    this.chat_service.selectedChat(msg);
  }


  startEditingChat(msg: Ichat) {
    const editForm = this.fb.group({
      edited_message: [msg.text, Validators.required]
    });
    this.editingChatId.set(msg.id);
    this.editingChatForm.set(editForm);
  }


  cancelEditing() {
    this.editingChatId.set(null);
    this.editingChatForm.set(null);
  }

  async saveEditedMessage(msg:Ichat){
    const editedText = this.editingChatForm()?.value.edited_message;
    if(!editedText){
      alert("Message cannot be empty");
      return;
    }

    try{

      await this.chat_service.updateChat(msg.id, editedText);
      this.onListChat();

    } catch(error){
      if (error instanceof Error) {
        alert(error.message);
      } else {
        alert('An unknown error occurred');
      }
    }

    this.editingChatId.set(null);
    this.editingChatForm.set(null);

  }

}
