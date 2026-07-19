import { supabase } from './supabase';
import project1 from "@/assets/project-1.jpg";
import project2 from "@/assets/project-2.jpg";
import project3 from "@/assets/project-3.jpg";
import project4 from "@/assets/project-4.jpg";
import project5 from "@/assets/project-5.jpg";
import project6 from "@/assets/project-6.jpg";

export interface Project {
  id: number;
  label: string;
  src: string;
  category: string;
  created_at?: string;
  updated_at?: string;
}

const defaultProjects: Project[] = [
  { id: 1, src: project1, label: "2BHK House Construction in Palayamkottai, Tirunelveli", category: "Residential" },
  { id: 2, src: project2, label: "Commercial Shop in Tirunelveli Town - 800 sq.ft", category: "Commercial" },
  { id: 3, src: project3, label: "Kitchen Renovation in Tirunelveli - Modern Design", category: "Renovation" },
  { id: 4, src: project4, label: "Luxury Villa in Tirunelveli - 2000 sq.ft", category: "Residential" },
  { id: 5, src: project5, label: "Modern Duplex House in Tirunelveli", category: "Residential" },
  { id: 6, src: project6, label: "Interior Design Project in Tirunelveli", category: "Interior" },
];

const STORAGE_KEY = "kadambam_projects";

// Get all projects from Supabase with localStorage fallback
export async function getProjects(): Promise<Project[]> {
  try {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .order('id', { ascending: true });
    
    if (!error && data && data.length > 0) {
      // Cache in localStorage as backup
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      return data;
    }
  } catch (error) {
    console.error('Error fetching projects from Supabase:', error);
  }
  
  // Fallback to localStorage
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    try {
      const parsed = JSON.parse(stored) as Project[];
      if (parsed.length > 0) return parsed;
    } catch {}
  }
  
  return defaultProjects;
}

// Add project to Supabase
export async function addProject(project: Omit<Project, 'id' | 'created_at' | 'updated_at'>): Promise<Project | null> {
  try {
    const { data, error } = await supabase
      .from('projects')
      .insert([project])
      .select()
      .single();
    
    if (error) throw error;
    
    // Update localStorage cache
    const current = await getProjects();
    const updated = [...current, data];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    
    return data;
  } catch (error) {
    console.error('Error adding project to Supabase:', error);
    
    // Fallback to localStorage
    const current = await getProjects();
    const newProject: Project = { 
      ...project, 
      id: Date.now() 
    };
    const updated = [...current, newProject];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    
    return newProject;
  }
}

// Remove project from Supabase
export async function removeProject(id: number): Promise<Project[]> {
  try {
    const { error } = await supabase
      .from('projects')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  } catch (error) {
    console.error('Error deleting project from Supabase:', error);
  }
  
  // Update localStorage cache
  const current = await getProjects();
  const updated = current.filter((p) => p.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  
  return updated;
}

// Legacy sync function for backward compatibility
export function saveProjects(projects: Project[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
}
