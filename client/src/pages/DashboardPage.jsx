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
        <div className="animate-spin rounded-none h-12 w-12 border-2 border-primary border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Welcome Header */}
      <div className="mb-12 text-center">
        <h1 className="newspaper-headline text-center">
          Welcome back, {user?.firstName}!
        </h1>
        <p className="newspaper-body text-center text-lg max-w-2xl mx-auto">
          {user?.role === "ADMIN" &&
            "Manage your platform and oversee all content."}
          {user?.role === "CREATOR" && "Create and manage your video content."}
          {user?.role === "CONSUMER" && "Discover and enjoy amazing videos."}
        </p>
      </div>

      {/* Stats Cards - for CREATOR and ADMIN */}
      {stats && hasRole("CREATOR") && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <Card className="card-newspaper">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-mono uppercase tracking-wider">
                Total Videos
              </CardTitle>
              <Video className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold font-serif">
                {stats.totalVideos || 0}
              </div>
              <p className="newspaper-caption mt-1">Published Content</p>
            </CardContent>
          </Card>

          <Card className="card-newspaper">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-mono uppercase tracking-wider">
                Total Views
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold font-serif">
                {stats.totalViews || 0}
              </div>
              <p className="newspaper-caption mt-1">Audience Reach</p>
            </CardContent>
          </Card>

          <Card className="card-newspaper">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-mono uppercase tracking-wider">
                Total Likes
              </CardTitle>
              <Play className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold font-serif">
                {stats.totalLikes || 0}
              </div>
              <p className="newspaper-caption mt-1">Engagement</p>
            </CardContent>
          </Card>

          <Card className="card-newspaper">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-mono uppercase tracking-wider">
                Total Users
              </CardTitle>
              <Users className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold font-serif">
                {stats.totalUsers || 0}
              </div>
              <p className="newspaper-caption mt-1">Community Size</p>
            </CardContent>
          </Card>
        </div>
      )}

      <div className="newspaper-separator"></div>

      {/* Quick Actions */}
      <div className="mb-12">
        <h2 className="newspaper-subhead text-center mb-8">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {hasRole("CREATOR") && (
            <Card className="card-newspaper text-center">
              <CardContent className="p-8">
                <Upload className="h-16 w-16 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-bold font-serif uppercase tracking-wider mb-2">
                  Upload Video
                </h3>
                <p className="newspaper-body mb-6">
                  Share your latest creation with the world
                </p>
                <Button asChild className="w-full">
                  <Link to="/upload">
                    <Plus className="h-4 w-4 mr-2" />
                    Start Upload
                  </Link>
                </Button>
              </CardContent>
            </Card>
          )}

          <Card className="card-newspaper text-center">
            <CardContent className="p-8">
              <Video className="h-16 w-16 text-primary mx-auto mb-4" />
              <h3 className="text-xl font-bold font-serif uppercase tracking-wider mb-2">
                Browse Videos
              </h3>
              <p className="newspaper-body mb-6">
                Discover amazing content from creators
              </p>
              <Button asChild variant="outline" className="w-full">
                <Link to="/videos">
                  <ArrowRight className="h-4 w-4 mr-2" />
                  Explore Now
                </Link>
              </Button>
            </CardContent>
          </Card>

          {hasRole("ADMIN") && (
            <Card className="card-newspaper text-center">
              <CardContent className="p-8">
                <Users className="h-16 w-16 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-bold font-serif uppercase tracking-wider mb-2">
                  Manage Users
                </h3>
                <p className="newspaper-body mb-6">
                  Oversee platform users and permissions
                </p>
                <Button asChild variant="secondary" className="w-full">
                  <Link to="/users">
                    <ArrowRight className="h-4 w-4 mr-2" />
                    Manage Users
                  </Link>
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      <div className="newspaper-separator"></div>

      {/* Latest Videos */}
      <div className="mb-12">
        <div className="flex items-center justify-between mb-8">
          <h2 className="newspaper-subhead">Latest Videos</h2>
          <Button asChild variant="outline">
            <Link to="/videos">
              View All
              <ArrowRight className="h-4 w-4 ml-2" />
            </Link>
          </Button>
        </div>

        {videos.length > 0 ? (
          <div className="newspaper-grid">
            {videos.map((video) => (
              <div key={video.id} className="newspaper-column">
                <VideoCard video={video} />
              </div>
            ))}
          </div>
        ) : (
          <Card className="card-newspaper text-center p-12">
            <Video className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-bold font-serif uppercase tracking-wider mb-2">
              No Videos Yet
            </h3>
            <p className="newspaper-body mb-6">
              Be the first to upload a video and start building the community!
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
