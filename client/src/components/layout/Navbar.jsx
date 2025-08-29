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
  Leaf,
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
    <nav className="bg-gradient-to-r from-eco-cream via-white to-eco-sand/30 backdrop-blur-sm border-b border-eco-sage/20 sticky top-0 z-50 shadow-eco">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          <div className="flex">
            {/* Logo */}
            <div className="flex-shrink-0 flex items-center">
              <Link
                to="/dashboard"
                className="flex items-center space-x-3 group"
              >
                <div className="relative">
                  <Video className="h-10 w-10 text-eco-leaf group-hover:text-eco-forest transition-colors duration-300" />
                  <Leaf className="h-4 w-4 text-eco-sage absolute -top-1 -right-1 animate-float" />
                </div>
                <span className="font-eco font-bold text-2xl text-eco-forest group-hover:text-eco-leaf transition-colors duration-300">
                  VideoStream
                </span>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:ml-8 md:flex md:space-x-6">
              {filteredNavigation.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`inline-flex items-center px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
                      isActive
                        ? "bg-eco-leaf/10 text-eco-leaf border-2 border-eco-leaf/30 shadow-eco"
                        : "text-eco-forest/70 hover:text-eco-leaf hover:bg-eco-sage/10 border-2 border-transparent hover:border-eco-sage/20"
                    }`}
                  >
                    <Icon className="h-4 w-4 mr-2" />
                    {item.name}
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Search Bar */}
          <div className="hidden md:flex items-center flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-eco-sage" />
              </div>
              <input
                type="text"
                placeholder="Search videos..."
                className="block w-full pl-12 pr-4 py-3 border border-eco-sage/30 rounded-xl leading-5 bg-white/80 backdrop-blur-sm placeholder-eco-sage/60 focus:outline-none focus:placeholder-eco-sage/40 focus:ring-2 focus:ring-eco-leaf/30 focus:border-eco-leaf text-sm font-eco transition-all duration-300"
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
                <span className="hidden md:block text-sm text-eco-forest/80 font-medium">
                  Welcome, {user.firstName}
                </span>
                <div className="flex items-center space-x-3">
                  <Avatar className="h-10 w-10 ring-2 ring-eco-sage/30 hover:ring-eco-leaf/50 transition-all duration-300">
                    <AvatarFallback className="bg-gradient-to-br from-eco-leaf to-eco-moss text-white font-semibold">
                      {getInitials(user.firstName, user.lastName)}
                    </AvatarFallback>
                  </Avatar>
                  <span className="hidden md:block text-xs text-eco-forest bg-eco-sand/60 px-3 py-1.5 rounded-full font-medium border border-eco-sage/20">
                    {user.role}
                  </span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLogout}
                  className="hidden md:flex items-center space-x-2 text-eco-forest/70 hover:text-eco-leaf hover:bg-eco-sage/10 rounded-xl px-4 py-2 transition-all duration-300"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </Button>
              </>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden inline-flex items-center justify-center p-2 rounded-xl text-eco-sage hover:text-eco-leaf hover:bg-eco-sage/10 focus:outline-none focus:ring-2 focus:ring-eco-leaf/30 transition-all duration-300"
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
        <div className="md:hidden animate-fade-in">
          <div className="px-4 pt-4 pb-6 space-y-3 bg-gradient-to-b from-white/90 to-eco-sand/30 backdrop-blur-sm border-t border-eco-sage/20">
            {filteredNavigation.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center px-4 py-3 rounded-xl text-base font-medium transition-all duration-300 ${
                    isActive
                      ? "text-eco-leaf bg-eco-leaf/10 border-2 border-eco-leaf/30"
                      : "text-eco-forest/70 hover:text-eco-leaf hover:bg-eco-sage/10 border-2 border-transparent hover:border-eco-sage/20"
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Icon className="h-5 w-5 mr-3" />
                  {item.name}
                </Link>
              );
            })}

            {/* Mobile search */}
            <div className="px-4 py-3">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Search className="h-4 w-4 text-eco-sage" />
                </div>
                <input
                  type="text"
                  placeholder="Search videos..."
                  className="block w-full pl-12 pr-4 py-3 border border-eco-sage/30 rounded-xl leading-5 bg-white/80 backdrop-blur-sm placeholder-eco-sage/60 focus:outline-none focus:placeholder-eco-sage/40 focus:ring-2 focus:ring-eco-leaf/30 focus:border-eco-leaf text-sm font-eco transition-all duration-300"
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
              <div className="px-4 py-4 border-t border-eco-sage/20">
                <div className="flex items-center space-x-3 mb-4">
                  <Avatar className="h-12 w-12 ring-2 ring-eco-sage/30">
                    <AvatarFallback className="bg-gradient-to-br from-eco-leaf to-eco-moss text-white font-semibold">
                      {getInitials(user.firstName, user.lastName)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="text-base font-medium text-eco-forest">
                      {user.firstName} {user.lastName}
                    </div>
                    <div className="text-sm text-eco-forest/70">
                      {user.email}
                    </div>
                    <div className="text-xs text-eco-forest bg-eco-sand/60 px-2 py-1 rounded-full inline-block font-medium border border-eco-sage/20 mt-1">
                      {user.role}
                    </div>
                  </div>
                </div>
                <Button
                  variant="outline"
                  onClick={handleLogout}
                  className="w-full justify-start border-eco-sage/30 text-eco-forest hover:bg-eco-sage/10 hover:border-eco-leaf/50 rounded-xl transition-all duration-300"
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
