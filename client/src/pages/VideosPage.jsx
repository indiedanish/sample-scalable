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
  Leaf,
  Sparkles,
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
    setSearchParams({});
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="relative">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-eco-leaf"></div>
          <Leaf className="h-6 w-6 text-eco-sage absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 animate-pulse" />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      {/* Header */}
      <div className="text-center mb-10">
        <div className="relative inline-block mb-4">
          <h1 className="font-eco text-4xl font-bold text-eco-forest">
            Discover Amazing Videos 🌿
          </h1>
          <Sparkles className="h-5 w-5 text-eco-earth absolute -top-2 -right-8 animate-pulse" />
        </div>
        <p className="text-eco-forest/70 text-lg font-medium max-w-2xl mx-auto">
          Explore a world of creative content from talented creators around the
          globe
        </p>
        <div className="leaf-divider mt-6"></div>
      </div>

      {/* Search and Filters */}
      <div className="mb-8">
        <Card className="card-eco border-eco-sage/20 shadow-eco">
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row gap-4 items-center">
              {/* Search */}
              <div className="flex-1 w-full lg:w-auto">
                <form onSubmit={handleSearch} className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Search className="h-4 w-4 text-eco-sage" />
                  </div>
                  <Input
                    type="text"
                    placeholder="Search videos..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="input-eco pl-12 pr-4 w-full"
                  />
                </form>
              </div>

              {/* Filter Toggle */}
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className="btn-eco-secondary flex items-center space-x-2"
              >
                <SlidersHorizontal className="h-4 w-4" />
                <span>Filters</span>
              </Button>

              {/* Clear Filters */}
              {Object.values(filters).some(
                (value) => value && value !== "" && value !== 1 && value !== 12
              ) && (
                <Button
                  variant="ghost"
                  onClick={clearFilters}
                  className="text-eco-forest/70 hover:text-eco-leaf hover:bg-eco-sage/10"
                >
                  Clear All
                </Button>
              )}
            </div>

            {/* Advanced Filters */}
            {showFilters && (
              <div className="mt-6 pt-6 border-t border-eco-sage/20">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-eco-forest">
                      Min Duration (min)
                    </label>
                    <Input
                      type="number"
                      placeholder="0"
                      value={filters.minDuration}
                      onChange={(e) =>
                        updateFilters({ minDuration: e.target.value })
                      }
                      className="input-eco"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-eco-forest">
                      Max Duration (min)
                    </label>
                    <Input
                      type="number"
                      placeholder="∞"
                      value={filters.maxDuration}
                      onChange={(e) =>
                        updateFilters({ maxDuration: e.target.value })
                      }
                      className="input-eco"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-eco-forest">
                      Start Date
                    </label>
                    <Input
                      type="date"
                      value={filters.startDate}
                      onChange={(e) =>
                        updateFilters({ startDate: e.target.value })
                      }
                      className="input-eco"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-eco-forest">
                      End Date
                    </label>
                    <Input
                      type="date"
                      value={filters.endDate}
                      onChange={(e) =>
                        updateFilters({ endDate: e.target.value })
                      }
                      className="input-eco"
                    />
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Error Message */}
      {error && (
        <Card className="card-eco border-destructive/20 mb-6">
          <CardContent className="p-4">
            <p className="text-destructive font-medium">{error}</p>
          </CardContent>
        </Card>
      )}

      {/* Videos Grid */}
      {videos.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
            {videos.map((video) => (
              <VideoCard key={video.id} video={video} />
            ))}
          </div>

          {/* Pagination */}
          {pagination && pagination.totalPages > 1 && (
            <div className="flex items-center justify-center space-x-2">
              <Button
                variant="outline"
                onClick={() => handlePageChange(pagination.currentPage - 1)}
                disabled={pagination.currentPage === 1}
                className="btn-eco-secondary"
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                Previous
              </Button>

              <span className="text-eco-forest/70 font-medium">
                Page {pagination.currentPage} of {pagination.totalPages}
              </span>

              <Button
                variant="outline"
                onClick={() => handlePageChange(pagination.currentPage + 1)}
                disabled={pagination.currentPage === pagination.totalPages}
                className="btn-eco-secondary"
              >
                Next
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          )}
        </>
      ) : (
        <Card className="card-eco border-eco-sage/20 text-center py-16">
          <CardContent>
            <Video className="h-20 w-20 text-eco-sage/50 mx-auto mb-6" />
            <h3 className="text-2xl font-medium text-eco-forest/70 mb-3">
              No videos found
            </h3>
            <p className="text-eco-forest/60 max-w-md mx-auto">
              {searchTerm ||
              Object.values(filters).some(
                (value) => value && value !== "" && value !== 1 && value !== 12
              )
                ? "Try adjusting your search criteria or filters to find more videos."
                : "No videos have been uploaded yet. Check back soon!"}
            </p>
            {(searchTerm ||
              Object.values(filters).some(
                (value) => value && value !== "" && value !== 1 && value !== 12
              )) && (
              <Button onClick={clearFilters} className="btn-eco mt-4">
                Clear Filters
              </Button>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
