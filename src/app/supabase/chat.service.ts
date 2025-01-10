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

  /*
    Uploads a single image file to the "chat-uploads" bucket
  */
  async uploadImage(file: File): Promise<string | null> {
    try {
      // Generate a unique filename (e.g., fileName_timestamp)
      const fileName = `${Date.now()}_${file.name}`;

      // Upload
      const { data, error } = await this.supabase.storage
        .from('chat-uploads')
        .upload(fileName, file);

      if (error) {
        console.error(error);
        return null;
      }

      // If your bucket is public, you can get the public URL as follows:
      const { data: publicUrlData } = this.supabase
        .storage
        .from('chat-uploads')
        .getPublicUrl(fileName);

      if (!publicUrlData?.publicUrl) {
        console.error("Couldn't get public URL from Supabase!");
        return null;
      }

      return publicUrlData.publicUrl;
    } catch (error: any) {
      console.error(error);
      return null;
    }
  }


  /*
   Insert a message into the chat table
   - text: for normal text
   - imageUrl: for image messages (optional)
 */

  async chatMessage(text: string, imageUrl?: string) {
    try {
      const { data, error } = await this.supabase.from('chat').insert([
        {
          text,
          image_url: imageUrl ?? null
        }
      ]);
      if (error) {
        alert(error.message);
      }
      console.log('chatMessage -> data', data);
    } catch (error: any) {
      alert(error);
    }
  }

  async listChat() {
    try {
      const { data, error } = await this.supabase.from('chat').select('*, users(*)'); // we are selecting all the columns from the chat table from all the authenticated users
      if (error) {
        alert(error.message);
      }
      console.log('data', data);
      return data;
    } catch (error) {
      alert(error);
      return null;
    }
  }

  async deleteChat(id: string) {
    try {
      const data = await this.supabase.from('chat').delete().eq('id', id);

      return data;
    } catch (error) {
      alert(error);
      return null;
    }
  }


  selectedChat(msg: Ichat) {
    this.savedChat.set(msg);
  }

  async updateChat(id: string, text: string) {
    try {
      const { data, error } = await this.supabase.from('chat').update({
        text: text,
        editable: 'true'
      }).eq('id', id);
      if (error) {
        throw error;
      }
      return data;
    } catch (error) {
      alert(error);
      return null;
    }
  }


}
