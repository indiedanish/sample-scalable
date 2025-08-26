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
  Sparkles,
  Zap,
  Target,
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
          <div className="w-16 h-16 border-4 border-purple-200 rounded-full animate-spin"></div>
          <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-t-purple-500 rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Welcome Header */}
      {/* <div className="mb-12 text-center">
        <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-purple-100 to-pink-100 px-6 py-2 rounded-full border border-purple-200 mb-4">
          <Sparkles className="h-5 w-5 text-purple-600" />
          <span className="text-sm font-semibold text-purple-700">Welcome back!</span>
        </div>
        <h1 className="text-5xl font-black bg-gradient-to-r from-gray-900 via-purple-800 to-pink-700 bg-clip-text text-transparent mb-4">
          Hello, {user?.firstName}! 👋
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
          {user?.role === "ADMIN" &&
            "Ready to manage your platform and oversee all content creation?"}
          {user?.role === "CREATOR" && "Time to create and share amazing content with the world!"}
          {user?.role === "CONSUMER" && "Discover and enjoy incredible videos from talented creators!"}
        </p>
      </div> */}

      {/* Stats Cards - for CREATOR and ADMIN */}
      {stats && hasRole("CREATOR") && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <Card className="relative overflow-hidden bg-gradient-to-br from-purple-50 to-pink-50 border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-200/30 to-pink-200/30 rounded-full -translate-y-16 translate-x-16"></div>
            <CardHeader className="relative z-10 flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-semibold text-gray-700">
                Total Videos
              </CardTitle>
              <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl">
                <Video className="h-4 w-4 text-white" />
              </div>
            </CardHeader>
            <CardContent className="relative z-10">
              <div className="text-3xl font-black text-gray-900 mb-1">{stats.totalVideos || 0}</div>
              <p className="text-xs text-purple-600 font-medium">
                +{stats.videosThisMonth || 0} this month
              </p>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden bg-gradient-to-br from-blue-50 to-cyan-50 border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-200/30 to-cyan-200/30 rounded-full -translate-y-16 translate-x-16"></div>
            <CardHeader className="relative z-10 flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-semibold text-gray-700">Total Users</CardTitle>
              <div className="p-2 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl">
                <Users className="h-4 w-4 text-white" />
              </div>
            </CardHeader>
            <CardContent className="relative z-10">
              <div className="text-3xl font-black text-gray-900 mb-1">{stats.totalUsers || 0}</div>
              <p className="text-xs text-blue-600 font-medium">
                +{stats.newUsersThisMonth || 0} this month
              </p>
            </CardContent>
          </Card>

          {hasRole("ADMIN") && (
            <Card className="relative overflow-hidden bg-gradient-to-br from-green-50 to-emerald-50 border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-green-200/30 to-emerald-200/30 rounded-full -translate-y-16 translate-x-16"></div>
              <CardHeader className="relative z-10 flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-semibold text-gray-700">Creators</CardTitle>
                <div className="p-2 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl">
                  <Upload className="h-4 w-4 text-white" />
                </div>
              </CardHeader>
              <CardContent className="relative z-10">
                <div className="text-3xl font-black text-gray-900 mb-1">
                  {stats.totalCreators || 0}
                </div>
                <p className="text-xs text-green-600 font-medium">Active creators</p>
              </CardContent>
            </Card>
          )}

          <Card className="relative overflow-hidden bg-gradient-to-br from-orange-50 to-red-50 border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-orange-200/30 to-red-200/30 rounded-full -translate-y-16 translate-x-16"></div>
            <CardHeader className="relative z-10 flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-semibold text-gray-700">Total Views</CardTitle>
              <div className="p-2 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl">
                <TrendingUp className="h-4 w-4 text-white" />
              </div>
            </CardHeader>
            <CardContent className="relative z-10">
              <div className="text-3xl font-black text-gray-900 mb-1">{stats.totalViews || 0}</div>
              <p className="text-xs text-orange-600 font-medium">All time views</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {/* <Card className="group relative overflow-hidden bg-gradient-to-br from-purple-50 to-pink-50 border-0 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 cursor-pointer">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <Link to="/videos" className="block">
            <CardHeader className="relative z-10">
              <CardTitle className="flex items-center space-x-3 text-gray-900">
                <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl shadow-lg">
                  <Play className="h-6 w-6 text-white" />
                </div>
                <span className="text-xl font-bold">Browse Videos</span>
              </CardTitle>
              <CardDescription className="text-gray-600 text-base">
                Explore all available videos from amazing creators
              </CardDescription>
            </CardHeader>
          </Link>
        </Card> */}

        {hasRole("CREATOR") && (
          <Card className="group relative overflow-hidden bg-gradient-to-br from-blue-50 to-cyan-50 border-0 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 cursor-pointer">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <Link to="/upload" className="block">
              <CardHeader className="relative z-10">
                <CardTitle className="flex items-center space-x-3 text-gray-900">
                  <div className="p-3 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl shadow-lg">
                    <Plus className="h-6 w-6 text-white" />
                  </div>
                  <span className="text-xl font-bold">Upload Video</span>
                </CardTitle>
                <CardDescription className="text-gray-600 text-base">
                  Share your creative content with the world
                </CardDescription>
              </CardHeader>
            </Link>
          </Card>
        )}

        {hasRole("ADMIN") && (
          <Card className="group relative overflow-hidden bg-gradient-to-br from-green-50 to-emerald-50 border-0 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 cursor-pointer">
            <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <Link to="/users" className="block">
              <CardHeader className="relative z-10">
                <CardTitle className="flex items-center space-x-3 text-gray-900">
                  <div className="p-3 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl shadow-lg">
                    <Users className="h-6 w-6 text-white" />
                  </div>
                  <span className="text-xl font-bold">Manage Users</span>
                </CardTitle>
                <CardDescription className="text-gray-600 text-base">
                  Administer user accounts and permissions
                </CardDescription>
              </CardHeader>
            </Link>
          </Card>
        )}
      </div>

      {/* Latest Videos */}
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl">
              <Target className="h-6 w-6 text-white" />
            </div>
            <h2 className="text-3xl font-black bg-gradient-to-r from-gray-900 to-purple-800 bg-clip-text text-transparent">
              Latest Videos
            </h2>
          </div>
          <Link to="/videos">
            <Button variant="outline" className="flex items-center space-x-2 bg-white/80 backdrop-blur-sm hover:bg-white border-purple-200 hover:border-purple-300 text-purple-700 hover:text-purple-800 rounded-xl px-6 py-3 shadow-lg hover:shadow-xl transition-all duration-200">
              <span className="font-semibold">View All</span>
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>

        {error && (
          <Card className="bg-gradient-to-r from-red-50 to-pink-50 border-red-200">
            <CardContent className="p-6">
              <p className="text-red-600 font-medium">{error}</p>
            </CardContent>
          </Card>
        )}

        {videos.length === 0 ? (
          <Card className="bg-gradient-to-br from-gray-50 to-blue-50 border-0 shadow-xl">
            <CardContent className="flex flex-col items-center justify-center py-16">
              <div className="relative mb-6">
                <div className="w-20 h-20 bg-gradient-to-br from-purple-200 to-pink-200 rounded-3xl flex items-center justify-center">
                  <Video className="h-10 w-10 text-purple-600" />
                </div>
                <div className="absolute -inset-2 bg-gradient-to-br from-purple-200 to-pink-200 rounded-3xl blur opacity-50"></div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                No videos yet
              </h3>
              <p className="text-gray-600 text-center mb-6 max-w-md">
                {hasRole("CREATOR")
                  ? "Start your creative journey by uploading your first video!"
                  : "No videos have been uploaded yet. Check back soon!"}
              </p>
              {hasRole("CREATOR") && (
                <Link to="/upload">
                  <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200">
                    <Plus className="h-5 w-5 mr-2" />
                    Upload Video
                  </Button>
                </Link>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {videos.map((video) => (
              <VideoCard key={video.id} video={video} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
