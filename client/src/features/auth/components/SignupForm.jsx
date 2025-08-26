import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { signup } from "@/lib/api";
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
import { Video, Eye, EyeOff, CheckCircle } from "lucide-react";

export function SignupForm() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setError,
  } = useForm();

  const password = watch("password");

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      const result = await signup({
        email: data.email,
        password: data.password,
        firstName: data.firstName,
        lastName: data.lastName,
      });

      toast({
        title: "Account created successfully!",
        description: "You can now sign in with your credentials.",
        action: (
          <div className="flex items-center">
            <CheckCircle className="h-4 w-4 text-green-500 mr-1" />
            <span>Success</span>
          </div>
        ),
      });

      navigate("/login");
    } catch (error) {
      console.error("Signup error:", error);

      if (
        error.message.includes("already exists") ||
        error.message.includes("409")
      ) {
        setError("email", {
          message: "An account with this email already exists",
        });
      } else {
        toast({
          variant: "destructive",
          title: "Registration failed",
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
            Join the digital revolution
          </p>
        </div>

        <Card className="border-0 bg-black/40 backdrop-blur-xl shadow-2xl shadow-purple-500/20 border border-purple-500/30">
          <CardHeader className="text-center pb-8">
            <CardTitle className="text-3xl font-black text-white">
              Create Account
            </CardTitle>
            <CardDescription className="text-gray-400 text-lg font-medium">
              Begin your journey into the world of video content
            </CardDescription>
          </CardHeader>
          <CardContent className="px-8 pb-8">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-3">
                  <Label
                    htmlFor="firstName"
                    className="text-sm font-bold text-purple-300"
                  >
                    First Name
                  </Label>
                  <Input
                    id="firstName"
                    type="text"
                    placeholder="First name"
                    {...register("firstName", {
                      required: "First name is required",
                      minLength: {
                        value: 2,
                        message: "First name must be at least 2 characters",
                      },
                    })}
                    className={`h-14 px-5 rounded-2xl border-2 bg-black/50 backdrop-blur-sm text-white placeholder-gray-500 transition-all duration-300 ${
                      errors.firstName
                        ? "border-red-500 focus:border-red-400 focus:ring-red-500/50"
                        : "border-purple-500/50 focus:border-purple-400 focus:ring-purple-500/50"
                    }`}
                  />
                  {errors.firstName && (
                    <p className="text-sm text-red-400 flex items-center">
                      <span className="w-2 h-2 bg-red-400 rounded-full mr-2 animate-pulse"></span>
                      {errors.firstName.message}
                    </p>
                  )}
                </div>

                <div className="space-y-3">
                  <Label
                    htmlFor="lastName"
                    className="text-sm font-bold text-purple-300"
                  >
                    Last Name
                  </Label>
                  <Input
                    id="lastName"
                    type="text"
                    placeholder="Last name"
                    {...register("lastName", {
                      required: "Last name is required",
                      minLength: {
                        value: 2,
                        message: "Last name must be at least 2 characters",
                      },
                    })}
                    className={`h-14 px-5 rounded-2xl border-2 bg-black/50 backdrop-blur-sm text-white placeholder-gray-500 transition-all duration-300 ${
                      errors.lastName
                        ? "border-red-500 focus:border-red-400 focus:ring-red-500/50"
                        : "border-purple-500/50 focus:border-purple-400 focus:ring-purple-500/50"
                    }`}
                  />
                  {errors.lastName && (
                    <p className="text-sm text-red-400 flex items-center">
                      <span className="w-2 h-2 bg-red-400 rounded-full mr-2 animate-pulse"></span>
                      {errors.lastName.message}
                    </p>
                  )}
                </div>
              </div>

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
                    placeholder="Create a password"
                    {...register("password", {
                      required: "Password is required",
                      minLength: {
                        value: 6,
                        message: "Password must be at least 6 characters",
                      },
                      pattern: {
                        value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
                        message:
                          "Password must contain at least one uppercase letter, one lowercase letter, and one number",
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

              <div className="space-y-3">
                <Label
                  htmlFor="confirmPassword"
                  className="text-sm font-bold text-purple-300"
                >
                  Confirm Password
                </Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm your password"
                    {...register("confirmPassword", {
                      required: "Please confirm your password",
                      validate: (value) =>
                        value === password || "Passwords do not match",
                    })}
                    className={`h-14 px-5 pr-14 rounded-2xl border-2 bg-black/50 backdrop-blur-sm text-white placeholder-gray-500 transition-all duration-300 ${
                      errors.confirmPassword
                        ? "border-red-500 focus:border-red-400 focus:ring-red-500/50"
                        : "border-purple-500/50 focus:border-purple-400 focus:ring-purple-500/50"
                    }`}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-5 flex items-center text-purple-400 hover:text-purple-300 transition-colors"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-6 w-6" />
                    ) : (
                      <Eye className="h-6 w-6" />
                    )}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="text-sm text-red-400 flex items-center">
                    <span className="w-2 h-2 bg-red-400 rounded-full mr-2 animate-pulse"></span>
                    {errors.confirmPassword.message}
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
                    Creating account...
                  </>
                ) : (
                  "Create Account"
                )}
              </Button>
            </form>

            <div className="mt-10 text-center">
              <p className="text-gray-400">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="font-bold text-purple-400 hover:text-purple-300 transition-colors"
                >
                  Sign in here
                </Link>
              </p>
            </div>

            <div className="mt-6 p-4 bg-purple-900/30 rounded-2xl border border-purple-500/30 backdrop-blur-sm">
              <p className="text-sm text-purple-200 text-center">
                <strong>Note:</strong> Only consumers can register directly.
                Creator accounts are created by administrators.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
