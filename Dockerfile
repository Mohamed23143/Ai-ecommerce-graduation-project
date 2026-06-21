# Stage 1: Build the React application
FROM node:20-alpine AS builder
WORKDIR /app
# Copy only package files first to leverage Docker cache
COPY package.json package-lock.json ./
RUN npm ci
# Copy the rest of the code and build
COPY . .
RUN npm run build

# Stage 2: Serve the application with Nginx
FROM nginx:alpine
# Remove default nginx static assets
RUN rm -rf /usr/share/nginx/html/*
# Copy custom Nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf
# Copy the built assets from the builder stage
COPY --from=builder /app/dist /usr/share/nginx/html
# Expose port 80
EXPOSE 80
# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
