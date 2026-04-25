import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Save, Eye, EyeOff, Shield } from "lucide-react";
import { toast } from "sonner";
import AdminSidebar from "@/components/AdminSidebar";
import { getCurrentPassword, validateCurrentPassword } from "@/lib/simple-auth";

interface AdminCredentials {
  username: string;
  password: string;
}

const defaultCredentials: AdminCredentials = {
  username: "admin",
  password: "admin123"
};

const EditPasswordPage = () => {
  const [credentials, setCredentials] = useState<AdminCredentials>(defaultCredentials);
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem("adminAuth");
    const savedTimestamp = localStorage.getItem("adminAuthTimestamp");
    
    if (saved) {
      setCredentials(JSON.parse(saved));
      if (savedTimestamp) {
        setLastUpdated(new Date(parseInt(savedTimestamp)).toLocaleString());
      }
    }
  }, []);

  const handleSave = () => {
    // Validation
    if (newPassword && newPassword.length < 6) {
      toast.error("Password must be at least 6 characters long");
      return;
    }

    if (newPassword && newPassword !== confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }

    // If changing password, validate current password first
    if (newPassword && !validateCurrentPassword(currentPassword)) {
      toast.error("Current password is incorrect");
      return;
    }

    setLoading(true);

    if (newPassword) {
      // Update password
      const updatedCredentials = {
        ...credentials,
        password: newPassword
      };
      localStorage.setItem("adminAuth", JSON.stringify(updatedCredentials));
      localStorage.setItem("adminAuthTimestamp", Date.now().toString());
      setCredentials(updatedCredentials);
      toast.success("Password updated successfully!");
      setCurrentPassword(""); // Clear current password field
    } else {
      // Just save current credentials
      localStorage.setItem("adminCredentials", JSON.stringify(credentials));
      toast.success("Credentials saved successfully!");
    }

    // Clear form fields
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setLoading(false);
  };

  const handleReset = () => {
    if (confirm("Are you sure you want to reset to default credentials? (admin/admin123)")) {
      setCredentials(defaultCredentials);
      localStorage.setItem("adminCredentials", JSON.stringify(defaultCredentials));
      localStorage.removeItem("adminCredentialsTimestamp");
      setNewPassword("");
      setConfirmPassword("");
      setLastUpdated("");
      toast.info("Reset to default credentials");
    }
  };

  return (
    <div className="flex min-h-screen bg-muted">
      <AdminSidebar />
      
      {/* Main Content */}
      <div className="flex-1">
        {/* Top bar */}
        <div className="bg-navy text-primary-foreground px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex flex-col">
                <h1 className="text-lg font-bold flex items-center gap-2">
                  <Shield size={20} /> Admin Security Settings
                </h1>
                <p className="text-xs text-primary-foreground/60">
                  Manage admin credentials and access
                </p>
              </div>
            </div>
          </div>
        </div>

      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <div className="space-y-6">
          {/* Current Credentials */}
          <div className="bg-card rounded-lg p-6 shadow-sm">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Shield size={20} className="text-blue-400" /> Current Credentials
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Username</label>
                <input
                  type="text"
                  value={credentials.username}
                  onChange={(e) => setCredentials(prev => ({ ...prev, username: e.target.value }))}
                  className="w-full px-4 py-3 rounded-md border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-gold"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Current Password</label>
                <div className="relative">
                  <input
                    type={showCurrentPassword ? "text" : "password"}
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="Enter current password to change"
                    className="w-full px-4 py-3 pr-12 rounded-md border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-gold"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showCurrentPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Change Password */}
          <div className="bg-card rounded-lg p-6 shadow-sm">
            <h2 className="text-lg font-semibold mb-4">Change Password</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">New Password</label>
                <div className="relative">
                  <input
                    type={showNewPassword ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter new password (min 6 characters)"
                    className="w-full px-4 py-3 pr-12 rounded-md border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-gold"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Confirm New Password</label>
                <div className="relative">
                  <input
                    type={showNewPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm new password"
                    className="w-full px-4 py-3 pr-12 rounded-md border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-gold"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {newPassword && confirmPassword && (
                <div className="text-sm">
                  {newPassword === confirmPassword ? (
                    <p className="text-green-600 flex items-center gap-1">
                      ✓ Passwords match
                    </p>
                  ) : (
                    <p className="text-red-600 flex items-center gap-1">
                      ✗ Passwords do not match
                    </p>
                  )}
                </div>
              )}

              {newPassword && newPassword.length < 6 && (
                <p className="text-red-600 text-sm">Password must be at least 6 characters long</p>
              )}
            </div>
          </div>

          {/* Security Notes */}
          <div className="bg-muted rounded-lg p-4">
            <h3 className="font-semibold mb-2 text-sm">🔒 Security Notes</h3>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Use a strong password with letters, numbers, and symbols</li>
              <li>• Change your password regularly</li>
              <li>• Never share your admin credentials</li>
              <li>• Default credentials: admin/admin123</li>
              <li>• Passwords are stored in localStorage (client-side only)</li>
            </ul>
          </div>

          {/* Actions */}
          <div className="flex gap-4">
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
      </div>
    </div>
  );
};

export default EditPasswordPage;
