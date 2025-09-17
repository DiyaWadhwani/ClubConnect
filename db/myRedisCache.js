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

async function loadCache() {
  try {
    // Clear existing Redis data
    await redisClient.flushAll();
    console.log("Cleared existing Redis cache.");
    console.log("Loading data into Redis cache...");

    // Fetch all universities and clubs from MongoDB
    const universities = await myDb.getUniversities("", 1, 100);
    const clubs = await myDb.getClubs("", 1, 100);

    console.log(`Found ${universities.length} universities from MongoDB.`);
    console.log(`Found ${clubs.length} clubs from MongoDB.`);

    await redisClient.set("universityCount", "0");
    await redisClient.set("clubCount", "0");

    // Populate universities in Redis
    for (const university of universities) {
      await redisClient.incr("universityCount");
      const universityKey = `university:${university.university_id}`;
      const clubsListKey = `university:${university.university_id}:clubs`;

      // Add university details
      await redisClient.hSet(universityKey, {
        university_id: String(university.university_id),
        name: university.university_name || "Unknown",
        email_domain: university.university_email_domain || "N/A",
        address: university.university_address || "N/A",
        city: university.university_city || "N/A",
        state: university.university_state || "N/A",
        zip_code: university.university_zip_code || "N/A",
        website: university.university_website || "N/A",
      });

      // Add associated clubs to Redis list
      await redisClient.del(clubsListKey); // Ensure no leftover data
      if (Array.isArray(university.university_clubs)) {
        for (const clubId of university.university_clubs) {
          const club = clubs.find((c) => c.club_id === clubId);
          if (club) {
            await redisClient.rPush(clubsListKey, String(club.club_id));
          } else {
            console.warn(
              `Club ID ${clubId} for university ${university.university_name} not found in clubs.`
            );
          }
        }
      } else {
        continue;
      }
    }

    // Populate clubs in Redis
    for (const club of clubs) {
      await redisClient.incr("clubCount");
      const clubKey = `club:${club.club_id}`;

      await redisClient.hSet(clubKey, {
        club_id: String(club.club_id),
        name: club.club_name || "Unknown",
        description: club.club_description || "N/A",
        email: club.club_email || "N/A",
        start_date: club.club_start_date || "N/A",
        category: club.club_category || "N/A",
        logo: club.club_logo || "N/A",
        members: Array.isArray(club.members)
          ? JSON.stringify(club.members)
          : "[]",
      });
    }

    // Set additional metadata
    redisClient.set("last_updated", new Date().toISOString());

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
    console.log("Fetched university by ID from Redis.");
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
    console.log("Fetched club details by ID from Redis.");
    return { clubDetails, university };
  } catch (error) {
    console.error("Error fetching club details from Redis:", error);
    throw error;
  }
}

// FUNCTIONS TO UPDATE REDIS CACHE AND MONGODB

export async function createClub(club) {
  try {
    const createdClub = await myDb.createClub(club);
    await loadCache();
    console.log(
      "Inserted club into MongoDB and updated Redis cache.",
      createdClub
    );
    return createdClub;
  } catch (error) {
    console.error("Error in createClub:", error);
    throw error;
  }
}

export async function updateClubByID(club_id, club) {
  try {
    console.log("club_id type", typeof club_id);
    const updatedClub = await myDb.updateClubByID(club_id, club);

    const clubKey = `club:${club_id}`;
    await redisClient.hSet(clubKey, {
      club_id: String(club_id),
      name: club.name || "Unknown",
      description: club.description || "N/A",
      email: club.email || "N/A",
      start_date: club.start_date || "N/A",
      category: club.category || "N/A",
      logo: club.logo || "N/A",
    });
    await redisClient.set("last_updated", new Date().toISOString());
    console.log(
      "Updated club in MongoDB and Redis cache. Updated last_updated."
    );

    return updatedClub;
  } catch (error) {
    console.error("Error in updateClub:", error);
    throw error;
  }
}

export async function updateUniversityByID(university_id, university) {
  try {
    const updatedUniversity = await myDb.updateUniversityByID(
      university_id,
      university
    );

    const universityKey = `university:${university_id}`;
    await redisClient.hSet(universityKey, {
      university_id: String(university_id),
      name: university.name || "Unknown",
      email_domain: university.email_domain || "N/A",
      address: university.address || "N/A",
      city: university.city || "N/A",
      state: university.state || "N/A",
      zip_code: university.zip_code || "N/A",
      website: university.website || "N/A",
    });
    await redisClient.set("last_updated", new Date().toISOString());
    console.log(
      "Updated university in MongoDB and Redis cache. Updated last_updated."
    );
    return updatedUniversity;
  } catch (error) {
    console.error("Error in updateUniversity:", error);
    throw error;
  }
}

export async function deleteClubByID(club_id) {
  try {
    console.log("Deleting club", club_id);
    const deletedClub = await myDb.deleteClubByID(club_id);
    const clubKey = `club:${club_id}`;
    await redisClient.del(clubKey);
    await redisClient.decr("clubCount");
    await redisClient.set("last_updated", new Date().toISOString());
    console.log(
      "Deleted club from MongoDB and updated Redis cache. Updated last_updated."
    );
    return deletedClub;
  } catch (error) {
    console.error("Error in deleteClubByID:", error);
    throw error;
  }
}

export async function deleteUniversityByID(university_id) {
  try {
    console.log("Deleting university", university_id);
    const deletedUniversity = await myDb.deleteUniversityByID(university_id);
    const universityKey = `university:${university_id}`;
    await redisClient.del(universityKey);
    await redisClient.decr("universityCount");

    //fetch the key with university:*:clubs and delete them
    const clubsKey = `${universityKey}:clubs`;
    const clubIds = await redisClient.lRange(clubsKey, 0, -1);
    console.log("University has clubs", clubIds);
    for (const clubId of clubIds) {
      await deleteClubByID(clubId);
    }
    await redisClient.del(clubsKey);

    await redisClient.set("last_updated", new Date().toISOString());
    console.log(
      "Deleted university from MongoDB and updated Redis cache. Updated last_updated."
    );
    return deletedUniversity;
  } catch (error) {
    console.error("Error in deleteUniversityByID:", error);
    throw error;
  }
}

export async function checkIfCoreMember(student_id, clubs) {
  try {
    for (const club of clubs) {
      if (typeof club.members === "string") {
        try {
          club.members = JSON.parse(club.members);
        } catch (e) {
          console.warn("Failed to parse club.members for club:", club.club_id);
          club.members = [];
        }
      }

      if (Array.isArray(club.members)) {
        const member = club.members.find(
          (m) => m.member_id === parseInt(student_id)
        );
        if (member && member.member_type === "Core") {
          return true;
        }
      }
    }
    return false;
  } catch (error) {
    console.error("Error in checkIfCoreMember:", error);
    throw error;
  }
}

// MAIN FUNCTION TO INITIALIZE CACHE
async function main() {
  try {
    await connect();
    await loadCache();
  } catch (error) {
    console.error("Error in executing main in myRedisCache:", error);
    throw error;
  }
}

main();
