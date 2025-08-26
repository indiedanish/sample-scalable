const { commentsContainer } = require("../config/cosmos");
const { v4: uuidv4 } = require("uuid");

class CommentService {
  async createComment(videoId, userId, userEmail, content) {
    const comment = {
      id: uuidv4(),
      videoId,
      userId,
      userEmail,
      content,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isDeleted: false,
    };

    try {
      const { resource } = await commentsContainer.items.create(comment);
      return resource;
    } catch (error) {
      console.error("Error creating comment:", error);
      throw new Error("Failed to create comment");
    }
  }

  async getCommentsByVideoId(videoId, page = 1, limit = 20) {
    const offset = (page - 1) * limit;

    try {
      // Query for comments with pagination
      const querySpec = {
        query: `
          SELECT * FROM c 
          WHERE c.videoId = @videoId AND c.isDeleted = false 
          ORDER BY c.createdAt DESC 
          OFFSET @offset LIMIT @limit
        `,
        parameters: [
          { name: "@videoId", value: videoId },
          { name: "@offset", value: offset },
          { name: "@limit", value: limit },
        ],
      };

      const { resources: comments } = await commentsContainer.items
        .query(querySpec)
        .fetchAll();

      // Get total count for pagination
      const countQuerySpec = {
        query: `
          SELECT VALUE COUNT(1) FROM c 
          WHERE c.videoId = @videoId AND c.isDeleted = false
        `,
        parameters: [{ name: "@videoId", value: videoId }],
      };

      const { resources: countResult } = await commentsContainer.items
        .query(countQuerySpec)
        .fetchAll();

      const total = countResult[0] || 0;

      return {
        comments,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      };
    } catch (error) {
      console.error("Error fetching comments:", error);
      throw new Error("Failed to fetch comments");
    }
  }

  async updateComment(commentId, videoId, userId, content) {
    try {
      // First, get the existing comment
      const { resource: existingComment } = await commentsContainer
        .item(commentId, videoId)
        .read();

      if (!existingComment) {
        throw new Error("Comment not found");
      }

      // Check if user owns the comment
      if (existingComment.userId !== userId) {
        throw new Error("Access denied. You can only update your own comments");
      }

      // Update the comment
      const updatedComment = {
        ...existingComment,
        content,
        updatedAt: new Date().toISOString(),
      };

      const { resource } = await commentsContainer
        .item(commentId, videoId)
        .replace(updatedComment);

      return resource;
    } catch (error) {
      console.error("Error updating comment:", error);
      throw error;
    }
  }

  async deleteComment(commentId, videoId, userId, userRole) {
    try {
      // First, get the existing comment
      const { resource: existingComment } = await commentsContainer
        .item(commentId, videoId)
        .read();

      if (!existingComment) {
        throw new Error("Comment not found");
      }

      // Check if user owns the comment or is admin
      if (existingComment.userId !== userId && userRole !== "ADMIN") {
        throw new Error("Access denied. You can only delete your own comments");
      }

      // Soft delete the comment
      const deletedComment = {
        ...existingComment,
        isDeleted: true,
        deletedAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      await commentsContainer.item(commentId, videoId).replace(deletedComment);

      return { message: "Comment deleted successfully" };
    } catch (error) {
      console.error("Error deleting comment:", error);
      throw error;
    }
  }

  async getCommentById(commentId, videoId) {
    try {
      const { resource: comment } = await commentsContainer
        .item(commentId, videoId)
        .read();

      if (!comment || comment.isDeleted) {
        throw new Error("Comment not found");
      }

      return comment;
    } catch (error) {
      if (error.code === 404) {
        throw new Error("Comment not found");
      }
      console.error("Error fetching comment:", error);
      throw new Error("Failed to fetch comment");
    }
  }

  async getCommentStats(videoId) {
    try {
      const querySpec = {
        query: `
          SELECT VALUE COUNT(1) FROM c 
          WHERE c.videoId = @videoId AND c.isDeleted = false
        `,
        parameters: [{ name: "@videoId", value: videoId }],
      };

      const { resources: countResult } = await commentsContainer.items
        .query(querySpec)
        .fetchAll();

      return {
        totalComments: countResult[0] || 0,
      };
    } catch (error) {
      console.error("Error fetching comment stats:", error);
      throw new Error("Failed to fetch comment statistics");
    }
  }
}

module.exports = new CommentService();
