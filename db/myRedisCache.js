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
    // Clear existing Redis data
    await redisClient.flushAll();

    // Fetch all universities and clubs from MongoDB
    const universities = await myDb.getUniversities("", 1, 100);
    const clubs = await myDb.getClubs("", 1, 100);

    console.log(`Found ${universities.length} universities.`);
    console.log(`Found ${clubs.length} clubs.`);

    // Populate universities in Redis
    for (const university of universities) {
      const universityKey = `university:${university.university_id}`;
      const clubsListKey = `university:${university.university_id}:clubs`;

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

      // Add associated clubs to Redis list
      await redisClient.del(clubsListKey); // Ensure no leftover data
      if (Array.isArray(university.university_clubs)) {
        for (const clubId of university.university_clubs) {
          const club = clubs.find((c) => c.club_id === clubId);
          if (club) {
            await redisClient.rPush(clubsListKey, String(club.club_id));
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
      const clubKey = `club:${club.club_id}`;
      await redisClient.hSet(clubKey, {
        club_id: club.club_id,
        name: club.club_name,
        description: club.club_description,
        email: club.club_email,
        start_date: club.club_start_date,
        category: club.club_category,
        logo: club.club_logo || "N/A",
      });

      console.log(`Added club ${club.club_name} to Redis.`);
    }

    redisClient.set("last_updated", new Date().toISOString());
    redisClient.set("universityCount", universities.length);
    redisClient.set("clubCount", clubs.length);

    console.log("Cache initialization completed.");
  } catch (error) {
    console.error("Error loading data into Redis cache:", error);
    throw error;
  }
}

// OTHER FUNCTIONS TO FETCH FROM REDIS

export async function getUniversities() {
  try {
    const universityKeys = await redisClient.keys("university:*");
    const universities = [];
    console.log("Fetching universities from Redis...");

    for (const key of universityKeys) {
      // Skip keys for clubs lists
      if (key.includes(":clubs")) continue;

      const universityDetails = await redisClient.hGetAll(key);
      const clubsKey = `${key}:clubs`;
      const clubNames = await redisClient.lRange(clubsKey, 0, -1);

      universities.push({
        ...universityDetails,
        clubs: clubNames,
      });
    }
    const total = universities.length;
    console.log("Fetched universities from Redis.");
    return { universities, total };
  } catch (error) {
    console.error("Error fetching universities from Redis:", error);
    throw error;
  }
}

export async function getClubs() {
  try {
    const clubKeys = await redisClient.keys("club:*");
    const clubs = [];
    console.log("Fetching clubs from Redis...");

    for (const key of clubKeys) {
      const clubDetails = await redisClient.hGetAll(key);
      clubs.push(clubDetails);
    }

    const total = clubs.length;
    console.log("Fetched clubs from Redis.");
    return { clubs, total };
  } catch (error) {
    console.error("Error fetching clubs from Redis:", error);
    throw error;
  }
}

export async function getUniversityByClubID(club_id) {
  try {
    const universityKeys = await redisClient.keys("university:*");
    console.log("Fetching university by club ID from Redis...");

    for (const key of universityKeys) {
      const clubsKey = `${key}:clubs`;
      const clubNames = await redisClient.lRange(clubsKey, 0, -1);
      if (clubNames.includes(club_id)) {
        const universityDetails = await redisClient.hGetAll(key);
        console.log("Fetched university by club ID from Redis.");
        return universityDetails;
      }
    }
    console.log("University not found for club ID in Redis.");
    return null;
  } catch (error) {
    console.error("Error fetching university by club ID from Redis:", error);
    throw error;
  }
}

export async function getUniversityByID(university_id) {
  try {
    const universityKey = `university:${university_id}`;
    const universityDetails = await redisClient.hGetAll(universityKey);
    const clubsKey = `${universityKey}:clubs`;
    const clubIds = await redisClient.lRange(clubsKey, 0, -1);

    const clubDetails = [];
    for (const club_id of clubIds) {
      const { clubDetails: club } = await getClubByID(club_id);
      if (club) {
        clubDetails.push({
          name: club.name,
          club_id: club.club_id,
        });
      }
    }

    return { universityDetails, clubDetails };
  } catch (error) {
    console.error("Error fetching university details from Redis:", error);
    throw error;
  }
}

export async function getClubByID(club_id) {
  try {
    const clubKey = `club:${club_id}`;
    const clubDetails = await redisClient.hGetAll(clubKey);
    const university = await getUniversityByClubID(club_id);
    return { clubDetails, university };
  } catch (error) {
    console.error("Error fetching club details from Redis:", error);
    throw error;
  }
}

// MAIN FUNCTION TO INITIALIZE CACHE
async function main() {
  try {
    await connect();
    console.log("Initializing Redis cache...");
    await clearCache();
    await loadCache();
  } catch (error) {
    console.error("Error in executing main in myRedisCache:", error);
    throw error;
  }
}

main();
