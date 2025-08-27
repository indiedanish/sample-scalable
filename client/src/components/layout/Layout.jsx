import React from "react";
import { Navbar } from "./Navbar";
import { useAuth } from "@/contexts/AuthContext";

export function Layout({ children }) {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="grid-bg min-h-screen">
        {isAuthenticated && <Navbar />}
        <main className={`${isAuthenticated ? "pt-20" : "pt-0"} relative z-10`}>
          {children}
        </main>
      </div>
    </div>
  );
}
