import { useState, useEffect } from "react";
import { Menu, X, Phone } from "lucide-react";

const navLinks = [
  { label: "Home", href: "#home" },
  { label: "About", href: "#about" },
  { label: "Services", href: "#services" },
  { label: "Projects", href: "#projects" },
  { label: "Testimonials", href: "#testimonials" },
  { label: "Contact", href: "#contact" },
];

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-navy shadow-lg py-2" : "bg-navy/90 py-3"
      }`}
    >
      <div className="container mx-auto flex items-center justify-between">
        <a href="#home" className="text-xl md:text-2xl font-bold text-primary-foreground">
          Kadambam <span className="text-gold">Builders</span>
        </a>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-6">
          {navLinks.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-sm font-medium text-primary-foreground/80 hover:text-gold transition-colors"
            >
              {l.label}
            </a>
          ))}
          <a
            href="tel:+919999999999"
            className="flex items-center gap-2 bg-gold text-accent-foreground px-4 py-2 rounded-md text-sm font-semibold hover:brightness-110 transition"
          >
            <Phone size={16} /> Call Now
          </a>
        </nav>

        {/* Mobile Toggle */}
        <button
          className="md:hidden text-primary-foreground p-2"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle menu"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Nav */}
      {isOpen && (
        <nav className="md:hidden bg-navy border-t border-primary-foreground/10 px-4 pb-4">
          {navLinks.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={() => setIsOpen(false)}
              className="block py-3 text-primary-foreground/80 hover:text-gold transition-colors font-medium border-b border-primary-foreground/5"
            >
              {l.label}
            </a>
          ))}
          <a
            href="tel:+919999999999"
            className="flex items-center justify-center gap-2 mt-3 bg-gold text-accent-foreground px-4 py-3 rounded-md font-semibold"
          >
            <Phone size={16} /> Call Now
          </a>
        </nav>
      )}
    </header>
  );
};

export default Header;
