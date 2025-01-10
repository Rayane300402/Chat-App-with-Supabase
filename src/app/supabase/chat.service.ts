import { Injectable, signal } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from '../../environments/environment.development';
import { Ichat } from '../interface/chat-response';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
   private supabase!: SupabaseClient;
   public savedChat = signal({});

    constructor() {
      this.supabase = createClient(environment.supabaseUrl, environment.supabaseKey);
    }


    async chatMessage(text: string) {
      try {
        const { data, error } = await this.supabase.from('chat').insert([
          { text }
        ]);
        if (error) {
          alert( error.message);
        }
        console.log('data', data);

        // return data
      } catch (error) {
        alert(error);
        // return null;
      }

    }

    async listChat(){
      try {
        const { data, error } = await this.supabase.from('chat').select('*, users(*)'); // we are selecting all the columns from the chat table from all the authenticated users
        if (error) {
          alert( error.message);
        }
        console.log('data', data);
        return data;
      } catch (error) {
        alert(error);
        return null;
      }
    }

    async deleteChat(id: string){
      try {
        const data = await this.supabase.from('chat').delete().eq('id', id);
      
        return data;
      } catch (error) {
        alert(error);
        return null;
      }
    }


    selectedChat(msg: Ichat){
      this.savedChat.set(msg);
    }

    async updateChat(id: string, text: string){
      try {
        const {data, error} = await this.supabase.from('chat').update({
          text: text,
          editable: 'true'
        }).eq('id', id);
        if(error){
          throw error;
        }
        return data;
      } catch (error) {
        alert(error);
        return null;
      }
    }


}
