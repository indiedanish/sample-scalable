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
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-primary/20 border-t-primary"></div>
          <div
            className="absolute inset-0 rounded-full border-4 border-transparent border-t-accent animate-spin"
            style={{ animationDirection: "reverse", animationDuration: "1.5s" }}
          ></div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      {/* Welcome Header */}
      <div className="mb-12">
        <div className="flex items-center space-x-4 mb-4">
          <div className="h-12 w-1 bg-gradient-to-b from-primary to-accent rounded-full"></div>
          <div>
            <h1 className="text-4xl font-bold text-gradient">
              Welcome back, {user?.firstName}!
            </h1>
            <p className="text-muted-foreground mt-2 text-lg">
              {user?.role === "ADMIN" &&
                "Manage your platform and oversee all content."}
              {user?.role === "CREATOR" &&
                "Create and manage your video content."}
              {user?.role === "CONSUMER" &&
                "Discover and enjoy amazing videos."}
            </p>
          </div>
        </div>
      </div>

      {/* Stats Cards - for CREATOR and ADMIN */}
      {stats && hasRole("CREATOR") && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <div className="gradient-border">
            <div className="p-6 bg-card hover-lift">
              <div className="flex items-center justify-between mb-4">
                <div className="h-12 w-12 bg-primary/10 rounded-xl flex items-center justify-center">
                  <Video className="h-6 w-6 text-primary" />
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-foreground">
                    {stats.totalVideos || 0}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Total Videos
                  </div>
                </div>
              </div>
              <div className="h-1 bg-gradient-to-r from-primary to-accent rounded-full"></div>
            </div>
          </div>

          <div className="gradient-border">
            <div className="p-6 bg-card hover-lift">
              <div className="flex items-center justify-between mb-4">
                <div className="h-12 w-12 bg-accent/10 rounded-xl flex items-center justify-center">
                  <Play className="h-6 w-6 text-accent" />
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-foreground">
                    {stats.totalViews || 0}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Total Views
                  </div>
                </div>
              </div>
              <div className="h-1 bg-gradient-to-r from-accent to-primary rounded-full"></div>
            </div>
          </div>

          <div className="gradient-border">
            <div className="p-6 bg-card hover-lift">
              <div className="flex items-center justify-between mb-4">
                <div className="h-12 w-12 bg-green-500/10 rounded-xl flex items-center justify-center">
                  <TrendingUp className="h-6 w-6 text-green-500" />
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-foreground">
                    {stats.avgRating || 0}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Avg Rating
                  </div>
                </div>
              </div>
              <div className="h-1 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full"></div>
            </div>
          </div>

          <div className="gradient-border">
            <div className="p-6 bg-card hover-lift">
              <div className="flex items-center justify-between mb-4">
                <div className="h-12 w-12 bg-purple-500/10 rounded-xl flex items-center justify-center">
                  <Users className="h-6 w-6 text-purple-500" />
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-foreground">
                    {stats.totalSubscribers || 0}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Subscribers
                  </div>
                </div>
              </div>
              <div className="h-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"></div>
            </div>
          </div>
        </div>
      )}

      {/* Latest Videos Section */}
      <div className="mb-12">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-3">
            <div className="h-8 w-1 bg-gradient-to-b from-primary to-accent rounded-full"></div>
            <h2 className="text-2xl font-bold text-foreground">
              Latest Videos
            </h2>
          </div>
          <Link to="/videos">
            <Button
              variant="outline"
              className="group hover:bg-primary hover:text-primary-foreground transition-all"
            >
              View All
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>

        {videos.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {videos.map((video) => (
              <div key={video.id} className="group">
                <VideoCard video={video} />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="h-16 w-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <Video className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium text-foreground mb-2">
              No videos yet
            </h3>
            <p className="text-muted-foreground mb-4">
              Start exploring or upload your first video
            </p>
            {hasRole("CREATOR") && (
              <Link to="/upload">
                <Button className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-white">
                  <Plus className="mr-2 h-4 w-4" />
                  Upload Video
                </Button>
              </Link>
            )}
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="gradient-border">
          <div className="p-6 bg-card hover-lift">
            <div className="flex items-center space-x-4">
              <div className="h-16 w-16 bg-primary/10 rounded-2xl flex items-center justify-center">
                <Upload className="h-8 w-8 text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  Ready to Create?
                </h3>
                <p className="text-muted-foreground mb-4">
                  Share your creativity with the world
                </p>
                {hasRole("CREATOR") && (
                  <Link to="/upload">
                    <Button
                      size="sm"
                      className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90"
                    >
                      Start Uploading
                    </Button>
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="gradient-border">
          <div className="p-6 bg-card hover-lift">
            <div className="flex items-center space-x-4">
              <div className="h-16 w-16 bg-accent/10 rounded-2xl flex items-center justify-center">
                <Video className="h-8 w-8 text-accent" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  Discover Content
                </h3>
                <p className="text-muted-foreground mb-4">
                  Find amazing videos from creators
                </p>
                <Link to="/videos">
                  <Button
                    size="sm"
                    variant="outline"
                    className="hover:bg-accent hover:text-accent-foreground"
                  >
                    Browse Videos
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
