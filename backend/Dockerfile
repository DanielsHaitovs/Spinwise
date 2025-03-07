# Step 1: Use a Node official image
FROM node:22.14.0

# Step 2: Set working directory
WORKDIR /usr/src/app

# Step 3: Copy package.json and package-lock.json
COPY package*.json ./

# Step 4: Install dependencies
RUN npm install

# Step 5: Copy the rest of the application
COPY . .

# Step 6: Generate Prisma client
RUN npx prisma generate

# Step 7: Build Nest project
RUN npm run build

# Step 8: Expose port
EXPOSE 3000

# Step 9: Run command
CMD ["npm", "run", "start:dev"]
