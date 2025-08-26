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
import { Video, Eye, EyeOff } from "lucide-react";

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
    <div className="min-h-screen flex items-center justify-center bg-black bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-900/20 via-black to-black py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-pink-500/10 rounded-full blur-3xl animate-pulse animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl animate-pulse animation-delay-1000"></div>
      </div>

      <div className="max-w-md w-full relative z-10">
        <div className="text-center mb-12">
          <div className="flex justify-center mb-8">
            <div className="relative">
              <div className="absolute inset-0 bg-purple-500 rounded-3xl blur-xl opacity-75 animate-pulse"></div>
              <div className="relative p-6 bg-gradient-to-br from-purple-600 via-pink-600 to-purple-800 rounded-3xl border border-purple-400/50 shadow-2xl shadow-purple-500/50">
                <Video className="h-16 w-16 text-white" />
              </div>
            </div>
          </div>
          <div className="space-y-2">
            <h1 className="text-5xl font-black bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent tracking-wider mb-2">
              VIDEO
            </h1>
            <h1 className="text-5xl font-black bg-gradient-to-r from-pink-400 via-purple-400 to-pink-400 bg-clip-text text-transparent tracking-wider -mt-2">
              STREAM
            </h1>
          </div>
          <p className="text-xl text-gray-300 mt-4 font-medium">
            Access your digital realm
          </p>
        </div>

        <Card className="border-0 bg-black/40 backdrop-blur-xl shadow-2xl shadow-purple-500/20 border border-purple-500/30">
          <CardHeader className="text-center pb-8">
            <CardTitle className="text-3xl font-black text-white">
              Welcome Back
            </CardTitle>
            <CardDescription className="text-gray-400 text-lg font-medium">
              Enter your credentials to access your account
            </CardDescription>
          </CardHeader>
          <CardContent className="px-8 pb-8">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-3">
                <Label
                  htmlFor="email"
                  className="text-sm font-bold text-purple-300"
                >
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
                  className={`h-14 px-5 rounded-2xl border-2 bg-black/50 backdrop-blur-sm text-white placeholder-gray-500 transition-all duration-300 ${
                    errors.email
                      ? "border-red-500 focus:border-red-400 focus:ring-red-500/50"
                      : "border-purple-500/50 focus:border-purple-400 focus:ring-purple-500/50"
                  }`}
                />
                {errors.email && (
                  <p className="text-sm text-red-400 flex items-center">
                    <span className="w-2 h-2 bg-red-400 rounded-full mr-2 animate-pulse"></span>
                    {errors.email.message}
                  </p>
                )}
              </div>

              <div className="space-y-3">
                <Label
                  htmlFor="password"
                  className="text-sm font-bold text-purple-300"
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
                    className={`h-14 px-5 pr-14 rounded-2xl border-2 bg-black/50 backdrop-blur-sm text-white placeholder-gray-500 transition-all duration-300 ${
                      errors.password
                        ? "border-red-500 focus:border-red-400 focus:ring-red-500/50"
                        : "border-purple-500/50 focus:border-purple-400 focus:ring-purple-500/50"
                    }`}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-5 flex items-center text-purple-400 hover:text-purple-300 transition-colors"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-6 w-6" />
                    ) : (
                      <Eye className="h-6 w-6" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-sm text-red-400 flex items-center">
                    <span className="w-2 h-2 bg-red-400 rounded-full mr-2 animate-pulse"></span>
                    {errors.password.message}
                  </p>
                )}
              </div>

              <Button
                type="submit"
                className="w-full h-14 bg-gradient-to-r from-purple-600 via-pink-600 to-purple-700 hover:from-purple-700 hover:via-pink-700 hover:to-purple-800 text-white font-bold text-lg rounded-2xl shadow-2xl shadow-purple-500/50 hover:shadow-purple-500/70 transition-all duration-300 transform hover:-translate-y-1 hover:scale-105"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-3"></div>
                    Accessing...
                  </>
                ) : (
                  "Access Account"
                )}
              </Button>
            </form>

            <div className="mt-10 text-center">
              <p className="text-gray-400">
                Don't have an account?{" "}
                <Link
                  to="/signup"
                  className="font-bold text-purple-400 hover:text-purple-300 transition-colors"
                >
                  Create one here
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
