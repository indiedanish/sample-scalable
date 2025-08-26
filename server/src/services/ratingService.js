const { ratingsContainer } = require("../config/cosmos");
const { v4: uuidv4 } = require("uuid");

class RatingService {
  async createOrUpdateRating(
    videoId,
    userId,
    userEmail,
    rating,
    comment = null
  ) {
    try {
      // Check if user has already rated this video
      const querySpec = {
        query: `
          SELECT * FROM r 
          WHERE r.videoId = @videoId AND r.userId = @userId
        `,
        parameters: [
          { name: "@videoId", value: videoId },
          { name: "@userId", value: userId },
        ],
      };

      const { resources: existingRatings } = await ratingsContainer.items
        .query(querySpec)
        .fetchAll();

      const now = new Date().toISOString();

      if (existingRatings.length > 0) {
        // Update existing rating
        const existingRating = existingRatings[0];
        const updatedRating = {
          ...existingRating,
          rating,
          comment,
          updatedAt: now,
        };

        const { resource } = await ratingsContainer
          .item(existingRating.id, videoId)
          .replace(updatedRating);

        return resource;
      } else {
        // Create new rating
        const newRating = {
          id: uuidv4(),
          videoId,
          userId,
          userEmail,
          rating,
          comment,
          createdAt: now,
          updatedAt: now,
        };

        const { resource } = await ratingsContainer.items.create(newRating);
        return resource;
      }
    } catch (error) {
      console.error("Error creating/updating rating:", error);
      throw new Error("Failed to create or update rating");
    }
  }

  async getRatingsByVideoId(videoId, page = 1, limit = 20) {
    const offset = (page - 1) * limit;

    try {
      // Query for ratings with pagination
      const querySpec = {
        query: `
          SELECT * FROM r 
          WHERE r.videoId = @videoId 
          ORDER BY r.createdAt DESC 
          OFFSET @offset LIMIT @limit
        `,
        parameters: [
          { name: "@videoId", value: videoId },
          { name: "@offset", value: offset },
          { name: "@limit", value: limit },
        ],
      };

      const { resources: ratings } = await ratingsContainer.items
        .query(querySpec)
        .fetchAll();

      // Get total count for pagination
      const countQuerySpec = {
        query: `
          SELECT VALUE COUNT(1) FROM r 
          WHERE r.videoId = @videoId
        `,
        parameters: [{ name: "@videoId", value: videoId }],
      };

      const { resources: countResult } = await ratingsContainer.items
        .query(countQuerySpec)
        .fetchAll();

      const total = countResult[0] || 0;

      return {
        ratings,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      };
    } catch (error) {
      console.error("Error fetching ratings:", error);
      throw new Error("Failed to fetch ratings");
    }
  }

  async getRatingStats(videoId) {
    try {
      // Get total ratings and average
      const totalQuerySpec = {
        query: `
          SELECT 
            VALUE {
              totalRatings: COUNT(1),
              averageRating: AVG(r.rating)
            }
          FROM r 
          WHERE r.videoId = @videoId
        `,
        parameters: [{ name: "@videoId", value: videoId }],
      };

      // Get individual star counts
      const oneStarQuerySpec = {
        query: `
          SELECT VALUE COUNT(1)
          FROM r 
          WHERE r.videoId = @videoId AND r.rating = 1
        `,
        parameters: [{ name: "@videoId", value: videoId }],
      };

      const twoStarQuerySpec = {
        query: `
          SELECT VALUE COUNT(1)
          FROM r 
          WHERE r.videoId = @videoId AND r.rating = 2
        `,
        parameters: [{ name: "@videoId", value: videoId }],
      };

      const threeStarQuerySpec = {
        query: `
          SELECT VALUE COUNT(1)
          FROM r 
          WHERE r.videoId = @videoId AND r.rating = 3
        `,
        parameters: [{ name: "@videoId", value: videoId }],
      };

      const fourStarQuerySpec = {
        query: `
          SELECT VALUE COUNT(1)
          FROM r 
          WHERE r.videoId = @videoId AND r.rating = 4
        `,
        parameters: [{ name: "@videoId", value: videoId }],
      };

      const fiveStarQuerySpec = {
        query: `
          SELECT VALUE COUNT(1)
          FROM r 
          WHERE r.videoId = @videoId AND r.rating = 5
        `,
        parameters: [{ name: "@videoId", value: videoId }],
      };

      // Execute all queries in parallel
      const [
        totalResult,
        oneStarResult,
        twoStarResult,
        threeStarResult,
        fourStarResult,
        fiveStarResult,
      ] = await Promise.all([
        ratingsContainer.items.query(totalQuerySpec).fetchAll(),
        ratingsContainer.items.query(oneStarQuerySpec).fetchAll(),
        ratingsContainer.items.query(twoStarQuerySpec).fetchAll(),
        ratingsContainer.items.query(threeStarQuerySpec).fetchAll(),
        ratingsContainer.items.query(fourStarQuerySpec).fetchAll(),
        ratingsContainer.items.query(fiveStarQuerySpec).fetchAll(),
      ]);

      const totalStats = totalResult[0] || {
        totalRatings: 0,
        averageRating: 0,
      };

      const stats = {
        totalRatings: totalStats.totalRatings || 0,
        averageRating: totalStats.averageRating || 0,
        oneStar: oneStarResult[0] || 0,
        twoStar: twoStarResult[0] || 0,
        threeStar: threeStarResult[0] || 0,
        fourStar: fourStarResult[0] || 0,
        fiveStar: fiveStarResult[0] || 0,
      };

      // Round average rating to 2 decimal places
      if (stats.averageRating) {
        stats.averageRating = Math.round(stats.averageRating * 100) / 100;
      }

      return stats;
    } catch (error) {
      console.error("Error fetching rating stats:", error);
      throw new Error("Failed to fetch rating statistics");
    }
  }

  async getUserRatingForVideo(videoId, userId) {
    try {
      const querySpec = {
        query: `
          SELECT * FROM r 
          WHERE r.videoId = @videoId AND r.userId = @userId
        `,
        parameters: [
          { name: "@videoId", value: videoId },
          { name: "@userId", value: userId },
        ],
      };

      const { resources: ratings } = await ratingsContainer.items
        .query(querySpec)
        .fetchAll();

      return ratings.length > 0 ? ratings[0] : null;
    } catch (error) {
      console.error("Error fetching user rating:", error);
      throw new Error("Failed to fetch user rating");
    }
  }

  async deleteRating(videoId, userId, userRole) {
    try {
      // Get the user's rating for this video
      const userRating = await this.getUserRatingForVideo(videoId, userId);

      if (!userRating) {
        throw new Error("Rating not found");
      }

      // Delete the rating
      await ratingsContainer.item(userRating.id, videoId).delete();

      return { message: "Rating deleted successfully" };
    } catch (error) {
      console.error("Error deleting rating:", error);
      throw error;
    }
  }

  async getRatingById(ratingId, videoId) {
    try {
      const { resource: rating } = await ratingsContainer
        .item(ratingId, videoId)
        .read();

      if (!rating) {
        throw new Error("Rating not found");
      }

      return rating;
    } catch (error) {
      if (error.code === 404) {
        throw new Error("Rating not found");
      }
      console.error("Error fetching rating:", error);
      throw new Error("Failed to fetch rating");
    }
  }
}

module.exports = new RatingService();
