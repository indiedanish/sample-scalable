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
    <nav className="sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          <div className="flex">
            {/* Logo */}
            <div className="flex-shrink-0 flex items-center">
              <Link to="/dashboard" className="flex items-center space-x-3 group">
                <div className="relative">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 via-pink-500 to-red-500 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110">
                    <Video className="h-7 w-7 text-white" />
                  </div>
                  <div className="absolute -inset-1 bg-gradient-to-br from-purple-500 via-pink-500 to-red-500 rounded-2xl blur opacity-25 group-hover:opacity-40 transition-opacity duration-300"></div>
                </div>
                <div className="flex flex-col">
                  <span className="font-black text-2xl bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 bg-clip-text text-transparent">
                    StreamFlow
                  </span>
                  <span className="text-xs text-gray-500 font-medium">Premium Content Hub</span>
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
                    className={`relative inline-flex items-center px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-300 ${
                      isActive
                        ? "text-white bg-gradient-to-r from-purple-500 to-pink-500 shadow-lg shadow-purple-500/25"
                        : "text-gray-700 hover:text-purple-600 hover:bg-white/60 backdrop-blur-sm"
                    }`}
                  >
                    <Icon className={`h-4 w-4 mr-2 ${isActive ? 'text-white' : 'text-gray-500'}`} />
                    {item.name}
                    {isActive && (
                      <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl -z-10 blur opacity-75"></div>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Search Bar */}
          <div className="hidden md:flex items-center flex-1 max-w-md mx-8">
            <div className="relative w-full group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-gray-400 group-focus-within:text-purple-500 transition-colors duration-200" />
              </div>
              <input
                type="text"
                placeholder="Discover amazing content..."
                className="block w-full pl-12 pr-4 py-3 border-0 rounded-2xl leading-5 bg-white/80 backdrop-blur-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:bg-white/90 text-sm shadow-lg shadow-gray-200/50 transition-all duration-200"
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
                <span className="hidden md:block text-sm font-medium text-gray-700 bg-white/60 backdrop-blur-sm px-4 py-2 rounded-xl">
                  Welcome, <span className="text-purple-600">{user.firstName}</span>
                </span>
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <Avatar className="h-10 w-10 ring-2 ring-white/50 shadow-lg">
                      <AvatarFallback className="bg-gradient-to-br from-purple-500 to-pink-500 text-white font-semibold">
                        {getInitials(user.firstName, user.lastName)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-gradient-to-r from-green-400 to-blue-500 rounded-full border-2 border-white"></div>
                  </div>
                  {/* <span className="hidden md:block text-xs font-medium text-gray-600 bg-gradient-to-r from-purple-100 to-pink-100 px-3 py-1 rounded-full border border-purple-200">
                    {user.role}
                  </span> */}
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLogout}
                  className="hidden md:flex items-center space-x-2 bg-white/60 backdrop-blur-sm hover:bg-white/80 text-gray-700 hover:text-red-600 transition-all duration-200 rounded-xl px-4 py-2"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </Button>
              </>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden inline-flex items-center justify-center p-3 rounded-xl text-gray-700 hover:text-purple-600 hover:bg-white/60 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all duration-200"
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
          <div className="px-4 pt-4 pb-6 space-y-3 bg-white/80 backdrop-blur-md border-t border-white/20 mx-4 rounded-b-2xl shadow-xl">
            {filteredNavigation.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center px-4 py-3 rounded-xl text-base font-medium transition-all duration-200 ${
                    isActive
                      ? "text-white bg-gradient-to-r from-purple-500 to-pink-500 shadow-lg"
                      : "text-gray-700 hover:text-purple-600 hover:bg-white/60"
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
                  <Search className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Discover amazing content..."
                  className="block w-full pl-12 pr-4 py-3 border-0 rounded-xl leading-5 bg-white/80 backdrop-blur-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:bg-white/90 text-sm shadow-lg"
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
              <div className="px-4 py-4 border-t border-white/20">
                <div className="flex items-center space-x-3 mb-4">
                  <Avatar className="h-12 w-12 ring-2 ring-white/50">
                    <AvatarFallback className="bg-gradient-to-br from-purple-500 to-pink-500 text-white font-semibold">
                      {getInitials(user.firstName, user.lastName)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="text-base font-semibold text-gray-800">
                      {user.firstName} {user.lastName}
                    </div>
                    <div className="text-sm text-gray-500">{user.email}</div>
                    <div className="text-xs font-medium text-purple-600 bg-gradient-to-r from-purple-100 to-pink-100 px-3 py-1 rounded-full border border-purple-200 inline-block mt-1">
                      {user.role}
                    </div>
                  </div>
                </div>
                <Button
                  variant="outline"
                  onClick={handleLogout}
                  className="w-full justify-start bg-white/60 backdrop-blur-sm hover:bg-white/80 text-gray-700 hover:text-red-600 border-gray-200 rounded-xl"
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
