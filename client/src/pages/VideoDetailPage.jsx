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
  Sparkles,
  Zap,
  Heart,
  Share2,
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
        <div className="relative">
          <div className="w-16 h-16 border-4 border-purple-200 rounded-full animate-spin"></div>
          <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-t-purple-500 rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  if (error || !video) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Card className="bg-gradient-to-br from-red-50 to-pink-50 border-0 shadow-xl">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <div className="relative mb-6">
              <div className="w-20 h-20 bg-gradient-to-br from-red-200 to-pink-200 rounded-3xl flex items-center justify-center">
                <Play className="h-10 w-10 text-red-600" />
              </div>
              <div className="absolute -inset-2 bg-gradient-to-br from-red-200 to-pink-200 rounded-3xl blur opacity-50"></div>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">
              Video not found
            </h3>
            <p className="text-gray-600 text-center mb-6 max-w-md">{error}</p>
            <Button 
              onClick={() => navigate("/videos")}
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
            >
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back button */}
      <div className="mb-8">
        <Button
          variant="outline"
          onClick={() => navigate("/videos")}
          className="flex items-center space-x-3 bg-white/80 backdrop-blur-sm hover:bg-white border-purple-200 hover:border-purple-300 text-purple-700 hover:text-purple-800 rounded-xl px-6 py-3 shadow-lg hover:shadow-xl transition-all duration-200"
        >
          <ArrowLeft className="h-4 w-4" />
          <span className="font-semibold">Back to Videos</span>
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Video Player */}
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl overflow-hidden">
            <CardContent className="p-0">
              <VideoPlayer videoId={video.id} />
            </CardContent>
          </Card>

          {/* Video Info */}
          <div className="space-y-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h1 className="text-4xl font-black bg-gradient-to-r from-gray-900 via-purple-800 to-pink-700 bg-clip-text text-transparent mb-4 leading-tight">
                  {video.title}
                </h1>
                <div className="flex items-center space-x-6 text-sm text-gray-600">
                  <div className="flex items-center space-x-2">
                    <div className="p-2 bg-purple-100 rounded-lg">
                      <Calendar className="h-4 w-4 text-purple-600" />
                    </div>
                    <span className="font-medium">{formatDate(video.createdAt)}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Eye className="h-4 w-4 text-blue-600" />
                    </div>
                    <span className="font-medium">0 views</span>
                  </div>
                  {video.duration && (
                    <div className="flex items-center space-x-2">
                      <div className="p-2 bg-green-100 rounded-lg">
                        <Play className="h-4 w-4 text-green-600" />
                      </div>
                      <span className="font-medium">{formatDuration(video.duration)}</span>
                    </div>
                  )}
                  {video.fileSize && (
                    <div className="flex items-center space-x-2">
                      <div className="p-2 bg-orange-100 rounded-lg">
                        <HardDrive className="h-4 w-4 text-orange-600" />
                      </div>
                      <span className="font-medium">{formatFileSize(video.fileSize)}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center space-x-3 ml-6">
                <Badge 
                  variant={video.isPublic ? "default" : "secondary"}
                  className={`px-4 py-2 rounded-full font-semibold ${
                    video.isPublic 
                      ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white' 
                      : 'bg-gradient-to-r from-orange-500 to-red-500 text-white'
                  }`}
                >
                  {video.isPublic ? "Public" : "Private"}
                </Badge>
                {canEdit && (
                  <div className="flex space-x-3">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={handleEdit}
                      className="bg-white/80 backdrop-blur-sm hover:bg-white border-purple-200 hover:border-purple-300 text-purple-700 hover:text-purple-800 rounded-xl px-4 py-2 shadow-lg hover:shadow-xl transition-all duration-200"
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={handleDelete}
                      className="bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white font-semibold rounded-xl px-4 py-2 shadow-lg hover:shadow-xl transition-all duration-200"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </Button>
                  </div>
                )}
              </div>
            </div>

            {/* Creator info */}
            <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <Avatar className="h-16 w-16 ring-4 ring-purple-200 shadow-lg">
                      <AvatarFallback className="bg-gradient-to-br from-purple-500 to-pink-500 text-white text-xl font-bold">
                        {getCreatorInitials()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-gradient-to-r from-green-400 to-blue-500 rounded-full border-3 border-white"></div>
                  </div>
                  <div className="flex-1">
                    <div className="text-xl font-bold text-gray-900 mb-1">
                      {video.creator
                        ? `${video.creator.firstName} ${video.creator.lastName}`
                        : "Unknown Creator"}
                    </div>
                    <div className="text-gray-600 mb-3">{video.creator?.email}</div>
                    <div className="flex items-center space-x-4">
                      <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold rounded-xl px-6 py-2 shadow-lg hover:shadow-xl transition-all duration-200">
                        <Heart className="h-4 w-4 mr-2" />
                        Follow
                      </Button>
                      <Button variant="outline" className="bg-white/80 backdrop-blur-sm hover:bg-white border-purple-200 hover:border-purple-300 text-purple-700 hover:text-purple-800 rounded-xl px-6 py-2 shadow-lg hover:shadow-xl transition-all duration-200">
                        <Share2 className="h-4 w-4 mr-2" />
                        Share
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Description */}
            {video.description && (
              <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 text-gray-900">
                    <Zap className="h-5 w-5 text-purple-600" />
                    <span>Description</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 whitespace-pre-wrap leading-relaxed text-lg">
                    {video.description}
                  </p>
                </CardContent>
              </Card>
            )}

            {/* Comments */}
            <CommentsSection
              comments={comments}
              onAddComment={handleAddComment}
              canComment={!!user}
            />
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Rating Stats */}
          {ratingStats && (
            <Card className="bg-gradient-to-br from-yellow-50 to-orange-50 border-0 shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center space-x-3 text-gray-900">
                  <div className="p-2 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-xl">
                    <Star className="h-5 w-5 text-white" />
                  </div>
                  <span className="text-xl font-bold">Ratings</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="text-center">
                  <div className="text-4xl font-black text-gray-900 mb-2">
                    {ratingStats.averageRating
                      ? ratingStats.averageRating.toFixed(1)
                      : "No ratings"}
                  </div>
                  <div className="text-sm text-gray-600 font-medium">
                    {ratingStats.totalRatings}{" "}
                    {ratingStats.totalRatings === 1 ? "rating" : "ratings"}
                  </div>
                </div>

                {ratingStats.distribution && (
                  <div className="space-y-3">
                    {[5, 4, 3, 2, 1].map((stars) => (
                      <div key={stars} className="flex items-center space-x-3">
                        <span className="text-sm font-bold text-gray-700 w-4">{stars}</span>
                        <Star className="h-4 w-4 text-yellow-500" />
                        <div className="flex-1 bg-gray-200 rounded-full h-3 overflow-hidden">
                          <div
                            className="bg-gradient-to-r from-yellow-400 to-orange-500 h-3 rounded-full transition-all duration-500"
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
                        <span className="text-sm font-bold text-gray-700 w-8">
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
          <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 border-0 shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center space-x-3 text-gray-900">
                <div className="p-2 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl">
                  <ThumbsUp className="h-5 w-5 text-white" />
                </div>
                <span className="text-xl font-bold">Rate This Video</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                Share your thoughts and rate this video to help other viewers!
              </p>
              <Button className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-semibold rounded-xl py-3 shadow-lg hover:shadow-xl transition-all duration-200">
                <Star className="h-4 w-4 mr-2" />
                Rate & Review
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
