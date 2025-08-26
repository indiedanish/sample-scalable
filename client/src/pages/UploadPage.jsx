import React from "react";
import { UploadForm } from "@/features/videos/components/UploadForm";

export function UploadPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-10 text-center">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent mb-4">
          Share Your Creativity
        </h1>
        <p className="text-lg text-slate-600 max-w-2xl mx-auto">
          Upload your video content and connect with your audience. Share your stories, skills, and passion with the world.
        </p>
      </div>

      <UploadForm />
    </div>
  );
}
