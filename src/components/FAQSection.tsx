import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useState, useEffect } from "react";
import { Phone, Mail, MessageCircle } from "lucide-react";
import { getContactContent, defaultContactContent, type ContactContent } from "@/lib/contact";

const faqs = [
  {
    question: "What is the average cost of house construction in Tirunelveli?",
    answer: "House construction costs in Tirunelveli typically range from ₹1,600 to ₹3,000 per square foot depending on materials, design complexity, and location. At Kadambam Builders, we offer transparent pricing with detailed cost breakdowns for budget home construction and luxury projects."
  },
  {
    question: "How long does it take to build a house in Tamil Nadu?",
    answer: "A typical 2BHK house construction in Tirunelveli takes 6-9 months, while larger projects may require 12-18 months. As experienced house builders in Tirunelveli, we provide realistic timelines and ensure on-time delivery with regular project updates."
  },
  {
    question: "Do you provide construction loans assistance?",
    answer: "Yes, we assist clients with construction loan documentation and work with leading banks in Tamil Nadu. Our team helps streamline the loan approval process for residential and commercial construction projects."
  },
  {
    question: "What areas in Tirunelveli do you serve?",
    answer: "We provide construction services across Tirunelveli including Palayamkottai, Thiruvananthapuram Road, and surrounding areas. Our expertise extends throughout Tamil Nadu with completed projects in major cities and towns."
  },
  {
    question: "Are your construction materials certified?",
    answer: "Absolutely. We use only ISI-certified materials and follow DTCP guidelines for all construction projects in Tirunelveli. Quality assurance is our priority, ensuring durable and safe structures."
  },
  {
    question: "Do you offer post-construction maintenance?",
    answer: "Yes, we provide 1-year free maintenance service on all construction projects. Extended maintenance packages are available for residential and commercial properties across Tirunelveli and Tamil Nadu."
  }
];

const FAQSection = () => {
  const { ref, isVisible } = useScrollAnimation();
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [contactData, setContactData] = useState<ContactContent>(defaultContactContent);

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

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="section-padding bg-navy text-primary-foreground">
      <div ref={ref} className={`container mx-auto ${isVisible ? "animate-fade-up" : "opacity-0"}`}>
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-4">
          Frequently Asked Questions About <span className="text-gold">Construction in Tirunelveli</span>
        </h2>
        <div className="w-16 h-1 bg-gold mx-auto mb-12 rounded-full" />

        <div className="max-w-3xl mx-auto space-y-4">
          {faqs.map((faq, index) => (
            <div key={index} className="bg-background/5 rounded-lg overflow-hidden">
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-background/10 transition-colors"
              >
                <span className="font-medium">{faq.question}</span>
                {openIndex === index ? (
                  <ChevronUp className="text-gold" size={20} />
                ) : (
                  <ChevronDown className="text-gold" size={20} />
                )}
              </button>
              {openIndex === index && (
                <div className="px-6 pb-4 text-primary-foreground/80 leading-relaxed">
                  {faq.answer}
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <h3 className="text-xl font-semibold mb-4">Still Have Questions About Construction?</h3>
          <p className="text-primary-foreground/80 mb-6">
            Contact the best construction company in Tirunelveli for personalized consultation
          </p>
          <a
            href={`tel:${contactData.phone?.replace(/\s/g, '') || '+916374034451'}`}
            className="inline-flex items-center gap-2 bg-gold text-accent-foreground px-8 py-3 rounded-md font-semibold hover:brightness-110 transition"
          >
            Call Our Construction Experts
          </a>
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
