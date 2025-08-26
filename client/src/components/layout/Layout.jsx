import React from "react";
import { Navbar } from "./Navbar";
import { useAuth } from "@/contexts/AuthContext";

export function Layout({ children }) {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50">
      {isAuthenticated && <Navbar />}
      <main className={isAuthenticated ? "" : "min-h-screen"}>{children}</main>
    </div>
  );
}
