import { Phone, Mail, MapPin } from "lucide-react";

const Footer = () => (
  <footer className="bg-navy-dark text-primary-foreground">
    <div className="container mx-auto section-padding pb-8">
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
        <div>
          <h3 className="text-xl font-bold mb-4">
            Kadambam <span className="text-gold">Builders</span>
          </h3>
          <p className="text-primary-foreground/60 text-sm leading-relaxed">
            Building trust, delivering quality. Your reliable construction partner in Tirunelveli.
          </p>
        </div>
        <div>
          <h4 className="font-semibold mb-4 text-gold">Quick Links</h4>
          <nav className="space-y-2">
            {["Home", "About", "Services", "Projects", "Contact"].map((l) => (
              <a
                key={l}
                href={`#${l.toLowerCase()}`}
                className="block text-sm text-primary-foreground/60 hover:text-gold transition-colors"
              >
                {l}
              </a>
            ))}
          </nav>
        </div>
        <div>
          <h4 className="font-semibold mb-4 text-gold">Contact Info</h4>
          <div className="space-y-3 text-sm text-primary-foreground/60">
            <p className="flex gap-2"><MapPin size={16} className="shrink-0 mt-0.5 text-gold" /> Shop No 1, 132A, 1st Street, Rahmath Nagar, Chennai</p>
            <p className="flex gap-2"><Phone size={16} className="shrink-0 text-gold" /> +91 63740 34451</p>
            <p className="flex gap-2"><Mail size={16} className="shrink-0 text-gold" /> info@kadambambuilders.com</p>
          </div>
        </div>
      </div>
      <div className="border-t border-primary-foreground/10 pt-6 text-center text-xs text-primary-foreground/40">
        <div className="space-y-1">
          <p>© {new Date().getFullYear()} Kadambam Builders. All rights reserved.</p>
          <p>Developed by Mohamed Nazir</p>
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;
