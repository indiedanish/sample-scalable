import React from "react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileX, Home, ArrowLeft, Sparkles } from "lucide-react";

export function NotFoundPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-muted/30 to-background py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        {/* Hero Section */}
        <div className="text-center mb-12 fade-in">
          <div className="inline-flex items-center space-x-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Sparkles className="h-4 w-4" />
            <span>Oops!</span>
          </div>

          <h1 className="text-4xl font-bold text-foreground mb-4 tracking-tight">
            Page Not Found
          </h1>
          <p className="text-lg text-muted-foreground">
            The page you're looking for doesn't exist
          </p>
        </div>

        {/* Error Card */}
        <Card className="card-modern border-0 shadow-xl">
          <CardContent className="flex flex-col items-center justify-center py-12 px-8">
            <div className="w-20 h-20 bg-muted rounded-2xl flex items-center justify-center mb-6">
              <FileX className="h-10 w-10 text-muted-foreground" />
            </div>

            <p className="text-muted-foreground text-center mb-8 leading-relaxed">
              The page you're looking for doesn't exist. It might have been
              moved, deleted, or you entered the wrong URL.
            </p>

            <div className="space-y-4 w-full">
              <Link to="/dashboard">
                <Button className="btn-primary w-full py-3 rounded-xl">
                  <Home className="h-4 w-4 mr-2" />
                  Go to Dashboard
                </Button>
              </Link>
              <Button
                variant="outline"
                className="w-full py-3 rounded-xl border-border/50 hover:bg-muted"
                onClick={() => window.history.back()}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Go Back
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
