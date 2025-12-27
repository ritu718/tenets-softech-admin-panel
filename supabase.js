import { createClient } from '@supabase/supabase-js';

const supabaseUrl = "https://evqiqvnkzkqapwwwqazs.supabase.co"; // <- deine URL
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV2cWp2cW5remtxYXB2d3dxYXpzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY5MDczNzEsImV4cCI6MjA3MjQ4MzM3MX0.ubtPrgWiqBCVU5pijPj0cwAIWNWbTMD0ahs3Y9SjlH0"; 

export const supabase = createClient(supabaseUrl, supabaseKey);