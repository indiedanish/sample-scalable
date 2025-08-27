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
import {
  Video,
  Eye,
  EyeOff,
  CheckCircle,
  Sparkles,
  UserPlus,
} from "lucide-react";

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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pastel-blue/20 via-pastel-purple/20 to-pastel-pink/20 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-80 h-80 bg-gradient-to-br from-pastel-pink/30 to-pastel-orange/30 rounded-full blur-3xl animate-float"></div>
        <div
          className="absolute -bottom-40 -right-40 w-80 h-80 bg-gradient-to-br from-pastel-blue/30 to-pastel-purple/30 rounded-full blur-3xl animate-float"
          style={{ animationDelay: "1.5s" }}
        ></div>
        <div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-pastel-orange/20 to-pastel-pink/20 rounded-full blur-3xl animate-float"
          style={{ animationDelay: "3s" }}
        ></div>
      </div>

      <div className="max-w-md w-full relative z-10 fade-in">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="p-4 bg-gradient-to-br from-pastel-pink to-pastel-orange rounded-full shadow-2xl shadow-pastel-pink/30">
                <UserPlus className="h-12 w-12 text-white" />
              </div>
              <div className="absolute -inset-2 bg-gradient-to-br from-pastel-pink/20 to-pastel-orange/20 rounded-full blur-xl"></div>
            </div>
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-pastel-pink via-pastel-orange to-pastel-purple bg-clip-text text-transparent mb-2">
            VideoStream ✨
          </h1>
          <p className="text-lg text-gray-800 font-playful max-w-2xl mx-auto">
            Join our community and start your journey! 🌟
          </p>
        </div>

        <Card className="card-pastel border-2 border-pastel-pink/30 shadow-2xl shadow-pastel-pink/20">
          <CardHeader className="text-center pb-6">
            <CardTitle className="text-2xl font-playful font-bold text-foreground flex items-center justify-center">
              <Sparkles className="h-5 w-5 mr-2 text-pastel-pink" />
              Create Account
              <Sparkles className="h-5 w-5 ml-2 text-pastel-pink" />
            </CardTitle>
            <CardDescription className="text-gray-700 font-playful text-base">
              Create a new account to start watching and rating videos 🚀
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-3">
                  <Label
                    htmlFor="firstName"
                    className="text-gray-800 font-playful font-medium text-base"
                  >
                    First Name 👤
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
                    className={`input-pastel font-playful text-gray-800 placeholder-gray-600 ${
                      errors.firstName
                        ? "border-red-300 focus:border-red-500 focus:ring-red-500/20"
                        : ""
                    }`}
                  />
                  {errors.firstName && (
                    <p className="text-sm text-red-500 font-playful flex items-center">
                      <span className="mr-1">⚠️</span>
                      {errors.firstName.message}
                    </p>
                  )}
                </div>

                <div className="space-y-3">
                  <Label
                    htmlFor="lastName"
                    className="text-gray-800 font-playful font-medium text-base"
                  >
                    Last Name 👤
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
                    className={`input-pastel font-playful text-gray-800 placeholder-gray-600 ${
                      errors.lastName
                        ? "border-red-300 focus:border-red-500 focus:ring-red-500/20"
                        : ""
                    }`}
                  />
                  {errors.lastName && (
                    <p className="text-sm text-red-500 font-playful flex items-center">
                      <span className="mr-1">⚠️</span>
                      {errors.lastName.message}
                    </p>
                  )}
                </div>
              </div>

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
                  className={`input-pastel font-playful text-gray-800 placeholder-gray-600 ${
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
                    className={`input-pastel font-playful pr-12 text-gray-800 placeholder-gray-600 ${
                      errors.password
                        ? "border-red-300 focus:border-red-500 focus:ring-red-500/20"
                        : ""
                    }`}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-pastel-pink hover:text-pastel-orange transition-colors duration-200"
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

              <div className="space-y-3">
                <Label
                  htmlFor="confirmPassword"
                  className="text-gray-800 font-playful font-medium text-base"
                >
                  Confirm Password 🔐
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
                    className={`input-pastel font-playful pr-12 text-gray-800 placeholder-gray-600 ${
                      errors.confirmPassword
                        ? "border-red-300 focus:border-red-500 focus:ring-red-500/20"
                        : ""
                    }`}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-pastel-pink hover:text-pastel-orange transition-colors duration-200"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="text-sm text-red-500 font-playful flex items-center">
                    <span className="mr-1">⚠️</span>
                    {errors.confirmPassword.message}
                  </p>
                )}
              </div>

              <Button
                type="submit"
                className="btn-pill w-full bg-gradient-to-r from-pastel-pink to-pastel-orange text-white border-0 shadow-lg shadow-pastel-pink/30 hover:shadow-xl hover:shadow-pastel-pink/40 font-playful font-bold text-lg"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                    Creating account... ✨
                  </>
                ) : (
                  "Create Account ✨"
                )}
              </Button>
            </form>

            <div className="pt-6 border-t-2 border-pastel-pink/20">
              <p className="text-center text-gray-700 font-playful">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="font-bold text-pastel-pink hover:text-pastel-orange transition-colors duration-300 underline decoration-2 underline-offset-4 hover:decoration-pastel-orange"
                >
                  Sign in here ✨
                </Link>
              </p>
            </div>

            <div className="p-4 bg-gradient-to-r from-pastel-blue/20 to-pastel-purple/20 rounded-2xl border-2 border-pastel-blue/30">
              <p className="text-sm text-gray-700 font-playful text-center">
                <strong>Note:</strong> Only consumers can register directly.
                Creator accounts are created by administrators. 👑
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
