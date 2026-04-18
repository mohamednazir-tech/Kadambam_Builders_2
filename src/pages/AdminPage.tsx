import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { getProjects, addProject, removeProject, type Project } from "@/lib/projects";
import { ArrowLeft, Trash2, Plus, Upload, Image as ImageIcon, LogOut } from "lucide-react";
import AdminLogin from "@/components/AdminLogin";

const AdminPage = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [projects, setProjects] = useState<Project[]>(getProjects);
  const [label, setLabel] = useState("");
  const [category, setCategory] = useState("Residential");
  const [preview, setPreview] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const auth = localStorage.getItem("adminAuth");
    if (auth === "true") {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = () => {
    setIsAuthenticated(true);
    localStorage.setItem("adminAuth", "true");
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem("adminAuth");
  };

  if (!isAuthenticated) {
    return <AdminLogin onLogin={handleLogin} />;
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => setPreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!label.trim() || !preview) return;
    const updated = addProject({ label: label.trim(), src: preview, category });
    setProjects(updated);
    setLabel("");
    setCategory("Residential");
    setPreview(null);
    if (fileRef.current) fileRef.current.value = "";
  };

  const handleRemove = (id: string) => {
    const updated = removeProject(id);
    setProjects(updated);
  };

  return (
    <div className="min-h-screen bg-muted">
      {/* Top bar */}
      <div className="bg-navy text-primary-foreground px-4 py-4">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/" className="flex items-center gap-2 text-gold hover:underline text-sm">
              <ArrowLeft size={16} /> Back to Site
            </Link>
            <h1 className="text-lg font-bold">Admin — Manage Projects</h1>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-destructive hover:text-red-400 text-sm transition-colors"
          >
            <LogOut size={16} /> Logout
          </button>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Add Project Form */}
        <form onSubmit={handleAdd} className="bg-card rounded-lg p-6 shadow-sm mb-8">
          <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            <Plus size={20} className="text-gold" /> Add New Project
          </h2>

          <div className="grid sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Project Name</label>
              <input
                type="text"
                required
                value={label}
                onChange={(e) => setLabel(e.target.value)}
                placeholder="e.g. Modern Villa"
                className="w-full px-4 py-3 rounded-md border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-gold"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-3 rounded-md border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-gold"
              >
                <option>Residential</option>
                <option>Commercial</option>
                <option>Renovation</option>
                <option>Interior</option>
              </select>
            </div>
          </div>

          {/* Image Upload */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-foreground mb-1">Project Image</label>
            <div
              onClick={() => fileRef.current?.click()}
              className="border-2 border-dashed border-border rounded-lg p-6 text-center cursor-pointer hover:border-gold transition-colors"
            >
              {preview ? (
                <img src={preview} alt="Preview" className="max-h-48 mx-auto rounded-md object-cover" />
              ) : (
                <div className="flex flex-col items-center gap-2 text-muted-foreground">
                  <Upload size={32} />
                  <p className="text-sm">Click to upload an image</p>
                </div>
              )}
            </div>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
          </div>

          <button
            type="submit"
            disabled={!label.trim() || !preview}
            className="w-full sm:w-auto flex items-center justify-center gap-2 bg-gold text-accent-foreground px-6 py-3 rounded-md font-semibold hover:brightness-110 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Plus size={18} /> Add Project
          </button>
        </form>

        {/* Projects List */}
        <div>
          <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            <ImageIcon size={20} className="text-gold" /> Current Projects ({projects.length})
          </h2>

          {projects.length === 0 ? (
            <p className="text-muted-foreground text-sm">No projects yet. Add one above!</p>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {projects.map((p) => (
                <div key={p.id} className="bg-card rounded-lg overflow-hidden shadow-sm group relative">
                  <img
                    src={p.src}
                    alt={p.label}
                    className="w-full aspect-square object-cover"
                  />
                  <div className="p-3">
                    <p className="font-medium text-foreground text-sm truncate">{p.label}</p>
                    <p className="text-xs text-muted-foreground">{p.category}</p>
                  </div>
                  <button
                    onClick={() => handleRemove(p.id)}
                    className="absolute top-2 right-2 w-8 h-8 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    aria-label={`Remove ${p.label}`}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
