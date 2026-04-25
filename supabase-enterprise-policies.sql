-- ENTERPRISE-GRADE SECURITY POLICIES
-- This addresses the remaining gaps: server-side rate limiting, audit logging, proper roles

-- 1. Create rate limiting table (server-side)
CREATE TABLE IF NOT EXISTS rate_limits (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  identifier TEXT NOT NULL, -- IP address or user ID
  action TEXT NOT NULL, -- 'contact_submit' or 'auth_attempt'
  attempts_count INTEGER DEFAULT 1,
  last_attempt TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  window_start TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_rate_limits_identifier_action ON rate_limits(identifier, action);
CREATE INDEX IF NOT EXISTS idx_rate_limits_window ON rate_limits(window_start);

-- 2. Update admin_users table with proper role system
ALTER TABLE admin_users 
ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'admin' CHECK (role IN ('admin', 'super_admin')),
ADD COLUMN IF NOT EXISTS created_by UUID REFERENCES auth.users(id),
ADD COLUMN IF NOT EXISTS last_login TIMESTAMP WITH TIME ZONE;

-- 3. Create audit logs table
CREATE TABLE IF NOT EXISTS audit_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  action TEXT NOT NULL, -- 'create_message', 'read_message', 'delete_message', 'login', 'logout'
  table_name TEXT, -- 'messages', 'admin_users'
  record_id UUID, -- ID of the affected record
  old_values JSONB,
  new_values JSONB,
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add indexes for audit logs
CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_action ON audit_logs(action);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON audit_logs(created_at DESC);

-- 4. Server-side rate limiting function
CREATE OR REPLACE FUNCTION check_rate_limit(
  p_identifier TEXT,
  p_action TEXT,
  p_max_attempts INTEGER DEFAULT 5,
  p_window_minutes INTEGER DEFAULT 15
) RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_rate_limit_record RECORD;
  v_is_limited BOOLEAN := FALSE;
BEGIN
  -- Get current rate limit record
  SELECT attempts_count, window_start INTO v_rate_limit_record
  FROM rate_limits
  WHERE identifier = p_identifier AND action = p_action
    AND window_start > NOW() - (p_window_minutes || ' minutes')::INTERVAL
  FOR UPDATE;

  -- If no record exists or window expired, create/reset
  IF v_rate_limit_record IS NULL OR 
     v_rate_limit_record.window_start IS NULL OR 
     v_rate_limit_record.window_start <= NOW() - (p_window_minutes || ' minutes')::INTERVAL THEN
    
    INSERT INTO rate_limits (identifier, action, attempts_count, window_start)
    VALUES (p_identifier, p_action, 1, NOW())
    ON CONFLICT (identifier, action, window_start) 
    DO UPDATE SET attempts_count = 1, last_attempt = NOW();
    RETURN TRUE;
  END IF;

  -- Check if over limit
  IF v_rate_limit_record.attempts_count >= p_max_attempts THEN
    v_is_limited := TRUE;
  ELSE
    -- Increment counter
    UPDATE rate_limits 
    SET attempts_count = attempts_count + 1, last_attempt = NOW()
    WHERE identifier = p_identifier AND action = p_action;
  END IF;

  RETURN NOT v_is_limited;
END;
$$;

-- 5. Audit logging function
CREATE OR REPLACE FUNCTION log_audit(
  p_user_id UUID,
  p_action TEXT,
  p_table_name TEXT DEFAULT NULL,
  p_record_id UUID DEFAULT NULL,
  p_old_values JSONB DEFAULT NULL,
  p_new_values JSONB DEFAULT NULL,
  p_ip_address TEXT DEFAULT NULL,
  p_user_agent TEXT DEFAULT NULL
) RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO audit_logs (
    user_id, action, table_name, record_id, old_values, new_values, ip_address, user_agent
  ) VALUES (
    p_user_id, p_action, p_table_name, p_record_id, p_old_values, p_new_values, p_ip_address, p_user_agent
  );
END;
$$;

-- 6. Drop and replace all existing policies with enterprise-grade ones

-- Drop existing policies
DROP POLICY IF EXISTS "Allow validated public insert" ON messages;
DROP POLICY IF EXISTS "Only admins can read messages" ON messages;
DROP POLICY IF EXISTS "Only admins can update messages" ON messages;
DROP POLICY IF EXISTS "Only admins can delete messages" ON messages;

-- Contact form with server-side rate limiting
CREATE POLICY "Enterprise contact form insert" ON messages
  FOR INSERT
  TO anon
  WITH CHECK (
    -- Server-side validation
    length(trim(name)) >= 2 AND
    length(trim(phone)) >= 10 AND
    length(trim(message)) >= 5 AND
    length(trim(message)) <= 500 AND
    position('<script>' in lower(message)) = 0 AND
    position('<script>' in lower(name)) = 0 AND
    -- Server-side rate limiting (using client IP from request headers)
    check_rate_limit(
      COALESCE(current_setting('request.headers', true)::json->>'x-forwarded-for', 
               current_setting('request.headers', true)::json->>'x-real-ip',
               'unknown'),
      'contact_submit',
      3, -- max 3 attempts
      10 -- per 10 minutes
    )
  );

-- Admin-only access with proper role checking
CREATE POLICY "Enterprise admin read messages" ON messages
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.id = auth.uid()
      AND admin_users.role IN ('admin', 'super_admin')
    )
  );

