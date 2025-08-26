const swaggerJSDoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Video Hub API",
      version: "1.0.0",
      description:
        "A comprehensive video hub API with Azure SQL, Cosmos DB, and Blob Storage",
    },
    servers: [
      {
        url: `http://localhost:${process.env.API_PORT || 3001}`,
        description: "Development server",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ["./src/routes/*.js"], // Path to the API docs
};

const specs = swaggerJSDoc(options);

module.exports = specs;
