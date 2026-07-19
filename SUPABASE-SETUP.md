# Supabase Setup Instructions

## 1. Run the SQL Script

You need to run the SQL script in your Supabase dashboard to create the messages table:

1. Go to your Supabase dashboard: https://supabase.com/dashboard
2. Select your project: `hovrjuithtnfdltlnzdt`
3. Go to **SQL Editor** in the sidebar
4. Click **New query**
5. Copy and paste the contents of `supabase-setup.sql` file
6. Click **Run** to execute the script

## 2. Update Environment Variables (Optional)

For better security, you should use environment variables instead of hardcoding the Supabase credentials:

1. Create a `.env.local` file in your project root
2. Add the following:
```
VITE_SUPABASE_URL=https://hovrjuithtnfdltlnzdt.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhvdnJqdWl0aHRuZmRsdGxuemR0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ5ODQ4MDIsImV4cCI6MjA2MDU2MDgwMn0.4YqH_5F3Z2v8l3x9W7k4m3n2o1p6q8r7s9t2u3v4w5x
```

3. Update `src/lib/supabase.ts` to use environment variables:
```typescript
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseKey)
```

## 3. Test the System

Once you've run the SQL script, the contact form will work with the real database:

1. Start your development server
2. Go to the Contact Us page
3. Fill out and submit the form
4. Go to the admin panel (/admin)
5. Check the Messages tab to see the submitted message

## Features Now Available

### Contact Form Improvements
- **Real-time validation**: Checks for empty fields, phone length, message length
- **Spam protection**: Prevents multiple submissions
- **Error handling**: Shows user-friendly error messages
- **Success feedback**: Confirms when message is sent

### Admin Panel Features
- **Live updates**: Messages appear instantly from any device
- **Cross-device sync**: Works on any browser/device
- **Message management**: Mark as read, delete messages
- **Unread indicators**: Visual badges for new messages
- **Proper sorting**: Newest messages first

### Database Structure
```sql
messages table:
- id (UUID, primary key)
- name (TEXT)
- phone (TEXT) 
- message (TEXT)
- status ('new' or 'read')
- created_at (timestamp)
- updated_at (timestamp)
```

## Security Notes

The current setup uses the anonymous key which allows:
- Anyone to insert messages (required for contact form)
- Anyone to read messages (simplifies admin access)

For production, you might want to:
1. Use Row Level Security (RLS) policies for admin-only access
2. Implement authentication for the admin panel
3. Add rate limiting to prevent spam

## Next Steps (Optional)

Once this is working, you can add:
- Email notifications for new messages
- WhatsApp API integration
- Real-time updates using Supabase subscriptions
- Advanced spam protection
- Message categorization/tags
