import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Lock, Mail } from "lucide-react";
import { toast } from "sonner";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error("Please fill in all fields");
      return;
    }

    setIsLoading(true);

    try {
      const response = await axios.post("http://localhost:4002/api/auth/login", {
        email,
        password,
      });

      // Store the token and user info
      sessionStorage.setItem("token", response.data.token);
      sessionStorage.setItem("user", JSON.stringify(response.data.user));

      toast.success("Login successful!");
      navigate("/chatbot"); // Redirect to the chatbot page
    } catch (error) {
      const errorMessage = error.response?.data?.error || "Login failed. Please try again.";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Animated Background Orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-br from-primary/40 to-accent/40 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-br from-accent/40 to-primary/40 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-br from-primary/30 to-accent/30 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      <div className="w-full max-w-md relative z-10 animate-fade-in">
        {/* Glassmorphism Login Card */}
        <div className="backdrop-blur-xl bg-white/5 rounded-3xl shadow-[0_8px_32px_0_rgba(0,0,0,0.5)] border border-white/10 p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-primary to-accent mb-6 shadow-lg backdrop-blur-sm border border-white/20 animate-scale-in">
              <Lock className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent animate-fade-in">
              Sign In
            </h1>
            <p className="text-white/70 mt-3 text-sm">
              Welcome back! Please enter your details.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Username Field */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium text-white/90">
                Email
              </Label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50 pointer-events-none transition-colors group-focus-within:text-primary" />
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-12 h-12 backdrop-blur-md bg-white/5 border-white/10 text-white placeholder:text-white/40 focus:bg-white/10 transition-all"
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium text-white/90">
                Password
              </Label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50 pointer-events-none transition-colors group-focus-within:text-primary" />
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-12 h-12 backdrop-blur-md bg-white/5 border-white/10 text-white placeholder:text-white/40 focus:bg-white/10 transition-all"
                  required
                />
              </div>
            </div>

            {/* Login Button */}
            <Button
              type="submit"
              variant="gradient"
              size="lg"
              className="w-full mt-8 h-12 text-base font-semibold hover:scale-[1.02] active:scale-[0.98] transition-transform shadow-lg"
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Signing in...
                </span>
              ) : (
                "Login"
              )}
            </Button>
          </form>

          {/* Links */}
          <div className="text-center mt-6 space-y-2">
            <a
              href="#"
              className="text-sm text-white/70 hover:text-primary transition-colors duration-200 story-link font-medium"
              onClick={(e) => {
                e.preventDefault();
                toast.info("Password reset functionality coming soon!");
              }}
            >
              Forgot Password?
            </a>
            <br />
            <a
              href="#"
              className="text-sm text-white/70 hover:text-primary transition-colors duration-200 story-link font-medium"
              onClick={(e) => {
                e.preventDefault();
                navigate("/signup");
              }}
            >
              Don't have an account? Sign Up
            </a>
          </div>
        </div>

        {/* Footer Text */}
        <p className="text-center text-sm text-white/60 mt-8 backdrop-blur-sm">
          By continuing, you agree to our{" "}
          <a href="#" className="text-primary hover:text-accent transition-colors story-link font-medium">
            Terms of Service
          </a>
        </p>
      </div>
    </div>
  );
};

export default Login;
