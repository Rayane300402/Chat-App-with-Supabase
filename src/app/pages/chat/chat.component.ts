import { Component, inject } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { Form, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ChatService } from '../../supabase/chat.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  imports: [ReactiveFormsModule],
  standalone: true,
  styleUrl: './chat.component.css'
})
export class ChatComponent {
  private auth = inject(AuthService);
  private chat_service = inject(ChatService);
  private router = inject(Router);
  chatForm!: FormGroup;
  private fb = inject(FormBuilder); // we are using form builder to create the form group

  constructor() {
    this.chatForm = this.fb.group({
      chat_message: ['', Validators.required]
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
    }).catch((error) => {
      alert( error.message);
    });

  }

}
