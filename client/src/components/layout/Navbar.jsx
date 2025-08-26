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
    <nav className="bg-black/80 backdrop-blur-xl border-b border-purple-500/30 sticky top-0 z-50 shadow-2xl shadow-purple-500/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          <div className="flex">
            {/* Logo */}
            <div className="flex-shrink-0 flex items-center">
              <Link
                to="/dashboard"
                className="flex items-center space-x-4 group"
              >
                <div className="relative">
                  <div className="absolute inset-0 bg-purple-500 rounded-2xl blur-lg opacity-75 group-hover:opacity-100 transition-all duration-300"></div>
                  <div className="relative p-3 bg-gradient-to-br from-purple-600 via-pink-600 to-purple-800 rounded-2xl border border-purple-400/50 group-hover:scale-110 transition-all duration-300">
                    <Video className="h-8 w-8 text-white" />
                  </div>
                </div>
                <div className="flex flex-col">
                  <span className="font-black text-2xl bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent tracking-wider">
                    VIDEO
                  </span>
                  <span className="font-black text-2xl bg-gradient-to-r from-pink-400 via-purple-400 to-pink-400 bg-clip-text text-transparent tracking-wider -mt-1">
                    STREAM
                  </span>
                </div>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:ml-12 md:flex md:space-x-2">
              {filteredNavigation.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`relative inline-flex items-center px-6 py-3 rounded-2xl text-sm font-bold transition-all duration-300 ${
                      isActive
                        ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-500/50"
                        : "text-gray-300 hover:text-white hover:bg-gray-900/50 border border-transparent hover:border-purple-500/30"
                    }`}
                  >
                    <Icon className="h-5 w-5 mr-2" />
                    {item.name}
                    {isActive && (
                      <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Search Bar */}
          <div className="hidden md:flex items-center flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-purple-400" />
              </div>
              <input
                type="text"
                placeholder="Search videos..."
                className="block w-full pl-12 pr-4 py-3 border border-purple-500/30 rounded-2xl leading-5 bg-black/50 backdrop-blur-sm placeholder-gray-400 focus:outline-none focus:placeholder-gray-500 focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 text-white transition-all duration-300"
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
          <div className="flex items-center space-x-6">
            {user && (
              <>
                <span className="hidden md:block text-sm text-gray-300 font-medium">
                  Welcome, {user.firstName}
                </span>
                <div className="flex items-center space-x-3">
                  <Avatar className="h-10 w-10 ring-2 ring-purple-500/50">
                    <AvatarFallback className="bg-gradient-to-br from-purple-600 to-pink-600 text-white font-bold text-lg">
                      {getInitials(user.firstName, user.lastName)}
                    </AvatarFallback>
                  </Avatar>
                  <span className="hidden md:block text-xs text-purple-300 bg-purple-900/50 px-3 py-2 rounded-full font-medium border border-purple-500/30">
                    {user.role}
                  </span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLogout}
                  className="hidden md:flex items-center space-x-2 text-gray-300 hover:text-white hover:bg-gray-900/50 border border-purple-500/30 hover:border-purple-400/50 transition-all duration-300"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </Button>
              </>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden inline-flex items-center justify-center p-3 rounded-2xl text-gray-300 hover:text-white hover:bg-gray-900/50 border border-purple-500/30 hover:border-purple-400/50 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-purple-500 transition-all duration-300"
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
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-black/95 backdrop-blur-xl border-t border-purple-500/30">
            {filteredNavigation.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center px-4 py-4 rounded-2xl text-base font-bold transition-all duration-300 ${
                    isActive
                      ? "text-white bg-gradient-to-r from-purple-600 to-pink-600 shadow-lg shadow-purple-500/50"
                      : "text-gray-300 hover:text-white hover:bg-gray-900/50 border border-transparent hover:border-purple-500/30"
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Icon className="h-6 w-6 mr-3" />
                  {item.name}
                </Link>
              );
            })}

            {/* Mobile search */}
            <div className="px-4 py-4">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Search className="h-4 w-4 text-purple-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search videos..."
                  className="block w-full pl-12 pr-4 py-3 border border-purple-500/30 rounded-2xl leading-5 bg-black/50 placeholder-gray-400 focus:outline-none focus:placeholder-gray-500 focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 text-white transition-all duration-300"
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
              <div className="px-4 py-4 border-t border-purple-500/30">
                <div className="flex items-center space-x-4 mb-4">
                  <Avatar className="h-14 w-14 ring-2 ring-purple-500/50">
                    <AvatarFallback className="bg-gradient-to-br from-purple-600 to-pink-600 text-white font-bold text-xl">
                      {getInitials(user.firstName, user.lastName)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="text-lg font-bold text-white">
                      {user.firstName} {user.lastName}
                    </div>
                    <div className="text-sm text-gray-400">{user.email}</div>
                    <div className="text-xs text-purple-300 bg-purple-900/50 px-3 py-1.5 rounded-full font-medium inline-block mt-2 border border-purple-500/30">
                      {user.role}
                    </div>
                  </div>
                </div>
                <Button
                  variant="outline"
                  onClick={handleLogout}
                  className="w-full justify-start border-purple-500/30 text-gray-300 hover:text-white hover:bg-gray-900/50 hover:border-purple-400/50 transition-all duration-300"
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
