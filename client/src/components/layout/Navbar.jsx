import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Video,
  Home,
  Upload,
  Users,
  LogOut,
  Menu,
  X,
  Search,
} from "lucide-react";

export function Navbar() {
  const { user, logout, hasRole } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const getInitials = (firstName, lastName) => {
    return `${firstName?.[0] || ""}${lastName?.[0] || ""}`.toUpperCase();
  };

  const navigation = [
    {
      name: "Dashboard",
      href: "/dashboard",
      icon: Home,
      roles: ["CONSUMER", "CREATOR", "ADMIN"],
    },
    {
      name: "Videos",
      href: "/videos",
      icon: Video,
      roles: ["CONSUMER", "CREATOR", "ADMIN"],
    },
    {
      name: "Upload",
      href: "/upload",
      icon: Upload,
      roles: ["CREATOR", "ADMIN"],
    },
    { name: "Users", href: "/users", icon: Users, roles: ["ADMIN"] },
  ];

  const filteredNavigation = navigation.filter((item) =>
    item.roles.some((role) => hasRole(role))
  );

  return (
    <nav className="navbar-futuristic">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            {/* Logo */}
            <div className="flex-shrink-0 flex items-center">
              <Link
                to="/dashboard"
                className="flex items-center space-x-3 group"
              >
                <div className="relative">
                  <Video className="h-8 w-8 text-primary transition-all duration-300 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-primary/20 rounded-full blur-sm group-hover:blur-md transition-all duration-300"></div>
                </div>
                <span className="font-orbitron font-bold text-xl text-primary group-hover:text-primary/80 transition-colors duration-300">
                  VideoStream
                </span>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:ml-8 md:flex md:space-x-1">
              {filteredNavigation.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`relative inline-flex items-center px-4 py-2 text-sm font-rajdhani font-medium transition-all duration-300 ${
                      isActive
                        ? "text-primary border-b-2 border-primary"
                        : "text-muted-foreground hover:text-primary hover:border-b-2 hover:border-primary/50"
                    }`}
                  >
                    <Icon className="h-4 w-4 mr-2" />
                    {item.name}
                    {isActive && (
                      <div className="absolute -bottom-px left-0 right-0 h-px bg-gradient-to-r from-primary via-secondary to-accent"></div>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Search Bar */}
          <div className="hidden md:flex items-center flex-1 max-w-md mx-8">
            <div className="relative w-full group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors duration-300" />
              </div>
              <input
                type="text"
                placeholder="Search videos..."
                className="input-futuristic w-full pl-10 pr-3 bg-transparent"
                onKeyPress={(e) => {
                  if (e.key === "Enter" && e.target.value.trim()) {
                    navigate(
                      `/videos?search=${encodeURIComponent(
                        e.target.value.trim()
                      )}`
                    );
                  }
                }}
              />
            </div>
          </div>

          {/* Profile dropdown */}
          <div className="flex items-center space-x-4">
            {user && (
              <>
                <span className="hidden md:block text-sm text-muted-foreground font-rajdhani">
                  Welcome,{" "}
                  <span className="text-primary font-semibold">
                    {user.firstName}
                  </span>
                </span>
                <div className="flex items-center space-x-2">
                  <Avatar className="h-8 w-8 ring-2 ring-primary/30 hover:ring-primary/60 transition-all duration-300">
                    <AvatarFallback className="bg-primary/20 text-primary font-rajdhani font-semibold">
                      {getInitials(user.firstName, user.lastName)}
                    </AvatarFallback>
                  </Avatar>
                  <span className="hidden md:block text-xs text-muted-foreground bg-primary/10 border border-primary/20 px-2 py-1 rounded font-rajdhani">
                    {user.role}
                  </span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLogout}
                  className="hidden md:flex items-center space-x-2 text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all duration-300 font-rajdhani"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </Button>
              </>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden inline-flex items-center justify-center p-2 rounded text-muted-foreground hover:text-primary hover:bg-primary/10 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all duration-300"
            >
              {isMobileMenuOpen ? (
                <X className="block h-6 w-6" />
              ) : (
                <Menu className="block h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-card/95 backdrop-blur-md border-t border-primary/20">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {filteredNavigation.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center px-3 py-2 rounded text-base font-rajdhani font-medium transition-all duration-300 ${
                    isActive
                      ? "text-primary bg-primary/10 border-l-2 border-primary"
                      : "text-muted-foreground hover:text-primary hover:bg-primary/5 hover:border-l-2 hover:border-primary/30"
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Icon className="h-5 w-5 mr-3" />
                  {item.name}
                </Link>
              );
            })}

            {/* Mobile search */}
            <div className="px-3 py-2">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-4 w-4 text-muted-foreground" />
                </div>
                <input
                  type="text"
                  placeholder="Search videos..."
                  className="input-futuristic w-full pl-10 pr-3 bg-transparent"
                  onKeyPress={(e) => {
                    if (e.key === "Enter" && e.target.value.trim()) {
                      navigate(
                        `/videos?search=${encodeURIComponent(
                          e.target.value.trim()
                        )}`
                      );
                      setIsMobileMenuOpen(false);
                    }
                  }}
                />
              </div>
            </div>

            {/* Mobile user info and logout */}
            {user && (
              <div className="px-3 py-2 border-t border-primary/20">
                <div className="flex items-center space-x-3 mb-3">
                  <Avatar className="h-10 w-10 ring-2 ring-primary/30">
                    <AvatarFallback className="bg-primary/20 text-primary font-rajdhani font-semibold">
                      {getInitials(user.firstName, user.lastName)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="text-base font-medium text-foreground font-rajdhani">
                      {user.firstName} {user.lastName}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {user.email}
                    </div>
                    <div className="text-xs text-muted-foreground bg-primary/10 border border-primary/20 px-2 py-1 rounded inline-block font-rajdhani">
                      {user.role}
                    </div>
                  </div>
                </div>
                <Button
                  variant="outline"
                  onClick={handleLogout}
                  className="w-full justify-start border-primary/30 text-muted-foreground hover:text-primary hover:border-primary hover:bg-primary/10 font-rajdhani transition-all duration-300"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
