import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import {
  getVideo,
  getComments,
  getRatings,
  getRatingStats,
  addComment,
  addRating,
  deleteVideo,
  updateVideo,
  getVideoStreamUrl,
} from "@/lib/api";
import { canEditVideo } from "@/lib/auth";
import { formatDate, formatDuration, formatFileSize } from "@/lib/utils";
import { VideoPlayer } from "@/features/videos/components/VideoPlayer";
import { CommentsSection } from "@/features/videos/components/CommentsSection";
import { RatingsSection } from "@/features/videos/components/RatingsSection";
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
  Clock,
  Zap,
  Plus,
  Image,
  Video,
  Upload,
  Users,
  TrendingUp,
} from "lucide-react";

export function VideoDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();

  const [video, setVideo] = useState(null);
  const [comments, setComments] = useState([]);
  const [ratings, setRatings] = useState([]);
  const [ratingStats, setRatingStats] = useState(null);
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
      } else {
        setError("Video not found");
        return;
      }

      // Load comments and ratings in parallel
      const [commentsResponse, ratingsResponse, statsResponse] =
        await Promise.allSettled([
          getComments(id, { limit: 20 }),
          getRatings(id, { limit: 10 }),
          getRatingStats(id),
        ]);

      if (
        commentsResponse.status === "fulfilled" &&
        commentsResponse.value.success
      ) {
        setComments(commentsResponse.value.data.comments);
      }

      if (
        ratingsResponse.status === "fulfilled" &&
        ratingsResponse.value.success
      ) {
        setRatings(ratingsResponse.value.data.ratings);
      }

      if (statsResponse.status === "fulfilled" && statsResponse.value.success) {
        setRatingStats(statsResponse.value.data.stats);
      }
    } catch (err) {
      setError("Failed to load video data");
      console.error("Video detail error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddComment = async (content) => {
    try {
      const response = await addComment(id, content);
      if (response.success) {
        setComments([response.data.comment, ...comments]);
        toast({
          title: "Comment added",
          description: "Your comment has been posted successfully.",
        });
      }
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Failed to add comment",
        description:
          err.message || "An error occurred while posting your comment.",
      });
    }
  };

  const handleAddRating = async (rating, comment) => {
    try {
      const response = await addRating(id, rating, comment);
      if (response.success) {
        // Reload ratings and stats
        const [ratingsResponse, statsResponse] = await Promise.all([
          getRatings(id, { limit: 10 }),
          getRatingStats(id),
        ]);

        if (ratingsResponse.success) setRatings(ratingsResponse.data.ratings);
        if (statsResponse.success) setRatingStats(statsResponse.data.stats);

        toast({
          title: "Rating submitted",
          description: "Thank you for rating this video!",
        });
      }
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Failed to submit rating",
        description:
          err.message || "An error occurred while submitting your rating.",
      });
    }
  };

  const handleEdit = () => {
    // TODO: Implement edit modal or navigate to edit page
    toast({
      title: "Edit functionality",
      description: "Edit modal would open here",
    });
  };

  const handleDelete = async () => {
    if (
      !window.confirm(
        "Are you sure you want to delete this video? This action cannot be undone."
      )
    ) {
      return;
    }

    try {
      const response = await deleteVideo(id);
      if (response.success) {
        toast({
          title: "Video deleted",
          description: "The video has been deleted successfully.",
        });
        navigate("/videos");
      }
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Failed to delete video",
        description:
          err.message || "An error occurred while deleting the video.",
      });
    }
  };

  const getCreatorInitials = () => {
    if (!video?.creator) return "U";
    return `${video.creator.firstName?.[0] || ""}${
      video.creator.lastName?.[0] || ""
    }`.toUpperCase();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error || !video) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <div className="text-red-500 mb-4">
              <Play className="h-12 w-12" />
            </div>
            <h3 className="text-lg font-medium text-gray-100 mb-2">
              Video not found
            </h3>
            <p className="text-gray-500 text-center mb-4">{error}</p>
            <Button onClick={() => navigate("/videos")}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Videos
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const canEdit = canEditVideo(video);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Hero Section with Background Image */}
      <div className="relative h-64 mb-8 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1451187580459-43490279c0fa?ixlib=rb-4.0.3&auto=format&fit=crop&w=2072&q=80')`,
          }}
        >
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm"></div>
        </div>

        {/* Hero Content */}
        <div className="relative z-10 h-full flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-4xl font-black text-gray-100 neon-text mb-2">
              Video Experience
            </h1>
            <p className="text-xl text-gray-300">
              Immerse yourself in the digital content
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-20 relative z-20">
        {/* Back button */}
        <div className="mb-8">
          <Button
            variant="outline"
            onClick={() => navigate("/videos")}
            className="flex items-center space-x-2 bg-black/50 border-green-500/30 text-green-400 hover:bg-green-500/10 hover:border-green-400 neon-glow"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Videos</span>
          </Button>
        </div>

        {/* NEW LAYOUT: Comments Section at the TOP */}
        <div className="mb-8">
          <Card className="cyber-card">
            <CardHeader className="border-b border-green-500/30">
              <CardTitle className="flex items-center space-x-2 text-green-400">
                <MessageCircle className="h-6 w-6" />
                <span>Community Discussion</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <CommentsSection
                comments={comments}
                onAddComment={handleAddComment}
                canComment={!!user}
              />
            </CardContent>
          </Card>
        </div>

        {/* Main Video Section */}
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
          {/* Video Player - Takes up most of the space */}
          <div className="xl:col-span-3 space-y-6">
            {/* Video Player */}
            <Card className="cyber-card overflow-hidden">
              <CardContent className="p-0">
                <VideoPlayer videoId={video.id} />
              </CardContent>
            </Card>

            {/* Video Info */}
            <Card className="cyber-card">
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h1 className="text-3xl font-black text-gray-100 mb-3 neon-text">
                        {video.title}
                      </h1>
                      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400">
                        <div className="flex items-center bg-black/30 px-3 py-1 rounded-full border border-green-500/30">
                          <Calendar className="h-4 w-4 mr-2 text-green-400" />
                          {formatDate(video.createdAt)}
                        </div>
                        <div className="flex items-center bg-black/30 px-3 py-1 rounded-full border border-green-500/30">
                          <Eye className="h-4 w-4 mr-2 text-green-400" />0 views
                        </div>
                        {video.duration && (
                          <div className="flex items-center bg-black/30 px-3 py-1 rounded-full border border-green-500/30">
                            <Clock className="h-4 w-4 mr-2 text-green-400" />
                            {formatDuration(video.duration)}
                          </div>
                        )}
                        {video.fileSize && (
                          <div className="flex items-center bg-black/30 px-3 py-1 rounded-full border border-green-500/30">
                            <HardDrive className="h-4 w-4 mr-2 text-green-400" />
                            {formatFileSize(video.fileSize)}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center space-x-3 ml-4">
                      <Badge
                        variant={video.isPublic ? "default" : "secondary"}
                        className={`${
                          video.isPublic
                            ? "bg-green-600/20 text-green-400 border-green-500/30"
                            : "bg-yellow-600/20 text-yellow-400 border-yellow-500/30"
                        }`}
                      >
                        {video.isPublic ? "Public" : "Private"}
                      </Badge>
                      {canEdit && (
                        <div className="flex space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={handleEdit}
                            className="border-green-500/30 text-green-400 hover:bg-green-500/10 hover:border-green-400"
                          >
                            <Edit className="h-4 w-4 mr-1" />
                            Edit
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={handleDelete}
                            className="bg-red-600/20 text-red-400 border-red-500/30 hover:bg-red-500/10 hover:border-red-400"
                          >
                            <Trash2 className="h-4 w-4 mr-1" />
                            Delete
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Creator info with Image */}
                  <div className="flex items-center space-x-4 p-4 bg-black/30 rounded-lg border border-green-500/20">
                    <div className="relative">
                      <Avatar className="h-12 w-12 border-2 border-green-500/50">
                        <AvatarFallback className="bg-green-500/20 text-green-400 font-bold text-lg">
                          {getCreatorInitials()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="absolute -bottom-1 -right-1 bg-green-500 rounded-full p-1">
                        <Zap className="h-3 w-3 text-black" />
                      </div>
                    </div>
                    <div>
                      <div className="font-bold text-gray-100 text-lg">
                        {video.creator
                          ? `${video.creator.firstName} ${video.creator.lastName}`
                          : "Unknown Creator"}
                      </div>
                      <div className="text-sm text-green-400">
                        {video.creator?.email}
                      </div>
                    </div>
                  </div>

                  {/* Description */}
                  {video.description && (
                    <div className="prose prose-invert max-w-none">
                      <p className="text-gray-300 whitespace-pre-wrap leading-relaxed">
                        {video.description}
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Sidebar - Ratings and Stats */}
          <div className="space-y-6">
            {/* Rating Stats */}
            {ratingStats && (
              <Card className="cyber-card">
                <CardHeader className="border-b border-green-500/30">
                  <CardTitle className="flex items-center space-x-2 text-green-400">
                    <Star className="h-5 w-5" />
                    <span>Community Rating</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                  <div className="text-center">
                    <div className="text-4xl font-black text-gray-100 neon-text">
                      {ratingStats.averageRating
                        ? ratingStats.averageRating.toFixed(1)
                        : "No ratings"}
                    </div>
                    <div className="text-sm text-gray-400">
                      {ratingStats.totalRatings}{" "}
                      {ratingStats.totalRatings === 1 ? "rating" : "ratings"}
                    </div>
                  </div>

                  {ratingStats.distribution && (
                    <div className="space-y-3">
                      {[5, 4, 3, 2, 1].map((stars) => (
                        <div
                          key={stars}
                          className="flex items-center space-x-2"
                        >
                          <span className="text-sm w-3 text-gray-400">
                            {stars}
                          </span>
                          <Star className="h-3 w-3 text-yellow-400" />
                          <div className="flex-1 bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-yellow-400 h-2 rounded-full"
                              style={{
                                width: `${
                                  ratingStats.totalRatings > 0
                                    ? (ratingStats.distribution[stars] /
                                        ratingStats.totalRatings) *
                                      100
                                    : 0
                                }%`,
                              }}
                            />
                          </div>
                          <span className="text-xs text-gray-500 w-8">
                            {ratingStats.distribution[stars] || 0}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Add Rating */}
            <RatingsSection
              ratings={ratings}
              onAddRating={handleAddRating}
              canRate={!!user}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
