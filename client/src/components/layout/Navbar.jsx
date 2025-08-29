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
    <nav className="bg-black text-white border-b-4 border-primary sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          <div className="flex">
            {/* Logo */}
            <div className="flex-shrink-0 flex items-center">
              <Link to="/dashboard" className="flex items-center space-x-3">
                <div className="bg-primary p-2 border-2 border-white">
                  <Video className="h-8 w-8 text-white" />
                </div>
                <span className="font-serif font-bold text-2xl text-white uppercase tracking-wider">
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
                    className={`inline-flex items-center px-4 py-2 border-b-2 text-sm font-mono font-bold uppercase tracking-wider transition-all duration-200 ${
                      isActive
                        ? "border-primary bg-primary/20 text-white"
                        : "border-transparent text-white hover:text-primary hover:border-primary hover:bg-primary/10"
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
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="SEARCH VIDEOS..."
                className="block w-full pl-10 pr-3 py-3 border-2 border-white bg-white text-black placeholder-gray-500 font-mono uppercase tracking-wider focus:outline-none focus:border-primary focus:shadow-[inset_2px_2px_0px_rgba(0,0,0,0.1),0_0_0_2px_rgba(0,50,40,0.2)] text-sm"
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
                <span className="hidden md:block text-sm text-white font-mono uppercase tracking-wider">
                  Welcome, {user.firstName}
                </span>
                <div className="flex items-center space-x-2">
                  <Avatar className="h-10 w-10 border-2 border-white">
                    <AvatarFallback className="bg-primary text-white font-mono font-bold">
                      {getInitials(user.firstName, user.lastName)}
                    </AvatarFallback>
                  </Avatar>
                  <span className="hidden md:block text-xs text-white bg-primary px-3 py-1 font-mono uppercase tracking-wider border border-white">
                    {user.role}
                  </span>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleLogout}
                  className="hidden md:flex items-center space-x-2 bg-white border-2 border-white text-black hover:bg-black hover:text-white hover:border-white"
                >
                  <LogOut className="h-4 w-4" />
                  <span>LOGOUT</span>
                </Button>
              </>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden inline-flex items-center justify-center p-2 border-2 border-white text-white hover:text-primary hover:border-primary focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary"
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
        <div className="md:hidden bg-black border-t-2 border-primary">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {filteredNavigation.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center px-3 py-3 border-2 border-transparent text-base font-mono font-bold uppercase tracking-wider transition-all duration-200 ${
                    isActive
                      ? "text-primary bg-primary/20 border-primary"
                      : "text-white hover:text-primary hover:bg-primary/10 hover:border-primary"
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
                  <Search className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="SEARCH VIDEOS..."
                  className="block w-full pl-10 pr-3 py-3 border-2 border-white bg-white text-black placeholder-gray-500 font-mono uppercase tracking-wider focus:outline-none focus:border-primary focus:shadow-[inset_2px_2px_0px_rgba(0,0,0,0.1),0_0_0_2px_rgba(0,50,40,0.2)] text-sm"
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
              <div className="px-3 py-2 border-t-2 border-primary">
                <div className="flex items-center space-x-3 mb-3">
                  <Avatar className="h-12 w-12 border-2 border-white">
                    <AvatarFallback className="bg-primary text-white font-mono font-bold">
                      {getInitials(user.firstName, user.lastName)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="text-base font-mono font-bold text-white uppercase tracking-wider">
                      {user.firstName} {user.lastName}
                    </div>
                    <div className="text-sm text-gray-300 font-body">
                      {user.email}
                    </div>
                    <div className="text-xs text-white bg-primary px-2 py-1 font-mono uppercase tracking-wider border border-white inline-block">
                      {user.role}
                    </div>
                  </div>
                </div>
                <Button
                  variant="outline"
                  onClick={handleLogout}
                  className="w-full justify-start bg-white border-2 border-white text-black hover:bg-black hover:text-white hover:border-white"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  LOGOUT
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
