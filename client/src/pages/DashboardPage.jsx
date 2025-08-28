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
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-2 border-muted border-t-primary"></div>
          <p className="text-muted-foreground">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="hero-section pt-32 pb-20 px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <div className="fade-in">
            <div className="inline-flex items-center space-x-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Sparkles className="h-4 w-4" />
              <span>Welcome back</span>
            </div>

            <h1 className="text-5xl lg:text-7xl font-bold text-foreground mb-6 tracking-tight">
              Hello, {user?.firstName}
            </h1>

            <p className="text-xl lg:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              {user?.role === "ADMIN" &&
                "Manage your platform and oversee all content with powerful tools."}
              {user?.role === "CREATOR" &&
                "Create and manage your video content. Share your vision with the world."}
              {user?.role === "CONSUMER" &&
                "Discover and enjoy amazing videos from talented creators."}
            </p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      {stats && hasRole("CREATOR") && (
        <section className="px-6 lg:px-8 pb-20">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="card-modern group hover:scale-105 transition-transform duration-300">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Total Videos
                  </CardTitle>
                  <Video className="h-4 w-4 text-primary group-hover:scale-110 transition-transform duration-200" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-foreground">
                    {stats.totalVideos || 0}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    +{stats.videosThisMonth || 0} this month
                  </p>
                </CardContent>
              </Card>

              <Card className="card-modern group hover:scale-105 transition-transform duration-300">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Total Users
                  </CardTitle>
                  <Users className="h-4 w-4 text-primary group-hover:scale-110 transition-transform duration-200" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-foreground">
                    {stats.totalUsers || 0}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    +{stats.newUsersThisMonth || 0} this month
                  </p>
                </CardContent>
              </Card>

              {hasRole("ADMIN") && (
                <Card className="card-modern group hover:scale-105 transition-transform duration-300">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      Creators
                    </CardTitle>
                    <Upload className="h-4 w-4 text-primary group-hover:scale-110 transition-transform duration-200" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-foreground">
                      {stats.totalCreators || 0}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Active creators
                    </p>
                  </CardContent>
                </Card>
              )}

              <Card className="card-modern group hover:scale-105 transition-transform duration-300">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Total Views
                  </CardTitle>
                  <TrendingUp className="h-4 w-4 text-primary group-hover:scale-110 transition-transform duration-200" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-foreground">
                    {stats.totalViews || 0}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    All time views
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      )}

      {/* Quick Actions Section */}
      <section className="px-6 lg:px-8 pb-20">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-foreground mb-8 text-center">
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="card-modern group hover:scale-105 transition-all duration-300 cursor-pointer border-0 bg-gradient-to-br from-muted/50 to-muted">
              <Link to="/videos">
                <CardHeader className="text-center">
                  <div className="mx-auto w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors duration-200">
                    <Play className="h-8 w-8 text-primary" />
                  </div>
                  <CardTitle className="text-xl font-semibold">
                    Search Videos
                  </CardTitle>
                  <CardDescription className="text-muted-foreground">
                    Explore all available videos
                  </CardDescription>
                </CardHeader>
              </Link>
            </Card>

            {hasRole("CREATOR") && (
              <Card className="card-modern group hover:scale-105 transition-all duration-300 cursor-pointer border-0 bg-gradient-to-br from-muted/50 to-muted">
                <Link to="/upload">
                  <CardHeader className="text-center">
                    <div className="mx-auto w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors duration-200">
                      <Plus className="h-8 w-8 text-primary" />
                    </div>
                    <CardTitle className="text-xl font-semibold">
                      Upload Video
                    </CardTitle>
                    <CardDescription className="text-muted-foreground">
                      Share your content with the world
                    </CardDescription>
                  </CardHeader>
                </Link>
              </Card>
            )}

            {hasRole("ADMIN") && (
              <Card className="card-modern group hover:scale-105 transition-all duration-300 cursor-pointer border-0 bg-gradient-to-br from-muted/50 to-muted">
                <Link to="/users">
                  <CardHeader className="text-center">
                    <div className="mx-auto w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors duration-200">
                      <Users className="h-8 w-8 text-primary" />
                    </div>
                    <CardTitle className="text-xl font-semibold">
                      Manage Users
                    </CardTitle>
                    <CardDescription className="text-muted-foreground">
                      Administer user accounts
                    </CardDescription>
                  </CardHeader>
                </Link>
              </Card>
            )}
          </div>
        </div>
      </section>

      {/* Latest Videos Section */}
      <section className="px-6 lg:px-8 pb-20">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-12">
            <h2 className="text-3xl font-bold text-foreground">
              Latest Videos
            </h2>
            <Link to="/videos">
              <Button className="btn-primary rounded-xl px-6 py-3">
                <span>View All</span>
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </Link>
          </div>

          {error && (
            <div className="bg-destructive/10 border border-destructive/20 rounded-xl p-6 mb-8">
              <p className="text-destructive text-center">{error}</p>
            </div>
          )}

          {videos.length === 0 ? (
            <Card className="card-modern">
              <CardContent className="flex flex-col items-center justify-center py-20">
                <div className="w-20 h-20 bg-muted rounded-2xl flex items-center justify-center mb-6">
                  <Video className="h-10 w-10 text-muted-foreground" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-3">
                  No videos yet
                </h3>
                <p className="text-muted-foreground text-center mb-6 max-w-md">
                  {hasRole("CREATOR")
                    ? "Start by uploading your first video!"
                    : "No videos have been uploaded yet."}
                </p>
                {hasRole("CREATOR") && (
                  <Link to="/upload">
                    <Button className="btn-primary rounded-xl px-6 py-3">
                      <Plus className="h-4 w-4 mr-2" />
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
      </section>
    </div>
  );
}
