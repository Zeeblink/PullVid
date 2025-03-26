# Use an official Node.js runtime as the base image
FROM node:18-alpine

# Install system dependencies for yt-dlp and ffmpeg
RUN apk add --no-cache python3 py3-pip ffmpeg

# Install yt-dlp globally
RUN pip3 install yt-dlp

# Set working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package.json package-lock.json ./
# If you're using pnpm, uncomment the following line and comment the npm install line

COPY package.json pnpm-lock.yaml ./
RUN npm install -g pnpm && pnpm install

# RUN npm install

# Copy the rest of the app
COPY . .

# Build the Next.js app
RUN pnpm run build

# Expose port 80 for HTTP traffic
EXPOSE 80

# Start the Next.js server specifying port 80
CMD ["pnpm", "run", "start", "--", "-p", "80"]