CREATE POLICY "Enterprise admin update messages" ON messages
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.id = auth.uid()
      AND admin_users.role IN ('admin', 'super_admin')
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.id = auth.uid()
      AND admin_users.role IN ('admin', 'super_admin')
    )
  );

-- Soft delete instead of hard delete
ALTER TABLE messages 
ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP WITH TIME ZONE DEFAULT NULL,
ADD COLUMN IF NOT EXISTS deleted_by UUID REFERENCES auth.users(id);

CREATE POLICY "Enterprise admin soft delete messages" ON messages
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.id = auth.uid()
      AND admin_users.role IN ('admin', 'super_admin')
    )
  )
  WITH CHECK (
    deleted_at IS NOT NULL AND
    deleted_by = auth.uid() AND
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.id = auth.uid()
      AND admin_users.role IN ('admin', 'super_admin')
    )
  );

-- Admin users management with proper role hierarchy
DROP POLICY IF EXISTS "Only existing admins can create admins" ON admin_users;
DROP POLICY IF EXISTS "Only admins can view admin users" ON admin_users;
DROP POLICY IF EXISTS "Super admin can manage admins" ON admin_users;

-- Only super admins can manage admin users
CREATE POLICY "Super admin manage admin users" ON admin_users
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.id = auth.uid()
      AND admin_users.role = 'super_admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.id = auth.uid()
      AND admin_users.role = 'super_admin'
    )
  );

-- Regular admins can only view admin list (not modify)
CREATE POLICY "Admins view admin users" ON admin_users
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.id = auth.uid()
      AND admin_users.role IN ('admin', 'super_admin')
    )
  );

-- 7. Triggers for automatic audit logging
CREATE OR REPLACE FUNCTION audit_trigger()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    PERFORM log_audit(
      auth.uid(),
      'create_' || TG_TABLE_NAME,
      TG_TABLE_NAME,
      NEW.id,
      NULL,
      to_jsonb(NEW),
      current_setting('request.headers', true)::json->>'x-forwarded-for',
      current_setting('request.headers', true)::json->>'user-agent'
    );
    RETURN NEW;
  ELSIF TG_OP = 'UPDATE' THEN
    PERFORM log_audit(
      auth.uid(),
      'update_' || TG_TABLE_NAME,
      TG_TABLE_NAME,
      NEW.id,
      to_jsonb(OLD),
      to_jsonb(NEW),
      current_setting('request.headers', true)::json->>'x-forwarded-for',
      current_setting('request.headers', true)::json->>'user-agent'
    );
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    PERFORM log_audit(
      auth.uid(),
      'delete_' || TG_TABLE_NAME,
      TG_TABLE_NAME,
      OLD.id,
      to_jsonb(OLD),
      NULL,
      current_setting('request.headers', true)::json->>'x-forwarded-for',
      current_setting('request.headers', true)::json->>'user-agent'
    );
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$;

-- Apply audit triggers (only if user is authenticated)
DROP TRIGGER IF EXISTS messages_audit_trigger ON messages;
CREATE TRIGGER messages_audit_trigger
  AFTER INSERT OR UPDATE OR DELETE ON messages
  FOR EACH ROW EXECUTE PROCEDURE audit_trigger();

DROP TRIGGER IF EXISTS admin_users_audit_trigger ON admin_users;
CREATE TRIGGER admin_users_audit_trigger
  AFTER INSERT OR UPDATE OR DELETE ON admin_users
  FOR EACH ROW EXECUTE PROCEDURE audit_trigger();
