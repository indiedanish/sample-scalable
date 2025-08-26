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
          <div className="absolute inset-0 bg-purple-500 blur-xl opacity-75 animate-pulse"></div>
          <div className="relative animate-spin h-16 w-16 border-4 border-purple-400 border-t-transparent"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative">
      {/* Background glow effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500/5 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-pink-500/5 blur-3xl"></div>
      </div>

      {/* Welcome Header */}
      <div className="mb-16 text-center relative z-10">
        <div className="inline-block p-2 bg-gradient-to-r from-purple-600/20 to-pink-600/20 border border-purple-500/30 mb-6">
          <h1 className="text-6xl font-black bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent tracking-wider">
            Welcome back, {user?.firstName}!
          </h1>
        </div>
        <p className="text-2xl text-gray-300 max-w-3xl mx-auto font-medium leading-relaxed">
          {user?.role === "ADMIN" &&
            "Command your digital empire with advanced admin controls and analytics."}
          {user?.role === "CREATOR" &&
            "Unleash your creativity and build your audience with powerful content tools."}
          {user?.role === "CONSUMER" &&
            "Dive into a universe of incredible content from the world's best creators."}
        </p>
      </div>

      {/* Stats Cards - for CREATOR and ADMIN */}
      {stats && hasRole("CREATOR") && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16 relative z-10">
          <Card className="rounded-none border-0 bg-gradient-to-br from-purple-900/50 to-purple-800/30 backdrop-blur-xl shadow-2xl shadow-purple-500/20 border border-purple-500/30 hover:shadow-purple-500/40 transition-all duration-500 transform hover:-translate-y-2 hover:scale-105">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
              <CardTitle className="text-sm font-bold text-purple-200">
                Total Videos
              </CardTitle>
              <div className="p-3 bg-purple-500/20 border border-purple-400/30">
                <Video className="h-5 w-5 text-purple-300" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-black text-white mb-2">
                {stats.totalVideos || 0}
              </div>
              <p className="text-sm text-purple-200">
                +{stats.videosThisMonth || 0} this month
              </p>
            </CardContent>
          </Card>

          <Card className="rounded-none border-0 bg-gradient-to-br from-pink-900/50 to-pink-800/30 backdrop-blur-xl shadow-2xl shadow-pink-500/20 border border-pink-500/30 hover:shadow-pink-500/40 transition-all duration-500 transform hover:-translate-y-2 hover:scale-105">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
              <CardTitle className="text-sm font-bold text-pink-200">
                Total Users
              </CardTitle>
              <div className="p-3 bg-pink-500/20 border border-pink-400/30">
                <Users className="h-5 w-5 text-pink-300" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-black text-white mb-2">
                {stats.totalUsers || 0}
              </div>
              <p className="text-sm text-pink-200">
                +{stats.newUsersThisMonth || 0} this month
              </p>
            </CardContent>
          </Card>

          {hasRole("ADMIN") && (
            <Card className="rounded-none border-0 bg-gradient-to-br from-cyan-900/50 to-cyan-800/30 backdrop-blur-xl shadow-2xl shadow-cyan-500/20 border border-cyan-500/30 hover:shadow-cyan-500/40 transition-all duration-500 transform hover:-translate-y-2 hover:scale-105">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                <CardTitle className="text-sm font-bold text-cyan-200">
                  Creators
                </CardTitle>
                <div className="p-3 bg-cyan-500/20 border border-cyan-400/30">
                  <Upload className="h-5 w-5 text-cyan-300" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-black text-white mb-2">
                  {stats.totalCreators || 0}
                </div>
                <p className="text-sm text-cyan-200">Active creators</p>
              </CardContent>
            </Card>
          )}

          <Card className="rounded-none border-0 bg-gradient-to-br from-blue-900/50 to-blue-800/30 backdrop-blur-xl shadow-2xl shadow-blue-500/20 border border-blue-500/30 hover:shadow-blue-500/40 transition-all duration-500 transform hover:-translate-y-2 hover:scale-105">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
              <CardTitle className="text-sm font-bold text-blue-200">
                Total Views
              </CardTitle>
              <div className="p-3 bg-blue-500/20 border border-blue-400/30">
                <TrendingUp className="h-5 w-5 text-blue-300" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-black text-white mb-2">
                {stats.totalViews || 0}
              </div>
              <p className="text-sm text-blue-200">All time views</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16 relative z-10">
        {hasRole("CREATOR") && (
          <Card className="rounded-none border-0 bg-gradient-to-br from-pink-900/30 to-pink-800/80 backdrop-blur-xl shadow-2xl shadow-pink-500/20 hover:shadow-pink-500/40 transition-all duration-500 cursor-pointer group border border-pink-500/30 hover:border-pink-400/50 transform hover:-translate-y-2 hover:scale-105">
            <Link to="/upload">
              <CardHeader className="pb-6">
                <CardTitle className="flex items-center space-x-4 text-white group-hover:text-pink-200 transition-colors">
                  <div className="p-3 bg-pink-500/80 border border-pink-400/30 group-hover:bg-pink-500/30 transition-all duration-300">
                    <Plus className="h-6 w-6 text-pink-300" />
                  </div>
                  <span className="text-xl font-bold">Upload Video</span>
                </CardTitle>
                <CardDescription className="text-pink-200 text-lg">
                  Share your content with the world
                </CardDescription>
              </CardHeader>
            </Link>
          </Card>
        )}

        {hasRole("ADMIN") && (
          <Card className="rounded-none border-0 bg-gradient-to-br from-cyan-900/30 to-cyan-800/80 backdrop-blur-xl shadow-2xl shadow-cyan-500/20 hover:shadow-cyan-500/40 transition-all duration-500 cursor-pointer group border border-cyan-500/30 hover:border-cyan-400/50 transform hover:-translate-y-2 hover:scale-105">
            <Link to="/users">
              <CardHeader className="pb-6">
                <CardTitle className="flex items-center space-x-4 text-white group-hover:text-cyan-200 transition-colors">
                  <div className="p-3 bg-cyan-500/20 border border-cyan-400/30 group-hover:bg-cyan-500/30 transition-all duration-300">
                    <Plus className="h-6 w-6 text-cyan-300" />
                  </div>
                  <span className="text-xl font-bold">Manage Users</span>
                </CardTitle>
                <CardDescription className="text-cyan-200 text-lg">
                  Administer user accounts
                </CardDescription>
              </CardHeader>
            </Link>
          </Card>
        )}
      </div>

      {/* Latest Videos */}
      <div className="space-y-10 relative z-10">
        <div className="flex items-center justify-between">
          <h2 className="text-4xl font-black text-gray-100">Recent Videos</h2>
          <Link to="/videos">
            <Button
              variant="outline"
              className="flex items-center space-x-3 h-14 px-8 border-2 border-purple-500/30 hover:border-purple-400/50 hover:bg-purple-500/20 font-bold transition-all duration-300 text-gray-900"
            >
              <span>View All</span>
              <ArrowRight className="h-5 w-5" />
            </Button>
          </Link>
        </div>

        {error && (
          <div className="bg-red-900/30 border border-red-500/30 p-8 backdrop-blur-xl">
            <p className="text-red-300 text-center text-lg">{error}</p>
          </div>
        )}

        {videos.length === 0 ? (
          <Card className="rounded-none border-0 bg-gradient-to-br from-gray-900/50 to-gray-800/30 backdrop-blur-xl shadow-2xl border border-gray-500/30">
            <CardContent className="flex flex-col items-center justify-center py-20">
              <div className="p-6 bg-gray-700/50 mb-8 border border-gray-500/30">
                <Video className="h-20 w-20 text-gray-400" />
              </div>
              <h3 className="text-2xl font-bold text-gray-100 mb-4">
                No videos yet
              </h3>
              <p className="text-gray-300 text-center mb-8 max-w-md text-lg">
                {hasRole("CREATOR")
                  ? "Start by uploading your first video and sharing your creativity with the world!"
                  : "No videos have been uploaded yet. Check back soon for amazing content!"}
              </p>
              {hasRole("CREATOR") && (
                <Link to="/upload">
                  <Button className="!text-black bg-gradient-to-r from-purple-600 via-pink-600 to-purple-700 hover:from-purple-700 hover:via-pink-700 hover:to-purple-800 h-14 px-10 shadow-2xl shadow-purple-500/50 hover:shadow-purple-500/70 transition-all duration-300 transform hover:-translate-y-1 hover:scale-105 font-bold">
                    <Plus className="h-5 w-5 mr-3" />
                    Upload Video
                  </Button>
                </Link>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {videos.map((video) => (
              <VideoCard key={video.id} video={video} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
