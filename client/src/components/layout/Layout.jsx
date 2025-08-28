import React from "react";
import { Navbar } from "./Navbar";
import { useAuth } from "@/contexts/AuthContext";
import { FloatingActionButton } from "@/components/ui/fab";
import { Upload, Plus } from "lucide-react";
import { Link } from "react-router-dom";

export function Layout({ children }) {
  const { isAuthenticated, hasRole } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary-50/30 to-secondary-50/20">
      {isAuthenticated && <Navbar />}
      <main
        className={`${
          isAuthenticated ? "pt-8" : "min-h-screen"
        } px-4 sm:px-6 lg:px-8 pb-8`}
      >
        {children}
      </main>

      {/* Floating Action Button for Creators */}
      {isAuthenticated && hasRole("CREATOR") && (
        <FloatingActionButton
          variant="fab"
          size="fab"
          asChild
          className="bg-gradient-to-br from-primary-500 to-secondary-600 hover:from-primary-600 hover:to-secondary-700"
        >
          <Link to="/upload">
            <Plus className="h-8 w-8 text-white" />
          </Link>
        </FloatingActionButton>
      )}
    </div>
  );
}
