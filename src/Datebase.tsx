import { createClient } from "@supabase/supabase-js";

// Create a single supabase client for interacting with your database
export const supabase = createClient(
  "https://tyuefzvpxzscfzxfunbm.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR5dWVmenZweHpzY2Z6eGZ1bmJtIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NjIzNjY3NzAsImV4cCI6MTk3Nzk0Mjc3MH0.wh2eNZyArW44nANz7nzhz9ol3A8CdmJRm6qopRnUvsU"
);
