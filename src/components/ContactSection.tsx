import { useState, useEffect } from "react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { MapPin, Phone, Mail, Send, CheckCircle } from "lucide-react";
import { addMessage, type ContactMessage } from "@/lib/messages";
import { getContactContent, defaultContactContent, type ContactContent } from "@/lib/contact";

const ContactSection = () => {
  const { ref, isVisible } = useScrollAnimation();
  const [form, setForm] = useState({ name: "", phone: "", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [contactData, setContactData] = useState<ContactContent>(defaultContactContent);

  // Helper function to get contact data with fallback for different column formats
  const getContactDataWithFallback = (data: ContactContent) => ({
    address: data.address,
    phone: data.phone,
    email: data.email,
    mapEmbed: data.mapEmbed || data.map_embed || '',
    formTitle: data.formTitle || data.form_title || ''
  });

  useEffect(() => {
    const loadContactData = async () => {
      try {
        const data = await getContactContent();
        if (data) {
          setContactData(data);
        }
      } catch (error) {
        console.error('Error loading contact data:', error);
      }
    };

    loadContactData();
  }, []);

  // Rate limiting for contact form
const checkContactRateLimit = (): boolean => {
  const RATE_LIMIT_KEY = 'contact_attempts';
  const MAX_ATTEMPTS = 3;
  const LOCKOUT_DURATION = 10 * 60 * 1000; // 10 minutes
  
  const attempts = JSON.parse(localStorage.getItem(RATE_LIMIT_KEY) || '[]');
  const now = Date.now();
  
  // Clean old attempts
  const validAttempts = attempts.filter((timestamp: number) => now - timestamp < LOCKOUT_DURATION);
  
  if (validAttempts.length >= MAX_ATTEMPTS) {
    alert('Too many messages. Please try again later.');
    return false;
  }
  
  // Add current attempt
  validAttempts.push(now);
  localStorage.setItem(RATE_LIMIT_KEY, JSON.stringify(validAttempts));
  return true;
};

const sanitizeInput = (input: string): string => {
  return input
    .trim()
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .replace(/javascript:/gi, '') // Remove JS protocols
    .replace(/on\w+=/gi, '') // Remove event handlers
    .slice(0, 500); // Limit length
};

const validateForm = () => {
  if (!form.name.trim()) {
    alert("Please enter your name");
    return false;
  }
  if (!form.phone.trim()) {
    alert("Please enter your phone number");
    return false;
  }
  if (!form.message.trim()) {
    alert("Please enter your message");
    return false;
  }
  if (form.message.length > 500 || form.message.length < 5) {
    alert("Message must be between 5 and 500 characters");
    return false;
  }
  if (form.phone.length < 10 || !/^\d[\d\s\-\(\)]+$/.test(form.phone)) {
    alert("Please enter a valid phone number");
    return false;
  }
  if (!checkContactRateLimit()) {
    return false;
  }
  return true;
};

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isSubmitting) return;
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    try {
      const result = await addMessage({
        name: sanitizeInput(form.name),
        phone: sanitizeInput(form.phone),
        message: sanitizeInput(form.message)
      });
      
      if (result) {
        setSubmitSuccess(true);
        setForm({ name: "", phone: "", message: "" });
        
        // Reset success message after 5 seconds
        setTimeout(() => setSubmitSuccess(false), 5000);
      } else {
        alert("Failed to send message. Please try again.");
      }
    } catch (error) {
      console.error('Failed to send message:', error);
      alert("Failed to send message. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
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
                  <p className="text-muted-foreground text-sm whitespace-pre-line">
                    {contactData.address}
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-gold/15 flex items-center justify-center shrink-0">
                  <Phone className="text-gold" size={18} />
                </div>
                <div>
                  <h4 className="font-semibold text-foreground text-sm">Phone</h4>
                  <div className="flex gap-2">
                    <a href={`tel:${contactData.phone}`} className="text-muted-foreground text-sm hover:text-gold transition-colors">
                      {contactData.phone}
                    </a>
                    {contactData.phone && (
                      <a href={`https://wa.me/${contactData.phone.replace(/\D/g, "")}`} className="text-muted-foreground text-sm hover:text-gold transition-colors" target="_blank" rel="noopener noreferrer">
                        Chat on WhatsApp
                      </a>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-gold/15 flex items-center justify-center shrink-0">
                  <Mail className="text-gold" size={18} />
                </div>
                <div>
                  <h4 className="font-semibold text-foreground text-sm">Email</h4>
                  <a href={`mailto:${contactData.email}`} className="text-muted-foreground text-sm hover:text-gold transition-colors">
                    {contactData.email}
                  </a>
                </div>
              </div>
            </div>

            {/* Map */}
            <div className="rounded-lg overflow-hidden aspect-video">
              <iframe
                src={contactData.mapEmbed}
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
            <h3 className="text-lg font-semibold text-foreground mb-2">{contactData.formTitle}</h3>
            
            {submitSuccess && (
              <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-md flex items-center gap-2">
                <CheckCircle size={18} />
                <span className="text-sm">Message sent successfully! We'll get back to you soon.</span>
              </div>
            )}
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
              disabled={isSubmitting}
              className="w-full flex items-center justify-center gap-2 bg-gold text-accent-foreground px-6 py-4 rounded-md font-semibold hover:brightness-110 transition text-base disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-accent-foreground border-t-transparent rounded-full animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Send size={18} /> Send Message
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
