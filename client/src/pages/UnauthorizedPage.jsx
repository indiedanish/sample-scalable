import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Shield, Home, LogIn, Leaf, Sparkles } from "lucide-react";

export function UnauthorizedPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-eco-cream via-white to-eco-sand/30 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-eco-leaf/5 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-eco-sage/5 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-eco-earth/5 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-md w-full text-center relative z-10">
        <div className="mb-8">
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="w-24 h-24 bg-eco-leaf/10 rounded-full flex items-center justify-center mb-4">
                <Shield className="h-12 w-12 text-eco-leaf" />
              </div>
              <Leaf className="h-6 w-6 text-eco-sage absolute -top-2 -right-2 animate-float" />
              <Sparkles className="h-4 w-4 text-eco-earth absolute -bottom-1 -left-1 animate-pulse" />
            </div>
          </div>
          <h1 className="font-eco text-3xl font-bold text-eco-forest mb-4">
            Access Denied
          </h1>
          <p className="text-eco-forest/70 text-lg">
            Sorry, but you don't have permission to access this area. It's like
            trying to enter a protected garden without the right key.
          </p>
          <div className="leaf-divider mt-6"></div>
        </div>

        <Card className="card-eco border-eco-sage/20 shadow-eco-xl mb-8">
          <CardContent className="p-8">
            <p className="text-eco-forest/70 mb-6">
              Don't worry! You can either sign in with the right credentials or
              return to the main area.
            </p>
            <div className="space-y-3">
              <Link to="/login">
                <Button className="btn-eco w-full text-lg font-semibold py-4">
                  <LogIn className="h-5 w-5 mr-2" />
                  Sign In
                </Button>
              </Link>
              <Link to="/dashboard">
                <Button
                  variant="outline"
                  className="btn-eco-secondary w-full text-lg font-semibold py-4"
                >
                  <Home className="h-5 w-5 mr-2" />
                  Return Home
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        <div className="text-eco-forest/60">
          <p className="text-sm">
            If you believe you should have access, please contact an
            administrator.
          </p>
        </div>
      </div>
    </div>
  );
}
