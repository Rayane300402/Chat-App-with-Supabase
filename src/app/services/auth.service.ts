import {  Injectable, NgZone, inject } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from '../../environments/environment.development';
import{ Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private supabase!: SupabaseClient;

  private router = inject(Router);
  private _ngZone = inject(NgZone);

  constructor() {
    this.supabase = createClient(environment.supabaseUrl, environment.supabaseKey);

    this.supabase.auth.onAuthStateChange((event, session) => {
      console.log("event: ", event);
      console.log("session: ", session);

      localStorage.setItem('session', JSON.stringify(session?.user)); // store the session in the local storage

      // create a condition that if the user exists, navigate to the chat page
      if(session?.user){
        this._ngZone.run(() => { // run the navigation in the ngZone to avoid the error of the navigation outside the angular zone
          this.router.navigate(['/chat']);
        });
      }
    })
   }


  // constructor() {
  //   this.supabase = createClient(environment.supabaseUrl, environment.supabaseKey);

  //   this.supabase.auth.onAuthStateChange(async (event, session) => {
  //     console.log("event: ", event);
  //     console.log("session: ", session);

  //     if (session?.user) {
  //       localStorage.setItem('session', JSON.stringify(session.user));
  //       this.router.navigate(['/chat']);
  //     } else {
  //       localStorage.removeItem('session');
  //       this.router.navigate(['/login']);
  //     }
  //   });

  //   this.initializeSession();
  // }

  // private async initializeSession() {
  //   const { data: { session } } = await this.supabase.auth.getSession();
  //   if (session?.user) {
  //     localStorage.setItem('session', JSON.stringify(session.user));
  //   } else {
  //     localStorage.removeItem('session');
  //   }
  // }



// auth.service.ts
  get isLoggedIn(): boolean {
    const session = localStorage.getItem('session');
    if (!session) {
      return false;
    }
    try {
      const user = JSON.parse(session);
      return !!user;
    } catch {
      return false;
    }
  }


   async signInWithGoogle() {
     await this.supabase.auth.signInWithOAuth({
      provider: 'google', // this is to show which type of service we are using from supabase, if we are using google, we will use google, if we are using facebook, we will use facebook....
     });
   }

   async signOut() {
      await this.supabase.auth.signOut(); // clear the session, the local storage and the cookies
   }
   


}
