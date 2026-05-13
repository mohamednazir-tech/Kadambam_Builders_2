import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { getProjects, addProject, removeProject, type Project } from "@/lib/projects";
import { getMessages, markMessageAsRead, deleteMessage, type ContactMessage } from "@/lib/messages";
import { checkAuth, clearAuth } from "@/lib/simple-auth";
import { Trash2, Plus, Upload, Image as ImageIcon, FolderOpen, Home, MessageSquare, Mail, Phone, User, Check, Clock, LogOut } from "lucide-react";
import SecureAdminLogin from "@/components/SecureAdminLogin";
import AdminSidebar from "@/components/AdminSidebar";

const AdminPage = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [activeTab, setActiveTab] = useState<'projects' | 'messages'>('projects');
  const [label, setLabel] = useState("");
  const [category, setCategory] = useState("Residential");
  const [preview, setPreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Check if user is authenticated on component mount
    const isAuth = checkAuth();
    if (isAuth) {
      setIsAuthenticated(true);
      loadProjects();
      loadMessages();
    } else {
      setIsAuthenticated(false);
      setMessages([]);
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      loadProjects();
      loadMessages();
    }
  }, [isAuthenticated]);

  const loadProjects = async () => {
    setIsLoading(true);
    try {
      const projectsData = await getProjects();
      setProjects(projectsData);
    } catch (error) {
      console.error('Error loading projects:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadMessages = async () => {
    const messagesData = await getMessages();
    setMessages(messagesData);
  };

  const handleMarkAsRead = async (id: string) => {
    const updated = await markMessageAsRead(id);
    if (updated) {
      loadMessages(); // Refresh the messages list
    }
  };

  const handleDeleteMessage = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this message?')) {
      const success = await deleteMessage(id);
      if (success) {
        loadMessages(); // Refresh the messages list
      }
    }
  };

  const unreadCount = messages.filter(msg => msg.status === 'new').length;

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    clearAuth();
    setUser(null);
    setIsAuthenticated(false);
    setMessages([]);
  };

  if (!isAuthenticated) {
    return <SecureAdminLogin onLogin={handleLogin} />;
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => setPreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!label.trim() || !preview) return;
    const added = await addProject({ label: label.trim(), src: preview, category });
    if (added) {
      await loadProjects();
      setLabel("");
      setCategory("Residential");
      setPreview(null);
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  const handleRemove = async (id: number) => {
    const updated = await removeProject(id);
    setProjects(updated);
  };

  return (
    <div className="flex min-h-screen bg-muted border-0 shadow-none outline-none">
      <AdminSidebar />
      
      {/* Main Content */}
      <div className="flex-1 border-0 shadow-none outline-none">
        {/* Top bar */}
        <div className="bg-navy text-primary-foreground px-6 py-4 border-0 shadow-none outline-none focus:outline-none focus:ring-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link to="/" className="flex items-center gap-2 text-gold hover:underline text-sm">
                <Home size={16} /> Back to Site
              </Link>
              <Link to="/house-construction-tirunelveli" className="flex items-center gap-2 text-gold hover:underline text-sm">
                View Complete Guide
              </Link>
              <h1 className="text-lg font-bold">Admin Dashboard</h1>
            </div>
            <div className="flex items-center gap-4">
              {unreadCount > 0 && (
                <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                  {unreadCount} new
                </span>
              )}
              <div className="flex items-center gap-2">
                <User size={16} />
                <span className="text-sm">{user?.email}</span>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 text-sm text-gold hover:text-gold/80 transition-colors"
              >
                <LogOut size={16} />
                Logout
              </button>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-background border-b border-border">
          <div className="container mx-auto px-4">
            <div className="flex gap-6">
              <button
                onClick={() => setActiveTab('projects')}
                className={`py-3 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'projects'
                    ? 'border-gold text-gold'
                    : 'border-transparent text-muted-foreground hover:text-foreground'
                }`}
              >
                <div className="flex items-center gap-2">
                  <FolderOpen size={16} />
                  Projects
                </div>
              </button>
              <button
                onClick={() => setActiveTab('messages')}
                className={`py-3 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'messages'
                    ? 'border-gold text-gold'
                    : 'border-transparent text-muted-foreground hover:text-foreground'
                }`}
              >
                <div className="flex items-center gap-2">
                  <MessageSquare size={16} />
                  Messages
                  {unreadCount > 0 && (
                    <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                      {unreadCount}
                    </span>
                  )}
                </div>
              </button>
            </div>
          </div>
        </div>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {activeTab === 'projects' ? (
          <>
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
          </>
        ) : (
          /* Messages Section */
          <div>
            <h2 className="text-lg font-semibold text-foreground mb-6 flex items-center gap-2">
              <MessageSquare size={20} className="text-gold" /> Contact Messages ({messages.length})
            </h2>

            {messages.length === 0 ? (
              <div className="text-center py-12">
                <MessageSquare size={48} className="text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No messages received yet.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`bg-card rounded-lg p-6 shadow-sm border-l-4 ${
                      message.status === 'new' ? 'border-l-gold' : 'border-l-transparent'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          message.status === 'new' ? 'bg-gold/15' : 'bg-muted'
                        }`}>
                          {message.status === 'new' ? (
                            <Clock size={18} className="text-gold" />
                          ) : (
                            <Check size={18} className="text-muted-foreground" />
                          )}
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold text-foreground">{message.name}</h3>
                            {message.status === 'new' && (
                              <span className="bg-gold text-accent-foreground text-xs px-2 py-0.5 rounded-full">
                                New
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {new Date(message.created_at).toLocaleString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {message.status === 'new' && (
                          <button
                            onClick={() => handleMarkAsRead(message.id)}
                            className="text-xs bg-green-100 text-green-800 px-3 py-1 rounded-md hover:bg-green-200 transition-colors"
                          >
                            Mark as Read
                          </button>
                        )}
                        <button
                          onClick={() => handleDeleteMessage(message.id)}
                          className="w-8 h-8 rounded-full bg-destructive/10 text-destructive hover:bg-destructive/20 transition-colors flex items-center justify-center"
                          aria-label="Delete message"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-sm">
                        <Phone size={14} className="text-muted-foreground" />
                        <a href={`tel:${message.phone}`} className="text-gold hover:underline">
                          {message.phone}
                        </a>
                      </div>
                      
                      <div className="bg-muted rounded-md p-4">
                        <p className="text-sm text-foreground whitespace-pre-wrap">{message.message}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
      </div>
    </div>
  );
};

export default AdminPage;
