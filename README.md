# ClubConnect - Student Club Management System

**ClubConnect** is a web-based system designed to streamline the operations and activities of student-run clubs on a university campus. It enables students to register new clubs, manage memberships efficiently, and coordinate events. Club leaders can manage roles, permissions, and even schedule interviews for onboarding new members.

## Features

- Create and manage student clubs by University.
- Manage University data and related club data.
- Integrated Redis caching for enhanced performance.

## Project Structure

- `app.js` - Entry point for the Node.js application.
- `db/initialization/` - Contains JSON files for initializing the MongoDB database.
- `db/myMongoDB.js` - Handles CRUD operations with Mongo.
- `db/myRedisCache.js` - Acts as middleware between the frontend webpage and backend MongoDB.
- `routes/index.js` - Defined routes and handling functionality at each API endpoint.

## Prerequisites

1. **Node.js**: Install Node.js from [https://nodejs.org/](https://nodejs.org/).
2. **HomeBrew**: Install MongoDB and Redis from Homebrew
   Install Homebrew (if not already installed):

   ```bash
   /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
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

3. **Install and Run Mongo**: Install and Start MongoDB service via HomeBrew

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

5. **Install and Run Redis**: Install and Start Redis server via HomeBrew

   ```bash
   brew install redis
   brew services start redis
   ```

6. **Start the Application**: Run the application with the following command:

   ```bash
   npm start
   ```

   The server will start on `http://localhost:3000`.

7. **Login Details**: Login using either user:

   Role: Core Member

   `Email: diya.wadhwani@northeastern.edu`

   `Password: DiyaTest@123`

   Role: Regular Member

   `Email: joy.h@northeastern.edu`

   `Password: HarisTest@123`

8. **Stop Services Later**: Stop Mongo and Redis

   ```bash
   brew services stop mongodb-community
   brew services stop redis
   ```

## Video Demo

**[Club Connect Video Demo](https://youtu.be/fazz_tVTDrU)**

## License

This project is licensed under the MIT License.
