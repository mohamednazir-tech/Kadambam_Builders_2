import { useState } from "react";
import { Lock, Eye, EyeOff } from "lucide-react";

const AdminLogin = ({ onLogin }: { onLogin: () => void }) => {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === "admin123") {
      onLogin();
    } else {
      setError("Invalid password");
      setPassword("");
    }
  };

  return (
    <div className="min-h-screen bg-navy flex items-center justify-center px-4">
      <div className="bg-card rounded-lg shadow-lg p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gold rounded-full flex items-center justify-center mx-auto mb-4">
            <Lock size={32} className="text-accent-foreground" />
          </div>
          <h1 className="text-2xl font-bold text-foreground mb-2">Admin Login</h1>
          <p className="text-muted-foreground">Enter your password to access the admin panel</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError("");
                }}
                placeholder="Enter admin password"
                className="w-full px-4 py-3 pr-12 rounded-md border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-gold"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {error && (
              <p className="text-destructive text-sm mt-2">{error}</p>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-gold text-accent-foreground py-3 rounded-md font-semibold hover:brightness-110 transition"
          >
            Login to Admin Panel
          </button>
        </form>

        <div className="mt-6 text-center">
          <a
            href="/"
            className="text-muted-foreground hover:text-gold text-sm transition-colors"
          >
            ← Back to Website
          </a>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
