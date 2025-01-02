import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private supabase!: SupabaseClient;

  constructor() {
    this.supabase = createClient(environment.supabaseUrl, environment.supabaseKey);

    this.supabase.auth.onAuthStateChange((event, session) => {
      console.log("event: ", event);
      console.log("session: ", session);
    })
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
