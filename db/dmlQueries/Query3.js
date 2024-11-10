import { MongoClient } from "mongodb";
const uri = "mongodb://localhost:27017";
const client = new MongoClient(uri);

async function main() {
  try {
    const database = client.db("clubConnect");
    const universities = database.collection("university");

    const query = { university_name: "Northeastern University" };
    const university = await universities.findOne(query);
    const clubCount = university ? university.university_clubs.length : 0;

    console.log("Number of clubs at Northeastern University:", clubCount);
  } finally {
    await client.close();
  }
}

main().catch(console.error);
