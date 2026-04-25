import { supabase } from './supabase';

export interface Testimonial {
  id?: string;
  name: string;
  text: string;
  rating: number;
  status: 'pending' | 'approved' | 'rejected';
  created_at?: string;
  updated_at?: string;
}

export const getApprovedTestimonials = async (): Promise<Testimonial[]> => {
  try {
    const { data, error } = await supabase
      .from('testimonials')
      .select('*')
      .eq('status', 'approved')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching testimonials:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error fetching testimonials:', error);
    return [];
  }
};

export const getAllTestimonials = async (): Promise<Testimonial[]> => {
  try {
    const { data, error } = await supabase
      .from('testimonials')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching all testimonials:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error fetching all testimonials:', error);
    return [];
  }
};

export const submitTestimonial = async (testimonial: Omit<Testimonial, 'id' | 'status' | 'created_at' | 'updated_at'>): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('testimonials')
      .insert([{
        ...testimonial,
        status: 'pending' // Reviews need admin approval
      }]);

    if (error) {
      console.error('Error submitting testimonial:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error submitting testimonial:', error);
    return false;
  }
};

export const updateTestimonialStatus = async (id: string, status: 'approved' | 'rejected'): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('testimonials')
      .update({ status })
      .eq('id', id);

    if (error) {
      console.error('Error updating testimonial status:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error updating testimonial status:', error);
    return false;
  }
};

export const deleteTestimonial = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('testimonials')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting testimonial:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error deleting testimonial:', error);
    return false;
  }
};
