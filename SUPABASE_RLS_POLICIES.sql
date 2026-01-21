-- =====================================================
-- SUPABASE ROW LEVEL SECURITY (RLS) POLICIES
-- Execute this SQL in your Supabase SQL Editor
-- =====================================================
-- 
-- INSTRUCTIONS:
-- 1. Go to your Supabase Dashboard
-- 2. Navigate to SQL Editor
-- 3. Copy and paste this entire file
-- 4. Execute the SQL
-- 5. Verify policies are created in Authentication > Policies
--
-- =====================================================

-- Enable RLS on all tables
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.materials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- PROJECTS TABLE POLICIES
-- =====================================================

-- Users can view their own projects
CREATE POLICY "Users can view own projects"
ON public.projects FOR SELECT
USING (auth.uid() = user_id);

-- Users can insert their own projects
CREATE POLICY "Users can insert own projects"
ON public.projects FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Users can update their own projects
CREATE POLICY "Users can update own projects"
ON public.projects FOR UPDATE
USING (auth.uid() = user_id);

-- Users can delete their own projects
CREATE POLICY "Users can delete own projects"
ON public.projects FOR DELETE
USING (auth.uid() = user_id);

-- =====================================================
-- MATERIALS TABLE POLICIES
-- =====================================================

-- Users can view their own materials
CREATE POLICY "Users can view own materials"
ON public.materials FOR SELECT
USING (auth.uid() = user_id);

-- Users can insert their own materials
CREATE POLICY "Users can insert own materials"
ON public.materials FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Users can update their own materials
CREATE POLICY "Users can update own materials"
ON public.materials FOR UPDATE
USING (auth.uid() = user_id);

-- Users can delete their own materials
CREATE POLICY "Users can delete own materials"
ON public.materials FOR DELETE
USING (auth.uid() = user_id);

-- =====================================================
-- PROFILES TABLE POLICIES
-- =====================================================

-- Users can view their own profile
CREATE POLICY "Users can view own profile"
ON public.profiles FOR SELECT
USING (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "Users can update own profile"
ON public.profiles FOR UPDATE
USING (auth.uid() = id);

-- Users can insert their own profile (for initial setup)
CREATE POLICY "Users can insert own profile"
ON public.profiles FOR INSERT
WITH CHECK (auth.uid() = id);

-- =====================================================
-- VERIFICATION QUERIES
-- =====================================================
-- Run these queries after executing the policies above
-- to verify everything is set up correctly
-- =====================================================

-- Check if RLS is enabled
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename IN ('projects', 'materials', 'profiles');

-- List all policies
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename, policyname;

-- =====================================================
-- NOTES
-- =====================================================
-- 
-- If you get "policy already exists" errors:
-- This means the policies are already configured. You can:
-- 1. Skip that policy, or
-- 2. Drop it first with: DROP POLICY "policy_name" ON table_name;
--    Then re-create it
--
-- If tables don't exist:
-- Make sure you've created the tables first using the schema
-- provided in the original conversation.
--
-- =====================================================
