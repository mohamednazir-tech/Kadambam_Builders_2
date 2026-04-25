import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Save, Eye, Edit, Clock, Home } from "lucide-react";
import { toast } from "sonner";
import AdminSidebar from "@/components/AdminSidebar";
import { getGuideContent, updateGuideContent, defaultGuideContent, type GuideContent } from "@/lib/guide";

const EditGuidePage = () => {
  const [content, setContent] = useState<GuideContent>(defaultGuideContent);
  const [isPreview, setIsPreview] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadContent = async () => {
      try {
        const data = await getGuideContent();
        if (data) {
          setContent(data);
          if (data.updated_at) {
            setLastUpdated(new Date(data.updated_at).toLocaleString());
          }
        }
      } catch (error) {
        console.error('Error loading guide content:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadContent();
  }, []);

  // Get the content that should be shown in preview
  const getPreviewContent = () => {
    return content;
  };

  const handleSave = async () => {
    try {
      const updated = await updateGuideContent(content);
      if (updated) {
        setContent(updated);
        setLastUpdated(new Date().toLocaleString());
        toast.success("Guide content saved successfully!");
      } else {
        toast.error("Failed to save content. Please try again.");
      }
    } catch (error) {
      console.error('Error saving content:', error);
      toast.error("Failed to save content. Please try again.");
    }
  };

  const handleReset = () => {
    if (confirm("Are you sure you want to reset all content to default? This cannot be undone.")) {
      setContent(defaultGuideContent);
      setLastUpdated("");
      alert("Guide content reset to default! Click Save to apply changes.");
    }
  };

  const handleChange = (field: keyof GuideContent, value: string) => {
    setContent(prev => ({ ...prev, [field]: value }));
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen bg-muted">
        <AdminSidebar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading content...</p>
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
              <Link to="/house-construction-tirunelveli" className="flex items-center gap-2 text-gold hover:underline text-sm">
                <Eye size={16} /> Preview Guide
              </Link>
              <div className="flex flex-col">
                <h1 className="text-lg font-bold">Edit Construction Guide</h1>
                {lastUpdated && (
                  <p className="text-xs text-primary-foreground/60 flex items-center gap-1">
                    <Clock size={12} /> Last updated: {lastUpdated}
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
              <h2 className="text-2xl font-bold mb-4">{getPreviewContent().title}</h2>
              <p className="text-muted-foreground mb-6">{getPreviewContent().hero_description}</p>
              
              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div className="bg-muted p-4 rounded-lg">
                  <h3 className="font-semibold mb-2 text-gold">Basic Construction</h3>
                  <p className="text-2xl font-bold">{getPreviewContent().cost_basic}</p>
                </div>
                <div className="bg-muted p-4 rounded-lg">
                  <h3 className="font-semibold mb-2 text-gold">Premium Construction</h3>
                  <p className="text-2xl font-bold">{getPreviewContent().cost_premium}</p>
                </div>
              </div>

              <div className="bg-muted p-4 rounded-lg mb-6">
                <h3 className="font-semibold mb-3">Sample Cost Calculation</h3>
                <pre className="whitespace-pre-line text-sm">{getPreviewContent().sample_calculation}</pre>
              </div>

              <div className="grid md:grid-cols-3 gap-6 mb-6">
                <div className="bg-card p-4 rounded-lg">
                  <h3 className="font-semibold mb-2 text-gold">Foundation</h3>
                  <pre className="whitespace-pre-line text-sm">{getPreviewContent().materials.split('\n\n')[0]}</pre>
                </div>
                <div className="bg-card p-4 rounded-lg">
                  <h3 className="font-semibold mb-2 text-gold">Walls & Roof</h3>
                  <pre className="whitespace-pre-line text-sm">{getPreviewContent().materials.split('\n\n')[1]}</pre>
                </div>
                <div className="bg-card p-4 rounded-lg">
                  <h3 className="font-semibold mb-2 text-gold">Finishing</h3>
                  <pre className="whitespace-pre-line text-sm">{getPreviewContent().materials.split('\n\n')[2]}</pre>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Edit Mode */
          <div className="space-y-6">
            <div className="bg-card rounded-lg p-6 shadow-sm">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Edit size={20} className="text-blue-400" /> Edit Guide Content
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Page Title</label>
                  <input
                    type="text"
                    value={content.title}
                    onChange={(e) => handleChange("title", e.target.value)}
                    className="w-full px-4 py-3 rounded-md border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-gold"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Hero Description</label>
                  <textarea
                    value={content.hero_description}
                    onChange={(e) => handleChange("hero_description", e.target.value)}
                    rows={3}
                    className="w-full px-4 py-3 rounded-md border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-gold"
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">Basic Cost Range</label>
                    <input
                      type="text"
                      value={content.cost_basic}
                      onChange={(e) => handleChange("cost_basic", e.target.value)}
                      className="w-full px-4 py-3 rounded-md border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-gold"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">Premium Cost Range</label>
                    <input
                      type="text"
                      value={content.cost_premium}
                      onChange={(e) => handleChange("cost_premium", e.target.value)}
                      className="w-full px-4 py-3 rounded-md border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-gold"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Sample Cost Calculation</label>
                  <textarea
                    value={content.sample_calculation}
                    onChange={(e) => handleChange("sample_calculation", e.target.value)}
                    rows={6}
                    className="w-full px-4 py-3 rounded-md border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-gold"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Materials Guide</label>
                  <textarea
                    value={content.materials}
                    onChange={(e) => handleChange("materials", e.target.value)}
                    rows={12}
                    className="w-full px-4 py-3 rounded-md border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-gold"
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">Required Documents</label>
                    <textarea
                      value={content.legal_docs}
                      onChange={(e) => handleChange("legal_docs", e.target.value)}
                      rows={8}
                      className="w-full px-4 py-3 rounded-md border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-gold"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">Legal Regulations</label>
                    <textarea
                      value={content.legal_regs}
                      onChange={(e) => handleChange("legal_regs", e.target.value)}
                      rows={8}
                      className="w-full px-4 py-3 rounded-md border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-gold"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Timeline Information</label>
                  <textarea
                    value={content.timeline}
                    onChange={(e) => handleChange("timeline", e.target.value)}
                    rows={6}
                    className="w-full px-4 py-3 rounded-md border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-gold"
                  />
                </div>
              </div>

              <div className="flex gap-4 mt-6">
                <button
                  onClick={handleSave}
                  className="flex items-center gap-2 bg-gold text-accent-foreground px-6 py-3 rounded-md font-semibold hover:brightness-110 transition"
                >
                  <Save size={18} /> Save Changes
                </button>
                <button
                  onClick={handleReset}
                  className="flex items-center gap-2 bg-destructive text-destructive-foreground px-6 py-3 rounded-md font-semibold hover:bg-destructive/90 transition"
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

export default EditGuidePage;
