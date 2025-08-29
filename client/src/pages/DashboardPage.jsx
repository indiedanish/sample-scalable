import React, { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { getLatestVideos, getDashboardStats } from "@/lib/api";
import { VideoCard } from "@/features/videos/components/VideoCard";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import {
  Video,
  Users,
  Upload,
  TrendingUp,
  Play,
  Plus,
  ArrowRight,
  BarChart3,
  Eye,
  Clock,
  Home,
  Settings,
  Activity,
  Star,
} from "lucide-react";

export function DashboardPage() {
  const { user, hasRole } = useAuth();
  const [videos, setVideos] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);

      // Load latest videos
      const videosResponse = await getLatestVideos(8);
      if (videosResponse.success) {
        setVideos(videosResponse.data.videos);
      }

      // Load stats if user can see them
      if (hasRole("CREATOR")) {
        try {
          const statsResponse = await getDashboardStats();
          if (statsResponse.success) {
            setStats(statsResponse.data.stats);
          }
        } catch (err) {
          // Stats are optional, don't show error if they fail
          console.warn("Failed to load stats:", err);
        }
      }
    } catch (err) {
      setError("Failed to load dashboard data");
      console.error("Dashboard error:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-primary-200 border-t-primary-600"></div>
          <p className="text-muted-foreground font-medium">
            Loading your dashboard...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Top Navigation Bar */}
        <div className="flex items-center justify-between mb-8 p-4 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20">
          <div className="flex items-center space-x-4">
            <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl">
              <Home className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Dashboard</h1>
              <p className="text-sm text-gray-600">
                Welcome to your control center
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <span className="text-sm text-gray-600">Signed in as</span>
            <div className="px-3 py-1 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full">
              <span className="text-sm font-medium text-gray-700">
                {user?.firstName} {user?.lastName}
              </span>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-12 gap-8">
          {/* Left Sidebar */}
          <div className="col-span-12 lg:col-span-3 space-y-6">
            {/* User Profile Card */}
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
              <CardHeader className="text-center pb-4">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <span className="text-2xl font-bold text-white">
                    {user?.firstName?.charAt(0)}
                    {user?.lastName?.charAt(0)}
                  </span>
                </div>
                <CardTitle className="text-lg font-bold text-gray-900">
                  {user?.firstName} {user?.lastName}
                </CardTitle>
                <CardDescription className="text-gray-600 capitalize">
                  {user?.role?.toLowerCase()}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                  <span className="text-sm text-gray-600">Member since</span>
                  <span className="text-sm font-medium text-gray-900">
                    2024
                  </span>
                </div>
                <div className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                  <span className="text-sm text-gray-600">Status</span>
                  <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full font-medium">
                    Active
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            {stats && hasRole("CREATOR") && (
              <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 text-gray-900">
                    <Activity className="h-5 w-5 text-blue-500" />
                    <span>Quick Stats</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Videos</span>
                    <span className="text-lg font-bold text-blue-600">
                      {stats.totalVideos || 0}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Views</span>
                    <span className="text-lg font-bold text-purple-600">
                      {stats.totalViews || 0}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">This Month</span>
                    <span className="text-lg font-bold text-green-600">
                      {stats.recentVideos || 0}
                    </span>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Navigation Links */}
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
              <CardHeader>
                <CardTitle className="text-gray-900">Quick Access</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Link to="/videos" className="block">
                  <Button
                    variant="ghost"
                    className="w-full justify-start text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                  >
                    <Play className="h-4 w-4 mr-3" />
                    Browse Videos
                  </Button>
                </Link>
                {hasRole("CREATOR") && (
                  <Link to="/upload" className="block">
                    <Button
                      variant="ghost"
                      className="w-full justify-start text-gray-700 hover:bg-green-50 hover:text-green-600"
                    >
                      <Upload className="h-4 w-4 mr-3" />
                      Upload Video
                    </Button>
                  </Link>
                )}
                {hasRole("ADMIN") && (
                  <Link to="/users" className="block">
                    <Button
                      variant="ghost"
                      className="w-full justify-start text-gray-700 hover:bg-purple-50 hover:text-purple-600"
                    >
                      <Users className="h-4 w-4 mr-3" />
                      Manage Users
                    </Button>
                  </Link>
                )}
                <Link to="/settings" className="block">
                  <Button
                    variant="ghost"
                    className="w-full justify-start text-gray-700 hover:bg-gray-50"
                  >
                    <Settings className="h-4 w-4 mr-3" />
                    Settings
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>

          {/* Main Content Area */}
          <div className="col-span-12 lg:col-span-9 space-y-8">
            {/* Featured Section */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-700 rounded-3xl p-8 text-white">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-3xl font-bold mb-2">Ready to create?</h2>
                  <p className="text-blue-100 text-lg">
                    {hasRole("CREATOR")
                      ? "Share your latest video with the world and grow your audience"
                      : "Discover amazing content from talented creators around the world"}
                  </p>
                </div>
                <div className="hidden md:block">
                  <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center">
                    <Star className="h-12 w-12 text-yellow-300" />
                  </div>
                </div>
              </div>
              <div className="flex flex-wrap gap-4">
                {hasRole("CREATOR") && (
                  <Button
                    asChild
                    size="lg"
                    className="bg-white text-blue-600 hover:bg-gray-100"
                  >
                    <Link to="/upload">
                      <Plus className="h-5 w-5 mr-2" />
                      Upload Video
                    </Link>
                  </Button>
                )}
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="border-white/30 text-black hover:bg-white/10"
                >
                  <Link to="/videos">
                    <Play className="h-5 w-5 mr-2" />
                    Explore Videos
                  </Link>
                </Button>
              </div>
            </div>

            {/* Latest Videos Section */}
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/20">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    Latest Videos
                  </h2>
                  <p className="text-gray-600">Fresh content just for you</p>
                </div>
                <Button asChild variant="outline" className="group">
                  <Link to="/videos">
                    View All
                    <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform duration-200" />
                  </Link>
                </Button>
              </div>

              {videos.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {videos.map((video) => (
                    <VideoCard key={video.id} video={video} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="w-20 h-20 bg-gray-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <Video className="h-10 w-10 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    No videos yet
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Be the first to upload a video and start building your
                    audience!
                  </p>
                  {hasRole("CREATOR") && (
                    <Button asChild>
                      <Link to="/upload">
                        <Plus className="h-4 w-4 mr-2" />
                        Upload First Video
                      </Link>
                    </Button>
                  )}
                </div>
              )}
            </div>

            {/* Activity Feed */}
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/20">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Recent Activity
              </h2>
              <div className="space-y-4">
                <div className="flex items-center space-x-4 p-4 bg-blue-50 rounded-xl">
                  <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                    <Play className="h-5 w-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">
                      New video uploaded
                    </p>
                    <p className="text-xs text-gray-600">2 hours ago</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4 p-4 bg-green-50 rounded-xl">
                  <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                    <Eye className="h-5 w-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">
                      Video reached 100 views
                    </p>
                    <p className="text-xs text-gray-600">1 day ago</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4 p-4 bg-purple-50 rounded-xl">
                  <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center">
                    <Users className="h-5 w-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">
                      New follower joined
                    </p>
                    <p className="text-xs text-gray-600">3 days ago</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
