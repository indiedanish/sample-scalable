# Video Hub Backend

A comprehensive Node.js + Express backend for a video hub platform with Azure SQL, Cosmos DB, and Blob Storage integration.

## 🚀 Features

- **User Management**: JWT-based authentication with role-based access control (Admin, Creator, Consumer)
- **Video Management**: Upload, store, and manage video metadata with Azure Blob Storage
- **Comments System**: Real-time commenting system using Azure Cosmos DB
- **Rating System**: 5-star rating system with statistics using Azure Cosmos DB
- **Search & Filtering**: Advanced video search and filtering capabilities
- **API Documentation**: Comprehensive Swagger/OpenAPI documentation
- **Security**: Rate limiting, CORS, helmet security headers
- **Validation**: Input validation using Joi
- **Logging**: Morgan request logging
- **Error Handling**: Centralized error handling with proper HTTP status codes

## 🏗️ Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: Azure SQL Server (with Prisma ORM)
- **NoSQL**: Azure Cosmos DB (for comments & ratings)
- **Storage**: Azure Blob Storage (for video files)
- **Authentication**: JWT
- **Validation**: Joi
- **Documentation**: Swagger/OpenAPI
- **Security**: Helmet, CORS, Rate Limiting

## 📁 Project Structure

```
/backend
  /src
    /config        # Database and Azure service configurations
    /models        # Data models (Prisma schema)
    /routes        # Express routes with Swagger docs
    /controllers   # Request handlers
    /services      # Business logic layer
    /middlewares   # Auth, RBAC, validation middlewares
    /utils         # Helper functions
  /prisma         # Prisma schema and migrations
  server.js       # Server entry point
  app.js          # Express app configuration
```

## 🛠️ Setup Instructions

### Prerequisites

- Node.js (v16 or higher)
- Azure SQL Database
- Azure Cosmos DB account
- Azure Blob Storage account

### 1. Clone and Install

```bash
git clone <repository-url>
cd backend
npm install
```

### 2. Environment Configuration

Create a `.env` file in the root directory:

```env
# Database
DATABASE_URL="sqlserver://your-server.database.windows.net:1433;database=your-db;user=your-user;password=your-password;encrypt=true;trustServerCertificate=false;loginTimeout=30;"

# Cosmos DB
COSMOS_ENDPOINT="https://your-cosmos.documents.azure.com:443/"
COSMOS_KEY="your-cosmos-key"
COSMOS_DATABASE="video-hub"
COSMOS_CONTAINER_COMMENTS="comments"
COSMOS_CONTAINER_RATINGS="ratings"

# Azure Blob Storage
AZURE_STORAGE_CONNECTION_STRING="DefaultEndpointsProtocol=https;AccountName=your-storage;AccountKey=your-key;EndpointSuffix=core.windows.net"
AZURE_STORAGE_CONTAINER="videos"

# JWT
JWT_SECRET="your-super-secret-jwt-key-here"
JWT_EXPIRES_IN="24h"

# Server
API_PORT=3001
CORS_ORIGIN="http://localhost:3000"
```

### 3. Database Setup

```bash
# Generate Prisma client
npm run prisma:generate

# Push schema to database
npm run prisma:push

# Or run migrations (for production)
npm run prisma:migrate
```

### 4. Start the Server

```bash
# Development mode
npm run dev

# Production mode
npm start
```

The server will start on `http://localhost:3001`

## 📚 API Documentation

Once the server is running, visit:
- **Swagger UI**: `http://localhost:3001/api-docs`
- **Health Check**: `http://localhost:3001/health`

## 🔐 Authentication

### User Roles

1. **ADMIN**: Full access to all resources
2. **CREATOR**: Can create, update, delete own videos
3. **CONSUMER**: Can view videos, add comments and ratings

### JWT Token

Include the JWT token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

## 📋 API Endpoints

### Authentication & Users
- `POST /auth/signup` - Consumer user registration
- `POST /auth/login` - User login (all roles)
- `POST /creators` - Admin creates creator user
- `GET /users/me` - Get current user info

### Videos
- `POST /videos` - Create video (creator only)
- `GET /videos` - List/search videos with filters
- `GET /videos/:id` - Get video details
- `PUT /videos/:id` - Update video (owner/admin)
- `DELETE /videos/:id` - Delete video (owner/admin)

### Comments
- `POST /videos/:id/comments` - Add comment
- `GET /videos/:id/comments` - Get comments

### Ratings
- `POST /videos/:id/ratings` - Add/update rating
- `GET /videos/:id/ratings` - Get ratings
- `GET /videos/:id/ratings/stats` - Get rating statistics

### Dashboard
- `GET /dashboard/latest` - Get latest videos
- `GET /dashboard/stats` - Get dashboard statistics

## 🔍 Query Parameters

### Video Filtering
```
GET /videos?search=keyword&creatorId=123&minDuration=60&maxDuration=3600&startDate=2024-01-01&endDate=2024-12-31&page=1&limit=10
```

### Pagination
All list endpoints support pagination:
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 10-20 depending on endpoint)

## 📝 Example Usage

### 1. User Registration
```bash
curl -X POST http://localhost:3001/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123",
    "firstName": "John",
    "lastName": "Doe"
  }'
```

### 2. User Login
```bash
curl -X POST http://localhost:3001/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123"
  }'
```

### 3. Create Video (Creator)
```bash
curl -X POST http://localhost:3001/videos \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <jwt-token>" \
  -d '{
    "title": "My Video",
    "description": "A great video",
    "fileName": "video.mp4",
    "fileSize": 1048576,
    "blobUrl": "https://storage.blob.core.windows.net/videos/video.mp4",
    "duration": 300,
    "isPublic": true
  }'
```

### 4. Add Comment
```bash
curl -X POST http://localhost:3001/videos/video-id/comments \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <jwt-token>" \
  -d '{
    "content": "Great video!"
  }'
```

### 5. Add Rating
```bash
curl -X POST http://localhost:3001/videos/video-id/ratings \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <jwt-token>" \
  -d '{
    "rating": 5,
    "comment": "Excellent content!"
  }'
```

## 🚦 Response Format

### Success Response
```json
{
  "success": true,
  "message": "Operation successful",
  "data": {
    // Response data
  }
}
```

### Error Response
```json
{
  "success": false,
  "error": "Error message",
  "details": {
    // Additional error details
  }
}
```

## 🔒 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Role-Based Access Control**: Different permissions for different user roles
- **Rate Limiting**: Prevents API abuse
- **Input Validation**: Joi schema validation for all inputs
- **CORS Protection**: Configurable CORS settings
- **Helmet Security**: Security headers for protection
- **Password Hashing**: bcrypt for secure password storage

## 🐛 Error Handling

The API includes comprehensive error handling for:
- Authentication errors (401)
- Authorization errors (403)
- Validation errors (400)
- Not found errors (404)
- Conflict errors (409)
- Server errors (500)
- Database errors (Prisma-specific)

## 📊 Monitoring

- Health check endpoint: `GET /health`
- Request logging with Morgan
- Error logging with stack traces
- Graceful shutdown handling

## 🚀 Deployment

### Environment Variables for Production
- Set `NODE_ENV=production`
- Use strong JWT secrets
- Configure proper CORS origins
- Set up proper logging
- Use connection pooling for databases

### Docker Support (Optional)
```dockerfile
FROM node:16-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run prisma:generate
EXPOSE 3001
CMD ["npm", "start"]
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License. 