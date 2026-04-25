import { useEffect, useState } from "react";
import { Phone, FileText } from "lucide-react";
import { getContactContent, defaultContactContent } from "@/lib/contact";

import img1 from "@/assets/project-1.jpg";
import img2 from "@/assets/project-2.jpg";
import img3 from "@/assets/project-3.jpg";
import img4 from "@/assets/project-4.jpg";
import img5 from "@/assets/project-5.jpg";
import img6 from "@/assets/project-6.jpg";

const images = [img1, img2, img3, img4, img5, img6];

const HeroSection = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
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

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 5000); // 5 sec

    return () => clearInterval(interval);
  }, []);

  return (
    <section id="home" className="relative min-h-screen w-full overflow-hidden">
      {/* Background Images */}
      {images.map((img, index) => (
        <img
          key={index}
          src={img}
          alt={`House construction project ${index + 1} in Tirunelveli by Kadambam Builders`}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
            index === currentIndex ? "opacity-100" : "opacity-0"
          } brightness-110 contrast-105`}
        />
      ))}

      {/* Overlay */}
      <div className="absolute inset-0 bg-navy-dark/40" />

      {/* Content */}
      <div className="relative z-10 flex items-start md:items-center justify-center min-h-screen px-4 pt-20 md:pt-0">
        <div className="w-full max-w-4xl text-center text-white">
          
          {/* Brand */}
          <p className="text-gold font-semibold tracking-widest uppercase text-xs sm:text-sm mb-3 animate-fade-in">
            Kadambam Builders, Tirunelveli
          </p>

          {/* Heading */}
          <h1 className="text-2xl sm:text-3xl md:text-5xl font-bold leading-snug md:leading-tight mb-4 animate-fade-up">
            Best Construction Company in Tirunelveli
          </h1>

          {/* Subtext */}
          <p className="text-sm sm:text-base md:text-xl text-white/90 mb-6 px-2 sm:px-0 animate-fade-up" style={{ animationDelay: "0.2s" }}>
            We build durable, well-designed homes and commercial spaces across Tirunelveli. From planning to handover, we focus on quality workmanship, clear pricing, and on-time delivery.
          </p>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center animate-fade-up" style={{ animationDelay: "0.4s" }}>
            <a
              href={`tel:${contactData.phone.replace(/\s/g, '')}`}
              className="w-full sm:w-auto bg-gold text-black px-6 sm:px-8 py-3 sm:py-4 rounded-md text-sm sm:text-base font-semibold text-center min-h-[44px] flex items-center justify-center gap-2 hover:brightness-110 transition"
            >
              <Phone size={16} /> Call Now
            </a>

            <a
              href="/house-construction-tirunelveli"
              className="w-full sm:w-auto border border-gold text-gold px-6 sm:px-8 py-3 sm:py-4 rounded-md text-sm sm:text-base font-semibold text-center min-h-[44px] flex items-center justify-center gap-2 hover:bg-gold hover:text-black transition"
            >
              <FileText size={16} /> View Complete Guide
            </a>

            <a
              href="#contact"
              className="w-full sm:w-auto bg-gold text-black px-6 sm:px-8 py-3 sm:py-4 rounded-md text-sm sm:text-base font-semibold text-center min-h-[44px] flex items-center justify-center hover:brightness-110 transition"
            >
              Get Free Quote
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
