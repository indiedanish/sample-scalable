import React, { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { createCreator } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { CreateCreatorModal } from "@/features/users/components/CreateCreatorModal";
import {
  Users,
  Plus,
  Crown,
  Video,
  User,
  Mail,
  Calendar,
  Leaf,
  Sparkles,
} from "lucide-react";
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
        return <Crown className="h-4 w-4" />;
      case "CREATOR":
        return <Video className="h-4 w-4" />;
      case "CONSUMER":
        return <User className="h-4 w-4" />;
      default:
        return <User className="h-4 w-4" />;
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
        return "bg-eco-leaf/20 text-eco-leaf border-eco-leaf/30";
      case "CREATOR":
        return "bg-eco-earth/20 text-eco-earth border-eco-earth/30";
      case "CONSUMER":
        return "bg-eco-sage/20 text-eco-sage border-eco-sage/30";
      default:
        return "bg-eco-sage/20 text-eco-sage border-eco-sage/30";
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      {/* Header */}
      <div className="text-center mb-10">
        <div className="relative inline-block mb-6">
          <div className="w-20 h-20 bg-eco-leaf/10 rounded-full flex items-center justify-center mb-4 mx-auto">
            <Users className="h-10 w-10 text-eco-leaf" />
          </div>
          <Leaf className="h-6 w-6 text-eco-sage absolute -top-2 -right-2 animate-float" />
          <Sparkles className="h-4 w-4 text-eco-earth absolute -bottom-1 -left-1 animate-pulse" />
        </div>
        <h1 className="font-eco text-4xl font-bold text-eco-forest mb-3">
          Community Management
        </h1>
        <p className="text-eco-forest/70 text-lg font-medium max-w-2xl mx-auto">
          Manage user accounts and oversee the growth of our creative community
        </p>
        <div className="leaf-divider mt-6"></div>
      </div>

      {/* Actions */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="font-eco text-2xl font-semibold text-eco-forest">
            Users
          </h2>
          <p className="text-eco-forest/70">Total: {users.length} users</p>
        </div>
        <Button
          onClick={() => setShowCreateModal(true)}
          className="btn-eco flex items-center space-x-2"
        >
          <Plus className="h-4 w-4" />
          <span>Create Creator</span>
        </Button>
      </div>

      {/* Users Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {users.map((user) => (
          <Card
            key={user.id}
            className="card-eco border-eco-sage/20 hover:shadow-eco-lg transition-all duration-300 group"
          >
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <Avatar className="h-12 w-12 ring-2 ring-eco-sage/20 group-hover:ring-eco-leaf/30 transition-all duration-300">
                  <AvatarFallback className="bg-gradient-to-br from-eco-leaf to-eco-moss text-white font-semibold">
                    {getInitials(user.firstName, user.lastName)}
                  </AvatarFallback>
                </Avatar>
                <Badge
                  variant={getRoleVariant(user.role)}
                  className={`${getRoleColor(
                    user.role
                  )} text-xs px-3 py-1.5 rounded-full font-medium border`}
                >
                  <div className="flex items-center space-x-1">
                    {getRoleIcon(user.role)}
                    <span>{user.role}</span>
                  </div>
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <h3 className="font-semibold text-eco-forest text-lg">
                  {user.firstName} {user.lastName}
                </h3>
                <div className="flex items-center space-x-2 text-eco-forest/70 text-sm">
                  <Mail className="h-3 w-3" />
                  <span className="truncate">{user.email}</span>
                </div>
              </div>

              <div className="flex items-center space-x-2 text-eco-forest/60 text-xs">
                <Calendar className="h-3 w-3" />
                <span>Joined {formatDate(user.createdAt)}</span>
              </div>

              <div className="pt-2 border-t border-eco-sage/20">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-eco-forest/60">Status</span>
                  <Badge
                    variant={user.isActive ? "default" : "secondary"}
                    className={`text-xs px-2 py-1 rounded-full ${
                      user.isActive
                        ? "bg-eco-leaf/20 text-eco-leaf border border-eco-leaf/30"
                        : "bg-eco-sage/20 text-eco-sage border border-eco-sage/30"
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
