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
        universityID: 1,
      })
      .sort({ name: 1 })
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
    .aggregate([
      { $match: { club_name: { $regex: `^${query}`, $options: "i" } } },
      { $sort: { club_start_date: -1 } },
      { $skip: (page - 1) * pageSize },
      { $limit: pageSize },
      {
        $lookup: {
          from: "university",
          localField: "university_id",
          foreignField: "universityID",
          as: "university",
        },
      },
      { $unwind: "$university" },
      {
        $project: {
          clubID: "$club_id",
          clubName: "$club_name",
          startDate: "$club_start_date",
          description: "$club_description",
          universityName: "$university.name",
        },
      },
    ])
    .toArray();
}

export async function getClubCount(query) {
  console.log("getClubCount", query);
  const db = await getDb();

  return await db
    .collection("club")
    .countDocuments({ club_name: { $regex: `^${query}`, $options: "i" } });
}

export async function getUniversityByID(universityID) {
  console.log("getUniversityByID", universityID);
  const db = await getDb();

  return await db
    .collection("university")
    .findOne({ _id: new ObjectId(universityID) });
}

export async function updateUniversityByID(universityID, university) {
  console.log("updateUniversityByID", universityID, university);
  const db = await getDb();

  return await db
    .collection("university")
    .updateOne({ _id: new ObjectId(universityID) }, { $set: university });
}

export async function deleteUniversityByID(universityID) {
  console.log("deleteUniversityByID", universityID);
  const db = await getDb();

  return await db
    .collection("university")
    .deleteOne({ _id: new ObjectId(universityID) });
}

export async function createClub(club) {
  console.log("createClub", club);
  const db = await getDb();

  return await db.collection("club").insertOne({
    club_id: club.club_id,
    club_name: club.name,
    club_description: club.description,
    club_start_date: club.startDate,
    club_email: club.email,
    club_logo: club.logo || null,
    club_category: club.clubCategory,
    university_id: club.universityID,
    events: club.events || [],
    members: club.members || [],
  });
}

export async function getClubsByUniversityID(universityID) {
  console.log("getClubsByUniversityID", universityID);
  const db = await getDb();

  return await db
    .collection("club")
    .find({ university_id: universityID })
    .toArray();
}

export async function getClubByID(clubID) {
  console.log("getClubByID", clubID);
  const db = await getDb();

  return await db
    .collection("club")
    .aggregate([
      { $match: { _id: new ObjectId(clubID) } },
      {
        $lookup: {
          from: "university",
          localField: "university_id",
          foreignField: "universityID",
          as: "university",
        },
      },
      { $unwind: "$university" },
      {
        $project: {
          clubID: "$club_id",
          clubName: "$club_name",
          description: "$club_description",
          startDate: "$club_start_date",
          email: "$club_email",
          logo: "$club_logo",
          universityName: "$university.name",
        },
      },
    ])
    .toArray();
}

export async function updateClubByID(clubID, club) {
  console.log("updateClubByID", clubID, club);
  const db = await getDb();

  return await db.collection("club").updateOne(
    { _id: new ObjectId(clubID) },
    {
      $set: {
        club_name: club.name,
        club_description: club.description,
        club_start_date: club.startDate,
        club_email: club.email,
        club_logo: club.logo,
        club_category: club.clubCategory,
      },
    }
  );
}

export async function deleteClubByID(clubID) {
  console.log("deleteClubByID", clubID);
  const db = await getDb();

  return await db.collection("club").deleteOne({ _id: new ObjectId(clubID) });
}
