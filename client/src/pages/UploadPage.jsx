import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { uploadVideo } from "@/lib/api";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import {
  Upload,
  Video,
  FileText,
  Tag,
  Zap,
  Cloud,
  ArrowUp,
  CheckCircle,
  AlertCircle,
} from "lucide-react";

export function UploadPage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    tags: "",
    videoFile: null,
    thumbnailFile: null,
  });

  const handleFileChange = (e, field) => {
    const file = e.target.files[0];
    setFormData((prev) => ({ ...prev, [field]: file }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.videoFile) {
      toast({
        variant: "destructive",
        title: "No video selected",
        description: "Please select a video file to upload",
      });
      return;
    }

    setIsLoading(true);
    setUploadProgress(0);

    try {
      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      // Call uploadVideo with the correct parameters
      const result = await uploadVideo(
        formData.videoFile,
        formData.title,
        formData.description || "",
        true // isPublic
      );

      clearInterval(progressInterval);
      setUploadProgress(100);

      toast({
        title: "Upload successful!",
        description: "Your video has been uploaded successfully",
      });

      setTimeout(() => {
        navigate(`/videos/${result.video?.id || "new"}`);
      }, 1000);
    } catch (error) {
      console.error("Upload error:", error);
      toast({
        variant: "destructive",
        title: "Upload failed",
        description: error.message || "An unexpected error occurred",
      });
    } finally {
      setIsLoading(false);
      setUploadProgress(0);
    }
  };

  return (
    <div className="min-h-screen bg-background p-6 space-y-8">
      {/* Header */}
      <div className="text-center space-y-4 fade-in">
        <h1 className="font-orbitron text-4xl md:text-6xl font-bold text-primary">
          Upload Content
        </h1>
        <p className="text-xl text-muted-foreground font-rajdhani max-w-2xl mx-auto">
          Share your creativity with the world through our advanced upload
          system
        </p>
        <div className="flex justify-center space-x-4">
          <Upload className="h-6 w-6 text-accent" />
          <Video className="h-6 w-6 text-secondary" />
          <Cloud className="h-6 w-6 text-primary" />
        </div>
      </div>

      <div className="max-w-4xl mx-auto">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Video Upload Section */}
          <Card className="card-futuristic slide-up">
            <CardHeader>
              <CardTitle className="font-orbitron text-2xl text-primary flex items-center space-x-2">
                <Video className="h-6 w-6" />
                <span>Video File</span>
              </CardTitle>
              <CardDescription className="font-rajdhani text-muted-foreground">
                Select the video file you want to upload
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="border-2 border-dashed border-primary/30 rounded-none p-8 text-center hover:border-primary/50 transition-colors duration-300">
                <input
                  type="file"
                  id="videoFile"
                  accept="video/*"
                  onChange={(e) => handleFileChange(e, "videoFile")}
                  className="hidden"
                />
                <label htmlFor="videoFile" className="cursor-pointer">
                  <div className="space-y-4">
                    <div className="mx-auto w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center">
                      <Upload className="h-8 w-8 text-primary" />
                    </div>
                    <div>
                      <p className="text-lg font-rajdhani font-semibold text-primary">
                        {formData.videoFile
                          ? formData.videoFile.name
                          : "Click to select video"}
                      </p>
                      <p className="text-sm text-muted-foreground font-rajdhani">
                        {formData.videoFile
                          ? "File selected successfully"
                          : "MP4, AVI, MOV up to 500MB"}
                      </p>
                    </div>
                  </div>
                </label>
              </div>

              {formData.videoFile && (
                <div className="bg-primary/10 border border-primary/20 p-4 rounded-none">
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-accent" />
                    <div>
                      <p className="font-rajdhani font-semibold text-foreground">
                        {formData.videoFile.name}
                      </p>
                      <p className="text-sm text-muted-foreground font-rajdhani">
                        {(formData.videoFile.size / (1024 * 1024)).toFixed(2)}{" "}
                        MB
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Thumbnail Upload Section */}
          <Card className="card-futuristic slide-up">
            <CardHeader>
              <CardTitle className="font-orbitron text-xl text-primary flex items-center space-x-2">
                <FileText className="h-5 w-5" />
                <span>Thumbnail (Optional)</span>
              </CardTitle>
              <CardDescription className="font-rajdhani text-muted-foreground">
                Add a custom thumbnail for your video
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="border-2 border-dashed border-secondary/30 rounded-none p-6 text-center hover:border-secondary/50 transition-colors duration-300">
                <input
                  type="file"
                  id="thumbnailFile"
                  accept="image/*"
                  onChange={(e) => handleFileChange(e, "thumbnailFile")}
                  className="hidden"
                />
                <label htmlFor="thumbnailFile" className="cursor-pointer">
                  <div className="space-y-2">
                    <FileText className="h-8 w-8 text-secondary mx-auto" />
                    <p className="text-sm font-rajdhani text-secondary">
                      {formData.thumbnailFile
                        ? formData.thumbnailFile.name
                        : "Click to select image"}
                    </p>
                  </div>
                </label>
              </div>
            </CardContent>
          </Card>

          {/* Video Details Section */}
          <Card className="card-futuristic slide-up">
            <CardHeader>
              <CardTitle className="font-orbitron text-2xl text-primary flex items-center space-x-2">
                <FileText className="h-6 w-6" />
                <span>Video Details</span>
              </CardTitle>
              <CardDescription className="font-rajdhani text-muted-foreground">
                Provide information about your video
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label
                  htmlFor="title"
                  className="font-rajdhani font-semibold text-foreground"
                >
                  Title *
                </Label>
                <Input
                  id="title"
                  type="text"
                  placeholder="Enter video title"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, title: e.target.value }))
                  }
                  required
                  className="input-futuristic"
                />
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="description"
                  className="font-rajdhani font-semibold text-foreground"
                >
                  Description
                </Label>
                <Textarea
                  id="description"
                  placeholder="Describe your video content"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  rows={4}
                  className="input-futuristic resize-none"
                />
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="tags"
                  className="font-rajdhani font-semibold text-foreground"
                >
                  Tags
                </Label>
                <Input
                  id="tags"
                  type="text"
                  placeholder="Enter tags separated by commas"
                  value={formData.tags}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, tags: e.target.value }))
                  }
                  className="input-futuristic"
                />
                <p className="text-xs text-muted-foreground font-rajdhani">
                  Tags help users discover your content
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Upload Progress */}
          {isLoading && (
            <Card className="card-futuristic slide-up">
              <CardHeader>
                <CardTitle className="font-orbitron text-lg text-primary flex items-center space-x-2">
                  <Cloud className="h-5 w-5" />
                  <span>Upload Progress</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="w-full bg-muted/20 rounded-full h-3 border border-primary/30">
                  <div
                    className="bg-gradient-to-r from-primary to-secondary h-3 rounded-full transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
                <p className="text-center font-rajdhani text-primary">
                  {uploadProgress}% Complete
                </p>
              </CardContent>
            </Card>
          )}

          {/* Submit Button */}
          <div className="text-center slide-up">
            <Button
              type="submit"
              className="btn-futuristic h-14 text-lg font-orbitron px-8"
              disabled={isLoading || !formData.videoFile}
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-current mr-2"></div>
                  Uploading...
                </>
              ) : (
                <>
                  <ArrowUp className="h-5 w-5 mr-2" />
                  Upload Video
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
