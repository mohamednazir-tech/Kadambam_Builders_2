import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { getProjects } from "@/lib/projects";
import { useState, useEffect } from "react";

const ProjectsSection = () => {
  const { ref, isVisible } = useScrollAnimation();
  const [projects, setProjects] = useState<any[]>([]);

  useEffect(() => {
    const loadProjects = async () => {
      try {
        const data = await getProjects();
        setProjects(data);
      } catch (error) {
        console.error('Error loading projects:', error);
      }
    };

    loadProjects();
  }, []);

  return (
    <section id="projects" className="section-padding bg-background">
      <div ref={ref} className={`container mx-auto ${isVisible ? "animate-fade-up" : "opacity-0"}`}>
        <h2 className="text-2xl md:text-3xl font-bold text-foreground text-center mb-4">
          Construction Projects in <span className="text-gold">Tirunelveli & Tamil Nadu</span>
        </h2>
        <div className="w-16 h-1 bg-gold mx-auto mb-12 rounded-full" />

        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4 max-w-5xl mx-auto">
          {projects.map((p) => (
            <div key={p.id} className="relative group overflow-hidden rounded-lg aspect-square">
              <img
                src={p.src}
                alt={p.label}
                loading="lazy"
                width={640}
                height={640}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-navy-dark/0 group-hover:bg-navy-dark/60 transition-colors duration-300 flex items-end">
                <p className="text-primary-foreground font-medium text-sm p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                  {p.label}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProjectsSection;
