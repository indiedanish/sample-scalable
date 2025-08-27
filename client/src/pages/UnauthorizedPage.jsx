import React from "react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShieldX, ArrowLeft } from "lucide-react";

export function UnauthorizedPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <ShieldX className="h-16 w-16 text-red-500 mb-6" />
            <h1 className="text-2xl font-bold text-gray-100 mb-2">
              Access Denied
            </h1>
            <p className="text-gray-600 text-center mb-6">
              You don't have permission to access this page. Please contact your
              administrator if you believe this is an error.
            </p>
            <div className="space-y-3">
              <Link to="/dashboard">
                <Button className="w-full">Go to Dashboard</Button>
              </Link>
              <Link to="/videos">
                <Button variant="outline" className="w-full">
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
