# ClubConnect

**ClubConnect** is a web-based system designed to streamline the operations and activities of student-run clubs on a university campus. It allows students to register new clubs, manage their memberships efficiently, and coordinate events. The platform supports the management of roles, responsibilities, permissions, and scheduling interviews for onboarding new members into clubs.

With **ClubConnect**, club leaders can:

- Schedule and manage events.
- Assign and manage roles within a club (Leader, Core, or Regular).
- Schedule interviews for onboarding new members.
- Track membership status, events, and interviews with ease.

### Features

- **Club Registration**: Students can register new clubs and manage them.
- **Role Management**: Assign and manage roles within a club (Leader, Core, or Regular).
- **Event Management**: Schedule events, and manage event details.
- **Interview Scheduling**: Schedule interviews for onboarding new members, and track results.
- **Membership Management**: Track the status and roles of members across different clubs.

### Database Design

The system uses **MongoDB** with collections for universities, clubs, students, and events. The design ensures efficient management of data, allowing for the following:

- **University Collection**: Stores university details and references clubs associated with each university.
- **Club Collection**: Stores club information, including events and members, with embedded documents for related data.
- **Student Collection**: Tracks student details, roles, and interviews for onboarding into clubs.

This design is flexible and scalable, supporting seamless growth of the application. For more details, refer to the [Database Design Documentation](./docs/ClubConnect_DatabaseDesign - Mongo.pdf).

### Functional Rules and Constraints

1. Each club must have at least **2 leaders**.
2. Students can join multiple clubs but can only hold **leader roles in a maximum of two clubs**.
3. Clubs must have events scheduled with details like date, time, and location.
4. Interviews can be scheduled for onboarding members, with the status tracked.

---

### Mongo Queries

Below is a breakdown of the Mongo queries provided, their purpose, and examples of their outputs.

Here's the README summary for each query:

## Query 1: Clubs Count by Category

This query counts the number of clubs for each category, sorts the results by the club count in descending order, and prints the result.

**Expected Output:**

```bash
Clubs count by category: [
  { _id: 'Arts', clubCount: 2 },
  { _id: 'Technology', clubCount: 2 },
  { _id: 'Business', clubCount: 1 },
  { _id: 'Engineering', clubCount: 1 }
]
```

## Query 2: CS Students from 2021 with Scheduled/Pending Interviews

This query finds Computer Science students enrolled in 2021 who have interviews with "Scheduled" or "Pending" status.

**Expected Output:**

```bash
CS students from 2021 with scheduled/pending interviews: [
  {
    "_id": "673070b1fee039a1eb55db04",
    "student_id": 1,
    "student_first_name": "Alice",
    "student_last_name": "Johnson",
    "student_email": "alice.j@northeastern.edu",
    "student_program": "Computer Science",
    "student_graduation_date": "2024-05-01",
    "student_enrollment_year": 2021,
    "student_dob": "2002-03-10",
    "student_uni_id": 1,
    "interviews": [
      {
        "interview_id": 2,
        "interview_date_time": "2023-12-01T09:00",
        "interview_role": "Treasurer",
        "interview_platform": "Google Meet",
        "interview_status": "Scheduled"
      }
    ]
  }
]
```

## Query 3: Number of Clubs at Northeastern University

This query retrieves the number of clubs associated with Northeastern University.

**Expected Output:**

```bash
Number of clubs at Northeastern University: 2
```

## Query 4: Update Event Status

This query updates the status of an event with a specific `event_id` to "Completed".

**Expected Output:**

```bash
Matched and modified: 1 1
```

## Query 5: Students Enrolled in Computer Science

This query retrieves all students enrolled in the Computer Science program, projecting key student details.

**Expected Output:**

```bash
Students enrolled in Computer Science: [
  {
    "_id": "673070b1fee039a1eb55db09",
    "student_id": 6,
    "student_first_name": "Fiona",
    "student_last_name": "Green",
    "student_email": "fiona.g@washington.edu",
    "student_program": "Computer Science",
    "student_graduation_date": "2023-12-01",
    "student_enrollment_year": 2019
  },
  {
    "_id": "673070b1fee039a1eb55db04",
    "student_id": 1,
    "student_first_name": "Alice",
    "student_last_name": "Johnson",
    "student_email": "alice.j@northeastern.edu",
    "student_program": "Computer Science",
    "student_graduation_date": "2024-05-01",
    "student_enrollment_year": 2021
  }
]
```

### Setup Instructions

1. **Clone the repository**:

   ```bash
   git clone https://github.com/DiyaWadhwani/ClubConnect.git
   git checkout p2-mongo
   ```

2. **Import the DB**:

   ```bash
   mongoimport --uri "mongodb://localhost:27017" --db clubConnect --collection club --file db/initialization/clubConnect.club.json --jsonArray
   mongoimport --uri "mongodb://localhost:27017" --db clubConnect --collection university --file db/initialization/clubConnect.university.json --jsonArray
   mongoimport --uri "mongodb://localhost:27017" --db clubConnect --collection student --file db/initialization/clubConnect.student.json --jsonArray
   ```

3. **Execute the queries**:
   ```bash
   cd db/dmlQueries
   node Query1.js //change the filename to run the query you wish
   ```

---

### Documentation

- **[Database Design Documentation](./docs/ClubConnect_DatabaseDesign - Mongo.pdf)**
- **[Requirements Specification](./docs/ClubConnect_Requirements.pdf)**
- **[Class UML Diagram](./diagrams/ClubConnect_UML.png)**
- **[ERD Diagram](./diagrams/ClubConnect_ERD.png)**
