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
  getReelStreamUrl,
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
            <h3 className="text-lg font-medium text-gray-900 mb-2">
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
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back button */}
      <div className="mb-6">
        <Button
          variant="outline"
          onClick={() => navigate("/videos")}
          className="flex items-center space-x-2"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Videos</span>
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Video Player */}
          <Card>
            <CardContent className="p-0">
              <VideoPlayer videoId={video.id} />
            </CardContent>
          </Card>

          {/* Video Info */}
          <div className="space-y-4">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h1 className="text-2xl font-bold text-gray-900 mb-2">
                  {video.title}
                </h1>
                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                    {formatDate(video.createdAt)}
                  </div>
                  <div className="flex items-center">
                    <Eye className="h-4 w-4 mr-1" />0 views
                  </div>
                  {video.duration && (
                    <div className="flex items-center">
                      <Play className="h-4 w-4 mr-1" />
                      {formatDuration(video.duration)}
                    </div>
                  )}
                  {video.fileSize && (
                    <div className="flex items-center">
                      <HardDrive className="h-4 w-4 mr-1" />
                      {formatFileSize(video.fileSize)}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center space-x-2 ml-4">
                <Badge variant={video.isPublic ? "default" : "secondary"}>
                  {video.isPublic ? "Public" : "Private"}
                </Badge>
                {canEdit && (
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm" onClick={handleEdit}>
                      <Edit className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={handleDelete}
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      Delete
                    </Button>
                  </div>
                )}
              </div>
            </div>

            {/* Creator info */}
            <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
              <Avatar className="h-10 w-10">
                <AvatarFallback className="bg-primary text-primary-foreground">
                  {getCreatorInitials()}
                </AvatarFallback>
              </Avatar>
              <div>
                <div className="font-medium text-gray-900">
                  {video.creator
                    ? `${video.creator.firstName} ${video.creator.lastName}`
                    : "Unknown Creator"}
                </div>
                <div className="text-sm text-gray-500">
                  {video.creator?.email}
                </div>
              </div>
            </div>

            {/* Description */}
            {video.description && (
              <div className="prose prose-sm max-w-none">
                <p className="text-gray-700 whitespace-pre-wrap">
                  {video.description}
                </p>
              </div>
            )}
          </div>

          {/* Comments */}
          <CommentsSection
            comments={comments}
            onAddComment={handleAddComment}
            canComment={!!user}
          />
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Rating Stats */}
          {ratingStats && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Star className="h-5 w-5" />
                  <span>Ratings</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-gray-900">
                    {ratingStats.averageRating
                      ? ratingStats.averageRating.toFixed(1)
                      : "No ratings"}
                  </div>
                  <div className="text-sm text-gray-500">
                    {ratingStats.totalRatings}{" "}
                    {ratingStats.totalRatings === 1 ? "rating" : "ratings"}
                  </div>
                </div>

                {ratingStats.distribution && (
                  <div className="space-y-2">
                    {[5, 4, 3, 2, 1].map((stars) => (
                      <div key={stars} className="flex items-center space-x-2">
                        <span className="text-sm w-2">{stars}</span>
                        <Star className="h-3 w-3" />
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
  );
}
