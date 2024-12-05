import { createClient } from "redis";
import * as myDb from "../db/myMongoDB.js";

const redisClient = createClient();

async function connect() {
  redisClient.on("error", (err) => {
    console.log("Error " + err);
  });

  await redisClient.connect();

  redisClient.on("connect", () => {
    console.log("Connected to Redis");
  });
}

async function clearCache() {
  try {
    console.log("Clearing all keys from Redis...");
    await redisClient.flushAll();
    console.log("Redis cache cleared.");
  } catch (error) {
    console.error("Error clearing Redis cache:", error);
    throw error;
  }
}

async function loadCache() {
  try {
    // Fetch all universities and clubs from MongoDB
    const universities = await myDb.getUniversities("", 1, 9); // Adjust pageSize as needed
    const clubs = await myDb.getClubs("", 1, 9); // Adjust query and pageSize as needed

    console.log(`Found ${universities.length} universities.`);
    console.log(`Found ${clubs.length} clubs.`);

    // Populate universities in Redis
    for (const university of universities) {
      const universityKey = `university:${university.university_id}:${university.university_name}`;
      const clubsListKey = `university:${university.university_id}:${university.university_name}:clubs`;

      // Add university details
      await redisClient.hSet(universityKey, {
        university_id: university.university_id,
        name: university.university_name,
        email_domain: university.university_email_domain,
        address: university.university_address,
        city: university.university_city,
        state: university.university_state,
        zip_code: university.university_zip_code,
        website: university.university_website,
      });

      console.log(`Added university ${university.university_name} to Redis.`);

      // Add associated clubs to Redis list, if `university_clubs` exists
      if (
        Array.isArray(university.university_clubs) &&
        university.university_clubs.length > 0
      ) {
        await redisClient.del(clubsListKey); // Clear any existing list for the university

        for (const clubId of university.university_clubs) {
          const club = clubs.find((c) => c.club_id === clubId);
          if (club) {
            await redisClient.rPush(clubsListKey, club.club_name);
            console.log(
              `Added club ${club.club_name} to list for university ${university.university_name}.`
            );
          } else {
            console.log(
              `Club ID ${clubId} for university ${university.university_name} not found in clubs.`
            );
          }
        }
      } else {
        console.log(
          `University ${university.university_name} has no associated clubs.`
        );
      }
    }

    // Populate clubs in Redis
    for (const club of clubs) {
      const clubKey = `club:${club.club_id}:${club.club_name}`;
      const university = universities.find(
        (u) =>
          Array.isArray(u.university_clubs) &&
          u.university_clubs.includes(club.club_id)
      );

      // Add club details
      await redisClient.hSet(clubKey, {
        club_id: club.club_id,
        club_name: club.club_name,
        description: club.club_description,
        university_name: university?.university_name || "Unknown",
        club_email: club.club_email,
        start_date: club.club_start_date,
        club_logo: club.club_logo || "N/A",
      });

      console.log(`Added club ${club.club_name} to Redis.`);
    }

    console.log("Cache initialization completed.");
  } catch (error) {
    console.error("Error loading data into Redis cache:", error);
    throw error;
  }
}

async function main() {
  try {
    await connect();
    console.log("Initializing Redis cache...");
    await clearCache();
    await loadCache();
  } catch (error) {
    console.error("Error in executing main in myRedisCache:", error);
    throw error;
  } finally {
    if (redisClient.isOpen) {
      await redisClient.quit();
      console.log("Redis client disconnected.");
    }
  }
}

main();
