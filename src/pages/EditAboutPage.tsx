import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Save, Eye, EyeOff, ArrowLeft, Home, Target, Eye as EyeIcon } from "lucide-react";
import { checkAuth, clearAuth } from "@/lib/simple-auth";
import { getAboutContent, updateAboutContent, defaultAboutContent, type AboutContent } from "@/lib/about";

const EditAboutPage = () => {
  const [content, setContent] = useState<AboutContent>(defaultAboutContent);
  const [isPreview, setIsPreview] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is authenticated
    const isAuth = checkAuth();
    if (!isAuth) {
      navigate("/admin");
      return;
    }

    // Load content from database
    const loadContent = async () => {
      try {
        const data = await getAboutContent();
        if (data) {
          setContent(data);
          if (data.updated_at) {
            setLastUpdated(new Date(data.updated_at).toLocaleString());
          }
        }
      } catch (error) {
        console.error('Error loading about content:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadContent();
  }, [navigate]);

  const handleSave = async () => {
    try {
      const updated = await updateAboutContent(content);
      if (updated) {
        setContent(updated);
        setLastUpdated(new Date().toLocaleString());
        alert("About content saved successfully!");
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
      setContent(defaultAboutContent);
      setLastUpdated("");
      alert("Content reset to default! Click Save to apply changes.");
    }
  };

  const handleLogout = () => {
    clearAuth();
    navigate("/admin");
  };

  const AboutPreview = () => {
    return (
      <section className="section-padding bg-background">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground text-center mb-4">
            {content.title}
          </h2>
          <div className="w-16 h-1 bg-gold mx-auto mb-8 rounded-full" />
          <p className="text-muted-foreground text-center text-base md:text-lg mb-12 leading-relaxed">
            {content.description}
          </p>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-secondary rounded-lg p-6 flex gap-4">
              <div className="w-12 h-12 rounded-full bg-gold/20 flex items-center justify-center shrink-0">
                <Target className="text-gold" size={24} />
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-2">{content.mission_title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {content.mission_description}
                </p>
              </div>
            </div>
            <div className="bg-secondary rounded-lg p-6 flex gap-4">
              <div className="w-12 h-12 rounded-full bg-gold/20 flex items-center justify-center shrink-0">
                <EyeIcon className="text-gold" size={24} />
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-2">{content.vision_title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {content.vision_description}
                </p>
              </div>
            </div>
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
              <h1 className="text-xl font-semibold">About Page Preview</h1>
            </div>
            <button
              onClick={handleLogout}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
        <AboutPreview />
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
            <h1 className="text-xl font-semibold">Edit About Page</h1>
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
          {/* Title Section */}
          <div className="bg-card p-6 rounded-lg border border-border">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Home size={20} className="text-gold" />
              Page Title
            </h3>
            <input
              type="text"
              value={content.title}
              onChange={(e) => setContent({ ...content, title: e.target.value })}
              className="w-full px-4 py-3 rounded-md border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-gold"
              placeholder="About page title"
            />
          </div>

          {/* Description Section */}
          <div className="bg-card p-6 rounded-lg border border-border">
            <h3 className="text-lg font-semibold mb-4">Main Description</h3>
            <textarea
              value={content.description}
              onChange={(e) => setContent({ ...content, description: e.target.value })}
              className="w-full px-4 py-3 rounded-md border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-gold min-h-[120px] resize-vertical"
              placeholder="Main about section description"
              rows={4}
            />
          </div>

          {/* Mission Section */}
          <div className="bg-card p-6 rounded-lg border border-border">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Target size={20} className="text-gold" />
              Mission Section
            </h3>
            <div className="space-y-4">
              <input
                type="text"
                value={content.mission_title}
                onChange={(e) => setContent({ ...content, mission_title: e.target.value })}
                className="w-full px-4 py-3 rounded-md border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-gold"
                placeholder="Mission title"
              />
              <textarea
                value={content.mission_description}
                onChange={(e) => setContent({ ...content, mission_description: e.target.value })}
                className="w-full px-4 py-3 rounded-md border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-gold min-h-[100px] resize-vertical"
                placeholder="Mission description"
                rows={3}
              />
            </div>
          </div>

          {/* Vision Section */}
          <div className="bg-card p-6 rounded-lg border border-border">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <EyeIcon size={20} className="text-gold" />
              Vision Section
            </h3>
            <div className="space-y-4">
              <input
                type="text"
                value={content.vision_title}
                onChange={(e) => setContent({ ...content, vision_title: e.target.value })}
                className="w-full px-4 py-3 rounded-md border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-gold"
                placeholder="Vision title"
              />
              <textarea
                value={content.vision_description}
                onChange={(e) => setContent({ ...content, vision_description: e.target.value })}
                className="w-full px-4 py-3 rounded-md border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-gold min-h-[100px] resize-vertical"
                placeholder="Vision description"
                rows={3}
              />
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

export default EditAboutPage;
