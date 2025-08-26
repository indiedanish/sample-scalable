const { BlobServiceClient } = require("@azure/storage-blob");

const blobServiceClient = BlobServiceClient.fromConnectionString(
  process.env.AZURE_STORAGE_CONNECTION_STRING
);

const containerClient = blobServiceClient.getContainerClient(
  process.env.AZURE_STORAGE_CONTAINER
);

// Initialize container (create if it doesn't exist)
const initializeContainer = async () => {
  try {
    await containerClient.createIfNotExists({
      access: "blob", // Allow public read access to blobs
    });
    console.log("Azure Blob Storage container initialized successfully");
  } catch (error) {
    console.error("Error initializing Azure Blob Storage container:", error);
  }
};

module.exports = {
  blobServiceClient,
  containerClient,
  initializeContainer,
};
