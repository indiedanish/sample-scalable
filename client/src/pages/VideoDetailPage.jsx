import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import {
  getVideo,
  updateVideoViews,
  getComments,
  getRatings,
  getRatingStats,
  addComment,
  addRating,
  deleteVideo,
  updateVideo,
} from "@/lib/api";
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
  const [comments, setComments] = useState([]);
  const [ratings, setRatings] = useState([]);
  const [ratingStats, setRatingStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [newComment, setNewComment] = useState("");

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

  const handleAddComment = async () => {
    if (!newComment.trim()) return;

    try {
      const response = await addComment(id, newComment);
      if (response.success) {
        setComments([response.data.comment, ...comments]);
        setNewComment("");
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

  const canEdit = canEditVideo(video);

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
            <div className="flex items-start justify-between">
              <div className="flex-1">
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
              </div>

              <div className="flex items-center space-x-2 ml-4">
                <Badge className="bg-accent/10 text-accent border-accent/30 font-rajdhani">
                  {video.isPublic ? "Public" : "Private"}
                </Badge>
                {canEdit && (
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleEdit}
                      className="font-rajdhani"
                    >
                      <Edit className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={handleDelete}
                      className="font-rajdhani"
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      Delete
                    </Button>
                  </div>
                )}
              </div>
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

          {/* Comments Section */}
          <Card className="card-futuristic">
            <CardHeader>
              <CardTitle className="font-orbitron text-lg text-primary flex items-center space-x-2">
                <MessageCircle className="h-5 w-5" />
                <span>Comments</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Add Comment Form */}
              {user && (
                <div className="space-y-3">
                  <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Add a comment..."
                    className="w-full p-3 border border-primary/20 bg-background text-foreground font-rajdhani rounded-none resize-none"
                    rows={3}
                  />
                  <Button
                    onClick={handleAddComment}
                    disabled={!newComment.trim()}
                    className="btn-futuristic font-rajdhani"
                  >
                    <MessageCircle className="h-4 w-4 mr-2" />
                    Post Comment
                  </Button>
                </div>
              )}

              {/* Comments List */}
              <div className="space-y-4">
                {comments.length === 0 ? (
                  <p className="text-muted-foreground font-rajdhani text-center py-4">
                    No comments yet. Be the first to comment!
                  </p>
                ) : (
                  comments.map((comment) => (
                    <div
                      key={comment.id}
                      className="border-l-2 border-primary/20 pl-4 py-2"
                    >
                      <div className="flex items-center space-x-2 mb-2">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="bg-primary/20 text-primary text-xs font-rajdhani">
                            {comment.user?.firstName?.[0]}
                            {comment.user?.lastName?.[0]}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <span className="font-rajdhani font-semibold text-foreground text-sm">
                            {comment.user?.firstName} {comment.user?.lastName}
                          </span>
                          <span className="text-muted-foreground font-rajdhani text-xs ml-2">
                            {formatDate(comment.createdAt)}
                          </span>
                        </div>
                      </div>
                      <p className="text-foreground font-rajdhani text-sm">
                        {comment.content}
                      </p>
                    </div>
                  ))
                )}
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

          {/* Rating Stats */}
          {ratingStats && (
            <Card className="card-futuristic">
              <CardHeader>
                <CardTitle className="font-orbitron text-lg text-primary flex items-center space-x-2">
                  <Star className="h-5 w-5" />
                  <span>Ratings</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary font-orbitron">
                    {ratingStats.averageRating
                      ? ratingStats.averageRating.toFixed(1)
                      : "No ratings"}
                  </div>
                  <div className="text-sm text-muted-foreground font-rajdhani">
                    {ratingStats.totalRatings}{" "}
                    {ratingStats.totalRatings === 1 ? "rating" : "ratings"}
                  </div>
                </div>

                {ratingStats.distribution && (
                  <div className="space-y-2">
                    {[5, 4, 3, 2, 1].map((stars) => (
                      <div key={stars} className="flex items-center space-x-2">
                        <span className="text-sm w-2 font-rajdhani">
                          {stars}
                        </span>
                        <Star className="h-3 w-3 text-yellow-400" />
                        <div className="flex-1 bg-muted rounded-full h-2">
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
                        <span className="text-xs text-muted-foreground w-8 font-rajdhani">
                          {ratingStats.distribution[stars] || 0}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          )}

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
