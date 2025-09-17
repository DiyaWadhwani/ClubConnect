# ClubConnect - Student Club Management System

**ClubConnect** is a web-based system designed to streamline the operations and activities of student-run clubs on a university campus. It enables students to register new clubs, manage memberships efficiently, and coordinate events. Club leaders can manage roles, permissions, and even schedule interviews for onboarding new members.

## Features

- Create and manage student clubs by University.
- Manage University data and related club data.
- Integrated Redis caching for enhanced performance.

## Project Structure

- `docs/` - Includes database design documentation, requirements, and diagrams.
- `diagrams/` - Includes UML and Redis ERD Diagrams
- `app.js` - Entry point for the Node.js application.
- `db/initialization/` - Contains JSON files for initializing the MongoDB database.
- `db/myMongoDB.js` - Handles CRUD operations with Mongo.
- `db/myRedis.js` - Acts as middleware between the frontend webpage and backend MongoDB.
- `routes/index.js` - Defined routes and handling functionality at each API endpoint.


## Prerequisites

1. **Node.js**: Install Node.js from [https://nodejs.org/](https://nodejs.org/).
2. **MongoDB**:

   - Pull the MongoDB Docker Image:

   ```bash
   docker pull mongodb/mongodb-community-server:latest
   ```

   - Run the Image as a Container:

   ```bash
   docker run --name mongodb -p 27017:27017 -d mongodb/mongodb-community-server:latest
   ```

3. **Redis**:

   - Pull the Redis Docker Image:

   ```bash
   docker pull redis/redis-stack-server:latest
   ```

   - Run the Redis Stack container

   ```bash
   docker run -d --name redis-stack-server -p 6379:6379 redis/redis-stack-server:latest
   ```


## Setting Up the Project

1. **Clone the Repository**: Clone the repository to your local machine.

   ```bash
   git clone https://github.com/DiyaWadhwani/ClubConnect.git
   cd ClubConnect
   ```

2. **Install Dependencies**: Install all required Node.js modules.

   ```bash
   npm install
   npm install mongodb redis
   ```

3. **Install and Start MongoDB service via HomeBrew**:

   Install Homebrew (if not already installed):
   ```bash
   /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
   ```

   ```bash
   brew tap mongodb/brew
   brew install mongodb-community@7.0
   brew services start mongodb/brew/mongodb-community
   ```

4. **Import Data**: Import the JSON files into the MongoDB database.

   ```bash
   mongoimport --uri "mongodb://localhost:27017" --db clubConnect --collection club --file db/initialization/clubConnect.club.json --jsonArray
   mongoimport --uri "mongodb://localhost:27017" --db clubConnect --collection university --file db/initialization/clubConnect.university.json --jsonArray
   mongoimport --uri "mongodb://localhost:27017" --db clubConnect --collection student --file db/initialization/clubConnect.student.json --jsonArray
   ```

4. **Start the Application**:  
   Run the application with the following command:
   ```bash
   npm start
   ```
   The server will start on `http://localhost:3000`.


## Video Demo

**[Club Connect Video Demo](https://youtu.be/fazz_tVTDrU)**


## Documentation

- **[Database Design Documentation](./docs/ClubConnect_DatabaseDesign-Mongo.pdf)**
- **[Requirements Specification](./docs/ClubConnect_Requirements.pdf)**
- **[Redis Implementation](./docs/ClubConnect_RedisImplementation.pdf)**
- **[Class UML Diagram](./diagrams/ClubConnect_UML.png)**
- **[Redis ERD Diagram](./diagrams/ClubConnect_RedisERD.png)**


## License

This project is licensed under the MIT License.
