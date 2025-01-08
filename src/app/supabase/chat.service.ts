import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
   private supabase!: SupabaseClient;

    constructor() {
      this.supabase = createClient(environment.supabaseUrl, environment.supabaseKey);
    }


    async chatMessage(text: string) {
      try {
        const { data, error } = await this.supabase.from('chat').insert([
          { text }
        ]);
        if (error) {
          console.error('error', error);
        }
        console.log('data', data);

        return data
      } catch (error) {
        alert(error);
        return null;
      }

    }

}
