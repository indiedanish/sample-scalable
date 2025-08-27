import React from "react";
import { Navbar } from "./Navbar";
import { useAuth } from "@/contexts/AuthContext";

export function Layout({ children }) {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-pastel-blue/10 via-pastel-purple/10 to-pastel-pink/10">
      {isAuthenticated && <Navbar />}
      <main className={isAuthenticated ? "" : "min-h-screen"}>{children}</main>
    </div>
  );
}
