import React, { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { getVideos } from "@/lib/api";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Video,
  Search,
  Filter,
  Play,
  Clock,
  Eye,
  User,
  Grid,
  List,
  ArrowRight,
  Zap,
} from "lucide-react";

export function VideosPage() {
  const [videos, setVideos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState("grid");
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(
    searchParams.get("search") || ""
  );

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const response = await getVideos();

        // Handle different possible response structures
        let videos = [];
        if (response.data?.videos) {
          // Nested structure: response.data.videos
          videos = response.data.videos;
        } else if (response.videos) {
          // Direct structure: response.videos
          videos = response.videos;
        } else if (Array.isArray(response)) {
          // Array structure: response is directly an array
          videos = response;
        }

        setVideos(videos);
      } catch (error) {
        console.error("Error fetching videos:", error);
        setVideos([]); // Set empty array on error
      } finally {
        setIsLoading(false);
      }
    };

    fetchVideos();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      setSearchParams({ search: searchTerm.trim() });
    } else {
      setSearchParams({});
    }
  };

  const filteredVideos = videos.filter(
    (video) =>
      video.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      video.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      `${video.creator?.firstName} ${video.creator?.lastName}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground font-rajdhani">
            Loading videos...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6 space-y-8">
      {/* Header */}
      <div className="text-center space-y-4 fade-in">
        <h1 className="font-orbitron text-4xl md:text-6xl font-bold text-primary">
          Video Library
        </h1>
        <p className="text-xl text-muted-foreground font-rajdhani max-w-2xl mx-auto">
          Discover and stream the latest content from creators around the world
        </p>
        <div className="flex justify-center">
          <Zap className="h-6 w-6 text-accent" />
        </div>
      </div>

      {/* Search and Controls */}
      <div className="space-y-6 slide-up">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <form onSubmit={handleSearch} className="flex-1 max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search videos, creators, or descriptions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input-futuristic pl-10 bg-transparent"
              />
            </div>
          </form>

          <div className="flex items-center space-x-2">
            <Button
              variant={viewMode === "grid" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("grid")}
              className="font-rajdhani"
            >
              <Grid className="h-4 w-4 mr-2" />
              Grid
            </Button>
            <Button
              variant={viewMode === "list" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("list")}
              className="font-rajdhani"
            >
              <List className="h-4 w-4 mr-2" />
              List
            </Button>
          </div>
        </div>

        {searchTerm && (
          <div className="text-center">
            <p className="text-muted-foreground font-rajdhani">
              Showing {filteredVideos.length} results for "{searchTerm}"
            </p>
          </div>
        )}
      </div>

      {/* Videos Grid/List */}
      {filteredVideos.length === 0 ? (
        <div className="text-center py-12 slide-up">
          <Video className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="font-orbitron text-xl text-muted-foreground mb-2">
            No videos found
          </h3>
          <p className="text-muted-foreground font-rajdhani">
            {searchTerm
              ? "Try adjusting your search terms"
              : "No videos available at the moment"}
          </p>
        </div>
      ) : (
        <div
          className={`space-y-6 ${
            viewMode === "grid"
              ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
              : ""
          }`}
        >
          {filteredVideos.map((video) => (
            <Link key={video.id} to={`/videos/${video.id}`}>
              <Card
                className={`card-futuristic group hover:scale-105 transition-all duration-300 cursor-pointer ${
                  viewMode === "list" ? "flex flex-row" : ""
                }`}
              >
                <CardHeader className={viewMode === "list" ? "flex-1" : ""}>
                  <div className="flex items-center space-x-3">
                    <div
                      className={`p-2 bg-primary/20 rounded border border-primary/30 ${
                        viewMode === "list" ? "flex-shrink-0" : ""
                      }`}
                    >
                      <Play className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <CardTitle className="font-rajdhani text-lg text-primary truncate">
                        {video.title}
                      </CardTitle>
                      <CardDescription className="font-rajdhani text-muted-foreground">
                        by {video.creator?.firstName} {video.creator?.lastName}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent
                  className={viewMode === "list" ? "flex-shrink-0" : ""}
                >
                  {video.description && (
                    <p className="text-muted-foreground font-rajdhani text-sm mb-4 line-clamp-2">
                      {video.description}
                    </p>
                  )}
                  <div className="flex items-center justify-between text-sm text-muted-foreground font-rajdhani">
                    <div className="flex items-center space-x-2">
                      <Clock className="h-4 w-4" />
                      <span>
                        {new Date(video.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Eye className="h-4 w-4" />
                      <span>{video.views || 0}</span>
                    </div>
                  </div>
                  {viewMode === "list" && (
                    <div className="mt-3 flex items-center text-primary group-hover:text-primary/80 transition-colors duration-300">
                      <span className="font-rajdhani font-semibold text-sm">
                        Watch Now
                      </span>
                      <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                    </div>
                  )}
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}

      {/* Load More Button */}
      {filteredVideos.length > 0 && (
        <div className="text-center pt-8 slide-up">
          <Button className="btn-futuristic font-orbitron">
            Load More Videos
            <Zap className="h-4 w-4 ml-2" />
          </Button>
        </div>
      )}
    </div>
  );
}
