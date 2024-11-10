import { MongoClient } from "mongodb";

const uri = "mongodb://localhost:27017";
const client = new MongoClient(uri);

async function main() {
  try {
    await client.connect();
    const database = client.db("clubConnect");
    const students = database.collection("student");

    const result = await students
      .find({
        $and: [
          { student_program: "Computer Science" },
          { student_enrollment_year: 2021 },
          {
            interviews: {
              $elemMatch: {
                interview_status: { $in: ["Scheduled", "Pending"] },
              },
            },
          },
        ],
      })
      .toArray();
    console.log(
      "CS students from 2021 with scheduled/pending interviews:",
      JSON.stringify(result, null, 2)
    );
  } finally {
    await client.close();
  }
}

main().catch(console.error);
