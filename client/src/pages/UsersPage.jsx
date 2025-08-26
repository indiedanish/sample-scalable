import React, { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { createCreator } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { CreateCreatorModal } from "@/features/users/components/CreateCreatorModal";
import { Users, Plus, Crown, Video, User, Mail, Calendar } from "lucide-react";
import { formatDate } from "@/lib/utils";

export function UsersPage() {
  const { user, hasRole } = useAuth();
  const { toast } = useToast();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  // Mock users data - in real app, this would come from an API
  const mockUsers = [
    {
      id: "1",
      email: "admin@example.com",
      firstName: "System",
      lastName: "Administrator",
      role: "ADMIN",
      isActive: true,
      createdAt: "2024-01-01T00:00:00Z",
    },
    {
      id: "2",
      email: "creator@example.com",
      firstName: "Video",
      lastName: "Creator",
      role: "CREATOR",
      isActive: true,
      createdAt: "2024-01-15T00:00:00Z",
    },
    {
      id: "3",
      email: "user@example.com",
      firstName: "John",
      lastName: "Consumer",
      role: "CONSUMER",
      isActive: true,
      createdAt: "2024-02-01T00:00:00Z",
    },
  ];

  useEffect(() => {
    // In a real app, you would fetch users from an API
    setUsers(mockUsers);
  }, []);

  const handleCreateCreator = async (creatorData) => {
    try {
      const response = await createCreator(creatorData);
      if (response.success) {
        // Add the new creator to the users list
        setUsers([...users, response.data.user]);
        setShowCreateModal(false);
        toast({
          title: "Creator account created",
          description: `Successfully created account for ${creatorData.firstName} ${creatorData.lastName}`,
        });
      }
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Failed to create creator",
        description:
          err.message ||
          "An error occurred while creating the creator account.",
      });
    }
  };

  const getInitials = (firstName, lastName) => {
    return `${firstName?.[0] || ""}${lastName?.[0] || ""}`.toUpperCase();
  };

  const getRoleIcon = (role) => {
    switch (role) {
      case "ADMIN":
        return <Crown className="h-5 w-5" />;
      case "CREATOR":
        return <Video className="h-5 w-5" />;
      case "CONSUMER":
        return <User className="h-5 w-5" />;
      default:
        return <User className="h-5 w-5" />;
    }
  };

  const getRoleVariant = (role) => {
    switch (role) {
      case "ADMIN":
        return "default";
      case "CREATOR":
        return "secondary";
      case "CONSUMER":
        return "outline";
      default:
        return "outline";
    }
  };

  const getRoleColor = (role) => {
    switch (role) {
      case "ADMIN":
        return "bg-gradient-to-r from-purple-600 to-violet-600 text-white";
      case "CREATOR":
        return "bg-gradient-to-r from-blue-600 to-indigo-600 text-white";
      case "CONSUMER":
        return "bg-slate-100 text-slate-700 border border-slate-200";
      default:
        return "bg-slate-100 text-slate-700 border border-slate-200";
    }
  };

  if (!hasRole("ADMIN")) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Users className="h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Access Denied
            </h3>
            <p className="text-gray-500 text-center">
              You don't have permission to access user management.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-10 text-center">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent mb-4">
          User Management
        </h1>
        <p className="text-lg text-slate-600 max-w-2xl mx-auto">
          Manage user accounts, roles, and permissions across the platform
        </p>
      </div>

      {/* Actions */}
      <div className="mb-8 flex justify-center">
        <Button
          onClick={() => setShowCreateModal(true)}
          className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 h-12 px-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-0.5"
        >
          <Plus className="h-5 w-5 mr-2" />
          Create Creator Account
        </Button>
      </div>

      {/* Users Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {users.map((user) => (
          <Card
            key={user.id}
            className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 bg-white/80 backdrop-blur-sm"
          >
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Avatar className="h-12 w-12 ring-2 ring-slate-100">
                    <AvatarFallback className="bg-gradient-to-br from-slate-600 to-slate-700 text-white font-semibold">
                      {getInitials(user.firstName, user.lastName)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-lg font-bold text-slate-900">
                      {user.firstName} {user.lastName}
                    </CardTitle>
                    <div className="flex items-center space-x-2 mt-1">
                      <div
                        className={`p-1.5 rounded-lg ${getRoleColor(
                          user.role
                        )}`}
                      >
                        {getRoleIcon(user.role)}
                      </div>
                      <Badge
                        variant={getRoleVariant(user.role)}
                        className="rounded-full px-3 py-1 font-medium"
                      >
                        {user.role}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2 text-slate-600">
                <Mail className="h-4 w-4" />
                <span className="text-sm">{user.email}</span>
              </div>
              <div className="flex items-center space-x-2 text-slate-600">
                <Calendar className="h-4 w-4" />
                <span className="text-sm">
                  Joined {formatDate(user.createdAt)}
                </span>
              </div>
              <div className="pt-3 border-t border-slate-100">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-slate-700">
                    Status
                  </span>
                  <Badge
                    variant={user.isActive ? "default" : "secondary"}
                    className={`rounded-full px-3 py-1 ${
                      user.isActive
                        ? "bg-green-100 text-green-700 border border-green-200"
                        : "bg-red-100 text-red-700 border border-red-200"
                    }`}
                  >
                    {user.isActive ? "Active" : "Inactive"}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Create Creator Modal */}
      <CreateCreatorModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSubmit={handleCreateCreator}
      />
    </div>
  );
}
