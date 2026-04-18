import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    name: "Rajesh Kumar",
    text: "Kadambam Builders constructed our dream home in Rahmath Nagar. The quality of work and timely delivery exceeded our expectations. Highly recommended!",
  },
  {
    name: "Priya Lakshmi",
    text: "We hired them for our office renovation and were amazed by their professionalism. The team was courteous, transparent with pricing, and delivered excellent results.",
  },
  {
    name: "Suresh Babu",
    text: "From plan approval to final handover, the entire process was smooth and hassle-free. Their attention to detail and use of quality materials is truly commendable.",
  },
];

const TestimonialsSection = () => {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <section id="testimonials" className="section-padding bg-muted">
      <div ref={ref} className={`container mx-auto ${isVisible ? "animate-fade-up" : "opacity-0"}`}>
        <h2 className="text-2xl md:text-3xl font-bold text-foreground text-center mb-4">
          Client <span className="text-gold">Testimonials</span>
        </h2>
        <div className="w-16 h-1 bg-gold mx-auto mb-12 rounded-full" />

        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {testimonials.map((t) => (
            <div key={t.name} className="bg-card rounded-lg p-6 shadow-sm">
              <Quote className="text-gold/30 mb-3" size={32} />
              <p className="text-muted-foreground text-sm leading-relaxed mb-4">"{t.text}"</p>
              <div className="flex items-center gap-1 mb-2">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="text-gold fill-gold" size={14} />
                ))}
              </div>
              <p className="font-semibold text-foreground text-sm">{t.name}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
