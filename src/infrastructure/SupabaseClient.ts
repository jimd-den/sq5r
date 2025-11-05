// ═══════════════════════════════════════════════════════════════
// LAYER 4: Infrastructure (Technical implementation details)
// ═══════════════════════════════════════════════════════════════

import { createClient, SupabaseClient as Client } from '@supabase/supabase-js';

/**
 * Responsible for: Creating and managing the Supabase client connection.
 * Single Responsibility: Singleton management of the database connection.
 */
class SupabaseClientManager {
  private static instance: Client | null = null;

  static get_client(): Client {
    if (!this.instance) {
      const supabase_url = import.meta.env.VITE_SUPABASE_URL;
      const supabase_key = import.meta.env.VITE_SUPABASE_ANON_KEY;

      if (!supabase_url || !supabase_key) {
        throw new Error('Supabase configuration missing');
      }

      this.instance = createClient(supabase_url, supabase_key);
    }

    return this.instance;
  }
}

export const supabase_client = SupabaseClientManager.get_client();
