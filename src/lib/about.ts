import { supabase } from './supabase';

export interface AboutContent {
  id?: string;
  title: string;
  description: string;
  mission_title: string;
  mission_description: string;
  vision_title: string;
  vision_description: string;
  created_at?: string;
  updated_at?: string;
}

export const getAboutContent = async (): Promise<AboutContent | null> => {
  try {
    const { data, error } = await supabase
      .from('about_content')
      .select('*')
      .eq('id', 'about-page')
      .maybeSingle();  // Safe fetch - won't crash if no rows

    if (error) {
      console.error('Error fetching about content:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Error fetching about content:', error);
    return null;
  }
};

export const updateAboutContent = async (content: Partial<AboutContent>): Promise<AboutContent | null> => {
  try {
    // Use upsert with fixed ID - single row design
    const { data, error } = await supabase
      .from('about_content')
      .upsert([{ 
        id: 'about-page',  // Fixed ID ensures single row
        ...content,
        updated_at: new Date().toISOString()
      }])
      .select()
      .single();

    if (error) {
      console.error('Error updating about content:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Error saving about content:', error);
    return null;
  }
};

export const createAboutContent = async (content: Omit<AboutContent, 'id' | 'created_at' | 'updated_at'>): Promise<AboutContent | null> => {
  try {
    const { data, error } = await supabase
      .from('about_content')
      .insert(content)
      .select()
      .single();

    if (error) {
      console.error('Error creating about content:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Error creating about content:', error);
    return null;
  }
};

// Fallback default content
export const defaultAboutContent: AboutContent = {
  title: "About Kadambam Builders",
  description: "Based in Tirunelveli, Kadambam Builders is a trusted name in construction, known for delivering high-quality residential and commercial projects. With years of expertise and a commitment to excellence, we turn your vision into reality — on time and within budget.",
  mission_title: "Our Mission",
  mission_description: "Deliver affordable and high-quality construction solutions that exceed expectations, ensuring every project is built with integrity and precision.",
  vision_title: "Our Vision",
  vision_description: "Become the most trusted and preferred builder in Tirunelveli, recognised for quality craftsmanship, transparency, and customer satisfaction."
};
