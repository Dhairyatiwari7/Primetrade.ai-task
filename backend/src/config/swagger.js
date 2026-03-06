const swaggerJsdoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Task Management API",
      version: "1.0.0",
      description: "API documentation for Task Manager"
    },
    servers: [
      {
        url: "http://localhost:5000/api/v1"
      }
    ]
  },
  apis: ["../routes/*.js"]  // IMPORTANT FIX
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;