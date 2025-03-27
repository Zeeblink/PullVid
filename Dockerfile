# Use an official Node.js runtime as the base image
FROM node:18-alpine

# Install system dependencies for yt-dlp and ffmpeg
RUN apk add --no-cache python3 py3-pip ffmpeg

# Create a virtual environment and install yt-dlp
RUN python3 -m venv /venv
RUN /venv/bin/pip3 install yt-dlp

# Add the virtual environment to the PATH (optional but recommended)
ENV PATH="/venv/bin:$PATH"

# Set working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package.json pnpm-lock.yaml ./
RUN npm install -g pnpm && pnpm install

# Copy the rest of the app
COPY . .

# Build the Next.js app using the backend config
RUN pnpm run build

# Expose port 80 for HTTP traffic
EXPOSE 80

# Start the Next.js server specifying port 80
CMD ["pnpm", "run", "start", "--", "-p", "80"]