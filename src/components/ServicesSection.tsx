import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { Home, Building2, Hammer, FileCheck, Paintbrush } from "lucide-react";

const services = [
  { icon: Home, title: "House Construction", desc: "Custom-built homes designed to match your lifestyle, from foundation to finishing." },
  { icon: Building2, title: "Commercial Buildings", desc: "Offices, shops, and commercial spaces built with durability and modern design." },
  { icon: Hammer, title: "Renovation & Remodeling", desc: "Transform your existing spaces with expert renovation and remodeling services." },
  { icon: FileCheck, title: "Plan Approval Support", desc: "Complete assistance with building plan approvals and regulatory compliance." },
  { icon: Paintbrush, title: "Interior Design", desc: "Elegant and functional interior design solutions tailored to your taste." },
];

const ServicesSection = () => {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <section id="services" className="section-padding bg-muted">
      <div ref={ref} className={`container mx-auto ${isVisible ? "animate-fade-up" : "opacity-0"}`}>
        <h2 className="text-2xl md:text-3xl font-bold text-foreground text-center mb-4">
          Our <span className="text-gold">Services</span>
        </h2>
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
