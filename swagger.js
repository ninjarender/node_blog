const swaggerAutogen = require("swagger-autogen")();

const doc = {
  info: {
    title: "Node blog",
    description: "Project for training",
  },
  host: process.env.HOST,
};

const outputFile = "./swagger-output.json";
const routes = [
  "./api/v1/routes/users.ts",
  "./api/v1/routes/userPosts.ts",
  "./api/v1/routes/posts.ts",
  "./api/v1/routes/comments.ts",
];

swaggerAutogen(outputFile, routes, doc);
