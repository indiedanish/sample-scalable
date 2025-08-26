const {
  BlobServiceClient,
  generateBlobSASQueryParameters,
  BlobSASPermissions,
} = require("@azure/storage-blob");
const { v4: uuidv4 } = require("uuid");
const path = require("path");

class BlobService {
  constructor() {
    this.blobServiceClient = BlobServiceClient.fromConnectionString(
      process.env.AZURE_STORAGE_CONNECTION_STRING
    );
    this.containerName = process.env.AZURE_STORAGE_CONTAINER || "videos";
    this.containerClient = this.blobServiceClient.getContainerClient(
      this.containerName
    );
  }

  // Upload file to Azure Blob Storage
  async uploadFile(buffer, originalName, contentType) {
    try {
      // Generate unique filename
      const fileExtension = path.extname(originalName);
      const fileName = `${uuidv4()}${fileExtension}`;

      // Get blob client
      const blobClient = this.containerClient.getBlockBlobClient(fileName);

      // Upload options
      const uploadOptions = {
        blobHTTPHeaders: {
          blobContentType: contentType,
        },
        metadata: {
          originalName: originalName,
          uploadedAt: new Date().toISOString(),
        },
      };

      // Upload the file
      await blobClient.upload(buffer, buffer.length, uploadOptions);

      return {
        fileName: fileName,
        url: blobClient.url,
        size: buffer.length,
        contentType: contentType,
      };
    } catch (error) {
      console.error("Blob upload error:", error);
      throw new Error("Failed to upload file to blob storage");
    }
  }

  // Generate pre-signed upload URL
  async generateUploadUrl(fileName, contentType) {
    try {
      const fileExtension = path.extname(fileName);
      const uniqueFileName = `${uuidv4()}${fileExtension}`;

      const blobClient = this.containerClient.getBlockBlobClient(
        uniqueFileName
      );

      // Generate SAS token for upload
      const sasOptions = {
        containerName: this.containerName,
        blobName: uniqueFileName,
        permissions: BlobSASPermissions.parse("w"), // Write permission
        startsOn: new Date(),
        expiresOn: new Date(new Date().valueOf() + 3600 * 1000), // 1 hour from now
      };

      const sasToken = generateBlobSASQueryParameters(
        sasOptions,
        this.blobServiceClient.credential
      ).toString();

      const uploadUrl = `${blobClient.url}?${sasToken}`;

      return {
        uploadUrl: uploadUrl,
        blobUrl: blobClient.url,
        fileName: uniqueFileName,
        expiresAt: sasOptions.expiresOn,
      };
    } catch (error) {
      console.error("Generate upload URL error:", error);
      throw new Error("Failed to generate upload URL");
    }
  }

  // Get video stream for streaming
  async getVideoStream(blobUrl, range) {
    try {
      // Extract blob name from URL
      const url = new URL(blobUrl);
      const blobName = url.pathname.split("/").pop();

      const blobClient = this.containerClient.getBlockBlobClient(blobName);

      // Get blob properties
      const properties = await blobClient.getProperties();
      const fileSize = properties.contentLength;
      const contentType = properties.contentType;

      if (range) {
        // Parse range header
        const parts = range.replace(/bytes=/, "").split("-");
        const start = parseInt(parts[0], 10);
        const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
        const chunkSize = end - start + 1;

        // Download specific range
        const downloadResponse = await blobClient.download(start, chunkSize);

        return {
          stream: downloadResponse.readableStreamBody,
          contentLength: chunkSize,
          contentRange: `bytes ${start}-${end}/${fileSize}`,
          contentType: contentType,
        };
      } else {
        // Download entire file
        const downloadResponse = await blobClient.download();

        return {
          stream: downloadResponse.readableStreamBody,
          contentLength: fileSize,
          contentType: contentType,
        };
      }
    } catch (error) {
      console.error("Get video stream error:", error);
      throw new Error("Failed to get video stream");
    }
  }

  // Delete blob
  async deleteFile(blobUrl) {
    try {
      // Extract blob name from URL
      const url = new URL(blobUrl);
      const blobName = url.pathname.split("/").pop();

      const blobClient = this.containerClient.getBlockBlobClient(blobName);
      await blobClient.deleteIfExists();

      return { success: true };
    } catch (error) {
      console.error("Delete blob error:", error);
      throw new Error("Failed to delete file from blob storage");
    }
  }

  // Get blob metadata
  async getBlobMetadata(blobUrl) {
    try {
      const url = new URL(blobUrl);
      const blobName = url.pathname.split("/").pop();

      const blobClient = this.containerClient.getBlockBlobClient(blobName);
      const properties = await blobClient.getProperties();

      return {
        size: properties.contentLength,
        contentType: properties.contentType,
        lastModified: properties.lastModified,
        metadata: properties.metadata,
      };
    } catch (error) {
      console.error("Get blob metadata error:", error);
      throw new Error("Failed to get blob metadata");
    }
  }

  // Generate read-only URL with SAS token
  async generateReadUrl(blobUrl, expirationHours = 24) {
    try {
      const url = new URL(blobUrl);
      const blobName = url.pathname.split("/").pop();

      const blobClient = this.containerClient.getBlockBlobClient(blobName);

      const sasOptions = {
        containerName: this.containerName,
        blobName: blobName,
        permissions: BlobSASPermissions.parse("r"), // Read permission
        startsOn: new Date(),
        expiresOn: new Date(
          new Date().valueOf() + expirationHours * 3600 * 1000
        ),
      };

      const sasToken = generateBlobSASQueryParameters(
        sasOptions,
        this.blobServiceClient.credential
      ).toString();

      return `${blobClient.url}?${sasToken}`;
    } catch (error) {
      console.error("Generate read URL error:", error);
      throw new Error("Failed to generate read URL");
    }
  }
}

module.exports = new BlobService();
