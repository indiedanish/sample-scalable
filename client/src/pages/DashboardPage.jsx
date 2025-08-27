import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { getVideos, getUsers } from "@/lib/api";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Video,
  Users,
  Upload,
  TrendingUp,
  Clock,
  Eye,
  Play,
  ArrowRight,
  Zap,
  Shield,
  Star,
} from "lucide-react";

export function DashboardPage() {
  const { user, hasRole } = useAuth();
  const [stats, setStats] = useState({
    totalVideos: 0,
    totalUsers: 0,
    recentVideos: [],
    recentUsers: [],
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [videosResponse, usersResponse] = await Promise.all([
          getVideos(),
          hasRole("ADMIN")
            ? getUsers()
            : Promise.resolve({ data: { users: [] } }),
        ]);

        // Helper function to extract data from different response structures
        const extractVideos = (response) => {
          if (response.data?.videos) return response.data.videos;
          if (response.videos) return response.videos;
          if (Array.isArray(response)) return response;
          return [];
        };

        const extractUsers = (response) => {
          if (response.data?.users) return response.data.users;
          if (response.users) return response.users;
          if (Array.isArray(response)) return response;
          return [];
        };

        const videos = extractVideos(videosResponse);
        const users = extractUsers(usersResponse);

        setStats({
          totalVideos: videos.length,
          totalUsers: users.length,
          recentVideos: videos.slice(0, 5),
          recentUsers: users.slice(0, 5),
        });
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, [hasRole]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground font-rajdhani">
            Loading dashboard...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6 space-y-8">
      {/* Hero Section */}
      <div className="text-center space-y-4 fade-in">
        <h1 className="font-orbitron text-4xl md:text-6xl font-bold text-primary">
          Welcome Back, {user?.firstName}!
        </h1>
        <p className="text-xl text-muted-foreground font-rajdhani max-w-2xl mx-auto">
          Your command center for the future of video streaming. Monitor,
          manage, and create content with cutting-edge technology.
        </p>
        <div className="flex justify-center space-x-4">
          <Zap className="h-6 w-6 text-accent" />
          <Shield className="h-6 w-6 text-secondary" />
          <Star className="h-6 w-6 text-primary" />
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 slide-up">
        <Card className="card-futuristic group hover:scale-105 transition-transform duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-rajdhani font-medium text-muted-foreground">
              Total Videos
            </CardTitle>
            <Video className="h-4 w-4 text-primary group-hover:text-primary/80 transition-colors duration-300" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-orbitron font-bold text-primary">
              {stats.totalVideos}
            </div>
            <p className="text-xs text-muted-foreground font-rajdhani">
              Available for streaming
            </p>
          </CardContent>
        </Card>

        <Card className="card-futuristic group hover:scale-105 transition-transform duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-rajdhani font-medium text-muted-foreground">
              Total Users
            </CardTitle>
            <Users className="h-4 w-4 text-secondary group-hover:text-secondary/80 transition-colors duration-300" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-orbitron font-bold text-secondary">
              {stats.totalUsers}
            </div>
            <p className="text-xs text-muted-foreground font-rajdhani">
              Registered users
            </p>
          </CardContent>
        </Card>

        <Card className="card-futuristic group hover:scale-105 transition-transform duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-rajdhani font-medium text-muted-foreground">
              Your Role
            </CardTitle>
            <Shield className="h-4 w-4 text-accent group-hover:text-accent/80 transition-colors duration-300" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-orbitron font-bold text-accent">
              {user?.role}
            </div>
            <p className="text-xs text-muted-foreground font-rajdhani">
              Access level
            </p>
          </CardContent>
        </Card>

        <Card className="card-futuristic group hover:scale-105 transition-transform duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-rajdhani font-medium text-muted-foreground">
              Quick Actions
            </CardTitle>
            <Zap className="h-4 w-4 text-primary group-hover:text-primary/80 transition-colors duration-300" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-orbitron font-bold text-primary">
              Ready
            </div>
            <p className="text-xs text-muted-foreground font-rajdhani">
              System operational
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="space-y-6 slide-up">
        <h2 className="font-orbitron text-2xl font-bold text-primary">
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link to="/videos">
            <Card className="card-futuristic group hover:scale-105 transition-all duration-300 cursor-pointer">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-primary/20 rounded border border-primary/30">
                    <Video className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="font-orbitron text-lg text-primary">
                    Browse Videos
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground font-rajdhani mb-4">
                  Explore the latest content and discover new videos
                </p>
                <div className="flex items-center text-primary group-hover:text-primary/80 transition-colors duration-300">
                  <span className="font-rajdhani font-semibold">Explore</span>
                  <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                </div>
              </CardContent>
            </Card>
          </Link>

          {hasRole("CREATOR") && (
            <Link to="/upload">
              <Card className="card-futuristic group hover:scale-105 transition-all duration-300 cursor-pointer">
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-secondary/20 rounded border border-secondary/30">
                      <Upload className="h-6 w-6 text-secondary" />
                    </div>
                    <CardTitle className="font-orbitron text-lg text-secondary">
                      Upload Content
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground font-rajdhani mb-4">
                    Share your creativity with the world
                  </p>
                  <div className="flex items-center text-secondary group-hover:text-secondary/80 transition-colors duration-300">
                    <span className="font-rajdhani font-semibold">Upload</span>
                    <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          )}

          {hasRole("ADMIN") && (
            <Link to="/users">
              <Card className="card-futuristic group hover:scale-105 transition-all duration-300 cursor-pointer">
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-accent/20 rounded border border-accent/30">
                      <Users className="h-6 w-6 text-accent" />
                    </div>
                    <CardTitle className="font-orbitron text-lg text-accent">
                      Manage Users
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground font-rajdhani mb-4">
                    Monitor and manage user accounts
                  </p>
                  <div className="flex items-center text-accent group-hover:text-accent/80 transition-colors duration-300">
                    <span className="font-rajdhani font-semibold">Manage</span>
                    <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          )}
        </div>
      </div>

      {/* Recent Videos */}
      {stats.recentVideos.length > 0 && (
        <div className="space-y-6 slide-up">
          <div className="flex items-center justify-between">
            <h2 className="font-orbitron text-2xl font-bold text-primary">
              Recent Videos
            </h2>
            <Link to="/videos">
              <Button
                variant="ghost"
                className="text-primary hover:text-primary/80 hover:bg-primary/10 font-rajdhani"
              >
                View All
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {stats.recentVideos.map((video) => (
              <Link key={video.id} to={`/videos/${video.id}`}>
                <Card className="card-futuristic group hover:scale-105 transition-all duration-300 cursor-pointer">
                  <CardHeader>
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-primary/20 rounded border border-primary/30">
                        <Play className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <CardTitle className="font-rajdhani text-lg text-primary truncate">
                          {video.title}
                        </CardTitle>
                        <CardDescription className="font-rajdhani text-muted-foreground">
                          by {video.creator?.firstName}{" "}
                          {video.creator?.lastName}
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between text-sm text-muted-foreground font-rajdhani">
                      <div className="flex items-center space-x-2">
                        <Clock className="h-4 w-4" />
                        <span>
                          {new Date(video.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Eye className="h-4 w-4" />
                        <span>{video.views || 0}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Recent Users (Admin Only) */}
      {hasRole("ADMIN") && stats.recentUsers.length > 0 && (
        <div className="space-y-6 slide-up">
          <div className="flex items-center justify-between">
            <h2 className="font-orbitron text-2xl font-bold text-primary">
              Recent Users
            </h2>
            <Link to="/users">
              <Button
                variant="ghost"
                className="text-primary hover:text-primary/80 hover:bg-primary/10 font-rajdhani"
              >
                View All
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {stats.recentUsers.map((user) => (
              <Link key={user.id} to={`/users/${user.id}`}>
                <Card className="card-futuristic group hover:scale-105 transition-all duration-300 cursor-pointer">
                  <CardHeader>
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-secondary/20 rounded border border-secondary/30">
                        <Users className="h-5 w-5 text-secondary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <CardTitle className="font-rajdhani text-lg text-secondary truncate">
                          {user.firstName} {user.lastName}
                        </CardTitle>
                        <CardDescription className="font-rajdhani text-muted-foreground">
                          {user.email}
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground font-rajdhani">
                        Role: {user.role}
                      </span>
                      <span className="text-xs text-muted-foreground font-rajdhani bg-secondary/10 border border-secondary/20 px-2 py-1 rounded">
                        {user.status || "Active"}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* System Status */}
      <div className="space-y-6 slide-up">
        <h2 className="font-orbitron text-2xl font-bold text-primary">
          System Status
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="card-futuristic">
            <CardHeader>
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                <CardTitle className="font-rajdhani text-lg text-primary">
                  Core Systems
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground font-rajdhani">
                All systems operational
              </p>
            </CardContent>
          </Card>

          <Card className="card-futuristic">
            <CardHeader>
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
                <CardTitle className="font-rajdhani text-lg text-primary">
                  Database
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground font-rajdhani">
                Connection stable
              </p>
            </CardContent>
          </Card>

          <Card className="card-futuristic">
            <CardHeader>
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-purple-500 rounded-full animate-pulse"></div>
                <CardTitle className="font-rajdhani text-lg text-primary">
                  Streaming
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground font-rajdhani">
                Service active
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
