import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { Target, Eye } from "lucide-react";
import { useState, useEffect } from "react";
import { getAboutContent, defaultAboutContent, type AboutContent } from "@/lib/about";
import { supabase } from "@/lib/supabase";

const AboutSection = () => {
  const { ref, isVisible } = useScrollAnimation();
  const [aboutContent, setAboutContent] = useState<AboutContent>(defaultAboutContent);
  const [isLoading, setIsLoading] = useState(true);

  const loadContent = async () => {
    try {
      const data = await getAboutContent();
      if (data) {
        setAboutContent(data);
      }
    } catch (error) {
      console.error('Error loading about content:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Initial load
    loadContent();

    // Set up real-time subscription
    const channel = supabase
      .channel('about-changes')
      .on(
        'postgres_changes',
        { 
          event: '*', 
          schema: 'public', 
          table: 'about_content' 
        },
        (payload) => {
          console.log('About content changed:', payload);
          loadContent(); // Reload content when database changes
        }
      )
      .subscribe();

    // Cleanup subscription on unmount
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return (
    <section id="about" className="section-padding bg-background">
      <div ref={ref} className={`container mx-auto max-w-4xl ${isVisible ? "animate-fade-up" : "opacity-0"}`}>
        <h2 className="text-2xl md:text-3xl font-bold text-foreground text-center mb-4">
          {aboutContent.title}
        </h2>
        <div className="w-16 h-1 bg-gold mx-auto mb-8 rounded-full" />
        <p className="text-muted-foreground text-center text-base md:text-lg mb-12 leading-relaxed">
          {aboutContent.description}
        </p>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-secondary rounded-lg p-6 flex gap-4">
            <div className="w-12 h-12 rounded-full bg-gold/20 flex items-center justify-center shrink-0">
              <Target className="text-gold" size={24} />
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-2">{aboutContent.mission_title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {aboutContent.mission_description}
              </p>
            </div>
          </div>
          <div className="bg-secondary rounded-lg p-6 flex gap-4">
            <div className="w-12 h-12 rounded-full bg-gold/20 flex items-center justify-center shrink-0">
              <Eye className="text-gold" size={24} />
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-2">{aboutContent.vision_title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {aboutContent.vision_description}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
