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
  BarChart3,
  Eye,
  Clock,
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
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Stats Cards - for CREATOR and ADMIN */}
      {stats && hasRole("CREATOR") && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-gradient-to-br from-primary-50 to-primary-100 border-primary-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-sm font-semibold text-primary-800">
                Total Videos
              </CardTitle>
              <div className="bg-primary-500 p-2 rounded-lg">
                <Video className="h-4 w-4 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-primary-900">
                {stats.totalVideos || 0}
              </div>
              <p className="text-xs text-primary-700 font-medium">
                Your content library
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-secondary-50 to-secondary-100 border-secondary-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-sm font-semibold text-secondary-800">
                Total Views
              </CardTitle>
              <div className="bg-secondary-500 p-2 rounded-lg">
                <Eye className="h-4 w-4 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-secondary-900">
                {stats.totalViews || 0}
              </div>
              <p className="text-xs text-secondary-700 font-medium">
                Audience engagement
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-accent-50 to-accent-100 border-accent-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-sm font-semibold text-accent-800">
                Recent Activity
              </CardTitle>
              <div className="bg-accent-500 p-2 rounded-lg">
                <Clock className="h-4 w-4 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-accent-900">
                {stats.recentVideos || 0}
              </div>
              <p className="text-xs text-accent-700 font-medium">This month</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-primary-50 to-secondary-50 border-primary-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-sm font-semibold text-primary-800">
                Performance
              </CardTitle>
              <div className="bg-gradient-to-br from-primary-500 to-secondary-500 p-2 rounded-lg">
                <BarChart3 className="h-4 w-4 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-primary-900">
                {stats.avgViews || 0}
              </div>
              <p className="text-xs text-primary-700 font-medium">
                Avg. views per video
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {hasRole("CREATOR") && (
          <Card className="bg-gradient-to-br from-primary-50 to-primary-100 border-primary-200 hover:shadow-material-4 transition-all duration-300">
            <CardHeader className="text-center pb-4">
              <div className="bg-primary-500 p-3 rounded-full w-16 h-16 mx-auto mb-3">
                <Upload className="h-8 w-8 text-white" />
              </div>
              <CardTitle className="text-xl font-bold text-primary-900">
                Upload Video
              </CardTitle>
              <CardDescription className="text-primary-700">
                Share your latest creation with the world
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <Button
                asChild
                className="w-full bg-primary-600 hover:bg-primary-700 shadow-material-2 hover:shadow-material-4"
              >
                <Link to="/upload">
                  <Plus className="h-5 w-5 mr-2" />
                  Start Uploading
                </Link>
              </Button>
            </CardContent>
          </Card>
        )}

        <Card className="bg-gradient-to-br from-secondary-50 to-secondary-100 border-secondary-200 hover:shadow-material-4 transition-all duration-300">
          <CardHeader className="text-center pb-4">
            <div className="bg-secondary-500 p-3 rounded-full w-16 h-16 mx-auto mb-3">
              <Video className="h-8 w-8 text-white" />
            </div>
            <CardTitle className="text-xl font-bold text-secondary-900">
              Browse Videos
            </CardTitle>
            <CardDescription className="text-secondary-700">
              Discover amazing content from creators
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Button
              asChild
              variant="secondary"
              className="w-full shadow-material-2 hover:shadow-material-4"
            >
              <Link to="/videos">
                <Play className="h-5 w-5 mr-2" />
                Explore Videos
              </Link>
            </Button>
          </CardContent>
        </Card>

        {hasRole("ADMIN") && (
          <Card className="bg-gradient-to-br from-accent-50 to-accent-100 border-accent-200 hover:shadow-material-4 transition-all duration-300">
            <CardHeader className="text-center pb-4">
              <div className="bg-accent-500 p-3 rounded-full w-16 h-16 mx-auto mb-3">
                <Users className="h-8 w-8 text-white" />
              </div>
              <CardTitle className="text-xl font-bold text-accent-900">
                Manage Users
              </CardTitle>
              <CardDescription className="text-accent-700">
                Oversee platform users and permissions
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <Button
                asChild
                variant="accent"
                className="w-full shadow-material-2 hover:shadow-material-4"
              >
                <Link to="/users">
                  <Users className="h-5 w-5 mr-2" />
                  Manage Users
                </Link>
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Latest Videos Section */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-foreground">
              Latest Videos
            </h2>
            <p className="text-muted-foreground">Fresh content just for you</p>
          </div>
          <Button asChild variant="outline" className="group">
            <Link to="/videos">
              View All
              <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform duration-200" />
            </Link>
          </Button>
        </div>

        {videos.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {videos.map((video) => (
              <VideoCard key={video.id} video={video} />
            ))}
          </div>
        ) : (
          <Card className="text-center py-12">
            <div className="bg-muted p-4 rounded-full w-16 h-16 mx-auto mb-4">
              <Video className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">
              No videos yet
            </h3>
            <p className="text-muted-foreground mb-4">
              Be the first to upload a video and start building your audience!
            </p>
            {hasRole("CREATOR") && (
              <Button asChild>
                <Link to="/upload">
                  <Plus className="h-4 w-4 mr-2" />
                  Upload First Video
                </Link>
              </Button>
            )}
          </Card>
        )}
      </div>
    </div>
  );
}
