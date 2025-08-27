import React from "react";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import { useAuth } from "@/contexts/AuthContext";

export function Layout({ children }) {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-background text-foreground">
      {isAuthenticated && <Navbar />}
      <main className={isAuthenticated ? "min-h-screen" : "min-h-screen"}>
        {children}
      </main>
      {isAuthenticated && <Footer />}
    </div>
  );
}
