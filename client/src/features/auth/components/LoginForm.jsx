import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { login } from "@/lib/api";
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
import { useToast } from "@/hooks/use-toast";
import { Video, Eye, EyeOff, Leaf, Sparkles } from "lucide-react";

export function LoginForm() {
  const { login: authLogin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const from = location.state?.from?.pathname || "/dashboard";

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm();

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      const result = await login(data.email, data.password);
      authLogin(result.user, result.token);

      toast({
        title: "Login successful",
        description: `Welcome back, ${result.user.firstName}!`,
      });

      navigate(from, { replace: true });
    } catch (error) {
      console.error("Login error:", error);

      if (
        error.message.includes("Invalid credentials") ||
        error.message.includes("401")
      ) {
        setError("email", { message: "Invalid email or password" });
        setError("password", { message: "Invalid email or password" });
      } else {
        toast({
          variant: "destructive",
          title: "Login failed",
          description: error.message || "An unexpected error occurred",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-eco-cream via-white to-eco-sand/30 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-eco-leaf/5 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-eco-sage/5 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-eco-earth/5 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-md w-full relative z-10">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="relative">
              <Video className="h-16 w-16 text-eco-leaf" />
              <Leaf className="h-6 w-6 text-eco-sage absolute -top-2 -right-2 animate-float" />
              <Sparkles className="h-4 w-4 text-eco-earth absolute -bottom-1 -left-1 animate-pulse" />
            </div>
          </div>
          <h1 className="font-eco text-4xl font-bold text-eco-forest mb-2">
            VideoStream
          </h1>
          <p className="text-eco-forest/70 font-medium">
            Sign in to your account
          </p>
          <div className="leaf-divider mt-4"></div>
        </div>

        <Card className="card-eco border-eco-sage/20 shadow-eco-xl">
          <CardHeader className="text-center pb-6">
            <CardTitle className="text-2xl font-eco text-eco-forest">
              Welcome Back
            </CardTitle>
            <CardDescription className="text-eco-forest/70">
              Enter your credentials to access your account
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-eco-forest font-medium">
                  Email Address
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "Invalid email address",
                    },
                  })}
                  className={`input-eco ${
                    errors.email ? "border-destructive ring-destructive/20" : ""
                  }`}
                />
                {errors.email && (
                  <p className="text-sm text-destructive font-medium">
                    {errors.email.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="password"
                  className="text-eco-forest font-medium"
                >
                  Password
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    {...register("password", {
                      required: "Password is required",
                      minLength: {
                        value: 6,
                        message: "Password must be at least 6 characters",
                      },
                    })}
                    className={`input-eco pr-12 ${
                      errors.password
                        ? "border-destructive ring-destructive/20"
                        : ""
                    }`}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-eco-sage hover:text-eco-leaf transition-colors duration-300"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-sm text-destructive font-medium">
                    {errors.password.message}
                  </p>
                )}
              </div>

              <Button
                type="submit"
                className="btn-eco w-full text-lg font-semibold py-4"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                    Signing in...
                  </>
                ) : (
                  "Sign In"
                )}
              </Button>
            </form>

            <div className="text-center pt-4">
              <p className="text-sm text-eco-forest/70">
                Don't have an account?{" "}
                <Link
                  to="/signup"
                  className="font-semibold text-eco-leaf hover:text-eco-forest transition-colors duration-300 underline decoration-eco-sage/30 underline-offset-2"
                >
                  Sign up here
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
