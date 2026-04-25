import project1 from "@/assets/project-1.jpg";
import project2 from "@/assets/project-2.jpg";
import project3 from "@/assets/project-3.jpg";
import project4 from "@/assets/project-4.jpg";
import project5 from "@/assets/project-5.jpg";
import project6 from "@/assets/project-6.jpg";

export interface Project {
  id: string;
  label: string;
  src: string;
  category: string;
}

const defaultProjects: Project[] = [
  { id: "1", src: project1, label: "2BHK House Construction in Palayamkottai, Tirunelveli", category: "Residential" },
  { id: "2", src: project2, label: "Commercial Shop in Tirunelveli Town - 800 sq.ft", category: "Commercial" },
  { id: "3", src: project3, label: "Kitchen Renovation in Tirunelveli - Modern Design", category: "Renovation" },
  { id: "4", src: project4, label: "Luxury Villa in Tirunelveli - 2000 sq.ft", category: "Residential" },
  { id: "5", src: project5, label: "Modern Duplex House in Tirunelveli", category: "Residential" },
  { id: "6", src: project6, label: "Interior Design Project in Tirunelveli", category: "Interior" },
];

const STORAGE_KEY = "kadambam_projects";

export function getProjects(): Project[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored) as Project[];
      if (parsed.length > 0) return parsed;
    }
  } catch {}
  return defaultProjects;
}

export function saveProjects(projects: Project[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
}

export function addProject(project: Omit<Project, "id">) {
  const projects = getProjects();
  const newProject: Project = { ...project, id: Date.now().toString() };
  projects.push(newProject);
  saveProjects(projects);
  return projects;
}

export function removeProject(id: string) {
  const projects = getProjects().filter((p) => p.id !== id);
  saveProjects(projects);
  return projects;
}
