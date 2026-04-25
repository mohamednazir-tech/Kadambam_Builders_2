import { supabase } from './supabase';

export interface ContactMessage {
  id: string;
  name: string;
  phone: string;
  message: string;
  created_at: string;
  updated_at: string;
  status: 'new' | 'read';
  deleted_at: string | null;
  deleted_by: string | null;
}

export const getMessages = async (includeDeleted: boolean = false): Promise<ContactMessage[]> => {
  try {
    // Try Supabase first - simplest possible query
    const { data, error } = await supabase
      .from('messages')
      .select('*');
    
    if (!error && data) {
      console.log('Messages loaded from Supabase:', data.length);
      
      // Sort and filter in JavaScript instead of SQL
      const sorted = data.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
      
      if (!includeDeleted) {
        return sorted.filter(msg => !msg.deleted_at);
      }
      
      return sorted;
    }
  } catch (error) {
    console.error('Supabase query failed:', error);
  }
  
  // Always fall back to local storage
  const localMessages = JSON.parse(localStorage.getItem('contactMessages') || '[]');
  // Using local storage messages
  
  // Filter deleted messages if needed
  const filteredMessages = includeDeleted ? localMessages : localMessages.filter(msg => !msg.deleted_at);
  
  // Sort by date (newest first)
  return filteredMessages.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
};

export const addMessage = async (message: Omit<ContactMessage, 'id' | 'created_at' | 'updated_at' | 'status' | 'deleted_at' | 'deleted_by'>): Promise<ContactMessage | null> => {
  try {
    // Try Supabase first
    const { data, error } = await supabase
      .from('messages')
      .insert([message])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  } catch (error: any) {
    // Show real errors during development
    if (import.meta.env.DEV) {
      console.error('Supabase error (development):', error);
    }
    console.warn('Falling back to local storage due to Supabase error');
    
    // Always use local storage as reliable fallback
    const localMessages = JSON.parse(localStorage.getItem('contactMessages') || '[]');
    const newMessage = {
      ...message,
      id: Date.now().toString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      status: 'new' as const,
      deleted_at: null,
      deleted_by: null
    };
    localMessages.push(newMessage);
    localStorage.setItem('contactMessages', JSON.stringify(localMessages));
    
    // Message saved successfully
    return newMessage;
  }
};

export const markMessageAsRead = async (id: string): Promise<ContactMessage | null> => {
  try {
    // Try Supabase first - simple update with timestamp
    const { data, error } = await supabase
      .from('messages')
      .update({ 
        status: 'read',
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();
    
    if (!error && data) {
      console.log('Message marked as read in Supabase');
      return data;
    }
  } catch (error) {
    console.error('Supabase update failed, using local storage:', error);
  }
  
  // Fall back to local storage
  const localMessages = JSON.parse(localStorage.getItem('contactMessages') || '[]');
  const messageIndex = localMessages.findIndex(msg => msg.id === id);
  
  if (messageIndex !== -1) {
    localMessages[messageIndex].status = 'read';
    localStorage.setItem('contactMessages', JSON.stringify(localMessages));
    console.log('Message marked as read locally');
    return localMessages[messageIndex];
  }
  
  return null;
};

export const deleteMessage = async (id: string): Promise<boolean> => {
  try {
    // Try Supabase first - simple soft delete
    const { error } = await supabase
      .from('messages')
      .update({ 
        deleted_at: new Date().toISOString(),
        deleted_by: null,
        updated_at: new Date().toISOString()
      })
      .eq('id', id);
    
    if (!error) {
      console.log('Message deleted in Supabase');
      return true;
    }
  } catch (error) {
    console.error('Supabase delete failed, using local storage:', error);
  }
  
  // Fall back to local storage
  const localMessages = JSON.parse(localStorage.getItem('contactMessages') || '[]');
  const messageIndex = localMessages.findIndex(msg => msg.id === id);
  
  if (messageIndex !== -1) {
    localMessages[messageIndex].deleted_at = new Date().toISOString();
    localMessages[messageIndex].deleted_by = null;
    localStorage.setItem('contactMessages', JSON.stringify(localMessages));
    console.log('Message deleted locally');
    return true;
  }
  
  return false;
};

export const getAuditLogs = async (limit: number = 100): Promise<any[]> => {
  try {
    const { data, error } = await supabase
      .from('audit_logs')
      .select(`
        *,
        auth_users!inner(email)
      `)
      .order('created_at', { ascending: false })
      .limit(limit);
    
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching audit logs:', error);
    return [];
  }
};

export const restoreMessage = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('messages')
      .update({ 
        deleted_at: null,
        deleted_by: null
      })
      .eq('id', id)
      .not('deleted_at', 'is', null);
    
    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error restoring message:', error);
    return false;
  }
};

export const getUnreadCount = async (): Promise<number> => {
  try {
    // Try Supabase first
    const { count, error } = await supabase
      .from('messages')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'new');
    
    if (!error && count !== null) {
      console.log('Unread count from Supabase:', count);
      return count;
    }
  } catch (error) {
    console.error('Supabase unread count failed, using local storage:', error);
  }
  
  // Fall back to local storage
  const localMessages = JSON.parse(localStorage.getItem('contactMessages') || '[]');
  const unreadCount = localMessages.filter(msg => msg.status === 'new' && !msg.deleted_at).length;
  console.log('Unread count from local storage:', unreadCount);
  
  return unreadCount;
};
