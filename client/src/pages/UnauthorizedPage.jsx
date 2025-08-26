import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Shield, Home, LogIn } from "lucide-react";

export function UnauthorizedPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 px-4">
      <Card className="border-0 shadow-2xl bg-white/80 backdrop-blur-sm max-w-md w-full text-center">
        <CardContent className="p-12">
          <div className="p-4 bg-red-100 rounded-full w-20 h-20 mx-auto mb-6 flex items-center justify-center">
            <Shield className="h-10 w-10 text-red-600" />
          </div>
          <h1 className="text-3xl font-bold text-slate-900 mb-4">
            Access Denied
          </h1>
          <p className="text-slate-600 mb-8 text-lg">
            You don't have permission to access this page. Please contact an
            administrator if you believe this is an error.
          </p>
          <div className="space-y-4">
            <Link to="/dashboard">
              <Button className="w-full h-12 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-0.5">
                <Home className="h-5 w-5 mr-2" />
                Go to Dashboard
              </Button>
            </Link>
            <Link to="/login">
              <Button
                variant="outline"
                className="w-full h-12 rounded-xl border-2 border-slate-200 hover:border-blue-300 hover:bg-blue-50 transition-all duration-200"
              >
                <LogIn className="h-5 w-5 mr-2" />
                Sign In
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
