import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://cxayrkozrivicvmbztqo.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN4YXlya296cml2aWN2bWJ6dHFvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI4ODA5NzIsImV4cCI6MjA4ODQ1Njk3Mn0.kno83Fht9EAohF6a3aLQhN4U59Ov8nrfsgRTUo0KKrA";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
