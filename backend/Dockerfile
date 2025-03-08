# Use Node 22.14.0 on Alpine Linux as a parent image
FROM node:22.14.0-alpine

# Set working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the source code
COPY . .

# Generate Prisma client
RUN npx prisma generate

# Build the NestJS application (adjust command if needed)
RUN npm run build

# Expose the port your app runs on (adjust if your app uses a different port)
EXPOSE 3001

# Run the application
CMD ["npm", "run", "start"]
