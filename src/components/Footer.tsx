import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Facebook, Instagram, Youtube, MapPin, Phone, Mail, ArrowUp } from "lucide-react";
import { getContactContent, defaultContactContent, type ContactContent } from "@/lib/contact";

const Footer = () => {
  const [contactContent, setContactContent] = useState<ContactContent>(defaultContactContent);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadContactData = async () => {
      try {
        const data = await getContactContent();
        if (data) {
          setContactContent(data);
        }
      } catch (error) {
        console.error('Error loading contact data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadContactData();
  }, []);

  return (
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
              <a
                href="/house-construction-tirunelveli"
                className="block text-sm text-primary-foreground/60 hover:text-gold transition-colors border-t border-primary-foreground/10 pt-2"
              >
                House Construction Guide in Tirunelveli →
              </a>
            </nav>
          </div>
          <div>
            <h4 className="font-semibold mb-4 text-gold">Contact Info</h4>
            <div className="space-y-3 text-sm text-primary-foreground/60">
              {isLoading ? (
                <div className="space-y-2">
                  <div className="animate-pulse h-4 bg-primary-foreground/20 rounded"></div>
                  <div className="animate-pulse h-4 bg-primary-foreground/20 rounded w-3/4"></div>
                  <div className="animate-pulse h-4 bg-primary-foreground/20 rounded w-2/3"></div>
                </div>
              ) : (
                <>
                  <p className="flex gap-2">
                    <MapPin size={16} className="shrink-0 mt-0.5 text-gold" /> 
                    {contactContent.address || 'Shop No 1, 132A, 1st Street, Rahmath Nagar, Tirunelveli'}
                  </p>
                  <p className="flex gap-2">
                    <Phone size={16} className="shrink-0 text-gold" /> 
                    {contactContent.phone || '+91 63740 34451'}
                  </p>
                  <p className="flex gap-2">
                    <Mail size={16} className="shrink-0 text-gold" /> 
                    {contactContent.email || 'info@kadambambuilders.com'}
                  </p>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="border-t border-primary-foreground/10 pt-6 text-center text-xs text-primary-foreground/40">
        <div className="space-y-1">
          <p> {new Date().getFullYear()} Kadambam Builders. All rights reserved.</p>
          <p>Developed by Mohamed Nazir</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
