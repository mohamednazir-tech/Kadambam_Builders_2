import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { Home, Building2, Hammer, FileCheck, Paintbrush, Wrench } from "lucide-react";
import { useState, useEffect } from "react";
import { getServicesContent, defaultServicesContent, type ServicesContent } from "@/lib/services";
import { supabase } from "@/lib/supabase";

const iconMap = {
  Home,
  Building2,
  Hammer,
  FileCheck,
  Paintbrush,
  Wrench,
};

const ServicesSection = () => {
  const { ref, isVisible } = useScrollAnimation();
  const [servicesContent, setServicesContent] = useState<ServicesContent>(defaultServicesContent);
  const [isLoading, setIsLoading] = useState(true);

  const loadContent = async () => {
    try {
      const data = await getServicesContent();
      if (data) {
        setServicesContent(data);
      }
    } catch (error) {
      console.error('Error loading services content:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadContent();

    // Set up real-time subscription
    const channel = supabase
      .channel('services-changes')
      .on(
        'postgres_changes',
        { 
          event: '*', 
          schema: 'public', 
          table: 'services_content' 
        },
        (payload) => {
          console.log('Services content changed:', payload);
          loadContent();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // Create services array from database content
  const services = [
    { 
      icon: iconMap[servicesContent.service1_icon as keyof typeof iconMap] || Home, 
      title: servicesContent.service1_title, 
      desc: servicesContent.service1_description 
    },
    { 
      icon: iconMap[servicesContent.service2_icon as keyof typeof iconMap] || Building2, 
      title: servicesContent.service2_title, 
      desc: servicesContent.service2_description 
    },
    { 
      icon: iconMap[servicesContent.service3_icon as keyof typeof iconMap] || Hammer, 
      title: servicesContent.service3_title, 
      desc: servicesContent.service3_description 
    },
    { 
      icon: iconMap[servicesContent.service4_icon as keyof typeof iconMap] || FileCheck, 
      title: servicesContent.service4_title, 
      desc: servicesContent.service4_description 
    },
    { 
      icon: iconMap[servicesContent.service5_icon as keyof typeof iconMap] || Paintbrush, 
      title: servicesContent.service5_title, 
      desc: servicesContent.service5_description 
    },
  ];

  return (
    <section id="services" className="section-padding bg-muted">
      <div ref={ref} className={`container mx-auto ${isVisible ? "animate-fade-up" : "opacity-0"}`}>
        <h2 className="text-2xl md:text-3xl font-bold text-foreground text-center mb-4">
          {servicesContent.section_title}
        </h2>
        {servicesContent.section_description && (
          <p className="text-muted-foreground text-center text-base md:text-lg mb-8 leading-relaxed">
            {servicesContent.section_description}
          </p>
        )}
        <div className="text-center mb-8">
          <a 
            href={servicesContent.guide_link_url}
            className="text-gold hover:underline font-medium"
          >
            {servicesContent.guide_link_text}
          </a>
        </div>
        <div className="w-16 h-1 bg-gold mx-auto mb-12 rounded-full" />

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {services.map((s) => (
            <div
              key={s.title}
              className="bg-card rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow group"
            >
              <div className="w-14 h-14 rounded-lg bg-gold/10 flex items-center justify-center mb-4 group-hover:bg-gold/20 transition-colors">
                <s.icon className="text-gold" size={28} />
              </div>
              <h3 className="font-semibold text-foreground text-lg mb-2">{s.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
