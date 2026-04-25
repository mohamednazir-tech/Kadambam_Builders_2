import { supabase } from './supabase';

export interface ServicesContent {
  id?: string;
  section_title: string;
  section_description?: string;
  service1_title: string;
  service1_description: string;
  service1_icon: string;
  service2_title: string;
  service2_description: string;
  service2_icon: string;
  service3_title: string;
  service3_description: string;
  service3_icon: string;
  service4_title: string;
  service4_description: string;
  service4_icon: string;
  service5_title: string;
  service5_description: string;
  service5_icon: string;
  guide_link_text: string;
  guide_link_url: string;
  created_at?: string;
  updated_at?: string;
}

export const getServicesContent = async (): Promise<ServicesContent | null> => {
  try {
    const { data, error } = await supabase
      .from('services_content')
      .select('*')
      .eq('id', 'services-page')
      .maybeSingle();

    if (error) {
      console.error('Error fetching services content:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Error fetching services content:', error);
    return null;
  }
};

export const updateServicesContent = async (content: Partial<ServicesContent>): Promise<ServicesContent | null> => {
  try {
    const { data, error } = await supabase
      .from('services_content')
      .upsert([{ 
        id: 'services-page',
        ...content,
        updated_at: new Date().toISOString()
      }])
      .select()
      .single();

    if (error) {
      console.error('Error updating services content:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Error saving services content:', error);
    return null;
  }
};

// Fallback default content
export const defaultServicesContent: ServicesContent = {
  section_title: "Our Services",
  section_description: "We offer comprehensive construction solutions in Tirunelveli and across Tamil Nadu, delivering quality projects with exceptional craftsmanship.",
  service1_title: "House Construction Tirunelveli",
  service1_description: "Leading house construction company in Tirunelveli offering custom homes, budget construction, and luxury villas across Tamil Nadu with premium materials.",
  service1_icon: "Home",
  service2_title: "Commercial Construction",
  service2_description: "Professional commercial building contractors in Tirunelveli specializing in offices, retail spaces, and industrial projects with timely delivery.",
  service2_icon: "Building2",
  service3_title: "Home Renovation Tirunelveli",
  service3_description: "Expert home renovation and remodeling services in Tirunelveli. Transform your living spaces with quality craftsmanship and modern designs.",
  service3_icon: "Hammer",
  service4_title: "Building Plan Approval",
  service4_description: "Complete assistance with DTCP plan approvals in Tirunelveli. Navigate Tamil Nadu building regulations with our expert guidance.",
  service4_icon: "FileCheck",
  service5_title: "Interior Design Tirunelveli",
  service5_description: "Premium interior design services in Tirunelveli and Tamil Nadu. Create beautiful, functional spaces that reflect your style and needs.",
  service5_icon: "Paintbrush",
  guide_link_text: "→ Detailed House Construction Guide for Tirunelveli",
  guide_link_url: "/house-construction-tirunelveli"
};
