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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-10 text-center">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent mb-4">
          Discover Amazing Videos
        </h1>
        <p className="text-lg text-slate-600 max-w-2xl mx-auto">
          Explore incredible content from talented creators around the world
        </p>
      </div>

      {/* Search and Filters */}
      <div className="space-y-6 mb-10">
        {/* Search Bar */}
        <form onSubmit={handleSearch} className="flex gap-4 max-w-4xl mx-auto">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
            <Input
              type="text"
              placeholder="Search videos by title, description, or creator..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12 h-12 rounded-xl border-2 border-slate-200 focus:border-blue-500 focus:ring-blue-500/20 text-base"
            />
          </div>
          <Button type="submit" className="h-12 px-8 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-0.5">
            Search
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            className="h-12 px-6 rounded-xl border-2 border-slate-200 hover:border-blue-300 hover:bg-blue-50 transition-all duration-200 flex items-center space-x-2"
          >
            <SlidersHorizontal className="h-5 w-5" />
            <span>Filters</span>
          </Button>
        </form>

        {/* Advanced Filters */}
        {showFilters && (
          <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
            <CardContent className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Min Duration (seconds)
                  </label>
                  <Input
                    type="number"
                    placeholder="0"
                    value={filters.minDuration}
                    onChange={(e) =>
                      setFilters({ ...filters, minDuration: e.target.value })
                    }
                    className="h-11 rounded-xl border-2 border-slate-200 focus:border-blue-500 focus:ring-blue-500/20"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Max Duration (seconds)
                  </label>
                  <Input
                    type="number"
                    placeholder="3600"
                    value={filters.maxDuration}
                    onChange={(e) =>
                      setFilters({ ...filters, maxDuration: e.target.value })
                    }
                    className="h-11 rounded-xl border-2 border-slate-200 focus:border-blue-500 focus:ring-blue-500/20"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Start Date
                  </label>
                  <Input
                    type="date"
                    value={filters.startDate}
                    onChange={(e) =>
                      setFilters({ ...filters, startDate: e.target.value })
                    }
                    className="h-11 rounded-xl border-2 border-slate-200 focus:border-blue-500 focus:ring-blue-500/20"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    End Date
                  </label>
                  <Input
                    type="date"
                    value={filters.endDate}
                    onChange={(e) =>
                      setFilters({ ...filters, endDate: e.target.value })
                    }
                    className="h-11 rounded-xl border-2 border-slate-200 focus:border-blue-500 focus:ring-blue-500/20"
                  />
                </div>
              </div>
              <div className="flex justify-between mt-6">
                <Button variant="outline" onClick={clearFilters} className="h-11 px-6 rounded-xl border-2 border-slate-200 hover:border-red-300 hover:bg-red-50 transition-all duration-200">
                  Clear Filters
                </Button>
                <Button onClick={() => updateFilters(filters)} className="h-11 px-8 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200">
                  Apply Filters
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Results */}
      {loading ? (
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 max-w-2xl mx-auto text-center">
          <p className="text-red-600">{error}</p>
        </div>
      ) : videos.length === 0 ? (
        <Card className="border-0 shadow-lg bg-gradient-to-br from-slate-50 to-gray-50 max-w-2xl mx-auto">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <div className="p-4 bg-slate-200 rounded-full mb-6">
              <Video className="h-12 w-12 text-slate-400" />
            </div>
            <h3 className="text-xl font-semibold text-slate-900 mb-3">
              No videos found
            </h3>
            <p className="text-slate-600 text-center">
              {filters.search
                ? `No videos found matching "${filters.search}"`
                : "No videos match your current filters"}
            </p>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Results count */}
          <div className="mb-8 text-center">
            <p className="text-lg text-slate-600">
              Showing <span className="font-semibold text-slate-900">{videos.length}</span> of{" "}
              <span className="font-semibold text-slate-900">{pagination?.total || 0}</span> videos
              {filters.search && (
                <span>
                  {" "}for "<strong className="text-blue-600">{filters.search}</strong>"
                </span>
              )}
            </p>
          </div>

          {/* Video Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 mb-10">
            {videos.map((video) => (
              <VideoCard key={video.id} video={video} />
            ))}
          </div>

          {/* Pagination */}
          {pagination && pagination.pages > 1 && (
            <div className="flex items-center justify-center space-x-3">
              <Button
                variant="outline"
                onClick={() => handlePageChange(pagination.current - 1)}
                disabled={pagination.current <= 1}
                className="h-11 px-6 rounded-xl border-2 border-slate-200 hover:border-blue-300 hover:bg-blue-50 transition-all duration-200"
              >
                <ChevronLeft className="h-4 w-4 mr-2" />
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
                      className={`h-10 w-10 rounded-xl ${
                        pageNum === pagination.current
                          ? "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                          : "border-2 border-slate-200 hover:border-blue-300 hover:bg-blue-50"
                      } transition-all duration-200`}
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
                className="h-11 px-6 rounded-xl border-2 border-slate-200 hover:border-blue-300 hover:bg-blue-50 transition-all duration-200"
              >
                Next
                <ChevronRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
