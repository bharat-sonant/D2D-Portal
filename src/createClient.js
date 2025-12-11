import { createClient } from "@supabase/supabase-js";


export const supabase= createClient(
    "https://hykirowrddtvnbgpqxet.supabase.co",
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh5a2lyb3dyZGR0dm5iZ3BxeGV0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU0MzMzMjUsImV4cCI6MjA4MTAwOTMyNX0.ArmtqUkH3EVSfraoey_Qab_xgUCoCjFmtqdnjW1Rl_I")