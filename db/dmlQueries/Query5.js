import { MongoClient } from "mongodb";
const uri = "mongodb://localhost:27017";
const client = new MongoClient(uri);

async function main() {
  try {
    const database = client.db("clubConnect");
    const students = database.collection("student");

    const query = { student_program: "Computer Science" };

    const projection = {
      student_id: 1,
      student_first_name: 1,
      student_last_name: 1,
      student_email: 1,
      student_program: 1,
      student_graduation_date: 1,
      student_enrollment_year: 1,
    };

    const result = await students.find(query).project(projection).toArray();

    console.log(
      "Students enrolled in Computer Science:",
      JSON.stringify(result, null, 2)
    );
  } finally {
    await client.close();
  }
}

main().catch(console.error);
