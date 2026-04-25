import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { Home, Building, Wrench, Calculator } from "lucide-react";

const SEOContentSection = () => {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <section className="section-padding bg-background text-foreground">
      <div ref={ref} className={`container mx-auto ${isVisible ? "animate-fade-up" : "opacity-0"}`}>
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-4">
          Our Construction <span className="text-gold">Process & Services</span>
        </h2>
        <div className="w-16 h-1 bg-gold mx-auto mb-12 rounded-full" />

        <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold mb-3 flex items-center gap-2">
                <Home className="text-gold" size={24} />
                How We Build Your Home
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                Our home construction process starts with understanding your lifestyle and budget. 
                We help you choose the right plot, design the perfect layout, and select materials 
                that suit Tirunelveli's climate. From foundation to finishing, we handle everything 
                with proper permits and quality checks at every stage.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-3 flex items-center gap-2">
                <Building className="text-gold" size={24} />
                Commercial Space Planning
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                We design commercial buildings that maximize functionality and customer flow. 
                Whether it's an office, retail shop, or warehouse, we focus on proper ventilation, 
                lighting, and space utilization. Our team ensures compliance with Tirunelveli's 
                commercial building codes and accessibility requirements.
              </p>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold mb-3 flex items-center gap-2">
                <Wrench className="text-gold" size={24} />
                Renovation That Adds Value
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                We assess your existing space and suggest renovations that improve both aesthetics 
                and functionality. Common upgrades include modular kitchens, bathroom modernization, 
                and open-plan living areas. All renovations use weather-resistant materials suitable for 
                Tirunelveli's climate conditions.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-3 flex items-center gap-2">
                <Calculator className="text-gold" size={24} />
                Transparent Cost Breakdown
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                We provide detailed cost estimates including materials, labor, permits, and timeline. 
                Our pricing includes all government fees and taxes with no hidden charges. 
                Payment is structured in milestones tied to construction progress, ensuring 
                you pay only for work completed.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-12 p-6 bg-navy/5 rounded-lg">
          <h3 className="text-xl font-semibold mb-4 text-center">Construction Timeline & Materials</h3>
          <div className="grid md:grid-cols-3 gap-6 text-center">
            <div>
              <div className="text-3xl font-bold text-gold mb-2">6-9 Months</div>
              <p className="text-sm text-muted-foreground">Average 2BHK Construction Time</p>
            </div>
            <div>
              <div className="text-3xl font-bold text-gold mb-2">ISO Certified</div>
              <p className="text-sm text-muted-foreground">All Materials Used</p>
            </div>
            <div>
              <div className="text-3xl font-bold text-gold mb-2">5 Years</div>
              <p className="text-sm text-muted-foreground">Structural Warranty</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SEOContentSection;
