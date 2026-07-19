import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Save, Eye, ArrowLeft, Home, Building2, Hammer, FileCheck, Paintbrush, Wrench } from "lucide-react";
import { checkAuth, clearAuth } from "@/lib/simple-auth";
import { getServicesContent, updateServicesContent, defaultServicesContent, type ServicesContent } from "@/lib/services";

const iconOptions = [
  { value: "Home", label: "Home", icon: Home },
  { value: "Building2", label: "Building", icon: Building2 },
  { value: "Hammer", label: "Hammer", icon: Hammer },
  { value: "FileCheck", label: "File Check", icon: FileCheck },
  { value: "Paintbrush", label: "Paintbrush", icon: Paintbrush },
  { value: "Wrench", label: "Wrench", icon: Wrench },
];

const EditServicesPage = () => {
  const [content, setContent] = useState<ServicesContent>(defaultServicesContent);
  const [isPreview, setIsPreview] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const isAuth = checkAuth();
    if (!isAuth) {
      navigate("/admin");
      return;
    }

    const loadContent = async () => {
      try {
        const data = await getServicesContent();
        if (data) {
          setContent(data);
          if (data.updated_at) {
            setLastUpdated(new Date(data.updated_at).toLocaleString());
          }
        }
      } catch (error) {
        console.error('Error loading services content:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadContent();
  }, [navigate]);

  const handleSave = async () => {
    try {
      const updated = await updateServicesContent(content);
      if (updated) {
        setContent(updated);
        setLastUpdated(new Date().toLocaleString());
        alert("Services content saved successfully!");
      } else {
        alert("Failed to save content. Please try again.");
      }
    } catch (error) {
      console.error('Error saving content:', error);
      alert("Failed to save content. Please try again.");
    }
  };

  const handleReset = () => {
    if (window.confirm("Are you sure you want to reset to default content?")) {
      setContent(defaultServicesContent);
      setLastUpdated("");
      alert("Content reset to default! Click Save to apply changes.");
    }
  };

  const handleLogout = () => {
    clearAuth();
    navigate("/admin");
  };

  const getIconComponent = (iconName: string) => {
    const iconOption = iconOptions.find(opt => opt.value === iconName);
    return iconOption ? iconOption.icon : Home;
  };

  const ServicesPreview = () => {
    return (
      <section className="section-padding bg-muted">
        <div className="container mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground text-center mb-4">
            {content.section_title}
          </h2>
          {content.section_description && (
            <p className="text-muted-foreground text-center text-base md:text-lg mb-8 leading-relaxed">
              {content.section_description}
            </p>
          )}
          <div className="text-center mb-8">
            <a 
              href={content.guide_link_url}
              className="text-gold hover:underline font-medium"
            >
              {content.guide_link_text}
            </a>
          </div>
          <div className="w-16 h-1 bg-gold mx-auto mb-12 rounded-full" />

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {[1, 2, 3, 4, 5].map((num) => {
              const IconComponent = getIconComponent(content[`service${num}_icon` as keyof ServicesContent] as string);
              return (
                <div
                  key={num}
                  className="bg-card rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow group"
                >
                  <div className="w-14 h-14 rounded-lg bg-gold/10 flex items-center justify-center mb-4 group-hover:bg-gold/20 transition-colors">
                    <IconComponent className="text-gold" size={28} />
                  </div>
                  <h3 className="font-semibold text-foreground text-lg mb-2">
                    {content[`service${num}_title` as keyof ServicesContent]}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {content[`service${num}_description` as keyof ServicesContent]}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading content...</p>
        </div>
      </div>
    );
  }

  if (isPreview) {
    return (
      <div className="min-h-screen bg-background">
        <div className="bg-card border-b border-border px-6 py-4">
          <div className="container mx-auto flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setIsPreview(false)}
                className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
              >
                <ArrowLeft size={20} />
                Back to Editor
              </button>
              <h1 className="text-xl font-semibold">Services Page Preview</h1>
            </div>
            <button
              onClick={handleLogout}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
        <ServicesPreview />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-card border-b border-border px-6 py-4">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/admin")}
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft size={20} />
              Back to Admin
            </button>
            <h1 className="text-xl font-semibold">Edit Services Page</h1>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsPreview(true)}
              className="flex items-center gap-2 px-4 py-2 bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/80 transition-colors"
            >
              <Eye size={18} />
              Preview
            </button>
            <button
              onClick={handleLogout}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      <div className="container mx-auto max-w-4xl p-6">
        {lastUpdated && (
          <div className="mb-6 p-4 bg-muted rounded-lg">
            <p className="text-sm text-muted-foreground">
              Last updated: {lastUpdated}
            </p>
          </div>
        )}

        <div className="space-y-8">
          {/* Section Title and Description */}
          <div className="bg-card p-6 rounded-lg border border-border">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Wrench size={20} className="text-gold" />
              Section Header
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Section Title</label>
                <input
                  type="text"
                  value={content.section_title}
                  onChange={(e) => setContent({ ...content, section_title: e.target.value })}
                  className="w-full px-4 py-3 rounded-md border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-gold"
                  placeholder="Services section title"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Section Description (Optional)</label>
                <textarea
                  value={content.section_description || ""}
                  onChange={(e) => setContent({ ...content, section_description: e.target.value })}
                  className="w-full px-4 py-3 rounded-md border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-gold min-h-[80px] resize-vertical"
                  placeholder="Services section description"
                  rows={3}
                />
              </div>
            </div>
          </div>

          {/* Services */}
          {[1, 2, 3, 4, 5].map((num) => (
            <div key={num} className="bg-card p-6 rounded-lg border border-border">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                {(() => {
                  const IconComponent = getIconComponent(content[`service${num}_icon` as keyof ServicesContent] as string);
                  return <IconComponent size={20} className="text-gold" />;
                })()}
                Service {num}
              </h3>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">Icon</label>
                    <select
                      value={content[`service${num}_icon` as keyof ServicesContent]}
                      onChange={(e) => setContent({ 
                        ...content, 
                        [`service${num}_icon`]: e.target.value 
                      } as any)}
                      className="w-full px-4 py-3 rounded-md border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-gold"
                    >
                      {iconOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">Service Title</label>
                    <input
                      type="text"
                      value={content[`service${num}_title` as keyof ServicesContent]}
                      onChange={(e) => setContent({ 
                        ...content, 
                        [`service${num}_title`]: e.target.value 
                      } as any)}
                      className="w-full px-4 py-3 rounded-md border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-gold"
                      placeholder="Service title"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Service Description</label>
                  <textarea
                    value={content[`service${num}_description` as keyof ServicesContent]}
                    onChange={(e) => setContent({ 
                      ...content, 
                      [`service${num}_description`]: e.target.value 
                    } as any)}
                    className="w-full px-4 py-3 rounded-md border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-gold min-h-[100px] resize-vertical"
                    placeholder="Service description"
                    rows={3}
                  />
                </div>
              </div>
            </div>
          ))}

          {/* Guide Link */}
          <div className="bg-card p-6 rounded-lg border border-border">
            <h3 className="text-lg font-semibold mb-4">Guide Link</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Link Text</label>
                <input
                  type="text"
                  value={content.guide_link_text}
                  onChange={(e) => setContent({ ...content, guide_link_text: e.target.value })}
                  className="w-full px-4 py-3 rounded-md border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-gold"
                  placeholder="Link text"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Link URL</label>
                <input
                  type="text"
                  value={content.guide_link_url}
                  onChange={(e) => setContent({ ...content, guide_link_url: e.target.value })}
                  className="w-full px-4 py-3 rounded-md border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-gold"
                  placeholder="/house-construction-tirunelveli"
                />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={handleSave}
              className="flex items-center justify-center gap-2 bg-gold text-accent-foreground px-6 py-3 rounded-md font-semibold hover:brightness-110 transition"
            >
              <Save size={18} />
              Save Changes
            </button>
            <button
              onClick={handleReset}
              className="flex items-center justify-center gap-2 bg-destructive text-destructive-foreground px-6 py-3 rounded-md font-semibold hover:brightness-110 transition"
            >
              Reset to Default
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditServicesPage;
