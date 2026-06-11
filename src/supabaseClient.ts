import { createClient } from '@supabase/supabase-js';

// Vervang de teksten hieronder door jouw gegevens uit het Supabase-scherm
const supabaseUrl = 'https://dniwiexpymmndxmtuoih.supabase.co';
const supabaseAnonKey = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRuaXdpZXhweW1tbmR4bXR1b2loIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA1ODkzMDUsImV4cCI6MjA5NjE2NTMwNX0.Zu3KqebQjWySP60HoSTR-MQhnjs1-kc-CkIQZMavHT4

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
