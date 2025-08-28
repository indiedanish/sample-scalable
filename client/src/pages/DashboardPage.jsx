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
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full blur opacity-75 animate-pulse"></div>
          <div className="relative animate-spin rounded-full h-12 w-12 border-b-2 border-purple-400"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Welcome Header */}
      <div className="text-center slide-up">
        <h1 className="text-4xl font-bold gradient-text mb-4">
          Welcome back, {user?.firstName}! 👋
        </h1>
        <p className="text-gray-300 text-lg max-w-2xl mx-auto">
          {user?.role === "ADMIN" &&
            "Manage your platform and oversee all content with powerful admin tools."}
          {user?.role === "CREATOR" &&
            "Create and manage your video content with creative freedom."}
          {user?.role === "CONSUMER" &&
            "Discover and enjoy amazing videos from talented creators."}
        </p>
      </div>

      {/* Stats Cards - for CREATOR and ADMIN */}
      {stats && hasRole("CREATOR") && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 slide-up">
          <Card className="glass-card border-white/20 hover:border-purple-500/30 transition-all duration-300 glow-hover">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-200">
                Total Videos
              </CardTitle>
              <div className="p-2 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-lg">
                <Video className="h-4 w-4 text-purple-400" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white mb-1">
                {stats.totalVideos || 0}
              </div>
              <p className="text-xs text-gray-400">
                +{stats.videosThisMonth || 0} this month
              </p>
            </CardContent>
          </Card>

          <Card className="glass-card border-white/20 hover:border-purple-500/30 transition-all duration-300 glow-hover">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-200">
                Total Users
              </CardTitle>
              <div className="p-2 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-lg">
                <Users className="h-4 w-4 text-blue-400" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white mb-1">
                {stats.totalUsers || 0}
              </div>
              <p className="text-xs text-gray-400">
                +{stats.newUsersThisMonth || 0} this month
              </p>
            </CardContent>
          </Card>

          {hasRole("ADMIN") && (
            <Card className="glass-card border-white/20 hover:border-purple-500/30 transition-all duration-300 glow-hover">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-200">
                  Creators
                </CardTitle>
                <div className="p-2 bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-lg">
                  <Upload className="h-4 w-4 text-green-400" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-white mb-1">
                  {stats.totalCreators || 0}
                </div>
                <p className="text-xs text-gray-400">Active creators</p>
              </CardContent>
            </Card>
          )}

          <Card className="glass-card border-white/20 hover:border-purple-500/30 transition-all duration-300 glow-hover">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-200">
                Total Views
              </CardTitle>
              <div className="p-2 bg-gradient-to-br from-pink-500/20 to-rose-500/20 rounded-lg">
                <TrendingUp className="h-4 w-4 text-pink-400" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white mb-1">
                {stats.totalViews || 0}
              </div>
              <p className="text-xs text-gray-400">All time views</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 slide-up">
        <Card className="glass-card border-white/20 hover:border-purple-500/30 transition-all duration-300 glow-hover cursor-pointer group">
          <Link to="/videos">
            <CardHeader>
              <CardTitle className="flex items-center space-x-3 text-white group-hover:text-purple-300 transition-colors">
                <div className="p-2 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-lg">
                  <Play className="h-5 w-5 text-purple-400" />
                </div>
                <span>Search Videos</span>
              </CardTitle>
              <CardDescription className="text-gray-300">
                Explore all available videos
              </CardDescription>
            </CardHeader>
          </Link>
        </Card>

        {hasRole("CREATOR") && (
          <Card className="glass-card border-white/20 hover:border-purple-500/30 transition-all duration-300 glow-hover cursor-pointer group">
            <Link to="/upload">
              <CardHeader>
                <CardTitle className="flex items-center space-x-3 text-white group-hover:text-purple-300 transition-colors">
                  <div className="p-2 bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-lg">
                    <Plus className="h-5 w-5 text-green-400" />
                  </div>
                  <span>Add Video</span>
                </CardTitle>
                <CardDescription className="text-gray-300">
                  Share your content with the world
                </CardDescription>
              </CardHeader>
            </Link>
          </Card>
        )}

        {hasRole("ADMIN") && (
          <Card className="glass-card border-white/20 hover:border-purple-500/30 transition-all duration-300 glow-hover cursor-pointer group">
            <Link to="/users">
              <CardHeader>
                <CardTitle className="flex items-center space-x-3 text-white group-hover:text-purple-300 transition-colors">
                  <div className="p-2 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-lg">
                    <Users className="h-5 w-5 text-blue-400" />
                  </div>
                  <span>Manage Users</span>
                </CardTitle>
                <CardDescription className="text-gray-300">
                  Administer user accounts
                </CardDescription>
              </CardHeader>
            </Link>
          </Card>
        )}
      </div>

      {/* Latest Videos */}
      <div className="space-y-6 slide-up">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold gradient-text">Latest Videos</h2>
          <Link to="/videos">
            <Button
              variant="outline"
              className="glass border-white/20 hover:border-purple-500/30 text-white hover:text-purple-300 transition-all duration-300 glow-hover"
            >
              <span>View All</span>
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </Link>
        </div>

        {error && (
          <div className="glass-card border-red-500/30 p-4">
            <p className="text-red-400">{error}</p>
          </div>
        )}

        {videos.length === 0 ? (
          <Card className="glass-card border-white/20">
            <CardContent className="flex flex-col items-center justify-center py-16">
              <div className="relative mb-6">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full blur opacity-75"></div>
                <Video className="relative h-16 w-16 text-purple-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">
                No videos yet
              </h3>
              <p className="text-gray-300 text-center mb-6 max-w-md">
                {hasRole("CREATOR")
                  ? "Start by uploading your first video and share your creativity with the world!"
                  : "No videos have been uploaded yet. Check back soon for amazing content!"}
              </p>
              {hasRole("CREATOR") && (
                <Link to="/upload">
                  <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold px-6 py-3 rounded-xl transition-all duration-300 glow-hover">
                    <Plus className="h-4 w-4 mr-2" />
                    Upload Video
                  </Button>
                </Link>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {videos.map((video, index) => (
              <div
                key={video.id}
                style={{ animationDelay: `${index * 100}ms` }}
                className="slide-up"
              >
                <VideoCard video={video} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
