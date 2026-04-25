import { Link, useLocation, useNavigate } from "react-router-dom";
import { 
  Home, 
  FileText, 
  MessageSquare, 
  Shield, 
  LogOut,
  ChevronRight,
  FolderOpen,
  Info,
  Wrench,
  Star
} from "lucide-react";
import { clearAuth } from "@/lib/simple-auth";

const AdminSidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const menuItems = [
    {
      title: "Dashboard",
      icon: Home,
      href: "/admin",
      color: "text-gold"
    },
    {
      title: "Manage Projects",
      icon: FolderOpen,
      href: "/admin",
      color: "text-gold"
    },
    {
      title: "Edit Guide",
      icon: FileText,
      href: "/admin/edit-guide",
      color: "text-blue-400"
    },
    {
      title: "Edit Contact",
      icon: MessageSquare,
      href: "/admin/edit-contact",
      color: "text-blue-400"
    },
    {
      title: "Edit About",
      icon: Info,
      href: "/admin/edit-about",
      color: "text-blue-400"
    },
    {
      title: "Edit Services",
      icon: Wrench,
      href: "/admin/edit-services",
      color: "text-blue-400"
    },
    {
      title: "Manage Testimonials",
      icon: Star,
      href: "/admin/edit-testimonials",
      color: "text-blue-400"
    },
    {
      title: "Security Settings",
      icon: Shield,
      href: "/admin/edit-password",
      color: "text-blue-400"
    }
  ];

  const handleLogout = () => {
    clearAuth();
    navigate("/admin");
  };

  return (
    <div className="w-64 bg-navy text-primary-foreground min-h-screen flex flex-col">
      {/* Logo/Brand */}
      <div className="p-4">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-gold rounded-lg flex items-center justify-center">
            <FolderOpen size={20} className="text-accent-foreground" />
          </div>
          <div>
            <h2 className="text-lg font-bold">Admin Panel</h2>
            <p className="text-xs text-primary-foreground/60">Kadambam Builders</p>
          </div>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 px-4 space-y-2">
        {menuItems.map((item, index) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.href;
          
          return (
            <Link
              key={index}
              to={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                isActive 
                  ? "bg-gold/20 text-gold" 
                  : "hover:bg-navy-light text-primary-foreground/80 hover:text-primary-foreground"
              }`}
            >
              <Icon size={18} className={isActive ? "text-gold" : item.color} />
              <span className="text-sm font-medium">{item.title}</span>
              {isActive && <ChevronRight size={16} className="ml-auto text-gold" />}
            </Link>
          );
        })}
      </nav>

      {/* Logout Button */}
      <div className="p-4 border-t border-white/5">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left text-destructive hover:bg-destructive/20 transition-colors active:scale-95"
        >
          <LogOut size={18} />
          <span className="text-sm font-medium">Logout</span>
        </button>
      </div>
    </div>
  );
};

export default AdminSidebar;
