import { MongoClient, ObjectId } from "mongodb";

async function getDb() {
  const client = new MongoClient("mongodb://localhost:27017");
  await client.connect();
  return client.db("clubConnect");
}

export async function getUniversities(query, page, pageSize) {
  console.log("getUniversities", query);
  const db = await getDb();
  try {
    const result = await db
      .collection("university")
      .find()
      .project({
        name: "$university_name",
        website: "$university_website",
        address: "$university_address",
        city: "$university_city",
        state: "$university_state",
        zipCode: "$university_zip_code",
        universityID: "$university_id",
      })
      .sort({ university_name: 1 })
      .skip((page - 1) * pageSize)
      .limit(pageSize)
      .toArray();

    return result;
  } catch (error) {
    console.error("Error in getUniversityCount:", error);
    throw error;
  }
}

export async function getUniversityCount(query) {
  try {
    console.log("getUniversityCount query:", query);
    const db = await getDb();
    const regexQuery = query ? `^${query}` : "";

    const count = await db
      .collection("universities")
      .countDocuments({ name: { $regex: regexQuery, $options: "i" } });

    console.log("Document count:", count);
    return count;
  } catch (error) {
    console.error("Error in getUniversityCount:", error);
    throw error;
  }
}

export async function getClubs(query, page, pageSize) {
  console.log("getClubs", query);
  const db = await getDb();

  return await db
    .collection("club")
    .find({ club_name: { $regex: `^${query}`, $options: "i" } })
    .project({
      clubID: "$club_id",
      clubName: "$club_name",
      startDate: "$club_start_date",
      description: "$club_description",
      universityName: "$university.name",
    })
    .toArray();
}

export async function getClubCount(query) {
  console.log("getClubCount", query);
  const db = await getDb();

  return await db
    .collection("club")
    .countDocuments({ club_name: { $regex: `^${query}`, $options: "i" } });
}

export async function getUniversityByID(university_id) {
  console.log("getUniversityByID", university_id);
  const db = await getDb();
  try {
    const university = await db
      .collection("university")
      .find({ university_id: university_id })
      .project({
        _id: 0,
        university_id: "$university_id",
        name: "$university_name",
        emailDomain: "$university_email_domain",
        website: "$university_website",
        address: "$university_address",
        city: "$university_city",
        state: "$university_state",
        zipCode: "$university_zip_code",
      })
      .toArray();

    console.log("universityDetails", university);
    return university;
  } catch (error) {
    console.error("Error in getUniversityByID:", error);
    throw error;
  }
}

export async function updateUniversityByID(university_id, university) {
  console.log("updateUniversityByID", university_id, university);
  const db = await getDb();
  try {
    const updatedUniversity = await db.collection("university").updateOne(
      { university_id: university_id },
      {
        $set: {
          university_email_domain: university.emailDomain,
          university_website: university.website,
          university_address: university.address,
          university_city: university.city,
          university_state: university.state,
          university_zip_code: university.zipCode,
        },
      }
    );
    return updatedUniversity;
  } catch (error) {
    console.error("Error in updateUniversityByID:", error);
    throw error;
  }
}

export async function deleteUniversityByID(university_id) {
  console.log("deleteUniversityByID", university_id);
  const db = await getDb();
  const universityToDelete = await db
    .collection("university")
    .find({ university_id: university_id })
    .project({
      _id: 0,
      university_id: "$university_id",
      university_clubs: "$university_clubs",
    })
    .toArray();
  console.log("universityToDelete", universityToDelete[0]);
  const deletedUniversity = await db
    .collection("university")
    .deleteOne({ university_id: university_id });
  const clubsToDelete = universityToDelete[0].university_clubs;
  const deletedClubsByUni = await db
    .collection("club")
    .deleteMany({ club_id: { $in: clubsToDelete } });
  console.log("deletedClubsByUni", deletedClubsByUni);

  return deletedUniversity;
}

export async function createClub(club) {
  console.log("createClub", club);
  const db = await getDb();

  try {
    const clubCount = await db.collection("club").countDocuments();
    const club_id = clubCount + 1;

    console.log("clubCount", clubCount);
    console.log("clubID", club_id);

    const createdClub = await db.collection("club").insertOne({
      club_id: club_id,
      club_name: club.name,
      club_description: club.description,
      club_start_date: club.startDate,
      club_email: club.email,
      club_logo: club.logo || null,
      club_category: club.clubCategory,
      events: club.events || [],
      members: club.members || [],
    });

    console.log("university_id", club.university_id);

    const updateResult = await db.collection("university").updateOne(
      { university_id: club.university_id }, // Match the university
      { $addToSet: { university_clubs: club_id } } // Add the club ID to the array
    );
  } catch (error) {
    console.error("Error in createClub:", error);
    throw error;
  }
}

export async function getClubsByUniversityID(universityID) {
  console.log("getClubsByUniversityID", universityID);
  const db = await getDb();

  try {
    const university = await db
      .collection("university")
      .findOne({ university_id: universityID });

    if (!university || !university.university_clubs) {
      console.log(
        "No university or university_clubs found for university_id:",
        universityID
      );
      return [];
    }
    const clubIds = university.university_clubs;

    const clubs = await db
      .collection("club")
      .find({ club_id: { $in: clubIds } })
      .project({
        clubID: "$club_id",
        name: "$club_name",
      })
      .toArray();

    console.log("clubs", clubs);
    return clubs;
  } catch (err) {
    console.error("Error in getClubsByUniversityID:", err);
    throw err;
  }
}

export async function getClubByID(club_id) {
  console.log("getClubByID", club_id);
  const db = await getDb();

  try {
    const club = await db
      .collection("club")
      .find({ club_id: club_id })
      .project({
        _id: 0,
        club_id: "$club_id",
        clubName: "$club_name",
        description: "$club_description",
        startDate: "$club_start_date",
        email: "$club_email",
        logo: "$club_logo",
        clubCategory: "$club_category",
      })
      .toArray();

    console.log("clubDetails", club);
    return club;
  } catch (error) {
    console.error("Error in getClubsByID:", error);
    throw error;
  }
}

export async function getUniversityByClubID(club_id) {
  console.log("getUniversityByClubID", club_id);
  const db = await getDb();

  try {
    const universityName = await db
      .collection("university")
      .find({ university_clubs: club_id })
      .project({
        universityName: "$university_name",
      })
      .toArray();

    console.log("UniversityName", universityName);
    return universityName;
  } catch (error) {
    console.error("Error in getUniversityByClubID:", error);
    throw error;
  }
}

export async function updateClubByID(club_id, club) {
  console.log("updateClubByID", club_id, club);
  const db = await getDb();

  try {
    const updatedClubDetails = await db.collection("club").updateOne(
      { club_id: club_id },
      {
        $set: {
          club_description: club.description,
          club_email: club.email,
          club_logo: club.logo,
          club_category: club.clubCategory,
        },
      }
    );
    console.log("updatedClubDetails", updatedClubDetails);
    return updatedClubDetails;
  } catch (error) {
    console.error("Error in updateClubByID:", error);
    throw error;
  }
}

export async function deleteClubByID(club_id) {
  console.log("deleteClubByID", club_id);
  const db = await getDb();
  try {
    const deletedClub = await db
      .collection("club")
      .deleteOne({ club_id: club_id });

    const removedFromUni = await db
      .collection("university")
      .updateMany({}, { $pull: { university_clubs: club_id } });
    console.log("removedFromUni", removedFromUni);

    return deletedClub;
  } catch (error) {
    console.error("Error in deleteClubByID:", error);
    throw error;
  }
}
