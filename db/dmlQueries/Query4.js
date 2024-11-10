import { MongoClient } from "mongodb";
const uri = "mongodb://localhost:27017";
const client = new MongoClient(uri);

async function main() {
  try {
    const database = client.db("clubConnect");
    const clubs = database.collection("club");

    const query = { "events.event_id": 1 }; // Update event with ID 1
    const update = {
      $set: {
        "events.$.event_status": "Completed",
      },
    };

    const result = await clubs.updateOne(query, update);
    console.log(
      "Matched and modified:",
      result.matchedCount,
      result.modifiedCount
    );
  } finally {
    await client.close();
  }
}

main().catch(console.error);
