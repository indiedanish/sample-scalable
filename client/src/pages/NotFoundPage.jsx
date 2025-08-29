import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Home, Leaf, Sparkles } from "lucide-react";

export function NotFoundPage() {
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
                <Leaf className="h-12 w-12 text-eco-leaf" />
              </div>
              <Sparkles className="h-6 w-6 text-eco-earth absolute -top-2 -right-2 animate-pulse" />
            </div>
          </div>
          <h1 className="font-eco text-6xl font-bold text-eco-forest mb-4">
            404
          </h1>
          <h2 className="font-eco text-2xl font-semibold text-eco-forest/80 mb-3">
            Page Not Found
          </h2>
          <p className="text-eco-forest/70 text-lg">
            Oops! The page you're looking for seems to have wandered off into
            the digital wilderness.
          </p>
          <div className="leaf-divider mt-6"></div>
        </div>

        <Card className="card-eco border-eco-sage/20 shadow-eco-xl mb-8">
          <CardContent className="p-8">
            <p className="text-eco-forest/70 mb-6">
              Don't worry! You can always find your way back to familiar
              territory.
            </p>
            <Link to="/dashboard">
              <Button className="btn-eco w-full text-lg font-semibold py-4">
                <Home className="h-5 w-5 mr-2" />
                Return Home
              </Button>
            </Link>
          </CardContent>
        </Card>

        <div className="text-eco-forest/60">
          <p className="text-sm">
            If you believe this is an error, please contact our support team.
          </p>
        </div>
      </div>
    </div>
  );
}
