# Project
Docker, Nestjs, Postgress powered by Prisma

# Step By Step

1. Create .env file
  # .env file content:
    API_PORT=
    DB_USER=""
    DB_PASSWORD=""
    DB_HOST=""
    DB_PORT=""
    DB_NAME=""
    DATABASE_URL="postgresql://$DB_USER:$DB_PASSWORD@$DB_HOST:$DB_PORT/$DB_NAME?schema=SCHEMA"


# Prepare Nestjs and Database

    # Node
       2-1. npm install
  
    # Docker
        # To start the project
          2-2. docker-compose build OR docker-composer up --build
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
