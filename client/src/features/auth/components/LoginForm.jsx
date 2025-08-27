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
import { Video, Eye, EyeOff, Sparkles } from "lucide-react";

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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pastel-blue/20 via-pastel-purple/20 to-pastel-pink/20 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-pastel-blue/30 to-pastel-purple/30 rounded-full blur-3xl animate-float"></div>
        <div
          className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-pastel-pink/30 to-pastel-orange/30 rounded-full blur-3xl animate-float"
          style={{ animationDelay: "1.5s" }}
        ></div>
        <div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-pastel-purple/20 to-pastel-blue/20 rounded-full blur-3xl animate-float"
          style={{ animationDelay: "3s" }}
        ></div>
      </div>

      <div className="max-w-md w-full relative z-10 fade-in">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="p-4 bg-gradient-to-br from-pastel-blue to-pastel-purple rounded-full shadow-2xl shadow-pastel-blue/30">
                <Video className="h-12 w-12 text-white" />
              </div>
              <div className="absolute -inset-2 bg-gradient-to-br from-pastel-blue/20 to-pastel-purple/20 rounded-full blur-xl"></div>
            </div>
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-pastel-blue via-pastel-purple to-pastel-pink bg-clip-text text-transparent mb-2">
            VideoStream ✨
          </h1>
          <p className="text-lg text-gray-800 font-playful max-w-2xl mx-auto">
            Welcome back! Let's get you signed in 🌟
          </p>
        </div>

        <Card className="card-pastel border-2 border-pastel-blue/30 shadow-2xl shadow-pastel-blue/20">
          <CardHeader className="text-center pb-6">
            <CardTitle className="text-2xl font-playful font-bold text-foreground flex items-center justify-center">
              <Sparkles className="h-5 w-5 mr-2 text-pastel-pink" />
              Sign In
              <Sparkles className="h-5 w-5 ml-2 text-pastel-pink" />
            </CardTitle>
            <CardDescription className="text-gray-700 font-playful text-base">
              Enter your email and password to access your account 🚀
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-3">
                <Label
                  htmlFor="email"
                  className="text-gray-800 font-playful font-medium text-base"
                >
                  Email Address 📧
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
                  className={`input-pastel text-base font-playful text-gray-800 placeholder-gray-600 ${
                    errors.email
                      ? "border-red-300 focus:border-red-500 focus:ring-red-500/20"
                      : ""
                  }`}
                />
                {errors.email && (
                  <p className="text-sm text-red-500 font-playful flex items-center">
                    <span className="mr-1">⚠️</span>
                    {errors.email.message}
                  </p>
                )}
              </div>

              <div className="space-y-3">
                <Label
                  htmlFor="password"
                  className="text-gray-800 font-playful font-medium text-base"
                >
                  Password 🔐
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
                    className={`input-pastel text-base font-playful pr-12 text-gray-800 placeholder-gray-600 ${
                      errors.password
                        ? "border-red-300 focus:border-red-500 focus:ring-red-500/20"
                        : ""
                    }`}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-pastel-blue hover:text-pastel-purple transition-colors duration-200"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-sm text-red-500 font-playful flex items-center">
                    <span className="mr-1">⚠️</span>
                    {errors.password.message}
                  </p>
                )}
              </div>

              <Button
                type="submit"
                className="btn-pill w-full bg-gradient-to-r from-pastel-blue to-pastel-purple text-white border-0 shadow-lg shadow-pastel-blue/30 hover:shadow-xl hover:shadow-pastel-blue/40 font-playful font-bold text-lg"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                    Signing in... ✨
                  </>
                ) : (
                  "Sign In ✨"
                )}
              </Button>
            </form>

            <div className="pt-6 border-t-2 border-pastel-blue/20">
              <p className="text-center text-gray-700 font-playful">
                Don't have an account?{" "}
                <Link
                  to="/signup"
                  className="font-bold text-pastel-blue hover:text-pastel-purple transition-colors duration-300 underline decoration-2 underline-offset-4 hover:decoration-pastel-purple"
                >
                  Sign up here ✨
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
