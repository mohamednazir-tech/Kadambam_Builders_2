import { Helmet } from "react-helmet-async";

import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";
import ServicesSection from "@/components/ServicesSection";
import SEOContentSection from "@/components/SEOContentSection";
import ProjectsSection from "@/components/ProjectsSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import WhyChooseUsSection from "@/components/WhyChooseUsSection";
import FAQSection from "@/components/FAQSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";

const Index = () => (
  <>
    <Helmet>
      <meta name="msvalidate.01" content="973C87FE1FF71240E698A5E054A2A71F" />
      <title>Best Builders in Tirunelveli | Construction Company | Kadambam Builders</title>

      <meta
        name="description"
        content="Best builders in Tirunelveli for residential & commercial construction. Expert house builders, civil contractors offering quality construction services at competitive prices."
      />

      <meta
        name="keywords"
        content="Best Builders in Tirunelveli, Builders in Tirunelveli, Construction Company Tirunelveli, House Construction Tirunelveli, Residential Construction Tirunelveli, Commercial Construction Tirunelveli, Civil Contractors Tirunelveli, Building Contractors Tirunelveli"
      />

      <link
        rel="canonical"
        href="https://kadambambuilders.com/"
      />

      <meta
        property="og:type"
        content="website"
      />

      <meta
        property="og:title"
        content="Best Builders in Tirunelveli | Construction Company | Kadambam Builders"
      />

      <meta
        property="og:description"
        content="Best builders in Tirunelveli for residential & commercial construction. Expert house builders, civil contractors offering quality construction services at competitive prices."
      />

      <meta
        property="og:url"
        content="https://kadambambuilders.com/"
      />

      <meta
        property="og:image"
        content="https://kadambambuilders.com/og-image.jpg"
      />

      <meta
        property="og:site_name"
        content="Kadambam Builders"
      />

      <meta
        name="twitter:card"
        content="summary_large_image"
      />

      <meta
        name="twitter:title"
        content="Best Builders in Tirunelveli | Construction Company | Kadambam Builders"
      />

      <meta
        name="twitter:description"
        content="Best builders in Tirunelveli for residential & commercial construction. Expert house builders, civil contractors offering quality construction services at competitive prices."
      />

      <meta
        name="twitter:image"
        content="https://kadambambuilders.com/og-image.jpg"
      />
    </Helmet>

    <Header />

    <main>
      <HeroSection />
      <AboutSection />
      <ServicesSection />
      <SEOContentSection />
      <ProjectsSection />
      <TestimonialsSection />
      <WhyChooseUsSection />
      <FAQSection />
      <ContactSection />
    </main>

    <Footer />
    <WhatsAppButton />
  </>
);

export default Index;