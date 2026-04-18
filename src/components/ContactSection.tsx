import { useState } from "react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { MapPin, Phone, Mail, Send } from "lucide-react";

const ContactSection = () => {
  const { ref, isVisible } = useScrollAnimation();
  const [form, setForm] = useState({ name: "", phone: "", message: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const msg = `Name: ${form.name}%0APhone: ${form.phone}%0AMessage: ${form.message}`;
    window.open(`https://wa.me/916374034451?text=${msg}`, "_blank");
  };

  return (
    <section id="contact" className="section-padding bg-background">
      <div ref={ref} className={`container mx-auto ${isVisible ? "animate-fade-up" : "opacity-0"}`}>
        <h2 className="text-2xl md:text-3xl font-bold text-foreground text-center mb-4">
          Contact <span className="text-gold">Us</span>
        </h2>
        <div className="w-16 h-1 bg-gold mx-auto mb-12 rounded-full" />

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Info */}
          <div>
            <div className="space-y-5 mb-8">
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-gold/15 flex items-center justify-center shrink-0">
                  <MapPin className="text-gold" size={18} />
                </div>
                <div>
                  <h4 className="font-semibold text-foreground text-sm">Address</h4>
                  <p className="text-muted-foreground text-sm">
                    Shop No 1, 132A, 1st Street, Rahmath Nagar,<br />
                    Near Sadak Abdullah College, Tirunelveli
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-gold/15 flex items-center justify-center shrink-0">
                  <Phone className="text-gold" size={18} />
                </div>
                <div>
                  <h4 className="font-semibold text-foreground text-sm">Phone</h4>
                  <a href="tel:+916374034451" className="text-muted-foreground text-sm hover:text-gold transition-colors">
                    +91 63740 34451
                  </a>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-gold/15 flex items-center justify-center shrink-0">
                  <Mail className="text-gold" size={18} />
                </div>
                <div>
                  <h4 className="font-semibold text-foreground text-sm">Email</h4>
                  <a href="mailto:info@kadambambuilders.com" className="text-muted-foreground text-sm hover:text-gold transition-colors">
                    info@kadambambuilders.com
                  </a>
                </div>
              </div>
            </div>

            {/* Map */}
            <div className="rounded-lg overflow-hidden aspect-video">
              <iframe
                src="https://www.google.com/maps?q=8.7193737,77.7585907&hl=en&z=17&output=embed"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Kadambam Builders Location"
              />
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground mb-2">Send us a message</h3>
            <input
              type="text"
              placeholder="Your Name"
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full px-4 py-3 rounded-md border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-gold"
            />
            <input
              type="tel"
              placeholder="Phone Number"
              required
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              className="w-full px-4 py-3 rounded-md border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-gold"
            />
            <textarea
              placeholder="Your Message"
              rows={5}
              required
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              className="w-full px-4 py-3 rounded-md border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-gold resize-none"
            />
            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 bg-gold text-accent-foreground px-6 py-4 rounded-md font-semibold hover:brightness-110 transition text-base"
            >
              <Send size={18} /> Send Message
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
