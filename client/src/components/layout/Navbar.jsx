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
  Play,
  Sparkles,
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
    <nav className="bg-gradient-to-r from-primary-600 via-primary-700 to-primary-800 shadow-material-4 sticky top-0 z-50">
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
                  <Video className="h-10 w-10 text-white group-hover:text-accent-300 transition-colors duration-300" />
                  <div className="absolute -top-1 -right-1">
                    <Sparkles className="h-4 w-4 text-accent-400 animate-pulse" />
                  </div>
                </div>
                <div className="flex flex-col">
                  <span className="font-nunito font-black text-2xl text-white group-hover:text-accent-300 transition-colors duration-300">
                    SB Viz
                  </span>
                  <span className="text-xs text-primary-100 font-medium">
                    Premium Content
                  </span>
                </div>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:ml-8 md:flex md:space-x-2">
              {filteredNavigation.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`inline-flex items-center px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-300 group ${
                      isActive
                        ? "bg-white/20 text-white shadow-material-2 backdrop-blur-sm"
                        : "text-primary-100 hover:bg-white/10 hover:text-white hover:shadow-material-1"
                    }`}
                  >
                    <Icon
                      className={`h-5 w-5 mr-2 transition-transform duration-300 group-hover:scale-110 ${
                        isActive ? "text-accent-300" : "text-primary-200"
                      }`}
                    />
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
                <Search className="h-5 w-5 text-primary-300" />
              </div>
              <input
                type="text"
                placeholder="Search videos..."
                className="block w-full pl-12 pr-4 py-3 border-0 rounded-xl leading-5 bg-white/10 placeholder-primary-200 focus:outline-none focus:ring-2 focus:ring-accent-400 focus:bg-white/20 text-white backdrop-blur-sm transition-all duration-300"
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
                <span className="hidden md:block text-sm text-primary-100 font-medium">
                  Welcome, {user.firstName}
                </span>
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <Avatar className="h-10 w-10 ring-2 ring-white/20 hover:ring-accent-300 transition-all duration-300">
                      <AvatarFallback className="bg-white/20 text-primary-800 font-bold text-sm">
                        {getInitials(user.firstName, user.lastName)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-accent-400 rounded-full border-2 border-white"></div>
                  </div>
                  <div className="hidden md:block">
                    <span className="text-xs text-accent-200 bg-white/10 px-3 py-1 rounded-full font-medium backdrop-blur-sm">
                      {user.role}
                    </span>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLogout}
                  className="hidden md:flex items-center space-x-2 text-primary-100 hover:text-white hover:bg-white/10 rounded-xl px-4 py-2 transition-all duration-300"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </Button>
              </>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden inline-flex items-center justify-center p-2 rounded-xl text-primary-100 hover:text-white hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-accent-400 transition-all duration-300"
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
        <div className="md:hidden bg-gradient-to-b from-primary-700 to-primary-800 shadow-material-4">
          <div className="px-4 pt-4 pb-6 space-y-3">
            {filteredNavigation.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center px-4 py-3 rounded-xl text-base font-semibold transition-all duration-300 ${
                    isActive
                      ? "text-white bg-white/20 shadow-material-2 backdrop-blur-sm"
                      : "text-primary-100 hover:text-white hover:bg-white/10"
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Icon
                    className={`h-5 w-5 mr-3 transition-transform duration-300 ${
                      isActive ? "text-accent-300" : "text-primary-200"
                    }`}
                  />
                  {item.name}
                </Link>
              );
            })}

            {/* Mobile search */}
            <div className="px-4 py-3">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-primary-300" />
                </div>
                <input
                  type="text"
                  placeholder="Search videos..."
                  className="block w-full pl-12 pr-4 py-3 border-0 rounded-xl leading-5 bg-white/10 placeholder-primary-200 focus:outline-none focus:ring-2 focus:ring-accent-400 focus:bg-white/20 text-white backdrop-blur-sm transition-all duration-300"
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
              <div className="px-4 py-4 border-t border-white/10">
                <div className="flex items-center space-x-3 mb-4">
                  <Avatar className="h-12 w-12 ring-2 ring-white/20">
                    <AvatarFallback className="bg-white/20 text-primary-800 font-bold text-base">
                      {getInitials(user.firstName, user.lastName)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="text-base font-bold text-white">
                      {user.firstName} {user.lastName}
                    </div>
                    <div className="text-sm text-primary-200">{user.email}</div>
                    <div className="text-xs text-accent-200 bg-white/10 px-3 py-1 rounded-full font-medium inline-block mt-1">
                      {user.role}
                    </div>
                  </div>
                </div>
                <Button
                  variant="outline"
                  onClick={handleLogout}
                  className="w-full justify-start bg-white/10 border-white/20 text-white hover:bg-white/20 hover:border-white/30 rounded-xl"
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
