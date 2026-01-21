# Testing Guide - Supabase Integration

This guide will help you test the new Supabase integration to ensure everything works correctly.

## Prerequisites

Before testing, make sure you have:

1. **RLS Policies Configured**: Execute the SQL in `SUPABASE_RLS_POLICIES.sql` in your Supabase SQL Editor
2. **Environment Variables**: Verify `.env.local` has correct Supabase credentials
3. **User Account**: Have at least one test user account created

## Step 1: Verify Database Setup

### Check Tables Exist

1. Go to Supabase Dashboard → Table Editor
2. Verify these tables exist:
   - `profiles`
   - `projects` 
   - `materials`

### Check RLS is Enabled

Run this query in Supabase SQL Editor:

```sql
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename IN ('projects', 'materials', 'profiles');
```

All tables should show `rowsecurity = true`

### Check Policies Exist

```sql
SELECT tablename, policyname
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename, policyname;
```

You should see 4 policies per table (SELECT, INSERT, UPDATE, DELETE)

## Step 2: Test Authentication

1. **Sign Up/Login**: Navigate to `/signup` or `/login`
2. **Verify User**: After login, you should be redirected to the dashboard
3. **Check Profile**: Verify your profile was created in Supabase `profiles` table

## Step 3: Test Projects CRUD

### Create Project

1. Click "Nuevo Proyecto" button
2. Enter a project name (e.g., "Test Project 1")
3. Submit the form
4. **Expected**: Success message appears
5. **Verify in Supabase**: Go to Table Editor → `projects`, you should see the new project with your `user_id`

### Update Project

1. Click edit icon on a project
2. Change the name
3. Submit
4. **Expected**: Success message, project name updates
5. **Verify in Supabase**: Check the `updated_at` timestamp changed

### Delete Project

1. Click delete icon on a project
2. Confirm deletion
3. **Expected**: Success message, project disappears from list
4. **Verify in Supabase**: Project row is deleted

### Switch Project

1. Create multiple projects
2. Click on different projects to switch
3. **Expected**: Current project indicator updates

## Step 4: Test Materials CRUD

### Add Material

1. Select a project
2. Fill out the material form:
   - Name: "Test Material"
   - Category: Select any
   - Location: "Almacén A"
   - Other fields as desired
3. Submit
4. **Expected**: Success message, material appears in list
5. **Verify in Supabase**: Go to Table Editor → `materials`, you should see:
   - New material row
   - `project_id` matches current project
   - `user_id` matches your user

### Update Material

1. Click edit icon on a material
2. Change some fields
3. Submit
4. **Expected**: Success message, material updates in list
5. **Verify in Supabase**: Check `updated_at` timestamp changed

### Update Quantity

1. Click +/- buttons on a material
2. Enter a quantity
3. **Expected**: Success message "Cantidad actualizada exitosamente" (no longer mentions exporting)
4. **Verify in Supabase**: Check quantity value changed

### Delete Material

1. Click delete icon on a material
2. Confirm deletion
3. **Expected**: Success message, material disappears
4. **Verify in Supabase**: Material row is deleted

## Step 5: Test Real-time Sync

### Same Browser, Different Tabs

1. Open the app in two browser tabs (same user)
2. Create a project in Tab 1
3. **Expected**: Project appears automatically in Tab 2 (no refresh needed)
4. Add a material in Tab 2
5. **Expected**: Material appears automatically in Tab 1

### Different Devices

1. Login on Desktop
2. Login on Mobile (or another browser)
3. Create a project on Desktop
4. **Expected**: Project appears on Mobile
5. Add a material on Mobile
6. **Expected**: Material appears on Desktop

**If real-time doesn't work**:
- Check browser console for errors
- Verify Supabase Realtime is enabled for your project
- Check that subscriptions are being created (look for console.log messages)

## Step 6: Test Import/Export

### Export to Excel

1. Add some materials to a project
2. Click "Excel" export button
3. **Expected**: Excel file downloads with all materials

### Import from Excel/CSV

1. Prepare an Excel file with materials (use exported file as template)
2. Click "Choose File" under Import
3. Select your file
4. **Expected**: 
   - If materials exist, you get a prompt to replace or add
   - Success message shows count of imported materials
5. **Verify in Supabase**: Check `materials` table for imported records

## Step 7: Test Search and Filters

1. Add materials in different categories
2. Use search box to search by name
3. **Expected**: List filters in real-time
4. Select different categories from dropdown
5. **Expected**: Only materials in that category show

## Step 8: Test Dashboard Views

1. Click "Dashboard" tab
2. **Expected**: See statistics, charts, and project overview
3. Click "Gestión de Materiales" tab
4. **Expected**: See materials list and form

## Step 9: Test Error Handling

### Network Error

1. Disconnect from internet
2. Try to create a project
3. **Expected**: Error message appears

### Invalid Data

1. Try to add a material without required fields
2. **Expected**: Form validation or error message

### Unauthorized Access (RLS Test)

1. Create a second test user account
2. Login as User A, create projects
3. Logout, login as User B
4. **Expected**: User B should NOT see User A's projects
5. **Verify in Supabase**: Run this query as admin:

```sql
SELECT user_id, name FROM projects;
```

You should see projects from both users, but each user should only see their own in the app.

## Step 10: Test Loading States

1. Clear cache/refresh page
2. **Expected**: See "Cargando proyectos..." message briefly
3. Select a project
4. **Expected**: Materials load with loading indicator

## Common Issues and Solutions

### Issue: "Error al cargar proyectos"

**Cause**: RLS policies not configured or environment variables incorrect

**Solution**: 
1. Check `.env.local` has correct Supabase URL and key
2. Execute RLS policies SQL
3. Verify user is authenticated

### Issue: Real-time not working

**Cause**: Supabase Realtime not enabled or subscription filter incorrect

**Solution**:
1. Check Supabase Dashboard → Project Settings → API → Realtime is enabled
2. Check browser console for subscription errors

### Issue: "Cannot read properties of null"

**Cause**: Trying to access project/material before data loads

**Solution**: This should be handled by loading states, check if loading indicators appear

### Issue: Materials not importing

**Cause**: Field mapping mismatch between file and database

**Solution**: Ensure imported file has required fields (name, category, location)

## Success Criteria

✅ All CRUD operations work for projects and materials
✅ Data persists in Supabase (visible in Table Editor)
✅ Real-time sync works across tabs/devices
✅ RLS prevents users from seeing each other's data
✅ Import/export functionality works
✅ Loading and error states display correctly
✅ No console errors during normal operations

## Next Steps

After successful testing:
1. Deploy to production (Vercel/Netlify)
2. Set production environment variables
3. Test again in production
4. Clear localStorage on user devices (old data will be abandoned)
5. Consider adding data migration tool if needed
