import React from "react";
import { Navbar } from "./Navbar";
import { useAuth } from "@/contexts/AuthContext";

export function Layout({ children }) {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-black bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-900/20 via-black to-black">
      {isAuthenticated && <Navbar />}
      <main className={isAuthenticated ? "pt-4" : "min-h-screen"}>
        {children}
      </main>
    </div>
  );
}
