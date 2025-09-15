# Asset Tracker - DigitalOcean Deployment Guide

This guide covers deploying the Asset Tracker application to DigitalOcean using Docker and GitHub Actions.

## Prerequisites

1. **DigitalOcean Account** with Container Registry enabled
2. **GitHub Repository** with the Asset Tracker code
3. **Remote MySQL Database** (shared/hosted)
4. **DigitalOcean Droplet** (Ubuntu 20.04+ recommended)

## Setup Steps

### 1. DigitalOcean Container Registry Setup

1. **Create Container Registry**:
   ```bash
   # Install doctl CLI
   snap install doctl
   
   # Login to DigitalOcean
   doctl auth init
   
   # Create container registry
   doctl registry create asset-tracker-registry --region nyc1
   ```

2. **Get Registry Credentials**:
   ```bash
   doctl registry login
   ```

### 2. GitHub Secrets Configuration

Add the following secrets to your GitHub repository (`Settings > Secrets and variables > Actions`):

- `DIGITALOCEAN_ACCESS_TOKEN`: Your DigitalOcean API token
- `DIGITALOCEAN_REGISTRY_NAME`: Your registry name (e.g., `asset-tracker-registry`)

### 3. Environment Variables

Create a `.env` file on your DigitalOcean Droplet:

```bash
# DigitalOcean Registry
DIGITALOCEAN_REGISTRY_NAME=asset-tracker-registry
DIGITALOCEAN_ACCESS_TOKEN=your_do_token_here

# Database (replace with your remote MySQL details)
DATABASE_URL=mysql://username:password@your-mysql-host:3306/database_name
```

### 4. Droplet Setup

1. **Install Docker and Docker Compose**:
   ```bash
   # Update system
   sudo apt update && sudo apt upgrade -y
   
   # Install Docker
   curl -fsSL https://get.docker.com -o get-docker.sh
   sudo sh get-docker.sh
   sudo usermod -aG docker $USER
   
   # Install Docker Compose
   sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
   sudo chmod +x /usr/local/bin/docker-compose
   ```

2. **Clone Repository**:
   ```bash
   git clone https://github.com/yourusername/asset-tracker.git
   cd asset-tracker
   ```

3. **Create Environment File**:
   ```bash
   cp .env.example .env
   # Edit .env with your actual values
   ```

## Deployment Process

### Automatic Deployment (Recommended)

1. **Push to Main Branch**: The GitHub Actions workflow will automatically build and push images when you push to the `main` branch.

2. **Deploy on Droplet**:
   ```bash
   # Run the deployment script
   ./deploy.sh
   ```

### Manual Deployment

1. **Build Images Locally**:
   ```bash
   # Build backend
   docker build -t registry.digitalocean.com/your-registry/asset-tracker-backend:latest ./api
   
   # Build frontend
   docker build -t registry.digitalocean.com/your-registry/asset-tracker-frontend:latest .
   ```

2. **Push to Registry**:
   ```bash
   docker push registry.digitalocean.com/your-registry/asset-tracker-backend:latest
   docker push registry.digitalocean.com/your-registry/asset-tracker-frontend:latest
   ```

3. **Deploy on Droplet**:
   ```bash
   docker-compose -f docker-compose.prod.yml up -d
   ```

## Monitoring and Maintenance

### Health Checks

```bash
# Check container status
docker-compose -f docker-compose.prod.yml ps

# View logs
docker-compose -f docker-compose.prod.yml logs -f

# Check backend health
curl http://localhost:3001/api/health

# Check frontend
curl http://localhost
```

### Updates

To update the application:

1. **Code Changes**: Push changes to the `main` branch
2. **Automatic Build**: GitHub Actions will build and push new images
3. **Deploy**: Run `./deploy.sh` on your droplet

### Database Migrations

Database migrations run automatically when the backend container starts. If you need to run them manually:

```bash
# Access backend container
docker exec -it asset-tracker-backend sh

# Run migrations
npx prisma migrate deploy

# Seed data
node scripts/seed-config.js
```

## Troubleshooting

### Common Issues

1. **Registry Authentication**:
   ```bash
   doctl registry login
   ```

2. **Database Connection Issues**:
   - Verify `DATABASE_URL` is correct
   - Check firewall settings
   - Ensure MySQL user has remote access

3. **Container Startup Issues**:
   ```bash
   # Check logs
   docker-compose -f docker-compose.prod.yml logs backend
   docker-compose -f docker-compose.prod.yml logs frontend
   ```

4. **Port Conflicts**:
   - Ensure ports 80 and 3001 are available
   - Check for existing services using these ports

### Performance Optimization

1. **Resource Limits**: Add resource limits to docker-compose.prod.yml:
   ```yaml
   services:
     backend:
       deploy:
         resources:
           limits:
             memory: 512M
             cpus: '0.5'
   ```

2. **Nginx Caching**: The frontend already includes gzip compression and caching headers.

## Security Considerations

1. **Firewall**: Configure UFW to only allow necessary ports:
   ```bash
   sudo ufw allow 22    # SSH
   sudo ufw allow 80    # HTTP
   sudo ufw allow 443   # HTTPS (if using SSL)
   sudo ufw enable
   ```

2. **SSL/TLS**: Consider using Let's Encrypt with Certbot for HTTPS:
   ```bash
   sudo apt install certbot python3-certbot-nginx
   sudo certbot --nginx -d yourdomain.com
   ```

3. **Environment Variables**: Never commit sensitive data to version control.

## Backup Strategy

1. **Database**: Set up regular backups of your remote MySQL database
2. **Application Data**: The application is stateless, but consider backing up configuration files
3. **Container Images**: Images are stored in DigitalOcean Container Registry

## Cost Optimization

1. **Droplet Size**: Start with a smaller droplet and scale as needed
2. **Container Registry**: Monitor storage usage and clean up old images
3. **Database**: Use managed database services for better performance and reliability
