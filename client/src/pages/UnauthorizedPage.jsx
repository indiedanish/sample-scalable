import React from "react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShieldX, ArrowLeft, Sparkles } from "lucide-react";

export function UnauthorizedPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-muted/30 to-background py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        {/* Hero Section */}
        <div className="text-center mb-12 fade-in">
          <div className="inline-flex items-center space-x-2 bg-destructive/10 text-destructive px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Sparkles className="h-4 w-4" />
            <span>Access Denied</span>
          </div>

          <h1 className="text-4xl font-bold text-foreground mb-4 tracking-tight">
            Access Denied
          </h1>
          <p className="text-lg text-muted-foreground">
            You don't have permission to access this page
          </p>
        </div>

        {/* Error Card */}
        <Card className="card-modern border-0 shadow-xl">
          <CardContent className="flex flex-col items-center justify-center py-12 px-8">
            <div className="w-20 h-20 bg-destructive/10 rounded-2xl flex items-center justify-center mb-6">
              <ShieldX className="h-10 w-10 text-destructive" />
            </div>

            <p className="text-muted-foreground text-center mb-8 leading-relaxed">
              You don't have permission to access this page. Please contact your
              administrator if you believe this is an error.
            </p>

            <div className="space-y-4 w-full">
              <Link to="/dashboard">
                <Button className="btn-primary w-full py-3 rounded-xl">
                  Go to Dashboard
                </Button>
              </Link>
              <Link to="/videos">
                <Button
                  variant="outline"
                  className="w-full py-3 rounded-xl border-border/50 hover:bg-muted"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Videos
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
