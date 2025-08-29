import React from "react";
import { Navbar } from "./Navbar";

export function Layout({ children }) {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-0">{children}</main>
    </div>
  );
}
