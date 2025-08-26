# Video Upload Functionality Guide

## Overview
The video upload system has been implemented with proper file handling, Azure Blob Storage integration, and comprehensive Swagger documentation.

## Features Implemented

### 1. **Direct Video Upload** (`POST /videos`)
- **Method**: Multipart form upload with file
- **Authentication**: Required (Creator role)
- **File Types**: Video files only (video/*)
- **Size Limit**: 100MB
- **Fields**:
  - `video` (required): Video file
  - `title` (required): Video title
  - `description` (optional): Video description
  - `isPublic` (optional): Public/private flag

### 2. **Pre-signed Upload URL** (`POST /videos/generate-upload-url`)
- **Method**: JSON request
- **Authentication**: Required (Creator role)
- **Purpose**: Generate secure upload URL for large files
- **Fields**:
  - `fileName`: Original file name
  - `contentType`: Video MIME type

### 3. **Video Streaming** (`GET /videos/:id/stream`)
- **Method**: GET with Range support
- **Authentication**: Not required (public endpoint)
- **Features**: Progressive download, range requests for seeking

## Testing the Upload Functionality

### Option 1: Swagger UI Testing

1. **Start the server**:
   ```bash
   npm run dev
   ```

2. **Open Swagger UI**:
   - Navigate to: `http://localhost:3001/api-docs`

3. **Authenticate**:
   - Login as a creator user to get JWT token
   - Click "Authorize" button in Swagger UI
   - Enter: `Bearer <your-jwt-token>`

4. **Upload Video**:
   - Find `POST /videos` endpoint
   - Click "Try it out"
   - Fill in the form:
     - **title**: "My Test Video"
     - **description**: "Test video description"
     - **video**: Click "Choose File" and select a video file
     - **isPublic**: true
   - Click "Execute"

### Option 2: cURL Testing

1. **Login to get token**:
   ```bash
   curl -X POST http://localhost:3001/auth/login \
     -H "Content-Type: application/json" \
     -d '{
       "email": "creator@example.com",
       "password": "password123"
     }'
   ```

2. **Upload video**:
   ```bash
   curl -X POST http://localhost:3001/videos \
     -H "Authorization: Bearer <your-jwt-token>" \
     -F "title=My Test Video" \
     -F "description=Test video description" \
     -F "isPublic=true" \
     -F "video=@/path/to/your/video.mp4"
   ```

### Option 3: Frontend JavaScript Example

```javascript
const uploadVideo = async (videoFile, title, description) => {
  const formData = new FormData();
  formData.append('video', videoFile);
  formData.append('title', title);
  formData.append('description', description);
  formData.append('isPublic', 'true');

  const response = await fetch('http://localhost:3001/videos', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    },
    body: formData
  });

  const result = await response.json();
  console.log('Upload result:', result);
};
```

## Expected Response

### Successful Upload (201 Created)
```json
{
  "success": true,
  "message": "Video uploaded successfully",
  "data": {
    "video": {
      "id": "video-uuid",
      "title": "My Test Video",
      "description": "Test video description",
             "fileName": "video.mp4",
       "fileSize": 1048576,
       "blobUrl": "https://storage.blob.core.windows.net/videos/unique-name.mp4",
       "isPublic": true,
      "createdAt": "2024-01-01T12:00:00.000Z",
      "creator": {
        "id": "creator-uuid",
        "firstName": "John",
        "lastName": "Creator"
      }
    }
  }
}
```

### Error Responses

#### File Too Large (413)
```json
{
  "success": false,
  "error": "File Too Large",
  "message": "File size exceeds the maximum allowed limit (100MB)"
}
```

#### Invalid File Type (400)
```json
{
  "success": false,
  "error": "Invalid File Type",
  "message": "Only video files are allowed"
}
```

#### Missing Authentication (401)
```json
{
  "success": false,
  "error": "Access Denied",
  "message": "No token provided"
}
```

## Video Streaming

### Stream a Video
```bash
curl -H "Range: bytes=0-1023" \
  http://localhost:3001/videos/{video-id}/stream
```

### In HTML5 Video Player
```html
<video controls>
  <source src="http://localhost:3001/videos/{video-id}/stream" type="video/mp4">
</video>
```

## Troubleshooting

### Common Issues

1. **"Only video files are allowed"**
   - Ensure file has video MIME type (video/mp4, video/webm, etc.)
   - Check file extension matches content

2. **"File Too Large"**
   - Reduce file size to under 100MB
   - Consider using the pre-signed URL approach for larger files

3. **"Authentication required"**
   - Ensure you're logged in as a creator user
   - Check JWT token is valid and not expired

4. **Azure Blob Storage errors**
   - Verify Azure storage connection string is correct
   - Check container exists and has proper permissions

### Environment Variables Required

```env
# Azure Storage
AZURE_STORAGE_CONNECTION_STRING="DefaultEndpointsProtocol=https;AccountName=..."
AZURE_STORAGE_CONTAINER="videos"

# Database connection for user/video metadata
DATABASE_URL="sqlserver://..."

# JWT for authentication
JWT_SECRET="your-secret-key"
```

## File Upload Flow

1. **Client** sends multipart form with video file
2. **Multer** processes upload into memory buffer
3. **Validation** checks file type and size
4. **Azure Blob** uploads file to cloud storage
5. **Database** saves video metadata with blob URL
6. **Response** returns video info to client

## Additional Features

- **Progress Tracking**: Can be implemented with custom upload progress handlers
- **Video Processing**: Add video transcoding, format conversion
- **CDN Integration**: Serve videos through Azure CDN for better performance

## Security Considerations

- File type validation prevents malicious uploads
- Size limits prevent abuse
- JWT authentication ensures only authorized users can upload
- Azure Blob Storage provides secure file storage
- Input validation prevents injection attacks 