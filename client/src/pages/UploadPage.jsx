import React from "react";
import { UploadForm } from "@/features/videos/components/UploadForm";
import { Upload, Leaf, Sparkles } from "lucide-react";

export function UploadPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      <div className="text-center mb-10">
        <div className="relative inline-block mb-6">
          <div className="w-20 h-20 bg-eco-leaf/10 rounded-full flex items-center justify-center mb-4 mx-auto">
            <Upload className="h-10 w-10 text-eco-leaf" />
          </div>
          <Leaf className="h-6 w-6 text-eco-sage absolute -top-2 -right-2 animate-float" />
          <Sparkles className="h-4 w-4 text-eco-earth absolute -bottom-1 -left-1 animate-pulse" />
        </div>
        <h1 className="font-eco text-4xl font-bold text-eco-forest mb-3">
          Share Your Vision
        </h1>
        <p className="text-eco-forest/70 text-lg font-medium max-w-2xl mx-auto">
          Share your content with the community. Upload your video files and add
          details to help others discover your work.
        </p>
        <div className="leaf-divider mt-6"></div>
      </div>

      <UploadForm />
    </div>
  );
}
