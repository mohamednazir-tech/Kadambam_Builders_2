import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Save, Eye, Edit, MapPin, Phone, Mail } from "lucide-react";
import { toast } from "sonner";
import AdminSidebar from "@/components/AdminSidebar";
import { getContactContent, updateContactContent, defaultContactContent, type ContactContent } from "@/lib/contact";

const EditContactPage = () => {
  const [content, setContent] = useState<ContactContent>(defaultContactContent);
  const [isPreview, setIsPreview] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadContent = async () => {
      try {
        const data = await getContactContent();
        if (data) {
          setContent(data);
          if (data.updated_at) {
            setLastUpdated(new Date(data.updated_at).toLocaleString());
          }
        }
      } catch (error) {
        console.error('Error loading contact content:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadContent();
  }, []);

  const handleSave = async () => {
    // Validate email format with regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (content.email && !emailRegex.test(content.email)) {
      toast.error("Please enter a valid email address");
      return;
    }
    
    setLoading(true);
    try {
      const updated = await updateContactContent(content);
      if (updated) {
        setContent(updated);
        setLastUpdated(new Date().toLocaleString());
        toast.success("Contact information saved successfully!");
      } else {
        toast.error("Failed to save contact information. Please try again.");
      }
    } catch (error) {
      console.error('Error saving contact content:', error);
      toast.error("Failed to save contact information. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    if (confirm("Are you sure you want to reset all contact information to default? This cannot be undone.")) {
      setContent(defaultContactContent);
      setLastUpdated("");
      toast.info("Contact information reset to default! Click Save to apply changes.");
    }
  };

  const handleChange = (field: keyof ContactContent, value: string) => {
    setContent(prev => ({ ...prev, [field]: value }));
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen bg-muted">
        <AdminSidebar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading contact information...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-muted">
      <AdminSidebar />
      
      {/* Main Content */}
      <div className="flex-1">
        {/* Top bar */}
        <div className="bg-navy text-primary-foreground px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link to="/#contact" className="flex items-center gap-2 text-gold hover:underline text-sm">
                <Eye size={16} /> Preview Contact
              </Link>
              <div className="flex flex-col">
                <h1 className="text-lg font-bold">Edit Contact Information</h1>
                {lastUpdated && (
                  <p className="text-xs text-primary-foreground/60 flex items-center gap-1">
                    <Edit size={12} /> Last updated: {lastUpdated}
                  </p>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsPreview(!isPreview)}
                className="flex items-center gap-2 text-blue-400 hover:text-blue-300 text-sm transition-colors"
              >
                {isPreview ? <Edit size={16} /> : <Eye size={16} />}
                {isPreview ? "Edit Mode" : "Preview Mode"}
              </button>
            </div>
          </div>
        </div>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {isPreview ? (
          /* Preview Mode */
          <div className="space-y-8">
            <div className="bg-card rounded-lg p-6 shadow-sm">
              <h2 className="text-2xl font-bold mb-6 text-center">Contact Information Preview</h2>
              
              <div className="grid md:grid-cols-2 gap-8 mb-8">
                {/* Contact Info */}
                <div className="space-y-5">
                  <div className="flex gap-4">
                    <div className="w-10 h-10 rounded-full bg-gold/15 flex items-center justify-center shrink-0">
                      <MapPin className="text-gold" size={18} />
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground text-sm">Address</h4>
                      <p className="text-muted-foreground text-sm whitespace-pre-line">
                        {content.address}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex gap-4">
                    <div className="w-10 h-10 rounded-full bg-gold/15 flex items-center justify-center shrink-0">
                      <Phone className="text-gold" size={18} />
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground text-sm">Phone</h4>
                      <a href={`tel:${content.phone}`} className="text-muted-foreground text-sm hover:text-gold transition-colors">
                        {content.phone}
                      </a>
                    </div>
                  </div>
                  
                  <div className="flex gap-4">
                    <div className="w-10 h-10 rounded-full bg-gold/15 flex items-center justify-center shrink-0">
                      <Mail className="text-gold" size={18} />
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground text-sm">Email</h4>
                      <a href={`mailto:${content.email}`} className="text-muted-foreground text-sm hover:text-gold transition-colors">
                        {content.email}
                      </a>
                    </div>
                  </div>
                </div>

                {/* Map Preview */}
                <div className="rounded-lg overflow-hidden aspect-video">
                  <iframe
                    src={content.mapEmbed}
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
            </div>
          </div>
        ) : (
          /* Edit Mode */
          <div className="space-y-6">
            <div className="bg-card rounded-lg p-6 shadow-sm">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Edit size={20} className="text-blue-400" /> Edit Contact Information
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Address</label>
                  <textarea
                    value={content.address}
                    onChange={(e) => handleChange("address", e.target.value)}
                    rows={3}
                    className="w-full px-4 py-3 rounded-md border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-gold"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Phone Number</label>
                  <input
                    type="text"
                    value={content.phone}
                    onChange={(e) => handleChange("phone", e.target.value)}
                    className="w-full px-4 py-3 rounded-md border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-gold"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Email Address</label>
                  <input
                    type="email"
                    value={content.email}
                    onChange={(e) => handleChange("email", e.target.value)}
                    className="w-full px-4 py-3 rounded-md border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-gold"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Google Maps Embed URL</label>
                  <input
                    type="url"
                    value={content.mapEmbed}
                    onChange={(e) => handleChange("mapEmbed", e.target.value)}
                    className="w-full px-4 py-3 rounded-md border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-gold"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Contact Form Title</label>
                  <input
                    type="text"
                    value={content.formTitle}
                    onChange={(e) => handleChange("formTitle", e.target.value)}
                    className="w-full px-4 py-3 rounded-md border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-gold"
                  />
                </div>
              </div>

              <div className="flex gap-4 mt-6">
                <button
                  onClick={handleSave}
                  disabled={loading}
                  className="flex items-center gap-2 bg-gold text-accent-foreground px-6 py-3 rounded-md font-semibold hover:brightness-110 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? "Saving..." : <><Save size={18} /> Save Changes</>}
                </button>
                <button
                  onClick={handleReset}
                  disabled={loading}
                  className="flex items-center gap-2 bg-destructive text-destructive-foreground px-6 py-3 rounded-md font-semibold hover:bg-destructive/90 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Reset to Default
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      </div>
    </div>
  );
};

export default EditContactPage;
