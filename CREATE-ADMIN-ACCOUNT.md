# Create Admin Account (Manual Setup)

Since you removed the signup option, you'll need to create admin accounts manually in Supabase.

## Method 1: Using Supabase Dashboard (Easiest)

### Step 1: Create User in Authentication
1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project (`hovrjuithn...`)
3. Go to **Authentication** -> **Users**
4. Click **"Add user"**
5. Enter:
   - **Email**: `admin@yourdomain.com` (your admin email)
   - **Password**: Your secure password
   - **Email confirmed**: Check this box
6. Click **"Save"**

### Step 2: Add to Admin Users Table
1. Go to **Table Editor** -> **admin_users**
2. Click **"Insert row"**
3. Enter:
   - **id**: Copy the user ID from Authentication users table
   - **email**: Same email as above
   - **role**: `admin` (or `super_admin` for full access)
4. Click **"Save"`

## Method 2: Using SQL (Advanced)

Run this in Supabase SQL Editor:

```sql
-- First, create a user (replace with your details)
INSERT INTO auth.users (
  instance_id,
  email,
  email_confirmed_at,
  phone,
  phone_confirmed_at,
  created_at,
  updated_at,
  role,
  aud
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  'admin@yourdomain.com',
  NOW(),
  NULL,
  NULL,
  NOW(),
  NOW(),
  'authenticated',
  'authenticated'
) RETURNING id;

-- Then add to admin_users (use the returned ID)
INSERT INTO admin_users (id, email, role)
VALUES ('USER_ID_FROM_ABOVE', 'admin@yourdomain.com', 'admin');
```

## Method 3: Quick SQL (Simpler)

If you already have a user in Authentication:

```sql
-- Add existing user to admin table
INSERT INTO admin_users (id, email, role)
SELECT id, email, 'admin'
FROM auth.users
WHERE email = 'admin@yourdomain.com';
```

## Test Your Admin Account

1. Go to your website: `/admin`
2. Enter your admin email and password
3. Should successfully log in to the admin dashboard

## Admin Roles

- **`admin`**: Can read and manage messages
- **`super_admin`**: Can do everything + manage other admin users

## Security Notes

- **Disable public sign-up**: In Supabase Auth settings, turn off "Enable email signups"
- **Use strong passwords**: Admin accounts have full access
- **Keep credentials safe**: Don't share admin login details

That's it! Your admin login is now ready to use.
