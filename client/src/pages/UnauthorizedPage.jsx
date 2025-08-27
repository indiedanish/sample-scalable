import React from "react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShieldX, ArrowLeft, Lock, AlertTriangle, Home } from "lucide-react";

export function UnauthorizedPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pastel-blue/20 via-pastel-purple/20 to-pastel-pink/20 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-80 h-80 bg-gradient-to-br from-pastel-pink/30 to-pastel-orange/30 rounded-full blur-3xl animate-float"></div>
        <div
          className="absolute -bottom-40 -right-40 w-80 h-80 bg-gradient-to-br from-pastel-blue/30 to-pastel-purple/30 rounded-full blur-3xl animate-float"
          style={{ animationDelay: "1.5s" }}
        ></div>
      </div>

      <div className="max-w-md w-full relative z-10 fade-in">
        <Card className="card-pastel border-2 border-pastel-pink/30 shadow-2xl shadow-pastel-pink/20">
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <div className="relative mb-8">
              <div className="p-6 bg-gradient-to-br from-pastel-pink/20 to-pastel-orange/20 rounded-full">
                <ShieldX className="h-20 w-20 text-pastel-pink" />
              </div>
              <div className="absolute -inset-4 bg-gradient-to-br from-pastel-pink/10 to-pastel-orange/10 rounded-full blur-2xl"></div>
            </div>

            <h1 className="text-3xl font-bold bg-gradient-to-r from-pastel-pink to-pastel-orange bg-clip-text text-transparent mb-4 font-playful">
              Access Denied 🔒
            </h1>

            <p className="text-gray-800 font-playful text-lg max-w-md mx-auto">
              Oops! It looks like you don't have permission to access this page.
              Please contact your administrator if you believe this is an error.
              🚫
            </p>

            <div className="space-y-4 w-full">
              <Link to="/dashboard">
                <Button className="btn-pill w-full bg-gradient-to-r from-pastel-blue to-pastel-purple text-white border-0 shadow-lg shadow-pastel-blue/30 hover:shadow-xl hover:shadow-pastel-blue/40 font-playful font-bold">
                  <Home className="h-5 w-5 mr-2" />
                  Go to Dashboard ✨
                </Button>
              </Link>

              <Link to="/videos">
                <Button
                  variant="outline"
                  className="btn-pill w-full bg-white/80 hover:bg-white border-2 border-pastel-pink/30 text-pastel-pink hover:text-pastel-orange font-playful font-medium transition-all duration-300 hover:scale-105 hover:shadow-lg"
                >
                  <ArrowLeft className="h-5 w-5 mr-2" />
                  Back to Videos 🎬
                </Button>
              </Link>
            </div>

            <div className="mt-8 p-4 bg-gradient-to-r from-pastel-blue/20 to-pastel-purple/20 rounded-2xl border border-pastel-blue/30">
              <p className="text-sm text-gray-700 font-playful flex items-center justify-center">
                <Lock className="h-4 w-4 mr-2 text-pastel-blue" />
                Need access? Contact your administrator! 👑
              </p>
            </div>

            <div className="mt-4 p-3 bg-gradient-to-r from-pastel-orange/20 to-pastel-pink/20 rounded-xl border border-pastel-orange/30">
              <p className="text-xs text-gray-600 font-playful flex items-center justify-center">
                <AlertTriangle className="h-3 w-3 mr-1.5 text-pastel-orange" />
                This page requires special permissions
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
