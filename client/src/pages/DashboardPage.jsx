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
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-pastel-blue/30 border-t-pastel-blue"></div>
          <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-pastel-pink animate-ping"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Welcome Header */}
      <div className="text-center space-y-4 fade-in">
        <div className="relative inline-block">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-pastel-blue via-pastel-purple to-pastel-pink bg-clip-text text-transparent">
            Welcome back, {user?.firstName}! ✨
          </h1>
          <div className="absolute -inset-4 bg-gradient-to-r from-pastel-blue/20 via-pastel-purple/20 to-pastel-pink/20 rounded-full blur-2xl -z-10"></div>
        </div>
        <p className="text-xl text-gray-800 font-playful max-w-2xl mx-auto">
          {user?.role === "ADMIN" &&
            "Manage your platform and oversee all content with style! 🎯"}
          {user?.role === "CREATOR" &&
            "Create and manage your video content with creativity! 🎨"}
          {user?.role === "CONSUMER" &&
            "Discover and enjoy amazing videos in a beautiful space! 🌟"}
        </p>
      </div>

      {/* Stats Cards - for CREATOR and ADMIN */}
      {stats && hasRole("CREATOR") && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 slide-up">
          <Card className="card-pastel hover-lift group">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
              <CardTitle className="text-lg font-playful font-semibold text-foreground">
                Total Videos
              </CardTitle>
              <div className="p-3 bg-gradient-to-br from-pastel-blue to-pastel-purple rounded-full group-hover:scale-110 transition-transform duration-300">
                <Video className="h-6 w-6 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground mb-2">
                {stats.totalVideos || 0}
              </div>
              <p className="text-sm text-white font-playful">
                +{stats.videosThisMonth || 0} this month 🚀
              </p>
            </CardContent>
          </Card>

          <Card className="card-pastel hover-lift group">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
              <CardTitle className="text-lg font-playful font-semibold text-foreground">
                Total Users
              </CardTitle>
              <div className="p-3 bg-gradient-to-br from-pastel-pink to-pastel-orange rounded-full group-hover:scale-110 transition-transform duration-300">
                <Users className="h-6 w-6 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground mb-2">
                {stats.totalUsers || 0}
              </div>
              <p className="text-sm text-white font-playful">
                +{stats.newUsersThisMonth || 0} this month 🌱
              </p>
            </CardContent>
          </Card>

          {hasRole("ADMIN") && (
            <Card className="card-pastel hover-lift group">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                <CardTitle className="text-lg font-playful font-semibold text-foreground">
                  Creators
                </CardTitle>
                <div className="p-3 bg-gradient-to-br from-pastel-orange to-pastel-pink rounded-full group-hover:scale-110 transition-transform duration-300">
                  <Upload className="h-6 w-6 text-white" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-foreground mb-2">
                  {stats.totalCreators || 0}
                </div>
                <p className="text-sm text-white font-playful">
                  Active creators ✨
                </p>
              </CardContent>
            </Card>
          )}

          <Card className="card-pastel hover-lift group">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
              <CardTitle className="text-lg font-playful font-semibold text-foreground">
                Total Views
              </CardTitle>
              <div className="p-3 bg-gradient-to-br from-pastel-purple to-pastel-blue rounded-full group-hover:scale-110 transition-transform duration-300">
                <TrendingUp className="h-6 w-6 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground mb-2">
                {stats.totalViews || 0}
              </div>
              <p className="text-sm text-white font-playful">
                All time views 📈
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 slide-up">
        <Card className="card-pastel hover-lift cursor-pointer group">
          <Link to="/videos">
            <CardHeader className="text-center">
              <div className="mx-auto p-4 bg-gradient-to-br from-pastel-blue to-pastel-purple rounded-full w-16 h-16 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                <Play className="h-8 w-8 text-white" />
              </div>
              <CardTitle className="text-xl font-playful font-bold text-foreground">
                Browse Videos
              </CardTitle>
              <CardDescription className="font-playful text-gray-700">
                Explore all available videos 🎬
              </CardDescription>
            </CardHeader>
          </Link>
        </Card>

        {hasRole("CREATOR") && (
          <Card className="card-pastel hover-lift cursor-pointer group">
            <Link to="/upload">
              <CardHeader className="text-center">
                <div className="mx-auto p-4 bg-gradient-to-br from-pastel-pink to-pastel-orange rounded-full w-16 h-16 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Plus className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-xl font-playful font-bold text-foreground">
                  Upload Video
                </CardTitle>
                <CardDescription className="font-playful text-gray-700">
                  Share your content with the world 🌍
                </CardDescription>
              </CardHeader>
            </Link>
          </Card>
        )}

        {hasRole("ADMIN") && (
          <Card className="card-pastel hover-lift cursor-pointer group">
            <Link to="/users">
              <CardHeader className="text-center">
                <div className="mx-auto p-4 bg-gradient-to-br from-pastel-orange to-pastel-purple rounded-full w-16 h-16 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Users className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-xl font-playful font-bold text-foreground">
                  Manage Users
                </CardTitle>
                <CardDescription className="font-playful text-gray-700">
                  Administer user accounts 👥
                </CardDescription>
              </CardHeader>
            </Link>
          </Card>
        )}
      </div>

      {/* Latest Videos */}
      <div className="space-y-8 slide-up">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-pastel-blue to-pastel-purple bg-clip-text text-transparent">
            Latest Videos 🎥
          </h2>
          <Link to="/videos">
            <Button className="btn-pill bg-gradient-to-r from-pastel-blue to-pastel-purple text-white border-0 shadow-lg shadow-pastel-blue/30 hover:shadow-xl hover:shadow-pastel-blue/40">
              <span>View All</span>
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </Link>
        </div>

        {error && (
          <Card className="bg-gradient-to-r from-red-50 to-pink-50 border-2 border-red-200 rounded-2xl p-6">
            <p className="text-red-600 font-playful text-center">{error}</p>
          </Card>
        )}

        {videos.length === 0 ? (
          <Card className="card-pastel text-center py-16">
            <CardContent className="space-y-6">
              <div className="mx-auto p-6 bg-gradient-to-br from-pastel-blue/20 to-pastel-purple/20 rounded-full w-24 h-24 flex items-center justify-center">
                <Video className="h-12 w-12 text-pastel-blue" />
              </div>
              <h3 className="text-2xl font-playful font-bold text-foreground">
                No videos yet
              </h3>
              <p className="text-foreground/80 font-playful text-lg max-w-md mx-auto">
                {hasRole("CREATOR")
                  ? "Start by uploading your first video and share your creativity! ✨"
                  : "No videos have been uploaded yet. Check back soon! 🌟"}
              </p>
              {hasRole("CREATOR") && (
                <Link to="/upload">
                  <Button className="btn-pill bg-gradient-to-r from-pastel-pink to-pastel-orange text-white border-0 shadow-lg shadow-pastel-pink/30 hover:shadow-xl hover:shadow-pastel-pink/40">
                    <Plus className="h-4 w-4 mr-2" />
                    Upload Video
                  </Button>
                </Link>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {videos.map((video, index) => (
              <div
                key={video.id}
                style={{ animationDelay: `${index * 0.1}s` }}
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
