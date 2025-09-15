#!/bin/sh

# Run database migrations
echo "Running database migrations..."
npx prisma migrate deploy

# Seed the database if needed
echo "Seeding database..."
node scripts/seed-config.js

# Start the application
echo "Starting the application..."
npm start
