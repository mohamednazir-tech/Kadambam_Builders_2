import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { Target, Eye } from "lucide-react";

const AboutSection = () => {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <section id="about" className="section-padding bg-background">
      <div ref={ref} className={`container mx-auto max-w-4xl ${isVisible ? "animate-fade-up" : "opacity-0"}`}>
        <h2 className="text-2xl md:text-3xl font-bold text-foreground text-center mb-4">
          About <span className="text-gold">Kadambam Builders</span>
        </h2>
        <div className="w-16 h-1 bg-gold mx-auto mb-8 rounded-full" />
        <p className="text-muted-foreground text-center text-base md:text-lg mb-12 leading-relaxed">
          Based in Rahmath Nagar, Chennai, Kadambam Builders is a trusted name in construction, known for
          delivering high-quality residential and commercial projects. With years of expertise and a commitment
          to excellence, we turn your vision into reality — on time and within budget.
        </p>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-secondary rounded-lg p-6 flex gap-4">
            <div className="w-12 h-12 rounded-full bg-gold/20 flex items-center justify-center shrink-0">
              <Target className="text-gold" size={24} />
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-2">Our Mission</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Deliver affordable and high-quality construction solutions that exceed expectations, ensuring
                every project is built with integrity and precision.
              </p>
            </div>
          </div>
          <div className="bg-secondary rounded-lg p-6 flex gap-4">
            <div className="w-12 h-12 rounded-full bg-gold/20 flex items-center justify-center shrink-0">
              <Eye className="text-gold" size={24} />
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-2">Our Vision</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Become the most trusted and preferred builder in Chennai, recognised for quality craftsmanship,
                transparency, and customer satisfaction.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
