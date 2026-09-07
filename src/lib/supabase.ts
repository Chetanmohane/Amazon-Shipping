import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Keys loaded from env or localStorage dynamically
const STORAGE_URL_KEY = 'amazon_supabase_url';
const STORAGE_ANON_KEY = 'amazon_supabase_anon_key';

export function getSupabaseCredentials() {
  const envUrl = import.meta.env.VITE_SUPABASE_URL || 'https://lmmpekheujhdmkneudzu.supabase.co';
  const envKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_XbfqCOfQMeMo6x5mOArJ0g_eTSicIQg';

  const storedUrl = localStorage.getItem(STORAGE_URL_KEY) || envUrl;
  const storedKey = localStorage.getItem(STORAGE_ANON_KEY) || envKey;

  return {
    url: storedUrl,
    anonKey: storedKey,
    hasCredentials: Boolean(storedUrl && storedKey && storedUrl.includes('supabase.co'))
  };
}

let supabaseInstance: SupabaseClient | null = null;

export function getSupabaseClient(): SupabaseClient | null {
  const { url, anonKey, hasCredentials } = getSupabaseCredentials();

  if (!hasCredentials) {
    return null;
  }

  if (!supabaseInstance) {
    try {
      supabaseInstance = createClient(url, anonKey, {
        auth: {
          persistSession: true,
          autoRefreshToken: true
        }
      });
    } catch (err) {
      console.warn('Failed to initialize Supabase client:', err);
      return null;
    }
  }

  return supabaseInstance;
}

export function saveSupabaseCredentials(url: string, anonKey: string) {
  if (url) localStorage.setItem(STORAGE_URL_KEY, url.trim());
  else localStorage.removeItem(STORAGE_URL_KEY);

  if (anonKey) localStorage.setItem(STORAGE_ANON_KEY, anonKey.trim());
  else localStorage.removeItem(STORAGE_ANON_KEY);

  supabaseInstance = null; // reset instance so next getSupabaseClient uses new keys
}

export async function testSupabaseConnection(url: string, anonKey: string): Promise<boolean> {
  if (!url || !anonKey) return false;
  try {
    const tempClient = createClient(url, anonKey);
    const { error } = await tempClient.from('shipments').select('count', { count: 'exact', head: true });
    return !error;
  } catch (e) {
    console.error('Supabase test connection failed:', e);
    return false;
  }
}
