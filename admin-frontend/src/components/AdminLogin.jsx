import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {useNavigate} from "react-router-dom";
import { Eye, EyeOff, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address"),
  password: z
    .string()
    .min(1, "Password is required")
    .min(8, "Password must be at least 8 characters"),
});

export default function AdminLogin() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data) => {
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    console.log("Login attempt:", data);
    setIsLoading(false);
    navigate("/dashboard");
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{ backgroundColor: "hsl(var(--background))" }}
    >
      <Card
        className="w-full max-w-md mx-auto shadow-xl"
        style={{ borderColor: "hsl(var(--border))" }}
      >
        <CardHeader className="space-y-4 text-center">
          <div
            className="mx-auto w-12 h-12 rounded-full flex items-center justify-center"
            style={{ backgroundColor: "hsl(var(--primary)/0.1)" }}
          >
            <Shield style={{ color: "hsl(var(--primary))" }} />
          </div>
          <div className="space-y-2">
            <CardTitle style={{ color: "hsl(var(--foreground))" }}>
              Admin Portal - Sign In
            </CardTitle>
            <CardDescription style={{ color: "hsl(var(--muted-foreground))" }}>
              Enter your credentials to access the admin dashboard
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
              <Label
                htmlFor="email"
                style={{ color: "hsl(var(--foreground))" }}
              >
                Email Address
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@company.com"
                className="h-11"
                style={
                  errors.email ? { borderColor: "hsl(var(--destructive))" } : {}
                }
                {...register("email")}
              />
              {errors.email && (
                <p
                  style={{ color: "hsl(var(--destructive))", fontWeight: 500 }}
                >
                  {errors.email.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="password"
                style={{ color: "hsl(var(--foreground))" }}
              >
                Password
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  className="h-11 pr-12"
                  style={
                    errors.password
                      ? { borderColor: "hsl(var(--destructive))" }
                      : {}
                  }
                  {...register("password")}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-11 px-3 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff style={{ color: "hsl(var(--muted-foreground))" }} />
                  ) : (
                    <Eye style={{ color: "hsl(var(--muted-foreground))" }} />
                  )}
                </Button>
              </div>
              {errors.password && (
                <p
                  style={{ color: "hsl(var(--destructive))", fontWeight: 500 }}
                >
                  {errors.password.message}
                </p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full h-11 font-medium transition-colors"
              style={{
                backgroundColor: "hsl(var(--primary))",
                color: "hsl(var(--primary-foreground))",
              }}
              disabled={isLoading}
            >
              {isLoading ? "Signing In..." : "Sign In"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

