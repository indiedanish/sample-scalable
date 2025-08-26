const { CosmosClient } = require("@azure/cosmos");

const cosmosClient = new CosmosClient({
  endpoint: process.env.COSMOS_ENDPOINT,
  key: process.env.COSMOS_KEY,
});

const database = cosmosClient.database(process.env.COSMOS_DATABASE);

// Comments container
const commentsContainer = database.container(
  process.env.COSMOS_CONTAINER_COMMENTS
);

// Ratings container
const ratingsContainer = database.container(
  process.env.COSMOS_CONTAINER_RATINGS
);

// Initialize containers (create if they don't exist)
const initializeContainers = async () => {
  try {
    // Create comments container
    await database.containers.createIfNotExists({
      id: process.env.COSMOS_CONTAINER_COMMENTS,
      partitionKey: { paths: ["/videoId"] },
    });

    // Create ratings container
    await database.containers.createIfNotExists({
      id: process.env.COSMOS_CONTAINER_RATINGS,
      partitionKey: { paths: ["/videoId"] },
    });

    console.log("Cosmos DB containers initialized successfully");
  } catch (error) {
    console.error("Error initializing Cosmos DB containers:", error);
  }
};

module.exports = {
  cosmosClient,
  database,
  commentsContainer,
  ratingsContainer,
  initializeContainers,
};
