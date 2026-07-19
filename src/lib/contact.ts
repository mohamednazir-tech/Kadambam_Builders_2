import { supabase } from './supabase';

export interface ContactContent {
  id?: string;
  address: string;
  phone: string;
  email: string;
  mapEmbed?: string;
  formTitle?: string;
  map_embed?: string;   // Alternative snake_case
  form_title?: string;  // Alternative snake_case
  created_at?: string;
  updated_at?: string;
}

export const getContactContent = async (): Promise<ContactContent | null> => {
  try {
    const { data, error } = await supabase
      .from('contact_content')
      .select('*')
      .eq('id', 'contact-page')
      .maybeSingle();

    if (error) {
      console.error('Error fetching contact content:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Error fetching contact content:', error);
    return null;
  }
};

export const updateContactContent = async (content: Partial<ContactContent>): Promise<ContactContent | null> => {
  try {
    // Prepare data with both camelCase and snake_case fields
    const updateData: any = {
      id: 'contact-page',
      address: content.address,
      phone: content.phone,
      email: content.email,
      updated_at: new Date().toISOString()
    };

    // Handle mapEmbed/map_embed
    if (content.mapEmbed !== undefined) {
      updateData.mapEmbed = content.mapEmbed;
      updateData.map_embed = content.mapEmbed; // Also update snake_case
    }
    if (content.map_embed !== undefined) {
      updateData.map_embed = content.map_embed;
      updateData.mapEmbed = content.map_embed; // Also update camelCase
    }

    // Handle formTitle/form_title
    if (content.formTitle !== undefined) {
      updateData.formTitle = content.formTitle;
      updateData.form_title = content.formTitle; // Also update snake_case
    }
    if (content.form_title !== undefined) {
      updateData.form_title = content.form_title;
      updateData.formTitle = content.form_title; // Also update camelCase
    }

    const { data, error } = await supabase
      .from('contact_content')
      .upsert([updateData])
      .select()
      .single();

    if (error) {
      console.error('Error updating contact content:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Error saving contact content:', error);
    return null;
  }
};

// Fallback default content
export const defaultContactContent: ContactContent = {
  address: "Shop No 1, 132A, 1st Street, Rahmath Nagar,\nNear Sadak Abdullah College, Tirunelveli",
  phone: "+91 63740 34451",
  email: "info@kadambambuilders.com",
  mapEmbed: "https://www.google.com/maps?q=8.7193737,77.7585907&hl=en&z=17&output=embed",
  formTitle: "Send us a message",
  map_embed: "https://www.google.com/maps?q=8.7193737,77.7585907&hl=en&z=17&output=embed",
  form_title: "Send us a message"
};
