import React from "react";
import { UploadForm } from "@/features/videos/components/UploadForm";

export function UploadPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Add Video</h1>
        <p className="text-gray-600 mt-2">
          Share your content with the community. Upload your video files and add
          details.
        </p>
      </div>

      <UploadForm />
    </div>
  );
}
