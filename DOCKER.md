# Docker Deployment Guide for TaskFlow

This guide explains how to deploy TaskFlow using Docker for both development and production environments.

## Prerequisites

- Docker Engine 20.10+
- Docker Compose 2.0+

## Production Deployment

### Option 1: Using Docker Compose (Recommended)

1. **Build and run the application:**
   ```bash
   docker-compose up --build -d
   ```

2. **Access the application:**
   - Open your browser and navigate to `http://localhost:3000`

3. **Stop the application:**
   ```bash
   docker-compose down
   ```

### Option 2: Using Docker directly

1. **Build the Docker image:**
   ```bash
   docker build -t taskflow-app .
   ```

2. **Run the container:**
   ```bash
   docker run -d \
     --name taskflow \
     -p 3000:3000 \
     --restart unless-stopped \
     taskflow-app
   ```

3. **Stop the container:**
   ```bash
   docker stop taskflow
   docker rm taskflow
   ```

## Development Setup

For local development with hot reloading:

1. **Start the development environment:**
   ```bash
   docker-compose --profile dev up --build
   ```

2. **Access the development server:**
   - Application will be available at `http://localhost:3001`
   - Changes to your code will automatically reload the application

3. **Stop the development environment:**
   ```bash
   docker-compose --profile dev down
   ```

## Environment Variables

You can customize the deployment using environment variables:

- `NODE_ENV`: Set to `production` for production builds
- `PORT`: Port number for the application (default: 3000)
- `HOSTNAME`: Hostname for the server (default: 0.0.0.0)

Example with custom environment variables:
```bash
docker run -d \
  --name taskflow \
  -p 8080:8080 \
  -e PORT=8080 \
  -e NODE_ENV=production \
  taskflow-app
```

## Production Deployment Options

### Deploy to Cloud Platforms

#### Deploy to Railway
1. Fork this repository
2. Connect your GitHub account to Railway
3. Deploy directly from the dashboard
4. Railway will automatically detect and use the Dockerfile

#### Deploy to Render
1. Fork this repository
2. Create a new Web Service on Render
3. Connect your GitHub repository
4. Render will automatically build using the Dockerfile

#### Deploy to DigitalOcean App Platform
1. Fork this repository
2. Create a new App on DigitalOcean
3. Connect your GitHub repository
4. Use these settings:
   - Build Command: `npm run build`
   - Run Command: `npm start`

### Deploy to VPS or Dedicated Server

1. **Clone the repository on your server:**
   ```bash
   git clone <your-repo-url>
   cd <repo-name>
   ```

2. **Build and run with Docker Compose:**
   ```bash
   docker-compose up --build -d
   ```

3. **Set up a reverse proxy (recommended):**
   Use Nginx or Traefik to handle SSL and routing

## Docker Image Optimization

The production Dockerfile uses several optimization techniques:

- **Multi-stage build**: Reduces final image size
- **Alpine Linux**: Lightweight base image
- **Non-root user**: Improved security
- **Standalone output**: Minimal runtime dependencies
- **Layer caching**: Faster builds during development

## Troubleshooting

### Common Issues

1. **Port already in use:**
   ```bash
   # Check what's using port 3000
   lsof -i :3000
   
   # Or use a different port
   docker run -p 3001:3000 taskflow-app
   ```

2. **Build fails due to memory constraints:**
   ```bash
   # Increase Docker memory limit or use swap
   docker system prune -f
   ```

3. **Slow builds:**
   ```bash
   # Clean Docker cache
   docker builder prune -f
   ```

### Logs and Debugging

- **View application logs:**
  ```bash
  docker-compose logs -f taskflow-app
  ```

- **Access container shell:**
  ```bash
  docker exec -it taskflow-app sh
  ```

- **Check container status:**
  ```bash
  docker-compose ps
  ```

## Security Considerations

- The application runs as a non-root user (`nextjs`)
- Uses minimal Alpine Linux base image
- No sensitive data is baked into the image
- Consider using Docker secrets for production credentials

## Performance Tips

- Use Docker BuildKit for faster builds:
  ```bash
  DOCKER_BUILDKIT=1 docker build -t taskflow-app .
  ```

- Enable Docker layer caching in CI/CD pipelines
- Use `.dockerignore` to exclude unnecessary files
- Consider using multi-architecture builds for ARM64 support

For more information about the application itself, see the main [README.md](./README.md).