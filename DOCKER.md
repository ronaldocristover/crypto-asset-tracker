# Asset Tracker - Docker Setup

This project includes Docker configurations for easy deployment and development.

## Quick Start

### Prerequisites
- Docker
- Docker Compose

### Running the Application

1. **Clone the repository and navigate to the project directory**
   ```bash
   cd asset-tracker
   ```

2. **Start all services with Docker Compose**
   ```bash
   docker-compose up -d
   ```

3. **Access the application**
   - Frontend: http://localhost
   - Backend API: http://localhost:3001
   - MySQL Database: localhost:3306

### Services

- **Frontend**: Vue.js application served by Nginx
- **Backend**: Node.js API server with Express
- **Database**: MySQL 8.0 with persistent storage

### Environment Variables

The following environment variables are configured in docker-compose.yml:

- `MYSQL_ROOT_PASSWORD`: rootpassword
- `MYSQL_DATABASE`: asset_tracker
- `MYSQL_USER`: app_user
- `MYSQL_PASSWORD`: app_password
- `DATABASE_URL`: mysql://app_user:app_password@mysql:3306/asset_tracker

### Database

The MySQL database will be automatically initialized with:
- Database schema from Prisma migrations
- Initial configuration data (currency rates)

### Development

For development, you can run individual services:

```bash
# Build and run only the backend
docker-compose up backend mysql

# Build and run only the frontend
docker-compose up frontend
```

### Useful Commands

```bash
# View logs
docker-compose logs -f

# Stop all services
docker-compose down

# Stop and remove volumes (WARNING: This will delete all data)
docker-compose down -v

# Rebuild services
docker-compose up --build

# Access MySQL database
docker-compose exec mysql mysql -u app_user -p asset_tracker
```

### Troubleshooting

1. **Port conflicts**: Make sure ports 80, 3001, and 3306 are not in use
2. **Database connection issues**: Wait for MySQL to fully start (check logs)
3. **Build failures**: Try `docker-compose up --build --force-recreate`

### Production Considerations

For production deployment, consider:
- Changing default passwords
- Using environment files for sensitive data
- Setting up SSL/TLS certificates
- Configuring proper backup strategies
- Using external database services
