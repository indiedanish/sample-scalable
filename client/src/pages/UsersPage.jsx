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
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              User Management
            </h1>
            <p className="text-gray-600 mt-2">
              Manage platform users and create creator accounts
            </p>
          </div>
          <Button onClick={() => setShowCreateModal(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Create Creator
          </Button>
        </div>
      </div>

      {/* User Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{users.length}</div>
            <p className="text-xs text-muted-foreground">Registered users</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Creators</CardTitle>
            <Video className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {users.filter((u) => u.role === "CREATOR").length}
            </div>
            <p className="text-xs text-muted-foreground">Content creators</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Consumers</CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {users.filter((u) => u.role === "CONSUMER").length}
            </div>
            <p className="text-xs text-muted-foreground">Regular users</p>
          </CardContent>
        </Card>
      </div>

      {/* Users List */}
      <Card>
        <CardHeader>
          <CardTitle>All Users</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : users.length === 0 ? (
            <div className="text-center py-8">
              <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No users found</p>
            </div>
          ) : (
            <div className="space-y-4">
              {users.map((userData) => (
                <div
                  key={userData.id}
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center space-x-4">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback className="bg-gray-200 text-gray-700">
                        {getInitials(userData.firstName, userData.lastName)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium text-gray-900">
                        {userData.firstName} {userData.lastName}
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-gray-500">
                        <Mail className="h-3 w-3" />
                        <span>{userData.email}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-gray-500 mt-1">
                        <Calendar className="h-3 w-3" />
                        <span>Joined {formatDate(userData.createdAt)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <Badge
                      variant={getRoleVariant(userData.role)}
                      className="flex items-center space-x-1"
                    >
                      {getRoleIcon(userData.role)}
                      <span>{userData.role}</span>
                    </Badge>

                    <Badge
                      variant={userData.isActive ? "default" : "destructive"}
                    >
                      {userData.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Create Creator Modal */}
      <CreateCreatorModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSubmit={handleCreateCreator}
      />
    </div>
  );
}
