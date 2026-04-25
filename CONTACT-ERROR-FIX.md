# Contact 400 Error - Quick Fix Guide

## 🚨 **Error: Failed to load resource: the server responded with a status of 400 ()**

This error occurs when the `updateContactContent` function fails, usually because:

1. ❌ **Table doesn't exist**
2. ❌ **RLS policies blocking the request**
3. ❌ **Field name mismatches**
4. ❌ **Authentication issues**

## 🔧 **Step-by-Step Fix**

### **Step 1: Run the Contact Table Setup**
Execute `setup-contact-table.sql` in Supabase SQL Editor:

```sql
-- This creates the table with correct field names
CREATE TABLE IF NOT EXISTS contact_content (
  id TEXT PRIMARY KEY DEFAULT 'contact-page',
  address TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT NOT NULL,
  "mapEmbed" TEXT NOT NULL,      -- Note: quoted for camelCase
  "formTitle" TEXT NOT NULL,     -- Note: quoted for camelCase
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### **Step 2: Verify Table Exists**
Run this to check if the table was created:

```sql
SELECT * FROM contact_content WHERE id = 'contact-page';
```

Should return 1 row with default contact data.

### **Step 3: Check RLS Policies**
Verify policies are correctly set:

```sql
SELECT policyname, cmd, roles 
FROM pg_policies 
WHERE tablename = 'contact_content';
```

Should show:
- `"Public can read contact"` → `SELECT` → `anon`
- `"Authenticated can insert contact"` → `INSERT` → `authenticated`
- `"Authenticated can update contact"` → `UPDATE` → `authenticated`

### **Step 4: Test Database Connection**
Add this temporary debug code to your browser console:

```javascript
// Test if we can read contact data
supabase.from('contact_content').select('*').eq('id', 'contact-page').maybeSingle()
  .then(({ data, error }) => {
    console.log('Contact data:', data);
    console.log('Error:', error);
  });
```

### **Step 5: Test Update Operation**
Test the update directly:

```javascript
// Test update operation
supabase.from('contact_content').upsert([{
  id: 'contact-page',
  phone: '+91 63740 34451',
  updated_at: new Date().toISOString()
}]).select().single()
  .then(({ data, error }) => {
    console.log('Update result:', data);
    console.log('Update error:', error);
  });
```

## 🐛 **Common Issues & Solutions**

### **Issue 1: Table Doesn't Exist**
**Error:** `relation "contact_content" does not exist`

**Solution:** Run `setup-contact-table.sql` first.

### **Issue 2: RLS Policy Blocking**
**Error:** `new row violates row-level security policy`

**Solution:** Make sure you're logged in as admin when testing updates.

### **Issue 3: Field Name Mismatch**
**Error:** `column "mapembed" does not exist`

**Solution:** The table columns are now properly quoted: `"mapEmbed"`, `"formTitle"`

### **Issue 4: Authentication Required**
**Error:** `JWT expired` or `no rows returned`

**Solution:** Log in to admin panel before testing contact updates.

## 🔍 **Debug Steps**

### **1. Check Browser Console**
Look for detailed error messages:
```javascript
// Open browser console and check for:
// - Specific error details
// - Network request failures
// - Authentication status
```

### **2. Check Network Tab**
1. **Open DevTools** → Network tab
2. **Try to update contact** in admin panel
3. **Look for failed requests** to Supabase
4. **Check response details** for specific error

### **3. Verify Supabase Connection**
```javascript
// Test basic Supabase connection
console.log('Supabase client:', supabase);
console.log('Supabase URL:', supabase.supabaseUrl);
```

## 🚀 **Quick Test Sequence**

### **After Running Setup SQL:**

1. **Restart dev server**: `npm run dev`
2. **Go to admin**: `/admin/edit-contact`
3. **Check if data loads** (should show current contact info)
4. **Try to update phone number**
5. **Click Save**
6. **Check if error persists**

## 📋 **Expected Behavior After Fix**

### **✅ Working Correctly:**
- Contact page loads without errors
- Edit Contact page shows current data
- Phone number updates work
- Call and WhatsApp buttons reflect changes

### **❌ Still Broken:**
- 400 errors in console
- Contact data doesn't load
- Updates fail to save
- Buttons show old phone number

## 🎯 **If Still Failing**

### **Check These Items:**

1. **Supabase Configuration**:
   ```javascript
   // Check supabase.ts configuration
   console.log('Supabase config:', {
     url: supabase.supabaseUrl,
     anonKey: supabase.supabaseKey ? 'Set' : 'Missing'
   });
   ```

2. **Authentication Status**:
   ```javascript
   // Check if user is authenticated
   supabase.auth.getUser().then(({ data, error }) => {
     console.log('Auth user:', data);
     console.log('Auth error:', error);
   });
   ```

3. **Table Structure**:
   ```sql
   -- Verify table structure
   \d contact_content
   ```

## 🔥 **Emergency Fix**

If nothing works, temporarily use localStorage:

```typescript
// In EditContactPage.tsx, temporarily fallback to localStorage
const handleSave = () => {
  try {
    // Try database first
    updateContactContent(content);
  } catch (error) {
    // Fallback to localStorage
    localStorage.setItem("contactContent", JSON.stringify(content));
    toast.success("Contact saved locally (database unavailable)");
  }
};
```

## 🎉 **Success Indicators**

When fixed, you should see:

- ✅ **No 400 errors** in console
- ✅ **Contact data loads** from database
- ✅ **Phone number updates** work in admin
- ✅ **Call/WhatsApp buttons** update automatically
- ✅ **All components** use same phone number

**Run the setup SQL and the 400 error should be resolved!** 🚀
