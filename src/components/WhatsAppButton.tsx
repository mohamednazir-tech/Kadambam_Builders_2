import { useState, useEffect } from "react";
import { MessageCircle } from "lucide-react";
import { getContactContent, defaultContactContent } from "@/lib/contact";

const WhatsAppButton = () => {
  const [contactData, setContactData] = useState(defaultContactContent);

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

  // Format phone number for WhatsApp (remove symbols, keep country code)
  const whatsappNumber = contactData.phone.replace(/\D/g, '');
  
  // Use proper encoding for maintainability
  const message = "Hi, I am interested in your construction services.";
  const encodedMessage = encodeURIComponent(message);

  return (
    <a
      href={`https://wa.me/${whatsappNumber}?text=${encodedMessage}`}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-[#25D366] flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
      aria-label="Chat on WhatsApp"
    >
      <MessageCircle className="text-primary-foreground" size={28} />
    </a>
  );
};

export default WhatsAppButton;
