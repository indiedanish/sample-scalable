import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getUsers, updateUserStatus, createCreator } from "@/lib/api";
import { CreateCreatorModal } from "@/features/users/components/CreateCreatorModal";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Users,
  Search,
  Filter,
  User,
  Mail,
  Calendar,
  Shield,
  MoreVertical,
  Edit,
  Trash2,
  Eye,
  Zap,
  Star,
  Grid,
  List,
  UserPlus,
  ArrowRight,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export function UsersPage() {
  const { toast } = useToast();
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState("all");
  const [viewMode, setViewMode] = useState("grid");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await getUsers();

        // Handle different possible response structures
        let users = [];
        if (response.data?.users) {
          // Nested structure: response.data.users
          users = response.data.users;
        } else if (response.users) {
          // Direct structure: response.users
          users = response.users;
        } else if (Array.isArray(response)) {
          // Array structure: response is directly an array
          users = response;
        }

        setUsers(users);
      } catch (error) {
        console.error("Error fetching users:", error);
        setUsers([]); // Set empty array on error
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleStatusUpdate = async (userId, newStatus) => {
    try {
      await updateUserStatus(userId, newStatus);
      setUsers(
        users.map((user) =>
          user.id === userId ? { ...user, status: newStatus } : user
        )
      );
    } catch (error) {
      console.error("Error updating user status:", error);
    }
  };

  const handleCreateUser = async (userData) => {
    try {
      const response = await createCreator(userData);
      if (response.success) {
        toast({
          title: "Creator created successfully",
          description: `${userData.firstName} ${userData.lastName} can now upload videos`,
        });
        // Refresh the users list
        const updatedResponse = await getUsers();
        let updatedUsers = [];
        if (updatedResponse.data?.users) {
          updatedUsers = updatedResponse.data.users;
        } else if (updatedResponse.users) {
          updatedUsers = updatedResponse.users;
        } else if (Array.isArray(updatedResponse)) {
          updatedUsers = updatedResponse;
        }
        setUsers(updatedUsers);
        setIsCreateModalOpen(false);
      }
    } catch (error) {
      console.error("Error creating creator:", error);
      toast({
        variant: "destructive",
        title: "Failed to create creator",
        description:
          error.message ||
          "An error occurred while creating the creator account",
      });
    }
  };

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesRole = filterRole === "all" || user.role === filterRole;

    return matchesSearch && matchesRole;
  });

  const getRoleColor = (role) => {
    switch (role) {
      case "ADMIN":
        return "text-red-500 bg-red-500/10 border-red-500/30";
      case "CREATOR":
        return "text-blue-500 bg-blue-500/10 border-blue-500/30";
      case "CONSUMER":
        return "text-green-500 bg-green-500/10 border-green-500/30";
      default:
        return "text-muted-foreground bg-muted/10 border-muted/30";
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "ACTIVE":
        return "text-green-500 bg-green-500/10 border-green-500/30";
      case "INACTIVE":
        return "text-red-500 bg-red-500/10 border-red-500/30";
      case "SUSPENDED":
        return "text-yellow-500 bg-yellow-500/10 border-yellow-500/30";
      default:
        return "text-muted-foreground bg-muted/10 border-muted/30";
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground font-rajdhani">
            Loading users...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6 space-y-8">
      {/* Header */}
      <div className="text-center space-y-4 fade-in">
        <h1 className="font-orbitron text-4xl md:text-6xl font-bold text-primary">
          User Management
        </h1>
        <p className="text-xl text-muted-foreground font-rajdhani max-w-2xl mx-auto">
          Monitor and manage user accounts across the platform
        </p>
        <div className="flex justify-center space-x-4">
          <Shield className="h-6 w-6 text-accent" />
          <Users className="h-6 w-6 text-secondary" />
          <Star className="h-6 w-6 text-primary" />
        </div>
      </div>

      {/* Controls */}
      <div className="space-y-6 slide-up">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="flex flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search users by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-futuristic pl-10 bg-transparent"
            />
          </div>

          <div className="flex items-center space-x-4">
            <select
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
              className="bg-transparent border border-primary/30 text-foreground px-3 py-2 rounded-none font-rajdhani focus:border-primary focus:outline-none"
            >
              <option value="all">All Roles</option>
              <option value="ADMIN">Admin</option>
              <option value="CREATOR">Creator</option>
              <option value="CONSUMER">Consumer</option>
            </select>

            <div className="flex items-center space-x-2">
              <Button
                variant={viewMode === "grid" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("grid")}
                className="font-rajdhani"
              >
                <Grid className="h-4 w-4 mr-2" />
                Grid
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("list")}
                className="font-rajdhani"
              >
                <List className="h-4 w-4 mr-2" />
                List
              </Button>
            </div>

            <Button
              className="btn-futuristic font-rajdhani"
              onClick={() => setIsCreateModalOpen(true)}
            >
              <UserPlus className="h-4 w-4 mr-2" />
              Add User
            </Button>
          </div>
        </div>

        {/* Users Grid/List */}
        <div
          className={`grid ${
            viewMode === "grid"
              ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              : "gap-4"
          }`}
        >
          {filteredUsers.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <Users className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground font-rajdhani">
                No users found matching your criteria.
              </p>
            </div>
          ) : (
            filteredUsers.map((user) => (
              <Card
                key={user.id}
                className={`card-futuristic group hover:scale-105 transition-all duration-300 cursor-pointer ${
                  viewMode === "list" ? "flex flex-row" : ""
                }`}
              >
                <CardHeader className={viewMode === "list" ? "flex-1" : ""}>
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback className="bg-gray-200 text-gray-700">
                        {user.firstName?.[0] || ""}
                        {user.lastName?.[0] || ""}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium text-gray-900">
                        {user.firstName} {user.lastName}
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-gray-500">
                        <Mail className="h-3 w-3" />
                        <span>{user.email}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-gray-500 mt-1">
                        <Calendar className="h-3 w-3" />
                        <span>
                          Joined {new Date(user.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent
                  className={viewMode === "list" ? "flex-shrink-0" : ""}
                >
                  <div className="flex items-center space-x-3">
                    <Badge
                      variant={getRoleColor(user.role)}
                      className="flex items-center space-x-1"
                    >
                      <User className="h-4 w-4" />
                      <span>{user.role}</span>
                    </Badge>
                    <Badge variant={getStatusColor(user.status)}>
                      {user.status}
                    </Badge>
                  </div>
                  <div className="mt-3 flex items-center text-primary group-hover:text-primary/80 transition-colors duration-300">
                    <span className="font-rajdhani font-semibold text-sm">
                      View Profile
                    </span>
                    <Link to={`/users/${user.id}`}>
                      <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>

      {/* Create Creator Modal */}
      <CreateCreatorModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateUser}
      />
    </div>
  );
}
