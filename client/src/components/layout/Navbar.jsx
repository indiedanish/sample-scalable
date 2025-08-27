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
    <nav className="bg-gradient-to-r from-pastel-blue via-pastel-purple to-pastel-pink border-b-2 border-pastel-blue/30 sticky top-0 z-50 shadow-lg shadow-pastel-blue/20">
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
                  <Video className="h-10 w-10 text-white drop-shadow-lg group-hover:scale-110 transition-transform duration-300 animate-float" />
                  <div className="absolute -inset-2 bg-white/20 rounded-full blur-sm group-hover:blur-md transition-all duration-300"></div>
                </div>
                <span className="font-playful font-bold text-2xl text-white drop-shadow-lg group-hover:scale-105 transition-transform duration-300">
                  VideoStream
                </span>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:ml-8 md:flex md:space-x-4">
              {filteredNavigation.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`nav-pill inline-flex items-center px-6 py-3 font-playful font-medium text-white ${
                      isActive
                        ? "bg-white/20 backdrop-blur-sm shadow-lg shadow-white/20 border-2 border-white/30"
                        : "bg-white/10 backdrop-blur-sm hover:bg-white/20 hover:border-2 hover:border-white/30"
                    }`}
                  >
                    <Icon className="h-5 w-5 mr-2" />
                    {item.name}
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Profile dropdown */}
          <div className="flex items-center space-x-4">
            {user && (
              <>
                <span className="hidden md:block text-sm text-white/90 font-playful font-medium">
                  Welcome, {user.firstName}!
                </span>
                <div className="flex items-center space-x-3">
                  <Avatar className="h-10 w-10 border-2 border-white/30 shadow-lg">
                    <AvatarFallback className="bg-gradient-to-br from-pastel-pink to-pastel-orange text-white font-bold text-lg">
                      {getInitials(user.firstName, user.lastName)}
                    </AvatarFallback>
                  </Avatar>
                  <span className="hidden md:block text-xs text-white/80 bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-full border border-white/30 font-playful">
                    {user.role}
                  </span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLogout}
                  className="hidden md:flex items-center space-x-2 bg-white/10 hover:bg-white/20 text-white border border-white/30 rounded-full px-4 py-2 font-playful font-medium transition-all duration-300 hover:scale-105 hover:shadow-lg"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </Button>
              </>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden inline-flex items-center justify-center p-3 rounded-full text-white bg-white/20 backdrop-blur-sm border border-white/30 hover:bg-white/30 transition-all duration-300"
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
        <div className="md:hidden bg-gradient-to-b from-pastel-blue/95 to-pastel-purple/95 backdrop-blur-sm border-t-2 border-pastel-blue/30">
          <div className="px-4 pt-4 pb-6 space-y-3">
            {filteredNavigation.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`nav-pill flex items-center px-4 py-3 font-playful font-medium text-white ${
                    isActive
                      ? "bg-white/20 backdrop-blur-sm shadow-lg shadow-white/20 border-2 border-white/30"
                      : "bg-white/10 backdrop-blur-sm hover:bg-white/20 hover:border-2 hover:border-white/30"
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
                  <Search className="h-5 w-5 text-pastel-blue/60" />
                </div>
                <input
                  type="text"
                  placeholder="Search videos..."
                  className="input-pastel block w-full pl-12 pr-4 py-3 text-gray-800 placeholder-gray-600 font-playful"
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
              <div className="px-4 py-4 border-t-2 border-white/20">
                <div className="flex items-center space-x-4 mb-4">
                  <Avatar className="h-12 w-12 border-2 border-white/30 shadow-lg">
                    <AvatarFallback className="bg-gradient-to-br from-pastel-pink to-pastel-orange text-white font-bold text-xl">
                      {getInitials(user.firstName, user.lastName)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="text-lg font-playful font-bold text-white">
                      {user.firstName} {user.lastName}
                    </div>
                    <div className="text-sm text-white/80 font-playful">
                      {user.email}
                    </div>
                    <div className="text-xs text-white/80 bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-full border border-white/30 font-playful inline-block mt-1">
                      {user.role}
                    </div>
                  </div>
                </div>
                <Button
                  variant="outline"
                  onClick={handleLogout}
                  className="w-full justify-start bg-white/10 hover:bg-white/20 text-white border-white/30 rounded-full px-6 py-3 font-playful font-medium transition-all duration-300 hover:scale-105 hover:shadow-lg"
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
