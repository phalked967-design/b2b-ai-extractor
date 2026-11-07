import { createClient } from '@supabase/supabase-js';
export const supabase = createClient(
  "https://supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZjZG9qZGVycWR0c25obmJ2ZWFzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc4MTkyOTUsImV4cCI6MjA5MzM5NTI5NX0.7E0pXy6yD7m39E6Lq9w8xX5F2V8d4z1m9q7w5X4y3zI"
);
