import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { login, user } = useAuth();
  const navigate = useNavigate();

  // Auto-login with demo vendor account
  useEffect(() => {
    const autoLogin = async () => {
      if (!user && !isLoading) {
        setIsLoading(true);
        const result = await login("vendor@example.com", "password123");
        if (result.success) {
          toast.success("Auto-logged in as demo vendor");
        }
        setIsLoading(false);
      }
    };
    autoLogin();
  }, []);

  useEffect(() => {
    if (user) {
      navigate(user.role === "VENDOR" ? "/vendor/dashboard" : "/company/dashboard");
    }
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const result = await login(email, password);

    if (result.success) {
      toast.success("Login successful!");
      // Navigate immediately using the user data from result
      const userData = result.user || user;
      if (userData) {
        const dashboardPath = userData.role === "VENDOR" ? "/vendor/dashboard" : "/company/dashboard";
        navigate(dashboardPath);
      }
    } else {
      toast.error(result.error || "Login failed");
    }

    setIsLoading(false);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-4 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary">
            <ShoppingCart className="h-6 w-6 text-primary-foreground" />
          </div>
          <CardTitle className="text-2xl font-bold">Welcome to Hourglass</CardTitle>
          <CardDescription>
            Sign in to access your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Signing in..." : "Sign In"}
            </Button>
          </form>
          <div className="mt-6 space-y-2 rounded-lg bg-muted p-4 text-sm">
            <p className="font-medium">Demo Accounts:</p>
            <p><strong>Vendor:</strong> vendor@example.com</p>
            <p><strong>Company:</strong> company@example.com</p>
            <p className="text-muted-foreground">Password: password123</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
