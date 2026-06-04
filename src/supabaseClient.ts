import { createClient } from '@supabase/supabase-js';

// Vervang de teksten hieronder door jouw gegevens uit het Supabase-scherm
const supabaseUrl = 'https://dniwiexpymmndxmtuoih.supabase.co';
const supabaseAnonKey = 'sb_publishable_vaNYXYGo-yEBvsMszecZdw_HdpuFi_E';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
