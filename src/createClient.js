import { createClient } from "@supabase/supabase-js";


export const supabase= createClient(
    "https://tayzauotsjxdgvfadcby.supabase.co",
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRheXphdW90c2p4ZGd2ZmFkY2J5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU1MzcwMzksImV4cCI6MjA4MTExMzAzOX0.LPufHiX8rNi05qIv0ji4YjAbn8ZW_dMaWJRP31JIcqQ")