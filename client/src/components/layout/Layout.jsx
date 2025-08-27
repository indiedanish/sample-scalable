import React from "react";
import { Navbar } from "./Navbar";
import { useAuth } from "@/contexts/AuthContext";

export function Layout({ children }) {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-background">
      {isAuthenticated && <Navbar />}
      <main
        className={
          isAuthenticated ? "ml-64 transition-all duration-300" : "min-h-screen"
        }
      >
        {children}
      </main>
    </div>
  );
}
