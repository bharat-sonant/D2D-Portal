import { createClient } from "@supabase/supabase-js";


export const supabase= createClient(
    "https://qaqlxzjlhgmnuurmdasi.supabase.co",
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFhcWx4empsaGdtbnV1cm1kYXNpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU1MzAyMDMsImV4cCI6MjA4MTEwNjIwM30.ycC6uemznHsWAnOzH4Hge2M1Atj24z5OtKA8VFTrecM")