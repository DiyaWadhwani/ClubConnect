import { MongoClient } from "mongodb";
const uri = "mongodb://localhost:27017";
const client = new MongoClient(uri);

async function main() {
  try {
    const database = client.db("clubConnect");
    const clubs = database.collection("club");

    const aggregation = [
      { $group: { _id: "$club_category", clubCount: { $sum: 1 } } },
      { $sort: { clubCount: -1 } },
    ];

    const result = await clubs.aggregate(aggregation).toArray();
    console.log("Clubs count by category:", result);
  } finally {
    await client.close();
  }
}

main().catch(console.error);
