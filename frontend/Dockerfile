# Use Node 22.14.0 on Alpine Linux as a parent image
FROM node:22.14.0-alpine

# Set working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json or yarn files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the source code
COPY . .

# Build the Next.js app
RUN npm run build

# Expose the port Next.js will run on
EXPOSE 3001

# Start the Next.js server
CMD ["npm", "start"]
