import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { MapPin, Clock, ShieldCheck, IndianRupee } from "lucide-react";

const reasons = [
  { icon: MapPin, title: "Local Expertise", desc: "Deep knowledge of Rahmath Nagar and Chennai construction landscape." },
  { icon: Clock, title: "On-Time Delivery", desc: "We respect your timeline and deliver projects on schedule." },
  { icon: ShieldCheck, title: "Quality Materials", desc: "Only premium-grade materials for lasting durability and safety." },
  { icon: IndianRupee, title: "Affordable Pricing", desc: "Competitive rates without compromising on quality standards." },
];

const WhyChooseUsSection = () => {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <section className="section-padding bg-navy text-primary-foreground">
      <div ref={ref} className={`container mx-auto ${isVisible ? "animate-fade-up" : "opacity-0"}`}>
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-4">
          Why Choose <span className="text-gold">Us</span>
        </h2>
        <div className="w-16 h-1 bg-gold mx-auto mb-12 rounded-full" />

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
          {reasons.map((r) => (
            <div key={r.title} className="text-center">
              <div className="w-16 h-16 rounded-full bg-gold/15 flex items-center justify-center mx-auto mb-4">
                <r.icon className="text-gold" size={28} />
              </div>
              <h3 className="font-semibold text-lg mb-2">{r.title}</h3>
              <p className="text-primary-foreground/70 text-sm leading-relaxed">{r.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUsSection;
