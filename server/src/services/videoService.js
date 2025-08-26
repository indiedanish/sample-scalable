const prisma = require("../config/database");
const { containerClient } = require("../config/blob");

class VideoService {
  async createVideo(videoData, creatorId) {
    const video = await prisma.video.create({
      data: {
        ...videoData,
        creatorId,
      },
      include: {
        creator: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
    });

    return video;
  }

  async getVideoById(videoId, includePrivate = false, userId = null) {
    const video = await prisma.video.findUnique({
      where: { id: videoId },
      include: {
        creator: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
    });

    if (!video) {
      throw new Error("Video not found");
    }

    // Check if user can view private videos
    if (!video.isPublic && !includePrivate) {
      if (!userId || userId !== video.creatorId) {
        throw new Error("Video not found");
      }
    }

    return video;
  }

  async getVideos(
    filters = {},
    page = 1,
    limit = 10,
    userId = null,
    includePrivate = false
  ) {
    const offset = (page - 1) * limit;

    // Build where clause
    const where = {
      AND: [],
    };

    // Public videos filter (unless user can see private videos)
    if (!includePrivate) {
      where.AND.push({ isPublic: true });
    } else if (userId && !includePrivate) {
      // User can see their own private videos
      where.AND.push({
        OR: [{ isPublic: true }, { creatorId: userId }],
      });
    }

    // Search by title or description
    if (filters.search) {
      where.AND.push({
        OR: [
          { title: { contains: filters.search } },
          { description: { contains: filters.search } },
        ],
      });
    }

    // Filter by creator
    if (filters.creatorId) {
      where.AND.push({ creatorId: filters.creatorId });
    }

    // Filter by duration range
    if (filters.minDuration || filters.maxDuration) {
      const durationFilter = {};
      if (filters.minDuration)
        durationFilter.gte = parseInt(filters.minDuration);
      if (filters.maxDuration)
        durationFilter.lte = parseInt(filters.maxDuration);
      where.AND.push({ duration: durationFilter });
    }

    // Date range filter
    if (filters.startDate || filters.endDate) {
      const dateFilter = {};
      if (filters.startDate) dateFilter.gte = new Date(filters.startDate);
      if (filters.endDate) dateFilter.lte = new Date(filters.endDate);
      where.AND.push({ createdAt: dateFilter });
    }

    const [videos, total] = await Promise.all([
      prisma.video.findMany({
        where: where.AND.length > 0 ? where : {},
        include: {
          creator: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
            },
          },
        },
        skip: offset,
        take: limit,
        orderBy: { createdAt: "desc" },
      }),
      prisma.video.count({
        where: where.AND.length > 0 ? where : {},
      }),
    ]);

    return {
      videos,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }

  async updateVideo(videoId, updateData, userId, userRole) {
    // First check if video exists and user has permission
    const existingVideo = await prisma.video.findUnique({
      where: { id: videoId },
    });

    if (!existingVideo) {
      throw new Error("Video not found");
    }

    // Check ownership (only creator or admin can update)
    if (userRole !== "ADMIN" && existingVideo.creatorId !== userId) {
      throw new Error("Access denied. You can only update your own videos");
    }

    const video = await prisma.video.update({
      where: { id: videoId },
      data: updateData,
      include: {
        creator: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
    });

    return video;
  }

  async deleteVideo(videoId, userId, userRole) {
    // First check if video exists and user has permission
    const existingVideo = await prisma.video.findUnique({
      where: { id: videoId },
    });

    if (!existingVideo) {
      throw new Error("Video not found");
    }

    // Check ownership (only creator or admin can delete)
    if (userRole !== "ADMIN" && existingVideo.creatorId !== userId) {
      throw new Error("Access denied. You can only delete your own videos");
    }

    // Delete video from database
    await prisma.video.delete({
      where: { id: videoId },
    });

    // Optionally delete from blob storage (commented out for safety)
    // try {
    //   const blobName = existingVideo.blobUrl.split('/').pop();
    //   await containerClient.deleteBlob(blobName);
    // } catch (error) {
    //   console.error('Error deleting blob:', error);
    // }

    return { message: "Video deleted successfully" };
  }

  async getLatestVideos(limit = 10) {
    const videos = await prisma.video.findMany({
      where: { isPublic: true },
      include: {
        creator: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
      take: limit,
      orderBy: { createdAt: "desc" },
    });

    return videos;
  }

  async generateUploadUrl(fileName, contentType) {
    // Generate a unique blob name
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2);
    const blobName = `${timestamp}-${randomString}-${fileName}`;

    // Get blob client
    const blobClient = containerClient.getBlockBlobClient(blobName);

    // Generate SAS URL for upload (valid for 1 hour)
    const expiresOn = new Date();
    expiresOn.setHours(expiresOn.getHours() + 1);

    // For now, return the blob URL - in production you'd generate a SAS token
    const blobUrl = blobClient.url;

    return {
      uploadUrl: blobUrl,
      blobUrl: blobUrl,
      blobName: blobName,
    };
  }
}

module.exports = new VideoService();
