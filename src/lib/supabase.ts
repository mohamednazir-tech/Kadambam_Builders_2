import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://hovrjuithtnfdltlnzdt.supabase.co'
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhvdnJqdWl0aHRuZmRsdGxuemR0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ5ODQ4MDIsImV4cCI6MjA2MDU2MDgwMn0.4YqH_5F3Z2v8l3x9W7k4m3n2o1p6q8r7s9t2u3v4w5x'

export const supabase = createClient(supabaseUrl, supabaseKey)
