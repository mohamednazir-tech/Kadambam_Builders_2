# About Page Database Setup Guide

## Overview
The Edit About page now works with Supabase database instead of localStorage, just like the Edit Guide page.

## 🚀 Setup Instructions

### Step 1: Create Database Table
Run the SQL in `setup-about-table.sql` in your Supabase SQL Editor:

```sql
-- This creates the about_content table with:
-- - Proper RLS policies
-- - Default content
-- - Auto-updating timestamps
-- - UUID primary key
```

### Step 2: Verify Table Creation
After running the SQL, verify the table was created:

```sql
SELECT * FROM about_content LIMIT 1;
```

### Step 3: Test the Edit Page
1. Start dev server: `npm run dev`
2. Go to: `http://localhost:5173/admin/edit-about`
3. Login with admin credentials
4. Edit content and save

## 📋 Database Schema

### Table: `about_content`
```sql
CREATE TABLE about_content (
  id UUID PRIMARY KEY,                    -- Auto-generated UUID
  title TEXT NOT NULL,                     -- Page title
  description TEXT NOT NULL,              -- Main description
  mission_title TEXT NOT NULL,            -- Mission section title
  mission_description TEXT NOT NULL,      -- Mission description
  vision_title TEXT NOT NULL,             -- Vision section title
  vision_description TEXT NOT NULL,       -- Vision description
  created_at TIMESTAMPTZ,                 -- Creation timestamp
  updated_at TIMESTAMPTZ                  -- Last update timestamp
);
```

### RLS Policies
- **Public Read**: Anyone can view about content
- **Authenticated Update**: Admin users can edit content
- **Authenticated Insert**: Admin users can create content

## 🎯 Features

### Database Integration
- ✅ **Real-time updates** across all users
- ✅ **Persistent storage** (no localStorage)
- ✅ **Automatic timestamps** (created_at, updated_at)
- ✅ **Single record** design (one about page)

### Editor Features
- ✅ **Live preview mode**
- ✅ **Save to database**
- ✅ **Reset to default**
- ✅ **Loading states**
- ✅ **Error handling**

### Frontend Integration
- ✅ **Dynamic content loading**
- ✅ **Fallback to default content**
- ✅ **Real-time updates** after save
- ✅ **Consistent UI** with other admin pages

## 🔧 How It Works

### EditAboutPage (`/admin/edit-about`)
1. **Loads content** from database on mount
2. **Shows loading state** while fetching
3. **Allows editing** all about sections
4. **Saves to database** with timestamps
5. **Provides preview** of changes

### AboutSection Component
1. **Loads content** from database on mount
2. **Shows default content** if database empty
3. **Updates automatically** when database changes
4. **Handles errors** gracefully

### Database Service (`/src/lib/about.ts`)
- `getAboutContent()` - Fetch current about content
- `updateAboutContent()` - Update existing content
- `createAboutContent()` - Create new content
- `defaultAboutContent` - Fallback default content

## 🚀 Usage

### Access the Editor
1. **Login**: `/admin`
2. **Navigate**: Click "Edit About" in sidebar
3. **Edit**: Modify title, description, mission, vision
4. **Preview**: Click "Preview" to see changes
5. **Save**: Click "Save Changes" to update database

### Content Sections
- **Title**: "About Kadambam Builders"
- **Description**: Company overview paragraph
- **Mission Title**: "Our Mission"
- **Mission Description**: Mission statement
- **Vision Title**: "Our Vision"
- **Vision Description**: Vision statement

## 🔄 Migration from localStorage

If you have existing localStorage content:
1. **Copy content** from localStorage `aboutContent`
2. **Paste into editor** and save
3. **Clear localStorage** (optional)

## 🛠️ Troubleshooting

### Common Issues
- **401/403 errors**: Check RLS policies
- **No content**: Run setup SQL to insert default
- **Save fails**: Check database connection
- **Preview not working**: Check field names

### Debug Steps
1. **Check console** for errors
2. **Verify table exists**: `SELECT * FROM about_content`
3. **Check RLS policies**: `SELECT * FROM pg_policies WHERE tablename = 'about_content'`
4. **Test API**: Try manual SQL updates

## 📱 Benefits

### vs localStorage
- ✅ **Multi-user sync** - All users see same content
- ✅ **Persistent** - Survives browser clears
- ✅ **Scalable** - Works across devices
- ✅ **Professional** - Production-ready

### vs Hardcoded
- ✅ **Editable** - Admin can update content
- ✅ **Dynamic** - Changes without deployment
- ✅ **Managed** - Centralized content control
- ✅ **Versioned** - Track changes over time

## 🎉 Ready to Use!

The Edit About page is now fully integrated with Supabase database and works exactly like the Edit Guide page.

**Access it now at:** `/admin/edit-about`
