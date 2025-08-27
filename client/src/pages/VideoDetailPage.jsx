import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { getVideo, updateVideoViews } from "@/lib/api";
import { canEditVideo } from "@/lib/auth";
import { formatDate, formatDuration, formatFileSize } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import {
  Play,
  Calendar,
  HardDrive,
  Eye,
  Star,
  Edit,
  Trash2,
  ArrowLeft,
  MessageCircle,
  ThumbsUp,
  Zap,
  Shield,
} from "lucide-react";

export function VideoDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();

  const [video, setVideo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (id) {
      loadVideoData();
    }
  }, [id]);

  const loadVideoData = async () => {
    try {
      setLoading(true);
      setError("");

      // Load video details
      const videoResponse = await getVideo(id);

      if (videoResponse.success) {
        setVideo(videoResponse.data.video);
        // Update view count
        try {
          await updateVideoViews(id);
        } catch (viewError) {
          console.log("View update failed (non-critical):", viewError);
        }
      } else {
        setError("Video not found");
        return;
      }
    } catch (err) {
      setError("Failed to load video data");
      console.error("Video detail error:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground font-rajdhani">
            Loading video...
          </p>
        </div>
      </div>
    );
  }

  if (!video) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <MessageCircle className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="font-orbitron text-xl text-muted-foreground mb-2">
            Video not found
          </h3>
          <Link to="/videos">
            <Button className="btn-futuristic font-rajdhani">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Videos
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6 space-y-8">
      {/* Back Button */}
      <div className="slide-in-left">
        <Link to="/videos">
          <Button
            variant="ghost"
            className="text-primary hover:text-primary/80 hover:bg-primary/10 font-rajdhani"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Videos
          </Button>
        </Link>
      </div>

      {/* Video Player Section */}
      <div className="space-y-6 slide-up">
        <div className="aspect-video bg-card rounded-none border border-primary/20 overflow-hidden relative group">
          {video.blobUrl ? (
            <video
              src={video.blobUrl}
              controls
              className="w-full h-full object-cover"
              preload="metadata"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/10 to-secondary/10">
              <div className="text-center">
                <Play className="h-16 w-16 text-primary mx-auto mb-4" />
                <p className="text-muted-foreground font-rajdhani">
                  Video player not available
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Video Information */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 slide-up">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <div className="space-y-4">
            <h1 className="font-orbitron text-3xl md:text-4xl font-bold text-primary">
              {video.title}
            </h1>

            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground font-rajdhani">
              <div className="flex items-center space-x-2">
                <Eye className="h-4 w-4" />
                <span>{video.views || 0} views</span>
              </div>
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4" />
                <span>{formatDate(video.createdAt)}</span>
              </div>
              {video.duration && (
                <div className="flex items-center space-x-2">
                  <HardDrive className="h-4 w-4" />
                  <span>Duration: {formatDuration(video.duration)}</span>
                </div>
              )}
            </div>

            {video.description && (
              <p className="text-foreground font-rajdhani leading-relaxed">
                {video.description}
              </p>
            )}

            {/* File Info */}
            <div className="bg-card/50 border border-primary/20 p-4 rounded-none">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground font-rajdhani">
                    File:
                  </span>
                  <p className="text-foreground font-rajdhani font-semibold">
                    {video.fileName}
                  </p>
                </div>
                <div>
                  <span className="text-muted-foreground font-rajdhani">
                    Size:
                  </span>
                  <p className="text-foreground font-rajdhani font-semibold">
                    {formatFileSize(video.fileSize)}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Creator Information */}
          <Card className="card-futuristic">
            <CardHeader>
              <CardTitle className="font-orbitron text-lg text-primary flex items-center space-x-2">
                <Shield className="h-5 w-5" />
                <span>Creator</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-4">
                <Avatar className="h-12 w-12 ring-2 ring-primary/30">
                  <AvatarFallback className="bg-primary/20 text-primary font-rajdhani font-semibold">
                    {video.creator?.firstName?.[0]}
                    {video.creator?.lastName?.[0]}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h4 className="font-rajdhani font-semibold text-foreground">
                    {video.creator?.firstName} {video.creator?.lastName}
                  </h4>
                  <p className="text-muted-foreground font-rajdhani text-sm">
                    {video.creator?.email}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Video Stats */}
          <Card className="card-futuristic">
            <CardHeader>
              <CardTitle className="font-orbitron text-lg text-primary">
                Statistics
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground font-rajdhani">
                  Views
                </span>
                <span className="font-orbitron font-semibold text-primary">
                  {video.views || 0}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground font-rajdhani">
                  Status
                </span>
                <Badge className="bg-accent/10 text-accent border-accent/30 font-rajdhani">
                  {video.isPublic ? "Public" : "Private"}
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="card-futuristic">
            <CardHeader>
              <CardTitle className="font-orbitron text-lg text-primary">
                Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="btn-futuristic w-full font-rajdhani">
                <ThumbsUp className="h-4 w-4 mr-2" />
                Like Video
              </Button>
              <Button
                variant="outline"
                className="w-full border-secondary/30 text-secondary hover:text-secondary/80 hover:bg-secondary/10 font-rajdhani"
              >
                <MessageCircle className="h-4 w-4 mr-2" />
                Share
              </Button>
            </CardContent>
          </Card>

          {/* System Info */}
          <Card className="card-futuristic">
            <CardHeader>
              <CardTitle className="font-orbitron text-lg text-primary flex items-center space-x-2">
                <Zap className="h-5 w-5" />
                <span>System</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground font-rajdhani">
                  Quality
                </span>
                <span className="text-foreground font-rajdhani">HD</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground font-rajdhani">
                  Format
                </span>
                <span className="text-foreground font-rajdhani">MP4</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground font-rajdhani">
                  Status
                </span>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-foreground font-rajdhani">Active</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
