# syntax=docker/dockerfile:1

# Comments are provided throughout this file to help you get started.
# If you need more help, visit the Dockerfile reference guide at
# https://docs.docker.com/engine/reference/builder/

ARG NODE_VERSION=20.6.1

FROM node:${NODE_VERSION}-alpine

# Use production node environment by default.
ENV NODE_ENV production

# Copy the rest of the source files into the image.
COPY . /app

# Install dependencies in backend folder
RUN cd /app/backend && npm install

# Build the frontend
RUN cd /app/frontend/app && npm install && npm run build

# Install nodemon
#RUN npm install -g nodemon

# Run the application as a non-root user.
USER node

# Expose the port that the application listens on.
EXPOSE 8000

# Run the application.
#CMD nodemon --max-old-space-size=4096 --delay 2 /app/backend/index.js
CMD node /app/backend/index.js