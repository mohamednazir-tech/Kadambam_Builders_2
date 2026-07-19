import { useState, useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import { getContactContent, defaultContactContent, type ContactContent } from "@/lib/contact";
import { getGuideContent, defaultGuideContent, type GuideContent } from "@/lib/guide";
import { Phone, Mail, MapPin, Clock, CheckCircle, AlertCircle, Home, Users, Hammer, FileText, MessageSquare } from "lucide-react";

// Component interface with camelCase fields
interface GuideData {
  title: string;
  heroDescription: string;
  costBasic: string;
  costPremium: string;
  sampleCalculation: string;
  materials: string;
  legalDocs: string;
  legalRegs: string;
  timeline: string;
}

const HouseConstructionTirunelveli = () => {
  const [guideData, setGuideData] = useState<GuideData>({
    title: defaultGuideContent.title,
    heroDescription: defaultGuideContent.hero_description,
    costBasic: defaultGuideContent.cost_basic,
    costPremium: defaultGuideContent.cost_premium,
    sampleCalculation: defaultGuideContent.sample_calculation,
    materials: defaultGuideContent.materials,
    legalDocs: defaultGuideContent.legal_docs,
    legalRegs: defaultGuideContent.legal_regs,
    timeline: defaultGuideContent.timeline
  });
  const [contactData, setContactData] = useState<ContactContent>(defaultContactContent);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Load guide data from Supabase
    const loadGuideData = async () => {
      try {
        const data = await getGuideContent();
        if (data) {
          // Map snake_case fields to camelCase for component
          const mappedData: GuideData = {
            title: data.title,
            heroDescription: data.hero_description,
            costBasic: data.cost_basic,
            costPremium: data.cost_premium,
            sampleCalculation: data.sample_calculation,
            materials: data.materials,
            legalDocs: data.legal_docs,
            legalRegs: data.legal_regs,
            timeline: data.timeline
          };
          setGuideData(mappedData);
        }
      } catch (error) {
        console.error('Error loading guide data:', error);
      }
    };

    // Load contact data from database
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

    loadGuideData();
    loadContactData();
    setIsLoaded(true);
  }, []);

  // Don't render until client-side hydration is complete
  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-navy">
        <div className="text-white text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Header />
      <main className="min-h-screen">
        {/* Hero Section */}
        <section className="section-padding bg-navy text-primary-foreground">
          <div className="container mx-auto text-center">
            <h1 className="text-3xl md:text-4xl font-bold mb-6">
              {typeof guideData.title === 'string' ? guideData.title : ''}
            </h1>
            <p className="text-xl text-primary-foreground/80 max-w-3xl mx-auto mb-8">
              {typeof guideData.heroDescription === 'string' ? guideData.heroDescription : ''}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href={`tel:${contactData.phone?.replace(/\s/g, '') || '+916374034451'}`}
                className="flex items-center justify-center gap-2 bg-gold text-accent-foreground px-6 py-3 rounded-md font-semibold hover:brightness-110 transition"
              >
                <Phone size={20} /> Get Free Consultation
              </a>
              <a
                href="/#contact"
                className="flex items-center justify-center gap-2 border-2 border-gold text-gold px-6 py-3 rounded-md font-semibold hover:bg-gold hover:text-accent-foreground transition"
              >
                <Mail size={20} /> Request Quote
              </a>
            </div>
          </div>
        </section>

        {/* Quick Navigation */}
        <section className="section-padding bg-muted">
          <div className="container mx-auto">
            <h2 className="text-xl font-semibold text-center mb-8">Quick Navigation</h2>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 max-w-4xl mx-auto">
              <a
                href="/"
                className="flex flex-col items-center gap-2 p-4 bg-card rounded-lg hover:shadow-md transition text-center"
              >
                <Home className="text-gold" size={24} />
                <span className="text-sm font-medium">Home</span>
              </a>
              <a
                href="/#about"
                className="flex flex-col items-center gap-2 p-4 bg-card rounded-lg hover:shadow-md transition text-center"
              >
                <Users className="text-gold" size={24} />
                <span className="text-sm font-medium">About</span>
              </a>
              <a
                href="/#services"
                className="flex flex-col items-center gap-2 p-4 bg-card rounded-lg hover:shadow-md transition text-center"
              >
                <Hammer className="text-gold" size={24} />
                <span className="text-sm font-medium">Services</span>
              </a>
              <a
                href="/#projects"
                className="flex flex-col items-center gap-2 p-4 bg-card rounded-lg hover:shadow-md transition text-center"
              >
                <FileText className="text-gold" size={24} />
                <span className="text-sm font-medium">Projects</span>
              </a>
              <a
                href="/#contact"
                className="flex flex-col items-center gap-2 p-4 bg-card rounded-lg hover:shadow-md transition text-center"
              >
                <MessageSquare className="text-gold" size={24} />
                <span className="text-sm font-medium">Contact</span>
              </a>
            </div>
          </div>
        </section>

        {/* Cost Breakdown */}
        <section className="section-padding bg-background">
          <div className="container mx-auto max-w-4xl">
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-12">
              House Construction Cost in Tirunelveli (2026 Rates)
            </h2>
            
            <div className="grid md:grid-cols-2 gap-8 mb-12">
              <div className="bg-card p-6 rounded-lg shadow-sm">
                <h3 className="text-xl font-semibold mb-4 text-gold">Basic Construction</h3>
                <div className="text-3xl font-bold mb-2">{typeof guideData.costBasic === 'string' ? guideData.costBasic : ''}</div>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Standard quality materials</li>
                  <li>• Basic finishes and fixtures</li>
                  <li>• Simple architectural design</li>
                  <li>• No luxury amenities</li>
                </ul>
              </div>
              
              <div className="bg-card p-6 rounded-lg shadow-sm">
                <h3 className="text-xl font-semibold mb-4 text-gold">Premium Construction</h3>
                <div className="text-3xl font-bold mb-2">{typeof guideData.costPremium === 'string' ? guideData.costPremium : ''}</div>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• High-quality branded materials</li>
                  <li>• Premium finishes and fixtures</li>
                  <li>• Custom architectural design</li>
                  <li>• Modern amenities included</li>
                </ul>
              </div>
            </div>

            <div className="bg-card p-6 rounded-lg shadow-sm border-l-4 border-gold">
              <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
                <div className="w-8 h-8 bg-gold rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-sm">₹</span>
                </div>
                Sample Cost Calculation (1200 sq.ft 2BHK)
              </h3>
              <div className="space-y-4">
                {typeof guideData.sampleCalculation === 'string' ? 
                  guideData.sampleCalculation.split('\n').map((line, index) => {
                    const parts = line.split(':');
                    return (
                      <div key={index} className="flex justify-between items-center py-2 border-b border-border/50 last:border-0">
                        <span className="text-muted-foreground">{parts[0]}:</span>
                        <span className={`font-semibold ${parts[1]?.includes('Total') ? 'text-gold text-lg' : 'text-foreground'}`}>
                          {parts[1]}
                        </span>
                      </div>
                    );
                  }) : 
                  <div className="text-muted-foreground">No cost calculation available</div>
                }
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
                      and Tirunelveli's building regulations.
                    </p>
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-gold rounded-full flex items-center justify-center text-sm font-bold">2</div>
                  <div>
                    <h3 className="font-semibold mb-2">Government Approvals</h3>
                    <p className="text-primary-foreground/80 text-sm">
                      DTCP plan approval, building permit, and other necessary clearances 
                      from Tirunelveli authorities.
                    </p>
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-gold rounded-full flex items-center justify-center text-sm font-bold">3</div>
                  <div>
                    <h3 className="font-semibold mb-2">Foundation Work</h3>
                    <p className="text-primary-foreground/80 text-sm">
                      Excavation, foundation laying, and basement construction with proper 
                      waterproofing for Tirunelveli's soil conditions.
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
                      steel and concrete mix suitable for Tirunelveli's climate.
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
        <section className="section-padding bg-gradient-to-br from-slate-50 to-blue-50">
          <div className="container mx-auto max-w-6xl">
            {/* Section Header */}
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-gold bg-clip-text text-transparent">
                Best Materials for Tirunelveli Climate
              </h2>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                Specially selected materials that withstand Tirunelveli's tropical climate, 
                heavy monsoons, and high humidity while ensuring durability and comfort
              </p>
            </div>

            {/* Climate Badge */}
            <div className="flex justify-center mb-8">
              <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                Tropical Climate Optimized
              </div>
            </div>

            {/* Materials Grid */}
            <div className="grid md:grid-cols-3 gap-8 mb-12">
              {/* Foundation Materials */}
              <div className="group relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-blue-400 rounded-lg opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                <div className="relative bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-blue-100">
                  <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full mb-6 mx-auto">
                    <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                      <div className="w-4 h-4 bg-blue-600 rounded-full"></div>
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-center mb-4 text-blue-900">Foundation</h3>
                  <div className="space-y-3">
                    {typeof guideData.materials === 'string' && guideData.materials.split('\n\n')[0] ? 
                      guideData.materials.split('\n\n')[0].split('\n').map((item, index) => (
                        <div key={index} className="flex items-start gap-3">
                          <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                            <CheckCircle className="text-blue-600" size={14} />
                          </div>
                          <span className="text-sm text-gray-700">{item.replace('•', '').trim()}</span>
                        </div>
                      )) : 
                      <div className="text-sm text-gray-500">Loading foundation materials...</div>
                    }
                  </div>
                  <div className="mt-6 pt-6 border-t border-blue-100">
                    <div className="flex items-center justify-center gap-2 text-xs text-blue-600 font-medium">
                      <AlertCircle size={12} />
                      Resists moisture & soil erosion
                    </div>
                  </div>
                </div>
              </div>

              {/* Walls & Roof Materials */}
              <div className="group relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-green-600 to-green-400 rounded-lg opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                <div className="relative bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-green-100">
                  <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-full mb-6 mx-auto">
                    <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                      <Home className="text-green-600" size={16} />
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-center mb-4 text-green-900">Walls & Roof</h3>
                  <div className="space-y-3">
                    {typeof guideData.materials === 'string' && guideData.materials.split('\n\n')[1] ? 
                      guideData.materials.split('\n\n')[1].split('\n').map((item, index) => (
                        <div key={index} className="flex items-start gap-3">
                          <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                            <CheckCircle className="text-green-600" size={14} />
                          </div>
                          <span className="text-sm text-gray-700">{item.replace('•', '').trim()}</span>
                        </div>
                      )) : 
                      <div className="text-sm text-gray-500">Loading wall & roof materials...</div>
                    }
                  </div>
                  <div className="mt-6 pt-6 border-t border-green-100">
                    <div className="flex items-center justify-center gap-2 text-xs text-green-600 font-medium">
                      <AlertCircle size={12} />
                      Heat resistant & waterproof
                    </div>
                  </div>
                </div>
              </div>

              {/* Finishing Materials */}
              <div className="group relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-amber-600 to-amber-400 rounded-lg opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                <div className="relative bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-amber-100">
                  <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-amber-500 to-amber-600 rounded-full mb-6 mx-auto">
                    <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                      <Hammer className="text-amber-600" size={16} />
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-center mb-4 text-amber-900">Finishing</h3>
                  <div className="space-y-3">
                    {typeof guideData.materials === 'string' && guideData.materials.split('\n\n')[2] ? 
                      guideData.materials.split('\n\n')[2].split('\n').map((item, index) => (
                        <div key={index} className="flex items-start gap-3">
                          <div className="w-6 h-6 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                            <CheckCircle className="text-amber-600" size={14} />
                          </div>
                          <span className="text-sm text-gray-700">{item.replace('•', '').trim()}</span>
                        </div>
                      )) : 
                      <div className="text-sm text-gray-500">Loading finishing materials...</div>
                    }
                  </div>
                  <div className="mt-6 pt-6 border-t border-amber-100">
                    <div className="flex items-center justify-center gap-2 text-xs text-amber-600 font-medium">
                      <AlertCircle size={12} />
                      Durable & humidity resistant
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Climate Benefits Section */}
            <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
              <h3 className="text-2xl font-bold text-center mb-8 text-gray-900">Why These Materials for Tirunelveli?</h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <div className="w-6 h-6 bg-blue-500 rounded-full"></div>
                  </div>
                  <h4 className="font-semibold text-blue-900 mb-2">Heavy Rainfall</h4>
                  <p className="text-sm text-gray-600">Waterproof materials prevent seepage during monsoons</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <div className="w-6 h-6 bg-orange-500 rounded-full"></div>
                  </div>
                  <h4 className="font-semibold text-orange-900 mb-2">High Temperature</h4>
                  <p className="text-sm text-gray-600">Heat-resistant materials keep interiors cool</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <div className="w-6 h-6 bg-green-500 rounded-full"></div>
                  </div>
                  <h4 className="font-semibold text-green-900 mb-2">High Humidity</h4>
                  <p className="text-sm text-gray-600">Anti-fungal materials prevent moisture damage</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <div className="w-6 h-6 bg-purple-500 rounded-full"></div>
                  </div>
                  <h4 className="font-semibold text-purple-900 mb-2">Longevity</h4>
                  <p className="text-sm text-gray-600">Durable materials withstand tropical climate stress</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Legal Requirements */}
        <section className="section-padding bg-muted">
          <div className="container mx-auto max-w-4xl">
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-12">
              Legal Requirements in Tirunelveli
            </h2>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-card p-6 rounded-lg shadow-sm">
                <h3 className="font-semibold mb-6 flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <CheckCircle className="text-green-600" size={20} />
                  </div>
                  Required Documents
                </h3>
                <div className="space-y-3">
                  {typeof guideData.legalDocs === 'string' ? 
                    guideData.legalDocs.split('\n').map((doc, index) => (
                      <div key={index} className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
                        <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                          <span className="text-white text-xs font-bold">{index + 1}</span>
                        </div>
                        <span className="text-sm text-foreground">{doc.replace('•', '').trim()}</span>
                      </div>
                    )) : 
                    <div className="text-muted-foreground">No documents available</div>
                  }
                </div>
              </div>
              
              <div className="bg-card p-6 rounded-lg shadow-sm">
                <h3 className="font-semibold mb-6 flex items-center gap-3">
                  <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                    <AlertCircle className="text-orange-600" size={20} />
                  </div>
                  Important Regulations
                </h3>
                <div className="space-y-3">
                  {typeof guideData.legalRegs === 'string' ? 
                    guideData.legalRegs.split('\n').map((reg, index) => (
                      <div key={index} className="flex items-start gap-3 p-3 bg-orange-50 rounded-lg">
                        <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                          <span className="text-white text-xs font-bold">{index + 1}</span>
                        </div>
                        <span className="text-sm text-foreground">{reg.replace('•', '').trim()}</span>
                      </div>
                    )) : 
                    <div className="text-muted-foreground">No regulations available</div>
                  }
                </div>
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
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {typeof guideData.timeline === 'string' ? 
                guideData.timeline.split('\n\n').map((phase, phaseIndex) => {
                  const lines = phase.split('\n').filter(line => line.trim());
                  const title = lines[0];
                  const description = lines[1];
                  
                  return (
                    <div key={phaseIndex} className="bg-card p-6 rounded-lg shadow-sm border-l-4 border-gold relative">
                      <div className="absolute -top-3 -left-3 w-8 h-8 bg-gold rounded-full flex items-center justify-center">
                        <span className="text-white font-bold text-sm">{phaseIndex + 1}</span>
                      </div>
                      <h3 className="font-semibold mb-3 text-gold mt-2">{title}</h3>
                      <p className="text-sm text-primary-foreground/80">{description}</p>
                    </div>
                  );
                }) : 
                <div className="col-span-full text-center text-muted-foreground">No timeline available</div>
              }
            </div>
            
            <div className="mt-8 text-center">
              <div className="inline-flex items-center gap-2 bg-gold text-accent-foreground px-6 py-3 rounded-full font-semibold">
                <Clock size={20} />
                Total Timeline: 6-9 Months
              </div>
              <p className="text-sm text-primary-foreground/70 mt-2">For a standard 2BHK house (1200 sq.ft)</p>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="section-padding bg-background">
          <div className="container mx-auto text-center max-w-3xl">
            <h2 className="text-2xl md:text-3xl font-bold mb-6">
              Ready to Build Your Dream Home in Tirunelveli?
            </h2>
            <p className="text-muted-foreground mb-8">
              Get expert guidance, transparent pricing, and quality construction from Tirunelveli's 
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
                href="/#contact"
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

export default HouseConstructionTirunelveli;
