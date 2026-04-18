import heroBg from "@/assets/hero-bg.jpg";
import { Phone, FileText } from "lucide-react";

const HeroSection = () => {
  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center">
      <div className="absolute inset-0">
        <img src={heroBg} alt="Construction site" className="w-full h-full object-cover" width={1920} height={1080} />
        <div className="absolute inset-0 bg-navy-dark/75" />
      </div>
      <div className="relative z-10 container mx-auto text-center px-4 py-32">
        <p className="text-gold font-semibold tracking-widest uppercase text-sm md:text-base mb-4 animate-fade-in">
          Kadambam Builders, Tirunelveli
        </p>
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-primary-foreground leading-tight mb-6 animate-fade-up">
          Building Your Dream Spaces<br className="hidden sm:block" /> with Trust & Quality
        </h1>
        <p className="text-primary-foreground/80 text-base md:text-lg max-w-2xl mx-auto mb-10 animate-fade-up" style={{ animationDelay: "0.2s" }}>
          Residential | Commercial | Renovation Experts
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-up" style={{ animationDelay: "0.4s" }}>
          <a
            href="tel:+916374034451"
            className="flex items-center gap-2 bg-gold text-accent-foreground px-8 py-4 rounded-md text-base font-semibold hover:brightness-110 transition w-full sm:w-auto justify-center"
          >
            <Phone size={18} /> Call Now
          </a>
          <a
            href="#contact"
            className="flex items-center gap-2 border-2 border-gold text-gold px-8 py-4 rounded-md text-base font-semibold hover:bg-gold hover:text-accent-foreground transition w-full sm:w-auto justify-center"
          >
            <FileText size={18} /> Get Quote
          </a>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
