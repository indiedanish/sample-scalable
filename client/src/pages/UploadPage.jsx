import React from "react";
import { UploadForm } from "@/features/videos/components/UploadForm";
import { Video, Sparkles, TrendingUp, Users, Globe } from "lucide-react";

export function UploadPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-slate-900 via-blue-900 to-indigo-900">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className="relative">
                <div className="absolute inset-0 bg-emerald-400/20 blur-xl"></div>
                <div className="relative bg-emerald-500 p-4 border-2 border-emerald-400">
                  <Video className="h-12 w-12 text-white" />
                </div>
              </div>
            </div>
            <h1 className="text-5xl font-bold text-white mb-4 font-['Inter']">
              Share Your Vision
            </h1>
            <p className="text-xl text-slate-200 max-w-2xl mx-auto font-['Inter']">
              Upload your videos and connect with creators worldwide. Your
              content deserves to be seen.
            </p>
          </div>
        </div>

        {/* Floating Elements */}
        <div className="absolute top-10 left-10 opacity-20">
          <Sparkles className="h-8 w-8 text-emerald-400 animate-pulse" />
        </div>
        <div className="absolute top-20 right-20 opacity-20">
          <TrendingUp className="h-8 w-8 text-blue-400 animate-pulse" />
        </div>
        <div className="absolute bottom-20 left-1/4 opacity-20">
          <Users className="h-8 w-8 text-indigo-400 animate-pulse" />
        </div>
        <div className="absolute bottom-10 right-1/4 opacity-20">
          <Globe className="h-8 w-8 text-emerald-400 animate-pulse" />
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-white border-b-2 border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-3xl font-bold text-slate-900 mb-2 font-['Inter']">
                10K+
              </div>
              <div className="text-slate-600 font-['Inter']">
                Videos Uploaded
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-slate-900 mb-2 font-['Inter']">
                50K+
              </div>
              <div className="text-slate-600 font-['Inter']">Active Users</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-slate-900 mb-2 font-['Inter']">
                1M+
              </div>
              <div className="text-slate-600 font-['Inter']">Views Daily</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Left Sidebar - Features */}
          <div className="lg:col-span-1">
            <div className="sticky top-8 space-y-6">
              <div className="bg-white border-2 border-slate-200 p-6 shadow-lg">
                <h3 className="text-lg font-semibold text-slate-900 mb-4 font-['Inter']">
                  Why Choose MStream?
                </h3>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="bg-emerald-100 p-2 border-2 border-emerald-200">
                      <Sparkles className="h-4 w-4 text-emerald-600" />
                    </div>
                    <div>
                      <h4 className="font-medium text-slate-900 font-['Inter']">
                        High Quality
                      </h4>
                      <p className="text-sm text-slate-600 font-['Inter']">
                        4K support with fast processing
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="bg-blue-100 p-2 border-2 border-blue-200">
                      <Globe className="h-4 w-4 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-medium text-slate-900 font-['Inter']">
                        Global Reach
                      </h4>
                      <p className="text-sm text-slate-600 font-['Inter']">
                        Share with creators worldwide
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="bg-indigo-100 p-2 border-2 border-indigo-200">
                      <TrendingUp className="h-4 w-4 text-indigo-600" />
                    </div>
                    <div>
                      <h4 className="font-medium text-slate-900 font-['Inter']">
                        Analytics
                      </h4>
                      <p className="text-sm text-slate-600 font-['Inter']">
                        Track your video performance
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-emerald-50 to-blue-50 border-2 border-emerald-200 p-6">
                <h3 className="text-lg font-semibold text-emerald-900 mb-3 font-['Inter']">
                  Upload Tips
                </h3>
                <ul className="space-y-2 text-sm text-emerald-800 font-['Inter']">
                  <li>• Use descriptive titles and tags</li>
                  <li>• Add engaging thumbnails</li>
                  <li>• Write compelling descriptions</li>
                  <li>• Choose the right category</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Main Upload Area */}
          <div className="lg:col-span-2">
            <div className="bg-white border-2 border-slate-200 shadow-xl">
              <div className="bg-gradient-to-r from-slate-900 to-blue-900 p-6 border-b-2 border-slate-200">
                <h2 className="text-2xl font-bold text-white font-['Inter']">
                  Ready to Upload?
                </h2>
                <p className="text-slate-200 mt-2 font-['Inter']">
                  Follow the steps below to share your video with the world
                </p>
              </div>
              <div className="p-6">
                <UploadForm />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="bg-slate-900 border-t-2 border-slate-700">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
          <h3 className="text-2xl font-bold text-white mb-4 font-['Inter']">
            Questions about uploading?
          </h3>
          <p className="text-slate-300 mb-6 font-['Inter']">
            Our support team is here to help you get started
          </p>
          <button className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-3 font-medium transition-all duration-200 hover:shadow-lg transform hover:-translate-y-0.5 border-2 border-emerald-500 font-['Inter']">
            Get Help
          </button>
        </div>
      </div>
    </div>
  );
}
