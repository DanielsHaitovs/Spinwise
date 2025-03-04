# Project
Docker, Nestjs, Postgress powered by Prisma

# Step By Step

1. Create .env file
  .env file content:

  DB_USER=""
  DB_PASSWORD=""
  DB_HOST=""
  DB_PORT=""
  DB_NAME=""
  DATABASE_URL="postgresql://$DB_USER:$DB_PASSWORD@$DB_HOST:$DB_PORT/$DB_NAME?schema=SCHEMA"

  API_PORT=

2. Prepare Nestjs and Database
  2-1. npm install
  <!-- 2-2. npx prisma init -->

  # Docker
    # To start the project
      docker-compose build OR docker-composer up --build
    # To Terminate 
      docker-compose down
      !!! in case of db setup change don't forget to remove db-data volume

  # Prisma 
    Once DB is up and ready to accept the connections
      2-3. OPTIONAL because is done during build - docker exec -it nestjs-prisma-app npx prisma generate # generates the Prisma Client based on your Prisma schema
      2-4. docker exec -it nestjs-prisma-app npx prisma migrate deploy # will run migrations
  
    List migrations
      docker exec -it nestjs-prisma-app npx prisma migrate status
  
  # Import User Sample data
    docker exec -it nestjs-prisma-app npm run seed