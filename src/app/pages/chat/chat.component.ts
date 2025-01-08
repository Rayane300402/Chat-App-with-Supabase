import { Component, inject } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  standalone: true,
  styleUrl: './chat.component.css'
})
export class ChatComponent {
  private auth = inject(AuthService);
  private router = inject(Router);

  async logOut(){
    await this.auth.signOut().then(() => {
      console.log("User logged out");
      this.router.navigate(['/login']);
    }).catch((error) => {
      console.log("Error logging out: ", error);
    });
  }

}
