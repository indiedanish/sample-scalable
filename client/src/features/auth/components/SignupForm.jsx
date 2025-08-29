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
import { Video, Eye, EyeOff, CheckCircle, Leaf, Sparkles } from "lucide-react";

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
          <p className="text-eco-forest/70 font-medium">Create your account</p>
          <div className="leaf-divider mt-4"></div>
        </div>

        <Card className="card-eco border-eco-sage/20 shadow-eco-xl">
          <CardHeader className="text-center pb-6">
            <CardTitle className="text-2xl font-eco text-eco-forest">
              Join Our Community
            </CardTitle>
            <CardDescription className="text-eco-forest/70">
              Create a new account to start watching and rating videos
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label
                    htmlFor="firstName"
                    className="text-eco-forest font-medium"
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
                    className={`input-eco ${
                      errors.firstName
                        ? "border-destructive ring-destructive/20"
                        : ""
                    }`}
                  />
                  {errors.firstName && (
                    <p className="text-sm text-destructive font-medium">
                      {errors.firstName.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="lastName"
                    className="text-eco-forest font-medium"
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
                    className={`input-eco ${
                      errors.lastName
                        ? "border-destructive ring-destructive/20"
                        : ""
                    }`}
                  />
                  {errors.lastName && (
                    <p className="text-sm text-destructive font-medium">
                      {errors.lastName.message}
                    </p>
                  )}
                </div>
              </div>

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
                    placeholder="Create a password"
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

              <div className="space-y-2">
                <Label
                  htmlFor="confirmPassword"
                  className="text-eco-forest font-medium"
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
                    className={`input-eco pr-12 ${
                      errors.confirmPassword
                        ? "border-destructive ring-destructive/20"
                        : ""
                    }`}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-eco-sage hover:text-eco-leaf transition-colors duration-300"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="text-sm text-destructive font-medium">
                    {errors.confirmPassword.message}
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
                    Creating account...
                  </>
                ) : (
                  "Create Account"
                )}
              </Button>
            </form>

            <div className="text-center pt-4">
              <p className="text-sm text-eco-forest/70">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="font-semibold text-eco-leaf hover:text-eco-forest transition-colors duration-300 underline decoration-eco-sage/30 underline-offset-2"
                >
                  Sign in here
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
