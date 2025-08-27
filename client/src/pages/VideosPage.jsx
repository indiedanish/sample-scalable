import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { getVideos } from "@/lib/api";
import { VideoCard } from "@/features/videos/components/VideoCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import {
  Search,
  Filter,
  Video,
  ChevronLeft,
  ChevronRight,
  SlidersHorizontal,
  Sparkles,
  Film,
} from "lucide-react";

export function VideosPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [pagination, setPagination] = useState(null);
  const [searchTerm, setSearchTerm] = useState(
    searchParams.get("search") || ""
  );
  const [showFilters, setShowFilters] = useState(false);

  // Filter states
  const [filters, setFilters] = useState({
    search: searchParams.get("search") || "",
    page: parseInt(searchParams.get("page")) || 1,
    limit: parseInt(searchParams.get("limit")) || 12,
    creatorId: searchParams.get("creatorId") || "",
    minDuration: searchParams.get("minDuration") || "",
    maxDuration: searchParams.get("maxDuration") || "",
    startDate: searchParams.get("startDate") || "",
    endDate: searchParams.get("endDate") || "",
  });

  useEffect(() => {
    loadVideos();
  }, [searchParams]);

  const loadVideos = async () => {
    try {
      setLoading(true);
      setError("");

      const params = Object.fromEntries(searchParams.entries());
      const response = await getVideos(params);

      if (response.success) {
        setVideos(response.data.videos);
        setPagination(response.data.pagination);
      } else {
        setError("Failed to load videos");
      }
    } catch (err) {
      setError("Failed to load videos");
      console.error("Videos error:", err);
    } finally {
      setLoading(false);
    }
  };

  const updateFilters = (newFilters) => {
    const updatedFilters = { ...filters, ...newFilters, page: 1 };
    setFilters(updatedFilters);

    // Update URL
    const params = new URLSearchParams();
    Object.entries(updatedFilters).forEach(([key, value]) => {
      if (value && value !== "") {
        params.set(key, value);
      }
    });
    setSearchParams(params);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    updateFilters({ search: searchTerm });
  };

  const handlePageChange = (newPage) => {
    updateFilters({ page: newPage });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const clearFilters = () => {
    setSearchTerm("");
    setFilters({
      search: "",
      page: 1,
      limit: 12,
      creatorId: "",
      minDuration: "",
      maxDuration: "",
      startDate: "",
      endDate: "",
    });
    setSearchParams(new URLSearchParams({ page: "1", limit: "12" }));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      {/* Header */}
      <div className="text-center space-y-4 fade-in">
        <div className="relative inline-block">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-pastel-blue via-pastel-purple to-pastel-pink bg-clip-text text-transparent">
            Discover Videos ✨
          </h1>
          <div className="absolute -inset-4 bg-gradient-to-r from-pastel-blue/20 via-pastel-purple/20 to-pastel-pink/20 rounded-full blur-2xl -z-10"></div>
        </div>
        <p className="text-xl text-gray-800 font-playful max-w-2xl mx-auto">
          Explore amazing content from our talented creators and find your next
          favorite video! 🎬
        </p>
      </div>

      {/* Search and Filters */}
      <div className="space-y-6 slide-up">
        {/* Search Bar */}
        <form onSubmit={handleSearch} className="flex gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-pastel-blue/60" />
            <Input
              type="text"
              placeholder="Search videos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-pastel pl-12 text-base font-playful text-gray-800 placeholder-gray-600"
            />
          </div>
          <Button
            type="submit"
            className="btn-pill bg-gradient-to-r from-pastel-blue to-pastel-purple text-white border-0 shadow-lg shadow-pastel-blue/30 hover:shadow-xl hover:shadow-pastel-blue/40 font-playful font-bold"
          >
            <Search className="h-5 w-5 mr-2" />
            Search ✨
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            className="btn-pill bg-white/80 hover:bg-white border-2 border-pastel-pink/30 text-pastel-pink hover:text-pastel-orange font-playful font-medium transition-all duration-300 hover:scale-105 hover:shadow-lg"
          >
            <SlidersHorizontal className="h-5 w-5 mr-2" />
            <span>Filters</span>
          </Button>
        </form>

        {/* Advanced Filters */}
        {showFilters && (
          <Card className="card-pastel border-2 border-pastel-purple/30 shadow-xl shadow-pastel-purple/20 slide-up">
            <CardContent className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div>
                  <label className="block text-sm font-playful font-medium text-gray-800 mb-2">
                    Min Duration (seconds) ⏱️
                  </label>
                  <Input
                    type="number"
                    placeholder="0"
                    value={filters.minDuration}
                    onChange={(e) =>
                      setFilters({ ...filters, minDuration: e.target.value })
                    }
                    className="input-pastel font-playful text-gray-800 placeholder-gray-600"
                  />
                </div>
                <div>
                  <label className="block text-sm font-playful font-medium text-gray-800 mb-2">
                    Max Duration (seconds) ⏱️
                  </label>
                  <Input
                    type="number"
                    placeholder="3600"
                    value={filters.maxDuration}
                    onChange={(e) =>
                      setFilters({ ...filters, maxDuration: e.target.value })
                    }
                    className="input-pastel font-playful text-gray-800 placeholder-gray-600"
                  />
                </div>
                <div>
                  <label className="block text-sm font-playful font-medium text-gray-800 mb-2">
                    Start Date 📅
                  </label>
                  <Input
                    type="date"
                    value={filters.startDate}
                    onChange={(e) =>
                      setFilters({ ...filters, startDate: e.target.value })
                    }
                    className="input-pastel font-playful text-gray-800"
                  />
                </div>
                <div>
                  <label className="block text-sm font-playful font-medium text-gray-800 mb-2">
                    End Date 📅
                  </label>
                  <Input
                    type="date"
                    value={filters.endDate}
                    onChange={(e) =>
                      setFilters({ ...filters, endDate: e.target.value })
                    }
                    className="input-pastel font-playful text-gray-800"
                  />
                </div>
              </div>
              <div className="flex justify-between mt-6">
                <Button
                  variant="outline"
                  onClick={clearFilters}
                  className="btn-pill bg-white/80 hover:bg-white border-2 border-pastel-orange/30 text-pastel-orange hover:text-pastel-pink font-playful font-medium transition-all duration-300 hover:scale-105 hover:shadow-lg"
                >
                  Clear Filters 🗑️
                </Button>
                <Button
                  onClick={() => updateFilters(filters)}
                  className="btn-pill bg-gradient-to-r from-pastel-pink to-pastel-orange text-white border-0 shadow-lg shadow-pastel-pink/30 hover:shadow-xl hover:shadow-pastel-pink/40 font-playful font-bold"
                >
                  Apply Filters ✨
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Results */}
      {loading ? (
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-pastel-blue/30 border-t-pastel-blue"></div>
            <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-pastel-pink animate-ping"></div>
          </div>
        </div>
      ) : error ? (
        <Card className="bg-gradient-to-r from-red-50 to-pink-50 border-2 border-red-200 rounded-2xl p-6">
          <p className="text-red-600 font-playful text-center">{error}</p>
        </Card>
      ) : videos.length === 0 ? (
        <Card className="card-pastel text-center py-16 slide-up">
          <CardContent className="space-y-6">
            <div className="mx-auto p-6 bg-gradient-to-br from-pastel-blue/20 to-pastel-purple/20 rounded-full w-24 h-24 flex items-center justify-center">
              <Film className="h-12 w-12 text-pastel-blue" />
            </div>
            <h3 className="text-2xl font-playful font-bold text-foreground">
              No videos found
            </h3>
            <p className="text-foreground/70 font-playful text-lg max-w-md mx-auto">
              {filters.search
                ? `No videos found matching "${filters.search}" 🔍`
                : "No videos match your current filters. Try adjusting them! 🎯"}
            </p>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Results count */}
          <div className="mb-8 slide-up">
            <div className="bg-gradient-to-r from-pastel-blue/20 to-pastel-purple/20 rounded-2xl p-4 border border-pastel-blue/30">
              <p className="text-gray-800 font-playful text-center">
                <Sparkles className="h-4 w-4 inline mr-2 text-pastel-blue" />
                Showing {videos.length} of {pagination?.total || 0} videos
                {filters.search && (
                  <span>
                    {" "}
                    for "
                    <strong className="text-pastel-blue">
                      {filters.search}
                    </strong>
                    "
                  </span>
                )}
              </p>
            </div>
          </div>

          {/* Video Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 mb-8 slide-up">
            {videos.map((video, index) => (
              <div
                key={video.id}
                style={{ animationDelay: `${index * 0.1}s` }}
                className="slide-up"
              >
                <VideoCard key={video.id} video={video} />
              </div>
            ))}
          </div>

          {/* Pagination */}
          {pagination && pagination.pages > 1 && (
            <div className="flex items-center justify-center space-x-3 slide-up">
              <Button
                variant="outline"
                onClick={() => handlePageChange(pagination.current - 1)}
                disabled={pagination.current <= 1}
                className="btn-pill bg-white/80 hover:bg-white border-2 border-pastel-blue/30 text-pastel-blue hover:text-pastel-purple font-playful font-medium transition-all duration-300 hover:scale-105 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="h-5 w-5 mr-2" />
                Previous
              </Button>

              <div className="flex items-center space-x-2">
                {[...Array(Math.min(5, pagination.pages))].map((_, i) => {
                  const pageNum = Math.max(1, pagination.current - 2) + i;
                  if (pageNum > pagination.pages) return null;

                  return (
                    <Button
                      key={pageNum}
                      variant={
                        pageNum === pagination.current ? "default" : "outline"
                      }
                      size="sm"
                      onClick={() => handlePageChange(pageNum)}
                      className={`btn-pill font-playful font-medium ${
                        pageNum === pagination.current
                          ? "bg-gradient-to-r from-pastel-blue to-pastel-purple text-white border-0 shadow-lg shadow-pastel-blue/30"
                          : "bg-white/80 hover:bg-white border-2 border-pastel-pink/30 text-pastel-pink hover:text-pastel-orange"
                      } transition-all duration-300 hover:scale-105 hover:shadow-lg`}
                    >
                      {pageNum}
                    </Button>
                  );
                })}
              </div>

              <Button
                variant="outline"
                onClick={() => handlePageChange(pagination.current + 1)}
                disabled={pagination.current >= pagination.pages}
                className="btn-pill bg-white/80 hover:bg-white border-2 border-pastel-blue/30 text-pastel-blue hover:text-pastel-purple font-playful font-medium transition-all duration-300 hover:scale-105 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
                <ChevronRight className="h-5 w-5 ml-2" />
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
