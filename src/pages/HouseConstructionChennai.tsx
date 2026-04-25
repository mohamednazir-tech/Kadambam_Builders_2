import { useState, useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import { getContactContent, defaultContactContent, type ContactContent } from "@/lib/contact";
import { Phone, Mail, MapPin, Clock, CheckCircle, AlertCircle } from "lucide-react";

const HouseConstructionChennai = () => {
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

  return (
    <>
      <Header />
      <main className="min-h-screen">
        {/* Hero Section */}
        <section className="section-padding bg-navy text-primary-foreground">
          <div className="container mx-auto text-center">
            <h1 className="text-3xl md:text-4xl font-bold mb-6">
              House Construction in Chennai: Complete Cost Guide 2026
            </h1>
            <p className="text-xl text-primary-foreground/80 max-w-3xl mx-auto mb-8">
              Everything you need to know about building a home in Chennai - from costs and materials 
              to construction timeline and legal requirements.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href={`tel:${contactData.phone?.replace(/\s/g, '') || '+916374034451'}`}
                className="flex items-center justify-center gap-2 bg-gold text-accent-foreground px-6 py-3 rounded-md font-semibold hover:brightness-110 transition"
              >
                <Phone size={20} /> Get Free Consultation
              </a>
              <a
                href="#contact"
                className="flex items-center justify-center gap-2 border-2 border-gold text-gold px-6 py-3 rounded-md font-semibold hover:bg-gold hover:text-accent-foreground transition"
              >
                <Mail size={20} /> Request Quote
              </a>
            </div>
          </div>
        </section>

        {/* Cost Breakdown */}
        <section className="section-padding bg-background">
          <div className="container mx-auto max-w-4xl">
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-12">
              House Construction Cost in Chennai (2026 Rates)
            </h2>
            
            <div className="grid md:grid-cols-2 gap-8 mb-12">
              <div className="bg-card p-6 rounded-lg shadow-sm">
                <h3 className="text-xl font-semibold mb-4 text-gold">Basic Construction</h3>
                <div className="text-3xl font-bold mb-2">₹1,800 - ₹2,200/sq.ft</div>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Standard quality materials</li>
                  <li>• Basic finishes and fixtures</li>
                  <li>• Simple architectural design</li>
                  <li>• No luxury amenities</li>
                </ul>
              </div>
              
              <div className="bg-card p-6 rounded-lg shadow-sm">
                <h3 className="text-xl font-semibold mb-4 text-gold">Premium Construction</h3>
                <div className="text-3xl font-bold mb-2">₹2,500 - ₹3,500/sq.ft</div>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• High-quality branded materials</li>
                  <li>• Premium finishes and fixtures</li>
                  <li>• Custom architectural design</li>
                  <li>• Modern amenities included</li>
                </ul>
              </div>
            </div>

            <div className="bg-muted p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-4">Sample Cost Calculation (1200 sq.ft 2BHK)</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span>Construction Cost (₹2,000/sq.ft):</span>
                  <span className="font-semibold">₹24,00,000</span>
                </div>
                <div className="flex justify-between">
                  <span>Government Approvals & Fees:</span>
                  <span className="font-semibold">₹2,00,000</span>
                </div>
                <div className="flex justify-between">
                  <span>Interior Finishes:</span>
                  <span className="font-semibold">₹4,00,000</span>
                </div>
                <div className="flex justify-between text-lg font-bold">
                  <span>Total Estimated Cost:</span>
                  <span className="text-gold">₹30,00,000</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Construction Process */}
        <section className="section-padding bg-navy text-primary-foreground">
          <div className="container mx-auto max-w-4xl">
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-12">
              Step-by-Step Construction Process
            </h2>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-gold rounded-full flex items-center justify-center text-sm font-bold">1</div>
                  <div>
                    <h3 className="font-semibold mb-2">Site Analysis & Planning</h3>
                    <p className="text-primary-foreground/80 text-sm">
                      Soil testing, plot survey, and architectural design based on your requirements 
                      and Chennai's building regulations.
                    </p>
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-gold rounded-full flex items-center justify-center text-sm font-bold">2</div>
                  <div>
                    <h3 className="font-semibold mb-2">Government Approvals</h3>
                    <p className="text-primary-foreground/80 text-sm">
                      CMDA/DTCP plan approval, building permit, and other necessary clearances 
                      from Chennai authorities.
                    </p>
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-gold rounded-full flex items-center justify-center text-sm font-bold">3</div>
                  <div>
                    <h3 className="font-semibold mb-2">Foundation Work</h3>
                    <p className="text-primary-foreground/80 text-sm">
                      Excavation, foundation laying, and basement construction with proper 
                      waterproofing for Chennai's water table.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-gold rounded-full flex items-center justify-center text-sm font-bold">4</div>
                  <div>
                    <h3 className="font-semibold mb-2">Superstructure Construction</h3>
                    <p className="text-primary-foreground/80 text-sm">
                      Column, beam, and slab construction using RCC structure with quality 
                      steel and concrete mix suitable for Chennai's climate.
                    </p>
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-gold rounded-full flex items-center justify-center text-sm font-bold">5</div>
                  <div>
                    <h3 className="font-semibold mb-2">Finishing Work</h3>
                    <p className="text-primary-foreground/80 text-sm">
                      Plumbing, electrical, flooring, painting, and fixture installation with 
                      weather-resistant materials.
                    </p>
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-gold rounded-full flex items-center justify-center text-sm font-bold">6</div>
                  <div>
                    <h3 className="font-semibold mb-2">Final Inspection & Handover</h3>
                    <p className="text-primary-foreground/80 text-sm">
                      Quality checks, government final inspection, and handing over with all 
                      necessary documents and warranties.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Materials Guide */}
        <section className="section-padding bg-background">
          <div className="container mx-auto max-w-4xl">
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-12">
              Best Materials for Chennai Climate
            </h2>
            
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-card p-6 rounded-lg shadow-sm">
                <h3 className="font-semibold mb-3 text-gold">Foundation</h3>
                <ul className="space-y-2 text-sm">
                  <li>• M20 Grade Concrete</li>
                  <li>• Fe500 Steel Bars</li>
                  <li>• Waterproof Chemicals</li>
                  <li>• Fly Ash Bricks</li>
                </ul>
              </div>
              
              <div className="bg-card p-6 rounded-lg shadow-sm">
                <h3 className="font-semibold mb-3 text-gold">Walls & Roof</h3>
                <ul className="space-y-2 text-sm">
                  <li>• AAC Blocks (Lightweight)</li>
                  <li>• Weather-resistant Paint</li>
                  <li>• Clay Roof Tiles</li>
                  <li>• Thermal Insulation</li>
                </ul>
              </div>
              
              <div className="bg-card p-6 rounded-lg shadow-sm">
                <h3 className="font-semibold mb-3 text-gold">Finishing</h3>
                <ul className="space-y-2 text-sm">
                  <li>• Vitrified Tiles</li>
                  <li>• UPVC Windows</li>
                  <li>• Marine Plywood</li>
                  <li>• Anti-corrosive Fittings</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Legal Requirements */}
        <section className="section-padding bg-muted">
          <div className="container mx-auto max-w-4xl">
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-12">
              Legal Requirements in Chennai
            </h2>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <CheckCircle className="text-green-600" size={20} />
                  Required Documents
                </h3>
                <ul className="space-y-2 text-sm">
                  <li>• Parent Document / Sale Deed</li>
                  <li>• Encumbrance Certificate</li>
                  <li>• Patta and Chitta</li>
                  <li>• Approved Building Plan</li>
                  <li>• Commencement Certificate</li>
                  <li>• Completion Certificate</li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <AlertCircle className="text-orange-600" size={20} />
                  Important Regulations
                </h3>
                <ul className="space-y-2 text-sm">
                  <li>• FSI/FAR rules as per CMDA</li>
                  <li>• Setback requirements</li>
                  <li>• Height restrictions</li>
                  <li>• Rainwater harvesting mandatory</li>
                  <li>• Solar water heater for new buildings</li>
                  <li>• STP for apartments above 10 units</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Timeline */}
        <section className="section-padding bg-navy text-primary-foreground">
          <div className="container mx-auto max-w-4xl">
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-12">
              Construction Timeline
            </h2>
            
            <div className="bg-background/10 p-6 rounded-lg">
              <div className="grid md:grid-cols-4 gap-6 text-center">
                <div>
                  <Clock className="text-gold mx-auto mb-2" size={32} />
                  <div className="font-semibold mb-1">1-2 Months</div>
                  <p className="text-sm text-primary-foreground/80">Planning & Approvals</p>
                </div>
                <div>
                  <Clock className="text-gold mx-auto mb-2" size={32} />
                  <div className="font-semibold mb-1">2-3 Months</div>
                  <p className="text-sm text-primary-foreground/80">Foundation & Structure</p>
                </div>
                <div>
                  <Clock className="text-gold mx-auto mb-2" size={32} />
                  <div className="font-semibold mb-1">2-3 Months</div>
                  <p className="text-sm text-primary-foreground/80">Finishing Work</p>
                </div>
                <div>
                  <Clock className="text-gold mx-auto mb-2" size={32} />
                  <div className="font-semibold mb-1">1 Month</div>
                  <p className="text-sm text-primary-foreground/80">Inspection & Handover</p>
                </div>
              </div>
              <div className="text-center mt-6">
                <div className="text-2xl font-bold text-gold">Total: 6-9 Months</div>
                <p className="text-sm text-primary-foreground/80">For a standard 2BHK house (1200 sq.ft)</p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="section-padding bg-background">
          <div className="container mx-auto text-center max-w-3xl">
            <h2 className="text-2xl md:text-3xl font-bold mb-6">
              Ready to Build Your Dream Home in Chennai?
            </h2>
            <p className="text-muted-foreground mb-8">
              Get expert guidance, transparent pricing, and quality construction from Chennai's 
              trusted builders. Schedule a free consultation today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href={`tel:${contactData.phone?.replace(/\s/g, '') || '+916374034451'}`}
                className="flex items-center justify-center gap-2 bg-gold text-accent-foreground px-8 py-4 rounded-md font-semibold hover:brightness-110 transition"
              >
                <Phone size={20} /> Call {contactData.phone || '+91 63740 34451'}
              </a>
              <a
                href="#contact"
                className="flex items-center justify-center gap-2 border-2 border-gold text-gold px-8 py-4 rounded-md font-semibold hover:bg-gold hover:text-accent-foreground transition"
              >
                <Mail size={20} /> Get Detailed Quote
              </a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  );
};

export default HouseConstructionChennai;
